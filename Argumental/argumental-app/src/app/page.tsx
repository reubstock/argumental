import { getAllDebates } from "@/lib/debates";
import FeaturedDebate from "@/components/FeaturedDebate";

export default function HomePage() {
  const debates = getAllDebates();
  const featured = debates[0];

  return (
    <div className="flex flex-col">
      {/* Featured debate — full width, top of page */}
      {featured && (
        <section className="relative border-b border-zinc-200 px-6 pt-8 pb-10">
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/5 to-transparent pointer-events-none" />
          <FeaturedDebate debate={featured} />
        </section>
      )}

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-20 w-full">
        <h2 className="text-3xl font-black text-zinc-900 mb-10 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Opening A", desc: "Debater A makes their case — uninterrupted." },
            { step: "02", title: "Opening B", desc: "Debater B responds with their position." },
            { step: "03", title: "Rebuttal A", desc: "Debater A fires back at B's arguments." },
            { step: "04", title: "Rebuttal B", desc: "Debater B has the final word." },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-zinc-100 border border-zinc-200 rounded-2xl p-6 flex flex-col gap-2"
            >
              <span className="text-yellow-400 font-black text-3xl">{item.step}</span>
              <h3 className="text-zinc-900 font-bold text-lg">{item.title}</h3>
              <p className="text-zinc-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-zinc-500 mt-6 text-sm">
          Each phase is timed. Total bout: 25 minutes.
        </p>
      </section>
    </div>
  );
}
