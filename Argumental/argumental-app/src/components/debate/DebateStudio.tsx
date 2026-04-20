"use client";

import { useEffect, useState } from "react";
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react";
import { Debate } from "@/lib/types";

interface Props {
  debate: Debate;
  participantName: string;
  isDebater: boolean;
}

export default function DebateStudio({ debate, participantName, isDebater }: Props) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/livekit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        debateId: debate.id,
        participantName,
        isDebater,
      }),
    })
      .then((r) => r.json())
      .then((d) => setToken(d.token));
  }, [debate.id, participantName, isDebater]);

  if (!token) {
    return (
      <div className="flex items-center justify-center h-64 bg-zinc-900 rounded-2xl">
        <p className="text-zinc-400 animate-pulse">Connecting to debate room...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL!}
      connect={true}
      video={isDebater}
      audio={isDebater}
      className="rounded-2xl overflow-hidden"
    >
      <VideoConference />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}
