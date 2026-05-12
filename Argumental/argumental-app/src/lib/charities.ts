// Charities surfaced on /charities and selected by debaters as the destination
// for the winner's 18 % cut.
//
// Storage
//   - Production: Upstash Redis (set UPSTASH_REDIS_REST_URL +
//     UPSTASH_REDIS_REST_TOKEN env vars; Vercel auto-injects these once you
//     attach an Upstash database via the Storage tab on the project).
//   - Development / fallback: in-memory Map. Resets on every server restart,
//     so dev works without configuring Redis. Seed entries are always present.
//
// Two ways to add a charity:
//
//   A. Via the UI — click ADD CHARITY on /charities. Persists in Redis when
//      configured; otherwise lives only on the current server process.
//
//   B. Via code — append an entry to CHARITY_SEED below with a unique `id`.
//      Optionally drop a hero image at /public/charities/{id}.jpg (2:1 ratio,
//      e.g. 1200×600). Seeded entries always survive deploys; if Redis already
//      has a snapshot, seeded entries are merged in only when missing.

import { Redis } from "@upstash/redis";

export interface Charity {
  /** Stable slug used as a React key + hero image filename. Lowercase + dashes. */
  id: string;
  /** Display name. */
  name: string;
  /** Homepage URL — opens in a new tab. */
  url: string;
  /** Short label above the name (e.g., "Middle East · Peace policy"). */
  focus: string;
  /** 2-3 sentence blurb describing the org's mission. */
  mission: string;
  /** Optional impact metric or founding year — small print at the card foot. */
  metric?: string;
  /** Hero image. Convention for code-seeded entries: /charities/{id}.jpg. */
  heroImage?: string;
  /** Name of the debater who selected this charity ("Ben Shapiro", "AOC", etc.). */
  backerName?: string;
  /** Side color for the ribbon. A = red, B = blue. */
  backerSide?: "A" | "B";
  /** The upcoming/finished bout this backing maps to. */
  backerDebateId?: string;
  /** True when this charity is on the winning side of a finished bout. Gets a gold star. */
  winner?: boolean;
}

/** Seeded entries — survive server restarts and deploys.
 *
 * Order is intentional: AllMEP and FMEP (the two with uploaded hero
 * photos) lead the list. After them come the bout-paired backer cards
 * in chronological order, with Shapiro/FIDF carrying the gold-star
 * winner badge from the settled Israel bout.
 */
