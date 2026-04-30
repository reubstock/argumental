import { UPCOMING_BOUTS } from "@/lib/upcomingBouts";
import { getAllDebates } from "@/lib/debates";

/**
 * Ticker — a single-line status strip pinned below the nav.
 *
 * Always visible. Dashboards live or die on this kind of element: it tells
 * the viewer that the rest of the page is a live machine, not marketing.
 *
 * Mobile keeps only the two highest-signal stats (status + next bout) so the
 * strip never overflows. Larger viewports get the full board, votes, raised.
 */
export default function Ticker() {
  const now = Date.now();
  const debates = getAllDebates();
  const upcoming = UPCOMING_BOUTS.filter(
    (b) => new Date(b.scheduledAt).getTime() > now,
  );
  const nextBout = upcoming[0];
  const totalVotes = debates.reduce((s, d) => s + d.votesA + d.votesB, 0);
  const totalRaised = totalVotes * 5;
  const liveDebate = debates.find((d) => d.status === "live");

  const nextDateStr = nextBout
    ? new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        weekday: "short",
        month: "short",
        day: "numeric",
      })
        .format(new Date(nextBout.scheduledAt))
        .toUpperCase()
    : null;

  const daysUntil = nextBout
    ? Math.ceil(
        (new Date(nextBout.scheduledAt).getTime() - now) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  const status = liveDebate ? "LIVE" : "UPCOMING";
  const statusDot = liveDebate ? "bg-brand-red animate-pulse" : "bg-zinc-400";

  return (
    <div className="border-b border-zinc-200 bg-zinc-50">
      <div className="max-w-6xl mx-auto px-3 md:px-6 py-1.5 overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-zinc-600 tabular-nums">
          {/* Always visible */}
          <span className="flex items-center gap-1.5">
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full ${statusDot}`}
            />
            {status}
          </span>

          {nextDateStr && (
            <>
              <span className="text-zinc-300">·</span>
              <span>
                <span className="hidden sm:inline">Next bout </span>
                {nextDateStr}
                {daysUntil !== null && daysUntil > 0
                  ? ` · ${daysUntil}d`
                  : ""}
              </span>
            </>
          )}

          {/* Tablet+ */}
          <span className="hidden sm:inline text-zinc-300">·</span>
          <span className="hidden sm:inline">
            {upcoming.length} on the board
          </span>
          <span className="hidden sm:inline text-zinc-300">·</span>
          <span className="hidden sm:inline">
            {totalVotes.toLocaleString()} votes cast
          </span>
          <span className="hidden sm:inline text-zinc-300">·</span>
          <span className="hidden sm:inline">
            ${totalRaised.toLocaleString()} raised
          </span>
        </div>
      </div>
    </div>
  );
}
