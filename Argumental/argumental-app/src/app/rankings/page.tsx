import RankingsScope from "@/components/RankingsScope";

export const metadata = {
  title: "Argumental — Rankings",
  description:
    "Live rankings of Argumental debaters by knowledge class and region.",
};

export default function RankingsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-14 w-full">
      <div className="mb-6 md:mb-8">
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

      <RankingsScope />
    </div>
  );
}
