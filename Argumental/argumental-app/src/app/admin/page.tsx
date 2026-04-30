import { getAllDebates } from "@/lib/debates";
import Link from "next/link";

export default function AdminPage() {
  const debates = getAllDebates();

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-white">Admin</h1>
          <p className="text-zinc-400 mt-1">Manage debates and monitor live bouts.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {debates.map((debate) => (
          <div
            key={debate.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span
                  className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
                    debate.status === "live"
                      ? "bg-brand-red text-white"
                      : debate.status === "upcoming"
                      ? "bg-white/10 text-white"
                      : "bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {debate.status}
                </span>
                <span className="text-zinc-500 text-xs">ID: {debate.id}</span>
              </div>
              <h2 className="text-white font-bold text-lg">{debate.title}</h2>
              <p className="text-zinc-400 text-sm">
                {debate.debaterA.name} vs {debate.debaterB.name} ·{" "}
                {debate.votesA + debate.votesB} total votes
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/debates/${debate.id}`}
                className="text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-4 py-2 rounded-lg transition"
              >
                View
              </Link>
              <Link
                href={`/debates/${debate.id}/studio?role=moderator&name=Admin`}
                className="text-sm text-white bg-white/10 hover:bg-white/20 border border-white/30 px-4 py-2 rounded-lg transition"
              >
                Studio
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-3">Integration Checklist</h3>
        <ul className="text-zinc-400 text-sm space-y-2">
          {[
            "Add LIVEKIT_API_KEY + LIVEKIT_API_SECRET to .env.local",
            "Add MUX_TOKEN_ID + MUX_TOKEN_SECRET to .env.local",
            "Add PUSHER_* keys to .env.local",
            "Add STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET to .env.local",
            "Configure Stripe webhook to POST /api/votes (payment_intent.succeeded)",
            "Configure Mux webhook to POST /api/mux-webhook",
            "Replace in-memory debate store (lib/debates.ts) with Postgres/Supabase",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-zinc-600 mt-0.5">☐</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
