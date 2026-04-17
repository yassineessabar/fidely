"use client";

import { useState } from "react";
import { useInView } from "../hooks/useInView";

const HIW_BG = "rgb(29,25,42)";

/* ─── Shared phone frame (realistic titanium) ─── */
function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: HIW_BG }}>
      <div style={{ width: "185px", height: "380px", position: "relative", filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.4))" }}>
        {/* Titanium frame */}
        <div style={{ position: "absolute", inset: 0, borderRadius: "36px", background: "linear-gradient(160deg, #d4d4d8 0%, #a1a1aa 8%, #71717a 20%, #52525b 45%, #3f3f46 55%, #52525b 70%, #a1a1aa 90%, #d4d4d8 100%)", padding: "2px", boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.4)" }}>
          {/* Black bezel */}
          <div style={{ width: "100%", height: "100%", borderRadius: "34px", backgroundColor: "#000", padding: "3px", position: "relative" }}>
            {/* Screen */}
            <div style={{ width: "100%", height: "100%", borderRadius: "31px", overflow: "hidden", position: "relative" }}>
              {children}
              {/* Dynamic Island */}
              <div style={{ position: "absolute", top: "9px", left: "50%", transform: "translateX(-50%)", width: "56px", height: "16px", backgroundColor: "#000", borderRadius: "8px", zIndex: 5, boxShadow: "0 0 0 0.5px rgba(255,255,255,0.06)" }}>
                <div style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", width: "5px", height: "5px", borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #1a1a3e, #000)", boxShadow: "inset 0 0.5px 1px rgba(255,255,255,0.1)" }} />
              </div>
              {/* Status bar */}
              <div style={{ position: "absolute", top: "11px", left: "16px", right: "16px", display: "flex", justifyContent: "space-between", zIndex: 4 }}>
                <span style={{ fontSize: "9px", fontWeight: 600, color: "#fff", textShadow: "0 0.5px 1px rgba(0,0,0,0.3)" }}>9:41</span>
                <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "1px", alignItems: "flex-end" }}>
                    {[4,6,8,10].map((h,i) => <div key={i} style={{ width: "2px", height: `${h}px`, borderRadius: "1px", backgroundColor: "#fff" }} />)}
                  </div>
                  <div style={{ width: "14px", height: "7px", borderRadius: "1.5px", border: "1px solid rgba(255,255,255,0.5)", position: "relative" }}>
                    <div style={{ position: "absolute", top: "1px", left: "1px", width: "9px", height: "3.5px", borderRadius: "1px", backgroundColor: "#34c759" }} />
                  </div>
                </div>
              </div>
              {/* Glass reflection */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(155deg, rgba(255,255,255,0.08) 0%, transparent 30%)", borderRadius: "31px", pointerEvents: "none", zIndex: 6 }} />
            </div>
          </div>
        </div>
        {/* Side buttons */}
        <div style={{ position: "absolute", left: "-2.5px", top: "75px", width: "2.5px", height: "18px", borderRadius: "0 1.5px 1.5px 0", background: "linear-gradient(180deg, #a1a1aa, #71717a, #a1a1aa)" }} />
        <div style={{ position: "absolute", left: "-2.5px", top: "105px", width: "2.5px", height: "34px", borderRadius: "0 1.5px 1.5px 0", background: "linear-gradient(180deg, #a1a1aa, #71717a, #a1a1aa)" }} />
        <div style={{ position: "absolute", left: "-2.5px", top: "148px", width: "2.5px", height: "34px", borderRadius: "0 1.5px 1.5px 0", background: "linear-gradient(180deg, #a1a1aa, #71717a, #a1a1aa)" }} />
        <div style={{ position: "absolute", right: "-2.5px", top: "125px", width: "2.5px", height: "44px", borderRadius: "1.5px 0 0 1.5px", background: "linear-gradient(180deg, #a1a1aa, #71717a, #a1a1aa)" }} />
      </div>
    </div>
  );
}

