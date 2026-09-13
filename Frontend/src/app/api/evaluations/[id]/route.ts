import { NextResponse } from "next/server";
import { backendError, backendFetch } from "@/lib/backend";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  try {
    const res = await backendFetch(`/api/v1/evaluations/${id}`);
    if (!res.ok) return NextResponse.json({ error: await backendError(res) }, { status: res.status });
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ error: "Cannot reach backend" }, { status: 502 });
  }
}

export async function DELETE(_: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  try {
    const res = await backendFetch(`/api/v1/evaluations/${id}`, { method: "DELETE" });
    if (!res.ok && res.status !== 204) {
      return NextResponse.json({ error: await backendError(res) }, { status: res.status });
    }
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Cannot reach backend" }, { status: 502 });
  }
}
