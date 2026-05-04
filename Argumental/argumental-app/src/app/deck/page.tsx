import Panel from "@/components/Panel";

export default function DeckPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-14 w-full">
      <div className="mb-8">
        <p className="text-black text-xs uppercase tracking-widest font-semibold mb-2">
          Your Deck
        </p>
        <h1 className="text-3xl md:text-4xl font-black text-zinc-900">
          Deck
        </h1>
        <p className="text-zinc-500 text-sm mt-2">
          Your bouts, your votes, your debaters — all in one place.
        </p>
      </div>

      <Panel>
        <div className="p-10 md:p-16 text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
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
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
            Coming soon
          </span>
          <p className="text-zinc-500 text-sm max-w-md">
            Your personal control surface — saved bouts, vote history, alerts
            for new debates featuring debaters you follow, and more. We&apos;re
            building it out next.
          </p>
        </div>
      </Panel>
    </div>
  );
}
