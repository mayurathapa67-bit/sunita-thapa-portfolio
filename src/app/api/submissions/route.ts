import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type Submission = {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
};

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

const FILE_PATH = "data/submissions.json";

async function getGitHubFile(token: string, repo: string, branch: string) {
  const url = `https://api.github.com/repos/${repo}/contents/${FILE_PATH}?ref=${branch}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as GitHubFileResponse;
}

async function putGitHubFile(
  token: string,
  repo: string,
  branch: string,
  content: string,
  sha?: string
) {
  const url = `https://api.github.com/repos/${repo}/contents/${FILE_PATH}?ref=${branch}`;
  const body: GitHubPutBody = {
    message: "chore: update submissions.json via admin panel",
    content: Buffer.from(content).toString("base64"),
    branch,
  };
  if (sha) body.sha = sha;
  return fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

function readLocal(): Submission[] {
  const fp = path.join(process.cwd(), "data", "submissions.json");
  if (!fs.existsSync(fp)) return [];
  return JSON.parse(fs.readFileSync(fp, "utf-8"));
}

function writeLocal(data: Submission[]) {
  const fp = path.join(process.cwd(), "data", "submissions.json");
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  try {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || "main";

    if (token && repo) {
      const gh = await getGitHubFile(token, repo, branch);
      if (gh) {
        const raw = Buffer.from(gh.content, "base64").toString("utf-8");
        return NextResponse.json(JSON.parse(raw));
      }
    }

    return NextResponse.json(readLocal());
  } catch {
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
    }

    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || "main";

    let submissions: Submission[] = [];
    let sha: string | undefined;

    if (token && repo) {
      const gh = await getGitHubFile(token, repo, branch);
      if (gh) {
        sha = gh.sha;
        submissions = JSON.parse(Buffer.from(gh.content, "base64").toString("utf-8"));
      }
    }

    if (submissions.length === 0) {
      submissions = readLocal();
    }

    const filtered = submissions.filter((s) => s.id !== id);
    if (filtered.length === submissions.length) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    const jsonContent = JSON.stringify(filtered, null, 2);

    try {
      writeLocal(filtered);
    } catch {
      // ignore local write errors (e.g. read-only filesystem on Vercel)
    }

    if (token && repo) {
      const res = await putGitHubFile(token, repo, branch, jsonContent, sha);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return NextResponse.json({ error: "Failed to update GitHub", details: err }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: "Submission deleted" });
  } catch {
    return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 });
  }
}
