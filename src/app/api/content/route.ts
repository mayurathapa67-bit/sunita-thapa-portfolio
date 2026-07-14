import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

type Content = Record<string, unknown>;

type GitHubFileResponse = {
  sha: string;
  content: string;
};

type GitHubPutBody = {
  message: string;
  content: string;
  branch: string;
  sha?: string;
};

type GitHubErrorResponse = {
  message: string;
};

// GET: Fetch content from GitHub (or local fallback)
export async function GET() {
  try {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';

    if (token && repo) {
      const url = `https://api.github.com/repos/${repo}/contents/content.json?ref=${branch}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        cache: 'no-store',
        next: { revalidate: 0 }
      });

      if (response.ok) {
        const data: GitHubFileResponse = await response.json() as GitHubFileResponse;
        const content: string = Buffer.from(data.content, 'base64').toString('utf-8');
        const parsed = JSON.parse(content) as Content;
        return NextResponse.json(parsed, {
          headers: { 'Cache-Control': 'no-store, max-age=0' }
        });
      }
    }

    const filePath = path.join(process.cwd(), 'content.json');
    if (fs.existsSync(filePath)) {
      const fileContents: string = fs.readFileSync(filePath, 'utf8');
      return NextResponse.json(JSON.parse(fileContents) as Content);
    }

    return NextResponse.json({ error: 'Content not found' }, { status: 404 });
  } catch (error: unknown) {
    console.error('GET /api/content error:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

async function getLatestSha(repo: string, branch: string, token: string): Promise<string | null> {
  const url = `https://api.github.com/repos/${repo}/contents/content.json?ref=${branch}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    const errorData: GitHubErrorResponse = await response.json() as GitHubErrorResponse;
    console.error('❌ Failed to fetch SHA:', errorData);
    throw new Error('Failed to fetch SHA');
  }

  const data: GitHubFileResponse = await response.json() as GitHubFileResponse;
  return data.sha;
}

function isShaError(errorData: GitHubErrorResponse): boolean {
  const msg = errorData?.message?.toLowerCase() || '';
  return msg.includes('sha') || msg.includes('does not match');
}

async function fetchCurrentFile(repo: string, branch: string, token: string): Promise<{ sha: string; content: Content } | null> {
  const url = `https://api.github.com/repos/${repo}/contents/content.json?ref=${branch}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Failed to fetch current file');

  const data: GitHubFileResponse = await response.json() as GitHubFileResponse;
  const content: Content = JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8')) as Content;
  return { sha: data.sha, content };
}

async function putToGitHub(
  repo: string,
  branch: string,
  token: string,
  contentBase64: string,
  sha?: string
): Promise<Response> {
  const url = `https://api.github.com/repos/${repo}/contents/content.json?ref=${branch}`;
  const putBody: GitHubPutBody = {
    message: 'chore: update content.json via admin panel',
    content: contentBase64,
    branch: branch
  };
  if (sha) putBody.sha = sha;

  return await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(putBody)
  });
}

// PUT: Save content to GitHub (and try local, but ignore if read-only)
export async function PUT(request: Request) {
  try {
    const newContent: Content = await request.json() as Content;
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';

    // 1. Try to save locally (will fail on Vercel, which is perfectly fine)
    try {
      const filePath = path.join(process.cwd(), 'content.json');
      fs.writeFileSync(filePath, JSON.stringify(newContent, null, 2), 'utf8');
      console.log('✅ Local content.json updated');
    } catch (localError: unknown) {
      console.warn('⚠️ Local save skipped (read-only filesystem):', localError);
    }

    // 2. Push to GitHub
    if (!token || !repo) {
      console.error('❌ GitHub credentials missing for content update.');
      return NextResponse.json({ error: 'GitHub credentials missing in environment variables' }, { status: 500 });
    }

    const contentBase64: string = Buffer.from(JSON.stringify(newContent, null, 2)).toString('base64');

    // Always fetch fresh SHA before attempting update
    const latestSha = await getLatestSha(repo, branch, token);

    let lastError: GitHubErrorResponse | undefined;

    // Attempt update with retry logic (up to 2 retries on SHA mismatch)
    for (let attempt = 0; attempt < 3; attempt++) {
      const sha = latestSha || undefined;
      const putResponse = await putToGitHub(repo, branch, token, contentBase64, sha);

      if (putResponse.ok) {
        console.log('✅ Content successfully saved to GitHub!');
        return NextResponse.json({ success: true, message: 'Content saved successfully!' });
      }

      lastError = await putResponse.json() as GitHubErrorResponse;
      console.error(`❌ GitHub PUT error (attempt ${attempt + 1}):`, lastError);

      // If SHA error, fetch fresh SHA and retry
      if (isShaError(lastError)) {
        console.log('🔄 SHA mismatch detected. Fetching latest SHA and retrying...');
        const freshSha = await getLatestSha(repo, branch, token);
        if (freshSha) {
          // Merge changes with latest version if not first attempt
          if (attempt > 0) {
            const currentFile = await fetchCurrentFile(repo, branch, token);
            if (currentFile) {
              const mergedContent = { ...currentFile.content, ...newContent };
              const mergedBase64 = Buffer.from(JSON.stringify(mergedContent, null, 2)).toString('base64');
              const retryResponse = await putToGitHub(repo, branch, token, mergedBase64, freshSha);
              if (retryResponse.ok) {
                console.log('✅ Content successfully saved after merge!');
                return NextResponse.json({ success: true, message: 'Content saved successfully!' });
              }
              lastError = await retryResponse.json() as GitHubErrorResponse;
              console.error(`❌ GitHub PUT error after merge:`, lastError);
            }
          }
        }
        continue;
      }

      // Non-SHA error, no point retrying
      break;
    }

    // Force update fallback: fetch current file and overwrite completely
    console.log('🔄 Attempting force update fallback...');
    const currentFile = await fetchCurrentFile(repo, branch, token);
    if (currentFile) {
      const fallbackBase64 = Buffer.from(JSON.stringify(newContent, null, 2)).toString('base64');
      const forceResponse = await putToGitHub(repo, branch, token, fallbackBase64, currentFile.sha);
      if (forceResponse.ok) {
        console.log('✅ Content saved via force update!');
        return NextResponse.json({ success: true, message: 'Content saved successfully!' });
      }
      const forceError: GitHubErrorResponse = await forceResponse.json() as GitHubErrorResponse;
      console.error('❌ Force update also failed:', forceError);
    }

    console.error('❌ All update attempts failed. Last error:', lastError);
    return NextResponse.json({ error: 'Failed to update GitHub', details: lastError }, { status: 500 });

  } catch (error: unknown) {
    console.error('PUT /api/content error:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}