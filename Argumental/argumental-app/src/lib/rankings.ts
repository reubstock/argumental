// Live rankings data for /rankings.
//
// Champion sits at rank 0 (the belt holder); the rest are ordered #1–#10.
// Subjects are short tags joined with " · " on render. `photo` is a path
// under /public/debaters/{slug}.jpg or null (initials fallback in the UI).

export interface Ranked {
  rank: number; // 0 = champion, 1+ = challengers
  name: string;
  subjects: string[];
  photo: string | null;
}

export const GLOBAL_RANKINGS: Ranked[] = [
  {
    rank: 0,
    name: "Coleman Hughes",
    subjects: ["Race", "Public Policy", "Culture"],
    photo: "/debaters/hughes.jpg",
  },
  {
    rank: 1,
    name: "Sam Harris",
    subjects: ["Faith", "Science", "Ethics"],
    photo: "/debaters/harris.jpg",
  },
  {
    rank: 2,
    name: "Bari Weiss",
    subjects: ["Culture", "Free Speech", "Media"],
    photo: null,
  },
  {
    rank: 3,
    name: "Norman Finkelstein",
    subjects: ["Israel · Palestine", "Foreign Policy"],
    photo: "/debaters/finkelstein.jpg",
  },
  {
    rank: 4,
    name: "Ben Shapiro",
    subjects: ["Faith", "Politics", "Culture"],
    photo: "/shapiro.jpg",
  },
  {
    rank: 5,
    name: "Douglas Murray",
    subjects: ["Culture", "Foreign Policy", "Religion"],
    photo: "/debaters/murray.jpg",
  },
  {
    rank: 6,
    name: "Alexandria Ocasio-Cortez",
    subjects: ["Economics", "Climate", "Immigration"],
    photo: "/aoc.jpg",
  },
  {
    rank: 7,
    name: "Stephen A. Smith",
    subjects: ["Sports", "Culture", "Politics"],
    photo: "/debaters/smith.jpg",
  },
  {
    rank: 8,
    name: "Mehdi Hasan",
    subjects: ["Foreign Policy", "Religion", "Politics"],
    photo: "/debaters/hasan.jpg",
  },
  {
    rank: 9,
    name: "Jordan Peterson",
    subjects: ["Psychology", "Faith", "Culture"],
    photo: "/debaters/peterson.jpg",
  },
  {
    rank: 10,
    name: "Andrew Sullivan",
    subjects: ["Politics", "Faith", "Culture"],
    photo: "/debaters/sullivan.jpg",
  },
];

export function getChampion(): Ranked | undefined {
  return GLOBAL_RANKINGS.find((r) => r.rank === 0);
}

export function getChallengers(): Ranked[] {
  return GLOBAL_RANKINGS.filter((r) => r.rank > 0).sort(
    (a, b) => a.rank - b.rank,
  );
}
