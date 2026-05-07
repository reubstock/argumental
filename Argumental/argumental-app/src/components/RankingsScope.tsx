"use client";

import { useState } from "react";
import Panel from "@/components/Panel";

type Scope = "global" | "local";

/**
 * RankingsScope — segmented GLOBAL / LOCAL toggle for the Rankings page.
 *
 * Default scope is "global". When real data lands, the active scope filters
 * the underlying list. For now the body is a "Coming soon" placeholder that
 * reflects the active scope.
 */
export default function RankingsScope() {
  const [scope, setScope] = useState<Scope>("global");

  const headline =
    scope === "global"
      ? "Top debaters across every region."
      : "Top debaters in your region.";

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
            {headline}
          </p>
          <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
            Coming soon
          </span>
          <p className="text-zinc-500 text-sm max-w-md">
            Once the first bouts run, rankings populate here automatically —
            top 25 per knowledge class, plus{" "}
            {scope === "global" ? "global leaders" : "your regional leaders"}.
            Champions hold the title until they&apos;re beaten on the board.
          </p>
        </div>
      </Panel>
    </div>
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