const CHARITY_SEED: Charity[] = [
  // ─── Neutral / unaffiliated — with photos, lead the page ─────────────
  {
    id: "allmep",
    name: "International Fund for Israeli-Palestinian Peace",
    url: "https://www.allmep.org/international-fund-for-israeli-palestinian-peace/",
    focus: "Israel · Palestine · Civil society",
    mission:
      "An ALLMEP initiative modelled on Northern Ireland's International Fund for Ireland. Resources and scales the field of Israeli-Palestinian peacebuilding NGOs that work across communities to advance dignity, equality, and a shared future.",
    metric: "150+ partner orgs",
    heroImage: "/charities/allmep.jpg",
  },
  {
    id: "fmep",
    name: "Foundation for Middle East Peace",
    url: "https://fmep.org/",
    focus: "Middle East · Peace policy",
    mission:
      "Independent foundation promoting a just resolution to the Israeli-Palestinian conflict through analysis, journalism, and advocacy. Funds reporting, research, and convenings that document the human cost of the occupation and the stakes of a two-state outcome.",
    metric: "Est. 1979",
    heroImage: "/charities/fmep.jpg",
  },

  // ─── Israel bout — Shapiro (FOR · won) vs. AOC (AGAINST) ─────────────
  {
    id: "fidf",
    name: "Friends of the Israel Defense Forces",
    url: "https://www.fidf.org/",
    focus: "Israel · Military welfare",
    mission:
      "U.S.-based nonprofit funding wellbeing, education, and post-service support for Israeli soldiers and their families. Programs range from financial aid for lone soldiers to mental health services and veteran transition support.",
    metric: "Est. 1981",
    backerName: "Ben Shapiro",
    backerSide: "A",
    backerDebateId: "israel-001",
    winner: true,
  },
  {
    id: "unrwa-usa",
    name: "UNRWA USA",
    url: "https://www.unrwausa.org/",
    focus: "Palestine · Humanitarian aid",
    mission:
      "American partner to the UN Relief and Works Agency providing food, education, primary healthcare, and emergency relief to Palestinian refugees across Gaza, the West Bank, Jordan, Lebanon, and Syria.",
    metric: "Serves 5.9M refugees",
    backerName: "AOC",
    backerSide: "B",
    backerDebateId: "israel-001",
  },

  // ─── UBI bout — Ramaswamy (AGAINST) vs. Yang (FOR) ───────────────────
  {
    id: "job-creators-network",
    name: "Job Creators Network Foundation",
    url: "https://www.jobcreatorsnetwork.com/",
    focus: "Small business · Workforce",
    mission:
      "Advocacy + education nonprofit pushing back on policies that suppress small-business hiring. Programs train owners on tax / regulatory navigation and rally Main Street voices into national policy debates.",
    metric: "Est. 2010",
    backerName: "Vivek Ramaswamy",
    backerSide: "A",
    backerDebateId: "ubi-001",
  },
  {
    id: "humanity-forward",
    name: "Humanity Forward",
    url: "https://movehumanityforward.com/",
    focus: "UBI · Direct cash transfers",
    mission:
      "Andrew Yang's policy nonprofit advancing universal basic income, direct cash relief, and data-driven government. Funded the largest U.S. private cash-transfer pilot to date during the early pandemic and continues to lobby for permanent income guarantees.",
    metric: "Founded 2020",
    backerName: "Andrew Yang",
    backerSide: "B",
    backerDebateId: "ubi-001",
  },

  // ─── Women / X chromosomes bout — Walsh (FOR) vs. Butler (AGAINST) ──
  {
    id: "alliance-defending-freedom",
    name: "Alliance Defending Freedom",
    url: "https://adflegal.org/",
    focus: "Religious liberty · Family",
    mission:
      "Conservative legal nonprofit litigating cases on religious freedom, parental rights, sex-based protections in sports and shelters, and free expression for traditional viewpoints. Represented multiple plaintiffs at the Supreme Court.",
    metric: "Est. 1994",
    backerName: "Matt Walsh",
    backerSide: "A",
    backerDebateId: "woman-001",
  },
  {
    id: "trans-lifeline",
    name: "Trans Lifeline",
    url: "https://translifeline.org/",
    focus: "Trans health · Crisis support",
    mission:
      "Peer-support hotline and microgrants program run by and for trans people. Provides judgment-free crisis calls 24/7 and emergency cash assistance to cover documents, medical care, and safety needs.",
    metric: "100K+ calls answered",
    backerName: "Judith Butler",
    backerSide: "B",
    backerDebateId: "woman-001",
  },

  // ─── Defund the Police bout — Omar (FOR) vs. Hegseth (AGAINST) ───────
  {
    id: "equal-justice-initiative",
    name: "Equal Justice Initiative",
    url: "https://eji.org/",
    focus: "Mass incarceration · Reform",
    mission:
      "Montgomery-based legal nonprofit founded by Bryan Stevenson. Defends the wrongfully convicted, challenges excessive sentencing, and documents the racial history of American criminal justice through the Legacy Sites and reports on lynching, segregation, and the death penalty.",
    metric: "Est. 1989",
    backerName: "Ilhan Omar",
    backerSide: "A",
    backerDebateId: "defund-001",
  },
  {
    id: "cops-survivors",
    name: "Concerns of Police Survivors (C.O.P.S.)",
    url: "https://concernsofpolicesurvivors.org/",
    focus: "Police families · Survivor support",
    mission:
      "Provides resources, counseling, and peer programs to families and coworkers of law-enforcement officers killed in the line of duty. Runs camps for surviving children, retreats for spouses and parents, and trauma-response training nationwide.",
    metric: "Est. 1984",
    backerName: "Pete Hegseth",
    backerSide: "B",
    backerDebateId: "defund-001",
  },

];

