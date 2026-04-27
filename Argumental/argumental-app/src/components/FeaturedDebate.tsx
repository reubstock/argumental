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
  const [showHelpPopup, setShowHelpPopup] = useState(false);
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

  // Bell SVG shared between rows
  const BellIcon = (
    <svg width="54" height="60" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"
      className={votesA >= MAX || votesB >= MAX ? "animate-bell-ring" : ""}>
      <defs>
        <radialGradient id="bellBody" cx="38%" cy="30%" r="65%">
          <stop offset="0%"   stopColor="#FEF3C7"/>
          <stop offset="22%"  stopColor="#FCD34D"/>
          <stop offset="52%"  stopColor="#D97706"/>
          <stop offset="82%"  stopColor="#B45309"/>
          <stop offset="100%" stopColor="#78350F"/>
        </radialGradient>
        <radialGradient id="bellClapper" cx="38%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="#FDE68A"/>
          <stop offset="55%"  stopColor="#D97706"/>
          <stop offset="100%" stopColor="#78350F"/>
        </radialGradient>
        <linearGradient id="bellRing" x1="20%" y1="20%" x2="80%" y2="80%">
          <stop offset="0%"   stopColor="#FDE68A"/>
          <stop offset="50%"  stopColor="#D97706"/>
          <stop offset="100%" stopColor="#78350F"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="10" r="7" fill="none" stroke="url(#bellRing)" strokeWidth="4.5"/>
      <path d="M38,16 Q50,14 62,16 L64,28 Q50,26 36,28 Z" fill="url(#bellBody)"/>
      <path d="M38,20 Q50,18 62,20" stroke="#FEF3C7" strokeWidth="1.2" fill="none" opacity="0.55"/>
      <path d="M36,25 Q50,23 64,25" stroke="#FEF3C7" strokeWidth="1.2" fill="none" opacity="0.45"/>
      <path d="M36,28 C27,32 18,42 14,54 C11,63 10,70 9,75 L91,75 C90,70 89,63 86,54 C82,42 73,32 64,28 Z" fill="url(#bellBody)"/>
      <path d="M9,75 C5,79 3,82 1,86 L99,86 C97,82 95,79 91,75 Z" fill="url(#bellBody)"/>
      <ellipse cx="50" cy="86" rx="49" ry="5.5" fill="#92400E"/>
      <ellipse cx="50" cy="84" rx="42" ry="4" fill="#5C2206"/>
      <path d="M33,30 C29,43 28,56 30,68" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.18"/>
      <path d="M34,30 C31,43 30,56 32,68" stroke="#FEF3C7" strokeWidth="2.5" strokeLinecap="round" opacity="0.28"/>
      <line x1="50" y1="75" x2="50" y2="88" stroke="#92400E" strokeWidth="3"/>
      <circle cx="50" cy="97" r="8.5" fill="url(#bellClapper)"/>
      <circle cx="46" cy="93" r="3" fill="white" opacity="0.2"/>
    </svg>
  );

  return (
    <div className="max-w-6xl mx-auto flex gap-6">

      {/* ── LEFT: Info card ── */}
      <div className="w-72 shrink-0 flex flex-col gap-4">
        <div className="bg-zinc-100 border border-zinc-200 rounded-2xl p-6 flex flex-col gap-4 h-full">
          <div>
            <p className="text-yellow-600 text-xs uppercase tracking-widest font-semibold mb-2">Featured Bout</p>
            <h2 className="text-zinc-900 font-black text-xl leading-tight">{debate.title}</h2>
            <p className="text-zinc-600 text-sm mt-3 leading-relaxed">{debate.description}</p>
          </div>
          <div className="border-t border-zinc-200 pt-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-zinc-500"><span>Format</span><span className="text-zinc-700">4 phases · 25 min</span></div>
            <div className="flex justify-between text-zinc-500"><span>Vote cost</span><span className="text-zinc-700">$5 per vote</span></div>
            <div className="flex justify-between text-zinc-500"><span>Charity cut</span><span className="text-zinc-700">10% to winner&apos;s pick</span></div>
            <div className="flex justify-between text-zinc-500">
              <span>Date</span>
              <span className="text-zinc-700">{new Date(debate.scheduledAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</span>
            </div>
          </div>
          <div className="flex items-end justify-between mt-auto">
            {/* Telephone icon + CALL FOR HELP — clickable, opens share popup */}
            <div className="relative flex flex-col items-center gap-1">
              {showHelpPopup && (
                <>
                  {/* Backdrop to close on outside click */}
                  <div className="fixed inset-0 z-40" onClick={() => setShowHelpPopup(false)}/>
                  {/* Popup */}
                  <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-50 bg-white border border-zinc-200 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 min-w-[180px]">
                    <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest text-center">Share this debate</p>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://argumental.vercel.app")}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2 rounded-xl bg-zinc-50 hover:bg-blue-50 transition"
                      onClick={() => setShowHelpPopup(false)}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                      <span className="text-sm font-semibold text-zinc-700">Facebook</span>
                    </a>
                    <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Ben Shapiro vs AOC — Does Israel Have the Right to Exist? Watch live on Argumental 🥊")}&url=${encodeURIComponent("https://argumental.vercel.app")}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition"
                      onClick={() => setShowHelpPopup(false)}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      <span className="text-sm font-semibold text-zinc-700">X / Twitter</span>
                    </a>
                  </div>
                </>
              )}
              <button onClick={() => setShowHelpPopup(v => !v)} className="flex flex-col items-center gap-1 hover:opacity-80 transition cursor-pointer">
                {/* Classic desk telephone — handset on top, rotary dial below */}
                <svg width="44" height="44" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  {/* Phone body */}
                  <rect x="4" y="17" width="32" height="20" rx="4" fill="#DC2626"/>
                  {/* Handset: two earpiece cups + curved bridge, sitting on top of body */}
                  <ellipse cx="9"  cy="15" rx="5.5" ry="4.5" fill="#DC2626" stroke="#991B1B" strokeWidth="1"/>
                  <ellipse cx="31" cy="15" rx="5.5" ry="4.5" fill="#DC2626" stroke="#991B1B" strokeWidth="1"/>
                  <path d="M9,11 C14,5 26,5 31,11 L31,19 C26,15 14,15 9,19 Z" fill="#B91C1C"/>
                  {/* Rotary dial — outer ring, inner stop, finger holes */}
                  <circle cx="20" cy="28" r="8.5" fill="#B91C1C"/>
                  <circle cx="20" cy="28" r="3.5" fill="#7F1D1D"/>
                  {/* 8 finger holes evenly spaced at r=6 */}
                  <circle cx="20.0" cy="22.0" r="1.3" fill="#7F1D1D"/>
                  <circle cx="24.2" cy="23.2" r="1.3" fill="#7F1D1D"/>
                  <circle cx="26.0" cy="28.0" r="1.3" fill="#7F1D1D"/>
                  <circle cx="24.2" cy="32.8" r="1.3" fill="#7F1D1D"/>
                  <circle cx="20.0" cy="34.0" r="1.3" fill="#7F1D1D"/>
                  <circle cx="15.8" cy="32.8" r="1.3" fill="#7F1D1D"/>
                  <circle cx="14.0" cy="28.0" r="1.3" fill="#7F1D1D"/>
                  <circle cx="15.8" cy="23.2" r="1.3" fill="#7F1D1D"/>
                </svg>
                <span className="bg-zinc-500 text-white font-black text-xs uppercase tracking-widest px-3 py-2 rounded-lg whitespace-nowrap">CALL FOR HELP</span>
              </button>
            </div>
            {/* Share icons — right-side group */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-zinc-400 text-xs font-semibold uppercase tracking-widest leading-none">Share</span>
              <div className="flex items-center gap-3">
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://argumental.vercel.app")}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition" aria-label="Share on Facebook">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                </a>
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Ben Shapiro vs AOC — Does Israel Have the Right to Exist? Watch live on Argumental 🥊")}&url=${encodeURIComponent("https://argumental.vercel.app")}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition" aria-label="Share on X">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#000000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>
          </div>
          <Link href={`/debates/${debate.id}`} className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-xl text-center transition">
            {debate.status === "live" ? "Watch & Vote Now" : "View Debate"}
          </Link>
        </div>
      </div>

      {/* ── MIDDLE + RIGHT: single items-stretch row so left column spans clock + video height ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-3">

        <div className="flex gap-3 items-stretch">

          {/* Left column: bell at top (aligns with clock bar top) → dollars → tubes spanning full height */}
          <div className="w-20 shrink-0 flex flex-col items-center gap-1">
            {BellIcon}
            <div className="flex gap-2 justify-center">
              <span className="text-red-600 font-black text-base tabular-nums leading-none">${votesA}</span>
              <span className="text-blue-600 font-black text-base tabular-nums leading-none">${votesB}</span>
            </div>
            {/* Tubes fill ALL remaining height — clock bar + gap + video */}
            <div className="flex-1 flex justify-center gap-2 pt-1">
              <div className="w-5 bg-zinc-200 rounded-full overflow-hidden flex flex-col justify-end">
                <div className="bg-red-500 w-full rounded-full transition-all duration-300 ease-out" style={{height:`${pctA}%`}}/>
              </div>
              <div className="w-5 bg-zinc-200 rounded-full overflow-hidden flex flex-col justify-end">
                <div className="bg-blue-500 w-full rounded-full transition-all duration-300 ease-out" style={{height:`${pctB}%`}}/>
              </div>
            </div>
          </div>

          {/* Right column: clock bar stacked above video */}
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center bg-zinc-900 rounded-xl px-5 py-3 gap-4">
              <div className="flex-1 flex flex-col items-start">
                <span className="text-red-400 text-xs font-bold uppercase tracking-widest leading-none mb-1">{debate.debaterA.name.split(" ").pop()}</span>
                <span className={`font-black text-2xl tabular-nums leading-none ${debateStarted ? "text-white" : "text-zinc-600"}`}>{fmt(timeA)}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest leading-none mb-1">Debate</span>
                <span className={`font-black text-3xl tabular-nums leading-none ${debateStarted ? "text-white" : "text-zinc-600"}`}>{fmt(mainTime)}</span>
              </div>
              <div className="flex-1 flex flex-col items-end">
                <span className="text-blue-400 text-xs font-bold uppercase tracking-widest leading-none mb-1">{debate.debaterB.name.split(" ").pop()}</span>
                <span className="text-zinc-600 font-black text-2xl tabular-nums leading-none">{fmt(timeB)}</span>
              </div>
            </div>
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

        {/* Vote row — spacer matches bell column so content left-aligns with video */}
        <div className="flex gap-3">
          <div className="w-20 shrink-0" />
          <div className="flex-1 flex justify-between items-center bg-zinc-100 rounded-xl px-4 py-3">
            {/* Shapiro — photo · VOTE label · $1 · $5 */}
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-red-400 shrink-0">
                <Image src="/shapiro.jpg" alt={debate.debaterA.name} width={48} height={48} className="w-full h-full object-cover object-top"/>
              </div>
              <span className="text-red-600 font-black text-xs uppercase tracking-widest select-none">VOTE</span>
              <button onClick={() => addA(1)} className="bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 font-bold text-xs uppercase px-3 py-2 rounded-lg transition">$1</button>
              <button onClick={() => addA(5)} className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase px-3 py-2 rounded-lg transition">$5</button>
            </div>
            {/* AOC — $5 · $1 · VOTE label · photo */}
            <div className="flex items-center gap-2">
              <button onClick={() => addB(5)} className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase px-3 py-2 rounded-lg transition">$5</button>
              <button onClick={() => addB(1)} className="bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 font-bold text-xs uppercase px-3 py-2 rounded-lg transition">$1</button>
              <span className="text-blue-600 font-black text-xs uppercase tracking-widest select-none">VOTE</span>
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-400 shrink-0">
                <Image src="/aoc.jpg" alt={debate.debaterB.name} width={48} height={48} className="w-full h-full object-cover object-top"/>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
