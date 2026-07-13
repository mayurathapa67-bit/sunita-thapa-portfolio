import { NextResponse } from 'next/server';

type Submission = {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
};

type GitHubFileResponse = {
  sha: string;
  content: string;
};

type GitHubError = {
  message: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name: string = body.name;
    const email: string = body.email;
    const message: string = body.message;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const token: string | undefined = process.env.GITHUB_TOKEN;
    const repo: string | undefined = process.env.GITHUB_REPO;
    const branch: string = process.env.GITHUB_BRANCH || 'main';

    if (!token || !repo) {
      console.error('❌ GitHub credentials missing for contact form.');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const apiUrl: string = `https://api.github.com/repos/${repo}/contents/data/submissions.json?ref=${branch}`;

    // 1. Fetch existing submissions from GitHub
    let currentSubmissions: Submission[] = [];
    let currentSha: string | null = null;

    const getResponse: Response = await fetch(apiUrl, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (getResponse.status === 200) {
      const data: GitHubFileResponse = await getResponse.json() as GitHubFileResponse;
      currentSha = data.sha;
      const content: string = Buffer.from(data.content, 'base64').toString('utf-8');
      currentSubmissions = JSON.parse(content) as Submission[];
    } else if (getResponse.status !== 404) {
      throw new Error(`Failed to fetch submissions: ${getResponse.status}`);
    }

    // 2. Add the new submission
    const newSubmission: Submission = {
      id: Date.now(),
      name,
      email,
      message,
      date: new Date().toISOString()
    };

    const updatedSubmissions: Submission[] = [...currentSubmissions, newSubmission];
    const newContent: string = Buffer.from(JSON.stringify(updatedSubmissions, null, 2)).toString('base64');

    // 3. Commit the updated file back to GitHub
    const putBody: { message: string; content: string; branch: string; sha?: string } = {
      message: `feat: new contact form submission from ${name}`,
      content: newContent,
      branch: branch
    };

    if (currentSha) {
      putBody.sha = currentSha;
    }

    const putResponse: Response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(putBody)
    });

    if (!putResponse.ok) {
      const errorData: GitHubError = await putResponse.json() as GitHubError;
      console.error('GitHub PUT error:', errorData);
      throw new Error('Failed to save submission to GitHub');
    }

    return NextResponse.json({ success: true, message: 'Submission saved!' });

  } catch (error: unknown) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}