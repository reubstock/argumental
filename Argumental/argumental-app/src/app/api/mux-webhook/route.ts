import { NextRequest, NextResponse } from "next/server";
import { updateDebate } from "@/lib/debates";

// Mux sends webhook events when stream goes live/offline
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, data } = body;

  if (type === "video.live_stream.active") {
    const streamId = data.id;
    // Find debate by streamId and mark as live — replace with DB lookup in production
    console.log("Stream went live:", streamId);
  }

  if (type === "video.live_stream.idle") {
    console.log("Stream went idle:", data.id);
  }

  return NextResponse.json({ received: true });
}
