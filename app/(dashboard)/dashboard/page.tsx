"use client";

import { useState } from "react";
import { TrendingUp, Users, RotateCcw, CreditCard, ArrowUpRight, Zap, UserPlus, Target, Award } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const kpis = [
  { label: "Total Customers", value: "1,471", change: "+12.3%", positive: true, icon: Users },
  { label: "Repeat Visits", value: "188", change: "+28.6%", positive: true, icon: RotateCcw },
  { label: "Revenue Generated", value: "€16,328", change: "+18.4%", positive: true, icon: TrendingUp },
  { label: "Active Cards", value: "1,247", change: "+9.1%", positive: true, icon: CreditCard },
];

const chartData = [
  { name: "Jan", revenue: 8200, visits: 820 },
  { name: "Feb", revenue: 9100, visits: 910 },
  { name: "Mar", revenue: 8800, visits: 880 },
  { name: "Apr", revenue: 11200, visits: 1050 },
  { name: "May", revenue: 12400, visits: 1140 },
  { name: "Jun", revenue: 13800, visits: 1260 },
  { name: "Jul", revenue: 12900, visits: 1180 },
  { name: "Aug", revenue: 14600, visits: 1320 },
  { name: "Sep", revenue: 15200, visits: 1380 },
  { name: "Oct", revenue: 14800, visits: 1350 },
  { name: "Nov", revenue: 16328, visits: 1471 },
];

const actions = [
  { title: "Send a reward reminder", desc: "43 customers are close to their next reward", icon: Award, color: "rgba(230,255,169,0.15)", accent: "rgb(230,255,169)" },
  { title: "Reactivate inactive customers", desc: "67 customers haven't visited in 14+ days", icon: UserPlus, color: "rgba(170,137,242,0.15)", accent: "rgb(170,137,242)" },
  { title: "Launch a lunch-time promo", desc: "Traffic is 23% lower on Tuesdays", icon: Zap, color: "rgba(255,200,100,0.15)", accent: "rgb(255,200,100)" },
  { title: "Reward your top 20 customers", desc: "Your VIPs generated 38% of revenue", icon: Target, color: "rgba(100,180,255,0.15)", accent: "rgb(100,180,255)" },
];

const tabs = ["7 days", "4 weeks", "6 months", "12 months"];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState(1);
  const [chartMode, setChartMode] = useState<"revenue" | "visits">("revenue");

  return (
    <div>
      {/* KPI Cards */}
      <div className="dash-kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "rgb(249,248,245)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={20} color="rgb(11,5,29)" strokeWidth={1.5} />
                </div>
                <span style={{ fontSize: "13px", fontWeight: 600, color: kpi.positive ? "rgb(34,154,22)" : "rgb(220,38,38)", display: "flex", alignItems: "center", gap: "2px" }}>
                  <ArrowUpRight size={14} />
                  {kpi.change}
                </span>
              </div>
              <p className="font-display" style={{ fontSize: "28px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 4px" }}>{kpi.value}</p>
              <p style={{ fontSize: "13px", color: "rgb(97,95,109)", margin: 0 }}>{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Chart + Secondary stats */}
      <div className="dash-chart-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px", marginBottom: "32px" }}>
        {/* Main chart */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", border: "1px solid rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              {(["revenue", "visits"] as const).map((m) => (
                <button key={m} onClick={() => setChartMode(m)} style={{ padding: "6px 14px", borderRadius: "8px", border: "none", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", backgroundColor: chartMode === m ? "rgb(11,5,29)" : "rgb(249,248,245)", color: chartMode === m ? "white" : "rgb(97,95,109)", transition: "all 0.15s" }}>
                  {m === "revenue" ? "Revenue" : "Visits"}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
              {tabs.map((t, i) => (
                <button key={t} onClick={() => setActiveTab(i)} style={{ padding: "6px 12px", borderRadius: "8px", border: "none", fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", backgroundColor: activeTab === i ? "rgb(249,248,245)" : "transparent", color: activeTab === i ? "rgb(11,5,29)" : "rgb(97,95,109)", transition: "all 0.15s" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(11,5,29)" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="rgb(11,5,29)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "rgb(97,95,109)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "rgb(97,95,109)" }} tickFormatter={(v) => chartMode === "revenue" ? `€${(v / 1000).toFixed(0)}k` : v} />
              <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid rgba(0,0,0,0.06)", fontSize: "13px" }} formatter={(v: number) => [chartMode === "revenue" ? `€${v.toLocaleString()}` : v, chartMode === "revenue" ? "Revenue" : "Visits"]} />
              <Area type="monotone" dataKey={chartMode} stroke="rgb(11,5,29)" strokeWidth={2} fill="url(#grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Secondary stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { label: "New Customers", value: "1,471", sub: "this month" },
            { label: "Repeat Visits", value: "188", sub: "+28.6% vs last month" },
            { label: "Avg. Order Value", value: "€24.80", sub: "+3.2% uplift" },
            { label: "ROI", value: "€1 → €7.86", sub: "per €1 spent on Fidely" },
          ].map((s) => (
            <div key={s.label} style={{ backgroundColor: "white", borderRadius: "16px", padding: "20px", border: "1px solid rgba(0,0,0,0.04)", flex: 1 }}>
              <p style={{ fontSize: "12px", color: "rgb(97,95,109)", margin: "0 0 6px" }}>{s.label}</p>
              <p className="font-display" style={{ fontSize: "22px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 2px" }}>{s.value}</p>
              <p style={{ fontSize: "11px", color: "rgb(97,95,109)", margin: 0 }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended actions */}
      <div>
        <h2 className="font-display" style={{ fontSize: "18px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 16px" }}>Recommended actions</h2>
        <div className="dash-kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          {actions.map((a) => {
            const Icon = a.icon;
            return (
              <div key={a.title} style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", border: "1px solid rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: a.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={20} color={a.accent} strokeWidth={1.5} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 4px" }}>{a.title}</p>
                  <p style={{ fontSize: "12px", color: "rgb(97,95,109)", margin: 0, lineHeight: "18px" }}>{a.desc}</p>
                </div>
                <button style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", backgroundColor: "white", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", color: "rgb(11,5,29)", transition: "all 0.15s", alignSelf: "flex-start" }}>
                  Take action
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
