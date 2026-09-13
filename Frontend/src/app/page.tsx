import Link from "next/link";
import { AGENTS, DISCLAIMER } from "@/lib/data";
import { GhostButton, LiquidButton, LogoMark, StatusBadge } from "@/components/ui";

export default function LandingPage() {
  return (
    <div className="min-h-screen relative z-1">
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16 sm:pt-0 relative z-1">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-indigo-300 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            AI-Powered Hiring Panels
          </div>
          <h1 className="text-4xl sm:text-7xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-display)" }}>
            CandidBoard
          </h1>
          <p className="text-base sm:text-lg text-gray-400 mb-4 max-w-xl mx-auto">
            You paste the job and a resume. Five agents extract skills, score fit, prepare questions, and one orchestrator compiles Advance / Hold / Reject.
          </p>
          <p className="text-xs text-amber-200/80 mb-10">{DISCLAIMER}</p>
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <LiquidButton size="lg" href="/unlock">Get started →</LiquidButton>
            <GhostButton href="/#how">See how it works</GhostButton>
          </div>
          <div className="mt-10 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 glass rounded-full px-3 sm:px-4 py-2 max-w-full">
            <span className="text-sm text-white">Alex Khan</span>
            <span className="text-xs text-gray-500">Backend Engineer</span>
            <span className="text-sm font-bold">70</span>
            <StatusBadge status="Hold" />
          </div>
        </div>
      </section>
      <section id="how" className="py-24 px-4 max-w-5xl mx-auto relative z-1">
        <h2 className="text-3xl font-bold text-white text-center mb-3">See how it works</h2>
        <p className="text-sm text-gray-500 text-center mb-8 sm:mb-12">Tap a specialist to read their role on the panel.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {AGENTS.map((a) => (
            <div key={a.id} tabIndex={0} className="group glass rounded-xl p-4 text-center min-h-[7.5rem] sm:min-h-[10rem] flex flex-col justify-start pt-5 transition-colors hover:border-indigo-400/40 hover:bg-indigo-500/10 focus:outline-none focus:border-indigo-400/40 active:bg-indigo-500/10">
              <p className="text-xs text-indigo-400 mb-1">{a.id}</p>
              <p className="text-sm font-semibold text-white">{a.name}</p>
              <p className="text-xs text-gray-400 mt-3 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity duration-200">
                {a.subtitle}
              </p>
            </div>
          ))}
        </div>
      </section>
      <footer className="border-t border-white/6 py-10 px-6 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto relative z-1">
        <div className="flex items-center gap-2">
          <LogoMark size={18} />
          <span className="text-sm font-semibold text-white">CandidBoard</span>
        </div>
        <div className="flex gap-4 text-xs text-gray-500">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </footer>
    </div>
  );
}
