import type { ReactNode } from "react";
import Image from "next/image";

export const metadata = {
  title: "Argumental — Investor Deck",
  description:
    "The Path to Peace Begins with an Argument. A 11-section investor brief on the world's first professional debate league.",
};

const TOTAL = 11;

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
  { n: 7, label: "Comparables" },
  { n: 7, label: "Why Now" },
  { n: 7, label: "Model" },
  { n: 7, label: "Plan" },
  { n: 7, label: "Ask" },
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

      {/*  */}
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

      {/* 08 — Why Now */}
      <Section n={7} kicker="Why Now" title="The conditions have never been better.">
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

      {/* 09 — Business Model */}
      <Section
        n={7}
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

      {/* 10 — Plan */}
      <Section
        n={7}
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

      {/* 11 — Ask */}
      <section
        id="s11"
        className="border-t border-zinc-200 px-5 md:px-12 py-16 md:py-28"
      >
        <div className="max-w-4xl mx-auto">
          <header className="flex items-baseline gap-4 md:gap-6 mb-6 md:mb-10">
            <span className="text-zinc-400 text-base md:text-lg font-black tabular-nums">
              11
            </span>
            <span className="text-zinc-400 text-[10px] md:text-xs uppercase tracking-widest font-black">
              11 / {String(TOTAL).padStart(2, "0")}
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
