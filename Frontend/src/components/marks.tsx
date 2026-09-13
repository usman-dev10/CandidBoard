import type { EvalStatus } from "@/lib/types";

export function LogoMark({ size = 24 }: { size?: number }) {
  const d = size * 0.28;
  const c = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden>
      <circle cx={c - d} cy={c - d} r={size * 0.1} fill="#6366f1" />
      <circle cx={c + d} cy={c - d} r={size * 0.1} fill="#8b5cf6" opacity="0.8" />
      <circle cx={c - d} cy={c + d} r={size * 0.1} fill="#8b5cf6" opacity="0.8" />
      <circle cx={c + d} cy={c + d} r={size * 0.1} fill="#3b82f6" opacity="0.9" />
    </svg>
  );
}

export function StatusBadge({ status }: { status: EvalStatus }) {
  const config = {
    Advance: { bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.3)", text: "#4ade80", dot: "#22c55e" },
    Hold: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", text: "#fbbf24", dot: "#f59e0b" },
    Reject: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)", text: "#f87171", dot: "#ef4444" },
    Running: { bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.3)", text: "#a5b4fc", dot: "#6366f1" },
    Failed: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)", text: "#f87171", dot: "#ef4444" },
  }[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: config.bg, border: `1px solid ${config.border}`, color: config.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: config.dot }} />
      {status}
    </span>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2" style={{ fontFamily: "var(--font-display)" }}>
        {label}
      </label>
      {hint ? <p className="text-xs text-gray-500 mb-2">{hint}</p> : null}
      {children}
    </div>
  );
}

export function PageFrame({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen pt-20 sm:pt-28 pb-28 sm:pb-8 px-4 relative z-1">{children}</div>;
}

export function Disclaimer() {
  return <p className="text-xs text-amber-200/80 mb-4">Advisory only. A human makes the hiring decision.</p>;
}
