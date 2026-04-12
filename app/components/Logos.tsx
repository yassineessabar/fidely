"use client";

import { useInView } from "../hooks/useInView";

const columns = [
  [
    { name: "Café Bloom", emoji: "☕", bg: "#6C47FF", h: 266 },
    { name: "Fresh Gym", emoji: "💪", bg: "#1a6b50", h: 266 },
    { name: "Glow Salon", emoji: "💇", bg: "#AA89F2", h: 266 },
    { name: "The Bakery", emoji: "🥐", bg: "#c47a3a", h: 266 },
  ],
  [
    { name: "Barbershop", emoji: "✂️", bg: "#2C2242", h: 266 },
    { name: "Pizzeria", emoji: "🍕", bg: "#922b21", h: 266 },
    { name: "Yoga Studio", emoji: "🧘", bg: "#4a2fd4", h: 266 },
    { name: "Pet Shop", emoji: "🐾", bg: "#1b4332", h: 266 },
  ],
  [
    { name: "Flower Shop", emoji: "💐", bg: "#b8875a", h: 266 },
    { name: "Sushi Bar", emoji: "🍣", bg: "#1a1a2e", h: 266 },
    { name: "Ice Cream", emoji: "🍦", bg: "#e84393", h: 266 },
    { name: "Bookstore", emoji: "📚", bg: "#2C2242", h: 266 },
  ],
  [
    { name: "Wine Bar", emoji: "🍷", bg: "#6C47FF", h: 266 },
    { name: "Nail Salon", emoji: "💅", bg: "#c44dbb", h: 266 },
    { name: "Juice Bar", emoji: "🥤", bg: "#0f4c3a", h: 266 },
    { name: "Auto Wash", emoji: "🚗", bg: "#1a1a2e", h: 266 },
  ],
];

export default function Logos() {
  const { ref, isVisible } = useInView();

  return (
    <section ref={ref} style={{ backgroundColor: "white", padding: "80px 0", overflow: "hidden" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header row */}
        <div style={{ display: "grid", columnGap: "40px", gridTemplateColumns: "1fr auto", paddingBottom: "40px" }}>
          <h2
            className={`brands-h2 font-display ${isVisible ? "animate-fade-in-up" : ""}`}
            style={{ fontWeight: 500, fontSize: "40px", lineHeight: "42px", color: "rgb(11,5,29)", margin: 0 }}
          >
            Businesses that use Fidely
          </h2>
          <a href="#cta" style={{ placeSelf: "flex-end end", fontSize: "16px", fontWeight: 400, color: "rgb(11,5,29)", textDecoration: "underline", textUnderlineOffset: "4px" }}>
            See all
          </a>
        </div>

        {/* 4-column grid */}
        <div
          className="brands-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "267px 267px 267px 267px",
            gap: "24px",
            height: "600px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Top/bottom fades */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50px", background: "linear-gradient(to bottom, rgb(255,255,255), rgba(255,255,255,0))", zIndex: 2, pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50px", background: "linear-gradient(to top, rgb(255,255,255), rgba(255,255,255,0))", zIndex: 2, pointerEvents: "none" }} />

          {columns.map((col, colIdx) => (
            <div
              key={colIdx}
              style={{ display: "flex", flexDirection: "column", gap: "24px", animation: `${colIdx % 2 === 0 ? "scrollUp" : "scrollDown"} ${25 + colIdx * 5}s linear infinite` }}
            >
              {[...col, ...col].map((brand, i) => (
                <div
                  key={`${brand.name}-${i}`}
                  style={{
                    height: `${brand.h}px`,
                    width: "100%",
                    position: "relative",
                    borderRadius: "32px",
                    overflow: "hidden",
                    flexShrink: 0,
                    backgroundColor: brand.bg,
                  }}
                >
                  {/* Darkened overlay */}
                  <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", borderRadius: "32px" }} />
                  {/* Logo */}
                  <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "8px" }}>
                    <div style={{ width: "94px", height: "94px", borderRadius: "50%", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
                      {brand.emoji}
                    </div>
                    <span style={{ color: "white", fontSize: "14px", fontWeight: 600, textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>{brand.name}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
