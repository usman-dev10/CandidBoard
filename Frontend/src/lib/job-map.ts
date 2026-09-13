import type { Job, Seniority } from "./types";

export type JobApi = {
  id: string;
  title: string;
  department: string | null;
  seniority: Seniority;
  location: string | null;
  description: string;
  must_have_skills: string[];
  nice_to_have_skills: string[];
  values: string[];
  created_at: string;
};

export function fromApi(j: JobApi): Job {
  return {
    id: j.id,
    title: j.title,
    department: j.department || "General",
    seniority: j.seniority,
    location: j.location || "Remote",
    description: j.description,
    mustHave: j.must_have_skills || [],
    niceToHave: j.nice_to_have_skills || [],
    values: j.values || [],
    createdAt: (j.created_at || "").slice(0, 10),
  };
}

export function toApi(job: Job) {
  return {
    title: job.title,
    department: job.department,
    seniority: job.seniority,
    location: job.location,
    description: job.description,
    must_have_skills: job.mustHave,
    nice_to_have_skills: job.niceToHave,
    values: job.values,
  };
}
