import type { ReactNode } from "react";
import Image from "next/image";
import {
  INPUTS,
  TARGETS,
  fmtNumCompact,
  getModel,
} from "@/lib/financialModel";
import FinancialModelSection, {
  type DeckCase,
} from "@/components/deck/FinancialModelSection";

// Pre-compute both scenarios for the client-side toggle on the
// Financial Model slide.
const aggressiveModel = getModel("aggressive");
const conservativeModel = getModel("conservative");

const AGGRESSIVE_CASE: DeckCase = {
  key: "aggressive",
  label: "Aggressive",
  totalRevenue: aggressiveModel.totalRevenue,
  builtInLabel: "Built into the aggressive case",
  builtInItems: [
    "Voting revenue gated by live viewer reach",
    "Sponsorship — title slots, category exclusives",
    "Premium tier — $7/mo archive + AMAs",
    "Live championship ticketing",
    "Merch + international licensing",
    "80% off-platform replay (FB · TikTok · YouTube)",
    "YouTube ad share at $1.50 CPM",
    "Honoraria: $10K Y1, then 5%/3% of purse",
    "Lean headcount: 4 → 7 → 10 FTE",
    "Mux enterprise rate by Y3",
  ],
  altSummary:
    "Voting revenue only. No sponsorship, no platform extensions, no off-platform distribution. Headcount runs full at 14 FTE by Y3. Shows the league's economics before any growth lever is pulled.",
};

const CONSERVATIVE_CASE: DeckCase = {
  key: "conservative",
  label: "Conservative",
  totalRevenue: conservativeModel.totalRevenue,
  builtInLabel: "Built into the conservative case",
  builtInItems: [
    "Voting revenue gated by live viewer reach",
    "18% charity payout as COGS",
    "Honoraria: $10K Y1, then 5%/3% of purse",
    "Mux delivers 100% of viewing (live + replay)",
    "Headcount runs full: 4 → 8 → 14 FTE",
    "$10K/mo paid search Y1, ramping",
    "No sponsorship modeled",
    "No premium subs · ticketing · merch · licensing",
    "No off-platform distribution or ad share",
  ],
  altSummary:
    "All Tier 1+2+3 levers active: sponsorship, premium tier, ticketing, merch, licensing, 80% off-platform replay, YouTube ad share, lean headcount, Mux enterprise rate by Y3. Closes the EBITDA gap.",
};

export const metadata = {
  title: "Argumental — Investor Deck",
  description:
    "The Path to Peace Begins with an Argument. A 15-section investor brief on the world's first professional debate league.",
};

const TOTAL = 15;

/**
 * Editorial-style single-page deck. Numbered badges, HR dividers,
 * whitespace-driven rhythm — modeled after yes-movement.vercel.app/fund.html.
 */
