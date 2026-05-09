import Panel from "@/components/Panel";
import Link from "next/link";
import {
  COSTS,
  GROSS_PROFIT,
  INPUTS,
  REVENUE,
  TOTAL_REACH_PER_BOUT,
  TOTAL_REVENUE,
  TOTAL_VARIABLE,
  fmtNum,
  fmtPct,
  fmtUSD,
  fmtUSDExact,
  sum3,
} from "@/lib/financialModel";

export const metadata = {
  title: "Argumental — Financial Model",
  description:
    "Three-year financial model summary: inputs, revenue, variable costs, gross margin. Source for the deck and the downloadable spreadsheet.",
};

/**
 * /model — single-page summary of the 3-year investor model.
 *
 * All numbers come from `lib/financialModel.ts`. Edit there; this page
 * re-renders. The deck headline strip imports from the same module.
 *
 * The .xlsx is built by /scripts/build_argumental_model.py and ships
 * to /public/argumental-financial-model.xlsx — Python keeps its own
 * copy of the inputs (see lib's top comment).
 */
export default function ModelPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-5 md:py-10 w-full">
      {/* Hero */}
      <div className="mb-6 md:mb-8">
        <p className="text-zinc-500 text-[10px] md:text-xs uppercase tracking-widest font-black mb-2">
          Three-Year Financial Model
        </p>
        <h1 className="text-3xl md:text-4xl font-black text-zinc-900 leading-tight">
          Inputs · Revenue · Variable Costs.
        </h1>
        <p className="text-zinc-600 text-sm md:text-base mt-2 max-w-2xl">
          The same numbers powering the deck and the spreadsheet, on one page.
          Goal: <span className="text-zinc-900 font-bold">100K live viewers</span>{" "}
          per bout by end of Year 1, with a{" "}
          <span className="text-zinc-900 font-bold">40× post-live replay</span>{" "}
          multiplier flowing through delivery cost. Revenue is voting only;
          sponsorship is treated as upside.
        </p>
      </div>

      {/* Headline strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-y-2 border-zinc-900 mb-6 md:mb-8">
        {[
          { kicker: "Y1 Revenue (2026)", value: fmtUSD(TOTAL_REVENUE[0]), sub: "Voting only" },
          { kicker: "Y2 Revenue (2027)", value: fmtUSD(TOTAL_REVENUE[1]), sub: "Audience compounding" },
          { kicker: "Y3 Revenue (2028)", value: fmtUSD(TOTAL_REVENUE[2]), sub: "Full league cadence" },
          { kicker: "3-Yr Total", value: fmtUSD(sum3(TOTAL_REVENUE)), sub: "Voting · pre-sponsor" },
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

      {/* INPUTS */}
      <div className="mb-6 md:mb-8">
        <Panel label="Inputs">
          <Row3
            cols={["Driver", "2026 (Y1)", "2027 (Y2)", "2028 (Y3)", "Notes"]}
            isHeader
          />
          {[
            {
              label: "Bouts / year",
              v: INPUTS.boutsPerYear.map(fmtNum),
              note: "1 / Sunday",
            },
            {
              label: "Avg live viewers / bout",
              v: INPUTS.liveViewers.map(fmtNum),
              note: "Y1 ramps to 100K EOY",
            },
            {
              label: "Post-live replay multiplier",
              v: INPUTS.replayMultiplier.map((n) => `${n}×`),
              note: "Replay views = live × this",
            },
            {
              label: "Total reach / bout",
              v: TOTAL_REACH_PER_BOUT.map(fmtNum),
              note: "Live + replay impressions",
            },
            {
              label: "Voter conversion",
              v: INPUTS.voterConversion.map((n) => fmtPct(n, 1)),
              note: "% of live viewers who vote",
            },
            {
              label: "Vote price",
              v: INPUTS.votePrice.map((n) => fmtUSD(n)),
              note: "Fixed · $10/wk cap",
            },
            {
              label: "Debater honorarium / bout",
              v: INPUTS.honorariumPerBout.map(fmtUSD),
              note: "Capped at $25K (both)",
            },
            {
              label: "Production cost / bout",
              v: INPUTS.productionPerBout.map(fmtUSD),
              note: "Studio + crew",
            },
          ].map((r) => (
            <Row3 key={r.label} cols={[r.label, ...r.v, r.note]} />
          ))}
        </Panel>
      </div>

      {/* REVENUE */}
      <div className="mb-6 md:mb-8">
        <Panel label="Revenue">
          <Row3
            cols={["Line", "2026 (Y1)", "2027 (Y2)", "2028 (Y3)", "3-Yr Total"]}
            isHeader
            accent="brand-red"
          />
          <Row3
            cols={[
              "Voting revenue",
              ...REVENUE.voting.map(fmtUSDExact),
              fmtUSDExact(sum3(REVENUE.voting)),
            ]}
          />
          <Row3
            cols={[
              "Total revenue",
              ...TOTAL_REVENUE.map(fmtUSDExact),
              fmtUSDExact(sum3(TOTAL_REVENUE)),
            ]}
            isTotal
          />
          <div className="px-3 md:px-5 py-3 bg-zinc-50 border-t border-zinc-100 text-zinc-500 text-xs leading-relaxed">
            Sponsorship not included. Treated as upside — the 41× total
            reach per bout justifies sponsor packages, but conservative
            modeling here assumes none.
          </div>
        </Panel>
      </div>

      {/* VARIABLE COSTS */}
      <div className="mb-6 md:mb-8">
        <Panel label="Variable Costs">
          <Row3
            cols={["Line", "2026 (Y1)", "2027 (Y2)", "2028 (Y3)", "3-Yr Total"]}
            isHeader
            accent="brand-blue"
          />
          {[
            { label: "Mux delivery (live + replay)", v: COSTS.muxDelivery },
            { label: "Mux ingest", v: COSTS.muxIngest },
            { label: "Stripe processing", v: COSTS.stripe },
            { label: "Charity payout (18% of vote rev)", v: COSTS.charity },
            { label: "Debater honorariums", v: COSTS.honoraria },
            { label: "Production", v: COSTS.production },
          ].map((r) => (
            <Row3
              key={r.label}
              cols={[r.label, ...r.v.map(fmtUSDExact), fmtUSDExact(sum3(r.v))]}
            />
          ))}
          <Row3
            cols={[
              "Total variable cost",
              ...TOTAL_VARIABLE.map(fmtUSDExact),
              fmtUSDExact(sum3(TOTAL_VARIABLE)),
            ]}
            isTotal
          />
        </Panel>
      </div>

      {/* GROSS MARGIN */}
      <div className="mb-6 md:mb-8">
        <Panel label="Gross Margin">
          <Row3
            cols={["", "2026 (Y1)", "2027 (Y2)", "2028 (Y3)", "3-Yr Total"]}
            isHeader
          />
          <Row3
            cols={[
              "Gross profit",
              ...GROSS_PROFIT.map(fmtUSDExact),
              fmtUSDExact(sum3(GROSS_PROFIT)),
            ]}
            isTotal
          />
          <Row3
            cols={[
              "Gross margin %",
              ...GROSS_PROFIT.map((g, i) =>
                TOTAL_REVENUE[i] > 0 ? fmtPct(g / TOTAL_REVENUE[i], 1) : "—",
              ),
              fmtPct(sum3(GROSS_PROFIT) / sum3(TOTAL_REVENUE), 1),
            ]}
          />
        </Panel>
      </div>

      {/* CTAs + footnote */}
      <div className="flex flex-col sm:flex-row gap-3 items-start mb-3">
        <a
          href="/argumental-financial-model.xlsx"
          download
          className="bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-xs md:text-sm px-5 py-3 rounded-md transition inline-flex items-center gap-2"
        >
          Download full model (.xlsx)
          <span aria-hidden>↓</span>
        </a>
        <Link
          href="/deck"
          className="border border-zinc-300 hover:border-black text-zinc-900 font-black uppercase tracking-widest text-xs md:text-sm px-5 py-3 rounded-md transition inline-flex items-center"
        >
          Back to deck
        </Link>
      </div>
      <p className="text-zinc-500 text-xs md:text-sm leading-relaxed max-w-3xl">
        Pre-tax. Excludes IP / licensing upside, on-demand archive monetization,
        white-label league for institutions, championship-bout ticketing, and
        merch — all deliberately omitted from the model and treated as upside.
        Full P&amp;L (with fixed opex and EBITDA) plus per-bout unit economics
        live in the spreadsheet.
      </p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */

