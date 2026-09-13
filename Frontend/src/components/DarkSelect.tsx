"use client";

import { useEffect, useId, useState } from "react";
import { inputClass } from "@/components/ui";

export function DarkSelect({
  value,
  options,
  onChange,
  disabled,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const label = options.find((o) => o.value === value)?.label ?? value;
  const boxId = useId();

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [open]);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        id={boxId}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={`${inputClass} flex items-center justify-between text-left text-white disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        <span>{label || "Select"}</span>
        <span className="text-gray-500 text-xs">{open ? "▲" : "▼"}</span>
      </button>
      {open ? (
        <ul className="absolute z-30 mt-1 w-full max-h-56 overflow-auto rounded-xl border border-white/15 bg-[#12121c] py-1 shadow-2xl">
          {options.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm ${o.value === value ? "bg-indigo-500/25 text-white" : "text-gray-200 hover:bg-white/8 hover:text-white"}`}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
