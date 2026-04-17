"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const plans = [
  {
    key: "starter",
    name: "Starter",
    tagline: "Replace paper loyalty cards",
    price: 49,
    features: [
      "1 location",
      "Digital loyalty card (Apple & Google Wallet)",
      "QR code for in-store",
      "Up to 150 customers",
      "Basic customer capture",
    ],
    excluded: ["No push notifications"],
    highlight: false,
  },
  {
    key: "growth",
    name: "Growth",
    tagline: "Bring customers back automatically",
    price: 79,
    badge: "Most Popular",
    features: [
      "1 location",
      "Digital loyalty card",
      "QR code",
      "Up to 10 push campaigns/month",
      "Basic analytics",
      "Up to 500 customers",
    ],
    excluded: [],
    highlight: true,
  },
  {
    key: "pro",
    name: "Pro",
    tagline: "Maximize customer retention",
    price: 129,
    features: [
      "1 location",
      "Digital loyalty card",
      "QR code",
      "Unlimited push campaigns",
      "Advanced analytics",
      "Unlimited customers",
      "Priority support",
    ],
    excluded: [],
    highlight: false,
  },
];

const faqs = [
  { q: "Can I change my plan later?", a: "Yes, you can upgrade or downgrade at any time. Changes take effect immediately and we'll prorate the difference." },
  { q: "Is there a free trial?", a: "Yes, all paid plans include a 14-day free trial. No credit card required to start." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, Mastercard, Amex) through our secure payment partner Stripe." },
  { q: "Can I cancel anytime?", a: "Absolutely. You can cancel your subscription at any time from the billing page. No cancellation fees." },
  { q: "Do you offer annual billing?", a: "Yes, save up to 20% with annual billing. You can select monthly or yearly on the checkout page." },
];

export default function UpgradePage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "rgba(10,10,10,0.85)", margin: "0 0 8px", lineHeight: 1.3 }}>
          Choose the right plan for your business
        </h1>
        <p style={{ fontSize: 14, color: "rgba(10,10,10,0.4)", margin: 0 }}>
          All plans include Apple &amp; Google Wallet integration
        </p>
      </div>

      {/* Plan cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16, marginBottom: 32 }}>
        {plans.map((plan) => (
          <div
            key={plan.key}
            style={{
              backgroundColor: plan.highlight ? "#0a0a0a" : "white",
              borderRadius: 20,
              border: plan.highlight ? "none" : "1px solid rgba(10,10,10,0.06)",
              padding: 28,
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {plan.badge && (
              <div style={{
                position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                backgroundColor: "#f59e0b", color: "white",
                padding: "5px 14px", borderRadius: 99, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
              }}>
                {plan.badge}
              </div>
            )}

            <div style={{ fontSize: 15, fontWeight: 700, color: plan.highlight ? "white" : "rgba(10,10,10,0.85)", marginBottom: 2 }}>
              {plan.name}
            </div>
            <div style={{ fontSize: 12, color: plan.highlight ? "rgba(255,255,255,0.45)" : "rgba(10,10,10,0.4)", marginBottom: 16 }}>
              {plan.tagline}
            </div>

            {/* Price */}
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 36, fontWeight: 800, color: plan.highlight ? "white" : "rgba(10,10,10,0.9)", lineHeight: 1 }}>
                ${plan.price}
              </span>
              <span style={{ fontSize: 14, fontWeight: 400, color: plan.highlight ? "rgba(255,255,255,0.4)" : "rgba(10,10,10,0.4)" }}>/mo</span>
            </div>

            {/* CTA button right below price */}
            <button
              onClick={() => router.push(`/dashboard/billing?plan=${plan.key}`)}
              style={{
                width: "100%", padding: "11px", borderRadius: 10, border: "none",
                backgroundColor: plan.highlight ? "white" : "#0a0a0a",
                color: plan.highlight ? "#0a0a0a" : "white",
                fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                marginBottom: 20,
              }}
            >
              Get Started
            </button>

            <div style={{ height: 1, backgroundColor: plan.highlight ? "rgba(255,255,255,0.1)" : "rgba(10,10,10,0.06)", marginBottom: 18 }} />

            {/* Features */}
            <div style={{ display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
              {plan.features.map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: plan.highlight ? "rgba(255,255,255,0.7)" : "rgba(10,10,10,0.7)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={plan.highlight ? "rgb(16,185,129)" : "rgb(16,185,129)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {f}
                </div>
              ))}
              {plan.excluded.map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: plan.highlight ? "rgba(255,255,255,0.25)" : "rgba(10,10,10,0.3)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={plan.highlight ? "rgba(255,255,255,0.25)" : "rgba(10,10,10,0.25)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                  {f}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Enterprise panel */}
      <div style={{
        background: "linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(71,85,105,0.06) 100%)",
        borderRadius: 20, padding: 32, marginBottom: 40,
        border: "1px solid rgba(10,10,10,0.05)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 24 }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "rgba(10,10,10,0.85)", marginBottom: 4 }}>Enterprise</div>
            <div style={{ fontSize: 13, color: "rgba(10,10,10,0.5)", marginBottom: 16, lineHeight: 1.5 }}>
              For multi-location and scaling businesses. Custom pricing, dedicated support, and advanced features.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px" }}>
              {[
                "Multiple locations",
                "Centralized dashboard",
                "Unlimited customers",
                "Unlimited campaigns",
                "Custom branding",
                "Dedicated support",
              ].map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(10,10,10,0.65)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgb(16,185,129)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {f}
                </div>
              ))}
            </div>
          </div>
          <a
            href="mailto:hello@wearekyro.com?subject=Enterprise Plan Inquiry"
            style={{
              padding: "11px 28px", borderRadius: 10,
              backgroundColor: "#0a0a0a", color: "white",
              fontSize: 13, fontWeight: 600, textDecoration: "none",
              alignSelf: "center",
            }}
          >
            Contact Us
          </a>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "rgba(10,10,10,0.85)", marginBottom: 4 }}>Frequently asked questions</h2>
        <p style={{ fontSize: 13, color: "rgba(10,10,10,0.4)", marginBottom: 20 }}>Everything you need to know about our plans</p>

        <div style={{ borderTop: "1px solid rgba(10,10,10,0.06)" }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: "1px solid rgba(10,10,10,0.06)" }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "16px 0", border: "none", backgroundColor: "transparent",
                  cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(10,10,10,0.8)" }}>{faq.q}</span>
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="rgba(10,10,10,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ flexShrink: 0, transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {openFaq === i && (
                <div style={{ paddingBottom: 16, fontSize: 13, color: "rgba(10,10,10,0.5)", lineHeight: 1.6 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
