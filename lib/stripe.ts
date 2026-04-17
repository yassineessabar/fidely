import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-03-25.dahlia",
    });
  }
  return _stripe;
}

export const PLANS: Record<string, {
  name: string;
  monthly_price_cents: number;
  yearly_price_cents: number;
  features: string[];
}> = {
  free: {
    name: "Starter",
    monthly_price_cents: 0,
    yearly_price_cents: 0,
    features: ["1 loyalty card", "Up to 100 members", "Basic analytics", "QR code scanning", "Email support"],
  },
  growth: {
    name: "Growth",
    monthly_price_cents: 4900,
    yearly_price_cents: 46800,
    features: ["Unlimited cards", "Unlimited members", "Advanced analytics", "Push notifications", "Birthday campaigns", "Location alerts", "Priority support"],
  },
  enterprise: {
    name: "Enterprise",
    monthly_price_cents: 0, // custom pricing
    yearly_price_cents: 0,
    features: ["Everything in Growth", "Custom branding", "API access", "Dedicated account manager", "SLA guarantee", "White-label option"],
  },
};
