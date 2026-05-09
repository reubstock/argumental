/**
 * Argumental — single source of truth for the 3-year financial model.
 *
 * Two scenarios live in `./financialModelInputs.json`:
 *   - aggressive   (default — all Tier 1+2+3 levers on)
 *   - conservative (voting-only floor case)
 *
 * The default scenario powers the deck headline + the .xlsx; `/model`
 * supports a `?scenario=` toggle to flip between them.
 *
 * Edit the JSON. /deck + /model re-flow on the next request. Run
 * `python3 argumental-app/scripts/build_argumental_model.py` to refresh
 * /public/argumental-financial-model.xlsx (which renders the default
 * scenario).
 */

import raw from "./financialModelInputs.json";

export type ScenarioKey = "aggressive" | "conservative";

const Y = [0, 1, 2];

// ── Scenario type (matches the JSON shape) ─────────────────────────────
interface Scenario {
  label: string;
  description: string;
  audience: {
    boutsPerYear: number[];
    liveViewers: number[];
    voterConversion: number[];
    votePrice: number[];
  };
  sponsorship: {
    sponsorPerBout: number[];
    sponsoredPct: number[];
  };
  premium: {
    subscribersByYear: number[];
    monthlyPrice: number;
  };
  ticketing: {
    eventsByYear: number[];
    seatsPerEvent: number;
    avgTicketPrice: number;
  };
  merch: { annualRevenue: number[] };
  licensing: { annualRevenue: number[] };
  adShare: { offPlatformPctOfReplay: number; cpm: number };
  variableCosts: {
    muxDeliveryRate: number[];
    muxIngestPerBout: number[];
    stripePct: number[];
    stripePerVote: number[];
    charityPct: number[];
    honorarium: {
      y1FlatUSD: number;
      y2PctOfBoutPurse: number;
      y3PctOfBoutPurse: number;
    };
    productionPerBout: number[];
  };
  fixedCosts: {
    headcount: number[];
    loadedCostPerFTE: number[];
    paidSearch: number[];
    brandMarketing: number[];
    gAndA: number[];
    legalAccounting: number[];
  };
  audienceBehavior: {
    avgLiveMins: number[];
    replayMultiplier: number[];
    avgReplayMins: number[];
  };
  targets: { liveViewersEOY1: number };
}

const SCENARIOS_RAW = raw.scenarios as Record<ScenarioKey, Scenario>;
export const DEFAULT_SCENARIO: ScenarioKey = raw._meta.defaultScenario as ScenarioKey;
export const YEAR_LABELS = raw._meta.yearLabels;

// ── Computation ────────────────────────────────────────────────────────
export interface ModelSeries {
  scenario: Scenario;
  /** Flattened input shape — same keys /model and /deck have always used. */
  inputs: {
    boutsPerYear: number[];
    liveViewers: number[];
    voterConversion: number[];
    votePrice: number[];
    honorariumPerBout: number[];
    productionPerBout: number[];
    muxDeliveryRate: number[];
    muxIngestPerBout: number[];
    stripePct: number[];
    stripePerVote: number[];
    charityPct: number[];
    avgLiveMins: number[];
    replayMultiplier: number[];
    avgReplayMins: number[];
    sponsorPerBout: number[];
    sponsoredPct: number[];
    premiumSubscribersByYear: number[];
    premiumMonthlyPrice: number;
    ticketingEventsByYear: number[];
    ticketingSeatsPerEvent: number;
    ticketingAvgTicketPrice: number;
    merchAnnual: number[];
    licensingAnnual: number[];
    offPlatformReplayPct: number;
    adShareCPM: number;
  };
  honorariumRule: {
    y1FlatUSD: number;
    y2PctOfBoutPurse: number;
    y3PctOfBoutPurse: number;
  };
  revenue: {
    voting: number[];
    sponsor: number[];
    premium: number[];
    ticketing: number[];
    merch: number[];
    licensing: number[];
    adShare: number[];
  };
  totalRevenue: number[];
  costs: {
    muxDelivery: number[];
    muxIngest: number[];
    stripe: number[];
    charity: number[];
    honoraria: number[];
    production: number[];
  };
  totalVariable: number[];
  grossProfit: number[];
  fixed: {
    headcount: number[];
    paidSearch: number[];
    brandMarketing: number[];
    gAndA: number[];
    legalAccounting: number[];
  };
  totalFixed: number[];
  ebitda: number[];
  votersPerBout: number[];
  annualVotes: number[];
  totalReachPerBout: number[];
  targets: { liveViewersEOY1: number };
}

