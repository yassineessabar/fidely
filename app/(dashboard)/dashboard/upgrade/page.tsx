"use client";

import { useState, useEffect } from "react";
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
  const [currentPlan, setCurrentPlan] = useState("free");

  useEffect(() => {
    fetch("/api/merchant/plan")
      .then((r) => r.json())
      .then((d) => { if (d?.plan) setCurrentPlan(d.plan); })
      .catch(() => {});
  }, []);

  const hasActivePlan = currentPlan !== "free";

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "rgba(10,10,10,0.9)", margin: "0 0 8px", letterSpacing: "-0.3px" }}>
          {hasActivePlan ? "Manage your plan" : "Choose the plan that\u0027s right for you"}
        </h1>
        <p style={{ fontSize: 15, color: "rgba(10,10,10,0.4)", margin: 0 }}>
          {hasActivePlan ? `You\u0027re on the ${currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} plan` : "Start free, upgrade when you\u0027re ready"}
        </p>
        {hasActivePlan && (
          <button onClick={() => router.push("/dashboard/billing")} style={{
            marginTop: 16, padding: "10px 24px", borderRadius: 12,
            border: "1px solid rgba(10,10,10,0.1)", backgroundColor: "white",
            fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            color: "rgba(10,10,10,0.7)",
          }}>
            Manage Subscription
          </button>
        )}
      </div>

      {/* Plan cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, alignItems: "stretch", marginBottom: 40 }}>
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          return (
          <div key={plan.id} style={{ display: "flex", flexDirection: "column" }}>
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              borderRadius: 20, backgroundColor: "white", padding: 28,
              border: isCurrent ? "2px solid rgb(16,185,129)" : plan.recommended ? "2px solid #111" : "1px solid rgba(10,10,10,0.06)",
              boxShadow: isCurrent ? "0 8px 30px rgba(16,185,129,0.1)" : plan.recommended ? "0 8px 30px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.02)",
              position: "relative",
            }}>
              {/* Name + badge */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: "rgba(10,10,10,0.9)", letterSpacing: "-0.2px" }}>{plan.name}</span>
                  {isCurrent && (
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
                      backgroundColor: "rgba(16,185,129,0.1)", color: "rgb(5,150,105)",
                    }}>
                      Current Plan
                    </span>
                  )}
                  {!isCurrent && plan.recommended && (
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
                      backgroundColor: "#111", color: "white",
                    }}>
                      Recommended
                    </span>
                  )}
                </div>
                {/* Price */}
                <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                  <span style={{ fontSize: 36, fontWeight: 700, color: "rgba(10,10,10,0.9)", lineHeight: 1, letterSpacing: "-1px" }}>${plan.price}</span>
                  <span style={{ fontSize: 14, color: "rgba(10,10,10,0.3)", marginLeft: 2 }}>/mo</span>
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: 13, color: "rgba(10,10,10,0.45)", margin: "0 0 20px", lineHeight: 1.5 }}>{plan.desc}</p>

              {/* CTA */}
              {isCurrent ? (
                <div style={{
                  width: "100%", padding: "12px 0", borderRadius: 12,
                  fontSize: 14, fontWeight: 600, textAlign: "center",
                  marginBottom: 20,
                  backgroundColor: "rgba(16,185,129,0.08)",
                  color: "rgb(5,150,105)",
                  border: "1px solid rgba(16,185,129,0.15)",
                }}>
                  ✓ Active
                </div>
              ) : (
                <button
                  onClick={() => router.push(`/dashboard/billing?plan=${plan.id}`)}
                  style={{
                    width: "100%", padding: "12px 0", borderRadius: 12, border: "none",
                    fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                    marginBottom: 20,
                    backgroundColor: plan.recommended ? "#111" : "rgba(10,10,10,0.04)",
                    color: plan.recommended ? "white" : "rgba(10,10,10,0.7)",
                    transition: "all 0.15s",
                  }}
                >
                  {plan.cta}
                </button>
              )}

              {/* Divider */}
              <div style={{ height: 1, backgroundColor: "rgba(10,10,10,0.06)", marginBottom: 16 }} />

              {/* Highlights */}
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.4)", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Includes:</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {plan.highlights.map((h) => (
                    <div key={h} style={{ display: "flex", alignItems: "center", fontSize: 13, color: "rgba(10,10,10,0.7)" }}>
                      <Check size={15} strokeWidth={2.5} style={{ flexShrink: 0, color: "#111", marginRight: 10 }} />
                      {h}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          );
        })}
      </div>

      {/* Enterprise banner */}
      <div style={{
        borderRadius: 20, overflow: "hidden",
        backgroundColor: "#111",
        color: "white", padding: "36px 48px", marginBottom: 40,
      }}>
        <div style={{ display: "flex", gap: 56, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: "2 1 240px" }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.2px" }}>Kyro for Enterprise</h3>
            <p style={{ fontSize: 14, fontWeight: 400, margin: "0 0 24px", lineHeight: 1.6, opacity: 0.7 }}>
              Multi-location businesses need centralized control. Custom pricing, dedicated support, and advanced features for scaling brands.
            </p>
            <a
              href="mailto:hello@wearekyro.com?subject=Enterprise Plan Inquiry"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                padding: "10px 28px", borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.25)", backgroundColor: "transparent",
                color: "white", fontSize: 14, fontWeight: 600, textDecoration: "none",
                transition: "all 0.15s",
              }}
            >
              Contact Us
            </a>
          </div>
          <div style={{ flex: "3 1 320px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px 48px" }}>
              {[
                { icon: Puzzle, title: "Onboarding & Training", desc: "Tailored onboarding with live training to help your team adopt quickly." },
                { icon: Users, title: "Multi-Store Dashboard", desc: "Centralized management across all locations with per-store analytics." },
                { icon: Headphones, title: "Priority Support", desc: "Guaranteed priority assistance with defined response times." },
                { icon: ShieldCheck, title: "Custom Branding", desc: "White-label loyalty cards with your own branding and domain." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <Icon size={20} style={{ color: "rgba(255,255,255,0.5)" }} />
                    <div>
                      <h4 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 3px" }}>{item.title}</h4>
                      <p style={{ fontSize: 13, fontWeight: 400, margin: 0, lineHeight: 1.5, opacity: 0.6 }}>{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "rgba(10,10,10,0.9)", margin: "0 0 20px", letterSpacing: "-0.2px" }}>
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
                <span style={{ fontSize: 15, fontWeight: 600, color: "rgba(10,10,10,0.85)" }}>{faq.q}</span>
                <ChevronDown
                  size={18}
                  style={{
                    flexShrink: 0, color: "rgba(10,10,10,0.3)", marginLeft: 16,
                    transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                />
              </button>
              {openFaq === i && (
                <p style={{ marginTop: 10, fontSize: 14, color: "rgba(10,10,10,0.5)", lineHeight: 1.6 }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
