import Panel from "@/components/Panel";
import Link from "next/link";
import {
  DEFAULT_SCENARIO,
  SCENARIO_META,
  type ModelSeries,
  type ScenarioKey,
  fmtNum,
  fmtPct,
  fmtUSD,
  fmtUSDExact,
  getModel,
  sum3,
} from "@/lib/financialModel";

// Pre-compute both scenarios for the side-by-side summary P&L. Cheap
// (pure numerical reduction over the JSON inputs), runs once at module
// load.
const aggressiveModel = getModel("aggressive");
const conservativeModel = getModel("conservative");

export const metadata = {
  title: "Argumental — Financial Model",
  description:
    "Three-year financial model: aggressive vs conservative scenarios. Inputs, revenue, variable costs, fixed opex, EBITDA.",
};

const ALL_SCENARIOS: ScenarioKey[] = ["aggressive", "conservative"];

function isScenario(k: string | undefined): k is ScenarioKey {
  return k === "aggressive" || k === "conservative";
}

interface Props {
  searchParams: Promise<{ scenario?: string }>;
}

/**
 * /model — single-page summary of the 3-year investor model.
 *
 * Two scenarios:
 *   /model                       → default (aggressive)
 *   /model?scenario=conservative → voting-only floor case
 *
 * All numbers come from `lib/financialModel.ts` which reads
 * `lib/financialModelInputs.json`. Edit the JSON; this page re-flows.
 */
