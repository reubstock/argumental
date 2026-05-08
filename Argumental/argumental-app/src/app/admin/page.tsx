import { getAllDebates } from "@/lib/debates";
import { hasPersistentStorage } from "@/lib/charities";
import Link from "next/link";
import Panel from "@/components/Panel";
import CreateStreamButton from "@/components/admin/CreateStreamButton";

export const dynamic = "force-dynamic";

function envOk(...keys: string[]): boolean {
  return keys.every((k) => !!process.env[k]);
}

export default function AdminPage() {
  const debates = getAllDebates();

  // System status — each integration is a row of clear, user-facing prose.
  const integrations: {
    label: string;
    ok: boolean;
    okLabel: string;
    offLabel: string;
    detail: string;
  }[] = [
    {
      label: "Charity DB",
      ok: hasPersistentStorage(),
      okLabel: "Connected",
      offLabel: "In-memory",
      detail:
        "Persists charities added through the UI across deploys. Connect Upstash Redis on Vercel → Storage tab.",
    },
    {
      label: "Live Stream",
      ok: envOk("MUX_TOKEN_ID", "MUX_TOKEN_SECRET"),
      okLabel: "Connected",
      offLabel: "Not configured",
      detail:
        "Streams the live debate video via Mux. Add MUX_TOKEN_ID + MUX_TOKEN_SECRET.",
    },
    {
      label: "Real-time Voting",
      ok: envOk("PUSHER_APP_ID", "PUSHER_KEY", "PUSHER_SECRET"),
      okLabel: "Connected",
      offLabel: "Not configured",
      detail:
        "Broadcasts vote tallies to viewers as they update. Add PUSHER_APP_ID + PUSHER_KEY + PUSHER_SECRET + PUSHER_CLUSTER.",
    },
    {
      label: "Payments",
      ok: envOk("STRIPE_SECRET_KEY"),
      okLabel: "Connected",
      offLabel: "Not configured",
      detail:
        "Processes the $5 vote charges via Stripe. Add STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET, then point a Stripe webhook at /api/votes.",
    },
    {
      label: "Studio",
      ok: envOk("LIVEKIT_API_KEY", "LIVEKIT_API_SECRET"),
      okLabel: "Connected",
      offLabel: "Not configured",
      detail:
        "Hosts the debater video room via LiveKit. Add LIVEKIT_API_KEY + LIVEKIT_API_SECRET.",
    },
  ];

  const allOk = integrations.every((i) => i.ok);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-14 w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
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
        <StatusPill
          label="System"
          ok={allOk}
          okLabel="All connected"
          offLabel={`${integrations.filter((i) => !i.ok).length} pending`}
        />
      </div>

      {/* System status panel */}
      <div className="mb-8">
        <Panel label="System Status">
          <ul className="divide-y divide-zinc-200">
            {integrations.map((i) => (
              <li
                key={i.label}
                className="px-4 py-3 flex items-start justify-between gap-4 flex-wrap"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-zinc-900 font-bold text-sm">{i.label}</p>
                  <p className="text-zinc-500 text-xs mt-0.5 leading-snug">
                    {i.detail}
                  </p>
                </div>
                <StatusPill
                  label=""
                  ok={i.ok}
                  okLabel={i.okLabel}
                  offLabel={i.offLabel}
                />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Debates list */}
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
              <div className="flex gap-2 shrink-0 items-start">
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
                <CreateStreamButton
                  debateId={debate.id}
                  hasStream={!!debate.muxLiveStreamId}
                />
              </div>
            </div>
          </Panel>
        ))}
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
  label?: string;
  ok: boolean;
  okLabel: string;
  offLabel: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${
        ok
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-zinc-200 bg-zinc-50 text-zinc-600"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-emerald-500" : "bg-zinc-400"}`}
      />
      {label && <>{label}: </>}
      {ok ? okLabel : offLabel}
    </span>
  );
}
