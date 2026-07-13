import { NextResponse } from "next/server";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
const FILE_PATH = "content.json";

async function getGithubFile(): Promise<{ sha?: string; content: string }> {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}?ref=${GITHUB_BRANCH}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  if (!res.ok) {
    if (res.status === 404) return { content: "{}" };
    throw new Error(`GitHub fetch failed: ${res.statusText}`);
  }
  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { sha: data.sha, content };
}

async function commitToGithub(content: string, sha?: string) {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`;
  const body: Record<string, unknown> = {
    message: "Update content.json via admin panel",
    content: Buffer.from(content, "utf-8").toString("base64"),
    branch: GITHUB_BRANCH,
  };
  if (sha) body.sha = sha;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub commit failed: ${res.status} ${err}`);
  }
  return res.json();
}

export async function GET() {
  try {
    if (!GITHUB_TOKEN || !GITHUB_REPO) {
      const fs = await import("fs");
      const path = await import("path");
      const filePath = path.join(process.cwd(), "content.json");
      const raw = fs.readFileSync(filePath, "utf-8");
      return NextResponse.json(JSON.parse(raw));
    }
    const { content } = await getGithubFile();
    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const content = JSON.stringify(body, null, 2);

    if (!GITHUB_TOKEN || !GITHUB_REPO) {
      const fs = await import("fs");
      const path = await import("path");
      const filePath = path.join(process.cwd(), "content.json");
      fs.writeFileSync(filePath, content, "utf-8");
      return NextResponse.json({ success: true, message: "Saved locally" });
    }

    const { sha } = await getGithubFile();
    await commitToGithub(content, sha);
    return NextResponse.json({ success: true, message: "Committed to GitHub" });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
