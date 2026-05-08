import Panel from "@/components/Panel";
import WalletCheckout from "@/components/WalletCheckout";

export const metadata = {
  title: "Argumental — Load Wallet",
  description:
    "Load your Argumental wallet via Stripe Checkout. $10/week vote cap, preload up to $100 for future weeks.",
};

const WEEKLY_CAP = 10;
const PRELOAD_MAX = 100;
const WEEKS_COVERED = PRELOAD_MAX / WEEKLY_CAP;

export default async function WalletPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    amount?: string;
    session_id?: string;
  }>;
}) {
  const sp = await searchParams;
  const status = sp.status;
  const amount = sp.amount;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-5 md:py-8 w-full">
      {/* Header */}
      <div className="mb-6 flex items-baseline gap-3 flex-wrap">
        <h1 className="text-2xl md:text-3xl font-black text-zinc-900 leading-none">
          Load Wallet
        </h1>
        <p className="text-zinc-500 text-xs md:text-sm flex items-center gap-1.5 flex-wrap">
          Vote on bouts you care about · powered by{" "}
          <span className="text-[#635BFF] font-black tracking-tight">
            stripe
          </span>
          .
        </p>
      </div>

      {/* Return-from-Stripe status banner */}
      {status === "success" && <SuccessBanner amount={amount} />}
      {status === "cancelled" && <CancelledBanner />}

      {/* PRIMARY ACTION — amount picker + Stripe redirect */}
      <div className="mb-6">
        <WalletCheckout />
      </div>

      {/* 3-step process explainer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <StepCard
          n="01"
          accent="brand-red"
          title="Connect with Stripe"
          body="Sign in to your wallet through Stripe Checkout. Your card never touches Argumental — Stripe handles the payment, we handle the votes."
        >
          <ShieldGlyph />
        </StepCard>
        <StepCard
          n="02"
          accent="zinc-900"
          title="Load funds"
          body={`Add $5 to $${PRELOAD_MAX} in a single tap. Preload up to ${WEEKS_COVERED} weeks of bouts at once and forget about it. Unspent balance rolls forward.`}
        >
          <WalletGlyph />
        </StepCard>
        <StepCard
          n="03"
          accent="brand-blue"
          title="Vote weekly"
          body={`Spend up to $${WEEKLY_CAP} per week on the bouts you care about. The cap resets every Sunday after the bout closes.`}
        >
          <BallotGlyph />
        </StepCard>
      </div>

      {/* Spending limits panel */}
      <Panel label="Spending limits">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-zinc-200 md:divide-x">
          <LimitStat
            kicker="Weekly cap"
            value={`$${WEEKLY_CAP}`}
            sub="Resets Sunday"
          />
          <LimitStat
            kicker="Preload max"
            value={`$${PRELOAD_MAX}`}
            sub={`Covers ~${WEEKS_COVERED} weeks`}
          />
          <LimitStat
            kicker="Per vote"
            value="$5"
            sub="One vote per viewer per bout"
          />
          <LimitStat
            kicker="Refunds"
            value="Anytime"
            sub="Via Stripe portal"
          />
        </div>
      </Panel>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */

function SuccessBanner({ amount }: { amount?: string }) {
  const safe = amount && /^\d+$/.test(amount) ? amount : null;
  return (
    <div
      role="status"
      className="border border-emerald-200 bg-emerald-50 text-emerald-800 px-4 py-3 rounded-md mb-6 flex items-start gap-3"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-0.5 shrink-0"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      <div className="flex-1 min-w-0">
        <p className="font-black uppercase tracking-widest text-[11px]">
          Wallet loaded
        </p>
        <p className="text-sm mt-0.5">
          {safe
            ? `Thanks — $${safe} is now on your wallet, good for ~${
                Number(safe) / WEEKLY_CAP
              } week${Number(safe) / WEEKLY_CAP === 1 ? "" : "s"} of voting.`
            : "Thanks — your wallet is loaded and ready to vote."}
        </p>
      </div>
    </div>
  );
}

function CancelledBanner() {
  return (
    <div
      role="status"
      className="border border-zinc-200 bg-zinc-50 text-zinc-700 px-4 py-3 rounded-md mb-6 flex items-start gap-3"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-0.5 shrink-0"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <div>
        <p className="font-black uppercase tracking-widest text-[11px]">
          Checkout cancelled
        </p>
        <p className="text-sm mt-0.5">
          No charge was made. Pick an amount below to try again.
        </p>
      </div>
    </div>
  );
}

function StepCard({
  n,
  accent,
  title,
  body,
  children,
}: {
  n: string;
  accent: "brand-red" | "brand-blue" | "zinc-900";
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  const numCls = {
    "brand-red": "text-brand-red",
    "brand-blue": "text-brand-blue",
    "zinc-900": "text-zinc-900",
  }[accent];

  return (
    <div className="border border-zinc-200 rounded-md bg-white p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <span
          className={`${numCls} font-black tabular-nums text-2xl leading-none`}
        >
          {n}
        </span>
        <div className="text-zinc-300">{children}</div>
      </div>
      <h3 className="text-zinc-900 font-bold text-base">{title}</h3>
      <p className="text-zinc-600 text-sm leading-relaxed">{body}</p>
    </div>
  );
}

function LimitStat({
  kicker,
  value,
  sub,
}: {
  kicker: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="px-5 py-4 first:border-l-0">
      <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-black">
        {kicker}
      </p>
      <p className="text-zinc-900 font-black text-lg md:text-xl tabular-nums leading-none mt-1">
        {value}
      </p>
      <p className="text-zinc-500 text-[11px] mt-1">{sub}</p>
    </div>
  );
}

function ShieldGlyph() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function WalletGlyph() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <path d="M16 13h2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function BallotGlyph() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M9 10l2 2 4-4" />
      <path d="M8 4h8" />
    </svg>
  );
}