function Section({
  n,
  title,
  kicker,
  children,
}: {
  n: number;
  title: string;
  kicker?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={`s${n}`}
      className="border-t border-zinc-200 px-4 md:px-12 py-10 md:py-20"
    >
      <div className="max-w-4xl mx-auto">
        <header className="flex items-baseline gap-3 md:gap-6 mb-5 md:mb-10">
          <span className="text-zinc-400 text-base md:text-lg font-black tabular-nums">
            {String(n).padStart(2, "0")}
          </span>
          <span className="text-zinc-400 text-[10px] md:text-xs uppercase tracking-widest font-black">
            {String(n).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
          </span>
        </header>
        {kicker && (
          <p className="text-black text-[11px] md:text-xs uppercase tracking-widest font-black mb-3">
            {kicker}
          </p>
        )}
        <h2 className="text-2xl md:text-4xl font-black leading-tight tracking-tight mb-6 md:mb-10 text-zinc-900">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

/**
 * GlobeIcon — classic desk globe: tilted blue-and-green sphere with a
 * gold meridian arc cradling it. Used on The League slide.
 */
function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 120 140"
      className="w-24 h-28 md:w-32 md:h-36"
      aria-label="Global league"
    >
      <defs>
        <radialGradient id="ocean" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#7DC3F0" />
          <stop offset="55%" stopColor="#1E6FB8" />
          <stop offset="100%" stopColor="#0B3A66" />
        </radialGradient>
        <radialGradient id="brass" cx="30%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#FCE38A" />
          <stop offset="50%" stopColor="#D4A017" />
          <stop offset="100%" stopColor="#7C5A02" />
        </radialGradient>
        <radialGradient id="brassDark" cx="50%" cy="20%" r="90%">
          <stop offset="0%" stopColor="#D4A017" />
          <stop offset="100%" stopColor="#5C3F01" />
        </radialGradient>
        <radialGradient id="gloss" cx="32%" cy="22%" r="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.55" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="132" rx="26" ry="4.5" fill="url(#brassDark)" />
      <ellipse cx="60" cy="129" rx="26" ry="4.5" fill="url(#brass)" />
      <rect x="56" y="116" width="8" height="14" fill="url(#brass)" />
      <ellipse cx="60" cy="116" rx="6" ry="2" fill="#FCE38A" />
      <g transform="rotate(-18 60 60)">
        <path
          d="M60 18 A42 42 0 0 1 60 102 L66 108 A48 48 0 0 0 66 12 Z"
          fill="url(#brassDark)"
        />
        <path
          d="M60 18 L60 22 A38 38 0 0 1 60 98 L60 102 A42 42 0 0 0 60 18 Z"
          fill="url(#brass)"
          opacity="0.55"
        />
        <circle cx="60" cy="60" r="38" fill="url(#ocean)" />
        <g fill="#3F8B3F" opacity="0.95">
          <path d="M36 42 Q44 36 50 42 Q52 50 46 56 Q40 58 34 52 Q32 46 36 42 Z" />
          <path d="M44 66 Q50 66 50 74 Q48 84 42 86 Q38 80 40 72 Q42 68 44 66 Z" />
          <path d="M62 50 Q70 50 70 60 Q72 70 64 78 Q58 78 58 70 Q56 60 62 50 Z" />
          <path d="M62 36 Q78 32 86 40 Q88 48 80 50 Q70 50 62 46 Q60 40 62 36 Z" />
          <path d="M82 70 Q90 70 90 76 Q86 80 80 78 Q78 74 82 70 Z" />
        </g>
        <g stroke="white" strokeWidth="0.5" fill="none" opacity="0.25">
          <ellipse cx="60" cy="60" rx="38" ry="10" />
          <ellipse cx="60" cy="60" rx="38" ry="20" />
          <ellipse cx="60" cy="60" rx="10" ry="38" />
          <ellipse cx="60" cy="60" rx="22" ry="38" />
          <line x1="60" y1="22" x2="60" y2="98" />
          <line x1="22" y1="60" x2="98" y2="60" />
        </g>
        <circle cx="60" cy="60" r="38" fill="url(#gloss)" />
        <circle cx="60" cy="60" r="38" fill="none" stroke="#0B3A66" strokeWidth="0.8" opacity="0.7" />
      </g>
    </svg>
  );
}

function Headshot({
  src,
  alt,
  side,
}: {
  src: string;
  alt: string;
  side: "A" | "B";
}) {
  const border = side === "A" ? "border-brand-red" : "border-brand-blue";
  return (
    <div
      className={`w-11 h-11 md:w-14 md:h-14 rounded-full overflow-hidden border-2 ${border} shrink-0`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover object-top"
      />
    </div>
  );
}

function StatusPill({ kind }: { kind: "aired" | "booked" | "pipeline" }) {
  const styles: Record<typeof kind, string> = {
    aired:
      "bg-emerald-100 text-emerald-800 border border-emerald-300",
    booked: "bg-zinc-900 text-white",
    pipeline: "bg-white text-zinc-500 border border-zinc-300",
  } as Record<"aired" | "booked" | "pipeline", string>;
  return (
    <span
      className={`${styles[kind]} text-[9px] md:text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded-full whitespace-nowrap`}
    >
      {kind === "aired"
        ? "● Aired"
        : kind === "booked"
          ? "Booked"
          : "Pipeline"}
    </span>
  );
}

export default function DeckPage() {
  return (
    <div className="bg-white text-zinc-900">
      {/* 01 — Cover */}
      <section
        id="s1"
        className="px-4 md:px-12 py-12 md:py-28 min-h-[70vh] flex flex-col"
      >
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
          <header className="mb-8 md:mb-20">
            <span className="text-zinc-400 text-[10px] md:text-xs uppercase tracking-widest font-black">
              Investor Brief · 2026
            </span>
          </header>
          <div className="flex-1 flex flex-col justify-center gap-5 md:gap-8">
            <Image
              src="/logo.png"
              alt="Argumental"
              width={200}
              height={200}
              priority
              className="w-28 sm:w-36 md:w-44 h-auto"
            />
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[0.95]">
              Argumental
            </h1>
            <p className="text-lg sm:text-xl md:text-3xl font-bold text-zinc-700 leading-snug max-w-3xl">
              The Path to Peace Begins with an Argument.
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest border border-zinc-300 text-zinc-700 px-3 py-1.5 rounded-md">
                The UFC of Ideas
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — Problem (with charity flywheel folded in) */}
      <Section
        n={2}
        kicker="The Problem"
        title="The world has never been more divided — and you only ever hear one side of it."
      >
        <p className="text-zinc-600 text-lg md:text-xl leading-relaxed mb-8">
          Algorithms reward outrage. Hosts amplify their own politics.
          Counterpoints are buried. Audiences are starved for the moment when
          two opposing ideas actually meet — civilly, on the same stage, in
          real time.
        </p>
        <ul className="text-zinc-700 text-base md:text-lg leading-relaxed space-y-2 mb-10">
          <li>· Polarization at all-time highs across democracies.</li>
          <li>· Cable news and podcasts are mostly homogenous echo chambers.</li>
          <li>· Formal debate has no modern televised home.</li>
          <li>· No one is producing must-watch ideological combat at scale.</li>
        </ul>
        <div className="border-t border-zinc-200 pt-6">
          <p className="text-[10px] md:text-xs uppercase tracking-widest font-black text-zinc-900 mb-2">
            Mission flywheel
          </p>
          <p className="text-zinc-700 text-base md:text-lg leading-relaxed max-w-3xl">
            18% of every bout&apos;s proceeds goes to the winner&apos;s chosen
            charity. Every vote is a contribution to civic life — entertainment
            and learning that actually does something.
          </p>
        </div>
      </Section>

      {/* 03 — Insight */}
      <Section
        n={3}
        kicker="The Insight"
        title="Audiences love conflict — and they learn from it."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-zinc-700 text-base md:text-lg leading-relaxed">
          <div>
            <p className="font-black uppercase tracking-widest text-[10px] md:text-xs text-zinc-900 mb-2">
              Combat sports prove the appetite
            </p>
            <p>
              One-on-one stakes are the most reliable format in entertainment.
              UFC, boxing, F1 — winner declared, every time.
            </p>
          </div>
          <div>
            <p className="font-black uppercase tracking-widest text-[10px] md:text-xs text-zinc-900 mb-2">
              Formal debate proves the depth
            </p>
            <p>
              People retain ideas more deeply when they hear them argued
              against. Adversarial structure beats lecture for retention.
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="font-black uppercase tracking-widest text-[10px] md:text-xs text-zinc-900 mb-2">
              No one has built the league
            </p>
            <p>
              No televised, social-native, pay-per-vote debate league exists.
              We are building it.
            </p>
          </div>
        </div>
      </Section>

      {/* 04 — The Product (Product + Format merged) */}
      <Section
        n={4}
        kicker="The Product"
        title="Weekly title bouts between opposing thinkers — judged by the audience."
      >
        <p className="text-zinc-600 text-lg md:text-xl leading-relaxed mb-10 max-w-3xl">
          Live one-on-one debates on the most charged questions of the day.
          No moderator. No filter. The crowd decides who wins. 24 minutes,
          four phases, one winner.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { n: "01", label: "Opening A", side: "red" },
            { n: "02", label: "Opening B", side: "blue" },
            { n: "03", label: "Rebuttal A", side: "red" },
            { n: "04", label: "Rebuttal B", side: "blue" },
          ].map((p) => (
            <div key={p.n} className="border-t-2 border-zinc-900 pt-3">
              <span
                className={`text-2xl md:text-3xl font-black tabular-nums ${p.side === "red" ? "text-brand-red" : "text-brand-blue"}`}
              >
                {p.n}
              </span>
              <p className="text-zinc-900 font-bold text-sm md:text-base mt-1">
                {p.label}
              </p>
              <p className="text-zinc-500 text-xs mt-0.5 tabular-nums">6 min</p>
            </div>
          ))}
        </div>
        <div className="border-t border-zinc-200 pt-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-sm md:text-base">
          {[
            { k: "Cadence", v: "Every Sunday · 8 PM ET" },
            { k: "Home", v: "argumental.com" },
            { k: "Distribution", v: "YouTube · TikTok · Instagram" },
            { k: "Vote price", v: "$5 per vote · 1 vote per viewer" },
            { k: "Charity cut", v: "18% to winner's chosen charity" },
            { k: "Judging", v: "Audience-decided. The crowd is the judge." },
          ].map((row) => (
            <div key={row.k}>
              <p className="text-[10px] uppercase tracking-widest font-black text-zinc-400">
                {row.k}
              </p>
              <p className="text-zinc-900 font-bold mt-1">{row.v}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 05 — Sample Bouts (with AIRED / BOOKED / PIPELINE status) */}
      <Section
        n={5}
        kicker="Sample Bouts"
        title="The most charged questions of the day."
      >
        <ul className="divide-y divide-zinc-200 border-y border-zinc-200">
          {[
            {
              topic: "Does Israel Have the Right to Exist?",
              status: "aired" as const,
              outcome: "Shapiro def. AOC · 58 / 42",
              a: { name: "Ben Shapiro", photo: "/shapiro.jpg" },
              b: { name: "Alexandria Ocasio-Cortez", photo: "/aoc.jpg" },
            },
            {
              topic: "The US Should Support Universal Basic Income.",
              status: "booked" as const,
              outcome: null,
              a: { name: "Vivek Ramaswamy", photo: "/debaters/ramaswamy.jpg" },
              b: { name: "Andrew Yang", photo: "/debaters/yang.jpg" },
            },
            {
              topic: "A Woman is a Person with 2 X Chromosomes.",
              status: "booked" as const,
              outcome: null,
              a: { name: "Matt Walsh", photo: "/debaters/walsh.jpg" },
              b: { name: "Judith Butler", photo: "/debaters/butler.jpg" },
            },
            {
              topic: "The US Should Defund the Police.",
              status: "booked" as const,
              outcome: null,
              a: { name: "Ilhan Omar", photo: "/debaters/omar.jpg" },
              b: { name: "Pete Hegseth", photo: "/debaters/hegseth.jpg" },
            },
            {
              topic: "America Must Remain a Country of Immigrants.",
              status: "pipeline" as const,
              outcome: null,
              a: { name: "TBD", photo: null },
              b: { name: "TBD", photo: null },
            },
            {
              topic: "America Is Becoming an Authoritarian State.",
              status: "pipeline" as const,
              outcome: null,
              a: { name: "TBD", photo: null },
              b: { name: "TBD", photo: null },
            },
          ].map((bout, i) => (
            <li key={i} className="py-4 flex items-center gap-3 md:gap-4">
              {bout.a.photo ? (
                <Headshot src={bout.a.photo} alt={bout.a.name} side="A" />
              ) : (
                <div className="w-11 h-11 md:w-14 md:h-14 rounded-full border-2 border-brand-red bg-zinc-50 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <StatusPill kind={bout.status} />
                  {bout.outcome && (
                    <span className="text-zinc-500 text-[10px] md:text-xs uppercase tracking-widest font-bold">
                      {bout.outcome}
                    </span>
                  )}
                </div>
                <p className="text-zinc-900 font-bold text-base md:text-lg leading-snug">
                  {bout.topic}
                </p>
                <p className="text-xs md:text-sm mt-1">
                  <span className="text-brand-red font-semibold">
                    {bout.a.name}
                  </span>
                  <span className="text-zinc-400"> vs </span>
                  <span className="text-brand-blue font-semibold">
                    {bout.b.name}
                  </span>
                </p>
              </div>
              {bout.b.photo ? (
                <Headshot src={bout.b.photo} alt={bout.b.name} side="B" />
              ) : (
                <div className="w-11 h-11 md:w-14 md:h-14 rounded-full border-2 border-brand-blue bg-zinc-50 shrink-0" />
              )}
            </li>
          ))}
        </ul>
      </Section>

      {/* 06 — The League */}
      <Section
        n={6}
        kicker="The League"
        title="Rankings. Titles. World-class champions."
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-10 items-center mb-10 md:mb-14">
          <p className="md:col-span-3 text-zinc-600 text-lg md:text-xl leading-relaxed">
            Champions ranked by region. Titles defended within knowledge-area
            classes — like weight classes in MMA. A discoverable, defendable
            hierarchy of the world&apos;s best debaters.
          </p>
          <figure className="md:col-span-2 flex flex-col items-center md:items-start gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/argumental-belt.png"
              alt="Argumental Tier 1 championship belt"
              className="w-full max-w-[320px] h-auto"
              loading="lazy"
            />
            <figcaption className="text-[10px] uppercase tracking-widest font-black text-zinc-400 text-center md:text-left">
              The Argumental Tier 1 championship belt
            </figcaption>
          </figure>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <div>
            <p className="text-[10px] md:text-xs uppercase tracking-widest font-black text-zinc-900 border-b border-zinc-200 pb-2 mb-4">
              Knowledge classes
            </p>
            <ul className="text-zinc-700 text-base md:text-lg leading-relaxed space-y-1.5">
              <li>· Foreign Policy</li>
              <li>· Economics</li>
              <li>· Culture</li>
              <li>· Science</li>
              <li>· Faith</li>
              <li>· Tech &amp; AI</li>
            </ul>
          </div>
          <div>
            <p className="text-[10px] md:text-xs uppercase tracking-widest font-black text-zinc-900 border-b border-zinc-200 pb-2 mb-4">
              Regional rankings
            </p>
            <div className="flex items-center gap-5">
              <ul className="text-zinc-700 text-base md:text-lg leading-relaxed space-y-1.5 flex-1">
                <li>· US East</li>
                <li>· US West</li>
                <li>· Europe</li>
                <li>· Asia-Pacific</li>
                <li>· MENA</li>
                <li>· Latin America</li>
              </ul>
              <GlobeIcon />
            </div>
          </div>
        </div>
      </Section>

      {/* 07 — Comparables */}
      <Section
        n={7}
        kicker="Comparables"
        title="What purpose-built leagues prove."
      >
        <ul className="divide-y divide-zinc-200 border-y border-zinc-200 mb-8">
          {[
            { name: "UFC", note: "$0 → $9B by inventing the category." },
            {
              name: "F1 / Drive to Survive",
              note: "Format-first storytelling rebuilt the sport globally.",
            },
            {
              name: "Pickleball PPA",
              note: "From garage sport to professional tour in under a decade.",
            },
            {
              name: "Fortnite Champion Series",
              note: "Native-internet competition with audience-first economics.",
            },
          ].map((c) => (
            <li
              key={c.name}
              className="py-4 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6"
            >
              <p className="text-zinc-900 font-bold text-base md:text-lg">
                {c.name}
              </p>
              <p className="text-zinc-600 text-sm md:text-base md:col-span-2">
                {c.note}
              </p>
            </li>
          ))}
        </ul>
        <p className="text-zinc-700 text-base md:text-lg leading-relaxed max-w-3xl">
          Common thread:{" "}
          <span className="text-zinc-900 font-bold">
            format-first, individual stars, social-native distribution.
          </span>{" "}
          Argumental does for ideas what UFC did for combat sports.
        </p>
      </Section>

      {/* 08 — Competitors */}
      <Section
        n={8}
        kicker="Competitors"
        title="Who's in the space — and why none of them is a league."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mb-8">
          <div>
            <p className="text-[10px] md:text-xs uppercase tracking-widest font-black text-zinc-900 border-b border-zinc-200 pb-2 mb-3">
              Direct — structured debate
            </p>
            <ul className="text-zinc-700 text-sm md:text-base leading-relaxed space-y-1.5">
              <li>· The Soho Forum (NYC · Oxford-style · monthly)</li>
              <li>· Open to Debate (fmr. Intelligence Squared US)</li>
              <li>· Munk Debates (Canada · podcast scale)</li>
              <li>· Cambridge &amp; Oxford Unions</li>
            </ul>
          </div>
          <div>
            <p className="text-[10px] md:text-xs uppercase tracking-widest font-black text-zinc-900 border-b border-zinc-200 pb-2 mb-3">
              Adjacent — long-form interview
            </p>
            <ul className="text-zinc-700 text-sm md:text-base leading-relaxed space-y-1.5">
              <li>· Joe Rogan · Lex Fridman</li>
              <li>· Honestly with Bari Weiss</li>
              <li>· Triggernometry · Modern Wisdom</li>
              <li>· Sam Harris · Making Sense</li>
            </ul>
          </div>
          <div>
            <p className="text-[10px] md:text-xs uppercase tracking-widest font-black text-zinc-900 border-b border-zinc-200 pb-2 mb-3">
              Web-native debate-ish
            </p>
            <ul className="text-zinc-700 text-sm md:text-base leading-relaxed space-y-1.5">
              <li>· Jubilee Media · Surrounded / Middle Ground</li>
              <li>· Whatever podcast · multi-guest livestreams</li>
              <li>· Twitch streams (Hasan, Destiny)</li>
            </ul>
          </div>
          <div>
            <p className="text-[10px] md:text-xs uppercase tracking-widest font-black text-zinc-900 border-b border-zinc-200 pb-2 mb-3">
              Where Argumental wins
            </p>
            <ul className="text-zinc-700 text-sm md:text-base leading-relaxed space-y-1.5">
              <li>· Format-first <span className="text-zinc-500">league with rankings &amp; titles</span></li>
              <li>· Pay-per-vote <span className="text-zinc-500">zero CAC at unit level</span></li>
              <li>· Social-native <span className="text-zinc-500">from day one, not retrofitted</span></li>
              <li>· Charity-aligned <span className="text-zinc-500">civic mission, not just entertainment</span></li>
            </ul>
          </div>
        </div>
        <p className="text-zinc-700 text-base md:text-lg leading-relaxed max-w-3xl">
          Every entry above is a show. Argumental is the league that hosts the
          shows — durable IP via rankings, defended titles, and an archive that
          compounds.
        </p>
      </Section>

      {/* 09 — Possible Acquirers */}
      <Section
        n={9}
        kicker="Possible Acquirers"
        title="Exit paths through every category of buyer."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mb-8">
          <div>
            <p className="text-[10px] md:text-xs uppercase tracking-widest font-black text-brand-red border-b border-zinc-200 pb-2 mb-3">
              Sports &amp; entertainment leagues
            </p>
            <ul className="text-zinc-700 text-sm md:text-base leading-relaxed space-y-1.5">
              <li>· TKO Group <span className="text-zinc-500">(UFC + WWE)</span></li>
              <li>· Endeavor</li>
              <li>· Wasserman</li>
              <li>· MLP / PPA Pickleball</li>
            </ul>
          </div>
          <div>
            <p className="text-[10px] md:text-xs uppercase tracking-widest font-black text-brand-blue border-b border-zinc-200 pb-2 mb-3">
              Streamers
            </p>
            <ul className="text-zinc-700 text-sm md:text-base leading-relaxed space-y-1.5">
              <li>· Netflix <span className="text-zinc-500">(Drive-to-Survive playbook)</span></li>
              <li>· Amazon Prime Video</li>
              <li>· Apple TV+ · YouTube · Spotify</li>
              <li>· SiriusXM <span className="text-zinc-500">(Stern, Stitcher precedents)</span></li>
            </ul>
          </div>
          <div>
            <p className="text-[10px] md:text-xs uppercase tracking-widest font-black text-zinc-900 border-b border-zinc-200 pb-2 mb-3">
              News &amp; media
            </p>
            <ul className="text-zinc-700 text-sm md:text-base leading-relaxed space-y-1.5">
              <li>· Fox Corp · News Corp</li>
              <li>· Comcast / NBCUniversal</li>
              <li>· Warner Bros Discovery <span className="text-zinc-500">(CNN, Max)</span></li>
              <li>· NYT · Substack · The Free Press</li>
            </ul>
          </div>
          <div>
            <p className="text-[10px] md:text-xs uppercase tracking-widest font-black text-zinc-900 border-b border-zinc-200 pb-2 mb-3">
              Strategic
            </p>
            <ul className="text-zinc-700 text-sm md:text-base leading-relaxed space-y-1.5">
              <li>· X / xAI <span className="text-zinc-500">(long-form public discourse)</span></li>
              <li>· LinkedIn / Microsoft</li>
              <li>· Mission-aligned foundations <span className="text-zinc-500">(Knight, Charles Koch Institute)</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-zinc-200 pt-5">
          <p className="text-[10px] md:text-xs uppercase tracking-widest font-black text-zinc-900 mb-2">
            Precedent transactions
          </p>
          <ul className="text-zinc-700 text-sm md:text-base leading-relaxed space-y-1">
            <li>· Endeavor + UFC merger → <span className="font-bold text-zinc-900">~$21B</span> combined</li>
            <li>· Netflix / WWE Raw → <span className="font-bold text-zinc-900">$5B / 10 yr</span></li>
            <li>· Spotify / Joe Rogan exclusivity → <span className="font-bold text-zinc-900">~$200M</span></li>
            <li>· Pickleball MLP / PPA rounds → <span className="font-bold text-zinc-900">$50–100M valuations</span> (2022–24)</li>
          </ul>
        </div>
      </Section>

      {/* 10 — Why Now (compressed to stats) */}
      <Section
        n={10}
        kicker="Why Now"
        title="The conditions have never been better."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          {[
            {
              stat: "60-year high",
              label: "Polarization",
              note: "Cross-party affective polarization (Pew · ANES) at a peak unmatched since the modern survey era.",
            },
            {
              stat: "165 years",
              label: "Since Lincoln–Douglas",
              note: "No televised, format-first debate league has succeeded it. The vacuum is real.",
            },
            {
              stat: "30M+ /week",
              label: "Long-form audio listeners",
              note: "Rogan + Fridman + Tucker + adjacent — proof of mass appetite for hours-long ideological content.",
            },
            {
              stat: "$250B / yr",
              label: "Creator economy by 2028",
              note: "Niche formats can scale globally without owning a network — the algorithm does the distribution.",
            },
          ].map((c, i) => (
            <div key={i}>
              <p
                className={`text-3xl md:text-5xl font-black tabular-nums leading-none ${i % 2 === 0 ? "text-brand-red" : "text-brand-blue"}`}
              >
                {c.stat}
              </p>
              <p className="text-zinc-900 font-bold text-base md:text-lg mt-2">
                {c.label}
              </p>
              <p className="text-zinc-600 text-sm md:text-base mt-1 leading-relaxed">
                {c.note}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* 11 — Team (placeholders for user to fill) */}
      <Section
        n={11}
        kicker="Team"
        title="The people building it."
      >
        <ul className="divide-y divide-zinc-200 border-y border-zinc-200 mb-6">
          {[
            {
              name: "Reuben Steiger",
              role: "Founder · CEO",
              bio: "[Add 3–5 line bio: prior companies, exits, domain credibility, and why this person · this market · now.]",
            },
            {
              name: "[Co-founder / CTO]",
              role: "Co-founder · Engineering",
              bio: "[Add technical lead — Mux / LiveKit / Stripe stack already built. This is the person who shipped it.]",
            },
            {
              name: "[Head of Production]",
              role: "Production · Live ops",
              bio: "[Add media production credibility — live TV, sports production, or studio operations background.]",
            },
            {
              name: "[Debate-world advisor]",
              role: "Advisor",
              bio: "[Add a Soho Forum / Open to Debate / Munk / Union president — credentializes the format with the institutional debate world.]",
            },
            {
              name: "[Civic / charity advisor]",
              role: "Advisor",
              bio: "[Add credibility on the 18%-to-charity mission — foundation board member or civic-tech leader.]",
            },
          ].map((p, i) => (
            <li key={i} className="py-5 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6">
              <div>
                <p className="text-zinc-900 font-bold text-base md:text-lg">
                  {p.name}
                </p>
                <p className="text-zinc-500 text-xs md:text-sm uppercase tracking-widest font-bold mt-0.5">
                  {p.role}
                </p>
              </div>
              <p className="text-zinc-600 text-sm md:text-base md:col-span-2 leading-relaxed">
                {p.bio}
              </p>
            </li>
          ))}
        </ul>
        <p className="text-zinc-500 text-xs md:text-sm italic">
          Placeholders above — replace with actual founder / advisor bios
          before sharing externally.
        </p>
      </Section>

      {/* 12 — Traction & Validation */}
      <Section
        n={12}
        kicker="Traction"
        title="The league is already live."
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          {[
            { stat: "1", label: "Bout settled", sub: "Israel · Shapiro def. AOC" },
            { stat: "$107K", label: "Pot Y1 first bout", sub: "$19K to FIDF" },
            { stat: "10", label: "Charities surfaced", sub: "Backers wired through" },
            { stat: "100%", label: "Stack shipped", sub: "Mux · Stripe · LiveKit" },
          ].map((s, i) => (
            <div key={i} className="border-t-2 border-zinc-900 pt-3">
              <p
                className={`text-2xl md:text-3xl font-black tabular-nums ${i % 2 === 0 ? "text-brand-red" : "text-brand-blue"}`}
              >
                {s.stat}
              </p>
              <p className="text-zinc-900 font-bold text-sm md:text-base mt-1">
                {s.label}
              </p>
              <p className="text-zinc-500 text-xs mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
        <ul className="divide-y divide-zinc-200 border-y border-zinc-200 mb-6">
          {[
            {
              h: "Live product",
              p: "argumental.vercel.app — homepage, voting, wallet, charities, rankings, outcomes archive, and the deck itself.",
            },
            {
              h: "First bout in the archive",
              p: "Israel — Shapiro defeated Ocasio-Cortez, 58 / 42, on a $107,320 pot. $19,318 routed to Friends of the IDF.",
            },
            {
              h: "Production stack live",
              p: "Dual-stream Mux player with auto-phase switching, Stripe Checkout wallet, LiveKit studio room — all shipped.",
            },
            {
              h: "Investor-grade model published",
              p: "Two scenarios (aggressive / conservative), downloadable .xlsx with editable assumption cells. argumental.vercel.app/model.",
            },
            {
              h: "Charity partners surfaced",
              p: "10 backed charity profiles live — FIDF, UNRWA USA, Humanity Forward, Job Creators, ADF, Trans Lifeline, EJI, COPS, AllMEP, FMEP.",
            },
          ].map((c, i) => (
            <li key={i} className="py-4 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6">
              <p className="text-zinc-900 font-bold text-base md:text-lg">
                {c.h}
              </p>
              <p className="text-zinc-600 text-sm md:text-base md:col-span-2 leading-relaxed">
                {c.p}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* 13 — The Plan (Plan + Growth merged) */}
      <Section
        n={13}
        kicker="The Plan"
        title="Six months of programming. Audiences who bring their own."
      >
        {/* Year 1 hero stat */}
        <div className="border-y-2 border-zinc-900 mb-8 py-6 md:py-8">
          <p className="text-zinc-500 text-[10px] md:text-xs uppercase tracking-widest font-black mb-2">
            Year 1 Goal
          </p>
          <p className="text-zinc-900 font-black text-5xl md:text-7xl tabular-nums leading-none">
            {fmtNumCompact(TARGETS.liveViewersEOY1)}
          </p>
          <p className="text-zinc-700 text-base md:text-lg mt-3 leading-relaxed">
            Live viewers per bout by end of Year 1 — base case for the 3-year
            model. Each bout is then replayed{" "}
            <span className="text-zinc-900 font-bold">
              {INPUTS.replayMultiplier[0]}× more times
            </span>{" "}
            in clips and on-demand archive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mb-8">
          <div>
            <p className="text-[10px] md:text-xs uppercase tracking-widest font-black text-zinc-900 border-b border-zinc-200 pb-2 mb-3">
              What we ship
            </p>
            <ul className="text-zinc-700 text-sm md:text-base leading-relaxed space-y-2">
              <li>· <span className="font-bold text-zinc-900">24+ bouts</span> — one headline match every Sunday for six months</li>
              <li>· <span className="font-bold text-zinc-900">4–6 knowledge classes</span> launched with founding champions</li>
              <li>· <span className="font-bold text-zinc-900">Argumental.com</span> — voting, charity payouts, archive, leaderboards</li>
              <li>· <span className="font-bold text-zinc-900">Distribution machine</span> — native clipping into YouTube, TikTok, Instagram for every bout</li>
            </ul>
          </div>
          <div>
            <p className="text-[10px] md:text-xs uppercase tracking-widest font-black text-zinc-900 border-b border-zinc-200 pb-2 mb-3">
              How audiences arrive
            </p>
            <ul className="text-zinc-700 text-sm md:text-base leading-relaxed space-y-2">
              <li>· <span className="font-bold text-zinc-900">Paid top-of-class debaters</span> — per-bout honorariums; the league pays its talent</li>
              <li>· <span className="font-bold text-zinc-900">$10K / month paid search</span> — Google + Meta against the demand that already exists</li>
              <li>· <span className="font-bold text-zinc-900">Recruits with audiences</span> — each debater brings 100K–10M followers and promotes their own bout</li>
              <li>· <span className="font-bold text-zinc-900">Flywheel</span> — bigger names → bigger audiences → bigger sponsor packages → bigger names</li>
            </ul>
          </div>
        </div>
        <p className="text-zinc-700 text-base md:text-lg leading-relaxed max-w-3xl">
          Acquisition cost falls toward{" "}
          <span className="text-zinc-900 font-bold">near zero per viewer</span>{" "}
          once the format compounds — debaters do the work of an unpaid sales
          team, in public, every Sunday.
        </p>
      </Section>

      {/* 14 — Financial Model */}
      <Section
        n={14}
        kicker="The Numbers"
        title="Three-year model. Investor-grade."
      >
        <FinancialModelSection
          aggressive={AGGRESSIVE_CASE}
          conservative={CONSERVATIVE_CASE}
          liveViewersY1Avg={INPUTS.liveViewers[0]}
          liveViewersEOY1Target={TARGETS.liveViewersEOY1}
          replayMultiplier={INPUTS.replayMultiplier[0]}
        />
      </Section>

      {/* 15 — The Ask + Use of Funds */}
      <section
        id="s15"
        className="border-t border-zinc-200 px-4 md:px-12 py-12 md:py-28"
      >
        <div className="max-w-4xl mx-auto">
          <header className="flex items-baseline gap-3 md:gap-6 mb-5 md:mb-10">
            <span className="text-zinc-400 text-base md:text-lg font-black tabular-nums">
              15
            </span>
            <span className="text-zinc-400 text-[10px] md:text-xs uppercase tracking-widest font-black">
              15 / {String(TOTAL).padStart(2, "0")}
            </span>
          </header>
          <p className="text-black text-[11px] md:text-xs uppercase tracking-widest font-black mb-3">
            The Ask
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black leading-tight tracking-tight mb-6 md:mb-8 max-w-4xl">
            The world doesn&apos;t need fewer arguments. It needs better ones.
          </h2>
          <p className="text-zinc-700 text-base sm:text-lg md:text-2xl leading-snug mb-10 md:mb-12 max-w-3xl">
            Argumental is the league where that happens — civilly,
            professionally, in front of millions. Join the seed round.
          </p>

          {/* Use of Funds */}
          <div className="border-t-2 border-zinc-900 pt-6 md:pt-8 mb-8 md:mb-10">
            <p className="text-[10px] md:text-xs uppercase tracking-widest font-black text-zinc-900 mb-4">
              Use of funds (placeholder — confirm before sharing)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6">
              {[
                { k: "Round size", v: "$500K" },
                { k: "Structure", v: "SAFE @ $8M cap" },
                { k: "Runway", v: "18 months" },
                { k: "Use", v: "Production · talent · go-to-market" },
              ].map((row) => (
                <div key={row.k}>
                  <p className="text-[10px] uppercase tracking-widest font-black text-zinc-400">
                    {row.k}
                  </p>
                  <p className="text-zinc-900 font-bold text-sm md:text-base mt-1">
                    {row.v}
                  </p>
                </div>
              ))}
            </div>
            <ul className="text-zinc-700 text-sm md:text-base leading-relaxed space-y-1.5">
              <li>· <span className="font-bold text-zinc-900">30%</span> — Production (studio, crew, livestream ops)</li>
              <li>· <span className="font-bold text-zinc-900">25%</span> — Debater honoraria (24+ bouts at $10K)</li>
              <li>· <span className="font-bold text-zinc-900">20%</span> — Engineering &amp; product</li>
              <li>· <span className="font-bold text-zinc-900">15%</span> — Paid acquisition ($10K/mo + creator marketing)</li>
              <li>· <span className="font-bold text-zinc-900">10%</span> — G&amp;A, legal, insurance</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-10 md:mb-12">
            <a
              href="mailto:reubstock@gmail.com?subject=Argumental%20seed%20round"
              className="bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-xs md:text-sm px-5 py-3 rounded-md transition text-center"
            >
              Are you in? →
            </a>
            <a
              href="/"
              className="border border-zinc-300 hover:border-black text-zinc-900 font-black uppercase tracking-widest text-xs md:text-sm px-5 py-3 rounded-md transition text-center"
            >
              See the live product
            </a>
          </div>
          <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-black">
            The Path to Peace Begins with an Argument.
          </p>
        </div>
      </section>
    </div>
  );
}
