import Panel from "@/components/Panel";

export const metadata = {
  title: "Argumental — Rankings",
  description:
    "Live rankings of Argumental debaters by knowledge class and region.",
};

export default function RankingsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-14 w-full">
      <div className="mb-8 md:mb-10">
        <p className="text-black text-xs uppercase tracking-widest font-semibold mb-2">
          The Board
        </p>
        <h1 className="text-3xl md:text-4xl font-black text-zinc-900">
          Rankings
        </h1>
        <p className="text-zinc-500 text-sm mt-2 max-w-2xl">
          Live standings of Argumental debaters — ranked by knowledge class
          and region. Title fights move the line each week.
        </p>
      </div>

      <Panel>
        <div className="p-10 md:p-16 text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#a1a1aa"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="20" x2="20" y2="20" />
              <rect x="6" y="12" width="3" height="8" />
              <rect x="11" y="6" width="3" height="14" />
              <rect x="16" y="9" width="3" height="11" />
            </svg>
          </div>
          <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
            Coming soon
          </span>
          <p className="text-zinc-500 text-sm max-w-md">
            Once the first bouts run, rankings populate here automatically —
            top 25 per knowledge class, plus regional leaders. Champions hold
            the title until they&apos;re beaten on the board.
          </p>
        </div>
      </Panel>
    </div>
  );
}
