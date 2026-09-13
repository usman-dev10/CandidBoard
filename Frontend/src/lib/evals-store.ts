import type { Evaluation } from "./types";
import type { EvalApi } from "./eval-map";
import { toUiEval } from "./eval-map";

async function readError(res: Response) {
  const body = await res.json().catch(() => null);
  return (body?.error as string) || "Request failed.";
}

export async function loadEvals(): Promise<Evaluation[]> {
  const res = await fetch("/api/evaluations", { cache: "no-store" });
  if (!res.ok) return [];
  return (await res.json()) as Evaluation[];
}

export async function getEvalApi(id: string): Promise<EvalApi | null> {
  if (!id || id === "undefined" || id === "eval-alex") return null;
  const res = await fetch(`/api/evaluations/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as EvalApi;
}

export async function removeEval(id: string) {
  const res = await fetch(`/api/evaluations/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) throw new Error(await readError(res));
}

export async function startEvaluation(jobId: string, file: File) {
  const form = new FormData();
  form.append("file", file);
  const up = await fetch("/api/resumes", { method: "POST", body: form });
  if (!up.ok) throw new Error(await readError(up));
  const resume = (await up.json()) as { id: string };
  const ev = await fetch("/api/evaluations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job_id: jobId, resume_id: resume.id }),
  });
  if (!ev.ok) throw new Error(await readError(ev));
  const started = (await ev.json()) as { id: string };
  return started.id;
}

export { toUiEval };
