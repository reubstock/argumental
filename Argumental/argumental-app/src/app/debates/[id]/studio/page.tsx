import { notFound } from "next/navigation";
import { getDebate } from "@/lib/debates";
import DebateStudio from "@/components/debate/DebateStudio";

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
    <div className="max-w-5xl mx-auto px-6 py-10 w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-white">{debate.title}</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Studio — joined as <span className="text-yellow-400 font-semibold">{participantName}</span>
          {isDebater ? " (Debater)" : " (Observer)"}
        </p>
      </div>

      <DebateStudio
        debate={debate}
        participantName={participantName}
        isDebater={isDebater}
      />

      <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h3 className="text-zinc-300 font-semibold mb-3">Phase Order</h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Opening A", sub: debate.debaterA.name },
            { label: "Opening B", sub: debate.debaterB.name },
            { label: "Rebuttal A", sub: debate.debaterA.name },
            { label: "Rebuttal B", sub: debate.debaterB.name },
          ].map((p, i) => (
            <div key={i} className="bg-zinc-950 rounded-xl p-3 text-center">
              <p className="text-yellow-400 text-xs font-bold">{`0${i + 1}`}</p>
              <p className="text-white text-sm font-semibold">{p.label}</p>
              <p className="text-zinc-500 text-xs">{p.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
