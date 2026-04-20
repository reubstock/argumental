import { Debate } from "./types";

// In-memory store for scaffolding — replace with DB (Postgres/Supabase) in production
const debates: Map<string, Debate> = new Map([
  [
    "israel-001",
    {
      id: "israel-001",
      title: "Does Israel Have the Right to Exist?",
      topic: "Israel & the Middle East",
      description:
        "Two of America's most polarizing political voices go head to head on one of the most contested questions of our time. No moderator. No filter. You decide who wins.",
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "upcoming",
      debaterA: {
        id: "debater-shapiro",
        name: "Ben Shapiro",
        position: "FOR",
        charity: "Friends of the Israel Defense Forces",
      },
      debaterB: {
        id: "debater-aoc",
        name: "Alexandria Ocasio-Cortez",
        position: "AGAINST",
        charity: "UNRWA USA",
      },
      votesA: 0,
      votesB: 0,
    },
  ],
]);

export function getDebate(id: string): Debate | undefined {
  return debates.get(id);
}

export function getAllDebates(): Debate[] {
  return Array.from(debates.values()).sort(
    (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
  );
}

export function updateDebate(id: string, patch: Partial<Debate>): Debate | undefined {
  const existing = debates.get(id);
  if (!existing) return undefined;
  const updated = { ...existing, ...patch };
  debates.set(id, updated);
  return updated;
}

export function incrementVote(debateId: string, side: "A" | "B"): Debate | undefined {
  const debate = debates.get(debateId);
  if (!debate) return undefined;
  const updated = {
    ...debate,
    votesA: side === "A" ? debate.votesA + 1 : debate.votesA,
    votesB: side === "B" ? debate.votesB + 1 : debate.votesB,
  };
  debates.set(debateId, updated);
  return updated;
}
