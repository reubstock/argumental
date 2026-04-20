import Link from "next/link";
import Image from "next/image";
import { getAllDebates } from "@/lib/debates";
import Countdown from "@/components/Countdown";

export default function HomePage() {
  const debates = getAllDebates();
  const featured = debates[0];

  return (
    <div className="flex flex-col">
      {/* Featured debate — full width, top of page */}
      {featured && (
        <section className="relative border-b border-zinc-800 px-6 pt-8 pb-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/5 to-transparent pointer-events-none" />
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 items-stretch">

            {/* Info card — left */}
            <div className="lg:w-72 flex flex-col gap-4 shrink-0">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4 h-full">
                <div>
                  <p className="text-yellow-400 text-xs uppercase tracking-widest font-semibold mb-2">
                    Featured Bout
                  </p>
                  <h2 className="text-white font-black text-xl leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                    {featured.description}
                  </p>
                </div>

                <div className="border-t border-zinc-800 pt-4 flex flex-col gap-2 text-sm">
                  <div className="flex justify-between text-zinc-500">
                    <span>Format</span>
                    <span className="text-zinc-300">4 phases · 25 min</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Vote cost</span>
                    <span className="text-zinc-300">$5 per vote</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Charity cut</span>
                    <span className="text-zinc-300">10% to winner&apos;s pick</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Date</span>
                    <span className="text-zinc-300">
                      {new Date(featured.scheduledAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/debates/${featured.id}`}
                  className="mt-auto bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-xl text-center transition"
                >
                  {featured.status === "live" ? "Watch & Vote Now" : "View Debate"}
                </Link>
              </div>
            </div>

            {/* Video + vote buttons — right */}
            <div className="flex-1 min-w-0 flex flex-col gap-4">
              {/* Video window */}
              <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black" />

                {/* VS graphic */}
                <div className="relative z-10 flex items-center gap-6 md:gap-12 w-full px-8 md:px-16">
                  {/* Debater A */}
                  <div className="flex-1 flex flex-col items-center gap-3">
                    <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-red-500/60 shadow-lg shadow-red-900/40">
                      <Image
                        src="/shapiro.jpg"
                        alt={featured.debaterA.name}
                        width={144}
                        height={144}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-black text-sm md:text-lg leading-tight">
                        {featured.debaterA.name}
                      </p>
                      <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mt-0.5">
                        {featured.debaterA.position}
                      </p>
                    </div>
                  </div>

                  {/* VS */}
                  <div className="shrink-0">
                    <span className="text-yellow-400 font-black text-3xl md:text-5xl leading-none">VS</span>
                  </div>

                  {/* Debater B */}
                  <div className="flex-1 flex flex-col items-center gap-3">
                    <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-blue-500/60 shadow-lg shadow-blue-900/40">
                      <Image
                        src="/aoc.jpg"
                        alt={featured.debaterB.name}
                        width={144}
                        height={144}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-black text-sm md:text-lg leading-tight">
                        {featured.debaterB.name}
                      </p>
                      <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mt-0.5">
                        {featured.debaterB.position}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Countdown overlay */}
                <Countdown />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                  <div className="w-20 h-20 rounded-full bg-black/50 border-2 border-white/30 flex items-center justify-center backdrop-blur-sm">
                    <div className="w-0 h-0 border-t-[14px] border-t-transparent border-l-[24px] border-l-white border-b-[14px] border-b-transparent ml-1.5" />
                  </div>
                </div>

                {/* Live / coming soon badge */}
                <div className="absolute top-4 left-4">
                  {featured.status === "live" ? (
                    <span className="bg-red-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-full animate-pulse">
                      ● LIVE NOW
                    </span>
                  ) : (
                    <span className="bg-zinc-800 text-zinc-400 text-xs font-bold uppercase px-3 py-1 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>

              {/* Vote buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href={`/debates/${featured.id}?vote=A`}
                  className="flex flex-col items-center gap-1 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-black py-4 rounded-2xl text-center transition-all"
                >
                  <span className="text-xs uppercase tracking-widest opacity-75">{featured.debaterA.name}</span>
                  <span className="text-2xl tracking-tight">VOTE</span>
                </Link>
                <Link
                  href={`/debates/${featured.id}?vote=B`}
                  className="flex flex-col items-center gap-1 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-black py-4 rounded-2xl text-center transition-all"
                >
                  <span className="text-xs uppercase tracking-widest opacity-75">{featured.debaterB.name}</span>
                  <span className="text-2xl tracking-tight">VOTE</span>
                </Link>
              </div>
            </div>

          </div>
        </section>
      )}

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
    </div>
  );
}