export default async function ModelPage({ searchParams }: Props) {
  const sp = await searchParams;
  const key: ScenarioKey = isScenario(sp.scenario) ? sp.scenario : DEFAULT_SCENARIO;
  const m = getModel(key);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-5 md:py-10 w-full">
      {/* Hero */}
      <div className="mb-4 md:mb-5">
        <p className="text-zinc-500 text-[10px] md:text-xs uppercase tracking-widest font-black mb-2">
          Three-Year Financial Model
        </p>
        <h1 className="text-3xl md:text-4xl font-black text-zinc-900 leading-tight">
          {SCENARIO_META[key].label} case.
        </h1>
        <p className="text-zinc-600 text-sm md:text-base mt-2 max-w-3xl">
          {SCENARIO_META[key].description}
        </p>
      </div>

      {/* Scenario tabs */}
      <ScenarioTabs current={key} />

      {/* Unit economics — single-bout view, sets up the operating
          leverage story before any tables. Updates with the toggle. */}
      <UnitEconomicsHero model={m} />

      {/* Summary P&L — both cases side-by-side at a glance. Independent
          of the toggle so investors can compare without clicking. */}
      <SummaryPLDual
        aggressive={aggressiveModel}
        conservative={conservativeModel}
      />

      {/* Detail starts here */}
      <p className="text-zinc-500 text-[10px] md:text-xs uppercase tracking-widest font-black mb-3 mt-8 md:mt-10">
        Detail for the {SCENARIO_META[key].label.toLowerCase()} case
      </p>

      {/* Headline strip — drops cumulative-revenue cell (not investor-
          relevant); the 4th cell now surfaces Y3 EBITDA margin instead. */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-y-2 border-zinc-900 mb-6 md:mb-8">
        {[
          { kicker: "Y1 Revenue (2026)", value: fmtUSD(m.totalRevenue[0]) },
          { kicker: "Y2 Revenue (2027)", value: fmtUSD(m.totalRevenue[1]) },
          { kicker: "Y3 Revenue (2028)", value: fmtUSD(m.totalRevenue[2]) },
          {
            kicker: "Y3 EBITDA Margin",
            value:
              m.totalRevenue[2] > 0
                ? fmtPct(m.ebitda[2] / m.totalRevenue[2], 0)
                : "—",
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
          </div>
        ))}
      </div>

      {/* INPUTS */}
      <div className="mb-6 md:mb-8">
        <Panel label="Inputs">
          <Row5
            cols={["Driver", "2026 (Y1)", "2027 (Y2)", "2028 (Y3)", "Notes"]}
            isHeader
          />
          {[
            { label: "Bouts / year", v: m.inputs.boutsPerYear.map(fmtNum), note: "1 / Sunday" },
            { label: "Avg live viewers / bout", v: m.inputs.liveViewers.map(fmtNum), note: "Y1 EOY peak target" },
            { label: "Post-live replay multiplier", v: m.inputs.replayMultiplier.map((n) => `${n}×`), note: "Replay views = live × this" },
            { label: "Off-platform replay %", v: [m.inputs.offPlatformReplayPct, m.inputs.offPlatformReplayPct, m.inputs.offPlatformReplayPct].map((n) => fmtPct(n)), note: "FB · TikTok · YouTube share" },
            { label: "Total reach / bout", v: m.totalReachPerBout.map(fmtNum), note: "Live + replay impressions" },
            { label: "Voter conversion", v: m.inputs.voterConversion.map((n) => fmtPct(n, 1)), note: "% of live viewers who vote" },
            { label: "Vote price", v: m.inputs.votePrice.map((n) => fmtUSD(n)), note: "Fixed · $10/wk cap" },
            { label: "Sponsor revenue / bout", v: m.inputs.sponsorPerBout.map(fmtUSD), note: "Title slot · 41× reach" },
            { label: "Sponsored bouts (% cadence)", v: m.inputs.sponsoredPct.map((n) => fmtPct(n)), note: "Brand fit ramps to full" },
            { label: "Premium subscribers", v: m.inputs.premiumSubscribersByYear.map(fmtNum), note: `$${m.inputs.premiumMonthlyPrice}/mo · archive + AMAs` },
            { label: "Ticketed events", v: m.inputs.ticketingEventsByYear.map((n) => `${n}`), note: `${m.inputs.ticketingSeatsPerEvent} seats × $${m.inputs.ticketingAvgTicketPrice}` },
            { label: "Debater honorarium / bout", v: m.inputs.honorariumPerBout.map(fmtUSD), note: "Y1 flat · Y2/Y3 % of purse" },
            { label: "Production cost / bout", v: m.inputs.productionPerBout.map(fmtUSD), note: "Studio + crew" },
            { label: "Headcount (FTE)", v: m.scenario.fixedCosts.headcount.map(fmtNum), note: "Loaded ~$185K each" },
          ].map((r) => (
            <Row5 key={r.label} cols={[r.label, ...r.v, r.note]} />
          ))}
        </Panel>
      </div>

      {/* REVENUE */}
      <div className="mb-6 md:mb-8">
        <Panel label="Revenue">
          <Row5
            cols={["Line", "2026 (Y1)", "2027 (Y2)", "2028 (Y3)", "3-Yr Total"]}
            isHeader
            accent="brand-red"
          />
          {[
            { label: "Voting", v: m.revenue.voting },
            { label: "Sponsorship", v: m.revenue.sponsor },
            { label: "Premium subscriptions", v: m.revenue.premium },
            { label: "Live event ticketing", v: m.revenue.ticketing },
            { label: "Merch", v: m.revenue.merch },
            { label: "International licensing", v: m.revenue.licensing },
            { label: "YouTube ad share", v: m.revenue.adShare },
          ]
            .filter((r) => sum3(r.v) > 0 || r.label === "Voting")
            .map((r) => (
              <Row5
                key={r.label}
                cols={[r.label, ...r.v.map(fmtUSDExact), fmtUSDExact(sum3(r.v))]}
              />
            ))}
          <Row5
            cols={[
              "Total revenue",
              ...m.totalRevenue.map(fmtUSDExact),
              fmtUSDExact(sum3(m.totalRevenue)),
            ]}
            isTotal
          />
        </Panel>
      </div>

      {/* VARIABLE COSTS */}
      <div className="mb-6 md:mb-8">
        <Panel label="Variable Costs">
          <Row5
            cols={["Line", "2026 (Y1)", "2027 (Y2)", "2028 (Y3)", "3-Yr Total"]}
            isHeader
            accent="brand-blue"
          />
          {[
            { label: "Mux delivery (live + on-platform replay)", v: m.costs.muxDelivery },
            { label: "Mux ingest", v: m.costs.muxIngest },
            { label: "Stripe processing", v: m.costs.stripe },
            { label: "Charity payout (18% of vote rev)", v: m.costs.charity },
            { label: "Debater honorariums", v: m.costs.honoraria },
            { label: "Production", v: m.costs.production },
          ].map((r) => (
            <Row5
              key={r.label}
              cols={[r.label, ...r.v.map(fmtUSDExact), fmtUSDExact(sum3(r.v))]}
            />
          ))}
          <Row5
            cols={[
              "Total variable cost",
              ...m.totalVariable.map(fmtUSDExact),
              fmtUSDExact(sum3(m.totalVariable)),
            ]}
            isTotal
          />
        </Panel>
      </div>

      {/* GROSS MARGIN */}
      <div className="mb-6 md:mb-8">
        <Panel label="Gross Margin">
          <Row5
            cols={["", "2026 (Y1)", "2027 (Y2)", "2028 (Y3)", "3-Yr Total"]}
            isHeader
          />
          <Row5
            cols={[
              "Gross profit",
              ...m.grossProfit.map(fmtUSDExact),
              fmtUSDExact(sum3(m.grossProfit)),
            ]}
            isTotal
          />
          <Row5
            cols={[
              "Gross margin %",
              ...m.grossProfit.map((g, i) =>
                m.totalRevenue[i] > 0 ? fmtPct(g / m.totalRevenue[i], 1) : "—",
              ),
              sum3(m.totalRevenue) > 0
                ? fmtPct(sum3(m.grossProfit) / sum3(m.totalRevenue), 1)
                : "—",
            ]}
          />
        </Panel>
      </div>

      {/* FIXED OPEX */}
      <div className="mb-6 md:mb-8">
        <Panel label="Fixed Opex">
          <Row5
            cols={["Line", "2026 (Y1)", "2027 (Y2)", "2028 (Y3)", "3-Yr Total"]}
            isHeader
            accent="brand-blue"
          />
          {[
            { label: "Headcount", v: m.fixed.headcount },
            { label: "Paid search & acquisition", v: m.fixed.paidSearch },
            { label: "Brand & creator marketing", v: m.fixed.brandMarketing },
            { label: "G&A, tooling, infra", v: m.fixed.gAndA },
            { label: "Legal, accounting, insurance", v: m.fixed.legalAccounting },
          ].map((r) => (
            <Row5
              key={r.label}
              cols={[r.label, ...r.v.map(fmtUSDExact), fmtUSDExact(sum3(r.v))]}
            />
          ))}
          <Row5
            cols={[
              "Total fixed opex",
              ...m.totalFixed.map(fmtUSDExact),
              fmtUSDExact(sum3(m.totalFixed)),
            ]}
            isTotal
          />
        </Panel>
      </div>

      {/* EBITDA */}
      <div className="mb-6 md:mb-8">
        <Panel label="EBITDA">
          <Row5
            cols={["", "2026 (Y1)", "2027 (Y2)", "2028 (Y3)", "3-Yr Total"]}
            isHeader
          />
          <Row5
            cols={[
              "EBITDA",
              ...m.ebitda.map(fmtUSDExact),
              fmtUSDExact(sum3(m.ebitda)),
            ]}
            isTotal
          />
          <Row5
            cols={[
              "EBITDA margin %",
              ...m.ebitda.map((e, i) =>
                m.totalRevenue[i] > 0 ? fmtPct(e / m.totalRevenue[i], 1) : "—",
              ),
              sum3(m.totalRevenue) > 0
                ? fmtPct(sum3(m.ebitda) / sum3(m.totalRevenue), 1)
                : "—",
            ]}
          />
        </Panel>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 items-start mb-3">
        <a
          href="/argumental-financial-model.xlsx"
          download
          className="bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-xs md:text-sm px-5 py-3 rounded-md transition inline-flex items-center gap-2"
        >
          Download model (.xlsx)
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
        Pre-tax. The .xlsx renders the {SCENARIO_META[DEFAULT_SCENARIO].label.toLowerCase()}{" "}
        case (default). Toggle scenarios above to see the conservative floor.
      </p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */

function ScenarioTabs({ current }: { current: ScenarioKey }) {
  return (
    <div className="inline-flex border border-zinc-300 rounded-md bg-white p-0.5 mb-5 md:mb-6">
      {ALL_SCENARIOS.map((s) => {
        const active = s === current;
        return (
          <Link
            key={s}
            href={s === DEFAULT_SCENARIO ? "/model" : `/model?scenario=${s}`}
            className={`px-4 md:px-5 py-2 rounded-md text-[11px] font-black uppercase tracking-widest transition whitespace-nowrap ${
              active
                ? "bg-black text-white"
                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
            }`}
          >
            {SCENARIO_META[s].label}
          </Link>
        );
      })}
    </div>
  );
}

function Row5({
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

/* ────────────────────────────────────────────────────────────────────── */
/* Unit economics hero — per-bout revenue + cost bars across Y1/Y2/Y3.   */
/* The whole story of the league's operating leverage in one glance.     */
/* ────────────────────────────────────────────────────────────────────── */

function UnitEconomicsHero({ model }: { model: ModelSeries }) {
  const Y = [0, 1, 2];
  const perBoutRev = Y.map(
    (i) => model.totalRevenue[i] / model.inputs.boutsPerYear[i],
  );
  const perBoutCost = Y.map(
    (i) => model.totalVariable[i] / model.inputs.boutsPerYear[i],
  );
  const perBoutContrib = Y.map((i) => perBoutRev[i] - perBoutCost[i]);
  const yearLabels = ["Y1 · 2026", "Y2 · 2027", "Y3 · 2028"];

  // Common scale across all three years so the size jump is visible.
  const maxValue = Math.max(...perBoutRev, ...perBoutCost);

  return (
    <div className="mb-6 md:mb-8">
      <Panel label="Unit Economics — Per Bout">
        <div className="p-4 md:p-6">
          <p className="text-zinc-600 text-sm md:text-base mb-5 md:mb-6 leading-relaxed">
            What a single bout earns and costs at each year&apos;s
            audience scale. Y1 runs at a loss per bout while we build
            audience; Y3 contribution margin lands at{" "}
            <span className="text-zinc-900 font-bold">
              {perBoutRev[2] > 0
                ? fmtPct(perBoutContrib[2] / perBoutRev[2], 0)
                : "—"}
            </span>
            .
          </p>
          <div className="space-y-5 md:space-y-6">
            {Y.map((i) => {
              const revPct = (perBoutRev[i] / maxValue) * 100;
              const costPct = (perBoutCost[i] / maxValue) * 100;
              const margin =
                perBoutRev[i] > 0 ? perBoutContrib[i] / perBoutRev[i] : 0;
              const profitable = perBoutContrib[i] >= 0;
              return (
                <div key={i}>
                  <div className="flex items-baseline justify-between mb-2">
                    <p className="text-zinc-900 font-black text-sm md:text-base uppercase tracking-widest">
                      {yearLabels[i]}
                    </p>
                    <p
                      className={`text-base md:text-lg font-black tabular-nums ${
                        profitable ? "text-zinc-900" : "text-brand-red"
                      }`}
                    >
                      {profitable ? "+" : ""}
                      {fmtUSDExact(perBoutContrib[i])}{" "}
                      <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
                        {profitable ? fmtPct(margin, 0) + " margin" : "loss"}
                      </span>
                    </p>
                  </div>
                  <BarRow
                    label="Revenue / bout"
                    pct={revPct}
                    color="bg-brand-red"
                    valueLabel={fmtUSD(perBoutRev[i])}
                  />
                  <BarRow
                    label="Variable cost / bout"
                    pct={costPct}
                    color="bg-brand-blue"
                    valueLabel={fmtUSD(perBoutCost[i])}
                  />
                </div>
              );
            })}
          </div>
          <p className="text-zinc-500 text-xs leading-relaxed mt-5 md:mt-6">
            Bars on a common scale. Revenue scales with audience and
            paid revenue lines; cost grows much more slowly — that&apos;s
            the operating leverage. Excludes fixed opex (see EBITDA panel
            below for the full picture).
          </p>
        </div>
      </Panel>
    </div>
  );
}

function BarRow({
  label,
  pct,
  color,
  valueLabel,
}: {
  label: string;
  pct: number;
  color: string;
  valueLabel: string;
}) {
  return (
    <div className="flex items-center gap-2 md:gap-3 mb-1.5">
      <p className="text-zinc-500 text-[10px] md:text-xs uppercase tracking-widest font-bold w-28 md:w-40 shrink-0">
        {label}
      </p>
      <div className="flex-1 h-5 md:h-6 bg-zinc-100 rounded-sm overflow-hidden relative">
        <div
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${Math.max(2, Math.min(100, pct))}%` }}
        />
      </div>
      <p className="text-zinc-900 font-black text-xs md:text-sm tabular-nums w-16 md:w-20 text-right">
        {valueLabel}
      </p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* Summary P&L — both scenarios side-by-side, always visible.            */
/* ────────────────────────────────────────────────────────────────────── */

function SummaryPLDual({
  aggressive,
  conservative,
}: {
  aggressive: ModelSeries;
  conservative: ModelSeries;
}) {
  return (
    <div className="mb-6 md:mb-8 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
      <SummaryPLCard
        title="Aggressive"
        subtitle={SCENARIO_META.aggressive.label}
        accent="brand-red"
        model={aggressive}
      />
      <SummaryPLCard
        title="Conservative"
        subtitle={SCENARIO_META.conservative.label}
        accent="brand-blue"
        model={conservative}
      />
    </div>
  );
}

function SummaryPLCard({
  title,
  accent,
  model,
}: {
  title: string;
  subtitle: string;
  accent: "brand-red" | "brand-blue";
  model: ModelSeries;
}) {
  const accentText =
    accent === "brand-red" ? "text-brand-red" : "text-brand-blue";
  const rows: { label: string; values: number[]; isTotal?: boolean }[] = [
    { label: "Revenue", values: model.totalRevenue, isTotal: false },
    { label: "Variable cost", values: model.totalVariable.map((v) => -v) },
    { label: "Gross profit", values: model.grossProfit, isTotal: true },
    { label: "Fixed opex", values: model.totalFixed.map((v) => -v) },
    { label: "EBITDA", values: model.ebitda, isTotal: true },
  ];

  return (
    <Panel label={`${title} — Summary P&L`}>
      <div className="p-4 md:p-5">
        <p
          className={`${accentText} text-[10px] uppercase tracking-widest font-black mb-3`}
        >
          {title} case
        </p>
        <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-1.5 md:gap-2 text-xs md:text-sm">
          <div className="text-zinc-400 text-[10px] uppercase tracking-widest font-black">
            Line
          </div>
          <div className="text-zinc-400 text-[10px] uppercase tracking-widest font-black text-right">
            Y1
          </div>
          <div className="text-zinc-400 text-[10px] uppercase tracking-widest font-black text-right">
            Y2
          </div>
          <div className="text-zinc-400 text-[10px] uppercase tracking-widest font-black text-right">
            Y3
          </div>
        </div>
        <div className="mt-2 border-t-2 border-zinc-900">
          {rows.map((r) => (
            <div
              key={r.label}
              className={`grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-1.5 md:gap-2 py-2 md:py-2.5 border-b border-zinc-100 ${
                r.isTotal ? "bg-zinc-50" : ""
              }`}
            >
              <div
                className={`${
                  r.isTotal
                    ? "text-zinc-900 font-black"
                    : "text-zinc-700 font-bold"
                } text-xs md:text-sm`}
              >
                {r.label}
              </div>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`tabular-nums text-right text-xs md:text-sm ${
                    r.values[i] < 0 ? "text-brand-red" : "text-zinc-900"
                  } ${r.isTotal ? "font-black" : "font-bold"}`}
                >
                  {fmtUSD(r.values[i])}
                </div>
              ))}
            </div>
          ))}
          {/* Margin row */}
          <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-1.5 md:gap-2 py-2 md:py-2.5">
            <div className="text-zinc-500 text-xs">EBITDA margin</div>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`tabular-nums text-right text-xs ${
                  model.ebitda[i] >= 0 ? "text-zinc-700" : "text-brand-red"
                }`}
              >
                {model.totalRevenue[i] > 0
                  ? fmtPct(model.ebitda[i] / model.totalRevenue[i], 0)
                  : "—"}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}
