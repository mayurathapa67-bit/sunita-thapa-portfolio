import fs from "fs";
import path from "path";
import type { PortfolioData, SectionKey } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");
const DRAFTS_PATH = path.join(DATA_DIR, "drafts.json");

export const SECTION_KEYS: SectionKey[] = [
  "personal",
  "nav",
  "hero",
  "about",
  "services",
  "portfolio",
  "blog",
  "stats",
  "experience",
  "testimonials",
  "contact",
  "socials",
];

const isVercel =
  process.env.VERCEL === "1" || process.env.VERCEL_ENV != null;

/* ------------------------------- GitHub / API fetch ------------------------------ */

async function readLocal(): Promise<PortfolioData> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (token && repo) {
    try {
      const url = `https://api.github.com/repos/${repo}/contents/content.json?ref=${branch}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        const content = Buffer.from(data.content, "base64").toString("utf-8");
        return JSON.parse(content) as PortfolioData;
      }
    } catch {
      /* ignore */
    }
  }

  return {} as PortfolioData;
}

function writeLocal(data: PortfolioData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("[db] writeLocal failed (read-only FS?):", e);
  }
}

/* ------------------------------- GitHub commit ------------------------------ */

async function commitToGitHub(data: PortfolioData): Promise<boolean> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) return false;

  const [owner, name] = repo.split("/");
  if (!owner || !name) return false;

  const filePath = "data/seed.json";
  const api = "https://api.github.com";
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "User-Agent": "portfolio-admin",
  };

  try {
    const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");
    let sha: string | undefined;
    const cur = await fetch(`${api}/repos/${owner}/${name}/contents/${filePath}`, {
      headers,
    });
    if (cur.ok) sha = (await cur.json()).sha as string;

    const res = await fetch(`${api}/repos/${owner}/${name}/contents/${filePath}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: "chore: update portfolio content via admin panel",
        content,
        ...(sha ? { sha } : {}),
      }),
    });
    if (!res.ok) {
      console.error("[db] GitHub commit failed:", res.status);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[db] GitHub commit error:", e);
    return false;
  }
}

/* ------------------------------- Public API ------------------------------ */

export async function readDB(): Promise<PortfolioData> {
  return readLocal();
}

export type PublishMode = "all" | "local";

export async function writeDB(
  data: PortfolioData,
  mode: PublishMode = "all"
): Promise<{ github: boolean }> {
  const result = { github: false };

  if (mode === "local") {
    writeLocal(data);
    return result;
  }

  if (!isVercel) writeLocal(data);
  result.github = await commitToGitHub(data);

  return result;
}

/* ------------------------------- Drafts (local) ------------------------------ */

export async function readDrafts(): Promise<Partial<PortfolioData>> {
  try {
    const content = await fs.promises.readFile(DRAFTS_PATH, "utf-8");
    return JSON.parse(content) as Partial<PortfolioData>;
  } catch {
    return {};
  }
}

export function writeDrafts(drafts: Partial<PortfolioData>): void {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DRAFTS_PATH, JSON.stringify(drafts, null, 2), "utf-8");
  } catch (err) {
    console.error("[db] writeDrafts failed (read-only filesystem?):", err);
  }
}

export async function clearDraft(section: SectionKey): Promise<void> {
  const drafts = await readDrafts();
  if (section in drafts) {
    delete (drafts as Record<string, unknown>)[section];
    writeDrafts(drafts);
  }
}
