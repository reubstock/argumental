"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";
import type { Debate } from "@/lib/types";

const MAX = 100;

export default function FeaturedDebate({ debate }: { debate: Debate }) {
  const [votesA, setVotesA] = useState(0);
  const [votesB, setVotesB] = useState(0);

  const addA = (amt: number) => setVotesA((v) => Math.min(v + amt, MAX));
  const addB = (amt: number) => setVotesB((v) => Math.min(v + amt, MAX));

  const pctA = (votesA / MAX) * 100;
  const pctB = (votesB / MAX) * 100;

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 items-stretch">

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

          <Link
            href={`/debates/${debate.id}`}
            className="mt-auto bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-xl text-center transition"
          >
            {debate.status === "live" ? "Watch & Vote Now" : "View Debate"}
          </Link>
        </div>
      </div>

      {/* Thermometers — center column */}
      <div className="flex gap-3 justify-center items-stretch shrink-0 py-2">
        {/* Shapiro — red */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-red-600 font-black text-sm tabular-nums">${votesA}</span>
          <div className="w-8 flex-1 min-h-[220px] bg-zinc-200 rounded-full overflow-hidden flex flex-col justify-end">
            <div
              className="bg-red-500 w-full rounded-full transition-all duration-300 ease-out"
              style={{ height: `${pctA}%` }}
            />
          </div>
          <span className="text-zinc-400 text-xs font-black uppercase">A</span>
        </div>

        {/* AOC — blue */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-blue-600 font-black text-sm tabular-nums">${votesB}</span>
          <div className="w-8 flex-1 min-h-[220px] bg-zinc-200 rounded-full overflow-hidden flex flex-col justify-end">
            <div
              className="bg-blue-500 w-full rounded-full transition-all duration-300 ease-out"
              style={{ height: `${pctB}%` }}
            />
          </div>
          <span className="text-zinc-400 text-xs font-black uppercase">B</span>
        </div>
      </div>

      {/* Video + vote row + summon posse — right */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">

        {/* Video */}
        <VideoPlayer
          youtubeId="YQ7IudJBpf0"
          debaterAName={debate.debaterA.name}
          debaterAPhoto="/shapiro.jpg"
          debaterAPosition={debate.debaterA.position}
          debaterBName={debate.debaterB.name}
          debaterBPhoto="/aoc.jpg"
          debaterBPosition={debate.debaterB.position}
          isLive={debate.status === "live"}
        />

        {/* Vote row */}
        <div className="flex justify-between items-center px-1 gap-4">
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

        {/* Summon Posse */}
        <div className="flex items-center gap-2 px-1">
          <span className="bg-zinc-900 text-white font-black text-sm uppercase tracking-widest px-5 py-2.5 rounded-xl">
            SUMMON POSSE
          </span>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://argumental.vercel.app")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-3 py-2.5 rounded-lg transition"
          >
            Meta
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Ben Shapiro vs AOC — Does Israel Have the Right to Exist? Watch live on Argumental 🥊")}&url=${encodeURIComponent("https://argumental.vercel.app")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black hover:bg-zinc-800 text-white font-black text-xs px-3 py-2.5 rounded-lg transition border border-zinc-700"
          >
            𝕏
          </a>
        </div>

      </div>
    </div>
  );
}
