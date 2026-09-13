"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LiquidButton, LogoMark } from "./ui";
import { isAppPath, useAuth } from "@/lib/auth";
import { startPageTransition } from "@/lib/transition";

const APP_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/jobs", label: "Jobs" },
  { href: "/candidates", label: "Candidates" },
  { href: "/settings", label: "Settings" },
];

const MOBILE_TABS = [
  { href: "/dashboard", label: "Home" },
  { href: "/jobs", label: "Jobs" },
  { href: "/evaluate", label: "New" },
  { href: "/candidates", label: "People" },
  { href: "/settings", label: "More" },
];

function Brand({ href }: { href: string }) {
  return (
    <Link href={href} prefetch className="flex items-center gap-2 shrink-0">
      <LogoMark size={22} />
      <span className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-display)" }}>
        CandidBoard
      </span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const app = isAppPath(pathname);
  const evalOpen = pathname?.startsWith("/evaluations");

  return (
    <>
      <nav className="flex sm:hidden fixed top-3 left-3 right-3 z-50 items-center justify-between px-3 py-2 rounded-full glass">
        <Brand href={app ? "/dashboard" : "/"} />
        {app ? (
          <button
            type="button"
            onClick={async () => {
              await signOut();
              startPageTransition("/");
              router.replace("/");
            }}
            className="text-xs text-gray-300 whitespace-nowrap"
          >
            Sign out
          </button>
        ) : null}
      </nav>

      {app ? (
        <nav className="hidden sm:flex fixed top-4 left-1/2 -translate-x-1/2 z-50 items-center gap-2 px-4 py-2 rounded-full glass max-w-[96vw] flex-nowrap">
          <Brand href="/dashboard" />
          <div className="flex items-center gap-1 shrink-0">
            {APP_LINKS.map((l) => {
              const active =
                pathname === l.href ||
                pathname.startsWith(`${l.href}/`) ||
                (evalOpen && l.href === "/candidates");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  prefetch
                  className={`text-xs px-2.5 py-1.5 rounded-full whitespace-nowrap ${active ? "text-indigo-300 bg-indigo-500/15" : "text-gray-400 hover:text-white"}`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
          <LiquidButton size="sm" href="/evaluate" className="shrink-0 whitespace-nowrap">
            New evaluation
          </LiquidButton>
          <button
            type="button"
            onClick={async () => {
              await signOut();
              startPageTransition("/");
              router.replace("/");
            }}
            className="text-xs text-gray-400 hover:text-white whitespace-nowrap shrink-0"
          >
            Sign out
          </button>
        </nav>
      ) : (
        <nav className="hidden sm:flex fixed top-4 left-4 z-50 items-center">
          <div className="px-3 py-2 rounded-full glass">
            <Brand href="/" />
          </div>
        </nav>
      )}
    </>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  if (!isAppPath(pathname)) return null;
  return (
    <nav className="flex sm:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/8 px-1 pb-[max(0.4rem,env(safe-area-inset-bottom))]">
      {MOBILE_TABS.map((l) => {
        const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
        return (
          <Link
            key={l.href}
            href={l.href}
            prefetch
            className={`flex-1 py-2.5 text-center text-[11px] font-medium ${active ? "text-indigo-300" : "text-gray-400"}`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
