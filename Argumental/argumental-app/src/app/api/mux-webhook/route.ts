import { NextRequest, NextResponse } from "next/server";
import { getAllDebates, updateDebate } from "@/lib/debates";

/**
 * POST /api/mux-webhook
 *
 * Mux fires events as the live stream changes state. We match by
 * `muxLiveStreamId` on the debate and flip `status` accordingly so the
 * bout page goes live (and ends) without operator intervention.
 *
 * Configure in the Mux dashboard → Settings → Webhooks → Create:
 *   URL:    https://argumental.vercel.app/api/mux-webhook
 *   Events: video.live_stream.active
 *           video.live_stream.idle
 *           video.live_stream.disconnected (optional, for logs)
 *
 * TODO: verify the Mux-Signature header against MUX_WEBHOOK_SIGNING_SECRET
 * before trusting the payload. See https://docs.mux.com/core/listen-for-webhooks
 *
 * PERSISTENCE NOTE: `lib/debates.ts` is in-memory per-instance, so this
 * lookup will only succeed if the webhook lands on the same Vercel
 * serverless instance that created the stream (rare). Swap to Upstash
 * Redis to make this reliable across instances.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = body as { type?: string; data?: { id?: string } };
  const type = event.type;
  const streamId = event.data?.id;

  if (!type || !streamId) {
    return NextResponse.json({ received: true });
  }

  const debate = getAllDebates().find((d) => d.muxLiveStreamId === streamId);
  if (!debate) {
    console.log(`[mux-webhook] No debate matched stream ${streamId} (type=${type})`);
    return NextResponse.json({ received: true, matched: false });
  }

  switch (type) {
    case "video.live_stream.active":
      updateDebate(debate.id, { status: "live" });
      console.log(`[mux-webhook] ${debate.id} → live`);
      break;

    case "video.live_stream.idle":
      // Stream ended cleanly. Mark the bout finished — vote tallies
      // are already on the debate, so the page flips to results view.
      updateDebate(debate.id, { status: "finished" });
      console.log(`[mux-webhook] ${debate.id} → finished`);
      break;

    case "video.live_stream.disconnected":
      // Operator's encoder dropped — Mux waits `reconnect_window`s
      // before emitting `idle`. Don't change status here; just log.
      console.log(`[mux-webhook] ${debate.id} disconnected (waiting for reconnect)`);
      break;

    default:
      console.log(`[mux-webhook] unhandled event ${type} for ${debate.id}`);
  }

  return NextResponse.json({ received: true, matched: true });
}
