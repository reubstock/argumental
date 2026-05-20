import Image from "next/image";

export const metadata = {
  title: "Argumental — Investor One-Pager",
  description:
    "The world's first professional debate league. $500K pre-seed.",
};

/**
 * /onepager — single-page investor brief. Fits on one printed page
 * (US Letter, default margins). Designed for email attachment as PDF
 * (print via browser → Save as PDF) or screenshot sharing.
 *
 * Structure follows the LaunchDeck recommendation:
 *   header · problem · solution · market · product/MVP ·
 *   traction · team · ask/contact.
 */
export default function OnePagerPage() {
  return (
    <div className="bg-white text-zinc-900 print:bg-white">
      <article className="max-w-4xl mx-auto px-6 md:px-10 py-8 md:py-12 print:px-6 print:py-6">
        {/* ── HEADER ───────────────────────────────────────────── */}
        <header className="flex items-center gap-4 md:gap-5 pb-5 md:pb-6 mb-5 md:mb-6 border-b-2 border-zinc-900">
          <Image
            src="/logo.png"
            alt="Argumental"
            width={80}
            height={80}
            priority
            className="w-14 h-14 md:w-16 md:h-16 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-none">
              Argumental
            </h1>
            <p className="text-zinc-600 font-bold text-sm md:text-base mt-1">
              The world&apos;s first professional debate league.
            </p>
            <p className="text-zinc-500 text-xs md:text-sm italic mt-0.5">
              The Path to Peace Begins with an Argument.
            </p>
          </div>
          <div className="hidden md:block text-right shrink-0">
            <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-black">
              Investor Brief · 2026
            </p>
            <p className="text-zinc-500 text-xs mt-1">
              argumental.vercel.app
            </p>
          </div>
        </header>

        {/* ── PROBLEM + SOLUTION (side-by-side) ────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 mb-5 md:mb-6">
          <div>
            <p className="text-brand-red text-[10px] uppercase tracking-widest font-black mb-1.5">
              Problem
            </p>
            <p className="text-zinc-800 text-sm md:text-base leading-snug">
              The world has never been more divided — and you only ever
              hear one side of it. Algorithms reward outrage,
              counterpoints are buried, and formal debate has no modern
              televised home. The last great format (Lincoln–Douglas)
              was 165 years ago.
            </p>
          </div>
          <div>
            <p className="text-brand-blue text-[10px] uppercase tracking-widest font-black mb-1.5">
              Solution
            </p>
            <p className="text-zinc-800 text-sm md:text-base leading-snug">
              Weekly one-on-one title bouts between opposing thinkers.
              24 minutes. Four 6-minute phases. No moderator. The
              audience judges with $5 votes — 18% of every dollar to
              the winner&apos;s chosen charity. Live at{" "}
              <span className="font-bold">argumental.vercel.app</span>.
            </p>
          </div>
        </section>

        {/* ── MARKET ───────────────────────────────────────────── */}
        <section className="mb-5 md:mb-6">
          <p className="text-zinc-900 text-[10px] uppercase tracking-widest font-black mb-2">
            Market
          </p>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <Stat
              label="TAM"
              value="$250B"
              note="Creator economy by 2028"
            />
            <Stat
              label="Audience signal"
              value="30M+/wk"
              note="Long-form audio listeners (Rogan · Fridman · adj.)"
            />
            <Stat
              label="Why now"
              value="60-yr peak"
              note="Cross-side polarization · Pew · ANES"
            />
          </div>
        </section>

        {/* ── PRODUCT ──────────────────────────────────────────── */}
        <section className="mb-5 md:mb-6 border-t border-zinc-200 pt-4 md:pt-5">
          <p className="text-zinc-900 text-[10px] uppercase tracking-widest font-black mb-2">
            Product — League, not show
          </p>
          <p className="text-zinc-800 text-sm md:text-base leading-snug">
            Live one-on-one bouts, real-time audience voting, automatic
            charity payout, archive that compounds. Champions ranked by
            knowledge class and region — like weight classes in MMA.
            Distribution native to YouTube, TikTok, Instagram. Format is{" "}
            <span className="font-bold">10× better than every competitor</span>{" "}
            (Soho Forum, Open to Debate, Munk Debates, Jubilee, Rogan)
            because it&apos;s a league — defendable titles, rankings,
            pay-per-vote unit economics — not a one-off show.
          </p>
        </section>

        {/* ── TRACTION ─────────────────────────────────────────── */}
        <section className="mb-5 md:mb-6">
          <p className="text-zinc-900 text-[10px] uppercase tracking-widest font-black mb-2">
            Traction — already live
          </p>
          <ul className="text-zinc-800 text-sm md:text-base leading-snug space-y-1">
            <li>
              ·{" "}
              <span className="font-bold">First bout settled</span> —
              Shapiro defeated AOC, 58 / 42, on a $107K pot. $19K
              routed to Friends of the IDF.
            </li>
            <li>
              ·{" "}
              <span className="font-bold">Full stack shipped</span> —
              dual-stream Mux player, Stripe wallet, LiveKit studio,
              voting, archive, leaderboards.
            </li>
            <li>
              ·{" "}
              <span className="font-bold">10 charity partners</span>{" "}
              surfaced; FIDF, UNRWA USA, Humanity Forward, EJI, ADF,
              Trans Lifeline, and more.
            </li>
            <li>
              ·{" "}
              <span className="font-bold">Investor-grade model</span>{" "}
              published — two scenarios, downloadable .xlsx with
              editable assumptions.
            </li>
            <li>
              ·{" "}
              <span className="font-bold">3-yr aggressive forecast</span>:{" "}
              $0.5M → $3.9M → $8.0M revenue · Y3 EBITDA $3.4M
              · per-bout profit reaches $130K by Y3.
            </li>
          </ul>
        </section>

        {/* ── TEAM ─────────────────────────────────────────────── */}
        <section className="mb-5 md:mb-6 border-t border-zinc-200 pt-4 md:pt-5">
          <p className="text-zinc-900 text-[10px] uppercase tracking-widest font-black mb-2">
            Team
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
            <div>
              <p className="text-zinc-900 font-black text-base md:text-lg leading-tight">
                Reuben Steiger
              </p>
              <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">
                Co-Founder · CEO
              </p>
              <p className="text-zinc-600 text-xs md:text-sm italic mt-1">
                [Add 2-line bio: prior companies, exits, domain
                credibility — replace before sharing.]
              </p>
            </div>
            <div>
              <p className="text-zinc-900 font-black text-base md:text-lg leading-tight">
                Joshua Koppel
              </p>
              <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">
                Co-Founder · President
              </p>
              <p className="text-zinc-600 text-xs md:text-sm italic mt-1">
                [Add 2-line bio: prior companies, exits, domain
                credibility — replace before sharing.]
              </p>
            </div>
          </div>
        </section>

        {/* ── ASK + CTA ────────────────────────────────────────── */}
        <section className="border-t-2 border-zinc-900 pt-4 md:pt-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5 mb-4 md:mb-5">
            <div>
              <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-black">
                The Ask
              </p>
              <p className="text-zinc-900 font-black text-xl md:text-2xl tabular-nums leading-none mt-1">
                $500K
              </p>
              <p className="text-zinc-600 text-xs mt-1">Pre-seed round</p>
            </div>
            <div>
              <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-black">
                Structure
              </p>
              <p className="text-zinc-900 font-black text-xl md:text-2xl tabular-nums leading-none mt-1">
                $8M cap
              </p>
              <p className="text-zinc-600 text-xs mt-1">SAFE · 18-mo runway</p>
            </div>
            <div>
              <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-black">
                Use of funds
              </p>
              <p className="text-zinc-900 font-bold text-sm md:text-base leading-tight mt-1">
                24 bouts Y1
              </p>
              <p className="text-zinc-600 text-xs mt-1">
                Production · talent · GTM
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <p className="text-zinc-900 text-base md:text-lg font-black leading-tight">
                Join the founding round.
              </p>
              <p className="text-zinc-600 text-sm mt-1">
                The world doesn&apos;t need fewer arguments. It needs
                better ones.
              </p>
            </div>
            <div className="text-left md:text-right text-xs md:text-sm">
              <p className="text-zinc-900 font-black">
                reubstock@gmail.com
              </p>
              <p className="text-zinc-600">argumental.vercel.app</p>
              <p className="text-zinc-500">
                Full deck: argumental.vercel.app/deck
              </p>
            </div>
          </div>
        </section>
      </article>

      {/* Print stylesheet — keep colors, hide nav chrome on print */}
      <style>{`
        @media print {
          @page { size: letter; margin: 0.4in; }
          nav, footer { display: none !important; }
          body { background: white; }
          article { padding: 0 !important; }
        }
      `}</style>
    </div>
  );
}

function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="border border-zinc-200 rounded-md p-3">
      <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-black">
        {label}
      </p>
      <p className="text-zinc-900 font-black text-lg md:text-xl tabular-nums leading-none mt-1">
        {value}
      </p>
      <p className="text-zinc-600 text-xs mt-1 leading-snug">{note}</p>
    </div>
  );
}
