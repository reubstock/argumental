import RankingsScope from "@/components/RankingsScope";

export const metadata = {
  title: "Argumental — Rankings",
  description:
    "Live rankings of Argumental debaters by knowledge class and region.",
};

export default function RankingsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-5 md:py-8 w-full">
      <div className="mb-4 md:mb-5 flex items-baseline gap-3 flex-wrap">
        <p className="text-black text-[10px] md:text-xs uppercase tracking-widest font-semibold">
          The Board
        </p>
        <h1 className="text-2xl md:text-3xl font-black text-zinc-900 leading-none">
          Rankings
        </h1>
        <p className="text-zinc-500 text-xs md:text-sm">
          Live standings · refreshed weekly.
        </p>
      </div>

      <RankingsScope />
    </div>
  );
}
