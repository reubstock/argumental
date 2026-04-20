import { NextRequest, NextResponse } from "next/server";
import { createDebaterToken } from "@/lib/livekit";

export async function POST(req: NextRequest) {
  const { debateId, participantName, isDebater } = await req.json();

  if (!debateId || !participantName) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const token = await createDebaterToken(
    `debate-${debateId}`,
    participantName,
    Boolean(isDebater)
  );

  return NextResponse.json({ token });
}
