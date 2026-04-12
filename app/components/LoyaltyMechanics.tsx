"use client";

import { useState } from "react";
import { useInView } from "../hooks/useInView";

const cards = [
  {
    key: "punch",
    icon: "☕",
    title: "Punch Cards",
    gradient: "linear-gradient(135deg, #6C47FF 0%, #8B6FFF 100%)",
    features: [
      { title: "Streamlined Experience", desc: "Digital punch cards eliminate paper — customers track visits directly from their phone." },
      { title: "Automatic Reminders", desc: "Push notifications remind customers to complete their card, driving return visits." },
      { title: "Seamless Integration", desc: "Works with any POS or booking system for a unified customer experience." },
    ],
  },
  {
    key: "reward",
    icon: "🎁",
    title: "Reward Cards",
    gradient: "linear-gradient(135deg, #2C2242 0%, #44346A 100%)",
    features: [
      { title: "Instant Redemption", desc: "Customers view points and redeem rewards in real-time — no waiting, no friction." },
      { title: "Tailored Promotions", desc: "Send personalized offers based on individual spending patterns and preferences." },
      { title: "Direct Communication", desc: "Push notifications keep customers informed of new rewards and milestones." },
    ],
  },
  {
    key: "membership",
    icon: "👑",
    title: "Membership Cards",
    gradient: "linear-gradient(135deg, #0f4c3a 0%, #1a6b50 100%)",
    features: [
      { title: "VIP Access", desc: "Offer exclusive perks, early access, and special discounts to loyal members." },
      { title: "Personalized Experience", desc: "Tailor content and offers based on individual member preferences." },
      { title: "Real-time Alerts", desc: "Members receive instant notifications for renewals, events, and exclusive offers." },
    ],
  },
  {
    key: "cashback",
    icon: "💰",
    title: "Cashback Cards",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #2d2d4a 100%)",
    features: [
      { title: "Track & Redeem", desc: "Customers easily track cashback and redeem directly — no paper vouchers needed." },
      { title: "Personalized Deals", desc: "Tailor cashback rates based on spending habits to maximize engagement." },
      { title: "POS Integration", desc: "Integrates with any POS or CRM system to extend native cashback mechanics." },
    ],
  },
  {
    key: "discount",
    icon: "🏷️",
    title: "Discount Cards",
    gradient: "linear-gradient(135deg, #6C47FF 0%, #AA89F2 100%)",
    features: [
      { title: "Always on Hand", desc: "Digital format means customers never forget their card — it's always on their phone." },
      { title: "Push Notifications", desc: "Instant alerts about new discounts, flash sales, and card-related updates." },
      { title: "Wider Reach", desc: "Easily shared across online channels, expanding your potential customer base." },
    ],
  },
];

