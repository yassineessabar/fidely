"use client";

import { useRouter } from "next/navigation";

const plans = [
  {
    key: "starter",
    name: "Starter",
    tagline: "Replace paper loyalty cards",
    price: "$49",
    priceNote: null,
    badge: null,
    elevated: false,
    features: [
      "1 location",
      "Digital loyalty card (Apple & Google Wallet)",
      "QR code for in-store",
      "Up to 150 customers",
      "Basic customer capture",
    ],
    excluded: ["No push notifications"],
    cta: "Get Started",
    ctaStyle: "primary" as const,
  },
  {
    key: "growth",
    name: "Growth",
    tagline: "Bring customers back automatically",
    price: "$79",
    priceNote: null,
    badge: "Most Popular",
    elevated: true,
    features: [
      "1 location",
      "Digital loyalty card",
      "QR code",
      "Up to 10 push campaigns/month",
      "Basic analytics",
      "Up to 500 customers",
    ],
    excluded: [],
    cta: "Get Started",
    ctaStyle: "primary" as const,
  },
  {
    key: "pro",
    name: "Pro",
    tagline: "Maximize customer retention",
    price: "$129",
    priceNote: null,
    badge: null,
    elevated: false,
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
    cta: "Get Started",
    ctaStyle: "primary" as const,
  },
  {
    key: "enterprise",
    name: "Enterprise",
    tagline: "For multi-location & scaling businesses",
    price: "Custom",
    priceNote: null,
    badge: null,
    elevated: false,
    features: [
      "Multiple locations",
      "Centralized dashboard (multi-store)",
      "Unlimited customers",
      "Unlimited push campaigns",
      "Advanced analytics (per location + global)",
      "Custom branding",
      "Dedicated support",
    ],
    excluded: [],
    cta: "Contact Us",
    ctaStyle: "outline" as const,
  },
];

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgb(16,185,129)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(10,10,10,0.25)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export default function UpgradePage() {
  const router = useRouter();
  return (
    <div>
      <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 40px" }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "rgba(10,10,10,0.9)", margin: "0 0 10px", lineHeight: 1.25 }}>
          Choose the right plan for your business
        </h1>
        <p style={{ fontSize: 14, color: "rgba(10,10,10,0.5)", margin: 0, lineHeight: 1.6 }}>
          All plans include Apple &amp; Google Wallet integration
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, alignItems: "start" }}>
        {plans.map((plan) => (
          <div
            key={plan.key}
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              border: `1px solid ${plan.elevated ? "rgba(10,10,10,0.12)" : "rgba(10,10,10,0.06)"}`,
              padding: 24,
              boxShadow: plan.elevated ? "0 8px 32px rgba(10,10,10,0.08)" : "none",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "rgba(10,10,10,0.9)" }}>{plan.name}</span>
                {plan.badge && (
                  <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 10, fontWeight: 600, backgroundColor: "rgba(10,10,10,0.06)", color: "rgba(10,10,10,0.7)", letterSpacing: "0.02em" }}>
                    {plan.badge}
                  </span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(10,10,10,0.45)" }}>{plan.tagline}</p>
            </div>

            {/* Price */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: "rgba(10,10,10,0.9)", lineHeight: 1 }}>
                {plan.price}
              </span>
              {plan.price !== "Custom" && (
                <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(10,10,10,0.4)" }}>/mo</span>
              )}
            </div>

            <div style={{ height: 1, backgroundColor: "rgba(10,10,10,0.06)", marginBottom: 16 }} />

            {/* Features */}
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24, flex: 1 }}>
              {plan.features.map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(10,10,10,0.75)" }}>
                  <CheckIcon /> {f}
                </div>
              ))}
              {plan.excluded.map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(10,10,10,0.35)" }}>
                  <CrossIcon /> {f}
                </div>
              ))}
            </div>

            {/* CTA */}
            {plan.ctaStyle === "primary" && (
              <button
                onClick={() => router.push(`/dashboard/billing?plan=${plan.key}`)}
                style={{
                  width: "100%", padding: "12px", borderRadius: 12, border: "none",
                  backgroundColor: "#0a0a0a", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {plan.cta}
              </button>
            )}
            {plan.ctaStyle === "outline" && (
              <a
                href="mailto:hello@wearekyro.com?subject=Enterprise Plan Inquiry"
                style={{
                  display: "block", width: "100%", padding: "12px", borderRadius: 12,
                  border: "1.5px solid rgba(10,10,10,0.15)", backgroundColor: "transparent",
                  color: "rgba(10,10,10,0.8)", fontSize: 14, fontWeight: 600, cursor: "pointer",
                  textAlign: "center", textDecoration: "none", boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              >
                {plan.cta}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
