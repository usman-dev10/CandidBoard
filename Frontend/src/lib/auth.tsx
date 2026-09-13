"use client";

import { createContext, useCallback, useContext } from "react";

const AuthContext = createContext({
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const signOut = useCallback(async () => {
    await fetch("/api/logout", { method: "POST" });
  }, []);
  return <AuthContext.Provider value={{ signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export function isAppPath(pathname: string | null) {
  if (!pathname) return false;
  return ["/dashboard", "/evaluate", "/jobs", "/candidates", "/settings", "/evaluations"].some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}
