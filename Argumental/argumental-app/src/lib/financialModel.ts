/**
 * Argumental — single source of truth for the 3-year financial model.
 *
 * Every number that flows through:
 *   1. /deck slide 13 (headline strip + reach context)
 *   2. /model dashboard (every table)
 * derives from the INPUTS constant below. Change one cell here and
 * both views update on next render.
 *
 * NOTE on the .xlsx: /scripts/build_argumental_model.py keeps its own
 * copy of these inputs because Python can't import a TS file directly.
 * If you change a driver here, mirror it there and re-run the script
 * to regenerate /public/argumental-financial-model.xlsx. (A future
 * refactor could emit a JSON inputs file from this module that the
 * Python script reads at build time — not done yet.)
 */

// ── Inputs (per year, indexed 0 = Y1, 1 = Y2, 2 = Y3) ──────────────────
export const INPUTS = {
  boutsPerYear: [48, 48, 48],
  liveViewers: [30_000, 100_000, 250_000],
  replayMultiplier: [40, 40, 40],
  voterConversion: [0.06, 0.08, 0.09],
  votePrice: [5, 5, 5],
  sponsorPerBout: [0, 30_000, 75_000],
  sponsoredPct: [0, 0.5, 1.0],
  honorariumPerBout: [25_000, 25_000, 25_000], // capped, both debaters
  productionPerBout: [12_000, 18_000, 25_000],
  avgLiveMins: [16, 18, 20],
  avgReplayMins: [4, 5, 6],
  muxDeliveryRate: [0.06, 0.06, 0.05], // $/viewer-hour
  muxIngestPerBout: [8, 8, 8],
  stripePct: [0.029, 0.029, 0.029],
  stripePerVote: [0.3, 0.3, 0.3],
  charityPct: [0.18, 0.18, 0.18],
};

/** Strategic targets — used as goals on the deck, not as model drivers. */
export const TARGETS = {
  /** Y1 stated goal — average ramps back-weighted to hit this by year end. */
  liveViewersEOY1: 100_000,
};

export const YEAR_LABELS = ["2026 (Y1)", "2027 (Y2)", "2028 (Y3)"] as const;

// ── Computed series ────────────────────────────────────────────────────
const Y = [0, 1, 2];

const votersPerBout = Y.map(
  (i) => INPUTS.liveViewers[i] * INPUTS.voterConversion[i],
);
const annualVotes = Y.map(
  (i) => INPUTS.boutsPerYear[i] * votersPerBout[i],
);

export const REVENUE = {
  voting: Y.map((i) => annualVotes[i] * INPUTS.votePrice[i]),
  sponsor: Y.map(
    (i) =>
      INPUTS.boutsPerYear[i] *
      INPUTS.sponsoredPct[i] *
      INPUTS.sponsorPerBout[i],
  ),
};

export const TOTAL_REVENUE = Y.map(
  (i) => REVENUE.voting[i] + REVENUE.sponsor[i],
);

const annualMuxDelivery = Y.map((i) => {
  const liveMinPerBout = INPUTS.liveViewers[i] * INPUTS.avgLiveMins[i];
  const replayMinPerBout =
    INPUTS.liveViewers[i] *
    INPUTS.replayMultiplier[i] *
    INPUTS.avgReplayMins[i];
  const totalMinAnnual =
    INPUTS.boutsPerYear[i] * (liveMinPerBout + replayMinPerBout);
  return (totalMinAnnual / 60) * INPUTS.muxDeliveryRate[i];
});

export const COSTS = {
  muxDelivery: annualMuxDelivery,
  muxIngest: Y.map((i) => INPUTS.boutsPerYear[i] * INPUTS.muxIngestPerBout[i]),
  stripe: Y.map(
    (i) =>
      REVENUE.voting[i] * INPUTS.stripePct[i] +
      annualVotes[i] * INPUTS.stripePerVote[i],
  ),
  charity: Y.map((i) => REVENUE.voting[i] * INPUTS.charityPct[i]),
  honoraria: Y.map(
    (i) => INPUTS.boutsPerYear[i] * INPUTS.honorariumPerBout[i],
  ),
  production: Y.map(
    (i) => INPUTS.boutsPerYear[i] * INPUTS.productionPerBout[i],
  ),
};

export const TOTAL_VARIABLE = Y.map(
  (i) =>
    COSTS.muxDelivery[i] +
    COSTS.muxIngest[i] +
    COSTS.stripe[i] +
    COSTS.charity[i] +
    COSTS.honoraria[i] +
    COSTS.production[i],
);

export const GROSS_PROFIT = Y.map(
  (i) => TOTAL_REVENUE[i] - TOTAL_VARIABLE[i],
);

/** Voters / bout — used by /model Inputs table and Unit Economics. */
export const VOTERS_PER_BOUT = votersPerBout;
export const ANNUAL_VOTES = annualVotes;

/** Total reach per bout (live + replay). */
export const TOTAL_REACH_PER_BOUT = Y.map(
  (i) => INPUTS.liveViewers[i] * (1 + INPUTS.replayMultiplier[i]),
);

// ── Format helpers ────────────────────────────────────────────────────

/** "$1.23M" / "$432K" / "-$5". Compact, deck-friendly. */
export function fmtUSD(n: number): string {
  const sign = n < 0 ? "-" : "";
  const a = Math.abs(n);
  if (a >= 1_000_000) return `${sign}$${(a / 1_000_000).toFixed(2)}M`;
  if (a >= 1_000) return `${sign}$${(a / 1_000).toFixed(0)}K`;
  return `${sign}$${a.toFixed(0)}`;
}

/** "$1,234,567" — full precision, dashboard-friendly. */
export function fmtUSDExact(n: number): string {
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.abs(Math.round(n)).toLocaleString()}`;
}

/** "1,234,567" */
export function fmtNum(n: number): string {
  return Math.round(n).toLocaleString();
}

/** "30K" / "100K" / "1.5M" — compact viewer / impression counts. */
export function fmtNumCompact(n: number): string {
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
}

/** "8.0%" */
export function fmtPct(n: number, digits = 0): string {
  return `${(n * 100).toFixed(digits)}%`;
}

/** Sum the three-year series. */
export function sum3(arr: readonly number[]): number {
  return arr[0] + arr[1] + arr[2];
}
