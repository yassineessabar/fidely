"use client";

import { useState, useEffect } from "react";

const PRIMARY = "rgba(10,10,10,0.9)";
const SECONDARY = "rgba(10,10,10,0.5)";
const BORDER = "rgba(10,10,10,0.06)";
const ORANGE_GRADIENT = "linear-gradient(135deg, #f59e0b, #f97316)";

function getInitials(name: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export default function ProfilePage() {
  const [business, setBusiness] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "account" | "billing">("overview");

  useEffect(() => {
    Promise.all([
      fetch("/api/merchant/cards")
        .then((r) => r.json())
        .catch(() => ({})),
      fetch("/api/merchant/stats")
        .then((r) => r.json())
        .catch(() => ({})),
    ]).then(([cardsData, statsData]) => {
      if (cardsData?.cards?.length > 0) {
        setBusiness(cardsData.cards[0].business_details || {});
      }
      setStats(statsData || {});
      setLoading(false);
    });
  }, []);

  const tabs: { id: "overview" | "account" | "billing"; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "account", label: "Account" },
    { id: "billing", label: "Plan & Billing" },
  ];

  const tabStyle = (id: string) => ({
    padding: "10px 0",
    marginRight: "28px",
    border: "none",
    borderBottom: activeTab === id ? "2px solid rgba(10,10,10,0.9)" : "2px solid transparent",
    backgroundColor: "transparent",
    color: activeTab === id ? PRIMARY : SECONDARY,
    fontSize: "14px",
    fontWeight: activeTab === id ? (600 as const) : (400 as const),
    cursor: "pointer" as const,
    fontFamily: "inherit",
    transition: "all 0.15s ease",
  });

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    border: `1px solid ${BORDER}`,
    padding: "24px",
  };

  const labelStyle = {
    display: "block" as const,
    fontSize: "11px",
    fontWeight: 600 as const,
    color: SECONDARY,
    marginBottom: "6px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.6px",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: `1px solid ${BORDER}`,
    fontSize: "14px",
    fontFamily: "inherit",
    color: PRIMARY,
    backgroundColor: "rgba(10,10,10,0.02)",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const businessName = business?.name || "Your Business";
  const initials = getInitials(businessName);

  if (loading) {
    return (
      <div style={{ padding: "64px", textAlign: "center", color: SECONDARY }}>
        Loading profile...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "860px" }}>
      {/* Cover Banner */}
      <div
        style={{
          height: "160px",
          background: "linear-gradient(135deg, #f59e0b, #f97316, #10b981)",
          borderRadius: "16px 16px 0 0",
        }}
      />

      {/* Profile Header */}
      <div
        style={{
          backgroundColor: "white",
          border: `1px solid ${BORDER}`,
          borderTop: "none",
          borderRadius: "0 0 16px 16px",
          padding: "0 32px 28px",
          marginBottom: "24px",
          position: "relative",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: "96px",
            height: "96px",
            borderRadius: "50%",
            background: ORANGE_GRADIENT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "28px",
            fontWeight: 700,
            border: "4px solid white",
            marginTop: "-48px",
            marginBottom: "16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
          }}
        >
          {initials}
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap" as const, gap: "12px" }}>
          <div>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: PRIMARY,
                margin: "0 0 8px",
                lineHeight: 1.2,
              }}
            >
              {businessName}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" as const }}>
              {/* Plan badge */}
              <span
                style={{
                  display: "inline-block",
                  padding: "3px 10px",
                  borderRadius: "999px",
                  backgroundColor: "#fef3c7",
                  color: "#92400e",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                Free Beta
              </span>
              <span style={{ fontSize: "12px", color: SECONDARY }}>
                Member since April 2026
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: "flex",
            borderBottom: `1px solid ${BORDER}`,
            marginTop: "24px",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={tabStyle(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "20px" }}>
          {/* Quick Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
            {[
              { label: "Active Cards", value: stats?.active_cards ?? stats?.totalCards ?? "—" },
              { label: "Total Members", value: stats?.total_members ?? stats?.totalMembers ?? stats?.totalCustomers ?? "—" },
              { label: "Campaigns Sent", value: stats?.campaigns_sent ?? stats?.campaignsSent ?? "—" },
            ].map((stat) => (
              <div key={stat.label} style={cardStyle}>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: SECONDARY,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.6px",
                    marginBottom: "10px",
                  }}
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: 700,
                    color: PRIMARY,
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Business Info */}
          <div style={cardStyle}>
            <h2
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: PRIMARY,
                margin: "0 0 20px",
              }}
            >
              Business Information
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              <div>
                <label style={labelStyle}>Business Name</label>
                <input style={inputStyle} value={business?.name || ""} readOnly />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <input style={inputStyle} value={business?.category || ""} readOnly />
              </div>
              <div>
                <label style={labelStyle}>Address</label>
                <input style={inputStyle} value={business?.address || ""} readOnly />
              </div>
              <div>
                <label style={labelStyle}>Tagline</label>
                <input style={inputStyle} value={business?.tagline || ""} readOnly />
              </div>
            </div>
            <p style={{ fontSize: "12px", color: SECONDARY, marginTop: "16px", marginBottom: 0 }}>
              To update your business details, edit them in the card builder.
            </p>
          </div>
        </div>
      )}

      {/* Account Tab */}
      {activeTab === "account" && (
        <div style={cardStyle}>
          <h2
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: PRIMARY,
              margin: "0 0 20px",
            }}
          >
            Account Details
          </h2>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "16px" }}>
            <div>
              <label style={labelStyle}>Business Name</label>
              <input style={inputStyle} value={business?.name || ""} readOnly />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                style={{ ...inputStyle, color: SECONDARY }}
                value="Contact support to change"
                readOnly
              />
            </div>
          </div>
          <p style={{ fontSize: "12px", color: SECONDARY, marginTop: "20px", marginBottom: 0 }}>
            To update your details, edit them in the card builder.
          </p>
        </div>
      )}

      {/* Plan & Billing Tab */}
      {activeTab === "billing" && (
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "16px" }}>
          {/* Current Plan */}
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: 600, color: PRIMARY, margin: 0 }}>
                Current Plan
              </h2>
              <span
                style={{
                  display: "inline-block",
                  padding: "3px 10px",
                  borderRadius: "999px",
                  backgroundColor: "#d1fae5",
                  color: "#065f46",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                Active
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: ORANGE_GRADIENT,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                }}
              >
                ✦
              </div>
              <div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: PRIMARY }}>Free Beta</div>
                <div style={{ fontSize: "13px", color: SECONDARY }}>No charge during beta period</div>
              </div>
            </div>

            {/* Usage */}
            <div
              style={{
                backgroundColor: "rgba(10,10,10,0.02)",
                borderRadius: "10px",
                padding: "16px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: SECONDARY, textTransform: "uppercase" as const, letterSpacing: "0.6px", marginBottom: "4px" }}>
                  Active Cards
                </div>
                <div style={{ fontSize: "20px", fontWeight: 700, color: PRIMARY }}>
                  {stats?.active_cards ?? stats?.totalCards ?? "—"}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: SECONDARY, textTransform: "uppercase" as const, letterSpacing: "0.6px", marginBottom: "4px" }}>
                  Total Members
                </div>
                <div style={{ fontSize: "20px", fontWeight: 700, color: PRIMARY }}>
                  {stats?.total_members ?? stats?.totalMembers ?? stats?.totalCustomers ?? "—"}
                </div>
              </div>
            </div>

            <a
              href="/dashboard/upgrade"
              style={{
                display: "inline-block",
                padding: "10px 20px",
                borderRadius: "8px",
                background: ORANGE_GRADIENT,
                color: "white",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Upgrade Plan
            </a>
          </div>

          {/* Billing History */}
          <div
            style={{
              ...cardStyle,
              textAlign: "center" as const,
              padding: "40px 24px",
            }}
          >
            <div style={{ fontSize: "28px", marginBottom: "12px" }}>🧾</div>
            <div style={{ fontSize: "14px", fontWeight: 500, color: PRIMARY, marginBottom: "6px" }}>
              No billing history yet
            </div>
            <div style={{ fontSize: "13px", color: SECONDARY }}>
              Billing history will be available with paid plans.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
