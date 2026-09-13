import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";
import { fromApi, type JobApi } from "@/lib/job-map";

export const runtime = "nodejs";

async function fail(res: Response) {
  const body = await res.json().catch(() => null);
  const message = body?.error?.message || body?.detail || "Backend request failed";
  return NextResponse.json({ error: message }, { status: res.status });
}

export async function GET() {
  try {
    const res = await backendFetch("/api/v1/jobs");
    if (!res.ok) return fail(res);
    const rows = (await res.json()) as JobApi[];
    return NextResponse.json(rows.map(fromApi));
  } catch {
    return NextResponse.json({ error: "Cannot reach backend" }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const payload = await request.json();
  const res = await backendFetch("/api/v1/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return fail(res);
  const row = (await res.json()) as JobApi;
  return NextResponse.json(fromApi(row), { status: 201 });
}
