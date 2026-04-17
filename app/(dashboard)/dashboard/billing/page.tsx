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

const features = [
  "Unlimited cards",
  "Apple Wallet integration",
  "Push notifications",
  "Birthday campaigns",
  "Location alerts",
  "Analytics dashboard",
  "Customer management",
  "Campaign scheduling",
];

export default function BillingPage() {
  const [cards, setCards] = useState<CardInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    fetch("/api/merchant/cards")
      .then((r) => r.json())
      .then((d) => setCards(d.cards || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeCards = cards.filter((c) => c.status === "active").length;
  const totalMembers = cards.reduce((sum, c) => sum + c.enrollmentCount, 0);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "rgba(10,10,10,0.9)",
            margin: 0,
          }}
        >
          Billing
        </h1>
      </div>

      {/* Current Plan */}
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          border: "1px solid rgba(10,10,10,0.06)",
          padding: 28,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "rgba(10,10,10,0.9)",
              margin: 0,
            }}
          >
            Current Plan
          </h2>
          <span
            style={{
              padding: "3px 10px",
              borderRadius: 99,
              fontSize: 11,
              fontWeight: 600,
              backgroundColor: "rgba(108,71,255,0.1)",
              color: "rgb(108,71,255)",
              letterSpacing: "0.02em",
            }}
          >
            Free Beta
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: 12,
          }}
        >
          {[
            {
              value: loading ? "—" : String(activeCards),
              label: "Active Cards",
            },
            {
              value: loading ? "—" : String(totalMembers),
              label: "Total Members",
            },
            { value: "Unlimited", label: "Enrollments" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: "16px 18px",
                backgroundColor: "rgba(10,10,10,0.025)",
                borderRadius: 14,
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "rgba(10,10,10,0.9)",
                  marginBottom: 2,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{ fontSize: 12, color: "rgba(10,10,10,0.5)" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing Cycle */}
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          border: "1px solid rgba(10,10,10,0.06)",
          padding: 28,
          marginBottom: 20,
        }}
      >
        <h2
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "rgba(10,10,10,0.9)",
            margin: "0 0 16px",
          }}
        >
          Billing Cycle
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Monthly */}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 20px",
              borderRadius: 14,
              border: `1.5px solid ${cycle === "monthly" ? "rgb(108,71,255)" : "rgba(10,10,10,0.08)"}`,
              backgroundColor:
                cycle === "monthly"
                  ? "rgba(108,71,255,0.04)"
                  : "transparent",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onClick={() => setCycle("monthly")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: `2px solid ${cycle === "monthly" ? "rgb(108,71,255)" : "rgba(10,10,10,0.2)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {cycle === "monthly" && (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "rgb(108,71,255)",
                    }}
                  />
                )}
              </div>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "rgba(10,10,10,0.9)",
                }}
              >
                Monthly
              </span>
            </div>
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "rgba(10,10,10,0.9)",
              }}
            >
              $49
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  color: "rgba(10,10,10,0.5)",
                }}
              >
                /mo
              </span>
            </span>
          </label>

          {/* Yearly */}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 20px",
              borderRadius: 14,
              border: `1.5px solid ${cycle === "yearly" ? "rgb(108,71,255)" : "rgba(10,10,10,0.08)"}`,
              backgroundColor:
                cycle === "yearly"
                  ? "rgba(108,71,255,0.04)"
                  : "transparent",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onClick={() => setCycle("yearly")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: `2px solid ${cycle === "yearly" ? "rgb(108,71,255)" : "rgba(10,10,10,0.2)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {cycle === "yearly" && (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "rgb(108,71,255)",
                    }}
                  />
                )}
              </div>
              <div>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "rgba(10,10,10,0.9)",
                  }}
                >
                  Yearly
                </span>
                <span
                  style={{
                    marginLeft: 8,
                    padding: "2px 8px",
                    borderRadius: 99,
                    fontSize: 10,
                    fontWeight: 700,
                    backgroundColor: "rgba(16,185,129,0.12)",
                    color: "rgb(16,185,129)",
                    letterSpacing: "0.04em",
                  }}
                >
                  SAVE $120
                </span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "rgba(10,10,10,0.9)",
                }}
              >
                $39
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 400,
                    color: "rgba(10,10,10,0.5)",
                  }}
                >
                  /mo
                </span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(10,10,10,0.4)", marginTop: 1 }}>
                $468 billed annually
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Plan Features */}
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          border: "1px solid rgba(10,10,10,0.06)",
          padding: 28,
          marginBottom: 20,
        }}
      >
        <h2
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "rgba(10,10,10,0.9)",
            margin: "0 0 18px",
          }}
        >
          Plan Features
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px 24px",
          }}
        >
          {features.map((feature) => (
            <div
              key={feature}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 14,
                color: "rgba(10,10,10,0.8)",
              }}
            >
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
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        disabled
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: 14,
          border: "none",
          backgroundColor: "rgba(10,10,10,0.06)",
          color: "rgba(10,10,10,0.35)",
          fontSize: 15,
          fontWeight: 600,
          cursor: "not-allowed",
        }}
      >
        Coming Soon — Continue to Checkout
      </button>
    </div>
  );
}
