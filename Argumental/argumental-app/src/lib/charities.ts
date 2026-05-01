// Charities surfaced on /charities and selected by debaters as the destination
// for the winner's 10 % cut.
//
// To add a new charity:
//   1. Drop a hero image at /public/charities/{id}.jpg (2:1 ratio works best,
//      e.g. 1200×600). Either pull one from the org's own homepage or use a
//      screenshot service.
//   2. Append a new object to CHARITIES below with a unique `id` matching the
//      filename. That's it — the /charities page reflows automatically.
//
// `mission` should be 2–3 sentences pulled from the org's own About page so the
// framing is faithful. `metric` is optional: a single short stat or year that
// adds credibility (e.g. "Est. 1979", "200+ partner orgs").

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
  /** Hero image path. Convention: /charities/{id}.jpg at 2:1 ratio. */
  heroImage?: string;
}

export const CHARITIES: Charity[] = [
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
];
