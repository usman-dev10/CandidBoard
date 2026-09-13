"use client";

import { DarkSelect } from "@/components/DarkSelect";
import { Field, inputClass } from "@/components/ui";
import { sanitize } from "@/lib/sanitize";
import type { Job } from "@/lib/types";
import type { Seniority } from "@/lib/types";

export type JobDraft = {
  title: string;
  department: string;
  seniority: Seniority;
  location: string;
  description: string;
  mustHave: string;
  niceToHave: string;
  values: string;
};

const box = (readOnly: boolean) =>
  `${inputClass} ${readOnly ? "text-gray-300 cursor-not-allowed opacity-80" : "text-white"}`;

export function JobFields({
  draft,
  set,
  readOnly = false,
}: {
  draft: JobDraft;
  set: (patch: Partial<JobDraft>) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="space-y-4">
      <Field label="Title">
        <input className={box(readOnly)} maxLength={200} readOnly={readOnly} value={draft.title} onChange={(e) => !readOnly && set({ title: sanitize(e.target.value, 200) })} />
      </Field>
      <Field label="Department">
        <input className={box(readOnly)} maxLength={120} readOnly={readOnly} value={draft.department} onChange={(e) => !readOnly && set({ department: sanitize(e.target.value, 120) })} />
      </Field>
      <Field label="Seniority">
        {readOnly ? (
          <input className={box(true)} readOnly value={draft.seniority} />
        ) : (
          <DarkSelect
            value={draft.seniority}
            onChange={(v) => set({ seniority: v as Seniority })}
            options={["junior", "mid", "senior", "lead"].map((s) => ({ value: s, label: s }))}
          />
        )}
      </Field>
      <Field label="Location">
        <input className={box(readOnly)} maxLength={160} readOnly={readOnly} value={draft.location} onChange={(e) => !readOnly && set({ location: sanitize(e.target.value, 160) })} />
      </Field>
      <Field label="Job description" hint={readOnly ? undefined : "Minimum 40 characters"}>
        <textarea className={box(readOnly)} rows={5} maxLength={8000} readOnly={readOnly} value={draft.description} onChange={(e) => !readOnly && set({ description: sanitize(e.target.value, 8000) })} />
      </Field>
      <Field label="Must-have skills">
        <input className={box(readOnly)} maxLength={400} readOnly={readOnly} value={draft.mustHave} onChange={(e) => !readOnly && set({ mustHave: sanitize(e.target.value, 400) })} />
      </Field>
      <Field label="Nice-to-have skills">
        <input className={box(readOnly)} maxLength={400} readOnly={readOnly} value={draft.niceToHave} onChange={(e) => !readOnly && set({ niceToHave: sanitize(e.target.value, 400) })} />
      </Field>
      <Field label="Values">
        <input className={box(readOnly)} maxLength={400} readOnly={readOnly} value={draft.values} onChange={(e) => !readOnly && set({ values: sanitize(e.target.value, 400) })} />
      </Field>
    </div>
  );
}

export function splitList(value: string) {
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

export function emptyDraft(): JobDraft {
  return {
    title: "",
    department: "",
    seniority: "mid",
    location: "",
    description: "",
    mustHave: "",
    niceToHave: "",
    values: "",
  };
}

export function fromJob(job: Job): JobDraft {
  return {
    title: job.title,
    department: job.department,
    seniority: job.seniority,
    location: job.location,
    description: job.description,
    mustHave: job.mustHave.join(", "),
    niceToHave: job.niceToHave.join(", "),
    values: job.values.join(", "),
  };
}
