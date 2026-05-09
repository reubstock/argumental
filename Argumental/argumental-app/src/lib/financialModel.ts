/**
 * Argumental — single source of truth for the 3-year financial model.
 *
 * Inputs live in `./financialModelInputs.json` so a single canonical file
 * drives:
 *   1. /deck slide 13 (headline strip + reach context + Y1 hero)
 *   2. /model dashboard (every table)
 *   3. /public/argumental-financial-model.xlsx (built by
 *      `scripts/build_argumental_model.py`, which reads the same JSON)
 *
 * Edit the JSON.  /deck + /model re-flow on the next request; for the
 * spreadsheet, run:
 *
 *   python3 argumental-app/scripts/build_argumental_model.py
 */

import raw from "./financialModelInputs.json";

// ── Honorarium rule → per-bout values ──────────────────────────────────
// Y1 = flat cash to attract talent on day one.
// Y2/Y3 = revenue share against per-bout voting purse to align incentives.
const honorariumRule = raw.variableCosts.honorarium;
const boutPurse = (i: number) =>
  raw.audience.liveViewers[i] *
  raw.audience.voterConversion[i] *
  raw.audience.votePrice[i];
const honorariumPerBout = [
  honorariumRule.y1FlatUSD,
  boutPurse(1) * honorariumRule.y2PctOfBoutPurse,
  boutPurse(2) * honorariumRule.y3PctOfBoutPurse,
];

// ── Inputs (flattened) ─────────────────────────────────────────────────
// Keep this object's shape stable — /deck and /model both consume it.
//
// Sponsorship is intentionally NOT modeled. Treated as upside on the deck.
export const INPUTS = {
  boutsPerYear: raw.audience.boutsPerYear,
  liveViewers: raw.audience.liveViewers,
  voterConversion: raw.audience.voterConversion,
  votePrice: raw.audience.votePrice,
  honorariumPerBout,
  productionPerBout: raw.variableCosts.productionPerBout,
  muxDeliveryRate: raw.variableCosts.muxDeliveryRate,
  muxIngestPerBout: raw.variableCosts.muxIngestPerBout,
  stripePct: raw.variableCosts.stripePct,
  stripePerVote: raw.variableCosts.stripePerVote,
  charityPct: raw.variableCosts.charityPct,
  avgLiveMins: raw.audienceBehavior.avgLiveMins,
  replayMultiplier: raw.audienceBehavior.replayMultiplier,
  avgReplayMins: raw.audienceBehavior.avgReplayMins,
};

/** Honorarium rule for display on /model and /deck. */
export const HONORARIUM_RULE = {
  y1FlatUSD: honorariumRule.y1FlatUSD,
  y2PctOfBoutPurse: honorariumRule.y2PctOfBoutPurse,
  y3PctOfBoutPurse: honorariumRule.y3PctOfBoutPurse,
};

/** Strategic targets — used as goals on the deck, not as model drivers. */
export const TARGETS = raw.targets;

export const YEAR_LABELS = raw._meta.yearLabels;

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
};

/** Total revenue = voting only. Sponsorship treated as upside, not modeled. */
export const TOTAL_REVENUE = REVENUE.voting;

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

/** Voters / bout — used by /model Inputs table. */
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
