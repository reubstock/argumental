import { notFound } from "next/navigation";
import { getDebate } from "@/lib/debates";
import VotePanel from "@/components/debate/VotePanel";
import DebateTimer from "@/components/debate/DebateTimer";
import MuxPlayer from "@mux/mux-player-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DebatePage({ params }: Props) {
  const { id } = await params;
  const debate = getDebate(id);
  if (!debate) notFound();

  const isLive = debate.status === "live";
  const isFinished = debate.status === "finished";

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          {isLive && (
            <span className="bg-red-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-full animate-pulse">
              ● LIVE
            </span>
          )}
          {isFinished && (
            <span className="bg-zinc-800 text-zinc-400 text-xs font-bold uppercase px-3 py-1 rounded-full">
              Finished
            </span>
          )}
          <span className="text-zinc-500 text-sm">{debate.topic}</span>
        </div>
        <h1 className="text-4xl font-black text-white leading-tight">{debate.title}</h1>
        <p className="text-zinc-400 mt-2 max-w-2xl">{debate.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video + Timer */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Debater cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-950/50 border border-blue-800/50 rounded-2xl p-5">
              <p className="text-blue-400 text-xs uppercase tracking-widest font-semibold mb-1">
                {debate.debaterA.position}
              </p>
              <p className="text-white font-bold text-xl">{debate.debaterA.name}</p>
              {debate.debaterA.charity && (
                <p className="text-zinc-500 text-xs mt-1">
                  Charity: {debate.debaterA.charity}
                </p>
              )}
            </div>
            <div className="bg-red-950/50 border border-red-800/50 rounded-2xl p-5">
              <p className="text-red-400 text-xs uppercase tracking-widest font-semibold mb-1">
                {debate.debaterB.position}
              </p>
              <p className="text-white font-bold text-xl">{debate.debaterB.name}</p>
              {debate.debaterB.charity && (
                <p className="text-zinc-500 text-xs mt-1">
                  Charity: {debate.debaterB.charity}
                </p>
              )}
            </div>
          </div>

          {/* Timer (live only) */}
          {isLive && debate.currentPhase && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex justify-center">
              <DebateTimer
                phase={debate.currentPhase}
                phaseEndsAt={debate.phaseEndsAt}
              />
            </div>
          )}

          {/* Video player */}
          {debate.muxPlaybackId ? (
            <div className="rounded-2xl overflow-hidden bg-black aspect-video">
              <MuxPlayer
                playbackId={debate.muxPlaybackId}
                streamType={isLive ? "live" : "on-demand"}
                autoPlay={isLive}
                muted={false}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl aspect-video flex items-center justify-center">
              <div className="text-center">
                <p className="text-zinc-400 font-semibold text-lg">
                  {isLive ? "Stream starting..." : "Stream not yet available"}
                </p>
                {!isLive && (
                  <p className="text-zinc-600 text-sm mt-1">
                    Live video will appear here when the debate begins.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: vote panel */}
        <div className="flex flex-col gap-4">
          {isLive ? (
            <VotePanel debate={debate} />
          ) : isFinished ? (
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 text-center">
              <p className="text-zinc-400 text-sm mb-2">Final result</p>
              <div className="flex justify-around">
                <div>
                  <p className="text-blue-400 font-bold text-2xl">{debate.votesA}</p>
                  <p className="text-zinc-500 text-xs">{debate.debaterA.name}</p>
                </div>
                <div className="text-zinc-700 text-2xl font-bold">vs</div>
                <div>
                  <p className="text-red-400 font-bold text-2xl">{debate.votesB}</p>
                  <p className="text-zinc-500 text-xs">{debate.debaterB.name}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 text-center">
              <p className="text-yellow-400 font-bold">Upcoming</p>
              <p className="text-zinc-400 text-sm mt-1">
                {new Date(debate.scheduledAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-zinc-600 text-xs mt-3">Voting opens when the debate goes live.</p>
            </div>
          )}

          {/* Rules reminder */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
            <h4 className="text-zinc-300 font-semibold mb-3 text-sm">The Rules</h4>
            <ul className="text-zinc-500 text-xs space-y-2">
              <li>• 1 vote per viewer</li>
              <li>• $5 per vote</li>
              <li>• 10% of proceeds → winner&apos;s chosen charity</li>
              <li>• 25-minute format: 4 phases</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
