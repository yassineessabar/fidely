"use client";

import { useState } from "react";
import { useInView } from "../hooks/useInView";

const steps = [
  {
    label: "Create your card",
    title: "Create your loyalty card",
    desc: "We design a branded digital card for you in under 24 hours. Fully customized to match your business — colors, logo, rewards.",
    gradient: "linear-gradient(135deg, #6C47FF 0%, #8B6FFF 100%)",
    visual: (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <div style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: "20px", padding: "20px", width: "220px", border: "1px solid rgba(255,255,255,0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#6C47FF", fontWeight: 800, fontSize: "14px" }}>f</span>
            </div>
            <div>
              <p style={{ margin: 0, color: "white", fontSize: "13px", fontWeight: 600 }}>Your Business</p>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: "10px" }}>Loyalty Card</p>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div><p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: "10px" }}>Member</p><p style={{ margin: "2px 0 0", color: "white", fontSize: "14px", fontWeight: 600 }}>New Customer</p></div>
            <div style={{ textAlign: "right" }}><p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: "10px" }}>Points</p><p style={{ margin: "2px 0 0", color: "white", fontSize: "22px", fontWeight: 700 }}>0</p></div>
          </div>
        </div>
      </div>
    ),
  },
  {
    label: "Add to wallet",
    title: "Customers add it to their phone",
    desc: "A simple QR code scan. No app download. Saved to Apple Wallet or Google Wallet in seconds.",
    gradient: "linear-gradient(135deg, #2C2242 0%, #44346A 100%)",
    visual: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "16px" }}>
        <div style={{ width: "110px", height: "110px", backgroundColor: "white", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 30px rgba(0,0,0,0.2)" }}>
          <div style={{ width: "80px", height: "80px", display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "2px" }}>
            {Array.from({ length: 49 }).map((_, i) => (<div key={i} style={{ backgroundColor: [0,1,2,4,5,6,7,13,14,20,21,27,28,34,35,42,43,44,46,47,48,10,16,22,32,38].includes(i) ? "#2C2242" : "white", borderRadius: "1px" }} />))}
          </div>
        </div>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>Scan to add your card</p>
      </div>
    ),
  },
  {
    label: "Collect data",
    title: "You collect their data automatically",
    desc: "Every scan gives you their name, email, and phone. Build your customer database effortlessly.",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #2d2d4a 100%)",
    visual: (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center", height: "100%", padding: "0 20px" }}>
        {[{ label: "Name", value: "Sophie Martin", icon: "👤" }, { label: "Email", value: "sophie@email.com", icon: "✉️" }, { label: "Phone", value: "+33 6 12 34 56", icon: "📱" }].map((f) => (
          <div key={f.label} style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "10px", padding: "10px 12px" }}>
            <span style={{ fontSize: "14px" }}>{f.icon}</span>
            <div style={{ flex: 1 }}><p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{f.label}</p><p style={{ margin: "1px 0 0", color: "white", fontSize: "13px", fontWeight: 500 }}>{f.value}</p></div>
            <div style={{ width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "rgba(230,255,169,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#E6FFA9" strokeWidth="3"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: "Send notifications",
    title: "Bring them back with free notifications",
    desc: "Send push notifications right to their lock screen. Promotions, reminders, rewards — unlimited and free.",
    gradient: "linear-gradient(135deg, #0f4c3a 0%, #1a6b50 100%)",
    visual: (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center", height: "100%", padding: "0 16px" }}>
        {[{ title: "Café Bloom", body: "Your free coffee is waiting! ☕", time: "now" }, { title: "Café Bloom", body: "Double points this weekend! 🎉", time: "2h" }].map((n, i) => (
          <div key={i} style={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "14px", padding: "12px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, #6C47FF, #AA89F2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "white", fontWeight: 700, fontSize: "10px" }}>f</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><p style={{ margin: 0, color: "white", fontSize: "11px", fontWeight: 600 }}>{n.title}</p><span style={{ color: "rgba(255,255,255,0.4)", fontSize: "9px" }}>{n.time}</span></div>
                <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.7)", fontSize: "10px" }}>{n.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
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
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: "48px", height: "332px", gap: "16px" }}>
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
          <div className="hiw-card" style={{ display: "grid", gridTemplateAreas: "'image content'", gridTemplateColumns: "396px 1fr", height: "332px", borderRadius: "16px", overflow: "hidden", transition: "all 0.6s ease-out" }}>
            <div style={{ gridArea: "image", background: steps[active].gradient, display: "flex", transition: "background 0.6s ease-out" }}>
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
