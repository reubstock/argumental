"use client";

import { useState } from "react";
import Panel from "@/components/Panel";
import {
  GLOBAL_RANKINGS,
  getChampion,
  getChallengers,
  type Ranked,
} from "@/lib/rankings";

type Scope = "global" | "local";

/**
 * RankingsScope — segmented GLOBAL / LOCAL toggle for the Rankings page.
 *
 * Default scope is "global" → renders the live ranked list backed by
 * lib/rankings.ts. "local" stays as a placeholder until regional data lands.
 */
export default function RankingsScope() {
  const [scope, setScope] = useState<Scope>("global");

  return (
    <div className="flex flex-col gap-6">
      {/* Toggle */}
      <div
        role="tablist"
        aria-label="Ranking scope"
        className="inline-flex self-start border border-zinc-300 rounded-md bg-white p-0.5"
      >
        <ScopeButton
          active={scope === "global"}
          onClick={() => setScope("global")}
        >
          Global
        </ScopeButton>
        <ScopeButton
          active={scope === "local"}
          onClick={() => setScope("local")}
        >
          Local
        </ScopeButton>
      </div>

      {scope === "global" ? <GlobalBoard /> : <LocalPlaceholder />}
    </div>
  );
}

function GlobalBoard() {
  const champion = getChampion();
  const challengers = getChallengers();

  return (
    <div className="flex flex-col gap-3">
      {champion && <ChampionCard r={champion} />}
      <div className="flex flex-col">
        {challengers.map((r, i) => (
          <ChallengerRow
            key={r.rank}
            r={r}
            // top edge handled by border-t on each row except first
            isFirst={i === 0}
          />
        ))}
      </div>
      <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold mt-2">
        Top {GLOBAL_RANKINGS.length - 1} contenders shown · refreshed weekly
      </p>
    </div>
  );
}

function ChampionCard({ r }: { r: Ranked }) {
  return (
    <Panel className="overflow-hidden">
      {/* Belt as hero strip across the top */}
      <div className="bg-zinc-50 border-b border-zinc-200 flex items-center justify-center px-6 py-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/argumental-belt.png"
          alt="Argumental Tier 1 championship belt"
          className="h-24 md:h-32 w-auto"
          loading="lazy"
        />
      </div>

      <div className="p-5 md:p-6 flex items-center gap-4 md:gap-5">
        <Avatar
          name={r.name}
          photo={r.photo}
          side="A"
          size="lg"
        />
        <div className="flex-1 min-w-0">
          <p className="text-brand-red text-[10px] md:text-xs uppercase tracking-widest font-black mb-1">
            World Champion
          </p>
          <h2 className="text-zinc-900 font-black text-xl md:text-2xl leading-tight">
            {r.name}
          </h2>
          <p className="text-zinc-600 text-sm md:text-base mt-1.5">
            {r.subjects.join(" · ")}
          </p>
        </div>
      </div>
    </Panel>
  );
}

function ChallengerRow({ r, isFirst }: { r: Ranked; isFirst: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 md:gap-4 px-3 md:px-4 py-3 md:py-3.5 bg-white ${
        isFirst
          ? "border border-zinc-200 rounded-t-md"
          : "border border-t-0 border-zinc-200"
      } ${r.rank === 10 ? "rounded-b-md" : ""}`}
    >
      <span className="text-zinc-400 font-black tabular-nums text-base md:text-lg w-7 md:w-8 shrink-0 text-right">
        {String(r.rank).padStart(2, "0")}
      </span>
      <Avatar
        name={r.name}
        photo={r.photo}
        side={r.rank % 2 === 1 ? "A" : "B"}
        size="sm"
      />
      <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-baseline md:justify-between md:gap-4">
        <p className="text-zinc-900 font-bold text-sm md:text-base leading-snug">
          {r.name}
        </p>
        <p className="text-zinc-500 text-xs md:text-sm md:text-right">
          {r.subjects.join(" · ")}
        </p>
      </div>
    </div>
  );
}

function Avatar({
  name,
  photo,
  side,
  size,
}: {
  name: string;
  photo: string | null;
  side: "A" | "B";
  size: "sm" | "lg";
}) {
  const border = side === "A" ? "border-brand-red" : "border-brand-blue";
  const dim =
    size === "lg"
      ? "w-16 h-16 md:w-20 md:h-20"
      : "w-10 h-10 md:w-12 md:h-12";
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (photo) {
    return (
      <div
        className={`${dim} rounded-full overflow-hidden border-2 ${border} shrink-0`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt={name}
          className="w-full h-full object-cover object-top"
        />
      </div>
    );
  }
  return (
    <div
      className={`${dim} rounded-full border-2 ${border} bg-zinc-50 flex items-center justify-center shrink-0`}
      aria-label={name}
    >
      <span className="text-zinc-700 font-black text-xs md:text-sm tracking-wider">
        {initials}
      </span>
    </div>
  );
}

function LocalPlaceholder() {
  return (
    <Panel>
      <div className="p-10 md:p-16 text-center flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a1a1aa"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="20" x2="20" y2="20" />
            <rect x="6" y="12" width="3" height="8" />
            <rect x="11" y="6" width="3" height="14" />
            <rect x="16" y="9" width="3" height="11" />
          </svg>
        </div>
        <p className="text-zinc-900 font-bold text-base md:text-lg">
          Top debaters in your region.
        </p>
        <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
          Coming soon
        </span>
        <p className="text-zinc-500 text-sm max-w-md">
          Once the first regional bouts run, your local leaderboard populates
          here automatically — top 25 debaters in your region across every
          knowledge class.
        </p>
      </div>
    </Panel>
  );
}

function ScopeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-[11px] font-black uppercase tracking-widest transition ${
        active
          ? "bg-black text-white"
          : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
      }`}
    >
      {children}
    </button>
  );
}
