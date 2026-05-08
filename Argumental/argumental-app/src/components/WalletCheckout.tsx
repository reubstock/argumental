"use client";

import { useState } from "react";
import Panel from "@/components/Panel";

const PRESETS = [
  { amount: 10, weeks: "1 week" },
  { amount: 25, weeks: "2.5 weeks" },
  { amount: 50, weeks: "5 weeks" },
  { amount: 100, weeks: "10 weeks" },
] as const;

type Preset = (typeof PRESETS)[number]["amount"];

/**
 * WalletCheckout — primary CTA on /wallet. Amount picker + a single
 * "Continue to stripe" button that hits POST /api/wallet/checkout and
 * redirects to the hosted Stripe Checkout flow. Stripe handles auth
 * (email + Link) and payment; on completion the user lands back on
 * /wallet?status=success.
 */
export default function WalletCheckout() {
  const [amount, setAmount] = useState<Preset>(25);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadWallet() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/wallet/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      const { url } = (await res.json()) as { url: string };
      window.location.href = url;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
      setSubmitting(false);
    }
  }

  return (
    <Panel label="Load amount">
      <div className="p-5 md:p-6 flex flex-col gap-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {PRESETS.map((p) => {
            const active = amount === p.amount;
            return (
              <button
                key={p.amount}
                type="button"
                onClick={() => setAmount(p.amount)}
                aria-pressed={active}
                className={`px-3 py-3 rounded-md border-2 transition text-left ${
                  active
                    ? "border-black bg-black text-white"
                    : "border-zinc-300 bg-white text-zinc-900 hover:border-black"
                }`}
              >
                <p className="font-black text-xl tabular-nums leading-none">
                  ${p.amount}
                </p>
                <p
                  className={`text-[10px] font-bold uppercase tracking-widest mt-1.5 ${
                    active ? "opacity-80" : "text-zinc-500"
                  }`}
                >
                  {p.weeks}
                </p>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={loadWallet}
            disabled={submitting}
            className="bg-[#635BFF] hover:bg-[#5147E5] disabled:opacity-50 text-white font-black uppercase tracking-widest text-xs px-5 py-3 rounded-md transition inline-flex items-center justify-center gap-2 shadow-sm shadow-[#635BFF]/20"
          >
            {submitting ? (
              <>Redirecting…</>
            ) : (
              <>
                Continue to
                <span className="inline-flex items-center bg-white text-[#635BFF] px-2 py-0.5 rounded text-xs font-bold lowercase tracking-tight">
                  stripe
                </span>
                <span aria-hidden>→</span>
              </>
            )}
          </button>
          <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">
            PCI-compliant · No card details stored on Argumental
          </p>
        </div>

        {error && (
          <div className="border border-brand-red/30 bg-brand-red/5 text-brand-red text-sm font-semibold px-4 py-3 rounded-md">
            {error}
          </div>
        )}
      </div>
    </Panel>
  );
}