export default function LoyaltyMechanics() {
  const [active, setActive] = useState(0);
  const { ref, isVisible } = useInView();

  const card = cards[active];

  return (
    <section ref={ref} style={{ backgroundColor: "white", padding: "80px 0" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div className={isVisible ? "animate-fade-in-up" : ""} style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 48px" }}>
          <h2 className="font-display section-h2" style={{ fontWeight: 500, fontSize: "52px", lineHeight: "55px", color: "rgb(11,5,29)", margin: "0 0 16px" }}>
            5 loyalty mechanics
          </h2>
          <p style={{ fontSize: "20px", lineHeight: "32px", color: "rgb(97,95,109)", margin: 0, fontWeight: 400 }}>
            Choose from the most popular strategies to keep your customers coming back.
          </p>
        </div>

        {/* Tab pills */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "40px", flexWrap: "wrap" }}>
          {cards.map((c, i) => (
            <button
              key={c.key}
              onClick={() => setActive(i)}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "10px 20px", borderRadius: "100px",
                border: active === i ? "2px solid rgb(11,5,29)" : "1px solid rgb(228,227,223)",
                backgroundColor: active === i ? "rgb(11,5,29)" : "white",
                color: active === i ? "white" : "rgb(11,5,29)",
                fontSize: "14px", fontWeight: 500, fontFamily: "inherit",
                cursor: "pointer", transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: "16px" }}>{c.icon}</span>
              {c.title}
            </button>
          ))}
        </div>

        {/* Active card — 2-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderRadius: "24px",
            overflow: "hidden",
            minHeight: "480px",
            transition: "all 0.4s ease-out",
          }}
          className="mechanics-card"
        >
          {/* Left: visual */}
          <div
            style={{
              background: card.gradient,
              padding: "48px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              transition: "background 0.4s ease-out",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative circles */}
            <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.06)" }} />
            <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "240px", height: "240px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.04)" }} />

            {/* Card mockup */}
            <div style={{
              width: "280px",
              background: "rgba(255,255,255,0.12)",
              borderRadius: "20px",
              padding: "28px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.15)",
              position: "relative",
              zIndex: 1,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
                  {card.icon}
                </div>
                <div>
                  <p style={{ margin: 0, color: "white", fontSize: "16px", fontWeight: 600 }}>{card.title}</p>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>Café Bloom</p>
                </div>
              </div>

              {/* Card-specific visual */}
              {card.key === "punch" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} style={{
                      width: "100%", aspectRatio: "1", borderRadius: "50%",
                      backgroundColor: i < 7 ? "rgba(230,255,169,0.8)" : "rgba(255,255,255,0.1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "14px",
                    }}>
                      {i < 7 ? "✓" : i === 9 ? "🎁" : ""}
                    </div>
                  ))}
                </div>
              )}
              {card.key === "reward" && (
                <div>
                  <p style={{ margin: "0 0 4px", color: "rgba(255,255,255,0.5)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Points Balance</p>
                  <p style={{ margin: "0 0 12px", color: "white", fontSize: "36px", fontWeight: 700 }}>480</p>
                  <div style={{ width: "100%", height: "6px", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: "3px" }}>
                    <div style={{ width: "80%", height: "100%", backgroundColor: "rgb(230,255,169)", borderRadius: "3px" }} />
                  </div>
                  <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.5)", fontSize: "10px" }}>20 more to next reward</p>
                </div>
              )}
              {card.key === "membership" && (
                <div style={{ textAlign: "center", padding: "8px 0" }}>
                  <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "rgba(230,255,169,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: "28px" }}>👑</div>
                  <p style={{ margin: 0, color: "rgb(230,255,169)", fontSize: "18px", fontWeight: 700 }}>Gold Member</p>
                  <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>Since Jan 2024</p>
                </div>
              )}
              {card.key === "cashback" && (
                <div>
                  <p style={{ margin: "0 0 4px", color: "rgba(255,255,255,0.5)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Cashback Balance</p>
                  <p style={{ margin: "0 0 4px", color: "white", fontSize: "36px", fontWeight: 700 }}>€12.40</p>
                  <p style={{ margin: 0, color: "rgb(230,255,169)", fontSize: "12px", fontWeight: 600 }}>5% on every purchase</p>
                </div>
              )}
              {card.key === "discount" && (
                <div style={{ textAlign: "center", padding: "8px 0" }}>
                  <p style={{ margin: "0 0 8px", color: "rgb(230,255,169)", fontSize: "48px", fontWeight: 700 }}>10%</p>
                  <p style={{ margin: 0, color: "white", fontSize: "14px", fontWeight: 500 }}>Off every purchase</p>
                  <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>Show at checkout</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: features */}
          <div style={{ backgroundColor: "rgb(249,248,245)", padding: "48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h3 className="font-display" style={{ fontSize: "32px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 32px" }}>
              {card.title}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {card.features.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: "14px" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    backgroundColor: "rgba(11,5,29,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, fontSize: "14px", fontWeight: 700, color: "rgb(11,5,29)",
                  }}>
                    {i + 1}
                  </div>
                  <div>
                    <p style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 600, color: "rgb(11,5,29)" }}>{f.title}</p>
                    <p style={{ margin: 0, fontSize: "14px", lineHeight: "22px", color: "rgb(97,95,109)" }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href={`/card/${card.key}`}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                marginTop: "32px",
                padding: "12px 24px", borderRadius: "100px",
                backgroundColor: "rgb(11,5,29)", color: "white",
                fontSize: "14px", fontWeight: 500, textDecoration: "none",
                width: "fit-content", transition: "transform 0.2s",
              }}
            >
              Explore {card.title.toLowerCase()}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
