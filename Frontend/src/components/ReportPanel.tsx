"use client";

import { Disclaimer, GhostButton, LiquidButton, StatusBadge } from "@/components/ui";
import type { EvaluationReport } from "@/lib/types";

export function ReportPanel({ report, skip }: { report: EvaluationReport; skip: boolean }) {
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(report)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "evaluation-report.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xs tracking-widest text-indigo-400 uppercase mb-2">Report</p>
          <h1 className="text-3xl font-bold text-white">{report.candidate}</h1>
          <p className="text-sm text-gray-400">{report.jobTitle}</p>
        </div>
        <StatusBadge status={report.status} />
      </div>
      <Disclaimer />
      <div className="glass rounded-2xl p-6 mb-4">
        <p className="text-4xl font-bold text-white mb-2">{report.overall}</p>
        <p className="text-sm text-gray-400">{report.summary}</p>
      </div>
      {skip ? <p className="text-xs text-amber-300 mb-4">Deep screen skipped because job-fit was below 60.</p> : null}
      <div className="glass rounded-2xl p-6 mb-4">
        {report.dimensions.map((d) => (
          <div key={d.label} className="flex justify-between text-sm py-1">
            <span className="text-gray-400">{d.label}</span>
            <span className="text-white font-semibold">{d.score}</span>
          </div>
        ))}
      </div>
      <div className="glass rounded-2xl p-6 mb-4">
        <ul className="space-y-2">{report.evidence.map((e) => <li key={e} className="text-sm text-gray-300">• {e}</li>)}</ul>
      </div>
      {!skip ? (
        <div className="glass rounded-2xl p-6 mb-4 space-y-2">
          {report.technical.map((q) => <p key={q.question} className="text-sm text-gray-300">{q.question}</p>)}
          {report.culture.map((q) => <p key={q.question} className="text-sm text-gray-300">{q.question}</p>)}
        </div>
      ) : null}
      <p className="text-sm text-gray-400 mb-6">{skip ? "A1 → A2 → A5" : report.handoffs.join(" · ")}</p>
      <div className="flex flex-wrap gap-3">
        <LiquidButton onClick={exportJson}>Export JSON</LiquidButton>
        <GhostButton onClick={() => navigator.clipboard.writeText(report.summary)}>Copy summary</GhostButton>
        <GhostButton href="/candidates">Back to candidates</GhostButton>
        <GhostButton href="/evaluate">Run again</GhostButton>
      </div>
    </>
  );
}