export function getModel(key: ScenarioKey): ModelSeries {
  const s = SCENARIOS_RAW[key];

  const votersPerBout = Y.map(
    (i) => s.audience.liveViewers[i] * s.audience.voterConversion[i],
  );
  const annualVotes = Y.map(
    (i) => s.audience.boutsPerYear[i] * votersPerBout[i],
  );
  const boutPurse = Y.map((i) => votersPerBout[i] * s.audience.votePrice[i]);

  // Honoraria — Y1 flat, Y2/Y3 % of per-bout purse
  const honorariumPerBout = [
    s.variableCosts.honorarium.y1FlatUSD,
    boutPurse[1] * s.variableCosts.honorarium.y2PctOfBoutPurse,
    boutPurse[2] * s.variableCosts.honorarium.y3PctOfBoutPurse,
  ];

  // Revenue lines
  const voting = Y.map((i) => annualVotes[i] * s.audience.votePrice[i]);
  const sponsor = Y.map(
    (i) =>
      s.audience.boutsPerYear[i] *
      s.sponsorship.sponsoredPct[i] *
      s.sponsorship.sponsorPerBout[i],
  );
  const premium = Y.map(
    (i) => s.premium.subscribersByYear[i] * s.premium.monthlyPrice * 12,
  );
  const ticketing = Y.map(
    (i) =>
      s.ticketing.eventsByYear[i] *
      s.ticketing.seatsPerEvent *
      s.ticketing.avgTicketPrice,
  );
  const merch = s.merch.annualRevenue;
  const licensing = s.licensing.annualRevenue;
  const adShare = Y.map((i) => {
    const replayImpressionsPerBout =
      s.audience.liveViewers[i] * s.audienceBehavior.replayMultiplier[i];
    const annualOffPlatform =
      s.audience.boutsPerYear[i] *
      replayImpressionsPerBout *
      s.adShare.offPlatformPctOfReplay;
    return (annualOffPlatform * s.adShare.cpm) / 1000;
  });

  const totalRevenue = Y.map(
    (i) =>
      voting[i] + sponsor[i] + premium[i] + ticketing[i] + merch[i] +
      licensing[i] + adShare[i],
  );

  // Mux delivery — replay portion scaled by (1 - off-platform pct)
  const onPlatformReplayPct = 1 - s.adShare.offPlatformPctOfReplay;
  const muxDelivery = Y.map((i) => {
    const liveMin =
      s.audience.liveViewers[i] * s.audienceBehavior.avgLiveMins[i];
    const replayMin =
      s.audience.liveViewers[i] *
      s.audienceBehavior.replayMultiplier[i] *
      s.audienceBehavior.avgReplayMins[i] *
      onPlatformReplayPct;
    const totalMinAnnual =
      s.audience.boutsPerYear[i] * (liveMin + replayMin);
    return (totalMinAnnual / 60) * s.variableCosts.muxDeliveryRate[i];
  });
  const muxIngest = Y.map(
    (i) => s.audience.boutsPerYear[i] * s.variableCosts.muxIngestPerBout[i],
  );
  const stripe = Y.map(
    (i) =>
      voting[i] * s.variableCosts.stripePct[i] +
      annualVotes[i] * s.variableCosts.stripePerVote[i],
  );
  const charity = Y.map((i) => voting[i] * s.variableCosts.charityPct[i]);
  const honoraria = Y.map(
    (i) => s.audience.boutsPerYear[i] * honorariumPerBout[i],
  );
  const production = Y.map(
    (i) => s.audience.boutsPerYear[i] * s.variableCosts.productionPerBout[i],
  );
  const totalVariable = Y.map(
    (i) =>
      muxDelivery[i] + muxIngest[i] + stripe[i] + charity[i] +
      honoraria[i] + production[i],
  );

  const grossProfit = Y.map((i) => totalRevenue[i] - totalVariable[i]);

  // Fixed opex
  const headcount = Y.map(
    (i) => s.fixedCosts.headcount[i] * s.fixedCosts.loadedCostPerFTE[i],
  );
  const totalFixed = Y.map(
    (i) =>
      headcount[i] +
      s.fixedCosts.paidSearch[i] +
      s.fixedCosts.brandMarketing[i] +
      s.fixedCosts.gAndA[i] +
      s.fixedCosts.legalAccounting[i],
  );
  const ebitda = Y.map((i) => grossProfit[i] - totalFixed[i]);

  return {
    scenario: s,
    inputs: {
      boutsPerYear: s.audience.boutsPerYear,
      liveViewers: s.audience.liveViewers,
      voterConversion: s.audience.voterConversion,
      votePrice: s.audience.votePrice,
      honorariumPerBout,
      productionPerBout: s.variableCosts.productionPerBout,
      muxDeliveryRate: s.variableCosts.muxDeliveryRate,
      muxIngestPerBout: s.variableCosts.muxIngestPerBout,
      stripePct: s.variableCosts.stripePct,
      stripePerVote: s.variableCosts.stripePerVote,
      charityPct: s.variableCosts.charityPct,
      avgLiveMins: s.audienceBehavior.avgLiveMins,
      replayMultiplier: s.audienceBehavior.replayMultiplier,
      avgReplayMins: s.audienceBehavior.avgReplayMins,
      sponsorPerBout: s.sponsorship.sponsorPerBout,
      sponsoredPct: s.sponsorship.sponsoredPct,
      premiumSubscribersByYear: s.premium.subscribersByYear,
      premiumMonthlyPrice: s.premium.monthlyPrice,
      ticketingEventsByYear: s.ticketing.eventsByYear,
      ticketingSeatsPerEvent: s.ticketing.seatsPerEvent,
      ticketingAvgTicketPrice: s.ticketing.avgTicketPrice,
      merchAnnual: s.merch.annualRevenue,
      licensingAnnual: s.licensing.annualRevenue,
      offPlatformReplayPct: s.adShare.offPlatformPctOfReplay,
      adShareCPM: s.adShare.cpm,
    },
    honorariumRule: s.variableCosts.honorarium,
    revenue: { voting, sponsor, premium, ticketing, merch, licensing, adShare },
    totalRevenue,
    costs: { muxDelivery, muxIngest, stripe, charity, honoraria, production },
    totalVariable,
    grossProfit,
    fixed: {
      headcount,
      paidSearch: s.fixedCosts.paidSearch,
      brandMarketing: s.fixedCosts.brandMarketing,
      gAndA: s.fixedCosts.gAndA,
      legalAccounting: s.fixedCosts.legalAccounting,
    },
    totalFixed,
    ebitda,
    votersPerBout,
    annualVotes,
    totalReachPerBout: Y.map(
      (i) =>
        s.audience.liveViewers[i] *
        (1 + s.audienceBehavior.replayMultiplier[i]),
    ),
    targets: s.targets,
  };
}

