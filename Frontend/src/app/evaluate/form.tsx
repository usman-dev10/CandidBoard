"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { DarkSelect } from "@/components/DarkSelect";
import { Field, LiquidButton, inputClass } from "@/components/ui";
import { JobFields, fromJob, splitList, type JobDraft } from "@/components/JobFields";
import { loadJobs } from "@/lib/jobs-store";
import { startEvaluation } from "@/lib/evals-store";
import { startPageTransition } from "@/lib/transition";
import { validateResume } from "@/lib/files";
import { sanitize } from "@/lib/sanitize";
import type { Job } from "@/lib/types";

export default function EvalForm() {
  const router = useRouter();
  const requested = useSearchParams().get("job");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [ready, setReady] = useState(false);
  const [jobId, setJobId] = useState("");
  const [draft, setDraft] = useState<JobDraft | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [paste, setPaste] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const picked = useRef<File | null>(null);

  const apply = useCallback((list: Job[], id: string) => {
    const next = list.find((j) => j.id === id) ?? list[0];
    if (!next) return;
    setJobId(next.id);
    setDraft(fromJob(next));
  }, []);

  useEffect(() => {
    loadJobs().then((list) => {
      setJobs(list);
      apply(list, requested || list[0]?.id || "");
      setReady(true);
    });
  }, [requested, apply]);

  const handleFile = useCallback((file: File) => {
    const err = validateResume(file);
    setError(err);
    picked.current = err ? null : file;
    setFileName(err ? null : sanitize(file.name, 180));
  }, []);

  if (!ready) return null;
  if (jobs.length === 0) {
    return (
      <div className="max-w-xl mx-auto glass rounded-2xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-white">Run the hiring panel</h1>
        <p className="text-sm text-gray-400">Create a job first, then come back to upload a resume.</p>
        <LiquidButton href="/jobs/new">New Job</LiquidButton>
      </div>
    );
  }
  if (!draft) return null;
  const canRun = draft.description.trim().length >= 40 && (!!fileName || paste.trim().length > 40) && !error;

  return (
    <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-6">
      <div className="glass rounded-2xl p-4 sm:p-6 space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Run the hiring panel</h1>
        <Field label="Use saved job">
          <DarkSelect
            value={jobId}
            onChange={(id) => apply(jobs, id)}
            options={jobs.map((j) => ({ value: j.id, label: j.title }))}
          />
        </Field>
        <p className="text-xs text-gray-500">
          Job fields are locked here. To change them,{" "}
          <Link href={`/jobs/${jobId}/edit`} className="text-indigo-400">Edit this job</Link>.
        </p>
        <JobFields draft={draft} set={() => {}} readOnly />
      </div>
      <div className="glass rounded-2xl p-4 sm:p-6 space-y-4">
        <Field label="Candidate resume" hint="PDF, DOCX, or TXT · max 2 MB">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer ${error ? "border-red-500/40" : "border-white/10"}`}
          >
            <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,application/pdf,text/plain" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            <p className="text-sm text-gray-300">{fileName ?? "Drop resume here"}</p>
          </div>
        </Field>
        {error ? <p className="text-xs text-red-400">{error}</p> : null}
        <Field label="Or paste resume text">
          <textarea className={inputClass} rows={8} maxLength={20000} value={paste} onChange={(e) => setPaste(sanitize(e.target.value, 20000))} />
        </Field>
        <p className="text-xs text-gray-400">Matching {draft.title} · {splitList(draft.mustHave).join(", ") || "no must-haves"}</p>
        <LiquidButton
          className="w-full"
          disabled={!canRun || busy}
          onClick={async () => {
            setBusy(true);
            try {
              const file =
                picked.current ||
                new File([paste], "resume.txt", { type: "text/plain" });
              const id = await startEvaluation(jobId, file);
              startPageTransition(`/evaluations/${id}`);
              router.push(`/evaluations/${id}`);
            } catch (err) {
              setBusy(false);
              setError(err instanceof Error ? err.message : "Could not start evaluation.");
            }
          }}
        >
          {busy ? "Starting…" : "Run panel"}
        </LiquidButton>
      </div>
    </div>
  );
}
