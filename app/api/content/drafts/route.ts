import { NextResponse } from "next/server";
import { readDrafts } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await readDrafts(), {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
