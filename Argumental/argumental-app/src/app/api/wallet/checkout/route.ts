import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

/**
 * POST /api/wallet/checkout
 * Body: { amount: number } — one of [10, 25, 50, 100]
 *
 * Creates a Stripe Checkout Session for a wallet preload and returns the
 * hosted-checkout URL. The browser is then redirected; on success Stripe
 * sends the user back to /wallet?status=success, on cancel to
 * /wallet?status=cancelled.
 *
 * The actual wallet-balance bookkeeping happens on the
 * `checkout.session.completed` webhook (TODO: wire that up — placeholder
 * lives in /api/mux-webhook today; we'll add /api/stripe-webhook with
 * the same dispatcher pattern when wallet ledger is real).
 */
const ALLOWED_AMOUNTS = [10, 25, 50, 100] as const;
const PRELOAD_MAX = 100;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const raw = (body as { amount?: unknown })?.amount;
  const amount = Number(raw);
  if (!Number.isFinite(amount) || amount < 1 || amount > PRELOAD_MAX) {
    return NextResponse.json(
      { error: `Amount must be between $1 and $${PRELOAD_MAX}` },
      { status: 400 },
    );
  }
  if (!ALLOWED_AMOUNTS.includes(amount as (typeof ALLOWED_AMOUNTS)[number])) {
    return NextResponse.json(
      { error: `Amount must be one of ${ALLOWED_AMOUNTS.join(", ")}` },
      { status: 400 },
    );
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY." },
      { status: 500 },
    );
  }

  const stripe = getStripe();
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "https://argumental.vercel.app";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Argumental Wallet · $${amount}`,
              description:
                "Pre-loaded vote credit. $5 per vote · $10 weekly cap. Unspent balance rolls forward.",
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        kind: "wallet_load",
        amount_usd: String(amount),
      },
      success_url: `${baseUrl}/wallet?status=success&amount=${amount}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/wallet?status=cancelled`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL" },
        { status: 502 },
      );
    }
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[wallet/checkout] Stripe error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to create checkout session",
      },
      { status: 500 },
    );
  }
}
