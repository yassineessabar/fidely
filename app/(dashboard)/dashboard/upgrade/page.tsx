"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Puzzle, Users, Headphones, ShieldCheck } from "lucide-react";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 49,
    desc: "Replace paper loyalty cards",
    cta: "Subscribe to Starter",
    highlights: [
      "1 location",
      "Digital loyalty card",
      "Apple & Google Wallet",
      "QR code for in-store",
      "Up to 150 customers",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 79,
    recommended: true,
    desc: "Bring customers back automatically",
    cta: "Subscribe to Growth",
    highlights: [
      "1 location",
      "Digital loyalty card",
      "QR code",
      "Up to 10 push campaigns/month",
      "Basic analytics",
      "Up to 500 customers",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 129,
    desc: "Maximize customer retention",
    cta: "Subscribe to Pro",
    highlights: [
      "1 location",
      "Digital loyalty card",
      "QR code",
      "Unlimited push campaigns",
      "Advanced analytics",
      "Unlimited customers",
      "Priority support",
    ],
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
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 400, color: "rgba(10,10,10,0.9)", margin: 0, letterSpacing: "-0.01em" }}>
          Choose the plan that&apos;s right for you
        </h1>
      </div>

      {/* Plan cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, alignItems: "stretch", marginBottom: 32 }}>
        {plans.map((plan) => (
          <div key={plan.id} style={{ display: "flex", flexDirection: "column" }}>
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              borderRadius: 20, backgroundColor: "rgba(10,10,10,0.02)", padding: 24,
              border: "1px solid rgba(10,10,10,0.04)",
            }}>
              {/* Name + badge */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                  <span style={{ fontSize: 24, fontWeight: 400, color: "rgba(10,10,10,0.9)" }}>{plan.name}</span>
                  {plan.recommended && (
                    <span style={{
                      fontSize: 13, fontWeight: 300, padding: "4px 10px", borderRadius: 99,
                      background: "linear-gradient(90deg, #FFA67C, #FF8047)", color: "white",
                    }}>
                      Recommended
                    </span>
                  )}
                </div>
                {/* Price */}
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <span style={{ fontSize: 30, fontWeight: 500, color: "rgba(10,10,10,0.9)", lineHeight: "36px" }}>$</span>
                  <span style={{ fontSize: 30, fontWeight: 500, color: "rgba(10,10,10,0.9)", lineHeight: "36px" }}>{plan.price}</span>
                  <span style={{ fontSize: 20, fontWeight: 200, color: "rgba(10,10,10,0.25)", lineHeight: "28px" }}>/</span>
                  <span style={{ fontSize: 14, color: "rgba(10,10,10,0.25)" }}>mo</span>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, backgroundColor: "rgba(10,10,10,0.06)", margin: "0 8px 20px" }} />

              {/* Description */}
              <p style={{ fontSize: 13, color: "rgba(10,10,10,0.4)", margin: "0 0 20px", lineHeight: 1.5 }}>{plan.desc}</p>

              {/* CTA */}
              <button
                onClick={() => router.push(`/dashboard/billing?plan=${plan.id}`)}
                style={{
                  width: "100%", height: 40, borderRadius: 8, border: "none",
                  fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
                  marginBottom: 20,
                  backgroundColor: plan.recommended ? "rgba(255,99,31,0.85)" : "transparent",
                  color: plan.recommended ? "black" : "rgba(10,10,10,0.9)",
                  ...(plan.recommended ? {} : { border: "1px solid rgba(10,10,10,0.1)" }),
                }}
              >
                {plan.cta}
              </button>

              {/* Divider */}
              <div style={{ height: 1, backgroundColor: "rgba(10,10,10,0.06)", margin: "0 8px 16px" }} />

              {/* Highlights */}
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: "rgba(10,10,10,0.85)", margin: "0 0 8px" }}>Plan highlights:</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {plan.highlights.map((h) => (
                    <div key={h} style={{ display: "flex", alignItems: "center", fontSize: 14, color: "rgba(10,10,10,0.75)", fontWeight: 300 }}>
                      <Check size={16} strokeWidth={2} style={{ flexShrink: 0, color: "rgb(20,184,166)", marginRight: 12 }} />
                      {h}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enterprise banner */}
      <div style={{
        borderRadius: 20, overflow: "hidden",
        background: "linear-gradient(to top left, rgba(249,115,22,0.8), rgb(71,85,105) 40%)",
        color: "white", padding: "32px 48px", marginBottom: 32,
      }}>
        <div style={{ display: "flex", gap: 56, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: "2 1 240px" }}>
            <h3 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px" }}>Kyro for Enterprise</h3>
            <p style={{ fontSize: 14, fontWeight: 300, margin: "0 0 24px", lineHeight: 1.6, opacity: 0.9 }}>
              Multi-location businesses need centralized control. Custom pricing, dedicated support, and advanced features for scaling brands.
            </p>
            <a
              href="mailto:hello@wearekyro.com?subject=Enterprise Plan Inquiry"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                height: 40, padding: "0 32px", borderRadius: 8,
                border: "1px solid white", backgroundColor: "transparent",
                color: "white", fontSize: 15, fontWeight: 500, textDecoration: "none",
              }}
            >
              Contact Us
            </a>
          </div>
          <div style={{ flex: "3 1 320px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px 56px" }}>
              {[
                { icon: Puzzle, title: "Onboarding & Training", desc: "Tailored onboarding with live training to help your team adopt quickly." },
                { icon: Users, title: "Multi-Store Dashboard", desc: "Centralized management across all locations with per-store analytics." },
                { icon: Headphones, title: "Priority Support", desc: "Guaranteed priority assistance with defined response times." },
                { icon: ShieldCheck, title: "Custom Branding", desc: "White-label loyalty cards with your own branding and domain." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <Icon size={20} style={{ color: "#fb923c" }} />
                    <div>
                      <h4 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>{item.title}</h4>
                      <p style={{ fontSize: 14, fontWeight: 300, margin: 0, lineHeight: 1.5, opacity: 0.85 }}>{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ marginBottom: 32, padding: "0 8px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, color: "rgba(10,10,10,0.9)", margin: "0 0 24px" }}>
          Frequently Asked Questions
        </h2>
        <div>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderTop: "1px solid rgba(10,10,10,0.06)", padding: "16px 0" }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between",
                  textAlign: "left", border: "none", backgroundColor: "transparent",
                  cursor: "pointer", fontFamily: "inherit", padding: 0,
                }}
              >
                <span style={{ fontSize: 17, fontWeight: 500, color: "rgba(10,10,10,0.85)" }}>{faq.q}</span>
                <ChevronDown
                  size={20}
                  style={{
                    flexShrink: 0, color: "rgba(10,10,10,0.3)", marginLeft: 16,
                    transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                />
              </button>
              {openFaq === i && (
                <p style={{ marginTop: 12, fontSize: 14, color: "rgba(10,10,10,0.5)", lineHeight: 1.6 }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
