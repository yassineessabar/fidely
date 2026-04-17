"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const planInfo: Record<string, { name: string; monthly: number; yearly: number; tagline: string; features: string[] }> = {
  starter: { name: "Starter", monthly: 49, yearly: 39, tagline: "Replace paper loyalty cards", features: ["1 location", "Digital loyalty card (Apple & Google Wallet)", "QR code for in-store", "Up to 150 customers", "Basic customer capture"] },
  growth: { name: "Growth", monthly: 79, yearly: 63, tagline: "Bring customers back automatically", features: ["1 location", "Digital loyalty card", "QR code", "Up to 10 push campaigns/month", "Basic analytics", "Up to 500 customers"] },
  pro: { name: "Pro", monthly: 129, yearly: 103, tagline: "Maximize customer retention", features: ["1 location", "Digital loyalty card", "QR code", "Unlimited push campaigns", "Advanced analytics", "Unlimited customers", "Priority support"] },
};

export default function BillingPage() {
  const searchParams = useSearchParams();
  const planKey = searchParams.get("plan") || "growth";
  const plan = planInfo[planKey] || planInfo.growth;

  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    fetch("/api/merchant/cards")
      .then((r) => r.json())
      .then((d) => setCards(d.cards || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeCards = cards.filter((c: any) => c.status === "active").length;
  const totalMembers = cards.reduce((sum: number, c: any) => sum + c.enrollmentCount, 0);
  const price = cycle === "monthly" ? plan.monthly : plan.yearly;
  const annualTotal = plan.yearly * 12;
  const savings = (plan.monthly * 12) - annualTotal;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "rgba(10,10,10,0.9)", margin: 0 }}>
          Subscribe to {plan.name}
        </h1>
        <p style={{ fontSize: 13, color: "rgba(10,10,10,0.45)", marginTop: 4 }}>{plan.tagline}</p>
      </div>

      {/* Current usage */}
      <div style={{ backgroundColor: "#fff", borderRadius: 20, border: "1px solid rgba(10,10,10,0.06)", padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: "rgba(10,10,10,0.9)", margin: "0 0 16px" }}>Current Usage</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12 }}>
          {[
            { value: loading ? "—" : String(activeCards), label: "Active Cards" },
            { value: loading ? "—" : String(totalMembers), label: "Total Members" },
          ].map((s) => (
            <div key={s.label} style={{ padding: "14px 16px", backgroundColor: "rgba(10,10,10,0.025)", borderRadius: 12 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "rgba(10,10,10,0.9)", marginBottom: 2 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "rgba(10,10,10,0.5)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing cycle */}
      <div style={{ backgroundColor: "#fff", borderRadius: 20, border: "1px solid rgba(10,10,10,0.06)", padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: "rgba(10,10,10,0.9)", margin: "0 0 16px" }}>Select billing cycle</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Monthly */}
          <label
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "18px 20px", borderRadius: 14, cursor: "pointer", transition: "all 0.15s",
              border: `1.5px solid ${cycle === "monthly" ? "#0b051d" : "rgba(10,10,10,0.08)"}`,
              backgroundColor: cycle === "monthly" ? "rgba(10,10,10,0.03)" : "transparent",
            }}
            onClick={() => setCycle("monthly")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${cycle === "monthly" ? "#0b051d" : "rgba(10,10,10,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {cycle === "monthly" && <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#0b051d" }} />}
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(10,10,10,0.9)" }}>Monthly</span>
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: "rgba(10,10,10,0.9)" }}>
              ${plan.monthly}<span style={{ fontSize: 13, fontWeight: 400, color: "rgba(10,10,10,0.5)" }}>/mo</span>
            </span>
          </label>

          {/* Yearly */}
          <label
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "18px 20px", borderRadius: 14, cursor: "pointer", transition: "all 0.15s",
              border: `1.5px solid ${cycle === "yearly" ? "#0b051d" : "rgba(10,10,10,0.08)"}`,
              backgroundColor: cycle === "yearly" ? "rgba(10,10,10,0.03)" : "transparent",
            }}
            onClick={() => setCycle("yearly")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${cycle === "yearly" ? "#0b051d" : "rgba(10,10,10,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {cycle === "yearly" && <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#0b051d" }} />}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(10,10,10,0.9)" }}>Yearly</span>
                <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, backgroundColor: "rgba(16,185,129,0.1)", color: "rgb(16,185,129)" }}>
                  SAVE ${savings}
                </span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "rgba(10,10,10,0.9)" }}>
                ${plan.yearly}<span style={{ fontSize: 13, fontWeight: 400, color: "rgba(10,10,10,0.5)" }}>/mo</span>
              </span>
              <div style={{ fontSize: 11, color: "rgba(10,10,10,0.4)", marginTop: 1 }}>${annualTotal} billed annually</div>
            </div>
          </label>
        </div>
      </div>

      {/* Features */}
      <div style={{ backgroundColor: "#fff", borderRadius: 20, border: "1px solid rgba(10,10,10,0.06)", padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: "rgba(10,10,10,0.9)", margin: "0 0 16px" }}>Included in {plan.name}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {plan.features.map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(10,10,10,0.75)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgb(16,185,129)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M20 6L9 17l-5-5" />
              </svg>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={async () => {
            setCheckingOut(true);
            try {
              const res = await fetch("/api/billing/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: planKey, cycle }),
              });
              const data = await res.json();
              if (data.url) window.location.href = data.url;
              else alert(data.error || "Checkout failed");
            } catch { alert("Checkout failed"); }
            finally { setCheckingOut(false); }
          }}
          disabled={checkingOut}
          style={{
            flex: 1, padding: "14px", borderRadius: 14, border: "none",
            backgroundColor: "#0b051d", color: "white", fontSize: 15, fontWeight: 600,
            cursor: checkingOut ? "not-allowed" : "pointer", opacity: checkingOut ? 0.7 : 1,
            fontFamily: "inherit",
          }}
        >
          {checkingOut ? "Redirecting to Stripe..." : `Subscribe — $${price}/mo`}
        </button>
        <button
          onClick={async () => {
            try {
              const res = await fetch("/api/billing/portal", { method: "POST" });
              const data = await res.json();
              if (data.url) window.location.href = data.url;
            } catch {}
          }}
          style={{
            padding: "14px 24px", borderRadius: 14,
            border: "1px solid rgba(10,10,10,0.08)", backgroundColor: "white",
            color: "rgba(10,10,10,0.8)", fontSize: 14, fontWeight: 500,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Manage
        </button>
      </div>
    </div>
  );
}
