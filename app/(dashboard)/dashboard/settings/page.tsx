"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("business");

  useEffect(() => {
    fetch("/api/merchant/cards")
      .then((r) => r.json())
      .then((d) => {
        if (d.cards && d.cards.length > 0) {
          setBusiness(d.cards[0].business_details || {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const tabs = [
    { id: "business", label: "Business" },
    { id: "notifications", label: "Notifications" },
    { id: "billing", label: "Billing" },
  ];

  const tabStyle = (id: string) => ({
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: activeTab === id ? "rgb(11,5,29)" : "transparent",
    color: activeTab === id ? "white" : "rgb(97,95,109)",
    fontSize: "14px",
    fontWeight: 500 as const,
    cursor: "pointer" as const,
    fontFamily: "inherit",
  });

  const labelStyle = {
    display: "block" as const,
    fontSize: "12px",
    fontWeight: 600 as const,
    color: "rgb(97,95,109)",
    marginBottom: "6px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid rgb(228,227,223)",
    fontSize: "14px",
    fontFamily: "inherit",
    color: "rgb(11,5,29)",
    backgroundColor: "rgb(249,248,245)",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  if (loading) {
    return (
      <div style={{ padding: "48px", textAlign: "center", color: "rgb(97,95,109)" }}>
        Loading settings...
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)", margin: 0 }}>
          Settings
        </h1>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "24px", backgroundColor: "rgb(243,242,238)", padding: "4px", borderRadius: "12px", width: "fit-content" }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={tabStyle(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Business Tab */}
      {activeTab === "business" && (
        <div style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid rgb(228,227,223)", padding: "24px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 20px" }}>
            Business Information
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
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
          <p style={{ fontSize: "12px", color: "rgb(97,95,109)", marginTop: "16px" }}>
            To update your business details, edit them in the card builder from the admin panel.
          </p>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div style={{
          padding: "48px",
          textAlign: "center",
          backgroundColor: "white",
          borderRadius: "16px",
          border: "1px solid rgb(228,227,223)",
        }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 8px" }}>
            Notification preferences
          </h2>
          <p style={{ fontSize: "14px", color: "rgb(97,95,109)", maxWidth: "400px", margin: "0 auto", lineHeight: "20px" }}>
            Notification settings will be available here soon. Currently, you can send notifications to your customers from the card dashboard.
          </p>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === "billing" && (
        <div style={{
          padding: "48px",
          textAlign: "center",
          backgroundColor: "white",
          borderRadius: "16px",
          border: "1px solid rgb(228,227,223)",
        }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 8px" }}>
            Billing & subscription
          </h2>
          <p style={{ fontSize: "14px", color: "rgb(97,95,109)", maxWidth: "400px", margin: "0 auto", lineHeight: "20px" }}>
            Billing and subscription management will be available here soon. Contact us at hello@wearekyro.com for any billing questions.
          </p>
        </div>
      )}
    </div>
  );
}
