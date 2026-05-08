import { notFound } from "next/navigation";
import { getDebate } from "@/lib/debates";
import VotePanel from "@/components/debate/VotePanel";
import DebateTimer from "@/components/debate/DebateTimer";
import Panel from "@/components/Panel";
import VideoPlayer from "@/components/VideoPlayer";
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
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-12 w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          {isLive && (
            <span className="bg-brand-red text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full animate-pulse">
              ● LIVE
            </span>
          )}
          {isFinished && (
            <span className="bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Finished
            </span>
          )}
          <span className="text-zinc-900 text-base font-black uppercase tracking-widest">
            {debate.topic}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-zinc-900 leading-tight">
          {debate.title}
        </h1>
        <p className="text-zinc-600 mt-2 max-w-2xl">{debate.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video + Timer */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Debater cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-brand-red/5 border border-brand-red/20 rounded-md p-4">
              <p className="text-brand-red text-[10px] uppercase tracking-widest font-bold mb-1">
                {debate.debaterA.position}
              </p>
              <p className="text-zinc-900 font-bold text-lg">
                {debate.debaterA.name}
              </p>
              {debate.debaterA.charity && (
                <p className="text-zinc-500 text-xs mt-1">
                  Charity: {debate.debaterA.charity}
                </p>
              )}
            </div>
            <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-md p-4">
              <p className="text-brand-blue text-[10px] uppercase tracking-widest font-bold mb-1">
                {debate.debaterB.position}
              </p>
              <p className="text-zinc-900 font-bold text-lg">
                {debate.debaterB.name}
              </p>
              {debate.debaterB.charity && (
                <p className="text-zinc-500 text-xs mt-1">
                  Charity: {debate.debaterB.charity}
                </p>
              )}
            </div>
          </div>

          {/* Timer (live only) */}
          {isLive && debate.currentPhase && (
            <Panel label="Live Clock" variant="dark">
              <div className="p-6 flex justify-center">
                <DebateTimer
                  phase={debate.currentPhase}
                  phaseEndsAt={debate.phaseEndsAt}
                />
              </div>
            </Panel>
          )}

          {/* Video player — Mux when a real stream exists, otherwise the
              same Shapiro/AOC cover-graphic VideoPlayer used on the
              homepage and the /outcomes Current verdict. */}
          {debate.muxPlaybackId ? (
            <div className="rounded-md overflow-hidden bg-black aspect-video">
              <MuxPlayer
                playbackId={debate.muxPlaybackId}
                streamType={isLive ? "live" : "on-demand"}
                autoPlay={isLive}
                muted={false}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          ) : (
            <VideoPlayer
              youtubeId="YQ7IudJBpf0"
              debaterAName={debate.debaterA.name}
              debaterAPhoto="/shapiro.jpg"
              debaterAPosition={debate.debaterA.position}
              debaterBName={debate.debaterB.name}
              debaterBPhoto="/aoc.jpg"
              debaterBPosition={debate.debaterB.position}
              isLive={isLive}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-3">
          {isLive ? (
            <VotePanel debate={debate} />
          ) : isFinished ? (
            <Panel label="Final Result">
              <div className="p-5 text-center">
                <div className="flex justify-around">
                  <div>
                    <p className="text-brand-red font-bold text-2xl tabular-nums">
                      {debate.votesA}
                    </p>
                    <p className="text-zinc-500 text-xs">
                      {debate.debaterA.name}
                    </p>
                  </div>
                  <div className="text-zinc-300 text-2xl font-bold">vs</div>
                  <div>
                    <p className="text-brand-blue font-bold text-2xl tabular-nums">
                      {debate.votesB}
                    </p>
                    <p className="text-zinc-500 text-xs">
                      {debate.debaterB.name}
                    </p>
                  </div>
                </div>
              </div>
            </Panel>
          ) : (
            <Panel label="Upcoming">
              <div className="p-5 text-center">
                <p className="text-zinc-900 font-bold">
                  {new Date(debate.scheduledAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-zinc-500 text-xs mt-3">
                  Voting opens when the debate goes live.
                </p>
              </div>
            </Panel>
          )}

          <Panel label="Rules">
            <ul className="text-zinc-600 text-sm p-5 space-y-2">
              <li>• 1 vote per viewer</li>
              <li>• $5 per vote</li>
              <li>• 18% of proceeds → winner&apos;s chosen charity</li>
              <li>• 24-minute format: 4 phases</li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
