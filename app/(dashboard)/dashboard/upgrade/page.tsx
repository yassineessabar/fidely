"use client";

import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Starter",
    price: "Free",
    priceNote: null,
    badge: "Current Plan",
    badgeColor: "rgb(16,185,129)",
    badgeBg: "rgba(16,185,129,0.1)",
    elevated: false,
    features: [
      "1 loyalty card",
      "Up to 100 members",
      "Basic analytics",
      "QR code scanning",
      "Email support",
    ],
    cta: "Current Plan",
    ctaStyle: "disabled" as const,
  },
  {
    name: "Growth",
    price: "$49",
    priceNote: "or $39/mo yearly",
    badge: "Recommended",
    badgeColor: "rgba(10,10,10,0.9)",
    badgeBg: "rgba(10,10,10,0.06)",
    elevated: true,
    features: [
      "Unlimited cards",
      "Unlimited members",
      "Advanced analytics",
      "Push notifications",
      "Birthday campaigns",
      "Location alerts",
      "Priority support",
    ],
    cta: "Start Free Trial",
    ctaStyle: "primary" as const,
  },
  {
    name: "Enterprise",
    price: "Custom",
    priceNote: null,
    badge: "Contact us",
    badgeColor: "rgba(10,10,10,0.45)",
    badgeBg: "rgba(10,10,10,0.06)",
    elevated: false,
    features: [
      "Everything in Growth",
      "Custom branding",
      "API access",
      "Dedicated account manager",
      "SLA guarantee",
      "White-label option",
    ],
    cta: "Contact Us",
    ctaStyle: "outline" as const,
  },
];

function CheckIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgb(16,185,129)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function UpgradePage() {
  const router = useRouter();
  return (
    <div>
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 40,
          maxWidth: 520,
          margin: "0 auto 40px",
        }}
      >
        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "rgba(10,10,10,0.9)",
            margin: "0 0 10px",
            lineHeight: 1.25,
          }}
        >
          Choose the right plan for your business
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "rgba(10,10,10,0.5)",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          All plans include Apple &amp; Google Wallet integration
        </p>
      </div>

      {/* Plan Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
          alignItems: "start",
        }}
      >
        {plans.map((plan) => (
          <div
            key={plan.name}
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              border: `1px solid ${plan.elevated ? "rgba(108,71,255,0.18)" : "rgba(10,10,10,0.06)"}`,
              padding: 28,
              boxShadow: plan.elevated
                ? "0 8px 32px rgba(108,71,255,0.12)"
                : "none",
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            {/* Plan header */}
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "rgba(10,10,10,0.9)",
                  }}
                >
                  {plan.name}
                </span>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: 99,
                    fontSize: 11,
                    fontWeight: 600,
                    backgroundColor: plan.badgeBg,
                    color: plan.badgeColor,
                    letterSpacing: "0.02em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {plan.badge}
                </span>
              </div>

              {/* Price */}
              <div>
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 800,
                    color: "rgba(10,10,10,0.9)",
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  {plan.price}
                  {plan.price !== "Free" && plan.price !== "Custom" && (
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: "rgba(10,10,10,0.4)",
                      }}
                    >
                      /mo
                    </span>
                  )}
                </div>
                {plan.priceNote && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(10,10,10,0.4)",
                      marginTop: 2,
                    }}
                  >
                    {plan.priceNote}
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                height: 1,
                backgroundColor: "rgba(10,10,10,0.06)",
                marginBottom: 20,
              }}
            />

            {/* Features */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 28,
                flex: 1,
              }}
            >
              {plan.features.map((feature) => (
                <div
                  key={feature}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                    color: "rgba(10,10,10,0.75)",
                  }}
                >
                  <CheckIcon />
                  {feature}
                </div>
              ))}
            </div>

            {/* CTA */}
            {plan.ctaStyle === "disabled" && (
              <button
                disabled
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: 12,
                  border: "none",
                  backgroundColor: "rgba(10,10,10,0.06)",
                  color: "rgba(10,10,10,0.35)",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "not-allowed",
                }}
              >
                {plan.cta}
              </button>
            )}

            {plan.ctaStyle === "primary" && (
              <button
                onClick={() => router.push("/dashboard/billing?plan=growth")}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: 12,
                  border: "none",
                  backgroundColor: "#0a0a0a",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {plan.cta}
              </button>
            )}

            {plan.ctaStyle === "outline" && (
              <a
                href="mailto:hello@wearekyro.com?subject=Enterprise Plan Inquiry"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px",
                  borderRadius: 12,
                  border: "1.5px solid rgba(10,10,10,0.15)",
                  backgroundColor: "transparent",
                  color: "rgba(10,10,10,0.8)",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "center",
                  textDecoration: "none",
                  boxSizing: "border-box",
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
