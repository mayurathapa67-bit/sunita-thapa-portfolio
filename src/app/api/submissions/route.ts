import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "submissions.json");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json([]);
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    const submissions = JSON.parse(raw);
    return NextResponse.json(submissions);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
