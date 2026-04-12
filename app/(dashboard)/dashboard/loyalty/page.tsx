"use client";

import { useState } from "react";
import { Stamp, Star, Percent, UserPlus, Crown, CreditCard, Gift, Ticket } from "lucide-react";

const programTypes = [
  { name: "Stamp Card", desc: "Buy X, get 1 free", icon: Stamp, color: "rgba(230,255,169,0.15)", active: true, members: 847, redemptions: 124 },
  { name: "Points", desc: "Earn points per visit/purchase", icon: Star, color: "rgba(170,137,242,0.15)", active: true, members: 1247, redemptions: 312 },
  { name: "Cashback", desc: "Percentage back on spend", icon: Percent, color: "rgba(100,180,255,0.15)", active: false, members: 0, redemptions: 0 },
  { name: "Referral", desc: "Reward for referring friends", icon: UserPlus, color: "rgba(255,200,100,0.15)", active: true, members: 89, redemptions: 34 },
  { name: "VIP Tiers", desc: "Bronze, Silver, Gold, Platinum", icon: Crown, color: "rgba(230,255,169,0.15)", active: true, members: 1247, redemptions: 0 },
  { name: "Subscriptions", desc: "Monthly membership perks", icon: CreditCard, color: "rgba(170,137,242,0.15)", active: false, members: 0, redemptions: 0 },
  { name: "Gift Rewards", desc: "Special occasion gifts", icon: Gift, color: "rgba(100,180,255,0.15)", active: false, members: 0, redemptions: 0 },
  { name: "Passes", desc: "Access passes & events", icon: Ticket, color: "rgba(255,200,100,0.15)", active: false, members: 0, redemptions: 0 },
];

export default function LoyaltyPage() {
  const [selected, setSelected] = useState(1);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 className="font-display" style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)", margin: 0 }}>Loyalty Programs</h1>
          <p style={{ fontSize: "14px", color: "rgb(97,95,109)", margin: "4px 0 0" }}>Manage your rewards and loyalty rules</p>
        </div>
      </div>

      {/* Program cards */}
      <div className="dash-kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {programTypes.map((p, i) => {
          const Icon = p.icon;
          return (
            <div
              key={p.name}
              onClick={() => setSelected(i)}
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "24px",
                border: selected === i ? "2px solid rgb(11,5,29)" : "1px solid rgba(0,0,0,0.04)",
                cursor: "pointer",
                transition: "border-color 0.15s",
                position: "relative",
              }}
            >
              {p.active && (
                <div style={{ position: "absolute", top: "12px", right: "12px", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "rgb(34,154,22)" }} />
              )}
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: p.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                <Icon size={20} color="rgb(11,5,29)" strokeWidth={1.5} />
              </div>
              <p className="font-display" style={{ fontSize: "16px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 4px" }}>{p.name}</p>
              <p style={{ fontSize: "12px", color: "rgb(97,95,109)", margin: "0 0 12px" }}>{p.desc}</p>
              {p.active ? (
                <div style={{ display: "flex", gap: "16px" }}>
                  <div><p style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "rgb(11,5,29)" }}>{p.members.toLocaleString()}</p><p style={{ margin: 0, fontSize: "10px", color: "rgb(97,95,109)" }}>members</p></div>
                  <div><p style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "rgb(11,5,29)" }}>{p.redemptions}</p><p style={{ margin: 0, fontSize: "10px", color: "rgb(97,95,109)" }}>redeemed</p></div>
                </div>
              ) : (
                <span style={{ fontSize: "12px", color: "rgb(97,95,109)", fontStyle: "italic" }}>Not active</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Program detail / builder */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="dash-chart-grid">
        <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "32px", border: "1px solid rgba(0,0,0,0.04)" }}>
          <h2 className="font-display" style={{ fontSize: "18px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 24px" }}>
            Configure: {programTypes[selected].name}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {[
              { label: "Program name", value: programTypes[selected].name, type: "text" },
              { label: "Points per visit", value: "20", type: "number" },
              { label: "Reward threshold", value: "200", type: "number" },
              { label: "Reward type", value: "Free item", type: "text" },
              { label: "Welcome bonus", value: "10 points", type: "text" },
            ].map((f) => (
              <div key={f.label}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "rgb(11,5,29)", marginBottom: "6px" }}>{f.label}</label>
                <input defaultValue={f.value} type={f.type} style={{ width: "100%", height: "44px", padding: "0 14px", fontSize: "14px", color: "rgb(11,5,29)", backgroundColor: "rgb(249,248,245)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "10px", outline: "none", fontFamily: "inherit" }} />
              </div>
            ))}
            <button style={{ padding: "12px 24px", borderRadius: "10px", border: "none", backgroundColor: "rgb(11,5,29)", color: "white", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", alignSelf: "flex-start" }}>
              Save changes
            </button>
          </div>
        </div>

        {/* Card preview */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "32px", border: "1px solid rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontSize: "13px", color: "rgb(97,95,109)", margin: "0 0 20px" }}>Live card preview</p>
          <div style={{ width: "260px", background: "linear-gradient(135deg, rgb(11,5,29), rgb(44,34,66))", borderRadius: "20px", padding: "24px", color: "white" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "rgb(230,255,169)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="font-display" style={{ color: "rgb(11,5,29)", fontWeight: 800, fontSize: "14px" }}>f</span>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: 600 }}>Café Bloom</p>
                <p style={{ margin: 0, fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>Loyalty Card</p>
              </div>
            </div>
            <div style={{ textAlign: "center", padding: "16px 0", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "12px", marginBottom: "16px" }}>
              <p style={{ margin: 0, fontSize: "10px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "1px" }}>Points</p>
              <p className="font-display" style={{ margin: "4px 0", fontSize: "36px", fontWeight: 700 }}>120</p>
              <p style={{ margin: 0, fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>80 more to reward</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <div style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "8px", padding: "8px", textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: 700 }}>8</p>
                <p style={{ margin: 0, fontSize: "9px", color: "rgba(255,255,255,0.5)" }}>Visits</p>
              </div>
              <div style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "8px", padding: "8px", textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: 700 }}>Silver</p>
                <p style={{ margin: 0, fontSize: "9px", color: "rgba(255,255,255,0.5)" }}>Tier</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
