import OutcomesView from "@/components/OutcomesView";

export const metadata = {
  title: "Argumental — Outcomes",
  description:
    "How Argumental bouts have resolved — current verdicts and the historical debates that set the template.",
};

export default function OutcomesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-5 md:py-8 w-full">
      <div className="mb-4 md:mb-5 flex items-baseline gap-3 flex-wrap">
        <p className="text-black text-[10px] md:text-xs uppercase tracking-widest font-semibold">
          Verdicts
        </p>
        <h1 className="text-2xl md:text-3xl font-black text-zinc-900 leading-none">
          Outcomes
        </h1>
        <p className="text-zinc-500 text-xs md:text-sm">
          How bouts resolved · what they settled.
        </p>
      </div>

      <OutcomesView />
    </div>
  );
}
