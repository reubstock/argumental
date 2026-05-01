import { getAllDebates } from "@/lib/debates";
import Panel from "@/components/Panel";

export default function OutcomesPage() {
  const finished = getAllDebates().filter((d) => d.status === "finished");

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="border-b border-zinc-200 px-4 md:px-6 py-6 md:py-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-black text-xs uppercase tracking-widest font-semibold mb-2">
            Verdicts
          </p>
          <h1 className="text-3xl font-black text-zinc-900">Outcomes</h1>
          <p className="text-zinc-500 text-sm mt-2">
            Resolved bouts. Final tallies and which charity collected the cut.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          {finished.length === 0 ? (
            <Panel>
              <div className="p-10 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-zinc-100 flex items-center justify-center mb-4">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#a1a1aa"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="3" x2="12" y2="21" />
                    <line x1="5" y1="6" x2="19" y2="6" />
                    <path d="M3 13l3 -7l3 7" />
                    <path d="M15 13l3 -7l3 7" />
                    <path d="M3 13a3 3 0 0 0 6 0" />
                    <path d="M15 13a3 3 0 0 0 6 0" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                  </svg>
                </div>
                <p className="text-zinc-700 font-bold text-base">
                  No verdicts yet
                </p>
                <p className="text-zinc-500 text-sm mt-1">
                  Outcomes will appear here once bouts wrap. The first bout
                  is on Sun, May 10.
                </p>
              </div>
            </Panel>
          ) : (
            <div className="flex flex-col gap-3">
              {finished.map((debate) => {
                const winner =
                  debate.votesA > debate.votesB
                    ? "A"
                    : debate.votesB > debate.votesA
                      ? "B"
                      : null;
                const total = debate.votesA + debate.votesB;
                return (
                  <Panel key={debate.id}>
                    <div className="p-5 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-zinc-500 text-xs uppercase tracking-widest tabular-nums mb-1">
                          {new Date(debate.scheduledAt).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </div>
                        <h2 className="text-zinc-900 font-bold text-lg">
                          {debate.title}
                        </h2>
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <span
                            className={`font-semibold ${winner === "A" ? "text-brand-red" : "text-zinc-500"}`}
                          >
                            {debate.debaterA.name}{" "}
                            <span className="tabular-nums">
                              {debate.votesA}
                            </span>
                          </span>
                          <span className="text-zinc-400 text-xs">vs</span>
                          <span
                            className={`font-semibold ${winner === "B" ? "text-brand-blue" : "text-zinc-500"}`}
                          >
                            <span className="tabular-nums">
                              {debate.votesB}
                            </span>{" "}
                            {debate.debaterB.name}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-zinc-400 text-[10px] uppercase tracking-widest">
                          Total raised
                        </div>
                        <div className="text-zinc-900 font-black text-xl tabular-nums">
                          ${(total * 5).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </Panel>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
