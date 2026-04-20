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
  muxPlaybackId?: string;
  muxLiveStreamId?: string;
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
