import { notFound } from "next/navigation";
import { getDebate } from "@/lib/debates";
import DebateStudio from "@/components/debate/DebateStudio";
import Panel from "@/components/Panel";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string; role?: string }>;
}

export default async function StudioPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { name, role } = await searchParams;
  const debate = getDebate(id);
  if (!debate) notFound();

  const participantName = name ?? "Guest";
  const isDebater = role === "debater";

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-14 w-full">
      <div className="mb-6">
        <p className="text-black text-xs uppercase tracking-widest font-semibold mb-2">
          Studio
        </p>
        <h1 className="text-3xl font-black text-zinc-900">{debate.title}</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Joined as{" "}
          <span className="text-zinc-900 font-semibold">{participantName}</span>
          {isDebater ? " (Debater)" : " (Observer)"}
        </p>
      </div>

      <DebateStudio
        debate={debate}
        participantName={participantName}
        isDebater={isDebater}
      />

      <div className="mt-6">
        <Panel label="Phase Order">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
            {[
              { label: "Opening A", sub: debate.debaterA.name, side: "A" },
              { label: "Opening B", sub: debate.debaterB.name, side: "B" },
              { label: "Rebuttal A", sub: debate.debaterA.name, side: "A" },
              { label: "Rebuttal B", sub: debate.debaterB.name, side: "B" },
            ].map((p, i) => (
              <div
                key={i}
                className="bg-zinc-50 border border-zinc-200 rounded-md p-3 text-center"
              >
                <p
                  className={`text-xs font-black tabular-nums ${p.side === "A" ? "text-brand-red" : "text-brand-blue"}`}
                >
                  {`0${i + 1}`}
                </p>
                <p className="text-zinc-900 text-sm font-semibold mt-1">
                  {p.label}
                </p>
                <p className="text-zinc-500 text-xs">{p.sub}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
