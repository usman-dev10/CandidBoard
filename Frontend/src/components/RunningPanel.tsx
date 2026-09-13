"use client";

import { AGENTS } from "@/lib/data";
import { GhostButton } from "@/components/ui";
import type { AgentStatus } from "@/lib/types";

export function RunningPanel({
  candidate,
  role,
  skip,
  agents,
  eventLine,
}: {
  candidate: string;
  role: string;
  skip: boolean;
  agents: { id: string; name: string; subtitle: string; status: AgentStatus }[];
  eventLine: string;
}) {
  return (
    <>
      <p className="text-xs tracking-widest text-indigo-400 uppercase mb-2">Evaluation running</p>
      <h1 className="text-3xl font-bold text-white mb-2">Evaluating {candidate} for {role}</h1>
      <p className="text-xs text-indigo-300 mb-6">{eventLine}</p>
      {skip ? <p className="text-xs text-amber-300 mb-4">Deep screen skipped because job-fit was below 60.</p> : null}
      <div className="glass rounded-2xl p-6 space-y-4">
        {agents.map((a) => (
          <div key={a.id} className={`flex gap-3 ${a.status === "pending" ? "opacity-40" : ""}`}>
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-xs">
              {a.status === "done" ? "✓" : a.status === "skipped" ? "–" : a.status === "running" ? "●" : a.id.replace("A", "")}
            </div>
            <div>
              <p className="text-sm text-white">{a.name}</p>
              <p className="text-xs text-gray-500">{AGENTS.find((x) => x.id === a.id)?.subtitle}</p>
            </div>
          </div>
        ))}
        <GhostButton href="/candidates">Cancel</GhostButton>
      </div>
    </>
  );
}
