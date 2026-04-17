"use client";

import { useState, useEffect } from "react";

function getInitials(name: string): string {
  if (!name) return "?";
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

export default function ProfilePage() {
  const [business, setBusiness] = useState<any>(null);
  const [branding, setBranding] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "account" | "billing">("overview");

  useEffect(() => {
    Promise.all([
      fetch("/api/merchant/cards").then((r) => r.json()).catch(() => ({})),
      fetch("/api/merchant/stats").then((r) => r.json()).catch(() => ({})),
    ]).then(([cardsData, statsData]) => {
      if (cardsData?.cards?.length > 0) {
        setBusiness(cardsData.cards[0].business_details || {});
        setBranding(cardsData.cards[0].branding || {});
      }
      setStats(statsData || {});
      setLoading(false);
    });
  }, []);

  const businessName = business?.name || "Your Business";
  const initials = getInitials(businessName);
  const logoUrl = branding?.logoUrl;
  const bannerUrl = branding?.heroImageUrl;

  const tabStyle = (id: string): React.CSSProperties => ({
    padding: "10px 0",
    marginRight: "24px",
    border: "none",
    borderBottom: activeTab === id ? "2px solid rgba(10,10,10,0.8)" : "2px solid transparent",
    backgroundColor: "transparent",
    color: activeTab === id ? "rgba(10,10,10,0.8)" : "rgba(10,10,10,0.35)",
    fontSize: "13px",
    fontWeight: activeTab === id ? 600 : 400,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.15s",
  });

  const cardStyle: React.CSSProperties = {
    backgroundColor: "white",
    borderRadius: "14px",
    border: "1px solid rgba(10,10,10,0.05)",
    padding: "24px",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    fontWeight: 500,
    color: "rgba(10,10,10,0.35)",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(10,10,10,0.06)",
    fontSize: "14px",
    fontFamily: "inherit",
    color: "rgba(10,10,10,0.8)",
    backgroundColor: "rgba(10,10,10,0.015)",
    outline: "none",
    boxSizing: "border-box",
  };

  if (loading) return <div style={{ padding: "64px", textAlign: "center", color: "rgba(10,10,10,0.35)" }}>Loading profile...</div>;

  return (
    <div>
      {/* Cover */}
      <div style={{
        height: "180px",
        borderRadius: "16px 16px 0 0",
        overflow: "hidden",
        position: "relative",
        background: bannerUrl
          ? undefined
          : `linear-gradient(135deg, ${branding?.backgroundColor || "rgba(10,10,10,0.04)"}, ${branding?.accentColor || "rgba(10,10,10,0.08)"})`,
      }}>
        {bannerUrl && (
          <>
            <img src={bannerUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 40%, rgba(0,0,0,0.3))" }} />
          </>
        )}
      </div>

      {/* Profile header */}
      <div style={{
        backgroundColor: "white",
        border: "1px solid rgba(10,10,10,0.05)",
        borderTop: "none",
        borderRadius: "0 0 16px 16px",
        padding: "0 32px 24px",
        marginBottom: "24px",
      }}>
        {logoUrl ? (
          <img src={logoUrl} alt={businessName} style={{
            width: "88px", height: "88px", borderRadius: "50%",
            objectFit: "cover",
            border: "4px solid white", marginTop: "-44px", marginBottom: "14px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }} />
        ) : (
          <div style={{
            width: "88px", height: "88px", borderRadius: "50%",
            background: `linear-gradient(135deg, ${branding?.backgroundColor || "#f59e0b"}, ${branding?.accentColor || "#f97316"})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: branding?.primaryColor || "white", fontSize: "26px", fontWeight: 700,
            border: "4px solid white", marginTop: "-44px", marginBottom: "14px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}>
            {initials}
          </div>
        )}

        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "rgba(10,10,10,0.85)", margin: "0 0 6px" }}>
          {businessName}
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span style={{
            padding: "3px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: 600,
            backgroundColor: "rgba(245,158,11,0.08)", color: "rgba(180,83,9,0.8)",
          }}>
            Free Beta
          </span>
          <span style={{ fontSize: "12px", color: "rgba(10,10,10,0.3)" }}>Member since April 2026</span>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(10,10,10,0.05)", marginTop: "20px" }}>
          {[
            { id: "overview" as const, label: "Overview" },
            { id: "account" as const, label: "Account" },
            { id: "billing" as const, label: "Plan & Billing" },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={tabStyle(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }}>
            {[
              { label: "Active Cards", value: stats?.activeCards ?? "—" },
              { label: "Total Members", value: stats?.totalCustomers ?? "—" },
              { label: "Notifications Sent", value: stats?.notificationsSent ?? "—" },
            ].map((s) => (
              <div key={s.label} style={cardStyle}>
                <div style={{ fontSize: "11px", fontWeight: 500, color: "rgba(10,10,10,0.35)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>{s.label}</div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: "rgba(10,10,10,0.85)", lineHeight: 1 }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div style={cardStyle}>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: "rgba(10,10,10,0.8)", margin: "0 0 16px" }}>Business Information</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
              {[
                { label: "Business Name", value: business?.name },
                { label: "Category", value: business?.category },
                { label: "Address", value: business?.address },
                { label: "Tagline", value: business?.tagline },
              ].map((f) => (
                <div key={f.label}>
                  <label style={labelStyle}>{f.label}</label>
                  <input style={inputStyle} value={f.value || ""} readOnly />
                </div>
              ))}
            </div>
            <p style={{ fontSize: "12px", color: "rgba(10,10,10,0.3)", marginTop: "14px", marginBottom: 0 }}>
              To update your business details, edit them in the card builder.
            </p>
          </div>
        </div>
      )}

      {/* Account */}
      {activeTab === "account" && (
        <div style={cardStyle}>
          <h2 style={{ fontSize: "14px", fontWeight: 600, color: "rgba(10,10,10,0.8)", margin: "0 0 16px" }}>Account Details</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={labelStyle}>Business Name</label>
              <input style={inputStyle} value={business?.name || ""} readOnly />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input style={{ ...inputStyle, color: "rgba(10,10,10,0.3)" }} value="Contact support to change" readOnly />
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "rgba(10,10,10,0.3)", marginTop: "16px", marginBottom: 0 }}>
            To update your details, edit them in the card builder.
          </p>
        </div>
      )}

      {/* Plan & Billing */}
      {activeTab === "billing" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: 600, color: "rgba(10,10,10,0.8)", margin: 0 }}>Current Plan</h2>
              <span style={{ padding: "3px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: 600, backgroundColor: "rgba(16,185,129,0.08)", color: "rgba(5,150,105,0.8)" }}>
                Active
              </span>
            </div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "rgba(10,10,10,0.85)", marginBottom: "4px" }}>Free Beta</div>
            <div style={{ fontSize: "13px", color: "rgba(10,10,10,0.35)", marginBottom: "20px" }}>No charge during beta period</div>
            <div style={{
              backgroundColor: "rgba(10,10,10,0.015)", borderRadius: "10px", padding: "14px",
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "16px",
            }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 500, color: "rgba(10,10,10,0.35)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Active Cards</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "rgba(10,10,10,0.85)" }}>{stats?.activeCards ?? "—"}</div>
              </div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 500, color: "rgba(10,10,10,0.35)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Total Members</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "rgba(10,10,10,0.85)" }}>{stats?.totalCustomers ?? "—"}</div>
              </div>
            </div>
            <a href="/dashboard/upgrade" style={{
              display: "inline-block", padding: "9px 20px", borderRadius: "8px",
              backgroundColor: "#0b051d", color: "white", fontSize: "13px", fontWeight: 600, textDecoration: "none",
            }}>
              Upgrade Plan
            </a>
          </div>

          <div style={{ ...cardStyle, textAlign: "center", padding: "36px 24px" }}>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "rgba(10,10,10,0.6)", marginBottom: "4px" }}>No billing history yet</div>
            <div style={{ fontSize: "12px", color: "rgba(10,10,10,0.3)" }}>Billing history will be available with paid plans.</div>
          </div>
        </div>
      )}
    </div>
  );
}
