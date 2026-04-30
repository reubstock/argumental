"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  debaterAName: string;
  debaterAPhoto: string;
  debaterBName: string;
  debaterBPhoto: string;
}

const MAX = 100;

export default function VoteSection({ debaterAName, debaterAPhoto, debaterBName, debaterBPhoto }: Props) {
  const [votesA, setVotesA] = useState(0);
  const [votesB, setVotesB] = useState(0);

  const addA = (amt: number) => setVotesA((v) => Math.min(v + amt, MAX));
  const addB = (amt: number) => setVotesB((v) => Math.min(v + amt, MAX));

  const pctA = (votesA / MAX) * 100;
  const pctB = (votesB / MAX) * 100;

  return (
    <>
      {/* Fixed thermometers — right edge */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex gap-2 items-end">
        {/* Shapiro — red */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-brand-red font-black text-xs tabular-nums">${votesA}</span>
          <div className="w-3 h-44 bg-zinc-200 rounded-full overflow-hidden flex flex-col justify-end">
            <div
              className="bg-brand-red w-full rounded-full transition-all duration-300 ease-out"
              style={{ height: `${pctA}%` }}
            />
          </div>
          <span className="text-zinc-400 text-[10px] font-bold uppercase">A</span>
        </div>

        {/* AOC — blue */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-brand-blue font-black text-xs tabular-nums">${votesB}</span>
          <div className="w-3 h-44 bg-zinc-200 rounded-full overflow-hidden flex flex-col justify-end">
            <div
              className="bg-brand-blue w-full rounded-full transition-all duration-300 ease-out"
              style={{ height: `${pctB}%` }}
            />
          </div>
          <span className="text-zinc-400 text-[10px] font-bold uppercase">B</span>
        </div>
      </div>

      {/* Vote row below video */}
      <div className="flex justify-between items-center px-1 gap-4">
        {/* Shapiro — left */}
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-red shrink-0">
            <Image src={debaterAPhoto} alt={debaterAName} width={48} height={48} className="w-full h-full object-cover object-top" />
          </div>
          <span className="bg-brand-red text-white font-black text-sm uppercase px-4 py-2 rounded-lg select-none">VOTE</span>
          <button
            onClick={() => addA(1)}
            className="bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 font-black text-xs uppercase px-3 py-2 rounded-lg transition"
          >
            $1
          </button>
          <button
            onClick={() => addA(5)}
            className="bg-black hover:bg-zinc-800 text-white font-black text-xs uppercase px-3 py-2 rounded-lg transition"
          >
            $5
          </button>
        </div>

        {/* AOC — right */}
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-blue shrink-0">
            <Image src={debaterBPhoto} alt={debaterBName} width={48} height={48} className="w-full h-full object-cover object-top" />
          </div>
          <span className="bg-brand-blue text-white font-black text-sm uppercase px-4 py-2 rounded-lg select-none">VOTE</span>
          <button
            onClick={() => addB(1)}
            className="bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 font-black text-xs uppercase px-3 py-2 rounded-lg transition"
          >
            $1
          </button>
          <button
            onClick={() => addB(5)}
            className="bg-black hover:bg-zinc-800 text-white font-black text-xs uppercase px-3 py-2 rounded-lg transition"
          >
            $5
          </button>
        </div>
      </div>
    </>
  );
}
