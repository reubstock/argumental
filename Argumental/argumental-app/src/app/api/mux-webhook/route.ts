import { NextRequest, NextResponse } from "next/server";
import { getAllDebates, updateDebate } from "@/lib/debates";

/**
 * POST /api/mux-webhook
 *
 * Mux fires events as live streams change state. We match incoming
 * events against either side's stream ID (dual-stream mode) or the
 * legacy single-stream ID, and update the debate accordingly.
 *
 * Phase clock: when the FIRST of the two streams goes active, we set
 * `liveStartedAt = now` and flip status → "live". The PhasedDebatePlayer
 * on the bout page anchors the 24-minute clock to that timestamp.
 *
 * Configure in Mux dashboard → Settings → Webhooks → Create:
 *   URL:    https://argumental.vercel.app/api/mux-webhook
 *   Events: video.live_stream.active
 *           video.live_stream.idle
 *           video.live_stream.disconnected (optional, logs only)
 *
 * TODO: verify the Mux-Signature header against MUX_WEBHOOK_SIGNING_SECRET.
 *
 * PERSISTENCE NOTE: lib/debates.ts is in-memory per-instance. This
 * lookup will only succeed when the webhook lands on the same Vercel
 * instance that holds the debate state. Swap to Upstash Redis.
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

  const debate = getAllDebates().find(
    (d) =>
      d.muxLiveStreamIdA === streamId ||
      d.muxLiveStreamIdB === streamId ||
      d.muxLiveStreamId === streamId,
  );
  if (!debate) {
    console.log(`[mux-webhook] No debate matched stream ${streamId} (type=${type})`);
    return NextResponse.json({ received: true, matched: false });
  }

  switch (type) {
    case "video.live_stream.active": {
      // First stream to go active anchors the phase clock.
      const patch: Partial<typeof debate> = { status: "live" };
      if (!debate.liveStartedAt) {
        patch.liveStartedAt = new Date().toISOString();
        console.log(`[mux-webhook] ${debate.id} → live · clock anchored`);
      } else {
        console.log(`[mux-webhook] ${debate.id} second stream active`);
      }
      updateDebate(debate.id, patch);
      break;
    }

    case "video.live_stream.idle": {
      // For dual-stream bouts, don't end the bout just because one
      // speaker's encoder went idle — they may be off-phase. Let the
      // 24-minute clock decide. For legacy single-stream bouts, idle
      // is the end signal.
      const isDualStream = !!(
        debate.muxLiveStreamIdA && debate.muxLiveStreamIdB
      );
      if (isDualStream) {
        console.log(`[mux-webhook] ${debate.id} stream ${streamId} idle (clock decides end)`);
      } else {
        updateDebate(debate.id, { status: "finished" });
        console.log(`[mux-webhook] ${debate.id} → finished (legacy single-stream idle)`);
      }
      break;
    }

    case "video.live_stream.disconnected":
      console.log(`[mux-webhook] ${debate.id} stream ${streamId} disconnected (waiting for reconnect)`);
      break;

    default:
      console.log(`[mux-webhook] unhandled event ${type} for ${debate.id}`);
  }

  return NextResponse.json({ received: true, matched: true });
}
