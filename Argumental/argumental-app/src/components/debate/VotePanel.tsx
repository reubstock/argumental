"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { getPusherClient, debateChannel, VOTE_EVENT } from "@/lib/pusher";
import { Debate, LiveVoteUpdate } from "@/lib/types";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormProps {
  debateId: string;
  votedFor: "A" | "B";
  onSuccess: () => void;
}

function CheckoutForm({ debateId, votedFor, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/debates/${debateId}?voted=${votedFor}`,
      },
    });

    if (submitError) {
      setError(submitError.message ?? "Payment failed");
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading || !stripe}
        className="bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-300 disabled:opacity-50 transition"
      >
        {loading ? "Processing..." : "Cast Vote — $5"}
      </button>
    </form>
  );
}

interface Props {
  debate: Debate;
}

export default function VotePanel({ debate }: Props) {
  const [votesA, setVotesA] = useState(debate.votesA);
  const [votesB, setVotesB] = useState(debate.votesB);
  const [selecting, setSelecting] = useState<"A" | "B" | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const total = votesA + votesB;

  // Subscribe to live vote updates via Pusher
  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe(debateChannel(debate.id));
    channel.bind(VOTE_EVENT, (data: LiveVoteUpdate) => {
      setVotesA(data.votesA);
      setVotesB(data.votesB);
    });
    return () => {
      channel.unbind_all();
      pusher.unsubscribe(debateChannel(debate.id));
    };
  }, [debate.id]);

  const handleSelectSide = async (side: "A" | "B") => {
    setSelecting(side);
    const res = await fetch("/api/votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ debateId: debate.id, votedFor: side }),
    });
    const { clientSecret } = await res.json();
    setClientSecret(clientSecret);
  };

  const pctA = total === 0 ? 50 : Math.round((votesA / total) * 100);
  const pctB = 100 - pctA;

  if (hasVoted) {
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 text-center">
        <p className="text-yellow-400 font-bold text-lg">Vote cast!</p>
        <p className="text-zinc-400 text-sm mt-1">Results update live below.</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 flex flex-col gap-5">
      <h3 className="text-white font-bold text-lg text-center">Cast Your Vote — $5</h3>

      {/* Live vote bar */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-sm font-semibold">
          <span className="text-blue-400">{debate.debaterA.name} {pctA}%</span>
          <span className="text-red-400">{pctB}% {debate.debaterB.name}</span>
        </div>
        <div className="w-full h-3 rounded-full overflow-hidden bg-red-500">
          <div
            className="h-full bg-blue-500 transition-all duration-700"
            style={{ width: `${pctA}%` }}
          />
        </div>
        <p className="text-center text-zinc-500 text-xs">{total} votes cast</p>
      </div>

      {!clientSecret ? (
        <div className="flex gap-3">
          <button
            onClick={() => handleSelectSide("A")}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition"
          >
            {debate.debaterA.name}
          </button>
          <button
            onClick={() => handleSelectSide("B")}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition"
          >
            {debate.debaterB.name}
          </button>
        </div>
      ) : (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm
            debateId={debate.id}
            votedFor={selecting!}
            onSuccess={() => setHasVoted(true)}
          />
        </Elements>
      )}

      <p className="text-zinc-500 text-xs text-center">
        1 vote per viewer · 10% of proceeds go to the winner&apos;s chosen charity
      </p>
    </div>
  );
}
