export type DebatePhase = "intro_a" | "intro_b" | "rebuttal_a" | "rebuttal_b" | "finished";

export interface Debater {
  id: string;
  name: string;
  position: string; // e.g. "FOR" | "AGAINST"
  photoUrl?: string;
  charity?: string;
}

export interface Debate {
  id: string;
  title: string;
  topic: string;
  description: string;
  scheduledAt: string; // ISO date string
  status: "upcoming" | "live" | "finished";
  debaterA: Debater;
  debaterB: Debater;
  // Mux — legacy single-stream mode (one feed for the whole bout)
  muxPlaybackId?: string;
  muxLiveStreamId?: string;
  // Mux — dual-stream mode: each debater has their own live stream and
  // the viewer-side <PhasedDebatePlayer> swaps source on the 6-min clock.
  muxPlaybackIdA?: string;
  muxLiveStreamIdA?: string;
  muxPlaybackIdB?: string;
  muxLiveStreamIdB?: string;
  /**
   * Set by the mux webhook when the first of the two streams goes
   * active. Anchors the 24-minute phase clock — every viewer computes
   * `currentPhase` from `(now - liveStartedAt) / 6min`.
   */
  liveStartedAt?: string; // ISO date string
  currentPhase?: DebatePhase;
  phaseEndsAt?: string; // ISO date string
  votesA: number;
  votesB: number;
  winnerCharityUrl?: string;
}

export interface VotePayload {
  debateId: string;
  votedFor: "A" | "B";
  amount: number; // always 500 cents ($5)
}

export interface LiveVoteUpdate {
  votesA: number;
  votesB: number;
  total: number;
}
