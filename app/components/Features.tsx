"use client";

import { useInView } from "../hooks/useInView";

const cards = [
  {
    title: "At your shop",
    desc: "Customers scan a QR code at your counter and instantly add their loyalty card to their wallet.",
    cta: "Learn more",
    gradient: "linear-gradient(135deg, #6C47FF 0%, #8B6FFF 100%)",
    visual: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "12px" }}>
        <div style={{ width: "120px", height: "120px", backgroundColor: "white", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 30px rgba(0,0,0,0.15)" }}>
          <div style={{ width: "90px", height: "90px", display: "grid", gridTemplateColumns: "repeat(7,1fr)", gridTemplateRows: "repeat(7,1fr)", gap: "2px" }}>
            {Array.from({ length: 49 }).map((_, i) => (
              <div key={i} style={{ backgroundColor: [0,1,2,4,5,6,7,13,14,20,21,27,28,34,35,42,43,44,46,47,48,8,10,12,16,18,22,24,26,30,32,36,38,40].includes(i) ? "#6C47FF" : "white", borderRadius: "1px" }} />
            ))}
          </div>
        </div>
        <p style={{ margin: 0, color: "white", fontSize: "12px", fontWeight: 500, opacity: 0.8 }}>Scan to join</p>
      </div>
    ),
  },
  {
    title: "In their wallet",
    desc: "Your loyalty card lives in Apple Wallet or Google Wallet. Always there — no app needed.",
    cta: "See how",
    gradient: "linear-gradient(135deg, #2C2242 0%, #44346A 100%)",
    visual: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "0 16px" }}>
        <div style={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "16px", padding: "16px", width: "100%", maxWidth: "200px", border: "1px solid rgba(255,255,255,0.15)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="font-display" style={{ color: "#6C47FF", fontWeight: 800, fontSize: "12px" }}>f</span>
            </div>
            <div>
              <p style={{ margin: 0, color: "white", fontSize: "12px", fontWeight: 600 }}>Café Bloom</p>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: "10px" }}>247 points</p>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "10px" }}>Tap to view</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "On their lock screen",
    desc: "Send push notifications directly to their phone. Promos, reminders, rewards — unlimited and free.",
    cta: "Learn more",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #2d2d4a 100%)",
    visual: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "8px", padding: "0 12px" }}>
        {[
          { title: "Café Bloom", body: "Your free coffee is waiting! ☕", time: "now" },
          { title: "Café Bloom", body: "Double points this weekend! 🎉", time: "2m" },
        ].map((n, i) => (
          <div key={i} style={{ backgroundColor: "rgba(255,255,255,0.12)", borderRadius: "14px", padding: "12px", width: "100%", maxWidth: "220px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, #6C47FF, #AA89F2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "white", fontWeight: 700, fontSize: "10px" }}>f</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ margin: 0, color: "white", fontSize: "11px", fontWeight: 600 }}>{n.title}</p>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "9px" }}>{n.time}</span>
                </div>
                <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.7)", fontSize: "10px", lineHeight: "14px" }}>{n.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

export default function Features() {
  const { ref, isVisible } = useInView();

  return (
    <section id="use-fidely" ref={ref} style={{ backgroundColor: "white", padding: "80px 0" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
        <h2
          className={`section-h2 font-display ${isVisible ? "animate-fade-in-up" : ""}`}
          style={{ fontWeight: 500, fontSize: "52px", lineHeight: "55px", color: "rgb(11,5,29)", margin: "0 0 48px", maxWidth: "700px" }}
        >
          Use Fidely anywhere you connect
        </h2>

        <div className="features-grid" style={{ display: "flex", flexWrap: "nowrap", gap: "0", marginTop: "8px", width: "100%", overflow: "hidden" }}>
          {cards.map((card, i) => (
            <div
              key={card.title}
              className="feature-card"
              style={{
                flexShrink: 1,
                flexBasis: "25%",
                flexGrow: 1,
                height: "465px",
                marginRight: i < cards.length - 1 ? "24px" : "0",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                transitionDelay: `${i * 0.15}s`,
              }}
            >
              <div style={{ borderRadius: "32px", width: "100%", height: "333px", overflow: "hidden", marginBottom: "16px", background: card.gradient }}>
                {card.visual}
              </div>
              <h4 className="font-display" style={{ fontSize: "20px", fontWeight: 700, lineHeight: "26px", color: "rgb(11,5,29)", margin: "0 0 8px", letterSpacing: "-0.2px" }}>
                {card.title}
              </h4>
              <p className="feature-card-desc" style={{ fontSize: "14px", lineHeight: "20px", color: "rgb(97,95,109)", marginBottom: "8px", fontWeight: 400 }}>
                {card.desc}
              </p>
              <a href="#how-it-works" style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "14px", fontWeight: 400, lineHeight: "20px", color: "rgb(11,5,29)", textDecoration: "none" }}>
                {card.cta}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
