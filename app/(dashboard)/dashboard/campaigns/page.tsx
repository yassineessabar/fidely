"use client";

import { useState } from "react";
import { Plus, Send, Clock, Users, TrendingUp, Eye } from "lucide-react";

const campaigns = [
  { name: "Weekend Double Points", status: "Sent", audience: "All customers", sent: "1,247", opened: "68%", revenue: "€1,420", date: "Mar 28" },
  { name: "We Miss You", status: "Sent", audience: "Inactive (14+ days)", sent: "67", opened: "42%", revenue: "€380", date: "Mar 25" },
  { name: "Birthday Rewards", status: "Active", audience: "Birthday this month", sent: "23", opened: "91%", revenue: "€210", date: "Mar 20" },
  { name: "Flash Lunch Deal", status: "Sent", audience: "All customers", sent: "1,247", opened: "55%", revenue: "€890", date: "Mar 18" },
  { name: "VIP Exclusive Offer", status: "Draft", audience: "VIP segment", sent: "—", opened: "—", revenue: "—", date: "—" },
  { name: "New Customer Welcome", status: "Active", audience: "New signups", sent: "342", opened: "78%", revenue: "€520", date: "Ongoing" },
];

const templates = [
  { name: "Reward unlocked", desc: "Notify when a reward is available", color: "rgba(230,255,169,0.15)" },
  { name: "We miss you", desc: "Re-engage inactive customers", color: "rgba(170,137,242,0.15)" },
  { name: "Birthday gift", desc: "Automatic birthday reward", color: "rgba(255,200,100,0.15)" },
  { name: "Flash offer", desc: "Time-limited promotion", color: "rgba(100,180,255,0.15)" },
  { name: "Nearby reminder", desc: "When customer is nearby", color: "rgba(230,255,169,0.15)" },
  { name: "Referral push", desc: "Ask for a referral", color: "rgba(170,137,242,0.15)" },
];

const statusStyle: Record<string, { bg: string; text: string }> = {
  Sent: { bg: "rgba(100,180,255,0.15)", text: "rgb(30,100,200)" },
  Active: { bg: "rgba(230,255,169,0.2)", text: "rgb(80,140,20)" },
  Draft: { bg: "rgba(0,0,0,0.06)", text: "rgb(97,95,109)" },
};

export default function CampaignsPage() {
  const [tab, setTab] = useState<"all" | "templates">("all");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 className="font-display" style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)", margin: 0 }}>Campaigns</h1>
          <p style={{ fontSize: "14px", color: "rgb(97,95,109)", margin: "4px 0 0" }}>Send push notifications to your customers</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 20px", borderRadius: "10px", border: "none", backgroundColor: "rgb(11,5,29)", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", color: "white" }}>
          <Plus size={16} /> New campaign
        </button>
      </div>

      {/* KPIs */}
      <div className="dash-kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Total Sent", value: "2,926", icon: Send },
          { label: "Avg. Open Rate", value: "64%", icon: Eye },
          { label: "Customers Reached", value: "1,247", icon: Users },
          { label: "Revenue from Campaigns", value: "€3,420", icon: TrendingUp },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} style={{ backgroundColor: "white", borderRadius: "16px", padding: "20px", border: "1px solid rgba(0,0,0,0.04)" }}>
              <Icon size={18} color="rgb(97,95,109)" strokeWidth={1.5} style={{ marginBottom: "12px" }} />
              <p className="font-display" style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 4px" }}>{k.value}</p>
              <p style={{ fontSize: "12px", color: "rgb(97,95,109)", margin: 0 }}>{k.label}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
        {(["all", "templates"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 16px", borderRadius: "8px", border: "none", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", backgroundColor: tab === t ? "rgb(11,5,29)" : "white", color: tab === t ? "white" : "rgb(97,95,109)", transition: "all 0.15s", textTransform: "capitalize" }}>
            {t === "all" ? "All campaigns" : "Templates"}
          </button>
        ))}
      </div>

      {tab === "all" ? (
        <div style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.04)", overflow: "hidden" }} className="dash-table-wrap">
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Campaign", "Status", "Audience", "Sent", "Opened", "Revenue", "Date"].map((h) => (
                  <th key={h} style={{ padding: "14px 16px", fontSize: "12px", fontWeight: 500, color: "rgb(97,95,109)", textAlign: "left", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.name} style={{ borderBottom: "1px solid rgba(0,0,0,0.03)", cursor: "pointer" }}>
                  <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: 500, color: "rgb(11,5,29)" }}>{c.name}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 500, ...statusStyle[c.status] }}>{c.status}</span>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "rgb(97,95,109)" }}>{c.audience}</td>
                  <td style={{ padding: "14px 16px", fontSize: "14px", color: "rgb(11,5,29)" }}>{c.sent}</td>
                  <td style={{ padding: "14px 16px", fontSize: "14px", color: "rgb(11,5,29)", fontWeight: 500 }}>{c.opened}</td>
                  <td style={{ padding: "14px 16px", fontSize: "14px", color: "rgb(11,5,29)", fontWeight: 500 }}>{c.revenue}</td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "rgb(97,95,109)" }}>{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="dash-kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {templates.map((t) => (
            <div key={t.name} style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", border: "1px solid rgba(0,0,0,0.04)", cursor: "pointer", transition: "transform 0.15s" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: t.color, marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Clock size={18} color="rgb(11,5,29)" strokeWidth={1.5} />
              </div>
              <p className="font-display" style={{ fontSize: "16px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 4px" }}>{t.name}</p>
              <p style={{ fontSize: "13px", color: "rgb(97,95,109)", margin: "0 0 16px" }}>{t.desc}</p>
              <button style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", backgroundColor: "white", fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", color: "rgb(11,5,29)" }}>
                Use template
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
