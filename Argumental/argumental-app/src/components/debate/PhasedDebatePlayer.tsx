"use client";

import MuxPlayer from "@mux/mux-player-react";
import { useEffect, useState } from "react";

interface Props {
  playbackIdA: string;
  playbackIdB: string;
  debaterAName: string;
  debaterBName: string;
  /** ISO timestamp the clock anchors to. Phase 1 begins at this moment. */
  liveStartedAt: string;
}

const PHASE_SECONDS = 6 * 60; // 360
const TOTAL_PHASES = 4;
const TOTAL_SECONDS = PHASE_SECONDS * TOTAL_PHASES; // 1440

type PhaseKind =
  | { kind: "pre"; secondsUntil: number }
  | { kind: "live"; index: 0 | 1 | 2 | 3; secondsIntoPhase: number }
  | { kind: "finished" };

const PHASES: ReadonlyArray<{
  speaker: "A" | "B";
  segment: "Opening" | "Rebuttal";
}> = [
  { speaker: "A", segment: "Opening" },
  { speaker: "B", segment: "Opening" },
  { speaker: "A", segment: "Rebuttal" },
  { speaker: "B", segment: "Rebuttal" },
];

/**
 * PhasedDebatePlayer — viewer-side dual-stream player that auto-switches
 * between two Mux live streams on a 6-minute phase clock anchored to
 * `liveStartedAt`. Format: A opens (0–6), B opens (6–12), A rebuts
 * (12–18), B rebuts (18–24). After 24:00 the bout is finished.
 *
 * Both <MuxPlayer> instances stay mounted to keep the buffers warm —
 * the inactive one is muted + visually hidden, so the swap is seamless
 * and there's no audio bleed.
 *
 * Soft enforcement only: an off-phase debater isn't physically silenced
 * (their feed is still being recorded by Mux) — they're just hidden
 * from viewers. For hard enforcement, layer LiveKit permission flips
 * on the studio side.
 */
export default function PhasedDebatePlayer({
  playbackIdA,
  playbackIdB,
  debaterAName,
  debaterBName,
  liveStartedAt,
}: Props) {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(interval);
  }, []);

  const startMs = new Date(liveStartedAt).getTime();
  const elapsedSec = (now - startMs) / 1000;
  const phase = computePhase(elapsedSec);

  // Active speaker (during pre-roll, default to A so something renders).
  const activeSpeaker: "A" | "B" =
    phase.kind === "live" ? PHASES[phase.index].speaker : "A";

  return (
    <div className="rounded-md overflow-hidden bg-black aspect-video relative">
      {/* Both players stay mounted; we toggle visibility + mute. */}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: activeSpeaker === "A" ? "block" : "none",
        }}
      >
        <MuxPlayer
          playbackId={playbackIdA}
          streamType="live"
          autoPlay
          muted={activeSpeaker !== "A"}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: activeSpeaker === "B" ? "block" : "none",
        }}
      >
        <MuxPlayer
          playbackId={playbackIdB}
          streamType="live"
          autoPlay
          muted={activeSpeaker !== "B"}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Overlay layer */}
      <div className="absolute inset-0 pointer-events-none flex flex-col">
        <TopBadge
          phase={phase}
          debaterAName={debaterAName}
          debaterBName={debaterBName}
        />
        <div className="flex-1" />
        <BottomBar phase={phase} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */

function computePhase(elapsedSec: number): PhaseKind {
  if (elapsedSec < 0) {
    return { kind: "pre", secondsUntil: Math.ceil(-elapsedSec) };
  }
  if (elapsedSec >= TOTAL_SECONDS) {
    return { kind: "finished" };
  }
  const index = Math.min(3, Math.floor(elapsedSec / PHASE_SECONDS)) as
    | 0
    | 1
    | 2
    | 3;
  const secondsIntoPhase = elapsedSec - index * PHASE_SECONDS;
  return { kind: "live", index, secondsIntoPhase };
}

function TopBadge({
  phase,
  debaterAName,
  debaterBName,
}: {
  phase: PhaseKind;
  debaterAName: string;
  debaterBName: string;
}) {
  if (phase.kind === "pre") {
    return (
      <div className="p-3 md:p-4 flex items-start justify-between">
        <span className="bg-zinc-900/80 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur">
          Starting in {formatMMSS(phase.secondsUntil)}
        </span>
      </div>
    );
  }

  if (phase.kind === "finished") {
    return (
      <div className="p-3 md:p-4 flex items-start justify-between">
        <span className="bg-zinc-900/80 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur">
          Bout finished · 24:00
        </span>
      </div>
    );
  }

  const cur = PHASES[phase.index];
  const speakerName = cur.speaker === "A" ? debaterAName : debaterBName;
  const colorPill =
    cur.speaker === "A" ? "bg-brand-red" : "bg-brand-blue";

  return (
    <div className="p-3 md:p-4 flex items-start justify-between gap-2">
      <div className="flex flex-col gap-1.5 min-w-0">
        <span
          className={`${colorPill} text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur w-fit`}
        >
          ● Live · Phase {phase.index + 1}/4 · {cur.segment}
        </span>
        <span className="text-white font-black text-lg md:text-2xl drop-shadow-lg leading-tight truncate">
          {speakerName}
        </span>
      </div>
      <CountdownPill phase={phase} />
    </div>
  );
}

function CountdownPill({
  phase,
}: {
  phase: Extract<PhaseKind, { kind: "live" }>;
}) {
  const remaining = Math.max(0, PHASE_SECONDS - phase.secondsIntoPhase);
  const isLeadOut = remaining <= 5 && remaining > 0;

  return (
    <div
      className={`text-white font-mono font-black tabular-nums px-3 py-1.5 rounded-md backdrop-blur ${
        isLeadOut
          ? "bg-brand-red text-2xl md:text-3xl animate-pulse"
          : "bg-zinc-900/80 text-base md:text-lg"
      }`}
    >
      {isLeadOut ? Math.ceil(remaining) : formatMMSS(Math.ceil(remaining))}
    </div>
  );
}

function BottomBar({ phase }: { phase: PhaseKind }) {
  return (
    <div className="px-3 md:px-4 pb-3 md:pb-4 flex gap-1.5">
      {[0, 1, 2, 3].map((i) => {
        const isActive = phase.kind === "live" && phase.index === i;
        const isDone =
          phase.kind === "finished" ||
          (phase.kind === "live" && phase.index > i);
        const fillPct =
          phase.kind === "live" && phase.index === i
            ? Math.min(100, (phase.secondsIntoPhase / PHASE_SECONDS) * 100)
            : isDone
              ? 100
              : 0;
        const speakerColor =
          PHASES[i].speaker === "A" ? "bg-brand-red" : "bg-brand-blue";

        return (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full overflow-hidden ${
              isActive || isDone ? "bg-white/20" : "bg-white/10"
            }`}
          >
            <div
              className={`h-full ${speakerColor} transition-all duration-500`}
              style={{ width: `${fillPct}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}

function formatMMSS(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
