export function backendUrl() {
  return (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000"
  ).replace(/\/$/, "");
}

export function workspaceApiKey() {
  return process.env.WORKSPACE_API_KEY || "change-me";
}

export async function backendFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${workspaceApiKey()}`);
  return fetch(`${backendUrl()}${path}`, { ...init, headers, cache: "no-store" });
}

export async function backendError(res: Response) {
  const body = await res.json().catch(() => null);
  return (body?.error?.message || body?.detail || "Backend request failed") as string;
}
