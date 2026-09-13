"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Disclaimer, LiquidButton, PageFrame, StatusBadge } from "@/components/ui";
import { EMPTY_EVALS } from "@/lib/data";
import { loadEvals } from "@/lib/evals-store";
import type { Evaluation } from "@/lib/types";

export default function DashboardPage() {
  const [rows, setRows] = useState<Evaluation[]>([]);

  useEffect(() => {
    loadEvals().then(setRows);
  }, []);

  const advance = rows.filter((e) => e.status === "Advance").length;
  const hold = rows.filter((e) => e.status === "Hold").length;
  const reject = rows.filter((e) => e.status === "Reject").length;
  const stats = [
    { label: "Evaluations", value: String(rows.length) },
    { label: "Advance", value: String(advance) },
    { label: "Hold", value: String(hold) },
    { label: "Reject", value: String(reject) },
  ];

  return (
    <PageFrame>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Overview</h1>
          <LiquidButton size="sm" href="/evaluate">New evaluation</LiquidButton>
        </div>
        <Disclaimer />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-5">
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between mb-3">
          <p className="text-sm text-gray-400">Recent</p>
          <Link href="/candidates" prefetch className="text-xs text-indigo-400">View all candidates</Link>
        </div>
        <div className="glass rounded-2xl overflow-x-auto">
          {rows.length === 0 ? (
            <p className="px-5 py-10 text-sm text-gray-500 text-center">{EMPTY_EVALS}</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/6">
                  {["Name", "Job", "Score", "Status", "Date", ""].map((c) => (
                    <th key={c} className="text-left px-5 py-3 text-xs text-gray-500 uppercase">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 4).map((e) => (
                  <tr key={e.id} className="data-row border-b border-white/4">
                    <td className="px-5 py-4 text-sm text-white">{e.candidate}</td>
                    <td className="px-5 py-4 text-sm text-gray-400">{e.role}</td>
                    <td className="px-5 py-4 text-sm font-bold">{e.score}</td>
                    <td className="px-5 py-4"><StatusBadge status={e.status} /></td>
                    <td className="px-5 py-4 text-xs text-gray-500">{e.date}</td>
                    <td className="px-5 py-4">
                      <Link href={`/evaluations/${e.id}`} prefetch className="text-xs text-indigo-400">Open</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PageFrame>
  );
}
