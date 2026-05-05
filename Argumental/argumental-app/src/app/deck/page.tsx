import type { ReactNode } from "react";
import Image from "next/image";

export const metadata = {
  title: "Argumental — Investor Deck",
  description:
    "The Path to Peace Begins with an Argument. A 12-section investor brief on the world's first professional debate league.",
};

const TOTAL = 12;

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
      className="border-t border-zinc-200 px-5 md:px-12 py-12 md:py-20"
    >
      <div className="max-w-4xl mx-auto">
        <header className="flex items-baseline gap-4 md:gap-6 mb-6 md:mb-10">
          <span className="text-zinc-400 text-base md:text-lg font-black tabular-nums">
            {String(n).padStart(2, "0")}
          </span>
          <span className="text-zinc-400 text-[10px] md:text-xs uppercase tracking-widest font-black">
            {String(n).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
          </span>
        </header>
        {kicker && (
          <p className="text-black text-xs uppercase tracking-widest font-black mb-3">
            {kicker}
          </p>
        )}
        <h2 className="text-2xl md:text-4xl font-black leading-tight tracking-tight mb-8 md:mb-10 text-zinc-900">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

/**
 * ChampionTrophyIllustration — example champion holding a "TECH/AI" trophy
 * over his head. Used in slide 7 to make the league concept visceral. Photo
 * is Dario Amodei from Wikipedia commons.
 */
function ChampionTrophyIllustration() {
  return (
    <figure className="border-t border-zinc-200 pt-6 flex flex-col items-center text-center">
      <span className="text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-3">
        Sample champion
      </span>
      {/* Trophy + arms — a single SVG composition */}
      <svg
        viewBox="0 0 220 220"
        width="180"
        height="180"
        className="-mb-6"
        aria-hidden="true"
      >
        {/* Trophy cup */}
        <defs>
          <linearGradient id="cup" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#facc15" />
            <stop offset="55%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>
          <linearGradient id="plate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A2540" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>
        </defs>
        {/* Side handles */}
        <path
          d="M65 35 Q40 40 40 65 Q40 90 65 95"
          stroke="url(#cup)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M155 35 Q180 40 180 65 Q180 90 155 95"
          stroke="url(#cup)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        {/* Cup body */}
        <path
          d="M55 30 L165 30 L150 110 Q140 130 110 130 Q80 130 70 110 Z"
          fill="url(#cup)"
          stroke="#7c4a02"
          strokeWidth="1.5"
        />
        {/* Top rim */}
        <ellipse cx="110" cy="30" rx="55" ry="6" fill="#fde047" stroke="#7c4a02" strokeWidth="1" />
        {/* Plate */}
        <rect x="72" y="55" width="76" height="34" rx="2" fill="url(#plate)" stroke="#000" strokeWidth="0.5" />
        <text
          x="110"
          y="69"
          textAnchor="middle"
          fontFamily="Geist, system-ui, sans-serif"
          fontSize="10"
          fontWeight="900"
          fill="#a1a1aa"
          letterSpacing="2"
        >
          WORLD
        </text>
        <text
          x="110"
          y="83"
          textAnchor="middle"
          fontFamily="Geist, system-ui, sans-serif"
          fontSize="14"
          fontWeight="900"
          fill="#facc15"
          letterSpacing="1.5"
        >
          TECH / AI
        </text>
        {/* Stem */}
        <rect x="100" y="130" width="20" height="20" fill="url(#cup)" stroke="#7c4a02" strokeWidth="1" />
        {/* Base */}
        <rect x="78" y="150" width="64" height="12" rx="2" fill="url(#cup)" stroke="#7c4a02" strokeWidth="1" />
        <rect x="70" y="162" width="80" height="6" rx="1" fill="#7c4a02" />

        {/* Stylized arms reaching up to the trophy */}
        <path
          d="M85 168 Q70 195 80 215"
          stroke="#1A2540"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M135 168 Q150 195 140 215"
          stroke="#1A2540"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      {/* Champion photo — circular, brand-bordered, just below the SVG */}
      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-brand-blue shrink-0 relative z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/debaters/amodei.jpg"
          alt="Dario Amodei"
          className="w-full h-full object-cover object-top"
        />
      </div>
      <figcaption className="mt-3">
        <p className="text-zinc-900 font-black text-sm">Dario Amodei</p>
        <p className="text-[10px] uppercase tracking-widest font-black text-brand-blue mt-0.5">
          World Champion · Tech / AI
        </p>
      </figcaption>
    </figure>
  );
}

/**
 * WorldMapIllustration — minimalist continent silhouettes with brand-colored
 * dots placed on the league's six regional rankings. Public-domain map paths
 * adapted from the Natural Earth low-res world dataset, simplified for an
 * editorial / editorial-line-art look.
 */
function WorldMapIllustration() {
  // Simplified continent silhouettes (very low-poly) so the map reads as
  // "world" without overwhelming the layout. Coordinate space 0..360 × 0..180
  // (lat/lon-ish, equirectangular).
  const continents = [
    // North America
    "M50 35 L95 30 L110 50 L100 70 L80 95 L55 95 L40 75 L35 55 Z",
    // Central America (small)
    "M80 100 L100 105 L95 115 L82 110 Z",
    // South America
    "M105 110 L130 115 L130 145 L115 160 L100 155 L98 130 Z",
    // Europe
    "M165 35 L200 35 L205 55 L185 65 L170 60 L160 50 Z",
    // Africa
    "M170 70 L210 70 L220 110 L200 145 L185 145 L170 110 Z",
    // Asia
    "M205 30 L290 30 L305 50 L300 75 L270 95 L240 95 L220 75 L210 55 Z",
    // SE Asia / Indonesia
    "M270 100 L295 105 L290 115 L260 110 Z",
    // Oceania
    "M285 130 L315 130 L320 145 L300 150 L280 145 Z",
  ];

  // Region markers (cx, cy in same coord space, color side)
  const markers: { cx: number; cy: number; side: "A" | "B"; label: string }[] = [
    { cx: 90, cy: 60, side: "A", label: "US East" },
    { cx: 60, cy: 65, side: "A", label: "US West" },
    { cx: 180, cy: 50, side: "B", label: "Europe" },
    { cx: 270, cy: 70, side: "A", label: "Asia-Pacific" },
    { cx: 200, cy: 75, side: "B", label: "MENA" },
    { cx: 115, cy: 135, side: "B", label: "Latin America" },
  ];

  return (
    <svg
      viewBox="0 0 360 180"
      className="w-full h-auto"
      aria-label="World map with the six Argumental regional ranking territories"
    >
      {/* Continent silhouettes */}
      {continents.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="#f4f4f5"
          stroke="#d4d4d8"
          strokeWidth="0.8"
        />
      ))}
      {/* Region markers */}
      {markers.map((m) => (
        <g key={m.label}>
          <circle
            cx={m.cx}
            cy={m.cy}
            r="6"
            fill={m.side === "A" ? "#EB2C35" : "#1165C6"}
            opacity="0.18"
          />
          <circle
            cx={m.cx}
            cy={m.cy}
            r="3"
            fill={m.side === "A" ? "#EB2C35" : "#1165C6"}
          />
        </g>
      ))}
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

export default function DeckPage() {
  return (
    <div className="bg-white text-zinc-900">
      {/* 01 — Cover (full-bleed hero, no top border) */}
      <section
        id="s1"
        className="px-5 md:px-12 py-16 md:py-28 min-h-[70vh] flex flex-col"
      >
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
          <header className="mb-12 md:mb-20">
            <span className="text-zinc-400 text-[10px] md:text-xs uppercase tracking-widest font-black">
              Investor Brief · 2026
            </span>
          </header>

          <div className="flex-1 flex flex-col justify-center gap-6 md:gap-8">
            <Image
              src="/logo.png"
              alt="Argumental"
              width={200}
              height={200}
              priority
              className="w-32 md:w-44 h-auto"
            />
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95]">
              Argumental
            </h1>
            <p className="text-xl md:text-3xl font-bold text-zinc-700 leading-snug max-w-3xl">
              The Path to Peace Begins with an Argument.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
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

      {/* 07 — League Structure */}
      <Section
        n={7}
        kicker="The League"
        title="Rankings. Titles. World-class champions."
      >
        <p className="text-zinc-600 text-lg md:text-xl leading-relaxed mb-8 max-w-3xl">
          Champions ranked by region. Titles defended within knowledge-area
          classes — like weight classes in MMA. A discoverable, defendable
          hierarchy of the world&apos;s best debaters.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {/* Knowledge classes — paired with the champion illustration */}
          <div>
            <p className="text-[10px] md:text-xs uppercase tracking-widest font-black text-zinc-900 border-b border-zinc-200 pb-2 mb-4">
              Knowledge classes
            </p>
            <ul className="text-zinc-700 text-base md:text-lg leading-relaxed space-y-1.5 mb-8">
              <li>· Foreign Policy</li>
              <li>· Economics</li>
              <li>· Culture</li>
              <li>· Science</li>
              <li>· Faith</li>
              <li className="text-zinc-900 font-bold">· Tech &amp; AI</li>
            </ul>
            <ChampionTrophyIllustration />
          </div>

          {/* Regional rankings — paired with the world map */}
          <div>
            <p className="text-[10px] md:text-xs uppercase tracking-widest font-black text-zinc-900 border-b border-zinc-200 pb-2 mb-4">
              Regional rankings
            </p>
            <div className="grid grid-cols-2 gap-x-6">
              <ul className="text-zinc-700 text-base md:text-lg leading-relaxed space-y-1.5">
                <li>· US East</li>
                <li>· US West</li>
                <li>· Europe</li>
                <li>· Asia-Pacific</li>
                <li>· MENA</li>
                <li>· Latin America</li>
              </ul>
              <WorldMapIllustration />
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

      {/* 12 — Ask */}
      <section
        id="s12"
        className="border-t border-zinc-200 px-5 md:px-12 py-16 md:py-28"
      >
        <div className="max-w-4xl mx-auto">
          <header className="flex items-baseline gap-4 md:gap-6 mb-6 md:mb-10">
            <span className="text-zinc-400 text-base md:text-lg font-black tabular-nums">
              12
            </span>
            <span className="text-zinc-400 text-[10px] md:text-xs uppercase tracking-widest font-black">
              12 / {String(TOTAL).padStart(2, "0")}
            </span>
          </header>
          <p className="text-black text-xs uppercase tracking-widest font-black mb-3">
            The Ask
          </p>
          <h2 className="text-3xl md:text-6xl font-black leading-tight tracking-tight mb-8 max-w-4xl">
            The world doesn&apos;t need fewer arguments. It needs better ones.
          </h2>
          <p className="text-zinc-700 text-lg md:text-2xl leading-snug mb-10 max-w-3xl">
            Argumental is the league where that happens — civilly,
            professionally, in front of millions. Join the seed round.
          </p>
          <div className="flex flex-col md:flex-row gap-3">
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
          <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-black mt-12">
            The Path to Peace Begins with an Argument.
          </p>
        </div>
      </section>
    </div>
  );
}
