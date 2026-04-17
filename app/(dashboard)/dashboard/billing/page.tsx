"use client";

import { useState, useEffect } from "react";

type CardInfo = {
  id: string;
  name: string;
  type: string;
  status: string;
  enrollmentCount: number;
  created_at: string;
};

export default function BillingPage() {
  const [cards, setCards] = useState<CardInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/merchant/cards")
      .then((r) => r.json())
      .then((d) => setCards(d.cards || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: "48px", textAlign: "center", color: "rgb(97,95,109)" }}>Loading billing...</div>;
  }

  const activeCards = cards.filter((c) => c.status === "active").length;
  const totalMembers = cards.reduce((sum, c) => sum + c.enrollmentCount, 0);

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)", margin: 0 }}>Billing</h1>
        <p style={{ fontSize: "14px", color: "rgb(97,95,109)", marginTop: "4px" }}>
          Manage your subscription and billing
        </p>
      </div>

      {/* Current plan */}
      <div style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid rgb(228,227,223)", padding: "24px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 4px" }}>Current Plan</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "24px", fontWeight: 700, color: "rgb(108,71,255)" }}>Free Beta</span>
              <span style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, backgroundColor: "rgb(220,252,231)", color: "rgb(22,101,52)" }}>
                Active
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px", marginBottom: "20px" }}>
          <div style={{ padding: "16px", backgroundColor: "rgb(249,248,245)", borderRadius: "10px" }}>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "rgb(11,5,29)" }}>{activeCards}</div>
            <div style={{ fontSize: "12px", color: "rgb(97,95,109)" }}>Active Cards</div>
          </div>
          <div style={{ padding: "16px", backgroundColor: "rgb(249,248,245)", borderRadius: "10px" }}>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "rgb(11,5,29)" }}>{totalMembers}</div>
            <div style={{ fontSize: "12px", color: "rgb(97,95,109)" }}>Total Members</div>
          </div>
          <div style={{ padding: "16px", backgroundColor: "rgb(249,248,245)", borderRadius: "10px" }}>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "rgb(11,5,29)" }}>Unlimited</div>
            <div style={{ fontSize: "12px", color: "rgb(97,95,109)" }}>Enrollments</div>
          </div>
        </div>

        <div style={{ fontSize: "13px", color: "rgb(97,95,109)", lineHeight: "20px" }}>
          You&apos;re on the free beta plan with full access to all features. Paid plans with advanced features will be available soon.
        </div>
      </div>

      {/* What's included */}
      <div style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid rgb(228,227,223)", padding: "24px", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 16px" }}>What&apos;s Included</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {[
            "Unlimited loyalty cards",
            "Unlimited customer enrollments",
            "Apple Wallet integration",
            "Push notifications",
            "QR code scanning",
            "Birthday campaigns",
            "Location-based alerts",
            "Analytics dashboard",
            "Customer management",
            "Campaign scheduling",
          ].map((feature) => (
            <div key={feature} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "rgb(11,5,29)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(22,163,74)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid rgb(228,227,223)", padding: "24px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 8px" }}>Need help with billing?</h2>
        <p style={{ fontSize: "14px", color: "rgb(97,95,109)", margin: "0 0 16px", lineHeight: "20px" }}>
          Contact our team for any billing questions, enterprise plans, or custom pricing.
        </p>
        <a
          href="mailto:hello@wearekyro.com"
          style={{
            display: "inline-block", padding: "10px 20px", borderRadius: "10px",
            backgroundColor: "rgb(11,5,29)", color: "white",
            fontSize: "14px", fontWeight: 500, textDecoration: "none",
          }}
        >
          Contact Us
        </a>
      </div>
    </div>
  );
}
