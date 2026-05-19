"use client";

import { useState } from "react";
import Link from "next/link";

export interface DeckCase {
  key: "aggressive" | "conservative";
  label: string;
  totalRevenue: number[]; // length 3
  totalVariable: number[]; // length 3
  ebitda: number[]; // length 3
  boutsPerYear: number[]; // length 3
  builtInLabel: string;
  builtInItems: string[];
  altSummary: string;
}

interface Props {
  aggressive: DeckCase;
  conservative: DeckCase;
  /** Static — same in both cases. */
  liveViewersByYear: number[]; // length 3 — Y1, Y2, Y3 averages
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

const YEAR_LABELS = ["Y1 · 2026", "Y2 · 2027", "Y3 · 2028"];

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
  liveViewersByYear,
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

      {/* Unit economics — single-bout view sets up the operating-leverage
          story before any cumulative numbers. Updates with the toggle. */}
      <UnitEconomicsRow cur={cur} />

      {/* Headline strip — drops cumulative-revenue cell; 4th cell now
          surfaces Y3 EBITDA margin (the most investor-relevant single
          summary number). */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-y border-zinc-200 mb-4">
        {[
          { kicker: "Y1 Revenue", value: fmtUSD(cur.totalRevenue[0]), sub: subs[0] },
          { kicker: "Y2 Revenue", value: fmtUSD(cur.totalRevenue[1]), sub: subs[1] },
          { kicker: "Y3 Revenue", value: fmtUSD(cur.totalRevenue[2]), sub: subs[2] },
          {
            kicker: "Y3 EBITDA Margin",
            value:
              cur.totalRevenue[2] > 0
                ? fmtPct(cur.ebitda[2] / cur.totalRevenue[2], 0)
                : "—",
            sub: subs[3],
          },
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
          {fmtNumCompact(liveViewersByYear[0])} →{" "}
          {fmtNumCompact(liveViewersByYear[1])} →{" "}
          {fmtNumCompact(liveViewersByYear[2])} live viewers / bout
        </span>{" "}
        across Y1 → Y3, with a{" "}
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

/* ────────────────────────────────────────────────────────────────────── */
/* UnitEconomicsRow — per-bout revenue / cost / contribution, one tile    */
/* per year. Sits above the cumulative headline so the operating-leverage */
/* story lands first.                                                     */
/* ────────────────────────────────────────────────────────────────────── */

function UnitEconomicsRow({ cur }: { cur: DeckCase }) {
  const perBoutRev = [0, 1, 2].map(
    (i) => cur.totalRevenue[i] / cur.boutsPerYear[i],
  );
  const perBoutCost = [0, 1, 2].map(
    (i) => cur.totalVariable[i] / cur.boutsPerYear[i],
  );
  const contrib = [0, 1, 2].map((i) => perBoutRev[i] - perBoutCost[i]);

  return (
    <div className="mb-5 md:mb-6">
      <p className="text-zinc-500 text-[10px] md:text-xs uppercase tracking-widest font-black mb-3">
        Per-bout economics
      </p>
      <div className="grid grid-cols-3 gap-0 border-y border-zinc-200">
        {[0, 1, 2].map((i) => {
          const margin =
            perBoutRev[i] > 0 ? contrib[i] / perBoutRev[i] : 0;
          const profitable = contrib[i] >= 0;
          return (
            <div
              key={i}
              className="border-r last:border-r-0 border-zinc-200 px-3 md:px-4 py-4"
            >
              <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-black">
                {YEAR_LABELS[i]}
              </p>
              <div className="mt-2 space-y-0.5 text-xs md:text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-brand-red font-bold uppercase tracking-widest text-[10px]">
                    Revenue
                  </span>
                  <span className="tabular-nums text-zinc-900 font-bold">
                    {fmtUSD(perBoutRev[i])}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-brand-blue font-bold uppercase tracking-widest text-[10px]">
                    Cost
                  </span>
                  <span className="tabular-nums text-zinc-900 font-bold">
                    {fmtUSD(perBoutCost[i])}
                  </span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-zinc-200">
                <p
                  className={`tabular-nums font-black text-lg md:text-2xl leading-none ${
                    profitable ? "text-zinc-900" : "text-brand-red"
                  }`}
                >
                  {profitable ? "+" : ""}
                  {fmtUSD(contrib[i])}
                </p>
                <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-black mt-1">
                  {profitable ? `${fmtPct(margin, 0)} margin` : "loss per bout"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
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

function fmtPct(n: number, digits = 0): string {
  return `${(n * 100).toFixed(digits)}%`;
}
