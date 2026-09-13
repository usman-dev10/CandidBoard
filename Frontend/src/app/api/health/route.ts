import { NextResponse } from "next/server";
import { backendUrl } from "@/lib/backend";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch(`${backendUrl()}/health`, { cache: "no-store" });
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: "Backend health failed" },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true, backend: body });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Cannot reach backend" },
      { status: 502 },
    );
  }
}
