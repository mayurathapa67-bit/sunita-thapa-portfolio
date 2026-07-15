import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminSession';

// GET: ONLY fetch from GitHub (no local file reading at all)
export async function GET() {
  try {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';

    if (!token || !repo) {
      console.error('❌ GitHub credentials missing');
      return NextResponse.json(
        { error: 'GitHub credentials not configured' },
        { status: 500 }
      );
    }

    const url = `https://api.github.com/repos/${repo}/contents/content.json?ref=${branch}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      cache: 'no-store'
    });

    if (response.status === 404) {
      console.error('❌ content.json not found in GitHub repository');
      return NextResponse.json(
        { error: 'content.json not found in repository. Please ensure it exists in GitHub.' },
        { status: 404 }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ GitHub API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to fetch from GitHub' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    const parsedContent = JSON.parse(content);

    return NextResponse.json(parsedContent, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate'
      }
    });

  } catch (error) {
    console.error('❌ GET /api/content critical error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT: Save to GitHub only
export async function PUT(request: NextRequest) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const newContent = await request.json();
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';

    if (!token || !repo) {
      return NextResponse.json({ error: 'GitHub credentials missing' }, { status: 500 });
    }

    const url = `https://api.github.com/repos/${repo}/contents/content.json?ref=${branch}`;

    // Fetch current SHA
    let sha = '';
    const getResponse = await fetch(url, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (getResponse.ok) {
      const data = await getResponse.json();
      sha = data.sha;
    }

    const contentBase64 = Buffer.from(JSON.stringify(newContent, null, 2)).toString('base64');

    const putBody: { message: string; content: string; branch: string; sha?: string } = {
      message: 'chore: update content.json via admin panel',
      content: contentBase64,
      branch: branch
    };

    if (sha) {
      putBody.sha = sha;
    }

    const putResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(putBody)
    });

    if (!putResponse.ok) {
      const errorData = await putResponse.json();
      console.error('❌ GitHub PUT error:', errorData);
      return NextResponse.json({ error: 'Failed to update GitHub', details: errorData }, { status: 500 });
    }

    console.log('✅ Content successfully saved to GitHub!');
    return NextResponse.json({ success: true, message: 'Content saved successfully!' });

  } catch (error) {
    console.error('❌ PUT /api/content error:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
} 