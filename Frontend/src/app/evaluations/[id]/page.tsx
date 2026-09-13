"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { GhostButton, PageFrame } from "@/components/ui";
import { RunningPanel } from "@/components/RunningPanel";
import { ReportPanel } from "@/components/ReportPanel";
import { AGENTS } from "@/lib/data";
import { getEvalApi } from "@/lib/evals-store";
import { toUiReport, type EvalApi } from "@/lib/eval-map";
import type { AgentStatus } from "@/lib/types";

const IDS = ["A1", "A2", "A3", "A4", "A5"];

function agentsFor(row: EvalApi | null) {
  const skip = Boolean(row?.report?.screens_skipped);
  const cur = row?.current_agent || "A1";
  const done = row?.status === "completed";
  return AGENTS.map((a) => {
    let status: AgentStatus = "pending";
    if (skip && (a.id === "A3" || a.id === "A4") && (done || IDS.indexOf(cur) >= IDS.indexOf("A5"))) {
      status = "skipped";
    } else if (done) {
      status = "done";
    } else if (a.id === cur) {
      status = "running";
    } else if (IDS.indexOf(a.id) < IDS.indexOf(cur)) {
      status = "done";
    }
    return { ...a, status };
  });
}

export default function EvaluationPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [row, setRow] = useState<EvalApi | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!id || id === "undefined") return;
    let stop = false;
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = async () => {
      const next = await getEvalApi(id);
      if (stop) return;
      if (!next) {
        tries += 1;
        if (tries < 8) {
          timer = setTimeout(tick, 500);
          return;
        }
        setMissing(true);
        return;
      }
      tries = 0;
      setMissing(false);
      setRow(next);
      if (next.status === "completed" || next.status === "failed") return;
      timer = setTimeout(tick, 700);
    };
    tick();
    return () => {
      stop = true;
      clearTimeout(timer);
    };
  }, [id]);

  const report = useMemo(() => (row ? toUiReport(row) : null), [row]);
  const skip = Boolean(row?.report?.screens_skipped);
  const agents = useMemo(() => agentsFor(row), [row]);
  const name = report?.candidate || row?.candidate || "Candidate";
  const role = report?.jobTitle || row?.job_title || "Role";

  if (missing) {
    return (
      <PageFrame>
        <div className="max-w-xl mx-auto glass rounded-2xl p-6">
          <p className="text-white mb-4">This evaluation was not found.</p>
          <p className="text-sm text-gray-400 mb-4">Open it from Evaluations after you run the panel. Do not use the old demo link.</p>
          <GhostButton href="/candidates">Back to candidates</GhostButton>
        </div>
      </PageFrame>
    );
  }

  if (!row) return null;

  if (row.status === "failed") {
    return (
      <PageFrame>
        <div className="max-w-xl mx-auto glass rounded-2xl p-6 space-y-4">
          <h1 className="text-2xl font-bold text-white">Evaluation failed</h1>
          <p className="text-sm text-gray-400">{row.error?.code || "The panel could not finish."}</p>
          <GhostButton href="/evaluate">Run again</GhostButton>
        </div>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <div className="max-w-3xl mx-auto">
        {row.status !== "completed" || !report ? (
          <RunningPanel
            candidate={name}
            role={role}
            skip={skip}
            agents={agents}
            eventLine={row.current_agent ? `${row.current_agent} running` : "Starting panel…"}
          />
        ) : (
          <ReportPanel report={report} skip={skip} />
        )}
      </div>
    </PageFrame>
  );
}
