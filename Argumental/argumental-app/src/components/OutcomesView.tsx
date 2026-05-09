"use client";

import { useState } from "react";
import Panel from "@/components/Panel";
import VideoPlayer from "@/components/VideoPlayer";

type Tab = "current" | "historical";

/**
 * OutcomesView — twin tabs (Current · Historical) for the /outcomes page.
 *
 * Default = "current" so the most recent verdict loads first. Historical
 * shows ancestral debates that establish the lineage Argumental sits in.
 */
export default function OutcomesView() {
  const [tab, setTab] = useState<Tab>("current");

  return (
    <div className="flex flex-col gap-5">
      <div
        role="tablist"
        aria-label="Outcomes view"
        className="inline-flex self-start border border-zinc-300 rounded-md bg-white p-0.5"
      >
        <TabButton active={tab === "current"} onClick={() => setTab("current")}>
          Current
        </TabButton>
        <TabButton active={tab === "historical"} onClick={() => setTab("historical")}>
          Historical
        </TabButton>
      </div>

      {tab === "current" ? <CurrentVerdicts /> : <HistoricalDebates />}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* CURRENT — Israel debate, concluded May 10 2026, Shapiro the winner.     */
/* ────────────────────────────────────────────────────────────────────── */

function CurrentVerdicts() {
  const VOTES_A = 12_438; // Shapiro
  const VOTES_B = 9_026;  // AOC
  const TOTAL = VOTES_A + VOTES_B;
  const PCT_A = Math.round((VOTES_A / TOTAL) * 100);
  const PCT_B = 100 - PCT_A;
  const RAISED = (TOTAL * 5).toLocaleString("en-US");
  const CHARITY_PAYOUT = Math.round(TOTAL * 5 * 0.18).toLocaleString("en-US");

  return (
    <Panel className="overflow-hidden">
      {/* Status strip */}
      <div className="bg-zinc-50 border-b border-zinc-200 px-4 md:px-5 py-2.5 flex items-center gap-3 flex-wrap">
        <span className="bg-brand-red text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full">
          ● Verdict
        </span>
        <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-black tabular-nums">
          Sun, May 10 · 2026
        </span>
        <span className="text-zinc-300">·</span>
        <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-black">
          Foreign Policy
        </span>
      </div>

      <div className="p-5 md:p-6 flex flex-col gap-6">
        <div>
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-black mb-1">
            Bout 01
          </p>
          <h2 className="text-zinc-900 font-black text-xl md:text-3xl leading-tight">
            Does Israel Have the Right to Exist?
          </h2>
        </div>

        {/* Watch + scoreboard: half-size replay player on the left
            (uses the same Shapiro/AOC cover graphic as the homepage),
            stacked debater cards on the right. Stacks on mobile. */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-5 items-start">
          <div className="md:col-span-2 max-w-xs md:max-w-none">
            <VideoPlayer
              youtubeId="YQ7IudJBpf0"
              debaterAName="Ben Shapiro"
              debaterAPhoto="/shapiro.jpg"
              debaterAPosition="FOR"
              debaterBName="Alexandria Ocasio-Cortez"
              debaterBPhoto="/aoc.jpg"
              debaterBPosition="AGAINST"
            />
          </div>
          <div className="md:col-span-3 flex flex-col gap-3">
            <DebaterPanel
              side="A"
              name="Ben Shapiro"
              position="FOR"
              photo="/shapiro.jpg"
              votes={VOTES_A}
              pct={PCT_A}
              isWinner
            />
            <DebaterPanel
              side="B"
              name="Alexandria Ocasio-Cortez"
              position="AGAINST"
              photo="/aoc.jpg"
              votes={VOTES_B}
              pct={PCT_B}
            />
          </div>
        </div>

        {/* Tally bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs font-black tabular-nums">
            <span className="text-brand-red">{PCT_A}%</span>
            <span className="text-zinc-500">{TOTAL.toLocaleString("en-US")} votes cast</span>
            <span className="text-brand-blue">{PCT_B}%</span>
          </div>
          <div className="flex h-2.5 rounded-full overflow-hidden bg-zinc-100">
            <div className="bg-brand-red" style={{ width: `${PCT_A}%` }} />
            <div className="bg-brand-blue" style={{ width: `${PCT_B}%` }} />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 border-t border-zinc-200 pt-5">
          <Stat
            kicker="Pot raised"
            value={`$${RAISED}`}
            sub="$5 / vote"
          />
          <Stat
            kicker="Charity payout"
            value={`$${CHARITY_PAYOUT}`}
            sub="18% to FIDF · winner's pick"
          />
          <Stat
            kicker="Format"
            value="4 phases · 24 min"
            sub="No moderator"
          />
        </div>

        {/* What was at stake */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 border-t border-zinc-200 pt-6">
          <div>
            <p className="text-black text-[10px] md:text-xs uppercase tracking-widest font-black mb-2">
              What was at stake
            </p>
            <p className="text-zinc-700 text-sm md:text-base leading-relaxed">
              Argumental&apos;s opening bout put one of the most contested
              questions of the era — the legitimacy of the State of Israel —
              in front of an unmoderated, audience-judged crowd. A win for
              Shapiro meant 18 % of the pot ($
              {CHARITY_PAYOUT}) routed to{" "}
              <span className="text-zinc-900 font-bold">
                Friends of the Israel Defense Forces
              </span>
              . A win for Ocasio-Cortez would have sent the same share to
              UNRWA USA. Beyond the charity flow, the bout set the league&apos;s
              first Foreign Policy ranking — Shapiro now anchors the
              top-ten contender list as the inaugural No.&nbsp;1 challenger
              to the Tier-1 belt.
            </p>
          </div>
          <div>
            <p className="text-black text-[10px] md:text-xs uppercase tracking-widest font-black mb-2">
              How Shapiro won
            </p>
            <p className="text-zinc-700 text-sm md:text-base leading-relaxed">
              Critics afterwards converged on the same read: Shapiro built
              his case from first principles, anchoring on the 1947 UN
              partition vote and walking the audience through three
              consecutive defensive wars before Ocasio-Cortez had introduced
              her counter-frame. Her rebuttal landed cleanly — clearer than
              expected on settler dynamics — but came too late to slow his
              lead in the live tally. By the third phase the bar had passed
              57 % red and stayed there. Final split: {PCT_A}% / {PCT_B}%, a
              {' '}
              {PCT_A - PCT_B}-point margin on a question that polls split
              the country roughly down the middle.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 flex-wrap">
          <a
            href="/debates/israel-001"
            className="bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-[11px] px-3 py-2 rounded-md transition"
          >
            Watch the bout →
          </a>
          <a
            href="/rankings"
            className="bg-white hover:bg-zinc-50 border border-zinc-300 hover:border-black text-zinc-800 font-black uppercase tracking-widest text-[11px] px-3 py-2 rounded-md transition"
          >
            See rankings
          </a>
        </div>
      </div>
    </Panel>
  );
}

function DebaterPanel({
  side,
  name,
  position,
  photo,
  votes,
  pct,
  isWinner,
}: {
  side: "A" | "B";
  name: string;
  position: string;
  photo: string;
  votes: number;
  pct: number;
  isWinner?: boolean;
}) {
  const accentText =
    side === "A" ? "text-brand-red" : "text-brand-blue";
  const accentBorder =
    side === "A" ? "border-brand-red" : "border-brand-blue";
  const winnerCls = isWinner
    ? side === "A"
      ? "bg-brand-red/5 border-brand-red"
      : "bg-brand-blue/5 border-brand-blue"
    : "border-zinc-200 bg-white";

  return (
    <div className={`border ${winnerCls} rounded-md p-4 flex items-center gap-3 md:gap-4 relative`}>
      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 ${accentBorder} shrink-0`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt={name}
          className="w-full h-full object-cover object-top"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`${accentText} text-[10px] uppercase tracking-widest font-black`}>
          {position}
        </p>
        <p className="text-zinc-900 font-bold text-sm md:text-base leading-tight">
          {name}
        </p>
        <p className="text-zinc-500 text-xs md:text-sm tabular-nums mt-0.5">
          {votes.toLocaleString("en-US")} · {pct}%
        </p>
      </div>
      {isWinner && (
        <span className="absolute -top-2 right-3 bg-brand-red text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
          Winner
        </span>
      )}
    </div>
  );
}

function Stat({
  kicker,
  value,
  sub,
}: {
  kicker: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="flex flex-col">
      <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-black mb-1">
        {kicker}
      </p>
      <p className="text-zinc-900 font-black text-base md:text-lg tabular-nums leading-none">
        {value}
      </p>
      <p className="text-zinc-500 text-[11px] md:text-xs mt-1">{sub}</p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* HISTORICAL — Kennedy/Nixon (1960) · Wolff/Epstein (2019) ·              */
/* Lincoln/Douglas (1858).                                                 */
/* ────────────────────────────────────────────────────────────────────── */

function HistoricalDebates() {
  return (
    <div className="flex flex-col gap-4">
      {/* Kennedy vs Nixon — YouTube embed in an Argumental-style player */}
      <Panel className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="md:col-span-2 bg-black">
            <ArgumentalPlayer
              videoId="AYP8-oxq8ig"
              title="Kennedy vs. Nixon — 1960 Presidential Debate"
            />
          </div>
          <div className="md:col-span-3 p-5 md:p-6 flex flex-col gap-3">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-black tabular-nums">
                Sep 26 · 1960
              </span>
              <span className="text-zinc-300">·</span>
              <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-black">
                Foreign Policy · Domestic
              </span>
            </div>
            <h3 className="text-zinc-900 font-black text-xl md:text-2xl leading-tight">
              Kennedy vs. Nixon
            </h3>
            <p className="text-zinc-700 text-sm md:text-base leading-relaxed">
              The first televised U.S. presidential debate. Seventy million
              Americans — about one in three — watched. Nixon had just left
              hospital, refused stage makeup, and sweated under the studio
              lights. Kennedy looked directly into the camera and spoke to
              the country.
            </p>
            <p className="text-zinc-700 text-sm md:text-base leading-relaxed">
              <span className="font-bold text-zinc-900">Outcome:</span>{" "}
              Radio listeners called it for Nixon. TV viewers called it for
              Kennedy — by a wide margin. It&apos;s the moment cable-news
              politics was actually born: appearance, eye contact, body
              language, all became debate substance overnight. Kennedy went
              on to win one of the closest popular-vote elections in U.S.
              history.
            </p>
          </div>
        </div>
      </Panel>

      {/* Wolff vs Epstein — Soho Forum, capitalism vs. socialism (2019) */}
      <Panel className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="md:col-span-2 bg-black">
            <ArgumentalPlayer
              videoId="YJQSuUZdcV4"
              title="Wolff vs. Epstein — Socialism vs. Capitalism"
            />
          </div>
          <div className="md:col-span-3 p-5 md:p-6 flex flex-col gap-3">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-black tabular-nums">
                2019
              </span>
              <span className="text-zinc-300">·</span>
              <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-black">
                Economics · Political Economy
              </span>
            </div>
            <h3 className="text-zinc-900 font-black text-xl md:text-2xl leading-tight">
              Wolff vs. Epstein
            </h3>
            <p className="text-zinc-700 text-sm md:text-base leading-relaxed">
              The Soho Forum&apos;s signature head-to-head: Marxist
              economist Richard Wolff against libertarian-leaning
              Gene Epstein on whether socialism is preferable to
              capitalism as an economic system. Oxford-style format,
              live audience, no moderator wrap-up — the case had to
              stand on its own.
            </p>
            <p className="text-zinc-700 text-sm md:text-base leading-relaxed">
              <span className="font-bold text-zinc-900">Outcome:</span>{" "}
              The Soho Forum scores winners by{" "}
              <span className="text-zinc-900 font-bold">vote shift</span>{" "}
              — audience polls before and after; whichever side moves
              the room more wins. The format converts an argument into
              a measurable result. Argumental is built on the same
              premise.
            </p>
          </div>
        </div>
      </Panel>

      {/* Lincoln vs Douglas */}
      <Panel className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="md:col-span-2 bg-zinc-50 border-b md:border-b-0 md:border-r border-zinc-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/outcomes/lincoln-douglas.jpg"
              alt="Lincoln–Douglas Debates commemorative imagery"
              className="w-full h-full object-cover aspect-[16/9] md:aspect-auto"
              loading="lazy"
            />
          </div>
          <div className="md:col-span-3 p-5 md:p-6 flex flex-col gap-3">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-black tabular-nums">
                1858
              </span>
              <span className="text-zinc-300">·</span>
              <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-black">
                Slavery · Federalism
              </span>
            </div>
            <h3 className="text-zinc-900 font-black text-xl md:text-2xl leading-tight">
              Lincoln vs. Douglas
            </h3>
            <p className="text-zinc-700 text-sm md:text-base leading-relaxed">
              Seven debates across Illinois — three hours each, no moderator,
              the Senate seat as the prize. Stephen Douglas was the
              architect of the Kansas-Nebraska Act and the favorite to keep
              his seat. Abraham Lincoln, the lesser-known challenger,
              pressed him on whether popular sovereignty could survive the
              Dred Scott decision.
            </p>
            <p className="text-zinc-700 text-sm md:text-base leading-relaxed">
              <span className="font-bold text-zinc-900">Outcome:</span>{" "}
              Douglas held the Senate. But the&nbsp;
              <span className="text-zinc-900 font-bold">Freeport Doctrine</span>{" "}
              he was forced to articulate split the Democratic Party two
              years later — and Lincoln&apos;s national name recognition out
              of the debates is what carried him to the 1860 presidency.
              The format set the template every modern American political
              debate has copied ever since.
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}

/**
 * ArgumentalPlayer — a 16:9 YouTube embed framed as an Argumental player:
 * dark surface, small status pill, title beside it.
 */
function ArgumentalPlayer({
  videoId,
  title,
  status = "Archive",
}: {
  videoId: string;
  title: string;
  status?: string;
}) {
  return (
    <div className="flex flex-col rounded-md overflow-hidden border border-zinc-800 bg-black">
      <div className="px-3 py-1.5 flex items-center gap-2 bg-zinc-950 border-b border-zinc-800">
        <span className="bg-zinc-700 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
          ● {status}
        </span>
        <span className="text-zinc-400 text-[10px] uppercase tracking-widest font-black truncate">
          {title}
        </span>
      </div>
      <div className="relative aspect-video">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
        />
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-[11px] font-black uppercase tracking-widest transition ${
        active
          ? "bg-black text-white"
          : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
      }`}
    >
      {children}
    </button>
  );
}
