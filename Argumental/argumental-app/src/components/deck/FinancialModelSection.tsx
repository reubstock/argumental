"use client";

import { useState } from "react";
import Link from "next/link";

export interface DeckCase {
  key: "aggressive" | "conservative";
  label: string;
  totalRevenue: number[]; // length 3
  builtInLabel: string;
  builtInItems: string[];
  altSummary: string;
}

interface Props {
  aggressive: DeckCase;
  conservative: DeckCase;
  /** Static — same in both cases. */
  liveViewersY1Avg: number;
  liveViewersEOY1Target: number;
  replayMultiplier: number;
}

const SUB_LABELS: Record<DeckCase["key"], string[]> = {
  aggressive: [
    "Voting + ad share",
    "Sponsors · subs · ticketing",
    "Full revenue stack",
    "Pre-tax",
  ],
  conservative: [
    "Voting only",
    "Audience compounding",
    "Full league cadence",
    "Voting · pre-sponsor",
  ],
};

/**
 * FinancialModelSection — toggleable headline strip + built-in list for
 * deck slide 13. Clicking the segmented toggle swaps:
 *   · Y1/Y2/Y3/3-Yr revenue values
 *   · the strip's sub-captions
 *   · the "built into this case" panel
 *   · the alt-case summary panel + link
 *
 * Both scenarios are computed server-side from lib/financialModel.ts
 * and passed in as props.
 */
export default function FinancialModelSection({
  aggressive,
  conservative,
  liveViewersY1Avg,
  liveViewersEOY1Target,
  replayMultiplier,
}: Props) {
  const [active, setActive] = useState<DeckCase["key"]>("aggressive");
  const cur = active === "aggressive" ? aggressive : conservative;
  const alt = active === "aggressive" ? conservative : aggressive;
  const subs = SUB_LABELS[active];

  return (
    <>
      {/* Case toggle */}
      <div className="flex items-center gap-3 flex-wrap mb-4 md:mb-5">
        <p className="text-zinc-500 text-[10px] md:text-xs uppercase tracking-widest font-black">
          Case
        </p>
        <div
          role="tablist"
          aria-label="Financial-model scenario"
          className="inline-flex border-2 border-zinc-900 rounded-md bg-white p-0.5"
        >
          {(["aggressive", "conservative"] as const).map((k) => {
            const on = k === active;
            const label = k === "aggressive" ? aggressive.label : conservative.label;
            return (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActive(k)}
                className={`px-4 md:px-5 py-2 rounded-md text-[11px] md:text-xs font-black uppercase tracking-widest transition whitespace-nowrap ${
                  on
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Headline strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-y border-zinc-200 mb-4">
        {[
          { kicker: "Y1 Revenue", value: fmtUSD(cur.totalRevenue[0]), sub: subs[0] },
          { kicker: "Y2 Revenue", value: fmtUSD(cur.totalRevenue[1]), sub: subs[1] },
          { kicker: "Y3 Revenue", value: fmtUSD(cur.totalRevenue[2]), sub: subs[2] },
          { kicker: "3-Yr Total", value: fmtUSD(sum3(cur.totalRevenue)), sub: subs[3] },
        ].map((s) => (
          <div
            key={s.kicker}
            className="border-r last:border-r-0 border-zinc-200 px-3 md:px-4 py-4 md:py-5"
          >
            <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-black">
              {s.kicker}
            </p>
            <p className="text-zinc-900 font-black text-2xl md:text-4xl tabular-nums leading-none mt-1.5">
              {s.value}
            </p>
            <p className="text-zinc-500 text-[11px] mt-1.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Reach context */}
      <p className="text-zinc-500 text-xs md:text-sm leading-relaxed mb-6 md:mb-8">
        Driven by{" "}
        <span className="text-zinc-900 font-bold">
          {fmtNumCompact(liveViewersY1Avg)} →{" "}
          {fmtNumCompact(liveViewersEOY1Target)} live viewers / bout
        </span>{" "}
        across Y1, with a{" "}
        <span className="text-zinc-900 font-bold">
          {replayMultiplier}× replay multiplier
        </span>
        {" "}— total reach of{" "}
        <span className="text-zinc-900 font-bold">
          {1 + replayMultiplier}× live
        </span>{" "}
        per bout. Toggle the case above to flip between the aggressive
        plan and the conservative voting-only floor.
      </p>

      {/* Active case + alt summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Active case — built in */}
        <div className="border-2 border-zinc-900 rounded-md p-4 md:p-5 bg-white">
          <p
            className={`text-[10px] uppercase tracking-widest font-black mb-2 ${
              active === "aggressive" ? "text-brand-red" : "text-brand-blue"
            }`}
          >
            {cur.builtInLabel}
          </p>
          <ul className="text-zinc-700 text-sm md:text-base space-y-1.5 leading-relaxed">
            {cur.builtInItems.map((it) => (
              <li key={it}>· {it}</li>
            ))}
          </ul>
        </div>

        {/* Alt case prose + toggle hint */}
        <div className="border border-zinc-200 rounded-md p-4 md:p-5 bg-zinc-50">
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-black mb-2">
            {alt.label} case
          </p>
          <p className="text-zinc-700 text-sm md:text-base leading-relaxed">
            {alt.altSummary}
          </p>
          <button
            type="button"
            onClick={() =>
              setActive(active === "aggressive" ? "conservative" : "aggressive")
            }
            className="text-zinc-900 hover:text-black text-xs font-black uppercase tracking-widest mt-3 inline-flex items-center gap-1.5"
          >
            Switch to {alt.label.toLowerCase()} →
          </button>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 items-start flex-wrap">
        <Link
          href={
            active === "aggressive"
              ? "/model"
              : "/model?scenario=conservative"
          }
          className="bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-xs md:text-sm px-5 py-3 rounded-md transition inline-flex items-center gap-2"
        >
          View on-page summary
          <span aria-hidden>→</span>
        </Link>
        <a
          href="/argumental-financial-model.xlsx"
          download
          className="border border-zinc-300 hover:border-black text-zinc-900 font-black uppercase tracking-widest text-xs md:text-sm px-5 py-3 rounded-md transition inline-flex items-center gap-2"
        >
          Download .xlsx
          <span aria-hidden>↓</span>
        </a>
        <p className="text-zinc-500 text-xs md:text-sm leading-relaxed max-w-2xl pt-2">
          On-page summary shows full P&amp;L for the selected case.
          Spreadsheet renders the aggressive case (default).
        </p>
      </div>
    </>
  );
}

/* ── Local format helpers (avoid pulling the whole lib into the client) ── */

function fmtUSD(n: number): string {
  const sign = n < 0 ? "-" : "";
  const a = Math.abs(n);
  if (a >= 1_000_000) return `${sign}$${(a / 1_000_000).toFixed(2)}M`;
  if (a >= 1_000) return `${sign}$${(a / 1_000).toFixed(0)}K`;
  return `${sign}$${a.toFixed(0)}`;
}

function fmtNumCompact(n: number): string {
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
}

function sum3(arr: readonly number[]): number {
  return arr[0] + arr[1] + arr[2];
}
