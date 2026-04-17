"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Users, CreditCard, Bell, ArrowUpRight, ArrowDownRight } from "lucide-react";

type Stats = {
  totalCustomers: number;
  activeCustomers: number;
  activeCards: number;
  totalCards: number;
  notificationsSent: number;
};

type Analytics = {
  enrollmentsByMonth: { month: string; count: number }[];
  cardBreakdown: { name: string; type: string; status: string; members: number; active: number }[];
  topCustomers: { name: string; email: string; stamps: number; points: number; card: string; status: string }[];
  stampDistribution: { label: string; count: number }[];
  totalEnrollments: number;
  activeRate: number;
  avgStamps: number;
  avgPoints: number;
};

const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  backgroundColor: "white", borderRadius: 14,
  border: "1px solid rgba(10,10,10,0.06)", padding: 20, ...extra,
});

export default function InsightsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30d");

  useEffect(() => {
    Promise.all([
      fetch("/api/merchant/stats").then((r) => r.json()),
      fetch("/api/merchant/analytics").then((r) => r.json()),
    ])
      .then(([s, a]) => { setStats(s); setAnalytics(a); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 48, textAlign: "center", color: "rgba(10,10,10,0.4)" }}>Loading insights...</div>;

  const kpis = stats ? [
    { label: "Total Customers", value: stats.totalCustomers.toLocaleString(), icon: Users, color: "#6C47FF" },
    { label: "Active Customers", value: stats.activeCustomers.toLocaleString(), icon: TrendingUp, color: "#10b981" },
    { label: "Active Cards", value: stats.activeCards.toString(), icon: CreditCard, color: "#f59e0b" },
    { label: "Notifications", value: stats.notificationsSent.toLocaleString(), icon: Bell, color: "#0ea5e9" },
  ] : [];

  const maxMonth = analytics ? Math.max(...analytics.enrollmentsByMonth.map((m) => m.count), 1) : 1;
  const maxStamp = analytics ? Math.max(...analytics.stampDistribution.map((s) => s.count), 1) : 1;
  const has = analytics && analytics.totalEnrollments > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div />
        <div style={{ display: "flex", gap: 6 }}>
          {["7d", "30d", "90d"].map((r) => (
            <button key={r} onClick={() => setDateRange(r)} style={{
              padding: "6px 14px", borderRadius: 99, border: "none", fontSize: 12, fontWeight: 600,
              backgroundColor: dateRange === r ? "#0b051d" : "white", color: dateRange === r ? "white" : "rgba(10,10,10,0.6)",
              cursor: "pointer", fontFamily: "inherit", boxShadow: dateRange !== r ? "0 1px 3px rgba(0,0,0,0.04)" : "none",
            }}>
              {r === "7d" ? "7 days" : r === "30d" ? "30 days" : "90 days"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }} className="insights-kpi-grid">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} style={card()}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(10,10,10,0.45)" }}>{kpi.label}</span>
                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: `${kpi.color}10`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} style={{ color: kpi.color }} />
                </div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "rgba(10,10,10,0.9)", lineHeight: 1 }}>{kpi.value}</div>
            </div>
          );
        })}
      </div>

      {/* No data state */}
      {!has && stats && stats.totalCards > 0 && (
        <div style={card({ textAlign: "center", padding: 40 })}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "rgba(10,10,10,0.85)", margin: "0 0 6px" }}>Insights will appear here</h2>
          <p style={{ fontSize: 13, color: "rgba(10,10,10,0.4)", margin: 0 }}>Share your card link to start enrolling customers</p>
        </div>
      )}

      {!has && stats && stats.totalCards === 0 && (
        <div style={card({ textAlign: "center", padding: 40 })}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "rgba(10,10,10,0.85)", margin: "0 0 6px" }}>Get started</h2>
          <p style={{ fontSize: 13, color: "rgba(10,10,10,0.4)", margin: 0 }}>Create your first loyalty card to see insights</p>
        </div>
      )}

      {/* Charts row */}
      {has && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="insights-chart-grid">
          {/* Enrollment trend */}
          <div style={card()}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "rgba(10,10,10,0.85)", margin: "0 0 16px" }}>New Members</h3>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120 }}>
              {analytics!.enrollmentsByMonth.map((m) => (
                <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(10,10,10,0.6)" }}>{m.count || ""}</div>
                  <div style={{
                    width: "100%", borderRadius: "6px 6px 0 0",
                    backgroundColor: m.count > 0 ? "#6C47FF" : "rgba(10,10,10,0.04)",
                    height: `${Math.max((m.count / maxMonth) * 100, 4)}%`, minHeight: 4,
                  }} />
                  <div style={{ fontSize: 9, color: "rgba(10,10,10,0.35)" }}>{m.month}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stamp distribution or cards overview */}
          {analytics!.stampDistribution.some((s) => s.count > 0) ? (
            <div style={card()}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "rgba(10,10,10,0.85)", margin: "0 0 16px" }}>Stamp Progress</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {analytics!.stampDistribution.map((s) => (
                  <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontSize: 11, color: "rgba(10,10,10,0.45)", width: 70, flexShrink: 0 }}>{s.label}</div>
                    <div style={{ flex: 1, height: 18, backgroundColor: "rgba(10,10,10,0.03)", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 4, backgroundColor: "#6C47FF", width: `${(s.count / maxStamp) * 100}%`, minWidth: s.count > 0 ? 4 : 0 }} />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.7)", width: 24, textAlign: "right" }}>{s.count}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={card()}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "rgba(10,10,10,0.85)", margin: "0 0 16px" }}>Cards Overview</h3>
              {analytics!.cardBreakdown.map((c) => (
                <div key={c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(10,10,10,0.04)" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(10,10,10,0.85)" }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(10,10,10,0.4)", textTransform: "capitalize" }}>{c.type}</div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "rgba(10,10,10,0.85)" }}>{c.members}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Members by card */}
      {has && (
        <div style={card()}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "rgba(10,10,10,0.85)", margin: "0 0 16px" }}>Members by Card</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
            {analytics!.cardBreakdown.map((c) => (
              <div key={c.name} style={{ padding: 14, backgroundColor: "rgba(10,10,10,0.02)", borderRadius: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(10,10,10,0.85)", marginBottom: 3 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: "rgba(10,10,10,0.4)", marginBottom: 8, textTransform: "capitalize" }}>{c.type} · {c.status}</div>
                <div style={{ display: "flex", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "rgba(10,10,10,0.85)" }}>{c.members}</div>
                    <div style={{ fontSize: 10, color: "rgba(10,10,10,0.35)" }}>Total</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "rgb(16,185,129)" }}>{c.active}</div>
                    <div style={{ fontSize: 10, color: "rgba(10,10,10,0.35)" }}>Active</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top members */}
      {has && analytics!.topCustomers.length > 0 && (
        <div style={card()}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "rgba(10,10,10,0.85)", margin: "0 0 16px" }}>Top Members</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(10,10,10,0.06)" }}>
                  {["Name", "Card", "Stamps", "Points", "Status"].map((h) => (
                    <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "rgba(10,10,10,0.4)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {analytics!.topCustomers.map((c, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(10,10,10,0.03)" }}>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ fontWeight: 600, color: "rgba(10,10,10,0.85)" }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: "rgba(10,10,10,0.35)" }}>{c.email}</div>
                    </td>
                    <td style={{ padding: "10px 12px", color: "rgba(10,10,10,0.6)" }}>{c.card}</td>
                    <td style={{ padding: "10px 12px", fontWeight: 600, color: "rgba(10,10,10,0.85)" }}>{c.stamps}</td>
                    <td style={{ padding: "10px 12px", fontWeight: 600, color: "rgba(10,10,10,0.85)" }}>{c.points}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, backgroundColor: c.status === "active" ? "rgba(16,185,129,0.08)" : "rgba(10,10,10,0.04)", color: c.status === "active" ? "rgb(5,150,105)" : "rgba(10,10,10,0.4)" }}>{c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .insights-kpi-grid { grid-template-columns: 1fr 1fr !important; }
          .insights-chart-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .insights-kpi-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
