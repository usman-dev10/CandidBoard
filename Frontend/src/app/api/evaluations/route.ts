import { NextResponse } from "next/server";
import { backendError, backendFetch } from "@/lib/backend";
import { toUiEval, type EvalApi } from "@/lib/eval-map";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await backendFetch("/api/v1/evaluations");
    if (!res.ok) return NextResponse.json({ error: await backendError(res) }, { status: res.status });
    const rows = (await res.json()) as EvalApi[];
    return NextResponse.json(rows.map(toUiEval));
  } catch {
    return NextResponse.json({ error: "Cannot reach backend" }, { status: 502 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const res = await backendFetch("/api/v1/evaluations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      return NextResponse.json({ error: body?.error?.message || "Could not start evaluation" }, { status: res.status });
    }
    return NextResponse.json(body, { status: 202 });
  } catch {
    return NextResponse.json({ error: "Cannot reach backend" }, { status: 502 });
  }
}
