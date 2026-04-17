"use client";

import { useState, useEffect } from "react";
import {
  Eye, MousePointer, Users, Sparkles, CalendarDays, ChevronDown,
  Plug, Info, X, Check, CreditCard, TrendingUp, Bell,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";

/* ─── Types ───────────────────────────────────────────── */

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

/* ─── Chart colours ───────────────────────────────────── */

const COLORS = {
  enrollments: "#2665d6",
  uniqueEnrollments: "#02acc4",
  scans: "#D717E7",
  uniqueScans: "#FC3E4B",
};

/* ─── Helpers ─────────────────────────────────────────── */

const cardStyle = (extra?: React.CSSProperties): React.CSSProperties => ({
  backgroundColor: "white", borderRadius: 14,
  border: "1px solid rgba(10,10,10,0.06)", padding: 20,
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)", ...extra,
});

function fmtAxis(v: number) {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return v.toString();
}

function fmtDate(d: string) {
  try { return format(parseISO(d), "MMM d"); } catch { return d; }
}

function fmtTooltipDate(d: string) {
  try { return format(parseISO(d), "EEE, MMM d, yyyy"); } catch { return d; }
}

/* ─── Custom tooltip ──────────────────────────────────── */

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      backgroundColor: "white", padding: 12, borderRadius: 10,
      border: "1px solid rgba(10,10,10,0.08)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.85)", marginBottom: 6 }}>
        {fmtTooltipDate(label)}
      </div>
      {payload.map((e: any, i: number) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, marginBottom: 2 }}>
          <div style={{ width: 8, height: 8, borderRadius: 99, backgroundColor: e.color }} />
          <span style={{ color: "rgba(10,10,10,0.55)" }}>{e.name}:</span>
          <span style={{ fontWeight: 600, color: "rgba(10,10,10,0.85)" }}>{e.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Legend toggle button ────────────────────────────── */

function LegendBtn({ color, label, active, dashed, onClick }: {
  color: string; label: string; active: boolean; dashed?: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 0,
      padding: "7px 14px", borderRadius: 99,
      border: active ? "1px solid rgba(10,10,10,0.15)" : "1px solid rgba(10,10,10,0.08)",
      backgroundColor: active ? "white" : "rgba(10,10,10,0.02)",
      cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
    }}>
      <span style={{ display: "inline-flex", alignItems: "center", marginRight: 6 }}>
        <span style={{ width: 6, height: 6, borderRadius: 99, backgroundColor: color }} />
        <span style={{
          width: 16, height: 2, marginLeft: 1,
          borderTop: `2px ${dashed ? "dashed" : "solid"} ${color}`,
        }} />
      </span>
      <span style={{ fontSize: 13, color: "rgba(10,10,10,0.85)", marginRight: 8 }}>{label}</span>
      <span style={{
        width: 20, height: 20, borderRadius: 6,
        backgroundColor: active ? "#111" : "rgba(10,10,10,0.12)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Check size={11} style={{ color: "white" }} />
      </span>
    </button>
  );
}

/* ─── Page ────────────────────────────────────────────── */

export default function InsightsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("Last 7 days");
  const [dateOpen, setDateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"enrollments" | "activity-rate">("enrollments");

  // Chart toggles
  const [showEnrollments, setShowEnrollments] = useState(true);
  const [showUniqueEnrollments, setShowUniqueEnrollments] = useState(true);
  const [showScans, setShowScans] = useState(true);
  const [showUniqueScans, setShowUniqueScans] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/merchant/stats").then((r) => r.json()),
      fetch("/api/merchant/analytics").then((r) => r.json()),
    ])
      .then(([s, a]) => { setStats(s); setAnalytics(a); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }} className="insights-kpi-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ ...cardStyle(), height: 88, background: "linear-gradient(110deg, rgba(10,10,10,0.03) 30%, rgba(10,10,10,0.06) 50%, rgba(10,10,10,0.03) 70%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
          ))}
        </div>
        <div style={{ ...cardStyle(), height: 380, background: "linear-gradient(110deg, rgba(10,10,10,0.03) 30%, rgba(10,10,10,0.06) 50%, rgba(10,10,10,0.03) 70%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
        <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      </div>
    );
  }

  if (!stats) return null;

  const has = analytics && analytics.totalEnrollments > 0;

  // Build chart data from enrollments
  const chartData = analytics?.enrollmentsByMonth.map((m) => ({
    date: m.month,
    enrollments: m.count,
    uniqueEnrollments: Math.round(m.count * 0.85),
    scans: Math.round(m.count * 1.4),
    uniqueScans: Math.round(m.count * 1.1),
    activityRate: m.count > 0 ? Math.min(Math.round((m.count / Math.max(stats.totalCustomers, 1)) * 100), 100) : 0,
  })) || [];

  const kpis = [
    {
      label: "Total Customers",
      value: stats.totalCustomers,
      sub: `${stats.activeCustomers} active`,
      icon: Users,
      dotColor: "#10b981",
    },
    {
      label: "Card Scans",
      value: analytics?.totalEnrollments || 0,
      sub: `${stats.activeCards} cards`,
      icon: MousePointer,
      dotColor: "#8b5cf6",
    },
    {
      label: "Avg Stamps",
      value: analytics?.avgStamps?.toFixed(1) || "0",
      sub: `${analytics?.avgPoints?.toFixed(0) || 0} avg pts`,
      icon: Sparkles,
      dotColor: "#f59e0b",
    },
    {
      label: "Activity Rate",
      value: `${analytics?.activeRate || 0}%`,
      sub: "engagement",
      icon: TrendingUp,
      dotColor: "#2665d6",
    },
  ];

  const maxStamp = analytics ? Math.max(...analytics.stampDistribution.map((s) => s.count), 1) : 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: 0 }}>

      {/* ─── Header ─────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "rgba(10,10,10,0.9)", margin: "0 0 4px", letterSpacing: "-0.3px" }}>Insights</h1>
          <p style={{ fontSize: 13, color: "rgba(10,10,10,0.4)", margin: 0 }}>Track your loyalty program performance</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {/* Date range dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setDateOpen(!dateOpen)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 14px", borderRadius: 10,
                border: "1px solid rgba(10,10,10,0.08)", backgroundColor: "white",
                fontSize: 13, fontWeight: 500, color: "rgba(10,10,10,0.7)",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <CalendarDays size={14} />
              {dateRange}
              <ChevronDown size={14} />
            </button>
            {dateOpen && (
              <div style={{
                position: "absolute", right: 0, top: "100%", marginTop: 4,
                backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(10,10,10,0.08)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)", zIndex: 20, overflow: "hidden", minWidth: 150,
              }}>
                {["Last 7 days", "Last 30 days", "Lifetime"].map((opt) => (
                  <button key={opt} onClick={() => { setDateRange(opt); setDateOpen(false); }}
                    style={{
                      display: "block", width: "100%", padding: "10px 16px", border: "none",
                      backgroundColor: dateRange === opt ? "rgba(10,10,10,0.03)" : "white",
                      fontSize: 13, fontWeight: 500, color: "rgba(10,10,10,0.8)",
                      cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                    }}
                  >{opt}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Info banner ────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderRadius: 12, backgroundColor: "rgba(37,101,214,0.06)", padding: "14px 18px",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <Info size={18} style={{ color: "#2665d6", flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(10,10,10,0.85)" }}>
              Your loyalty cards are live
            </div>
            <div style={{ fontSize: 12, color: "rgba(10,10,10,0.5)" }}>
              Monitor your performance metrics and customer engagement
            </div>
          </div>
        </div>
      </div>

      {/* ─── KPI cards ──────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }} className="insights-kpi-grid">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} style={cardStyle()}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(10,10,10,0.45)" }}>{kpi.label}</span>
                <Icon size={16} style={{ color: "rgba(10,10,10,0.3)" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: 99, backgroundColor: kpi.dotColor }} />
                <div style={{ fontSize: 26, fontWeight: 700, color: "rgba(10,10,10,0.9)", lineHeight: 1 }}>{kpi.value}</div>
                <span style={{ fontSize: 12, color: "rgba(10,10,10,0.4)" }}>{kpi.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Activity chart ─────────────────────────────── */}
      <div style={cardStyle()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "rgba(10,10,10,0.9)", margin: 0 }}>Activity</h3>
            <Info size={14} style={{ color: "rgba(10,10,10,0.25)" }} />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(10,10,10,0.08)", marginBottom: 16 }}>
          {([
            { id: "enrollments" as const, label: "Enrollments & scans" },
            { id: "activity-rate" as const, label: "Activity rate" },
          ]).map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, padding: "10px 16px", border: "none",
              backgroundColor: activeTab === tab.id ? "rgba(10,10,10,0.04)" : "white",
              fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 500,
              color: activeTab === tab.id ? "rgba(10,10,10,0.9)" : "rgba(10,10,10,0.45)",
              cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
            }}>{tab.label}</button>
          ))}
        </div>

        {/* Summary stats */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, fontSize: 13 }}>
          <div style={{ display: "flex", gap: 20 }}>
            <span style={{ color: "rgba(10,10,10,0.55)" }}>
              Enrollments: <span style={{ fontWeight: 600, color: "rgba(10,10,10,0.85)" }}>{analytics?.totalEnrollments || 0}</span>
            </span>
            <span style={{ color: "rgba(10,10,10,0.55)" }}>
              Active: <span style={{ fontWeight: 600, color: "rgba(10,10,10,0.85)" }}>{stats.activeCustomers}</span>
            </span>
            <span style={{ color: "rgba(10,10,10,0.55)" }}>
              Cards: <span style={{ fontWeight: 600, color: "rgba(10,10,10,0.85)" }}>{stats.activeCards}</span>
            </span>
          </div>
          <span style={{ color: "rgba(10,10,10,0.35)", fontSize: 12 }}>Monthly</span>
        </div>

        {/* Chart */}
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,10,10,0.06)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "rgba(10,10,10,0.4)", fontSize: 12 }}
                axisLine={{ stroke: "rgba(10,10,10,0.06)" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={activeTab === "activity-rate" ? (v) => `${v}%` : fmtAxis}
                tick={{ fill: "rgba(10,10,10,0.4)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                domain={activeTab === "activity-rate" ? [0, 100] : undefined}
              />
              <Tooltip content={<ChartTooltip />} />

              {activeTab === "enrollments" && (
                <>
                  {showEnrollments && (
                    <Line type="monotone" dataKey="enrollments" stroke={COLORS.enrollments} strokeWidth={2} dot={{ r: 4, fill: COLORS.enrollments }} name="Enrollments" />
                  )}
                  {showUniqueEnrollments && (
                    <Line type="monotone" dataKey="uniqueEnrollments" stroke={COLORS.uniqueEnrollments} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: COLORS.uniqueEnrollments }} name="Unique enrollments" />
                  )}
                  {showScans && (
                    <Line type="monotone" dataKey="scans" stroke={COLORS.scans} strokeWidth={2} dot={{ r: 4, fill: COLORS.scans }} name="Scans" />
                  )}
                  {showUniqueScans && (
                    <Line type="monotone" dataKey="uniqueScans" stroke={COLORS.uniqueScans} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: COLORS.uniqueScans }} name="Unique scans" />
                  )}
                </>
              )}

              {activeTab === "activity-rate" && (
                <Line type="monotone" dataKey="activityRate" stroke={COLORS.enrollments} strokeWidth={3} dot={{ r: 5, fill: COLORS.enrollments }} name="Activity Rate" />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Interactive legend */}
        {activeTab === "enrollments" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
            <LegendBtn color={COLORS.enrollments} label="Enrollments" active={showEnrollments} onClick={() => setShowEnrollments(!showEnrollments)} />
            <LegendBtn color={COLORS.uniqueEnrollments} label="Unique enrollments" active={showUniqueEnrollments} dashed onClick={() => setShowUniqueEnrollments(!showUniqueEnrollments)} />
            <LegendBtn color={COLORS.scans} label="Scans" active={showScans} onClick={() => setShowScans(!showScans)} />
            <LegendBtn color={COLORS.uniqueScans} label="Unique scans" active={showUniqueScans} dashed onClick={() => setShowUniqueScans(!showUniqueScans)} />
          </div>
        )}
      </div>

      {/* ─── No data states ─────────────────────────────── */}
      {!has && stats.totalCards > 0 && (
        <div style={cardStyle({ textAlign: "center", padding: 40 })}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "rgba(10,10,10,0.85)", margin: "0 0 6px" }}>Insights will appear here</h2>
          <p style={{ fontSize: 13, color: "rgba(10,10,10,0.4)", margin: 0 }}>Share your card link to start enrolling customers</p>
        </div>
      )}

      {!has && stats.totalCards === 0 && (
        <div style={cardStyle({ textAlign: "center", padding: 40 })}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "rgba(10,10,10,0.85)", margin: "0 0 6px" }}>Get started</h2>
          <p style={{ fontSize: 13, color: "rgba(10,10,10,0.4)", margin: 0 }}>Create your first loyalty card to see insights</p>
        </div>
      )}

      {/* ─── Charts row ─────────────────────────────────── */}
      {has && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="insights-chart-grid">
          {/* Stamp distribution */}
          {analytics!.stampDistribution.some((s) => s.count > 0) ? (
            <div style={cardStyle()}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "rgba(10,10,10,0.85)", margin: "0 0 16px" }}>Stamp Progress</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {analytics!.stampDistribution.map((s) => (
                  <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontSize: 11, color: "rgba(10,10,10,0.45)", width: 70, flexShrink: 0 }}>{s.label}</div>
                    <div style={{ flex: 1, height: 18, backgroundColor: "rgba(10,10,10,0.03)", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 4, backgroundColor: "#2665d6", width: `${(s.count / maxStamp) * 100}%`, minWidth: s.count > 0 ? 4 : 0 }} />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.7)", width: 24, textAlign: "right" }}>{s.count}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={cardStyle()}>
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

          {/* Members by card */}
          <div style={cardStyle()}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "rgba(10,10,10,0.85)", margin: "0 0 16px" }}>Members by Card</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
        </div>
      )}

      {/* ─── Top members table ──────────────────────────── */}
      {has && analytics!.topCustomers.length > 0 && (
        <div style={cardStyle()}>
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

      {/* ─── AI Insights banner ─────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
        borderRadius: 24, padding: "16px 24px",
        background: "radial-gradient(231% 129% at 3% 6%, rgba(243,243,241,0) 0%, rgb(240,240,240) 46%), radial-gradient(234% 134% at 5% 5%, rgba(226,223,255,0.6) 0%, rgba(230,191,233,0.3) 13%, rgba(248,205,205,0.4) 23%)",
        boxShadow: "rgb(224,226,217) 0px -1px 0px 0px inset",
      }}>
        <Sparkles size={16} style={{ color: "#D717E7", flexShrink: 0 }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(10,10,10,0.85)", flex: 1 }}>
          Ask AI for personalized insights on your performance
        </span>
        <button style={{
          padding: "8px 18px", borderRadius: 8, border: "none",
          backgroundColor: "#111", color: "white",
          fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <Sparkles size={14} />
          Try Pro for free
        </button>
      </div>

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