// ── Default-scenario shortcuts (unchanged API for /deck etc.) ─────────
const DEFAULT_MODEL = getModel(DEFAULT_SCENARIO);

export const INPUTS = DEFAULT_MODEL.inputs;
export const TARGETS = DEFAULT_MODEL.targets;
export const REVENUE = DEFAULT_MODEL.revenue;
export const TOTAL_REVENUE = DEFAULT_MODEL.totalRevenue;
export const COSTS = DEFAULT_MODEL.costs;
export const TOTAL_VARIABLE = DEFAULT_MODEL.totalVariable;
export const GROSS_PROFIT = DEFAULT_MODEL.grossProfit;
export const TOTAL_REACH_PER_BOUT = DEFAULT_MODEL.totalReachPerBout;
export const ANNUAL_VOTES = DEFAULT_MODEL.annualVotes;
export const VOTERS_PER_BOUT = DEFAULT_MODEL.votersPerBout;

/** Human-readable scenario metadata for UI chrome. */
export const SCENARIO_META: Record<ScenarioKey, { label: string; description: string }> = {
  aggressive: {
    label: SCENARIOS_RAW.aggressive.label,
    description: SCENARIOS_RAW.aggressive.description,
  },
  conservative: {
    label: SCENARIOS_RAW.conservative.label,
    description: SCENARIOS_RAW.conservative.description,
  },
};

// ── Format helpers ────────────────────────────────────────────────────

export function fmtUSD(n: number): string {
  const sign = n < 0 ? "-" : "";
  const a = Math.abs(n);
  if (a >= 1_000_000) return `${sign}$${(a / 1_000_000).toFixed(2)}M`;
  if (a >= 1_000) return `${sign}$${(a / 1_000).toFixed(0)}K`;
  return `${sign}$${a.toFixed(0)}`;
}

export function fmtUSDExact(n: number): string {
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.abs(Math.round(n)).toLocaleString()}`;
}

export function fmtNum(n: number): string {
  return Math.round(n).toLocaleString();
}

export function fmtNumCompact(n: number): string {
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
}

export function fmtPct(n: number, digits = 0): string {
  return `${(n * 100).toFixed(digits)}%`;
}

export function sum3(arr: readonly number[]): number {
  return arr[0] + arr[1] + arr[2];
}
