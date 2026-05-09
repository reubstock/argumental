import Panel from "@/components/Panel";
import Link from "next/link";

export const metadata = {
  title: "Argumental — Financial Model",
  description:
    "Three-year financial model summary: inputs, revenue, variable costs, gross margin. Source for the deck and the downloadable spreadsheet.",
};

/**
 * /model — a single-page summary of the 3-year investor model.
 *
 * Numbers here MUST stay in lockstep with:
 *   1. /deck financial-model slide (headline strip)
 *   2. /public/argumental-financial-model.xlsx (built by build_argumental_model.py)
 *
 * If you change a driver, update all three. The spreadsheet is the
 * artifact investors edit; this page is the dashboard view of the
 * same numbers; the deck slide is the elevator pitch of the same.
 */

// ── Inputs (per year) ────────────────────────────────────────────────────
const INPUTS = {
  boutsPerYear: [48, 48, 48],
  liveViewers: [30_000, 100_000, 250_000],
  replayMultiplier: [40, 40, 40],
  voterConversion: [0.06, 0.08, 0.09],
  votePrice: [5, 5, 5],
  sponsorPerBout: [0, 30_000, 75_000],
  sponsoredPct: [0, 0.5, 1.0],
  honorariumPerBout: [25_000, 25_000, 25_000], // capped at $25K / bout (both debaters)
  productionPerBout: [12_000, 18_000, 25_000],
  avgLiveMins: [16, 18, 20],
  avgReplayMins: [4, 5, 6],
  muxDeliveryRate: [0.06, 0.06, 0.05], // $/viewer-hour
  muxIngestPerBout: [8, 8, 8],
  stripePct: [0.029, 0.029, 0.029],
  stripePerVote: [0.3, 0.3, 0.3],
  charityPct: [0.18, 0.18, 0.18],
};

const YEARS = [0, 1, 2] as const;
type YearIdx = (typeof YEARS)[number];

// ── Computed series ──────────────────────────────────────────────────────
const votersPerBout = YEARS.map(
  (i) => INPUTS.liveViewers[i] * INPUTS.voterConversion[i],
);
const annualVotes = YEARS.map((i) => INPUTS.boutsPerYear[i] * votersPerBout[i]);

const REVENUE = {
  voting: YEARS.map((i) => annualVotes[i] * INPUTS.votePrice[i]),
  sponsor: YEARS.map(
    (i) => INPUTS.boutsPerYear[i] * INPUTS.sponsoredPct[i] * INPUTS.sponsorPerBout[i],
  ),
};
const totalRevenue = YEARS.map((i) => REVENUE.voting[i] + REVENUE.sponsor[i]);

const annualMuxDelivery = YEARS.map((i) => {
  const liveMinPerBout = INPUTS.liveViewers[i] * INPUTS.avgLiveMins[i];
  const replayMinPerBout =
    INPUTS.liveViewers[i] * INPUTS.replayMultiplier[i] * INPUTS.avgReplayMins[i];
  const totalMinAnnual =
    INPUTS.boutsPerYear[i] * (liveMinPerBout + replayMinPerBout);
  return (totalMinAnnual / 60) * INPUTS.muxDeliveryRate[i];
});

const COSTS = {
  muxDelivery: annualMuxDelivery,
  muxIngest: YEARS.map((i) => INPUTS.boutsPerYear[i] * INPUTS.muxIngestPerBout[i]),
  stripe: YEARS.map(
    (i) =>
      REVENUE.voting[i] * INPUTS.stripePct[i] +
      annualVotes[i] * INPUTS.stripePerVote[i],
  ),
  charity: YEARS.map((i) => REVENUE.voting[i] * INPUTS.charityPct[i]),
  honoraria: YEARS.map(
    (i) => INPUTS.boutsPerYear[i] * INPUTS.honorariumPerBout[i],
  ),
  production: YEARS.map(
    (i) => INPUTS.boutsPerYear[i] * INPUTS.productionPerBout[i],
  ),
};
const totalVariable = YEARS.map(
  (i) =>
    COSTS.muxDelivery[i] +
    COSTS.muxIngest[i] +
    COSTS.stripe[i] +
    COSTS.charity[i] +
    COSTS.honoraria[i] +
    COSTS.production[i],
);
const grossProfit = YEARS.map((i) => totalRevenue[i] - totalVariable[i]);

