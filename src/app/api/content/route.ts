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

    // Try to fetch from GitHub first
    if (token && repo) {
      const url = `https://api.github.com/repos/${repo}/contents/content.json?ref=${branch}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        cache: 'no-store' // Always get the latest version
      });

      if (response.ok) {
        const data: GitHubFileResponse = await response.json() as GitHubFileResponse;
        const content: string = Buffer.from(data.content, 'base64').toString('utf-8');
        return NextResponse.json(JSON.parse(content) as Content);
      }
    }

    // Fallback to local file if GitHub fails or no credentials
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

    const url: string = `https://api.github.com/repos/${repo}/contents/content.json?ref=${branch}`;
    
    // We need the current SHA to update the file. If it doesn't exist, we create it.
    let sha: string = '';
    const getResponse: Response = await fetch(url, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (getResponse.ok) {
      const data: GitHubFileResponse = await getResponse.json() as GitHubFileResponse;
      sha = data.sha;
    }

    const contentBase64: string = Buffer.from(JSON.stringify(newContent, null, 2)).toString('base64');

    const putBody: GitHubPutBody = {
      message: 'chore: update content.json via admin panel',
      content: contentBase64,
      branch: branch
    };

    if (sha) {
      putBody.sha = sha;
    }

    const putResponse: Response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(putBody)
    });

    if (!putResponse.ok) {
      const errorData: GitHubErrorResponse = await putResponse.json() as GitHubErrorResponse;
      console.error('❌ GitHub PUT error:', errorData);
      return NextResponse.json({ error: 'Failed to update GitHub', details: errorData }, { status: 500 });
    }

    console.log('✅ Content successfully saved to GitHub!');
    return NextResponse.json({ success: true, message: 'Content saved successfully!' });

  } catch (error: unknown) {
    console.error('PUT /api/content error:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}