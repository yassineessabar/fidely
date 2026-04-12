"use client";

import { useInView } from "../hooks/useInView";

export default function CTA() {
  const { ref, isVisible } = useInView();

  return (
    <section id="cta" ref={ref} style={{ backgroundColor: "rgb(232,255,200)", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "80px 24px", position: "relative" }}>
        <div
          className="cta-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center" }}
        >
          {/* Text */}
          <div style={{ maxWidth: "750px", zIndex: 1, position: "relative", opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.6s ease-out, transform 0.6s ease-out" }}>
            <h4
              className="cta-h4 font-display"
              style={{ fontSize: "52px", lineHeight: "54.6px", fontWeight: 500, color: "rgb(11,5,29)", margin: "0 0 16px" }}
            >
              Stop losing customers every day
            </h4>
            <p style={{ fontSize: "16px", lineHeight: "24px", color: "rgb(11,5,29)", margin: "0 0 32px", fontWeight: 400 }}>
              Every day without Fidely means missed revenue. Join 500+ local businesses and start bringing customers back — automatically.
            </p>
            <a
              href="#"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                height: "40px", padding: "12px 20px",
                backgroundColor: "rgb(11,5,29)", color: "white",
                fontSize: "16px", fontWeight: 500, lineHeight: "16px",
                borderRadius: "100px", textDecoration: "none",
                transition: "box-shadow 0.3s, transform 0.3s",
              }}
            >
              Book a demo
            </a>
          </div>

          {/* Phone visual */}
          <div style={{ display: "flex", justifyContent: "center", zIndex: 0, opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.6s ease-out 0.15s, transform 0.6s ease-out 0.15s" }}>
            <div style={{ width: "240px", height: "440px", backgroundColor: "#1a1a2e", borderRadius: "36px", border: "4px solid #2a2a3e", overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.15)" }}>
              <div style={{ width: "100%", height: "100%", background: "linear-gradient(160deg, #6C47FF 0%, #8B6FFF 40%, #AA89F2 100%)", borderRadius: "32px", display: "flex", flexDirection: "column", padding: "32px 16px 16px" }}>
                <div style={{ width: "70px", height: "20px", backgroundColor: "#1a1a2e", borderRadius: "16px", margin: "-12px auto 20px" }} />
                <div style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: "16px", padding: "16px", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "10px", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span className="font-display" style={{ color: "#6C47FF", fontWeight: 800, fontSize: "14px" }}>f</span>
                    </div>
                    <div>
                      <p style={{ margin: 0, color: "white", fontSize: "12px", fontWeight: 600 }}>Fidely Card</p>
                      <p style={{ margin: 0, color: "rgba(255,255,255,0.6)", fontSize: "10px" }}>Your Business</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "center", padding: "16px 0" }}>
                    <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Reward Points</p>
                    <p style={{ margin: "8px 0", color: "white", fontSize: "36px" }}>🎉</p>
                    <p style={{ margin: 0, color: "white", fontSize: "14px", fontWeight: 600 }}>Free coffee earned!</p>
                  </div>
                </div>
                <div style={{ marginTop: "auto" }}>
                  <div style={{ backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "10px", padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                    <span style={{ color: "white", fontSize: "11px", fontWeight: 500 }}>Add to Apple Wallet</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
