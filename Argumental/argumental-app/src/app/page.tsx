import { getAllDebates } from "@/lib/debates";
import FeaturedDebate from "@/components/FeaturedDebate";
import Panel from "@/components/Panel";

export default function HomePage() {
  const debates = getAllDebates();
  const featured = debates[0];

  return (
    <div className="flex flex-col">
      {/* Featured debate — full width, top of page */}
      {featured && (
        <section className="relative border-b border-zinc-200 px-4 md:px-6 pt-6 md:pt-8 pb-8 md:pb-10">
          <FeaturedDebate debate={featured} />
        </section>
      )}

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16 w-full">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-2">
          <div>
            <p className="text-black text-xs uppercase tracking-widest font-semibold mb-2">
              Mechanism
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-zinc-900">
              How It Works
            </h2>
          </div>
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold tabular-nums">
            4 phases · 24 minutes
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { step: "01", title: "Opening A", desc: "Debater A makes their case — uninterrupted." },
            { step: "02", title: "Opening B", desc: "Debater B responds with their position." },
            { step: "03", title: "Rebuttal A", desc: "Debater A fires back at B's arguments." },
            { step: "04", title: "Rebuttal B", desc: "Debater B has the final word." },
          ].map((item, i) => (
            <Panel key={item.step}>
              <div className="p-4 flex flex-col gap-1.5">
                <span
                  className={`font-black text-2xl tabular-nums ${i % 2 === 0 ? "text-brand-red" : "text-brand-blue"}`}
                >
                  {item.step}
                </span>
                <h3 className="text-zinc-900 font-bold text-sm">{item.title}</h3>
                <p className="text-zinc-500 text-xs leading-snug">{item.desc}</p>
              </div>
            </Panel>
          ))}
        </div>
      </section>
    </div>
  );
}
