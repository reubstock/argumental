import Panel from "@/components/Panel";
import { AddCharityButton } from "@/components/AddCharityDialog";
import { getAllCharities } from "@/lib/charities";

export const dynamic = "force-dynamic";

export default async function CharitiesPage() {
  const charities = await getAllCharities();

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="border-b border-zinc-200 px-4 md:px-6 py-6 md:py-8">
        <div className="max-w-6xl mx-auto flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-black text-xs uppercase tracking-widest font-semibold mb-2">
              Impact
            </p>
            <h1 className="text-3xl font-black text-zinc-900">
              Charities Benefited
            </h1>
            <p className="text-zinc-500 text-sm mt-2">
              18% of every debate&apos;s proceeds goes to the winning
              debater&apos;s chosen charity.
            </p>
          </div>
          <AddCharityButton />
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 px-4 md:px-6 py-6 md:py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {charities.map((charity) => (
            <Panel key={charity.id} className="flex flex-col">
              {/* Hero image — 2:1 ratio strip at the top */}
              {charity.heroImage && (
                <div className="aspect-[2/1] bg-zinc-100 border-b border-zinc-200 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={charity.heroImage}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-5 flex flex-col gap-3 flex-1">
                <div>
                  <p className="text-black text-[10px] uppercase tracking-widest font-bold mb-1">
                    {charity.focus}
                  </p>
                  <h3 className="text-zinc-900 font-black text-lg leading-tight">
                    {charity.name}
                  </h3>
                </div>
                <p className="text-zinc-600 text-sm leading-snug flex-1">
                  {charity.mission}
                </p>
                <div className="flex items-center justify-between gap-3 pt-1">
                  {charity.metric ? (
                    <span className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold tabular-nums">
                      {charity.metric}
                    </span>
                  ) : (
                    <span />
                  )}
                  <a
                    href={charity.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-[11px] px-3 py-2 rounded-md transition whitespace-nowrap"
                  >
                    Visit ↗
                  </a>
                </div>
              </div>
            </Panel>
          ))}

          {/* Trailing "add a charity" tile to balance the grid visually */}
          <Panel className="flex flex-col">
            <div className="aspect-[2/1] bg-zinc-50 border-b border-zinc-200 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#a1a1aa"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
            </div>
            <div className="p-5 flex flex-col gap-3 flex-1 items-center justify-center text-center">
              <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
                Add a charity
              </span>
              <p className="text-zinc-500 text-xs">
                Or wait — debaters add their picks as bouts are scheduled.
              </p>
              <AddCharityButton
                label="Add charity"
                className="bg-white hover:bg-zinc-50 border border-zinc-300 hover:border-black text-zinc-800 font-black uppercase tracking-widest text-[11px] px-3 py-2 rounded-md transition mt-1"
              />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
