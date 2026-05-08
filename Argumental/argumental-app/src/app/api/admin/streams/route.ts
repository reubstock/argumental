import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getMux, MUX_RTMP_URL, isMuxConfigured } from "@/lib/mux";
import { getDebate, updateDebate } from "@/lib/debates";

/**
 * POST /api/admin/streams
 * Body: { debateId: string }
 *
 * Creates a Mux live stream for the given debate, stores the live-stream
 * ID + playback ID on the debate (so the bout page renders MuxPlayer
 * once the operator goes live), and returns the RTMP URL + stream key
 * for the operator to paste into OBS / studio software.
 *
 * SECURITY NOTE: stream_key is a secret. We return it ONCE at creation
 * time and do NOT persist it on the debate. The operator must copy it
 * to OBS now or roll a new stream key in the Mux dashboard later.
 *
 * PERSISTENCE NOTE: `lib/debates.ts` is in-memory and per-instance on
 * Vercel — meaning the muxLiveStreamId stored here won't be visible
 * to other serverless instances (incl. the webhook handler and the
 * /debates/[id] page). To make this real, swap the Map in lib/debates.ts
 * for an Upstash Redis store (same pattern as lib/charities.ts).
 *
 * TODO: lock this route to authenticated admins. Today anyone who hits
 * the URL can spin up a Mux stream (and run up your bill).
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const debateId = (body as { debateId?: unknown })?.debateId;
  if (typeof debateId !== "string" || !debateId.trim()) {
    return NextResponse.json(
      { error: "debateId (string) is required" },
      { status: 400 },
    );
  }

  const debate = getDebate(debateId);
  if (!debate) {
    return NextResponse.json({ error: "Debate not found" }, { status: 404 });
  }

  if (!isMuxConfigured()) {
    return NextResponse.json(
      { error: "Mux is not configured. Set MUX_TOKEN_ID and MUX_TOKEN_SECRET." },
      { status: 500 },
    );
  }

  if (debate.muxLiveStreamId) {
    return NextResponse.json(
      {
        error:
          "A live stream already exists for this debate. Roll the stream key in the Mux dashboard if you need a fresh one.",
        existingStreamId: debate.muxLiveStreamId,
        existingPlaybackId: debate.muxPlaybackId,
      },
      { status: 409 },
    );
  }

  try {
    const mux = getMux();
    const stream = await mux.video.liveStreams.create({
      playback_policy: ["public"],
      // The auto-recorded asset (created when the stream ends) gets the
      // same public playback policy so the on-demand replay works.
      new_asset_settings: { playback_policy: ["public"] },
      // "low" = ~5s glass-to-glass on Mux. "standard" is cheaper but
      // slower — switch later if cost matters more than latency.
      latency_mode: "low",
      // Allow up to 60s of disconnection before the stream is considered
      // ended (matches Mux default; explicit for clarity).
      reconnect_window: 60,
    });

    const playbackId = stream.playback_ids?.[0]?.id;
    if (!playbackId || !stream.id) {
      return NextResponse.json(
        { error: "Mux did not return expected stream IDs" },
        { status: 502 },
      );
    }

    updateDebate(debateId, {
      muxLiveStreamId: stream.id,
      muxPlaybackId: playbackId,
    });

    // Re-render pages that depend on the new IDs.
    revalidatePath(`/debates/${debateId}`);
    revalidatePath("/admin");

    return NextResponse.json({
      streamId: stream.id,
      playbackId,
      streamKey: stream.stream_key, // SECRET — show once, do not log.
      rtmpUrl: MUX_RTMP_URL,
    });
  } catch (err) {
    console.error("[admin/streams] Mux error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to create live stream",
      },
      { status: 500 },
    );
  }
}
