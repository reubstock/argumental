import Link from "next/link";
import Image from "next/image";
import { getAllDebates } from "@/lib/debates";
import VideoPlayer from "@/components/VideoPlayer";

export default function HomePage() {
  const debates = getAllDebates();
  const featured = debates[0];

  return (
    <div className="flex flex-col">
      {/* Featured debate — full width, top of page */}
      {featured && (
        <section className="relative border-b border-zinc-200 px-6 pt-8 pb-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/5 to-transparent pointer-events-none" />
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 items-stretch">

            {/* Info card — left */}
            <div className="lg:w-72 flex flex-col gap-4 shrink-0">
              <div className="bg-zinc-100 border border-zinc-200 rounded-2xl p-6 flex flex-col gap-4 h-full">
                <div>
                  <p className="text-yellow-600 text-xs uppercase tracking-widest font-semibold mb-2">
                    Featured Bout
                  </p>
                  <h2 className="text-zinc-900 font-black text-xl leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-zinc-600 text-sm mt-3 leading-relaxed">
                    {featured.description}
                  </p>
                </div>

                <div className="border-t border-zinc-200 pt-4 flex flex-col gap-2 text-sm">
                  <div className="flex justify-between text-zinc-500">
                    <span>Format</span>
                    <span className="text-zinc-700">4 phases · 25 min</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Vote cost</span>
                    <span className="text-zinc-700">$5 per vote</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Charity cut</span>
                    <span className="text-zinc-700">10% to winner&apos;s pick</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Date</span>
                    <span className="text-zinc-700">
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
              <div className="relative">
                <VideoPlayer
                  youtubeId="YQ7IudJBpf0"
                  debaterAName={featured.debaterA.name}
                  debaterAPhoto="/shapiro.jpg"
                  debaterAPosition={featured.debaterA.position}
                  debaterBName={featured.debaterB.name}
                  debaterBPhoto="/aoc.jpg"
                  debaterBPosition={featured.debaterB.position}
                  isLive={featured.status === "live"}
                />
              </div>

              {/* Debater vote row */}
              <div className="flex justify-between items-center px-1 gap-4">
                {/* Shapiro — left */}
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-red-500 shrink-0">
                    <Image src="/shapiro.jpg" alt={featured.debaterA.name} width={48} height={48} className="w-full h-full object-cover object-top" />
                  </div>
                  <span className="bg-red-600 text-white font-black text-sm uppercase px-4 py-2 rounded-lg">VOTE</span>
                  <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase px-3 py-2 rounded-lg transition">$1</button>
                  <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase px-3 py-2 rounded-lg transition">$5</button>
                </div>

                {/* AOC — right */}
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 shrink-0">
                    <Image src="/aoc.jpg" alt={featured.debaterB.name} width={48} height={48} className="w-full h-full object-cover object-top" />
                  </div>
                  <span className="bg-blue-600 text-white font-black text-sm uppercase px-4 py-2 rounded-lg">VOTE</span>
                  <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase px-3 py-2 rounded-lg transition">$1</button>
                  <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase px-3 py-2 rounded-lg transition">$5</button>
                </div>
              </div>
            </div>

          </div>
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
        <p className="text-center text-zinc-500 mt-6 text-sm" >
          Each phase is timed. Total bout: 25 minutes.
        </p>
      </section>
    </div>
  );
}
