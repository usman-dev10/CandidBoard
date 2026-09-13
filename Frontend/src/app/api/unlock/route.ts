import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { tooMany } from "@/lib/rate-limit";
import { safeToken } from "@/lib/sanitize";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/constants";
import { expectedToken, sameOrigin, signSession } from "@/lib/session";

export const runtime = "nodejs";

function equal(a: string, b: string) {
  const left = Buffer.from(a.padEnd(128, "\0"));
  const right = Buffer.from(b.padEnd(128, "\0"));
  return timingSafeEqual(left, right) && a.length === b.length;
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (tooMany(ip)) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }

  let token = "";
  try {
    const body = (await request.json()) as { token?: string };
    token = safeToken(body.token ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!token || !equal(token, expectedToken())) {
    return NextResponse.json({ error: "Enter the demo workspace token." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: SESSION_COOKIE,
    value: signSession(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