/* ─── Step 1: Create your card (card builder like our app) ─── */
function CardBuilderVisual() {
  return (
    <Phone>
      <div style={{ backgroundColor: "#f9f8f5", height: "100%", paddingTop: "32px" }}>
        <div style={{ padding: "8px 12px 6px" }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#0B051D" }}>Card builder</div>
        </div>
        {/* Live card preview */}
        <div style={{ margin: "6px 12px 10px", borderRadius: "12px", background: "linear-gradient(135deg, #6C47FF, #AA89F2)", padding: "14px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.1)" }} />
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#E6FFA9", marginBottom: "2px" }}>Kyro</div>
          <div style={{ fontSize: "6px", color: "rgba(255,255,255,0.6)", marginBottom: "8px", letterSpacing: "0.5px" }}>LOYALTY CARD</div>
          <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
            {[1,2,3,4,5,6,7,8].map(n => (
              <div key={n} style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: n <= 5 ? "#E6FFA9" : "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {n <= 5 && <span style={{ fontSize: "7px", color: "#0B051D", fontWeight: 700 }}>✓</span>}
              </div>
            ))}
          </div>
          <div style={{ fontSize: "6px", color: "rgba(255,255,255,0.5)" }}>5 / 8 stamps collected</div>
        </div>
        {/* Settings */}
        <div style={{ padding: "0 12px" }}>
          {/* Card type */}
          <div style={{ fontSize: "7px", fontWeight: 600, color: "#999", marginBottom: "4px", letterSpacing: "0.5px" }}>CARD TYPE</div>
          <div style={{ display: "flex", gap: "4px", marginBottom: "10px" }}>
            {["Punch", "Reward", "Cashback", "Discount"].map((t, i) => (
              <div key={t} style={{ padding: "4px 8px", borderRadius: "6px", fontSize: "7px", fontWeight: 500, backgroundColor: i === 0 ? "#0B051D" : "#fff", color: i === 0 ? "#fff" : "#666", border: i === 0 ? "none" : "1px solid #e0e0e0" }}>{t}</div>
            ))}
          </div>
          {/* Brand color */}
          <div style={{ fontSize: "7px", fontWeight: 600, color: "#999", marginBottom: "4px", letterSpacing: "0.5px" }}>BRAND COLOR</div>
          <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
            {["#6C47FF", "#E6FFA9", "#0B051D", "#FF6B6B", "#FF9F43", "#1a6b50"].map((c, i) => (
              <div key={c} style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: c, border: i === 0 ? "2.5px solid #0B051D" : "1.5px solid #ddd", boxShadow: i === 0 ? "0 0 0 1.5px #fff" : "none" }} />
            ))}
          </div>
          {/* Toggles */}
          {[{ label: "Push notifications", on: true }, { label: "Location alerts", on: true }, { label: "Auto-rewards", on: false }].map(t => (
            <div key={t.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #eee" }}>
              <span style={{ fontSize: "8px", color: "#333", fontWeight: 500 }}>{t.label}</span>
              <div style={{ width: "24px", height: "14px", borderRadius: "7px", backgroundColor: t.on ? "#6C47FF" : "#ddd", position: "relative" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#fff", position: "absolute", top: "2px", left: t.on ? "12px" : "2px", boxShadow: "0 1px 2px rgba(0,0,0,0.2)", transition: "left 0.2s" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

/* ─── Step 2: Add to wallet (real QR code) ─── */
function QRCodeVisual() {
  // Real QR pattern for "https://wearekyro.com/card"
  const qr = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,0,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,1,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0],
    [1,0,1,0,1,1,1,1,0,0,1,0,1,1,1,0,1,0,1,1,0],
    [0,1,0,1,0,0,0,1,1,0,0,1,0,1,0,1,0,1,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1],
    [0,1,0,0,0,1,0,1,0,0,1,0,0,1,0,1,0,0,0,1,0],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [0,0,0,0,0,0,0,0,1,0,1,1,0,0,0,1,0,1,0,0,1],
    [1,1,1,1,1,1,1,0,0,1,1,0,1,0,1,0,1,1,0,1,0],
    [1,0,0,0,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,0,1,0,1,1,0,0,1,1,0],
    [1,0,1,1,1,0,1,0,0,0,1,1,0,1,0,0,1,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,0,0,1,0,1,0,1,0],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
  ];

  return (
    <Phone>
      <div style={{ backgroundColor: "#fff", height: "100%", paddingTop: "32px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontSize: "12px", fontWeight: 700, color: "#0B051D", marginBottom: "4px" }}>Scan to join</div>
        <div style={{ fontSize: "7px", color: "#999", marginBottom: "14px" }}>Add your loyalty card instantly</div>
        {/* QR code */}
        <div style={{ padding: "10px", backgroundColor: "#fff", borderRadius: "14px", border: "2px solid #eee", marginBottom: "12px" }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(21, 5px)`, gridTemplateRows: `repeat(21, 5px)`, gap: "0px" }}>
            {qr.flat().map((cell, i) => (
              <div key={i} style={{ backgroundColor: cell ? "#0B051D" : "transparent", borderRadius: "0.5px" }} />
            ))}
          </div>
        </div>
        {/* Scan animation line */}
        <div style={{ width: "125px", height: "2px", background: "linear-gradient(90deg, transparent, #6C47FF, transparent)", borderRadius: "1px", marginBottom: "16px" }} />
        {/* Wallet buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "140px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "9px", borderRadius: "10px", backgroundColor: "#0B051D" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="white"/><path d="M17 12.5H12.5V17h-1v-4.5H7v-1h4.5V7h1v4.5H17v1z" fill="#0B051D"/></svg>
            <span style={{ fontSize: "8px", fontWeight: 600, color: "#fff" }}>Add to Apple Wallet</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "9px", borderRadius: "10px", border: "1.5px solid #ddd" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="2" stroke="#333" strokeWidth="1.5"/><path d="M3 10h18" stroke="#333" strokeWidth="1.5"/></svg>
            <span style={{ fontSize: "8px", fontWeight: 600, color: "#333" }}>Add to Google Wallet</span>
          </div>
        </div>
      </div>
    </Phone>
  );
}

/* ─── Step 3: Get insights (matches our real dashboard) ─── */
function InsightsVisual() {
  const chartData = [82, 91, 88, 112, 124, 138, 129, 146, 152, 148, 163];
  const months = ["J","F","M","A","M","J","J","A","S","O","N"];
  const max = 170;
  const h = 55;

  return (
    <Phone>
      <div style={{ backgroundColor: "#f9f8f5", height: "100%", paddingTop: "32px" }}>
        <div style={{ padding: "4px 10px 6px" }}>
          <div style={{ fontSize: "7px", color: "#999" }}>Overview</div>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#0B051D" }}>Dashboard</div>
        </div>
        {/* KPI cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px", padding: "0 10px", marginBottom: "6px" }}>
          {[
            { label: "Customers", value: "1,471", change: "+12.3%" },
            { label: "Repeat Visits", value: "188", change: "+28.6%" },
            { label: "Revenue", value: "$16,328", change: "+18.4%" },
            { label: "Active Cards", value: "1,247", change: "+9.1%" },
          ].map(k => (
            <div key={k.label} style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "7px 8px", border: "1px solid rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#0B051D" }}>{k.value}</span>
                <span style={{ fontSize: "6px", fontWeight: 600, color: "#22a916" }}>{k.change}</span>
              </div>
              <span style={{ fontSize: "6px", color: "#999" }}>{k.label}</span>
            </div>
          ))}
        </div>
        {/* Revenue chart */}
        <div style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "8px", margin: "0 10px 6px", border: "1px solid rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "7px", fontWeight: 600, color: "#0B051D" }}>Revenue</span>
            <div style={{ display: "flex", gap: "3px" }}>
              {["7d", "4w", "6m"].map((t, i) => (
                <span key={t} style={{ fontSize: "5px", padding: "2px 4px", borderRadius: "3px", backgroundColor: i === 2 ? "#0B051D" : "transparent", color: i === 2 ? "#fff" : "#999" }}>{t}</span>
              ))}
            </div>
          </div>
          {/* SVG chart */}
          <svg viewBox={`0 0 155 ${h + 10}`} width="100%" height={h + 10}>
            <defs>
              <linearGradient id="hiwGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0B051D" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#0B051D" stopOpacity={0} />
              </linearGradient>
            </defs>
            {(() => {
              const pts = chartData.map((v, i) => ({ x: 5 + (i / 10) * 145, y: 2 + (1 - v / max) * h }));
              const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
              const area = `${line} L${pts[pts.length-1].x},${h+2} L${pts[0].x},${h+2} Z`;
              return (
                <>
                  <path d={area} fill="url(#hiwGrad)" />
                  <path d={line} fill="none" stroke="#0B051D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </>
              );
            })()}
            {months.map((m, i) => (
              <text key={i} x={5 + (i / 10) * 145} y={h + 9} textAnchor="middle" fontSize="4" fill="#999">{m}</text>
            ))}
          </svg>
        </div>
        {/* Actions */}
        <div style={{ padding: "0 10px" }}>
          <div style={{ fontSize: "7px", fontWeight: 600, color: "#0B051D", marginBottom: "4px" }}>Recommended</div>
          {[
            { icon: "🎯", text: "Send reward reminder", sub: "43 customers close", color: "rgba(230,255,169,0.3)" },
            { icon: "📣", text: "Reactivate customers", sub: "67 inactive 14+ days", color: "rgba(170,137,242,0.3)" },
          ].map(a => (
            <div key={a.text} style={{ display: "flex", gap: "6px", alignItems: "center", padding: "5px 0", borderBottom: "1px solid #eee" }}>
              <div style={{ width: "18px", height: "18px", borderRadius: "5px", backgroundColor: a.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", flexShrink: 0 }}>{a.icon}</div>
              <div>
                <div style={{ fontSize: "7px", fontWeight: 600, color: "#0B051D" }}>{a.text}</div>
                <div style={{ fontSize: "5px", color: "#999" }}>{a.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

/* ─── Step 4: Send notifications (real Apple Wallet notification) ─── */
function NotificationVisual() {
  return (
    <Phone>
      <div style={{ height: "100%", background: "linear-gradient(180deg, #1a1040 0%, #6C47FF 50%, #AA89F2 100%)" }}>
        {/* Lock screen */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "32px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginBottom: "6px", opacity: 0.8 }}>
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="white" strokeWidth="1.5"/>
            <path d="M8 11V7a4 4 0 118 0v4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <div style={{ fontSize: "38px", fontWeight: 700, color: "#fff", lineHeight: 1, letterSpacing: "-2px" }}>9:41</div>
          <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.6)", marginTop: "2px", marginBottom: "24px" }}>Tuesday, April 24</div>
        </div>

        {/* Notification stack */}
        <div style={{ padding: "0 10px", display: "flex", flexDirection: "column", gap: "6px" }}>
          {/* Notification 1 — reward earned */}
          <div style={{ backgroundColor: "rgba(255,255,255,0.92)", backdropFilter: "blur(30px)", borderRadius: "14px", padding: "10px 12px", display: "flex", gap: "8px", alignItems: "flex-start", boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: "linear-gradient(135deg, #4CC2FF, #0A84FF)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18" fill="#fff"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "8px", fontWeight: 700, color: "#000" }}>Wallet</span>
                <span style={{ fontSize: "6px", color: "#8e8e93" }}>now</span>
              </div>
              <div style={{ fontSize: "7px", color: "#333", lineHeight: "11px", marginTop: "1px" }}>
                Score a free coffee at Haven Coffee! Your stamp card is complete. ☕
              </div>
            </div>
          </div>

          {/* Notification 2 — nearby promo */}
          <div style={{ backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(30px)", borderRadius: "14px", padding: "10px 12px", display: "flex", gap: "8px", alignItems: "flex-start", boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: "linear-gradient(135deg, #4CC2FF, #0A84FF)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18" fill="#fff"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "8px", fontWeight: 700, color: "#000" }}>Wallet</span>
                <span style={{ fontSize: "6px", color: "#8e8e93" }}>5m ago</span>
              </div>
              <div style={{ fontSize: "7px", color: "#333", lineHeight: "11px", marginTop: "1px" }}>
                2x stamps today at Fresh Bakery — you&apos;re nearby! 🥐
              </div>
            </div>
          </div>

          {/* Notification 3 — cashback */}
          <div style={{ backgroundColor: "rgba(255,255,255,0.78)", backdropFilter: "blur(30px)", borderRadius: "14px", padding: "10px 12px", display: "flex", gap: "8px", alignItems: "flex-start", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: "linear-gradient(135deg, #4CC2FF, #0A84FF)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18" fill="#fff"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "8px", fontWeight: 700, color: "#000" }}>Wallet</span>
                <span style={{ fontSize: "6px", color: "#8e8e93" }}>1h ago</span>
              </div>
              <div style={{ fontSize: "7px", color: "#333", lineHeight: "11px", marginTop: "1px" }}>
                $2.50 cashback credited from Bella&apos;s Bakehouse 💰
              </div>
            </div>
          </div>
        </div>

        {/* Home indicator */}
        <div style={{ position: "absolute", bottom: "8px", left: "50%", transform: "translateX(-50%)", width: "80px", height: "3px", borderRadius: "2px", backgroundColor: "rgba(255,255,255,0.3)" }} />
      </div>
    </Phone>
  );
}

const steps = [
  {
    label: "Create your card",
    title: "Create your loyalty card",
    desc: "We design a branded digital card for you in under 24 hours. Fully customized to match your business — colors, logo, rewards.",
    visual: <CardBuilderVisual />,
  },
  {
    label: "Add to wallet",
    title: "Customers add it to their phone",
    desc: "A simple QR code scan. No app download. Saved to Apple Wallet or Google Wallet in seconds.",
    visual: <QRCodeVisual />,
  },
  {
    label: "Get insights",
    title: "Get real-time customer insights",
    desc: "See who visits, how often they return, and what drives them back. Smart analytics that grow your business.",
    visual: <InsightsVisual />,
  },
  {
    label: "Send notifications",
    title: "Bring them back with free notifications",
    desc: "Send push notifications right to their lock screen. Promotions, reminders, rewards — unlimited and free.",
    visual: <NotificationVisual />,
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const { ref, isVisible } = useInView();

  return (
    <section id="how-it-works" ref={ref} style={{ backgroundColor: "rgb(249,248,245)", padding: "80px 0" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
        <h2 className={`section-h2 font-display ${isVisible ? "animate-fade-in-up" : ""}`} style={{ fontWeight: 500, fontSize: "52px", lineHeight: "55px", color: "rgb(11,5,29)", margin: "0 0 16px" }}>
          How it works
        </h2>
        <p style={{ fontSize: "20px", lineHeight: "32px", color: "rgb(97,95,109)", margin: "0 0 64px", fontWeight: 400 }}>
          Four simple steps to transform your customer retention. Up and running in 24 hours.
        </p>

        <div className="hiw-grid" style={{ display: "grid", gridTemplateColumns: "290px 1fr" }}>
          {/* Left: tabs */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: "48px", height: "400px", gap: "16px" }}>
            {steps.map((step, i) => (
              <button
                key={step.label}
                onClick={() => setActive(i)}
                style={{
                  display: "flex", alignItems: "center", gap: "12px", padding: "8px 0",
                  background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                  maxWidth: "268px",
                }}
              >
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: active === i ? "rgb(11,5,29)" : "transparent", border: active === i ? "none" : "1px solid rgb(196,195,202)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background-color 0.2s" }}>
                  {active === i ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  ) : (
                    <span style={{ color: "rgb(97,95,109)", fontSize: "12px", fontWeight: 600 }}>{i + 1}</span>
                  )}
                </div>
                <span style={{ fontSize: "16px", fontWeight: 500, color: active === i ? "rgb(11,5,29)" : "rgba(11,5,29,0.565)", transition: "color 0.2s" }}>
                  {step.label}
                </span>
              </button>
            ))}
          </div>

          {/* Right: content panel */}
          <div className="hiw-card" style={{ display: "grid", gridTemplateAreas: "'image content'", gridTemplateColumns: "396px 1fr", height: "400px", borderRadius: "16px", overflow: "hidden", transition: "all 0.6s ease-out" }}>
            <div style={{ gridArea: "image", display: "flex", transition: "background 0.6s ease-out" }}>
              {steps[active].visual}
            </div>
            <div style={{ gridArea: "content", backgroundColor: "white", padding: "40px 32px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "24px", maxWidth: "420px" }}>
              <h2 className="hiw-title font-display" style={{ fontSize: "41px", lineHeight: "43px", fontWeight: 500, color: "rgb(11,5,29)", margin: 0 }}>
                {steps[active].title}
              </h2>
              <p style={{ fontSize: "16px", lineHeight: "24px", color: "rgb(97,95,109)", margin: 0, fontWeight: 400 }}>
                {steps[active].desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
