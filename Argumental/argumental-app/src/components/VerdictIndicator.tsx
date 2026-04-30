"use client";

import { useEffect, useState } from "react";

interface Props {
  votesA: number;
  votesB: number;
  max: number;
  /** Set true once the debate clock has started ticking. */
  active?: boolean;
}

/**
 * VerdictIndicator — replaces the old brass-bell jiggle.
 *
 * Three states (idle / live / verdict) with a brief flash when a side
 * crosses the threshold. The "scale of justice" icon connects to the
 * truth-converter metaphor while staying flat dashboard-style.
 */
export default function VerdictIndicator({
  votesA,
  votesB,
  max,
  active = false,
}: Props) {
  const verdict: "A" | "B" | null =
    votesA >= max ? "A" : votesB >= max ? "B" : null;

  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (!verdict) return;
    setFlash(true);
    const id = setTimeout(() => setFlash(false), 1200);
    return () => clearTimeout(id);
  }, [verdict]);

  const ringCls =
    verdict === "A"
      ? "border-brand-red text-brand-red bg-brand-red/10"
      : verdict === "B"
        ? "border-brand-blue text-brand-blue bg-brand-blue/10"
        : active
          ? "border-zinc-300 text-zinc-700 bg-white"
          : "border-zinc-200 text-zinc-400 bg-white";

  const statusCls =
    verdict === "A"
      ? "text-brand-red"
      : verdict === "B"
        ? "text-brand-blue"
        : active
          ? "text-zinc-700"
          : "text-zinc-400";

  const status = verdict ? "Verdict" : active ? "Live" : "Waiting";
  const winnerLabel = verdict === "A" ? "Red" : verdict === "B" ? "Blue" : null;

  return (
    <div
      className={`flex flex-col items-center gap-1 ${flash ? "animate-verdict-flash" : ""}`}
    >
      <div
        className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-colors ${ringCls}`}
      >
        {/* Flat scale-of-justice icon */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="3" x2="12" y2="21" />
          <line x1="5" y1="6" x2="19" y2="6" />
          <path d="M3 13l3 -7l3 7" />
          <path d="M15 13l3 -7l3 7" />
          <path d="M3 13a3 3 0 0 0 6 0" />
          <path d="M15 13a3 3 0 0 0 6 0" />
          <line x1="8" y1="21" x2="16" y2="21" />
        </svg>
      </div>
      <span
        className={`text-[10px] font-black uppercase tracking-widest leading-none ${statusCls}`}
      >
        {status}
      </span>
      {winnerLabel && (
        <span
          className={`text-[10px] font-black uppercase tracking-widest leading-none ${statusCls}`}
        >
          {winnerLabel}
        </span>
      )}
    </div>
  );
}
