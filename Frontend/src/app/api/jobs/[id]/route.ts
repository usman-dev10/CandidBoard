import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";
import { fromApi, type JobApi } from "@/lib/job-map";

export const runtime = "nodejs";

async function fail(res: Response) {
  const body = await res.json().catch(() => null);
  const message = body?.error?.message || body?.detail || "Backend request failed";
  return NextResponse.json({ error: message }, { status: res.status });
}

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const res = await backendFetch(`/api/v1/jobs/${id}`);
  if (!res.ok) return fail(res);
  const row = (await res.json()) as JobApi;
  return NextResponse.json(fromApi(row));
}

export async function PUT(request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const payload = await request.json();
  const res = await backendFetch(`/api/v1/jobs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return fail(res);
  const row = (await res.json()) as JobApi;
  return NextResponse.json(fromApi(row));
}

export async function DELETE(_: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const res = await backendFetch(`/api/v1/jobs/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) return fail(res);
  return new NextResponse(null, { status: 204 });
}
