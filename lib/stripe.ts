import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set — add it to .env.local and Vercel environment variables");
    }
    _stripe = new Stripe(key, {
      apiVersion: "2026-03-25.dahlia",
    });
  }
  return _stripe;
}

export const PLANS: Record<string, {
  name: string;
  tagline: string;
  monthly_price_cents: number;
  yearly_price_cents: number;
  features: string[];
  highlight?: boolean;
}> = {
  starter: {
    name: "Starter",
    tagline: "Replace paper loyalty cards",
    monthly_price_cents: 4900,
    yearly_price_cents: 47000,
    features: [
      "1 location",
      "Digital loyalty card (Apple & Google Wallet)",
      "QR code for in-store",
      "Up to 150 customers",
      "Basic customer capture",
    ],
  },
  growth: {
    name: "Growth",
    tagline: "Bring customers back automatically",
    monthly_price_cents: 7900,
    yearly_price_cents: 76000,
    highlight: true,
    features: [
      "1 location",
      "Digital loyalty card",
      "QR code",
      "Up to 10 push campaigns/month",
      "Basic analytics",
      "Up to 500 customers",
    ],
  },
  pro: {
    name: "Pro",
    tagline: "Maximize customer retention",
    monthly_price_cents: 12900,
    yearly_price_cents: 124000,
    features: [
      "1 location",
      "Digital loyalty card",
      "QR code",
      "Unlimited push campaigns",
      "Advanced analytics",
      "Unlimited customers",
      "Priority support",
    ],
  },
  enterprise: {
    name: "Enterprise",
    tagline: "For multi-location & scaling businesses",
    monthly_price_cents: 0,
    yearly_price_cents: 0,
    features: [
      "Multiple locations",
      "Centralized dashboard (multi-store)",
      "Unlimited customers",
      "Unlimited push campaigns",
      "Advanced analytics (per location + global)",
      "Custom branding",
      "Dedicated support",
    ],
  },
};
