import { Debate } from "./types";

// In-memory store for scaffolding — replace with DB (Postgres/Supabase) in production.
// Dates align with lib/upcomingBouts.ts: Sundays at 8 PM EDT (= Mon 00:00 UTC).
const debates: Map<string, Debate> = new Map([
  [
    "israel-001",
    {
      id: "israel-001",
      title: "Does Israel Have the Right to Exist?",
      topic: "Israel & the Middle East",
      description:
        "Two of America's most polarizing political voices go head to head on one of the most contested questions of our time. No moderator. No filter. You decide who wins.",
      scheduledAt: "2026-05-11T00:00:00Z",
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
  [
    "woman-001",
    {
      id: "woman-001",
      title: "A Woman is a Person with 2 X Chromosomes",
      topic: "Sex, Gender & Biology",
      description:
        "Two thinkers at the heart of the most heated cultural debate of the decade clash on whether biology defines womanhood.",
      scheduledAt: "2026-05-18T00:00:00Z",
      status: "upcoming",
      debaterA: {
        id: "debater-walsh",
        name: "Matt Walsh",
        position: "FOR",
      },
      debaterB: {
        id: "debater-butler",
        name: "Judith Butler",
        position: "AGAINST",
      },
      votesA: 0,
      votesB: 0,
    },
  ],
  [
    "defund-001",
    {
      id: "defund-001",
      title: "The US Should Defund the Police",
      topic: "Public Safety & Criminal Justice",
      description:
        "A flash-point of the post-2020 era, debated honestly. Should police funding be reallocated to community services, or expanded?",
      scheduledAt: "2026-05-25T00:00:00Z",
      status: "upcoming",
      debaterA: {
        id: "debater-omar",
        name: "Ilhan Omar",
        position: "FOR",
      },
      debaterB: {
        id: "debater-hegseth",
        name: "Pete Hegseth",
        position: "AGAINST",
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
    (a, b) =>
      new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
  );
}

export function updateDebate(
  id: string,
  patch: Partial<Debate>,
): Debate | undefined {
  const existing = debates.get(id);
  if (!existing) return undefined;
  const updated = { ...existing, ...patch };
  debates.set(id, updated);
  return updated;
}

export function incrementVote(
  debateId: string,
  side: "A" | "B",
): Debate | undefined {
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
