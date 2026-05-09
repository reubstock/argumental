import type { ReactNode } from "react";
import Image from "next/image";
import {
  INPUTS,
  TARGETS,
  TOTAL_REVENUE,
  fmtNumCompact,
  fmtUSD,
  sum3,
} from "@/lib/financialModel";

export const metadata = {
  title: "Argumental — Investor Deck",
  description:
    "The Path to Peace Begins with an Argument. A 14-section investor brief on the world's first professional debate league.",
};

const TOTAL = 14;

/**
 * Editorial-style single-page deck. Numbered badges, HR dividers, whitespace-
 * driven rhythm — modeled after yes-movement.vercel.app/fund.html.
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
 * GlobeIcon — a classic desk globe: tilted blue-and-green sphere with a
 * gold meridian arc cradling it, on a brass stem and disc base. Conveys
 * "global league" without being a literal map.
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
        {/* Gloss highlight to suggest glass/sphere */}
        <radialGradient id="gloss" cx="32%" cy="22%" r="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.55" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Base disc + stem */}
      <ellipse cx="60" cy="132" rx="26" ry="4.5" fill="url(#brassDark)" />
      <ellipse cx="60" cy="129" rx="26" ry="4.5" fill="url(#brass)" />
      <rect x="56" y="116" width="8" height="14" fill="url(#brass)" />
      <ellipse cx="60" cy="116" rx="6" ry="2" fill="#FCE38A" />

      {/* Tilted globe + meridian arc */}
      <g transform="rotate(-18 60 60)">
        {/* Meridian arc (C cradle behind the sphere on the right side) */}
        <path
          d="M60 18 A42 42 0 0 1 60 102 L66 108 A48 48 0 0 0 66 12 Z"
          fill="url(#brassDark)"
        />
        {/* Front of meridian (covers the sphere edge) */}
        <path
          d="M60 18 L60 22 A38 38 0 0 1 60 98 L60 102 A42 42 0 0 0 60 18 Z"
          fill="url(#brass)"
          opacity="0.55"
        />

        {/* Sphere — ocean */}
        <circle cx="60" cy="60" r="38" fill="url(#ocean)" />

        {/* Continents — stylized blobs in the right rough places */}
        <g fill="#3F8B3F" opacity="0.95">
          {/* North America */}
          <path d="M36 42 Q44 36 50 42 Q52 50 46 56 Q40 58 34 52 Q32 46 36 42 Z" />
          {/* South America */}
          <path d="M44 66 Q50 66 50 74 Q48 84 42 86 Q38 80 40 72 Q42 68 44 66 Z" />
          {/* Africa */}
          <path d="M62 50 Q70 50 70 60 Q72 70 64 78 Q58 78 58 70 Q56 60 62 50 Z" />
          {/* Eurasia (sweeping right) */}
          <path d="M62 36 Q78 32 86 40 Q88 48 80 50 Q70 50 62 46 Q60 40 62 36 Z" />
          {/* Australia */}
          <path d="M82 70 Q90 70 90 76 Q86 80 80 78 Q78 74 82 70 Z" />
        </g>

        {/* Latitude / longitude grid (faint white) */}
        <g stroke="white" strokeWidth="0.5" fill="none" opacity="0.25">
          <ellipse cx="60" cy="60" rx="38" ry="10" />
          <ellipse cx="60" cy="60" rx="38" ry="20" />
          <ellipse cx="60" cy="60" rx="10" ry="38" />
          <ellipse cx="60" cy="60" rx="22" ry="38" />
          <line x1="60" y1="22" x2="60" y2="98" />
          <line x1="22" y1="60" x2="98" y2="60" />
        </g>

        {/* Glass gloss */}
        <circle cx="60" cy="60" r="38" fill="url(#gloss)" />

        {/* Sphere outline */}
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

// (TOC array kept for future use — the Cover anchor list was removed earlier.)
const TOC: { n: number; label: string }[] = [
  { n: 1, label: "Cover" },
  { n: 2, label: "Problem" },
  { n: 3, label: "Insight" },
  { n: 4, label: "Product" },
  { n: 5, label: "Format" },
  { n: 6, label: "Sample Bouts" },
  { n: 7, label: "The League" },
  { n: 8, label: "Comparables" },
  { n: 9, label: "Why Now" },
  { n: 10, label: "Model" },
  { n: 11, label: "Plan" },
  { n: 12, label: "Ask" },
];
void TOC;

