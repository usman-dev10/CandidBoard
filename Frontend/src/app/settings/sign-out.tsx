"use client";

import { useRouter } from "next/navigation";
import { LiquidButton } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { startPageTransition } from "@/lib/transition";

export function SignOutButton() {
  const { signOut } = useAuth();
  const router = useRouter();
  return (
    <LiquidButton
      onClick={async () => {
        await signOut();
        startPageTransition("/");
        router.replace("/");
      }}
    >
      Sign out
    </LiquidButton>
  );
}
