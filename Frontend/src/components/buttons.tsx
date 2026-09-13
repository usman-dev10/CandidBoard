"use client";

import Link from "next/link";

const PAD = { sm: "px-4 py-2 text-sm", md: "px-6 py-3 text-sm", lg: "px-8 py-4 text-base" };

type Size = keyof typeof PAD;

const liquid = (size: Size, className: string) =>
  `liquid-btn relative inline-flex items-center justify-center whitespace-nowrap rounded-full font-semibold text-white z-0 disabled:opacity-50 disabled:pointer-events-none ${PAD[size]} ${className}`;

const ghost =
  "inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium text-gray-300 border border-white/10 hover:border-white/25 hover:text-white hover:bg-white/5 transition-all";

export function LiquidButton({
  children,
  href,
  onClick,
  className = "",
  size = "md",
  type = "button",
  disabled,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  size?: Size;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const cls = liquid(size, className);
  const style = { fontFamily: "var(--font-display)" as const };
  if (href && !disabled) {
    return (
      <Link href={href} prefetch className={cls} style={style}>
        <span className="relative z-10 whitespace-nowrap">{children}</span>
      </Link>
    );
  }
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={cls} style={style}>
      <span className="relative z-10 whitespace-nowrap">{children}</span>
    </button>
  );
}

export function GhostButton({
  children,
  href,
  onClick,
  className = "",
  type = "button",
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}) {
  const cls = `${ghost} ${className}`;
  const style = { fontFamily: "var(--font-display)" as const };
  if (href) {
    return (
      <Link href={href} prefetch className={cls} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls} style={style}>
      {children}
    </button>
  );
}

export const inputClass =
  "w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-all";
