"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Props {
  youtubeId: string;
  debaterAName: string;
  debaterAPhoto: string;
  debaterAPosition: string;
  debaterBName: string;
  debaterBPhoto: string;
  debaterBPosition: string;
  isLive?: boolean;
}

const DEBATE_SECONDS = 25 * 60;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function VideoPlayer({
  youtubeId,
  debaterAName,
  debaterAPhoto,
  debaterAPosition,
  debaterBName,
  debaterBPhoto,
  debaterBPosition,
  isLive = false,
}: Props) {
  const [playing, setPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DEBATE_SECONDS);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    startedAtRef.current = Date.now();

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAtRef.current!) / 1000);
      const remaining = Math.max(0, DEBATE_SECONDS - elapsed);
      setTimeLeft(remaining);
      if (remaining === 0) clearInterval(interval);
    }, 500);

    return () => clearInterval(interval);
  }, [playing]);

  if (playing) {
    return (
      <div className="relative bg-black rounded-2xl overflow-hidden aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />

        {/* 25-minute countdown overlay */}
        <div className="absolute top-0 left-0 right-0 z-30 flex justify-center pt-3 pointer-events-none">
          <div className="bg-black/70 backdrop-blur-sm rounded-xl px-5 py-2 text-center">
            <p className="text-yellow-400 text-[10px] uppercase tracking-widest font-bold leading-none mb-1">
              Debate Timer
            </p>
            <p className="text-white font-black text-2xl leading-none tabular-nums">
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden aspect-video flex items-center justify-center cursor-pointer group"
      onClick={() => setPlaying(true)}
    >
      {/* Promotional cover image */}
      <div className="absolute inset-0">
        <Image src="/debate-cover.jpg" alt="Debate cover" fill className="object-cover object-center" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="w-20 h-20 rounded-full bg-black/60 border-2 border-white/40 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:bg-black/80 transition-all duration-200">
          <div className="w-0 h-0 border-t-[14px] border-t-transparent border-l-[24px] border-l-white border-b-[14px] border-b-transparent ml-1.5" />
        </div>
      </div>

      {/* Live / coming soon badge */}
      <div className="absolute top-4 left-4 z-30">
        {isLive ? (
          <span className="bg-red-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-full animate-pulse">● LIVE NOW</span>
        ) : (
          <span className="bg-zinc-800 text-zinc-400 text-xs font-bold uppercase px-3 py-1 rounded-full">Watch Preview</span>
        )}
      </div>
    </div>
  );
}
