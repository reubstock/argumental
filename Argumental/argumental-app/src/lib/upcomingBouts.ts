// Upcoming bout schedule — Sundays at 8 PM ET starting early May 2026.
// Slots without `topic` / `debaterA` / `debaterB` render as "TBD" on the listing.
//
// To fill a slot:
//   1. Set topic (one-line debate question)
//   2. Set debaterA (FOR) and debaterB (AGAINST) with name + position
//   3. Optionally set debateId once a /debates/{id} entry exists in lib/debates.ts
//   4. Optionally set oddsB (0-100): pre-bout consensus likelihood that side B wins.
//      The OddsDial on the row needle-points based on this value.

export interface BoutDebater {
  name: string;
  position: string; // "FOR" | "AGAINST" | etc.
}

export interface UpcomingBout {
  // ISO date string in UTC. Sundays at 8 PM ET = 00:00 UTC the next day (during EDT).
  // Standard time (EST) would be 01:00 UTC the next day.
  scheduledAt: string;
  topic?: string;
  description?: string;
  debaterA?: BoutDebater;
  debaterB?: BoutDebater;
  debateId?: string;
  /** 0–100, pre-bout odds that side B (AGAINST) wins. 50 = even. */
  oddsB?: number;
}

// Sunday 8 PM EDT (UTC-4 from second Sunday of March through first Sunday of November)
// = 00:00 UTC the following day (Monday).
function sundayAt8pmEdt(year: number, month: number, day: number): string {
  const next = new Date(Date.UTC(year, month - 1, day + 1, 0, 0, 0));
  return next.toISOString();
}

export const UPCOMING_BOUTS: UpcomingBout[] = [
  {
    scheduledAt: sundayAt8pmEdt(2026, 5, 3),
  },
  {
    scheduledAt: sundayAt8pmEdt(2026, 5, 10),
    topic: "Does Israel Have the Right to Exist?",
    description:
      "Two of America's most polarizing political voices go head to head on one of the most contested questions of our time.",
    debaterA: { name: "Ben Shapiro", position: "FOR" },
    debaterB: { name: "Alexandria Ocasio-Cortez", position: "AGAINST" },
    debateId: "israel-001",
    // 60% favor the conservative (Shapiro / FOR / side A) → oddsB = 40.
    oddsB: 40,
  },
  {
    scheduledAt: sundayAt8pmEdt(2026, 5, 17),
    topic: "A Woman is a Person with 2 X Chromosomes",
    debaterA: { name: "Matt Walsh", position: "FOR" },
    debaterB: { name: "Judith Butler", position: "AGAINST" },
    debateId: "woman-001",
    oddsB: 65,
  },
  {
    scheduledAt: sundayAt8pmEdt(2026, 5, 24),
    topic: "The US Should Defund the Police",
    debaterA: { name: "Ilhan Omar", position: "FOR" },
    debaterB: { name: "Pete Hegseth", position: "AGAINST" },
    debateId: "defund-001",
    oddsB: 76,
  },
  { scheduledAt: sundayAt8pmEdt(2026, 5, 31) },
  { scheduledAt: sundayAt8pmEdt(2026, 6, 7) },
  { scheduledAt: sundayAt8pmEdt(2026, 6, 14) },
  { scheduledAt: sundayAt8pmEdt(2026, 6, 21) },
  { scheduledAt: sundayAt8pmEdt(2026, 6, 28) },
  { scheduledAt: sundayAt8pmEdt(2026, 7, 5) },
  { scheduledAt: sundayAt8pmEdt(2026, 7, 12) },
  { scheduledAt: sundayAt8pmEdt(2026, 7, 19) },
];

export function getUpcomingBouts(): UpcomingBout[] {
  const now = Date.now();
  return UPCOMING_BOUTS.filter(
    (b) => new Date(b.scheduledAt).getTime() > now,
  );
}
