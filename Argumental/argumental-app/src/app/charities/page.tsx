export default function CharitiesPage() {
  const charities: ({ url: string; name: string } | null)[] = [
    { url: "https://fmep.org/", name: "Foundation for Middle East Peace" },
    { url: "https://www.allmep.org/international-fund-for-israeli-palestinian-peace/", name: "International Fund for Israeli-Palestinian Peace" },
    null,
    null,
    null,
    null,
  ];

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="border-b border-zinc-200 px-4 md:px-6 py-6 md:py-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-black text-xs uppercase tracking-widest font-semibold mb-2">Impact</p>
          <h1 className="text-3xl font-black text-zinc-900">Charities Benefited</h1>
          <p className="text-zinc-500 text-sm mt-2">
            10% of every debate's proceeds go to the winning debater's chosen charity.
          </p>
        </div>
      </div>

      {/* 2 × 3 grid */}
      <div className="flex-1 px-4 md:px-6 py-6 md:py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {charities.map((charity, i) =>
            charity ? (
              <div key={i} className="relative rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-sm group min-h-[320px]">
                <iframe
                  src={charity.url}
                  title={charity.name}
                  className="w-full h-full border-0"
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
                {/* Name overlay at bottom */}
                <div className="absolute bottom-0 inset-x-0 bg-white/90 backdrop-blur-sm border-t border-zinc-200 px-4 py-2 flex items-center justify-between">
                  <span className="text-zinc-800 font-bold text-sm">{charity.name}</span>
                  <a
                    href={charity.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black hover:text-zinc-700 text-xs font-semibold uppercase tracking-wide transition"
                  >
                    Visit ↗
                  </a>
                </div>
              </div>
            ) : (
              <div
                key={i}
                className="rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center gap-2 min-h-[320px]"
              >
                <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </div>
                <span className="text-zinc-400 text-sm font-medium">Coming soon</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
