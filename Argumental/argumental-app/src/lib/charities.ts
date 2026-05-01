// Charities surfaced on /charities and selected by debaters as the destination
// for the winner's 18 % cut.
//
// Two ways to add a charity:
//
//   A. Via the UI — click "ADD CHARITY" on /charities and fill in the form.
//      This calls POST /api/charities and adds to the in-memory store. The
//      entry persists until the server restarts (in-memory only — replace
//      with Postgres/Supabase for durable storage; see /admin checklist).
//
//   B. Via code — append an entry to CHARITY_SEED below with a unique `id`.
//      Optionally drop a hero image at /public/charities/{id}.jpg (2:1 ratio,
//      e.g. 1200×600). Seeded entries persist across deploys.
//
// `mission` should be 2–3 sentences pulled from the org's About page so the
// framing is faithful. `metric` is optional: a single short stat or year that
// adds credibility.

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

/** Seeded entries — survive server restarts; UI-added entries do not. */
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

// In-memory store. Initialized from seed; mutated by addCharity().
const charities = new Map<string, Charity>(
  CHARITY_SEED.map((c) => [c.id, c]),
);

export function getAllCharities(): Charity[] {
  return Array.from(charities.values());
}

export function getCharity(id: string): Charity | undefined {
  return charities.get(id);
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
 */
export function addCharity(input: Omit<Charity, "id"> & { id?: string }): Charity {
  let id = input.id?.trim() || slugify(input.name);
  if (!id) id = `charity-${charities.size + 1}`;

  // de-dupe against existing ids
  if (charities.has(id)) {
    let n = 2;
    while (charities.has(`${id}-${n}`)) n++;
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

  charities.set(id, charity);
  return charity;
}
