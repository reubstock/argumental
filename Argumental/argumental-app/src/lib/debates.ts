import { Debate } from "./types";

// In-memory store for scaffolding — replace with DB (Postgres/Supabase) in production
const debates: Map<string, Debate> = new Map([
  [
    "pilot-001",
    {
      id: "pilot-001",
      title: "Should AI be regulated?",
      topic: "Artificial Intelligence Regulation",
      description:
        "Two leading minds clash on whether governments should impose strict controls on AI development — or let innovation run free.",
      scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: "upcoming",
      debaterA: {
        id: "debater-a",
        name: "Alex Chen",
        position: "FOR regulation",
        charity: "Electronic Frontier Foundation",
      },
      debaterB: {
        id: "debater-b",
        name: "Jordan Walsh",
        position: "AGAINST regulation",
        charity: "Khan Academy",
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
