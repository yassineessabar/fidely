"use client";

import { useState, useEffect } from "react";

type Stats = {
  totalCustomers: number;
  activeCustomers: number;
  activeCards: number;
  totalCards: number;
  notificationsSent: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/merchant/stats")
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const kpis = stats
    ? [
        { label: "Total Customers", value: stats.totalCustomers.toLocaleString() },
        { label: "Active Customers", value: stats.activeCustomers.toLocaleString() },
        { label: "Active Cards", value: stats.activeCards.toString() },
        { label: "Notifications Sent", value: stats.notificationsSent.toLocaleString() },
      ]
    : [];

  if (loading) {
    return (
      <div style={{ padding: "48px", textAlign: "center", color: "rgb(97,95,109)" }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)", margin: 0 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: "14px", color: "rgb(97,95,109)", marginTop: "4px" }}>
          Overview of your loyalty program
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            style={{
              padding: "24px",
              backgroundColor: "white",
              borderRadius: "16px",
              border: "1px solid rgb(228,227,223)",
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: 500, color: "rgb(97,95,109)", marginBottom: "8px" }}>
              {kpi.label}
            </div>
            <div style={{ fontSize: "32px", fontWeight: 700, color: "rgb(11,5,29)" }}>
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      {/* Getting started section */}
      {stats && stats.totalCards === 0 && (
        <div style={{
          padding: "32px",
          backgroundColor: "white",
          borderRadius: "16px",
          border: "1px solid rgb(228,227,223)",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚀</div>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 8px" }}>
            Get started
          </h2>
          <p style={{ fontSize: "14px", color: "rgb(97,95,109)", maxWidth: "400px", margin: "0 auto", lineHeight: "20px" }}>
            Create your first loyalty card to start enrolling customers. Head to the admin panel to set up a stamp card, points card, or coupon.
          </p>
        </div>
      )}

      {stats && stats.totalCards > 0 && stats.totalCustomers === 0 && (
        <div style={{
          padding: "32px",
          backgroundColor: "white",
          borderRadius: "16px",
          border: "1px solid rgb(228,227,223)",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📱</div>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 8px" }}>
            Share your card
          </h2>
          <p style={{ fontSize: "14px", color: "rgb(97,95,109)", maxWidth: "400px", margin: "0 auto", lineHeight: "20px" }}>
            You have {stats.activeCards} active card{stats.activeCards !== 1 ? "s" : ""}. Share the enrollment link or QR code with your customers to start growing your loyalty program.
          </p>
        </div>
      )}
    </div>
  );
}