function Row3({
  cols,
  isHeader = false,
  isTotal = false,
  accent,
}: {
  cols: string[];
  isHeader?: boolean;
  isTotal?: boolean;
  accent?: "brand-red" | "brand-blue";
}) {
  const labelCls = isHeader
    ? `text-[10px] uppercase tracking-widest font-black ${
        accent === "brand-red"
          ? "text-brand-red"
          : accent === "brand-blue"
            ? "text-brand-blue"
            : "text-zinc-500"
      }`
    : isTotal
      ? "text-zinc-900 font-black text-sm md:text-base"
      : "text-zinc-900 font-bold text-sm md:text-base";

  const numCls = isHeader
    ? "text-[10px] uppercase tracking-widest font-black text-zinc-500 text-right tabular-nums"
    : isTotal
      ? "text-zinc-900 font-black text-sm md:text-base tabular-nums text-right"
      : "text-zinc-700 text-sm md:text-base tabular-nums text-right";

  const noteCls = isHeader
    ? "text-[10px] uppercase tracking-widest font-black text-zinc-500 text-right md:text-left"
    : "text-zinc-500 text-xs text-right md:text-left";

  const rowBg = isTotal ? "bg-zinc-50" : "bg-white";
  const border = isHeader ? "border-b-2 border-zinc-900" : "border-b border-zinc-100";

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr_1.4fr] gap-2 md:gap-4 px-3 md:px-5 py-2.5 md:py-3 items-baseline ${rowBg} ${border}`}
    >
      <div className={`${labelCls} col-span-2 md:col-span-1`}>{cols[0]}</div>
      <div className={numCls}>{cols[1]}</div>
      <div className={numCls}>{cols[2]}</div>
      <div className={numCls}>{cols[3]}</div>
      <div className={cols[4] && /^[\$\-0-9]/.test(cols[4]) ? numCls : noteCls}>
        {cols[4]}
      </div>
    </div>
  );
}
