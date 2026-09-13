"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DarkSelect } from "@/components/DarkSelect";
import { ConfirmDialog, Field, LiquidButton, PageFrame, StatusBadge } from "@/components/ui";
import { EMPTY_EVALS } from "@/lib/data";
import { loadJobs } from "@/lib/jobs-store";
import { loadEvals, removeEval } from "@/lib/evals-store";
import type { EvalStatus, Evaluation } from "@/lib/types";

const STATUSES: { value: "all" | EvalStatus; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "Advance", label: "Advance" },
  { value: "Hold", label: "Hold" },
  { value: "Reject", label: "Reject" },
  { value: "Running", label: "Running" },
];

export default function CandidatesPage() {
  const [rows, setRows] = useState<Evaluation[]>([]);
  const [job, setJob] = useState("all");
  const [status, setStatus] = useState<"all" | EvalStatus>("all");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [jobOptions, setJobOptions] = useState<{ value: string; label: string }[]>([
    { value: "all", label: "All jobs" },
  ]);

  useEffect(() => {
    Promise.all([loadJobs(), loadEvals()]).then(([jobs, evals]) => {
      setRows(evals);
      const titles = new Set<string>(jobs.map((j) => j.title).concat(evals.map((e) => e.role)));
      setJobOptions([
        { value: "all", label: "All jobs" },
        ...[...titles].sort().map((t) => ({ value: t, label: t })),
      ]);
    });
  }, []);

  const filtered = useMemo(
    () => rows.filter((e) => (job === "all" || e.role === job) && (status === "all" || e.status === status)),
    [rows, job, status]
  );

  return (
    <PageFrame>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Evaluations</h1>
          <LiquidButton size="sm" href="/evaluate">New evaluation</LiquidButton>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-5">
          <Field label="Job">
            <DarkSelect value={job} onChange={setJob} options={jobOptions} />
          </Field>
          <Field label="Status">
            <DarkSelect value={status} onChange={(v) => setStatus(v as "all" | EvalStatus)} options={STATUSES} />
          </Field>
        </div>
        {filtered.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center text-sm text-gray-500">
            {rows.length === 0 ? EMPTY_EVALS : "No candidates match this job and status."}
          </div>
        ) : (
          <div className="glass rounded-2xl overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/6">
                  {["Name", "Job", "Score", "Status", "Date", ""].map((c) => (
                    <th key={c} className={`text-left px-3 sm:px-5 py-3 text-xs text-gray-500 uppercase ${c === "Date" || c === "Job" ? "hidden md:table-cell" : ""}`}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id} className="data-row border-b border-white/4">
                    <td className="px-3 sm:px-5 py-4 text-sm text-white">{e.candidate}</td>
                    <td className="hidden md:table-cell px-5 py-4 text-sm text-gray-400">{e.role}</td>
                    <td className="px-3 sm:px-5 py-4 text-sm font-bold">{e.score}</td>
                    <td className="px-3 sm:px-5 py-4"><StatusBadge status={e.status} /></td>
                    <td className="hidden md:table-cell px-5 py-4 text-xs text-gray-500">{e.date}</td>
                    <td className="px-3 sm:px-5 py-4 text-xs">
                      <div className="flex flex-col gap-2">
                        <Link href={`/evaluations/${e.id}`} prefetch className="text-indigo-400">Open</Link>
                        <button type="button" className="text-red-400 text-left" onClick={() => setConfirmId(e.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {confirmId ? (
          <ConfirmDialog
            text="Delete this evaluation?"
            onCancel={() => setConfirmId(null)}
            onConfirm={async () => {
              await removeEval(confirmId);
              setRows((r) => r.filter((x) => x.id !== confirmId));
              setConfirmId(null);
            }}
          />
        ) : null}
      </div>
    </PageFrame>
  );
}
