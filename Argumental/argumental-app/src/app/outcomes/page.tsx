import OutcomesView from "@/components/OutcomesView";

export const metadata = {
  title: "Argumental — Outcomes",
  description:
    "Argumental's inaugural matchup and the historical debates that set the template.",
};

export default function OutcomesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-5 md:py-8 w-full">
      <div className="mb-4 md:mb-5 flex items-baseline gap-3 flex-wrap">
        <h1 className="text-2xl md:text-3xl font-black text-zinc-900 leading-none">
          Outcomes
        </h1>
        <p className="text-zinc-500 text-xs md:text-sm">
          The inaugural matchup · and the debates that set the template.
        </p>
      </div>

      <OutcomesView />
    </div>
  );
}
