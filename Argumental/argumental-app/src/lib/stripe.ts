import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export const VOTE_PRICE_CENTS = 500; // $5.00
export const CHARITY_PERCENTAGE = 0.1; // 10%
