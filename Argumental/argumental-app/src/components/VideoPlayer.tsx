"use client";

import { useState } from "react";
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
  onPlay?: () => void;
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
  onPlay,
}: Props) {
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    setPlaying(true);
    onPlay?.();
  };

  if (playing) {
    return (
      <div className="relative bg-black rounded-2xl overflow-hidden aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  return (
    <div
      className="relative bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden aspect-video flex items-center justify-center cursor-pointer group"
      onClick={handlePlay}
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