// ── Formatters ───────────────────────────────────────────────────────────
function fmtUSD(n: number): string {
  const sign = n < 0 ? "-" : "";
  const a = Math.abs(n);
  if (a >= 1_000_000) return `${sign}$${(a / 1_000_000).toFixed(2)}M`;
  if (a >= 1_000) return `${sign}$${(a / 1_000).toFixed(0)}K`;
  return `${sign}$${a.toFixed(0)}`;
}
function fmtUSDExact(n: number): string {
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.abs(Math.round(n)).toLocaleString()}`;
}
function fmtNum(n: number): string {
  return Math.round(n).toLocaleString();
}
function fmtPct(n: number, digits = 0): string {
  return `${(n * 100).toFixed(digits)}%`;
}
function sum3(arr: number[]): number {
  return arr[0] + arr[1] + arr[2];
}

// ── Page ─────────────────────────────────────────────────────────────────
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
          multiplier flowing through delivery cost and sponsor pricing.
        </p>
      </div>

      {/* Headline strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-y-2 border-zinc-900 mb-6 md:mb-8">
        {[
          { kicker: "Y1 Revenue (2026)", value: fmtUSD(totalRevenue[0]), sub: "Voting only" },
          { kicker: "Y2 Revenue (2027)", value: fmtUSD(totalRevenue[1]), sub: "First sponsors" },
          { kicker: "Y3 Revenue (2028)", value: fmtUSD(totalRevenue[2]), sub: "Full sponsor cadence" },
          { kicker: "3-Yr Total", value: fmtUSD(sum3(totalRevenue)), sub: "Pre-tax, pre-IP" },
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
              v: YEARS.map((i) =>
                fmtNum(INPUTS.liveViewers[i] * (1 + INPUTS.replayMultiplier[i])),
              ),
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
              label: "Sponsor revenue / bout",
              v: INPUTS.sponsorPerBout.map(fmtUSD),
              note: "Title slot · 41× reach",
            },
            {
              label: "Sponsored bouts (% of cadence)",
              v: INPUTS.sponsoredPct.map((n) => fmtPct(n)),
              note: "Brand fit ramps to full",
            },
            {
              label: "Debater honorarium / bout",
              v: INPUTS.honorariumPerBout.map(fmtUSD),
              note: "Both debaters",
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
          {[
            { label: "Voting revenue", v: REVENUE.voting },
            { label: "Sponsor revenue", v: REVENUE.sponsor },
          ].map((r) => (
            <Row3
              key={r.label}
              cols={[r.label, ...r.v.map(fmtUSDExact), fmtUSDExact(sum3(r.v))]}
            />
          ))}
          <Row3
            cols={[
              "Total revenue",
              ...totalRevenue.map(fmtUSDExact),
              fmtUSDExact(sum3(totalRevenue)),
            ]}
            isTotal
          />
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
              ...totalVariable.map(fmtUSDExact),
              fmtUSDExact(sum3(totalVariable)),
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
              ...grossProfit.map(fmtUSDExact),
              fmtUSDExact(sum3(grossProfit)),
            ]}
            isTotal
          />
          <Row3
            cols={[
              "Gross margin %",
              ...grossProfit.map((g, i) =>
                totalRevenue[i] > 0 ? fmtPct(g / totalRevenue[i], 1) : "—",
              ),
              fmtPct(sum3(grossProfit) / sum3(totalRevenue), 1),
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
  // 5 columns total — Driver | Y1 | Y2 | Y3 | (Notes or 3-Yr Total)
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

  const rowBg = isTotal ? "bg-zinc-50" : isHeader ? "bg-white" : "bg-white";
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
