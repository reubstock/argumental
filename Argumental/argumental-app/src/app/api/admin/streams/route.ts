import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getMux, MUX_RTMP_URL, isMuxConfigured } from "@/lib/mux";
import { getDebate, updateDebate } from "@/lib/debates";

/**
 * POST /api/admin/streams
 * Body: { debateId: string }
 *
 * Creates TWO Mux live streams (one per debater) for the given debate
 * and stores both playback IDs + live-stream IDs on the debate. The
 * <PhasedDebatePlayer> on the bout page swaps between the two streams
 * automatically on the 6-minute clock.
 *
 * Returns RTMP URL + stream key for each debater. Each debater pastes
 * their stream key into their own OBS / studio software and streams
 * the entire 24 minutes — the player decides who's visible.
 *
 * SECURITY: stream keys are returned ONCE and never persisted on the
 * debate. Operator must distribute to debaters now or roll fresh keys
 * in the Mux dashboard.
 *
 * PERSISTENCE NOTE: lib/debates.ts is in-memory per-instance. The IDs
 * stored here may not be visible to the webhook handler or bout page
 * if those land on a different Vercel serverless instance. Swap to
 * Upstash Redis to fix.
 *
 * TODO: lock this route behind admin auth.
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

  if (debate.muxLiveStreamIdA || debate.muxLiveStreamIdB || debate.muxLiveStreamId) {
    return NextResponse.json(
      {
        error:
          "Live streams already exist for this debate. Roll the stream keys in the Mux dashboard if you need fresh ones.",
        existingPlaybackIdA: debate.muxPlaybackIdA,
        existingPlaybackIdB: debate.muxPlaybackIdB,
      },
      { status: 409 },
    );
  }

  try {
    const mux = getMux();

    // Create both streams in parallel.
    const [streamA, streamB] = await Promise.all([
      mux.video.liveStreams.create({
        playback_policy: ["public"],
        new_asset_settings: { playback_policy: ["public"] },
        latency_mode: "low",
        reconnect_window: 60,
      }),
      mux.video.liveStreams.create({
        playback_policy: ["public"],
        new_asset_settings: { playback_policy: ["public"] },
        latency_mode: "low",
        reconnect_window: 60,
      }),
    ]);

    const playbackIdA = streamA.playback_ids?.[0]?.id;
    const playbackIdB = streamB.playback_ids?.[0]?.id;
    if (!streamA.id || !playbackIdA || !streamB.id || !playbackIdB) {
      return NextResponse.json(
        { error: "Mux did not return expected stream IDs" },
        { status: 502 },
      );
    }

    updateDebate(debateId, {
      muxLiveStreamIdA: streamA.id,
      muxPlaybackIdA: playbackIdA,
      muxLiveStreamIdB: streamB.id,
      muxPlaybackIdB: playbackIdB,
    });

    revalidatePath(`/debates/${debateId}`);
    revalidatePath("/admin");

    return NextResponse.json({
      rtmpUrl: MUX_RTMP_URL,
      a: {
        debaterName: debate.debaterA.name,
        streamId: streamA.id,
        playbackId: playbackIdA,
        streamKey: streamA.stream_key,
      },
      b: {
        debaterName: debate.debaterB.name,
        streamId: streamB.id,
        playbackId: playbackIdB,
        streamKey: streamB.stream_key,
      },
    });
  } catch (err) {
    console.error("[admin/streams] Mux error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to create live streams",
      },
      { status: 500 },
    );
  }
}
