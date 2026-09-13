"use client";

import { AuthProvider } from "@/lib/auth";
import { LandingScene } from "./LandingScene";
import { MobileNav, Navbar } from "./Navbar";
import { PageTransition } from "./PageTransition";
import { PrefetchRoutes } from "./PrefetchRoutes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LandingScene />
      <div className="min-h-screen bg-transparent relative z-1">
        <PrefetchRoutes />
        <Navbar />
        <MobileNav />
        <PageTransition />
        {children}
      </div>
    </AuthProvider>
  );
}
