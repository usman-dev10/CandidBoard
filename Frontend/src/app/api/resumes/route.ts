import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const res = await backendFetch("/api/v1/resumes", { method: "POST", body: form });
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      return NextResponse.json({ error: (body && (body.error?.message || body.detail)) || "Upload failed" }, { status: res.status });
    }
    return NextResponse.json(body, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Cannot reach backend" }, { status: 502 });
  }
}
