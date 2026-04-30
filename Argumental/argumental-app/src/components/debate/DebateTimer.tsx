"use client";

import { useEffect, useState } from "react";
import { DebatePhase } from "@/lib/types";

const PHASE_LABELS: Record<DebatePhase, string> = {
  intro_a: "Opening — Debater A",
  intro_b: "Opening — Debater B",
  rebuttal_a: "Rebuttal — Debater A",
  rebuttal_b: "Rebuttal — Debater B",
  finished: "Debate Over",
};

// Each phase is ~6 minutes (25 min total across 4 phases + transitions)
const PHASE_DURATION_SECONDS = 375;

interface Props {
  phase: DebatePhase;
  phaseEndsAt?: string;
}

export default function DebateTimer({ phase, phaseEndsAt }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(PHASE_DURATION_SECONDS);

  useEffect(() => {
    if (!phaseEndsAt || phase === "finished") return;
    const tick = () => {
      const remaining = Math.max(
        0,
        Math.floor((new Date(phaseEndsAt).getTime() - Date.now()) / 1000)
      );
      setSecondsLeft(remaining);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [phase, phaseEndsAt]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = 1 - secondsLeft / PHASE_DURATION_SECONDS;
  const isUrgent = secondsLeft <= 30 && phase !== "finished";

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
        {PHASE_LABELS[phase]}
      </span>
      <div
        className={`text-5xl font-mono font-bold tabular-nums ${
          isUrgent ? "text-brand-red animate-pulse" : "text-white"
        }`}
      >
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>
      {/* Progress bar */}
      <div className="w-64 h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            isUrgent ? "bg-brand-red" : "bg-black"
          }`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
