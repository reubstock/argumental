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
}

/** Seeded entries — survive server restarts and deploys. */
const CHARITY_SEED: Charity[] = [
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

/** Read every charity. Merges in any missing seed entries on each read. */
async function readAll(): Promise<Charity[]> {
  if (redis) {
    try {
      const stored = (await redis.get<Charity[]>(REDIS_KEY)) ?? [];
      const ids = new Set(stored.map((c) => c.id));
      const missingSeeds = CHARITY_SEED.filter((c) => !ids.has(c.id));
      if (missingSeeds.length > 0) {
        const merged = [...stored, ...missingSeeds];
        await redis.set(REDIS_KEY, merged);
        return merged;
      }
      return stored;
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
