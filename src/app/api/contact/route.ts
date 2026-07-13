import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';

    if (!token || !repo) {
      console.error('❌ GitHub credentials missing for contact form.');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const apiUrl = `https://api.github.com/repos/${repo}/contents/data/submissions.json?ref=${branch}`;

    // 1. Fetch existing submissions from GitHub
    let currentSubmissions: any[] = [];
    let currentSha: string | null = null;

    const getResponse = await fetch(apiUrl, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (getResponse.status === 200) {
      const data = await getResponse.json();
      currentSha = data.sha;
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      currentSubmissions = JSON.parse(content);
    } else if (getResponse.status !== 404) {
      throw new Error(`Failed to fetch submissions: ${getResponse.status}`);
    }

    // 2. Add the new submission
    const newSubmission = {
      id: Date.now(),
      name,
      email,
      message,
      date: new Date().toISOString()
    };

    const updatedSubmissions = [...currentSubmissions, newSubmission];
    const newContent = Buffer.from(JSON.stringify(updatedSubmissions, null, 2)).toString('base64');

    // 3. Commit the updated file back to GitHub
    const putBody: any = {
      message: `feat: new contact form submission from ${name}`,
      content: newContent,
      branch: branch
    };

    if (currentSha) {
      putBody.sha = currentSha;
    }

    const putResponse = await fetch(apiUrl, {
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
      console.error('GitHub PUT error:', errorData);
      throw new Error('Failed to save submission to GitHub');
    }

    return NextResponse.json({ success: true, message: 'Submission saved!' });

  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}