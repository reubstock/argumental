import { getAllDebates } from "@/lib/debates";
import { hasPersistentStorage } from "@/lib/charities";
import Link from "next/link";
import Panel from "@/components/Panel";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const debates = getAllDebates();
  const charityPersistent = hasPersistentStorage();

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-14 w-full">
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <p className="text-black text-xs uppercase tracking-widest font-semibold mb-2">
            Operator
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900">
            Admin
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Manage debates and monitor live bouts.
          </p>
        </div>

        {/* System status — currently just charity DB; expand as more services come online */}
        <div className="flex flex-col gap-1.5 mt-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Status
          </span>
          <StatusPill
            label="Charity DB"
            ok={charityPersistent}
            okLabel="Connected"
            offLabel="In-memory"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {debates.map((debate) => (
          <Panel key={debate.id}>
            <div className="p-5 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      debate.status === "live"
                        ? "bg-brand-red text-white"
                        : debate.status === "upcoming"
                          ? "bg-zinc-100 text-zinc-700"
                          : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {debate.status}
                  </span>
                  <span className="text-zinc-500 text-xs uppercase tracking-widest tabular-nums">
                    ID: {debate.id}
                  </span>
                </div>
                <h2 className="text-zinc-900 font-bold text-base">
                  {debate.title}
                </h2>
                <p className="text-zinc-500 text-sm">
                  <span className="text-brand-red font-semibold">
                    {debate.debaterA.name}
                  </span>{" "}
                  vs{" "}
                  <span className="text-brand-blue font-semibold">
                    {debate.debaterB.name}
                  </span>{" "}
                  ·{" "}
                  <span className="tabular-nums">
                    {debate.votesA + debate.votesB}
                  </span>{" "}
                  total votes
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  href={`/debates/${debate.id}`}
                  className="text-xs font-black uppercase tracking-widest text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-300 hover:border-black px-3 py-2 rounded-md transition"
                >
                  View
                </Link>
                <Link
                  href={`/debates/${debate.id}/studio?role=moderator&name=Admin`}
                  className="text-xs font-black uppercase tracking-widest text-white bg-black hover:bg-zinc-800 px-3 py-2 rounded-md transition"
                >
                  Studio
                </Link>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <div className="mt-10">
        <Panel label="Integration Checklist">
          <ul className="text-zinc-700 text-sm p-5 space-y-2">
            {[
              "Add LIVEKIT_API_KEY + LIVEKIT_API_SECRET to .env.local",
              "Add MUX_TOKEN_ID + MUX_TOKEN_SECRET to .env.local",
              "Add PUSHER_* keys to .env.local",
              "Add STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET to .env.local",
              "Configure Stripe webhook to POST /api/votes (payment_intent.succeeded)",
              "Configure Mux webhook to POST /api/mux-webhook",
              "Provision Upstash Redis on Vercel — auto-injects UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN; powers /charities persistence",
              "Replace in-memory debate store (lib/debates.ts) with Postgres/Supabase",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-zinc-400 mt-0.5">☐</span>
                {item}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function StatusPill({
  label,
  ok,
  okLabel,
  offLabel,
}: {
  label: string;
  ok: boolean;
  okLabel: string;
  offLabel: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-[10px] font-bold uppercase tracking-widest ${
        ok
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-zinc-200 bg-zinc-50 text-zinc-600"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-emerald-500" : "bg-zinc-400"}`}
      />
      {label}: {ok ? okLabel : offLabel}
    </span>
  );
}
