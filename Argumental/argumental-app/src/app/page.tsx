import Link from "next/link";
import { getAllDebates } from "@/lib/debates";

export default function HomePage() {
  const debates = getAllDebates();
  const live = debates.find((d) => d.status === "live");
  const upcoming = debates.filter((d) => d.status === "upcoming");

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-32 overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/5 to-transparent pointer-events-none" />
        <p className="text-yellow-400 uppercase tracking-widest text-sm font-semibold mb-4">
          The UFC of Ideas
        </p>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none mb-6">
          ARGUE.<br />VOTE.<br />WIN.
        </h1>
        <p className="max-w-xl text-zinc-400 text-lg leading-relaxed mb-10">
          Weekly live debates on the most explosive topics of the day. Two sides.
          One winner. You decide — $5 a vote, 10% to charity.
        </p>
        <div className="flex gap-4">
          {live ? (
            <Link
              href={`/debates/${live.id}`}
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition animate-pulse"
            >
              Watch Live Now
            </Link>
          ) : (
            <Link
              href="/debates"
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-4 rounded-xl text-lg transition"
            >
              See Upcoming Debates
            </Link>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-20 w-full">
        <h2 className="text-3xl font-black text-white mb-10 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Opening A", desc: "Debater A makes their case — uninterrupted." },
            { step: "02", title: "Opening B", desc: "Debater B responds with their position." },
            { step: "03", title: "Rebuttal A", desc: "Debater A fires back at B's arguments." },
            { step: "04", title: "Rebuttal B", desc: "Debater B has the final word." },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-2"
            >
              <span className="text-yellow-400 font-black text-3xl">{item.step}</span>
              <h3 className="text-white font-bold text-lg">{item.title}</h3>
              <p className="text-zinc-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-zinc-500 mt-6 text-sm">
          Each phase is timed. Total bout: 25 minutes.
        </p>
      </section>

      {/* Upcoming debates */}
      {upcoming.length > 0 && (
        <section className="border-t border-zinc-800 max-w-4xl mx-auto px-6 py-20 w-full">
          <h2 className="text-3xl font-black text-white mb-8">Next Bout</h2>
          <div className="flex flex-col gap-4">
            {upcoming.slice(0, 3).map((debate) => (
              <Link
                key={debate.id}
                href={`/debates/${debate.id}`}
                className="group bg-zinc-900 border border-zinc-800 hover:border-yellow-400/50 rounded-2xl p-6 flex items-center justify-between transition"
              >
                <div>
                  <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">
                    {new Date(debate.scheduledAt).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <h3 className="text-white font-bold text-xl">{debate.title}</h3>
                  <p className="text-zinc-400 text-sm mt-1">
                    {debate.debaterA.name} vs {debate.debaterB.name}
                  </p>
                </div>
                <span className="text-zinc-600 group-hover:text-yellow-400 text-2xl transition">→</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
