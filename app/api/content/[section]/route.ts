import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readDB, writeDB, readDrafts, writeDrafts, clearDraft } from "@/lib/db";
import { requireAdmin } from "@/lib/adminSession";
import type { PortfolioData, SectionKey } from "@/lib/types";

export const dynamic = "force-dynamic";

const VALID_SECTIONS: SectionKey[] = [
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

export async function GET(
  _req: NextRequest,
  { params }: { params: { section: string } }
) {
  const section = params.section as SectionKey;
  if (!VALID_SECTIONS.includes(section)) {
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  }
  try {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || "main";

    if (!token || !repo) {
      console.error("[content/section] GitHub credentials missing");
      return NextResponse.json(
        { error: "GitHub credentials not configured" },
        { status: 500 }
      );
    }

    const url = `https://api.github.com/repos/${repo}/contents/content.json?ref=${branch}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("[content/section] GitHub fetch failed:", response.status);
      return NextResponse.json(
        {},
        {
          status: 200,
          headers: { "Cache-Control": "no-store, max-age=0" },
        }
      );
    }

    const file = await response.json();
    const content = Buffer.from(file.content, "base64").toString("utf-8");
    const db = JSON.parse(content) as PortfolioData;

    return NextResponse.json(db[section] ?? {}, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (err) {
    console.error("[content/section] GET failed:", err);
    return NextResponse.json(
      {},
      {
        status: 200,
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { section: string } }
) {
  try {
    const section = params.section as SectionKey;

    if (!VALID_SECTIONS.includes(section)) {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }

    const unauthorized = requireAdmin(req);
    if (unauthorized) return unauthorized;

    const body = await req.json();
    const { data, publishMode } = body as {
      data?: unknown;
      publishMode?: "draft" | "local" | "publish";
    };

    if (data === undefined) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (publishMode === "draft") {
      const drafts = await readDrafts();
      (drafts as Record<string, unknown>)[section] = data;
      writeDrafts(drafts);
      return NextResponse.json({ success: true, state: "draft" });
    }

    const db = await readDB();
    (db[section] as PortfolioData[SectionKey]) = data as PortfolioData[SectionKey];
    await clearDraft(section);

    if (publishMode === "local") {
      const isVercel = process.env.VERCEL === "1" || process.env.VERCEL_ENV != null;
      if (!isVercel) {
        await writeDB(db, "local");
      }
      return NextResponse.json({ success: true, state: "local", github: false });
    }

    const result = await writeDB(db, "all");

    const routes: Record<string, string> = {
      personal: "/",
      nav: "/",
      hero: "/",
      about: "/about",
      services: "/services",
      portfolio: "/portfolio",
      blog: "/blog",
      stats: "/",
      experience: "/experience",
      testimonials: "/",
      contact: "/contact",
      socials: "/",
    };
    if (routes[section]) revalidatePath(routes[section]);

    return NextResponse.json({ success: true, state: "published", ...result });
  } catch (err) {
    console.error("[content/section] POST failed:", err);
    return NextResponse.json(
      { error: "Failed to update section" },
      { status: 500 }
    );
  }
}
