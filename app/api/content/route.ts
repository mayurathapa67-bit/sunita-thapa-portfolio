import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET: Fetch content from GitHub (or safe fallback)
export async function GET() {
  try {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';

    // 1. Try to fetch from GitHub first (Works on Vercel and Localhost)
    if (token && repo) {
      try {
        const url = `https://api.github.com/repos/${repo}/contents/content.json?ref=${branch}`;
        const response = await fetch(url, {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          },
          cache: 'no-store' // ONLY use cache: 'no-store' (fixes the warning)
        });

        if (response.ok) {
          const data = await response.json();
          const content = Buffer.from(data.content, 'base64').toString('utf-8');
          const parsedContent = JSON.parse(content);
          
          return NextResponse.json(parsedContent, {
            headers: {
              'Cache-Control': 'no-store, max-age=0, must-revalidate'
            }
          });
        }
      } catch (githubError) {
        console.warn('⚠️ GitHub fetch failed, falling back to local file:', githubError);
      }
    }

    // 2. Fallback to local file (ONLY for localhost development)
    // Wrapped in try/catch so it NEVER crashes Vercel if the file is missing
    try {
      const filePath = path.join(process.cwd(), 'content.json');
      if (fs.existsSync(filePath)) {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return NextResponse.json(JSON.parse(fileContents), {
          headers: {
            'Cache-Control': 'no-store, max-age=0, must-revalidate'
          }
        });
      }
    } catch (localError) {
      console.warn('⚠️ Local file read failed:', localError);
    }

    // 3. Ultimate safe fallback if both fail
    console.error('❌ Could not load content from GitHub or local file.');
    return NextResponse.json({ error: 'Content not found' }, { status: 404 });

  } catch (error) {
    console.error('❌ GET /api/content critical error:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

// PUT: Save content to GitHub (with robust SHA handling)
export async function PUT(request: Request) {
  try {
    const newContent = await request.json();
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';

    // 1. Try to save locally (will fail on Vercel, which is perfectly fine)
    try {
      const filePath = path.join(process.cwd(), 'content.json');
      fs.writeFileSync(filePath, JSON.stringify(newContent, null, 2), 'utf8');
      console.log('✅ Local content.json updated');
    } catch (localError) {
      console.warn('⚠️ Local save skipped (read-only filesystem):', localError);
    }

    // 2. Push to GitHub
    if (!token || !repo) {
      console.error('❌ GitHub credentials missing for content update.');
      return NextResponse.json({ error: 'GitHub credentials missing in environment variables' }, { status: 500 });
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