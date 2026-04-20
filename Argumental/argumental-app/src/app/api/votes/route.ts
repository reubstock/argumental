import { NextRequest, NextResponse } from "next/server";
import { getStripe, VOTE_PRICE_CENTS } from "@/lib/stripe";
import { getPusherServer, debateChannel, VOTE_EVENT } from "@/lib/pusher";
import { incrementVote } from "@/lib/debates";

// Step 1: Create a Stripe PaymentIntent for a $5 vote
export async function POST(req: NextRequest) {
  const { debateId, votedFor } = await req.json();

  if (!debateId || !["A", "B"].includes(votedFor)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const paymentIntent = await getStripe().paymentIntents.create({
    amount: VOTE_PRICE_CENTS,
    currency: "usd",
    metadata: { debateId, votedFor },
    automatic_payment_methods: { enabled: true },
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}

// Step 2: Stripe webhook confirms payment → record vote + push live update
export async function PUT(req: NextRequest) {
  const { debateId, votedFor } = await req.json();
  // Called internally after Stripe webhook confirms payment
  const updated = incrementVote(debateId, votedFor as "A" | "B");
  if (!updated) return NextResponse.json({ error: "Debate not found" }, { status: 404 });

  await getPusherServer().trigger(debateChannel(debateId), VOTE_EVENT, {
    votesA: updated.votesA,
    votesB: updated.votesB,
    total: updated.votesA + updated.votesB,
  });

  return NextResponse.json({ votesA: updated.votesA, votesB: updated.votesB });
}
