"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { GhostButton, LiquidButton } from "@/components/ui";
import { JobFields, emptyDraft, fromJob, splitList, type JobDraft } from "@/components/JobFields";
import { addJob, updateJob } from "@/lib/jobs-store";
import { startPageTransition } from "@/lib/transition";
import { clean } from "@/lib/sanitize";
import type { Job } from "@/lib/types";

export function JobSaveForm({ job }: { job?: Job }) {
  const router = useRouter();
  const [draft, setDraft] = useState<JobDraft>(job ? fromJob(job) : emptyDraft());
  const [error, setError] = useState("");
  const set = (patch: Partial<JobDraft>) => {
    setError("");
    setDraft((d) => ({ ...d, ...patch }));
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (draft.title.trim().length < 2) {
      setError("Enter a job title.");
      return;
    }
    if (draft.description.trim().length < 40) {
      setError("Job description must be at least 40 characters.");
      return;
    }
    const mustHave = splitList(draft.mustHave);
    if (mustHave.length < 1) {
      setError("Add at least one must-have skill.");
      return;
    }
    const payload: Job = {
      id: job?.id ?? "",
      title: clean(draft.title, 200),
      department: clean(draft.department, 120) || "General",
      seniority: draft.seniority,
      location: clean(draft.location, 160) || "Remote",
      description: clean(draft.description, 8000),
      mustHave,
      niceToHave: splitList(draft.niceToHave),
      values: splitList(draft.values),
      createdAt: job?.createdAt ?? new Date().toISOString().slice(0, 10),
    };
    try {
      if (job) await updateJob(payload);
      else await addJob(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save job.");
      return;
    }
    startPageTransition("/jobs");
    router.push("/jobs");
  };

  return (
    <form onSubmit={save} className="max-w-xl mx-auto glass rounded-2xl p-6 space-y-4">
      <h1 className="text-3xl font-bold text-white">{job ? "Edit Job" : "New Job"}</h1>
      <p className="text-sm text-gray-400">
        {job ? "Update this requisition. Evaluations will use the saved fields." : "Create a requisition. Use it later from New evaluation."}
      </p>
      <JobFields draft={draft} set={set} />
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      <div className="flex flex-wrap gap-3 pt-2">
        <LiquidButton type="submit">{job ? "Save changes" : "Save Job"}</LiquidButton>
        <GhostButton href="/jobs">Cancel</GhostButton>
      </div>
    </form>
  );
}
