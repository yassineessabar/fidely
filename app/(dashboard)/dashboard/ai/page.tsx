"use client";

import { useState } from "react";
import { Sparkles, Send, TrendingDown, Users, Award, Zap } from "lucide-react";

const recommendations = [
  { title: "Traffic is down this week — send a lunch promo", desc: "Based on the last 4 weeks, Tuesday-Thursday traffic is 23% lower. A lunch deal could drive 15+ extra visits.", icon: TrendingDown, color: "rgba(255,200,100,0.15)", accent: "rgb(200,150,30)", cta: "Create promo" },
  { title: "43 customers haven't visited in 10 days", desc: "These are active members who stopped coming. A 'We miss you' push could bring back ~30%.", icon: Users, color: "rgba(170,137,242,0.15)", accent: "rgb(108,71,255)", cta: "Send campaign" },
  { title: "Your VIP customers are close to a reward", desc: "12 VIP members are within 20 points of their next reward. A reminder could lock in 12 visits.", icon: Award, color: "rgba(230,255,169,0.15)", accent: "rgb(80,140,20)", cta: "Send reminder" },
  { title: "Launch a referral push to your top 20", desc: "Your top 20 customers have high engagement. A referral incentive could bring 8-12 new members.", icon: Zap, color: "rgba(100,180,255,0.15)", accent: "rgb(30,100,200)", cta: "Set up referral" },
];

const suggestedPrompts = [
  "Who hasn't visited in 2 weeks?",
  "Create a birthday offer campaign",
  "Show me my top 20 customers",
  "What's my best performing campaign?",
  "How can I increase repeat visits?",
];

export default function AIPage() {
  const [prompt, setPrompt] = useState("");

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, rgb(11,5,29), rgb(44,34,66))", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Sparkles size={18} color="rgb(230,255,169)" />
        </div>
        <h1 className="font-display" style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)", margin: 0 }}>Fidely AI</h1>
      </div>
      <p style={{ fontSize: "14px", color: "rgb(97,95,109)", margin: "0 0 32px" }}>Smart recommendations to grow your revenue</p>

      {/* Prompt box */}
      <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "20px", border: "1px solid rgba(0,0,0,0.04)", marginBottom: "32px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask Fidely AI anything..."
            style={{ flex: 1, height: "48px", padding: "0 16px", fontSize: "15px", color: "rgb(11,5,29)", backgroundColor: "rgb(249,248,245)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "12px", outline: "none", fontFamily: "inherit" }}
          />
          <button style={{ width: "48px", height: "48px", borderRadius: "12px", border: "none", backgroundColor: "rgb(11,5,29)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Send size={18} color="white" />
          </button>
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: "12px", flexWrap: "wrap" }}>
          {suggestedPrompts.map((p) => (
            <button key={p} onClick={() => setPrompt(p)} style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.06)", backgroundColor: "white", fontSize: "12px", color: "rgb(97,95,109)", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", whiteSpace: "nowrap" }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <h2 className="font-display" style={{ fontSize: "18px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 16px" }}>Smart Recommendations</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {recommendations.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.title} style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", border: "1px solid rgba(0,0,0,0.04)", display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: r.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={22} color={r.accent} strokeWidth={1.5} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "15px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 4px" }}>{r.title}</p>
                <p style={{ fontSize: "13px", color: "rgb(97,95,109)", margin: 0, lineHeight: "20px" }}>{r.desc}</p>
              </div>
              <button style={{ padding: "8px 16px", borderRadius: "8px", border: "none", backgroundColor: "rgb(11,5,29)", color: "white", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0 }}>
                {r.cta}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
