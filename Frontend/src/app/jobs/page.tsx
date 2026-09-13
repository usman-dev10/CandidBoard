"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ConfirmDialog, LiquidButton, PageFrame } from "@/components/ui";
import { loadJobs, removeJob } from "@/lib/jobs-store";
import type { Job } from "@/lib/types";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    loadJobs().then(setJobs);
  }, []);

  return (
    <PageFrame>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Requisitions</h1>
          <LiquidButton size="sm" href="/jobs/new" className="whitespace-nowrap shrink-0">New Job</LiquidButton>
        </div>
        <div className="glass rounded-2xl overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/6">
                {["Title", "Department", "Seniority", "Location", "Date", ""].map((c) => (
                  <th key={c} className={`text-left px-3 sm:px-5 py-3 text-xs text-gray-500 uppercase ${["Department", "Seniority", "Location", "Date"].includes(c) ? "hidden md:table-cell" : ""}`}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-sm text-gray-500 text-center">
                    No jobs yet. Create one with New Job.
                  </td>
                </tr>
              ) : null}
              {jobs.map((j) => (
                <tr key={j.id} className="data-row border-b border-white/4">
                  <td className="px-3 sm:px-5 py-4 text-sm text-white">{j.title}</td>
                  <td className="hidden md:table-cell px-5 py-4 text-sm text-gray-400">{j.department}</td>
                  <td className="hidden md:table-cell px-5 py-4 text-sm text-gray-400">{j.seniority}</td>
                  <td className="hidden md:table-cell px-5 py-4 text-sm text-gray-400">{j.location}</td>
                  <td className="hidden md:table-cell px-5 py-4 text-xs text-gray-500">{j.createdAt}</td>
                  <td className="px-3 sm:px-5 py-4 text-xs">
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3">
                      <Link href={`/evaluate?job=${encodeURIComponent(j.id)}`} prefetch className="text-indigo-400">Use</Link>
                      <Link href={`/jobs/${j.id}/edit`} prefetch className="text-indigo-300">Edit</Link>
                      <button type="button" className="text-red-400 text-left" onClick={() => setConfirmId(j.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {confirmId ? (
          <ConfirmDialog
            text="Delete this job?"
            onCancel={() => setConfirmId(null)}
            onConfirm={async () => {
              await removeJob(confirmId);
              setJobs(await loadJobs());
              setConfirmId(null);
            }}
          />
        ) : null}
      </div>
    </PageFrame>
  );
}
