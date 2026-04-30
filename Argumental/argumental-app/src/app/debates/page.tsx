import Link from "next/link";
import Panel from "@/components/Panel";
import { getAllDebates } from "@/lib/debates";

export default function DebatesPage() {
  const debates = getAllDebates();

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-14 w-full">
      <div className="mb-8">
        <p className="text-black text-xs uppercase tracking-widest font-semibold mb-2">
          Catalogue
        </p>
        <h1 className="text-3xl md:text-4xl font-black text-zinc-900">
          All Debates
        </h1>
        <p className="text-zinc-500 text-sm mt-2">
          Weekly bouts on the hottest topics. One vote. Five bucks. You decide.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {debates.map((debate) => {
          const statusColor = {
            live: "bg-brand-red text-white",
            upcoming: "bg-zinc-100 text-zinc-700",
            finished: "bg-zinc-100 text-zinc-500",
          }[debate.status];

          return (
            <Link
              key={debate.id}
              href={`/debates/${debate.id}`}
              className="group block"
            >
              <Panel className="hover:border-black transition">
                <div className="p-5 flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-2 min-w-0">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${statusColor}`}
                      >
                        {debate.status === "live" ? "● LIVE" : debate.status}
                      </span>
                      <span className="text-zinc-500 text-xs uppercase tracking-widest tabular-nums">
                        {new Date(debate.scheduledAt).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>
                    <h2 className="text-zinc-900 font-bold text-lg group-hover:text-brand-red transition">
                      {debate.title}
                    </h2>
                    <p className="text-zinc-500 text-sm">{debate.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-sm">
                      <span className="text-brand-red font-semibold">
                        {debate.debaterA.name}
                      </span>
                      <span className="text-zinc-400 text-xs">vs</span>
                      <span className="text-brand-blue font-semibold">
                        {debate.debaterB.name}
                      </span>
                    </div>
                  </div>
                  <span className="text-zinc-400 group-hover:text-brand-red text-2xl transition mt-1 shrink-0">
                    →
                  </span>
                </div>
              </Panel>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
