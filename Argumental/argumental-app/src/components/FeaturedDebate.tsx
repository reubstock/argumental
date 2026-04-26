"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";
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
  const [debateStarted, setDebateStarted] = useState(false);
  const [mainTime, setMainTime] = useState(MAIN_SECS);
  const [timeA, setTimeA] = useState(PHASE_SECS);
  const [timeB, setTimeB] = useState(PHASE_SECS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!debateStarted) return;
    intervalRef.current = setInterval(() => {
      setMainTime(t => Math.max(0, t - 1));
      // Only Shapiro's clock runs at the start — AOC's stays frozen
      setTimeA(t => (t <= 1 ? PHASE_SECS : t - 1));
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [debateStarted]);

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">

      {/* Info card — left */}
      <div className="lg:w-72 flex flex-col gap-4 shrink-0">
        <div className="bg-zinc-100 border border-zinc-200 rounded-2xl p-6 flex flex-col gap-4 h-full">
          <div>
            <p className="text-yellow-600 text-xs uppercase tracking-widest font-semibold mb-2">
              Featured Bout
            </p>
            <h2 className="text-zinc-900 font-black text-xl leading-tight">
              {debate.title}
            </h2>
            <p className="text-zinc-600 text-sm mt-3 leading-relaxed">
              {debate.description}
            </p>
          </div>

          <div className="border-t border-zinc-200 pt-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-zinc-500">
              <span>Format</span>
              <span className="text-zinc-700">4 phases · 25 min</span>
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
              <span className="text-zinc-700">
                {new Date(debate.scheduledAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Call Help — just above View Debate */}
          <div className="flex items-center gap-3 mt-auto">
            {/* Life-saver icon — leftmost */}
            <svg width="36" height="36" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#DC2626"/>
              <path d="M20,2 A18,18 0 0,1 38,20 L30,20 A10,10 0 0,0 20,10 Z" fill="white"/>
              <path d="M20,38 A18,18 0 0,1 2,20 L10,20 A10,10 0 0,0 20,30 Z" fill="white"/>
              <circle cx="20" cy="20" r="10" fill="white"/>
              <circle cx="20" cy="20" r="18" fill="none" stroke="#B91C1C" strokeWidth="1"/>
              <circle cx="20" cy="20" r="10" fill="none" stroke="#B91C1C" strokeWidth="0.75"/>
            </svg>

            {/* CALL HELP — purple */}
            <span className="bg-zinc-500 text-white font-black text-xs uppercase tracking-widest px-3 py-2 rounded-lg">
              CALL HELP
            </span>

            {/* Social icons */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://argumental.vercel.app")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition"
              aria-label="Share on Facebook"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
              </svg>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Ben Shapiro vs AOC — Does Israel Have the Right to Exist? Watch live on Argumental 🥊")}&url=${encodeURIComponent("https://argumental.vercel.app")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition"
              aria-label="Share on X"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>

          <Link
            href={`/debates/${debate.id}`}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-xl text-center transition"
          >
            {debate.status === "live" ? "Watch & Vote Now" : "View Debate"}
          </Link>
        </div>
      </div>

      {/* Right: [thermometer col | video+clock col] then vote row */}
      <div className="flex-1 min-w-0 flex flex-col gap-3">

        {/* Main row — thermometers left, clock+video right, both stretch to same height */}
        <div className="flex gap-3 items-stretch">

          {/* Thermometer column: brass bell at top, totals, tubes */}
          <div className="flex flex-col shrink-0 gap-2">

            {/* Bell cell — rings when either side hits max */}
            <div className="flex items-center justify-center py-1">
              <svg
                width="40" height="34" viewBox="0 0 80 68"
                className={votesA >= MAX || votesB >= MAX ? "animate-bell-ring" : ""}
              >
                {/* Handle loop */}
                <path d="M34,7 A6,5 0 0,1 46,7" stroke="#F0A500" strokeWidth="4" fill="none" strokeLinecap="round"/>
                {/* Bell body — rounded dome, sides gently flaring outward */}
                <path d="M40,7 C31,7 21,14 19,25 C17,33 17,40 16,45 L64,45 C63,40 63,33 61,25 C59,14 49,7 40,7 Z" fill="#F0A500"/>
                {/* Flared rim — wider than body */}
                <path d="M12,45 Q12,53 40,53 Q68,53 68,45 Z" fill="#F0A500"/>
                {/* Clapper stem */}
                <line x1="40" y1="53" x2="40" y2="59" stroke="#C87800" strokeWidth="3"/>
                {/* Clapper ball */}
                <circle cx="40" cy="64" r="4.5" fill="#C87800"/>
                {/* Left inner wave */}
                <path d="M13,31 C10,35 10,41 13,45" stroke="#F0A500" strokeWidth="3" fill="none" strokeLinecap="round"/>
                {/* Left outer wave */}
                <path d="M6,26 C2,33 2,43 6,50" stroke="#F0A500" strokeWidth="3" fill="none" strokeLinecap="round"/>
                {/* Right inner wave */}
                <path d="M67,31 C70,35 70,41 67,45" stroke="#F0A500" strokeWidth="3" fill="none" strokeLinecap="round"/>
                {/* Right outer wave */}
                <path d="M74,26 C78,33 78,43 74,50" stroke="#F0A500" strokeWidth="3" fill="none" strokeLinecap="round"/>
              </svg>
            </div>

            {/* Dollar totals */}
            <div className="flex gap-2">
              <span className="w-7 text-center text-red-600 font-black text-xl tabular-nums leading-none">${votesA}</span>
              <span className="w-7 text-center text-blue-600 font-black text-xl tabular-nums leading-none">${votesB}</span>
            </div>

            {/* Tubes — fill remaining height */}
            <div className="flex gap-2 flex-1">
              <div className="w-7 bg-zinc-200 rounded-full overflow-hidden flex flex-col justify-end">
                <div
                  className="bg-red-500 w-full rounded-full transition-all duration-300 ease-out"
                  style={{ height: `${pctA}%` }}
                />
              </div>
              <div className="w-7 bg-zinc-200 rounded-full overflow-hidden flex flex-col justify-end">
                <div
                  className="bg-blue-500 w-full rounded-full transition-all duration-300 ease-out"
                  style={{ height: `${pctB}%` }}
                />
              </div>
            </div>
          </div>

          {/* Video + clock column */}
          <div className="flex-1 flex flex-col gap-3">

            {/* Debate clock — no background; activates on play */}
            <div className="flex items-center px-2 py-1 gap-4">
              <div className="flex-1 flex flex-col items-start">
                <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">
                  {debate.debaterA.name.split(" ").pop()}
                </span>
                <span className={`font-black text-3xl tabular-nums leading-none ${debateStarted ? "text-zinc-900" : "text-zinc-300"}`}>{fmt(timeA)}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-yellow-500 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Debate</span>
                <span className={`font-black text-4xl tabular-nums leading-none ${debateStarted ? "text-zinc-900" : "text-zinc-300"}`}>{fmt(mainTime)}</span>
              </div>
              <div className="flex-1 flex flex-col items-end">
                <span className="text-blue-500 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">
                  {debate.debaterB.name.split(" ").pop()}
                </span>
                <span className="text-zinc-300 font-black text-3xl tabular-nums leading-none">{fmt(timeB)}</span>
              </div>
            </div>

            {/* Video */}
            <div className="flex-1">
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
        </div>{/* end main row */}

        {/* Vote row — invisible spacer aligns buttons with video left edge */}
        <div className="flex gap-3 items-center">
          <div className="shrink-0 invisible" aria-hidden="true" style={{ width: "4rem" }} />
          <div className="flex-1 flex justify-between items-center">
            {/* Shapiro */}
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-red-500 shrink-0">
                <Image src="/shapiro.jpg" alt={debate.debaterA.name} width={48} height={48} className="w-full h-full object-cover object-top" />
              </div>
              <span className="bg-red-600 text-white font-black text-sm uppercase px-4 py-2 rounded-lg select-none">VOTE</span>
              <button onClick={() => addA(1)} className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase px-3 py-2 rounded-lg transition">$1</button>
              <button onClick={() => addA(5)} className="bg-green-500 hover:bg-green-400 text-white font-black text-xs uppercase px-3 py-2 rounded-lg transition">$5</button>
            </div>
            {/* AOC */}
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 shrink-0">
                <Image src="/aoc.jpg" alt={debate.debaterB.name} width={48} height={48} className="w-full h-full object-cover object-top" />
              </div>
              <span className="bg-blue-600 text-white font-black text-sm uppercase px-4 py-2 rounded-lg select-none">VOTE</span>
              <button onClick={() => addB(1)} className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase px-3 py-2 rounded-lg transition">$1</button>
              <button onClick={() => addB(5)} className="bg-green-500 hover:bg-green-400 text-white font-black text-xs uppercase px-3 py-2 rounded-lg transition">$5</button>
            </div>
          </div>
        </div>{/* end vote row */}

      </div>
    </div>
  );
}
