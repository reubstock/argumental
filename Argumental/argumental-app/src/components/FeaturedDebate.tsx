"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";
import Panel from "@/components/Panel";
import VerdictIndicator from "@/components/VerdictIndicator";
import type { Debate } from "@/lib/types";

const MAX = 100;
const MAIN_SECS = 24 * 60;
const PHASE_SECS = 6 * 60;

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export default function FeaturedDebate({ debate }: { debate: Debate }) {
  const [votesA, setVotesA] = useState(0);
  const [votesB, setVotesB] = useState(0);

  const addA = (amt: number) => setVotesA((v) => Math.min(v + amt, MAX));
  const addB = (amt: number) => setVotesB((v) => Math.min(v + amt, MAX));

  const pctA = (votesA / MAX) * 100;
  const pctB = (votesB / MAX) * 100;

  // Debate clock
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [debateStarted, setDebateStarted] = useState(false);
  const [mainTime, setMainTime] = useState(MAIN_SECS);
  const [timeA, setTimeA] = useState(PHASE_SECS);
  const [timeB, setTimeB] = useState(PHASE_SECS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!debateStarted) return;
    intervalRef.current = setInterval(() => {
      setMainTime((t) => Math.max(0, t - 1));
      // Only Shapiro's clock runs at the start — AOC's stays frozen
      setTimeA((t) => (t <= 1 ? PHASE_SECS : t - 1));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [debateStarted]);

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 md:gap-6">

      {/* ── LEFT: Info card + action boxes ── */}
      <div className="w-full md:w-72 md:shrink-0 flex flex-col gap-3">
        <Panel label="Featured Bout">
          <div className="p-4 flex flex-col gap-3">
            <div>
              <h2 className="text-zinc-900 font-black text-lg leading-tight">
                {debate.title}
              </h2>
              <p className="text-zinc-600 text-sm mt-2 leading-snug">
                {debate.description}
              </p>
            </div>
            <div className="border-t border-zinc-200 pt-3 flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between text-zinc-500">
                <span>Format</span>
                <span className="text-zinc-700">4 phases · 24 mins</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Vote cost</span>
                <span className="text-zinc-700">$5 per vote</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Charity cut</span>
                <span className="text-zinc-700">10% to winner&apos;s pick</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Date</span>
                <span className="text-zinc-700 tabular-nums">
                  {new Date(debate.scheduledAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
            <div className="flex items-end justify-between">
              {/* Telephone icon + CALL FOR HELP — clickable, opens share popup */}
              <div className="relative flex flex-col items-center gap-1">
                {showHelpPopup && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowHelpPopup(false)} />
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-50 bg-white border border-zinc-200 rounded-md shadow-2xl p-4 flex flex-col gap-3 min-w-[180px]">
                      <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest text-center">Share this debate</p>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://argumental.vercel.app")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2 rounded-md bg-zinc-50 hover:bg-zinc-100 transition"
                        onClick={() => setShowHelpPopup(false)}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                        <span className="text-sm font-semibold text-zinc-700">Facebook</span>
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Ben Shapiro vs AOC — Does Israel Have the Right to Exist? Watch live on Argumental 🥊")}&url=${encodeURIComponent("https://argumental.vercel.app")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2 rounded-md bg-zinc-50 hover:bg-zinc-100 transition"
                        onClick={() => setShowHelpPopup(false)}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        <span className="text-sm font-semibold text-zinc-700">X / Twitter</span>
                      </a>
                    </div>
                  </>
                )}
                <button
                  onClick={() => setShowHelpPopup((v) => !v)}
                  className="flex flex-col items-center gap-1.5 hover:opacity-80 transition cursor-pointer"
                >
                  <div className="h-8 flex items-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-red">
                      <path d="M22 16.92v3a2 2 0 0 1 -2.18 2a19.79 19.79 0 0 1 -8.63 -3.07a19.5 19.5 0 0 1 -6 -6a19.79 19.79 0 0 1 -3.07 -8.67a2 2 0 0 1 1.99 -2.18h3a2 2 0 0 1 2 1.72a12.84 12.84 0 0 0 .7 2.81a2 2 0 0 1 -.45 2.11l-1.27 1.27a16 16 0 0 0 6 6l1.27 -1.27a2 2 0 0 1 2.11 -.45a12.84 12.84 0 0 0 2.81 .7a2 2 0 0 1 1.72 2z"/>
                    </svg>
                  </div>
                  <span className="bg-zinc-100 text-zinc-700 font-black text-[10px] uppercase tracking-widest px-2 py-1 rounded-md whitespace-nowrap">Call for help</span>
                </button>
              </div>
              {/* Share — FB + X icons inline with phone, matching pill below */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="h-8 flex items-center gap-3">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://argumental.vercel.app")}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition" aria-label="Share on Facebook">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                  </a>
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Ben Shapiro vs AOC — Does Israel Have the Right to Exist? Watch live on Argumental 🥊")}&url=${encodeURIComponent("https://argumental.vercel.app")}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition" aria-label="Share on X">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#000000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                </div>
                <span className="bg-zinc-100 text-zinc-700 font-black text-[10px] uppercase tracking-widest px-2 py-1 rounded-md whitespace-nowrap">Share</span>
              </div>
            </div>
            <Link
              href={`/debates/${debate.id}`}
              className="bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-xs py-2.5 rounded-md text-center transition"
            >
              {debate.status === "live" ? "Watch & Vote Now" : "View Debate"}
            </Link>
          </div>
        </Panel>

        {/* Action boxes — link to /upcoming forms */}
        <Link
          href="/upcoming#topic"
          className="block w-full bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-black rounded-md py-3 text-center font-black text-xs uppercase tracking-widest text-zinc-800 transition"
        >
          Suggest New Topic
        </Link>
        <Link
          href="/upcoming#nominate"
          className="block w-full bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-black rounded-md py-3 text-center font-black text-xs uppercase tracking-widest text-zinc-800 transition"
        >
          Nominate Debater
        </Link>
      </div>

      {/* ── MIDDLE + RIGHT ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="flex gap-3 items-stretch">

          {/* Left column: verdict indicator → tally → tubes — desktop only */}
          <div className="hidden md:flex w-20 shrink-0 flex-col items-center gap-1 pt-1">
            <VerdictIndicator
              votesA={votesA}
              votesB={votesB}
              max={MAX}
              active={debateStarted}
            />
            <div className="flex gap-2 justify-center mt-1">
              <span className="text-brand-red font-black text-base tabular-nums leading-none">${votesA}</span>
              <span className="text-brand-blue font-black text-base tabular-nums leading-none">${votesB}</span>
            </div>
            <div className="flex-1 flex justify-center gap-2 pt-1">
              <div className="w-5 bg-zinc-100 border border-zinc-200 rounded-full overflow-hidden flex flex-col justify-end">
                <div className="bg-brand-red w-full transition-all duration-300 ease-out" style={{ height: `${pctA}%` }} />
              </div>
              <div className="w-5 bg-zinc-100 border border-zinc-200 rounded-full overflow-hidden flex flex-col justify-end">
                <div className="bg-brand-blue w-full transition-all duration-300 ease-out" style={{ height: `${pctB}%` }} />
              </div>
            </div>
          </div>

          {/* Right column: clock bar stacked above video */}
          <div className="flex-1 flex flex-col gap-3">
            <Panel variant="dark" label="Live Clock">
              <div className="flex items-center px-5 py-3 gap-4">
                <div className="flex-1 flex flex-col items-start">
                  <span className="text-brand-red text-xs font-bold uppercase tracking-widest leading-none mb-1">
                    {debate.debaterA.name.split(" ").pop()}
                  </span>
                  <span className={`font-black text-2xl tabular-nums leading-none ${debateStarted ? "text-white" : "text-zinc-600"}`}>
                    {fmt(timeA)}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-white text-xs font-bold uppercase tracking-widest leading-none mb-1">Debate</span>
                  <span className={`font-black text-3xl tabular-nums leading-none ${debateStarted ? "text-white" : "text-zinc-600"}`}>
                    {fmt(mainTime)}
                  </span>
                </div>
                <div className="flex-1 flex flex-col items-end">
                  <span className="text-brand-blue text-xs font-bold uppercase tracking-widest leading-none mb-1">
                    {debate.debaterB.name.split(" ").pop()}
                  </span>
                  <span className="text-zinc-600 font-black text-2xl tabular-nums leading-none">
                    {fmt(timeB)}
                  </span>
                </div>
              </div>
            </Panel>
            <VideoPlayer
              youtubeId="YQ7IudJBpf0"
              debaterAName={debate.debaterA.name}
              debaterAPhoto="/shapiro.jpg"
              debaterAPosition={debate.debaterA.position}
              debaterBName={debate.debaterB.name}
              debaterBPhoto="/aoc.jpg"
              debaterBPosition={debate.debaterB.position}
              isLive={debate.status === "live"}
              onPlay={() => setDebateStarted(true)}
            />
          </div>
        </div>

        {/* Vote row */}
        <div className="flex gap-3">
          <div className="hidden md:block w-20 shrink-0" />
          <Panel className="flex-1">
            {/* Mobile-only tug-of-war progress bar (replaces hidden desktop tubes) */}
            <div className="md:hidden flex items-center gap-2 px-3 pt-2.5 text-[11px] font-black tabular-nums">
              <span className="text-brand-red">${votesA}</span>
              <div className="flex-1 flex h-1.5 rounded-full overflow-hidden bg-zinc-100">
                <div
                  className="bg-brand-red transition-all duration-300"
                  style={{ width: `${pctA / 2}%` }}
                />
                <div className="flex-1" />
                <div
                  className="bg-brand-blue transition-all duration-300"
                  style={{ width: `${pctB / 2}%` }}
                />
              </div>
              <span className="text-brand-blue">${votesB}</span>
            </div>
            <div className="flex justify-between items-center px-3 md:px-4 py-3">
              {/* Side A — photo · VOTE label · $1 · $5 */}
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-9 h-9 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-brand-red shrink-0">
                  <Image src="/shapiro.jpg" alt={debate.debaterA.name} width={48} height={48} className="w-full h-full object-cover object-top" />
                </div>
                <span className="hidden sm:inline text-brand-red font-black text-xs uppercase tracking-widest select-none">Vote</span>
                <button onClick={() => addA(1)} className="bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 font-bold text-xs uppercase px-2.5 md:px-3 py-2 rounded-md transition">$1</button>
                <button onClick={() => addA(5)} className="bg-black hover:bg-zinc-800 text-white font-black text-xs uppercase px-2.5 md:px-3 py-2 rounded-md transition">$5</button>
              </div>
              {/* Side B — $5 · $1 · VOTE label · photo */}
              <div className="flex items-center gap-1.5 md:gap-2">
                <button onClick={() => addB(5)} className="bg-black hover:bg-zinc-800 text-white font-black text-xs uppercase px-2.5 md:px-3 py-2 rounded-md transition">$5</button>
                <button onClick={() => addB(1)} className="bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 font-bold text-xs uppercase px-2.5 md:px-3 py-2 rounded-md transition">$1</button>
                <span className="hidden sm:inline text-brand-blue font-black text-xs uppercase tracking-widest select-none">Vote</span>
                <div className="w-9 h-9 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-brand-blue shrink-0">
                  <Image src="/aoc.jpg" alt={debate.debaterB.name} width={48} height={48} className="w-full h-full object-cover object-top" />
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
