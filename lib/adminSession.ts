import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const SESSION_COOKIE = "portfolio_admin_session";

const SECRET =
  process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "dev-secret";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export function createSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + SESSION_TTL_MS })
  ).toString("base64url");
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token?: string | null): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!data.exp || data.exp < Date.now()) return false;
  } catch {
    return false;
  }
  return true;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
    secure: process.env.NODE_ENV === "production",
  };
}

/** Returns a 401 response when the request is not authenticated, else null. */
export function requireAdmin(req: NextRequest): NextResponse | null {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
