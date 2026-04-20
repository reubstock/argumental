import Link from "next/link";
import { getAllDebates } from "@/lib/debates";

export default function DebatesPage() {
  const debates = getAllDebates();

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 w-full">
      <h1 className="text-4xl font-black text-white mb-2">All Debates</h1>
      <p className="text-zinc-400 mb-10">Weekly bouts on the hottest topics. One vote. Five bucks. You decide.</p>

      <div className="flex flex-col gap-4">
        {debates.map((debate) => {
          const statusColor = {
            live: "bg-red-600 text-white",
            upcoming: "bg-zinc-700 text-zinc-300",
            finished: "bg-zinc-800 text-zinc-500",
          }[debate.status];

          return (
            <Link
              key={debate.id}
              href={`/debates/${debate.id}`}
              className="group bg-zinc-900 border border-zinc-800 hover:border-yellow-400/50 rounded-2xl p-6 flex items-start justify-between gap-4 transition"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${statusColor}`}>
                    {debate.status === "live" ? "● LIVE" : debate.status}
                  </span>
                  <span className="text-zinc-500 text-xs">
                    {new Date(debate.scheduledAt).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <h2 className="text-white font-bold text-xl group-hover:text-yellow-400 transition">
                  {debate.title}
                </h2>
                <p className="text-zinc-400 text-sm">{debate.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-blue-400 font-semibold text-sm">{debate.debaterA.name}</span>
                  <span className="text-zinc-600 text-xs">vs</span>
                  <span className="text-red-400 font-semibold text-sm">{debate.debaterB.name}</span>
                </div>
              </div>
              <span className="text-zinc-600 group-hover:text-yellow-400 text-2xl transition mt-1 shrink-0">→</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
