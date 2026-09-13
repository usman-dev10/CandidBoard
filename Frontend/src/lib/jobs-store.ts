import { toApi } from "./job-map";
import type { Job } from "./types";

const RUN_KEY = "cb_run_job";

export async function loadJobs(): Promise<Job[]> {
  const res = await fetch("/api/jobs", { cache: "no-store" });
  if (!res.ok) return [];
  return (await res.json()) as Job[];
}

export async function getJob(id: string | null | undefined) {
  if (!id) return undefined;
  const res = await fetch(`/api/jobs/${id}`, { cache: "no-store" });
  if (!res.ok) return undefined;
  return (await res.json()) as Job;
}

export async function addJob(job: Job) {
  const res = await fetch("/api/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApi(job)),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || "Could not save job.");
  }
  return (await res.json()) as Job;
}

export async function updateJob(job: Job) {
  const res = await fetch(`/api/jobs/${job.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApi(job)),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || "Could not update job.");
  }
  return (await res.json()) as Job;
}

export async function removeJob(id: string) {
  const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || "Could not delete job.");
  }
}

export function setRunJobId(id: string) {
  try {
    sessionStorage.setItem(RUN_KEY, id);
  } catch {
    /* ignore */
  }
}

export function getRunJobId() {
  try {
    return sessionStorage.getItem(RUN_KEY);
  } catch {
    return null;
  }
}
