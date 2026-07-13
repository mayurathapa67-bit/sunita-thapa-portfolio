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

function getSubmissionsPath() {
  return path.join(process.cwd(), "data", "submissions.json");
}

function readSubmissions(): Submission[] {
  const filePath = getSubmissionsPath();
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function writeSubmissions(submissions: Submission[]) {
  fs.writeFileSync(
    getSubmissionsPath(),
    JSON.stringify(submissions, null, 2),
    "utf-8"
  );
}

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const submission: Submission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
    };

    const submissions = readSubmissions();
    submissions.push(submission);
    writeSubmissions(submissions);

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
