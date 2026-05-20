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
/* CURRENT — Inaugural Israel bout, scheduled. Vote opens at bout start.   */
/* ────────────────────────────────────────────────────────────────────── */

function CurrentVerdicts() {
  return (
    <Panel className="overflow-hidden">
      {/* Status strip */}
      <div className="bg-zinc-50 border-b border-zinc-200 px-4 md:px-5 py-2.5 flex items-center gap-3 flex-wrap">
        <span className="bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full">
          ● Inaugural · Coming up
        </span>
        <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-black">
          Foreign Policy
        </span>
        <span className="text-zinc-300">·</span>
        <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-black">
          Vote opens at bout start
        </span>
      </div>

      <div className="p-5 md:p-6 flex flex-col gap-6">
        <div>
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-black mb-1">
            Bout 01 · the inaugural matchup
          </p>
          <h2 className="text-zinc-900 font-black text-xl md:text-3xl leading-tight">
            Does Israel Have the Right to Exist?
          </h2>
        </div>

        {/* Watch + matchup: half-size player on the left (homepage cover),
            stacked debater cards on the right. No vote counts — bout
            hasn't run. */}
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
            <MatchupPanel
              side="A"
              name="Ben Shapiro"
              position="FOR"
              photo="/shapiro.jpg"
              charity="Friends of the IDF"
            />
            <MatchupPanel
              side="B"
              name="Alexandria Ocasio-Cortez"
              position="AGAINST"
              photo="/aoc.jpg"
              charity="UNRWA USA"
            />
          </div>
        </div>

        {/* Format facts row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 border-t border-zinc-200 pt-5">
          <Stat
            kicker="Format"
            value="4 phases · 24 min"
            sub="No moderator"
          />
          <Stat
            kicker="Vote"
            value="$5 / vote"
            sub="1 vote per viewer · $10 wk cap"
          />
          <Stat
            kicker="Charity payout"
            value="18% of pot"
            sub="To the winner's chosen org"
          />
        </div>

        {/* What's at stake — forward-looking */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 border-t border-zinc-200 pt-6">
          <div>
            <p className="text-black text-[10px] md:text-xs uppercase tracking-widest font-black mb-2">
              What&apos;s at stake
            </p>
            <p className="text-zinc-700 text-sm md:text-base leading-relaxed">
              Argumental&apos;s inaugural bout puts one of the most
              contested questions of the era — the legitimacy of the
              State of Israel — in front of an unmoderated,
              audience-judged crowd. A Shapiro win routes 18% of the
              pot to{" "}
              <span className="text-zinc-900 font-bold">
                Friends of the Israel Defense Forces
              </span>
              ; an Ocasio-Cortez win sends it to{" "}
              <span className="text-zinc-900 font-bold">UNRWA USA</span>.
              Beyond the charity flow, this bout sets the league&apos;s
              first Foreign Policy ranking and the inaugural No.&nbsp;1
              challenger to the Tier-1 belt.
            </p>
          </div>
          <div>
            <p className="text-black text-[10px] md:text-xs uppercase tracking-widest font-black mb-2">
              How voting works
            </p>
            <p className="text-zinc-700 text-sm md:text-base leading-relaxed">
              Once the bout opens, viewers load $5+ into a Stripe wallet
              and cast votes during the live broadcast. Each viewer gets
              one $5 vote per bout, capped at $10 per week across the
              league. The live tally drives the side bars on screen, so
              every speaker sees the room move (or not) in real time —
              and 18% of every dollar routes to the winner&apos;s
              chosen org the moment the verdict lands.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 flex-wrap">
          <a
            href="/debates/israel-001"
            className="bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-[11px] px-3 py-2 rounded-md transition"
          >
            See the bout page →
          </a>
          <a
            href="/upcoming"
            className="bg-white hover:bg-zinc-50 border border-zinc-300 hover:border-black text-zinc-800 font-black uppercase tracking-widest text-[11px] px-3 py-2 rounded-md transition"
          >
            See all upcoming bouts
          </a>
        </div>
      </div>
    </Panel>
  );
}

function MatchupPanel({
  side,
  name,
  position,
  photo,
  charity,
}: {
  side: "A" | "B";
  name: string;
  position: string;
  photo: string;
  charity: string;
}) {
  const accentText = side === "A" ? "text-brand-red" : "text-brand-blue";
  const accentBorder =
    side === "A" ? "border-brand-red" : "border-brand-blue";

  return (
    <div className="border border-zinc-200 bg-white rounded-md p-4 flex items-center gap-3 md:gap-4">
      <div
        className={`w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 ${accentBorder} shrink-0`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt={name}
          className="w-full h-full object-cover object-top"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`${accentText} text-[10px] uppercase tracking-widest font-black`}
        >
          {position}
        </p>
        <p className="text-zinc-900 font-bold text-sm md:text-base leading-tight">
          {name}
        </p>
        <p className="text-zinc-500 text-xs md:text-sm mt-0.5">
          Charity: <span className="text-zinc-700 font-bold">{charity}</span>
        </p>
      </div>
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
/* HISTORICAL — Kennedy/Nixon · Wolff/Epstein · Hasan/Phillips ·           */
/* Lincoln/Douglas.                                                        */
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

      {/* Hasan vs Phillips — Anti-Zionism is Anti-Semitism */}
      <Panel className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="md:col-span-2 bg-black">
            <ArgumentalPlayer
              videoId="K1VTt_THL4A"
              title="Hasan vs. Phillips — Anti-Zionism is Anti-Semitism"
            />
          </div>
          <div className="md:col-span-3 p-5 md:p-6 flex flex-col gap-3">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-black">
                Cambridge Union
              </span>
              <span className="text-zinc-300">·</span>
              <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-black">
                Israel · Anti-Semitism
              </span>
            </div>
            <h3 className="text-zinc-900 font-black text-xl md:text-2xl leading-tight">
              Hasan vs. Phillips
            </h3>
            <p className="text-zinc-700 text-sm md:text-base leading-relaxed">
              Mehdi Hasan and Melanie Phillips on whether anti-Zionism
              is anti-Semitism — one of the most charged framings in
              modern political debate. Hasan opposing the motion,
              Phillips for. Union-house format, audience votes before
              and after, no moderator wrap-up.
            </p>
            <p className="text-zinc-700 text-sm md:text-base leading-relaxed">
              <span className="font-bold text-zinc-900">Outcome:</span>{" "}
              Both names came in established. The format — same{" "}
              <span className="text-zinc-900 font-bold">vote-shift</span>{" "}
              methodology Argumental is built on — let the room decide
              which case actually moved minds. The verdict is on the
              tape.
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
 * ArgumentalPlayer — YouTube embed framed as an Argumental player.
 *
 * Sizing: the player fills its container's height (h-full + flex-1 on
 * the iframe wrapper). On the historical /outcomes panels the column
 * is taller than a natural 16:9 player would be, so we let the iframe
 * stretch — YouTube's player letterboxes the video inside, and the
 * letterbox bars match our black surround for a seamless look.
 *
 * Falls back to a sensible 16:9 minimum so the player still has shape
 * if its container has no defined height (e.g. when standalone).
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
    <div className="flex flex-col h-full rounded-md overflow-hidden border border-zinc-800 bg-black">
      <div className="px-3 py-1.5 flex items-center gap-2 bg-zinc-950 border-b border-zinc-800 shrink-0">
        <span className="bg-zinc-700 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
          ● {status}
        </span>
        <span className="text-zinc-400 text-[10px] uppercase tracking-widest font-black truncate">
          {title}
        </span>
      </div>
      <div className="relative flex-1 min-h-[260px] aspect-video md:aspect-auto">
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
