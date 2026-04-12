"use client";

import { useInView } from "../hooks/useInView";
import PhoneMockup from "./illustrations/PhoneMockup";

const cards = [
  {
    title: "At your shop",
    desc: "Customers scan a QR code at your counter and instantly add their loyalty card to their wallet.",
    cta: "Learn more",
    gradient: "linear-gradient(135deg, #6C47FF 0%, #8B6FFF 100%)",
    visual: (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: "20px 40px" }}>
        <PhoneMockup variant="scan" />
      </div>
    ),
  },
  {
    title: "In their wallet",
    desc: "Your loyalty card lives in Apple Wallet or Google Wallet. Always there — no app needed.",
    cta: "See how",
    gradient: "linear-gradient(135deg, #2C2242 0%, #44346A 100%)",
    visual: (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: "20px 40px" }}>
        <PhoneMockup variant="wallet" />
      </div>
    ),
  },
  {
    title: "On their lock screen",
    desc: "Send push notifications directly to their phone. Promos, reminders, rewards — unlimited and free.",
    cta: "Learn more",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #2d2d4a 100%)",
    visual: (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: "20px 40px" }}>
        <PhoneMockup variant="notification" />
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