const REDIS_KEY = "argumental:charities";

// Lazily construct a Redis client only when both env vars are set. If anything
// is missing or the constructor throws, we fall back to the in-memory store.
const redis: Redis | null = (() => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    return new Redis({ url, token });
  } catch (err) {
    console.error("[charities] Failed to construct Redis client:", err);
    return null;
  }
})();

// In-memory fallback for dev / local. Always seeded.
const memStore = new Map<string, Charity>(
  CHARITY_SEED.map((c) => [c.id, c]),
);

/** Read every charity. Seed order is canonical:
 *
 *   1. Every seed entry, in seed-array order. Prefers the stored copy
 *      when present (so UI-edited fields survive), falling back to the
 *      seed default otherwise.
 *   2. Any non-seed entries (UI-added charities) appended at the end.
 *
 * Re-persists to Redis if the ordering changed.  This makes a seed-order
 * change in code propagate to live data on next request without manual
 * Redis surgery.
 */
async function readAll(): Promise<Charity[]> {
  if (redis) {
    try {
      const stored = (await redis.get<Charity[]>(REDIS_KEY)) ?? [];
      const storedById = new Map(stored.map((c) => [c.id, c]));
      const seedIds = new Set(CHARITY_SEED.map((s) => s.id));

      const seeded = CHARITY_SEED.map((s) => storedById.get(s.id) ?? s);
      const extras = stored.filter((c) => !seedIds.has(c.id));
      const merged = [...seeded, ...extras];

      const changed =
        merged.length !== stored.length ||
        merged.some((c, i) => stored[i]?.id !== c.id);
      if (changed) {
        await redis.set(REDIS_KEY, merged);
      }
      return merged;
    } catch (err) {
      console.error("[charities] Redis read failed, using memory:", err);
    }
  }
  return Array.from(memStore.values());
}

async function writeAll(charities: Charity[]): Promise<void> {
  if (redis) {
    try {
      await redis.set(REDIS_KEY, charities);
      return;
    } catch (err) {
      console.error("[charities] Redis write failed, using memory:", err);
    }
  }
  memStore.clear();
  for (const c of charities) memStore.set(c.id, c);
}

export async function getAllCharities(): Promise<Charity[]> {
  return readAll();
}

export async function getCharity(id: string): Promise<Charity | undefined> {
  const all = await readAll();
  return all.find((c) => c.id === id);
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * Add a charity. If `id` is omitted, derive from `name` and de-duplicate
 * against existing ids by suffixing -2, -3, etc.
 *
 * NOTE: read-then-write is not atomic across requests. For our cadence
 * (rare additions) this is fine; if charity adds become high-traffic, switch
 * the Redis layout to a hash and use HSET-NX.
 */
export async function addCharity(
  input: Omit<Charity, "id"> & { id?: string },
): Promise<Charity> {
  const all = await readAll();

  let id = input.id?.trim() || slugify(input.name);
  if (!id) id = `charity-${all.length + 1}`;

  const ids = new Set(all.map((c) => c.id));
  if (ids.has(id)) {
    let n = 2;
    while (ids.has(`${id}-${n}`)) n++;
    id = `${id}-${n}`;
  }

  const charity: Charity = {
    id,
    name: input.name.trim(),
    url: input.url.trim(),
    focus: input.focus.trim(),
    mission: input.mission.trim(),
    metric: input.metric?.trim() || undefined,
    heroImage: input.heroImage?.trim() || undefined,
  };

  await writeAll([...all, charity]);
  return charity;
}

/** True when persistent storage is wired up. Useful for admin diagnostics. */
export function hasPersistentStorage(): boolean {
  return redis !== null;
}
