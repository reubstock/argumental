// Charities surfaced on /charities and selected by debaters as the destination
// for the winner's 10 % cut.
//
// To add a new charity:
//   1. Append a new object to CHARITIES below with a unique `id`.
//   2. That's it — the /charities page reflows automatically.
//
// `mission` should be 2–3 sentences pulled from the org's own About page so the
// framing is faithful. `metric` is optional: a single short stat or year that
// adds credibility (e.g. "Est. 1979", "200+ partner orgs", "$12M raised in 2025").

export interface Charity {
  /** Stable slug used as a React key. Lowercase + dashes. */
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
  },
  {
    id: "allmep-fund",
    name: "International Fund for Israeli-Palestinian Peace",
    url: "https://www.allmep.org/international-fund-for-israeli-palestinian-peace/",
    focus: "Israel · Palestine · Civil society",
    mission:
      "An ALLMEP initiative modelled on Northern Ireland's International Fund for Ireland. Resources and scales the field of Israeli-Palestinian peacebuilding NGOs that work across communities to advance dignity, equality, and a shared future.",
    metric: "150+ partner orgs",
  },
];