export default function DeckPage() {
  return (
    <div className="bg-white text-zinc-900">
      {/* 01 — Cover (full-bleed hero, no top border) */}
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

      {/* 02 — Problem */}
      <Section
        n={2}
        kicker="The Problem"
        title="The world has never been more divided — and you only ever hear one side of it."
      >
        <p className="text-zinc-600 text-lg md:text-xl leading-relaxed mb-8">
          Algorithms reward outrage. Hosts amplify their own politics. Counterpoints
          are buried. Audiences are starved for the moment when two opposing ideas
          actually meet — civilly, on the same stage, in real time.
        </p>
        <ul className="text-zinc-700 text-base md:text-lg leading-relaxed space-y-2">
          <li>· Polarization at all-time highs across democracies.</li>
          <li>· Cable news and podcasts are mostly homogenous echo chambers.</li>
          <li>· Formal debate has no modern televised home.</li>
          <li>· No one is producing must-watch ideological combat at scale.</li>
        </ul>
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

      {/* 04 — Product */}
      <Section
        n={4}
        kicker="The Product"
        title="Weekly title bouts between opposing thinkers — judged by the audience."
      >
        <p className="text-zinc-600 text-lg md:text-xl leading-relaxed mb-8 max-w-3xl">
          Live one-on-one debates on the most charged questions of the day.
          No moderator. No filter. The crowd decides who wins.
        </p>
        <div className="border-t border-zinc-200 pt-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-sm md:text-base">
          {[
            { k: "Cadence", v: "Every Sunday · 8 PM ET" },
            { k: "Home", v: "argumental.com" },
            { k: "Distribution", v: "YouTube · TikTok · Instagram" },
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

      {/* 05 — Format */}
      <Section
        n={5}
        kicker="The Format"
        title="24 minutes. Four phases. One winner."
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { n: "01", label: "Opening A", side: "red" },
            { n: "02", label: "Opening B", side: "blue" },
            { n: "03", label: "Rebuttal A", side: "red" },
            { n: "04", label: "Rebuttal B", side: "blue" },
          ].map((p) => (
            <div
              key={p.n}
              className="border-t-2 border-zinc-900 pt-3"
            >
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
            { k: "Vote price", v: "$5 per vote · 1 vote per viewer" },
            { k: "Charity cut", v: "18% of every dollar to winner's pick" },
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

      {/* 06 — Sample Bouts */}
      <Section
        n={6}
        kicker="Sample Bouts"
        title="The most charged questions of the day."
      >
        <ul className="divide-y divide-zinc-200 border-y border-zinc-200">
          {[
            {
              topic: "Does Israel Have the Right to Exist?",
              a: { name: "Ben Shapiro", photo: "/shapiro.jpg" },
              b: { name: "Mehdi Hasan", photo: "/debaters/hasan.jpg" },
            },
            {
              topic: "There Are Only Two Genders.",
              a: { name: "Matt Walsh", photo: "/debaters/walsh.jpg" },
              b: { name: "Judith Butler", photo: "/debaters/butler.jpg" },
            },
            {
              topic: "The US Should Defund the Police.",
              a: { name: "Ilhan Omar", photo: "/debaters/omar.jpg" },
              b: { name: "Pete Hegseth", photo: "/debaters/hegseth.jpg" },
            },
            {
              topic: "America Must Remain a Country of Immigrants.",
              a: { name: "TBD", photo: null },
              b: { name: "TBD", photo: null },
            },
            {
              topic: "America Is Becoming an Authoritarian State.",
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

      {/* 07 — The League */}
      <Section
        n={7}
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

      {/* 08 — Comparables */}
      <Section
        n={8}
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
              note:
                "Native-internet competition with audience-first economics.",
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

      {/* 09 — Why Now */}
      <Section n={9} kicker="Why Now" title="The conditions have never been better.">
        <ol className="space-y-6 max-w-3xl">
          {[
            {
              h: "Polarization at all-time highs",
              p: "The audience demand for cross-side conflict is unprecedented.",
            },
            {
              h: "Algorithms reward conflict — but bad-faith conflict",
              p: "We give the algorithm a high-quality, well-structured alternative.",
            },
            {
              h: "Formal debate has no modern televised home",
              p: "Lincoln–Douglas hasn't had a successor in 165 years.",
            },
            {
              h: "Creator economy + algorithmic reach",
              p: "A niche format can scale globally without owning a network.",
            },
          ].map((c, i) => (
            <li key={i} className="flex gap-4 md:gap-6">
              <span
                className={`text-xl md:text-2xl font-black tabular-nums shrink-0 ${i % 2 === 0 ? "text-brand-red" : "text-brand-blue"}`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-zinc-900 font-bold text-lg md:text-xl">
                  {c.h}
                </p>
                <p className="text-zinc-600 text-base mt-1 leading-relaxed">
                  {c.p}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* 10 — Business Model */}
      <Section
        n={10}
        kicker="Model"
        title="Three lines of revenue. One civic license."
      >
        <ul className="divide-y divide-zinc-200 border-y border-zinc-200 mb-8">
          {[
            {
              h: "Pay-per-vote",
              p: "$5 per vote · scales with audience · zero CAC at the unit level.",
            },
            {
              h: "Sponsorships",
              p: "Title sponsors per knowledge class. Brand-safe by design.",
            },
            {
              h: "Media rights & licensing",
              p: "Bouts, clips, the format itself — international territories, longform.",
            },
          ].map((c, i) => (
            <li key={i} className="py-5 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6">
              <p className="text-zinc-900 font-bold text-base md:text-lg">
                {String(i + 1).padStart(2, "0")} · {c.h}
              </p>
              <p className="text-zinc-600 text-sm md:text-base md:col-span-2 leading-relaxed">
                {c.p}
              </p>
            </li>
          ))}
        </ul>
        <div>
          <p className="text-[10px] uppercase tracking-widest font-black text-zinc-900 mb-2">
            Mission flywheel
          </p>
          <p className="text-zinc-700 text-base md:text-lg leading-relaxed max-w-3xl">
            We&apos;re a learning company. A large share of profits is donated
            to the winner&apos;s charity each week — every vote is a
            contribution to civic life.
          </p>
        </div>
      </Section>

      {/* 11 — Plan */}
      <Section
        n={11}
        kicker="The Plan"
        title="Six months of programming. Multi-platform from day one."
      >
        <ul className="divide-y divide-zinc-200 border-y border-zinc-200 mb-8">
          {[
            {
              h: "24+ debates",
              p: "One headline bout every Sunday for 6 months.",
            },
            {
              h: "Founding knowledge classes",
              p: "First champions across 4–6 categories.",
            },
            {
              h: "Argumental.com",
              p: "Voting, charity payouts, archive, leaderboards.",
            },
            {
              h: "Distribution machine",
              p: "Native clipping into YouTube, TikTok, Instagram for every bout.",
            },
          ].map((c, i) => (
            <li key={i} className="py-5 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6">
              <p className="text-zinc-900 font-bold text-base md:text-lg">
                {c.h}
              </p>
              <p className="text-zinc-600 text-sm md:text-base md:col-span-2 leading-relaxed">
                {c.p}
              </p>
            </li>
          ))}
        </ul>
        <p className="text-zinc-700 text-base md:text-lg leading-relaxed max-w-3xl">
          During this window we test{" "}
          <span className="text-zinc-900 font-bold">
            scale and monetization
          </span>
          . Proving the format compounds — across audience, votes, sponsor
          demand.
        </p>
      </Section>

      {/* 12 — Growth Plan */}
      <Section
        n={12}
        kicker="Growth Plan"
        title="Hand-picked debaters with audiences. Paid search to amplify."
      >
        {/* Hero stat — the EOY1 goal (sourced from lib/financialModel) */}
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

        <ul className="divide-y divide-zinc-200 border-y border-zinc-200 mb-8">
          {[
            {
              h: "Pay top-of-class debaters",
              p: "Per-bout honorariums tied to category seniority — the league pays its talent. Signals seriousness, attracts the names that move ratings, and lets us book them across multiple bouts to compound momentum.",
            },
            {
              h: "$10K / month paid search",
              p: "Google + Meta acquisition aimed at the topical demand that already exists for every bout — \"is Israel justified\", \"defund the police\", \"UBI\". We meet that intent with the bout, not a think-piece.",
            },
            {
              h: "High-profile recruits with audiences",
              p: "Each debater brings 100K–10M followers on day one. They promote their own bouts to their own audiences — every booking is a built-in distribution event. Net new viewers without traditional media spend.",
            },
            {
              h: "The flywheel",
              p: "Bigger names → bigger audiences → bigger sponsor packages → bigger honorariums → bigger names. Paid search and creator marketing seed the loop until it spins on its own.",
            },
          ].map((c, i) => (
            <li key={i} className="py-5 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6">
              <p className="text-zinc-900 font-bold text-base md:text-lg">
                {c.h}
              </p>
              <p className="text-zinc-600 text-sm md:text-base md:col-span-2 leading-relaxed">
                {c.p}
              </p>
            </li>
          ))}
        </ul>
        <p className="text-zinc-700 text-base md:text-lg leading-relaxed max-w-3xl">
          Acquisition cost falls to{" "}
          <span className="text-zinc-900 font-bold">near zero per viewer</span>{" "}
          once the format compounds — debaters do the work of an unpaid sales
          team, in public, every Sunday.
        </p>
      </Section>

      {/* 13 — Financial Model */}
      <Section
        n={13}
        kicker="The Numbers"
        title="Three-year model. Investor-grade."
      >
        {/* Headline year-by-year (sourced from lib/financialModel) */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-y border-zinc-200 mb-4">
          {[
            { kicker: "Y1 Revenue", value: fmtUSD(TOTAL_REVENUE[0]), sub: "Voting only" },
            { kicker: "Y2 Revenue", value: fmtUSD(TOTAL_REVENUE[1]), sub: "Audience compounding" },
            { kicker: "Y3 Revenue", value: fmtUSD(TOTAL_REVENUE[2]), sub: "Full league cadence" },
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

        {/* Reach context — anchors the revenue ramp in audience numbers
            (all figures sourced from lib/financialModel) */}
        <p className="text-zinc-500 text-xs md:text-sm leading-relaxed mb-6 md:mb-8">
          Driven by{" "}
          <span className="text-zinc-900 font-bold">
            {fmtNumCompact(INPUTS.liveViewers[0])} →{" "}
            {fmtNumCompact(TARGETS.liveViewersEOY1)} live viewers / bout
          </span>{" "}
          across Y1, with a{" "}
          <span className="text-zinc-900 font-bold">
            {INPUTS.replayMultiplier[0]}× replay multiplier
          </span>
          {" "}— total reach of{" "}
          <span className="text-zinc-900 font-bold">
            {1 + INPUTS.replayMultiplier[0]}× live
          </span>{" "}
          per bout. Revenue is voting only; sponsorship is upside.
        </p>

        {/* What's in / what's out */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="border border-zinc-200 rounded-md p-4 md:p-5">
            <p className="text-brand-red text-[10px] uppercase tracking-widest font-black mb-2">
              Built into the model
            </p>
            <ul className="text-zinc-700 text-sm md:text-base space-y-1.5 leading-relaxed">
              <li>· Voting revenue gated by live viewer reach</li>
              <li>· 40× post-live replay multiplier</li>
              <li>· Mux delivery scaling with live + replay</li>
              <li>· 18% charity payout as COGS</li>
              <li>· Debater honorariums capped at $25K/bout</li>
              <li>· $10K/mo paid search Year 1, ramping</li>
              <li>· Headcount, G&amp;A, legal, infra</li>
            </ul>
          </div>
          <div className="border border-zinc-200 rounded-md p-4 md:p-5">
            <p className="text-brand-blue text-[10px] uppercase tracking-widest font-black mb-2">
              Treated as upside, not assumed
            </p>
            <ul className="text-zinc-700 text-sm md:text-base space-y-1.5 leading-relaxed">
              <li>· Sponsorship · title slots, category exclusives</li>
              <li>· International format licensing</li>
              <li>· On-demand archive monetization</li>
              <li>· White-label league for institutions</li>
              <li>· Live-event ticketing (championship bouts)</li>
              <li>· Branded merch + book deals</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start flex-wrap">
          <a
            href="/model"
            className="bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-xs md:text-sm px-5 py-3 rounded-md transition inline-flex items-center gap-2"
          >
            View on-page summary
            <span aria-hidden>→</span>
          </a>
          <a
            href="/argumental-financial-model.xlsx"
            download
            className="border border-zinc-300 hover:border-black text-zinc-900 font-black uppercase tracking-widest text-xs md:text-sm px-5 py-3 rounded-md transition inline-flex items-center gap-2"
          >
            Download .xlsx
            <span aria-hidden>↓</span>
          </a>
          <p className="text-zinc-500 text-xs md:text-sm leading-relaxed max-w-2xl pt-2">
            On-page summary shows inputs, revenue, variable costs, gross
            margin. Spreadsheet adds fixed opex, EBITDA, unit economics.
          </p>
        </div>
      </Section>

      {/* 14 — Ask */}
      <section
        id="s14"
        className="border-t border-zinc-200 px-4 md:px-12 py-12 md:py-28"
      >
        <div className="max-w-4xl mx-auto">
          <header className="flex items-baseline gap-3 md:gap-6 mb-5 md:mb-10">
            <span className="text-zinc-400 text-base md:text-lg font-black tabular-nums">
              14
            </span>
            <span className="text-zinc-400 text-[10px] md:text-xs uppercase tracking-widest font-black">
              14 / {String(TOTAL).padStart(2, "0")}
            </span>
          </header>
          <p className="text-black text-[11px] md:text-xs uppercase tracking-widest font-black mb-3">
            The Ask
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black leading-tight tracking-tight mb-6 md:mb-8 max-w-4xl">
            The world doesn&apos;t need fewer arguments. It needs better ones.
          </h2>
          <p className="text-zinc-700 text-base sm:text-lg md:text-2xl leading-snug mb-8 md:mb-10 max-w-3xl">
            Argumental is the league where that happens — civilly,
            professionally, in front of millions. Join the seed round.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
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
          <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-black mt-10 md:mt-12">
            The Path to Peace Begins with an Argument.
          </p>
        </div>
      </section>
    </div>
  );
}
