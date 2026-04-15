"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const retentionData = [
  { name: "Week 1", rate: 100 }, { name: "Week 2", rate: 72 }, { name: "Week 3", rate: 58 },
  { name: "Week 4", rate: 51 }, { name: "Week 5", rate: 46 }, { name: "Week 6", rate: 42 },
  { name: "Week 7", rate: 40 }, { name: "Week 8", rate: 38 },
];

const revenueData = [
  { name: "Jan", loyalty: 6200, referral: 400 }, { name: "Feb", loyalty: 7100, referral: 520 },
  { name: "Mar", loyalty: 8800, referral: 680 }, { name: "Apr", loyalty: 9200, referral: 720 },
  { name: "May", loyalty: 10400, referral: 810 }, { name: "Jun", loyalty: 12800, referral: 890 },
  { name: "Jul", loyalty: 11900, referral: 820 }, { name: "Aug", loyalty: 13600, referral: 940 },
  { name: "Sep", loyalty: 14200, referral: 980 }, { name: "Oct", loyalty: 14800, referral: 920 },
  { name: "Nov", loyalty: 16328, referral: 970 },
];

const topCustomers = [
  { name: "Sophie M.", visits: 24, spend: "$596" },
  { name: "Marc D.", visits: 18, spend: "$412" },
  { name: "Julie R.", visits: 15, spend: "$348" },
  { name: "Thomas B.", visits: 12, spend: "$276" },
  { name: "Léa P.", visits: 10, spend: "$230" },
];

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="font-display" style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 8px" }}>Analytics</h1>
      <p style={{ fontSize: "14px", color: "rgb(97,95,109)", margin: "0 0 32px" }}>Deep dive into your retention performance</p>

      {/* Metric cards */}
      <div className="dash-kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Repeat Customer Rate", value: "42%" },
          { label: "Avg. Visits per Customer", value: "3.8" },
          { label: "Avg. Order Value Uplift", value: "+$4.20" },
          { label: "Inactive Rate", value: "18%" },
        ].map((m) => (
          <div key={m.label} style={{ backgroundColor: "white", borderRadius: "16px", padding: "20px", border: "1px solid rgba(0,0,0,0.04)" }}>
            <p className="font-display" style={{ fontSize: "28px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 4px" }}>{m.value}</p>
            <p style={{ fontSize: "12px", color: "rgb(97,95,109)", margin: 0 }}>{m.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="dash-chart-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
        {/* Retention curve */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", border: "1px solid rgba(0,0,0,0.04)" }}>
          <h3 className="font-display" style={{ fontSize: "16px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 20px" }}>Retention Cohort</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={retentionData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "rgb(97,95,109)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "rgb(97,95,109)" }} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid rgba(0,0,0,0.06)", fontSize: "12px" }} formatter={(v: number) => [`${v}%`, "Retention"]} />
              <Line type="monotone" dataKey="rate" stroke="rgb(11,5,29)" strokeWidth={2} dot={{ r: 3, fill: "rgb(11,5,29)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by source */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", border: "1px solid rgba(0,0,0,0.04)" }}>
          <h3 className="font-display" style={{ fontSize: "16px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 20px" }}>Revenue by Source</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "rgb(97,95,109)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "rgb(97,95,109)" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid rgba(0,0,0,0.06)", fontSize: "12px" }} />
              <Bar dataKey="loyalty" fill="rgb(11,5,29)" radius={[4, 4, 0, 0]} name="Loyalty" />
              <Bar dataKey="referral" fill="rgb(230,255,169)" radius={[4, 4, 0, 0]} name="Referral" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top customers leaderboard */}
      <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", border: "1px solid rgba(0,0,0,0.04)" }}>
        <h3 className="font-display" style={{ fontSize: "16px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 16px" }}>Top Customers</h3>
        {topCustomers.map((c, i) => (
          <div key={c.name} style={{ display: "flex", alignItems: "center", padding: "12px 0", borderBottom: i < topCustomers.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none", gap: "12px" }}>
            <span style={{ width: "24px", fontSize: "14px", fontWeight: 700, color: i < 3 ? "rgb(11,5,29)" : "rgb(97,95,109)" }}>#{i + 1}</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "rgb(249,248,245)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 600, color: "rgb(11,5,29)" }}>
              {c.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: "rgb(11,5,29)" }}>{c.name}</p>
            </div>
            <span style={{ fontSize: "13px", color: "rgb(97,95,109)" }}>{c.visits} visits</span>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "rgb(11,5,29)", minWidth: "60px", textAlign: "right" }}>{c.spend}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
