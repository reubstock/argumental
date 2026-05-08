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

/**
 * VideoPlayer — runtime-composed pre-roll cover from each bout's debater
 * photos, then a YouTube embed on tap.
 *
 * The cover splits the frame in two: left half = debater A photo with a
 * brand-red wash, right half = debater B with a brand-blue wash. Names +
 * positions overlay the bottom of each half. A central black VS marker
 * sits behind the play button. This way every bout's video reflects its
 * actual participants rather than reusing a single static cover.
 */
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
      {/* Composed two-half cover */}
      <div className="absolute inset-0 flex">
        <DebaterHalf
          side="A"
          name={debaterAName}
          photo={debaterAPhoto}
          position={debaterAPosition}
        />
        <DebaterHalf
          side="B"
          name={debaterBName}
          photo={debaterBPhoto}
          position={debaterBPosition}
        />
      </div>

      {/* Center VS marker — sits behind the play button */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none z-10">
        <span className="bg-black border-2 border-white/80 text-white font-black text-base md:text-xl px-3 py-1 rounded-md tracking-widest">
          VS
        </span>
      </div>

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="w-20 h-20 rounded-full bg-black/70 border-2 border-white/40 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:bg-black/90 transition-all duration-200">
          <div className="w-0 h-0 border-t-[14px] border-t-transparent border-l-[24px] border-l-white border-b-[14px] border-b-transparent ml-1.5" />
        </div>
      </div>

      {/* Live / coming soon badge */}
      <div className="absolute top-4 left-4 z-30">
        {isLive ? (
          <span className="bg-brand-red text-white text-xs font-bold uppercase px-3 py-1 rounded-full animate-pulse">
            ● Live Now
          </span>
        ) : (
          <span className="bg-black/70 text-white text-xs font-bold uppercase px-3 py-1 rounded-full backdrop-blur-sm">
            Watch Preview
          </span>
        )}
      </div>
    </div>
  );
}

function DebaterHalf({
  side,
  name,
  photo,
  position,
}: {
  side: "A" | "B";
  name: string;
  photo: string;
  position: string;
}) {
  // Brand wash + name color per side. Gradients fade toward the center
  // so the VS marker reads cleanly.
  const wash =
    side === "A"
      ? "bg-gradient-to-r from-brand-red/55 via-brand-red/25 to-zinc-950/70"
      : "bg-gradient-to-l from-brand-blue/55 via-brand-blue/25 to-zinc-950/70";
  const positionColor =
    side === "A" ? "text-brand-red" : "text-brand-blue";

  return (
    <div className="relative w-1/2 overflow-hidden">
      <Image
        src={photo}
        alt=""
        aria-hidden="true"
        fill
        sizes="(max-width: 768px) 50vw, 33vw"
        className="object-cover object-top"
      />
      <div className={`absolute inset-0 ${wash}`} />
      {/* Bottom name strip */}
      <div
        className={`absolute bottom-3 ${side === "A" ? "left-3 right-1/3" : "right-3 left-1/3"} text-white`}
      >
        <p
          className={`${positionColor} text-[9px] md:text-[10px] uppercase tracking-widest font-black ${side === "B" ? "text-right" : ""}`}
        >
          {position}
        </p>
        <p
          className={`font-black text-sm md:text-base leading-tight drop-shadow ${side === "B" ? "text-right" : ""}`}
        >
          {name}
        </p>
      </div>
    </div>
  );
}
