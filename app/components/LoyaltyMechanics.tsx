"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "../hooks/useInView";

const cards = [
  {
    key: "punch", icon: "☕", title: "Punch Cards",
    gradient: "linear-gradient(135deg, #6C47FF 0%, #8B6FFF 100%)",
    features: [
      { title: "Streamlined Experience", desc: "Digital punch cards eliminate paper — customers track visits from their phone." },
      { title: "Automatic Reminders", desc: "Notifications remind customers to complete their card, driving return visits." },
      { title: "Seamless Integration", desc: "Works with any POS or booking system for a unified experience." },
    ],
    visual: (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px", width: "100%", maxWidth: "240px" }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{ aspectRatio: "1", borderRadius: "50%", backgroundColor: i < 7 ? "rgba(230,255,169,0.8)" : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
            {i < 7 ? "✓" : i === 9 ? "🎁" : ""}
          </div>
        ))}
      </div>
    ),
  },
  {
    key: "reward", icon: "🎁", title: "Reward Cards",
    gradient: "linear-gradient(135deg, #2C2242 0%, #44346A 100%)",
    features: [
      { title: "Instant Redemption", desc: "View points and redeem rewards in real-time — no waiting, no friction." },
      { title: "Tailored Promotions", desc: "Personalized offers based on spending patterns and preferences." },
      { title: "Direct Communication", desc: "Push notifications keep customers informed of rewards and milestones." },
    ],
    visual: (
      <div>
        <p style={{ margin: "0 0 4px", color: "rgba(255,255,255,0.5)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Points Balance</p>
        <p style={{ margin: "0 0 12px", color: "white", fontSize: "36px", fontWeight: 700 }}>480</p>
        <div style={{ width: "100%", height: "6px", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: "3px" }}>
          <div style={{ width: "80%", height: "100%", backgroundColor: "rgb(230,255,169)", borderRadius: "3px" }} />
        </div>
        <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.5)", fontSize: "10px" }}>20 more to next reward</p>
      </div>
    ),
  },
  {
    key: "membership", icon: "👑", title: "Membership Cards",
    gradient: "linear-gradient(135deg, #0f4c3a 0%, #1a6b50 100%)",
    features: [
      { title: "VIP Access", desc: "Exclusive perks, early access, and special discounts for loyal members." },
      { title: "Personalized Experience", desc: "Tailor content and offers based on member preferences." },
      { title: "Real-time Alerts", desc: "Instant notifications for renewals, events, and exclusive offers." },
    ],
    visual: (
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "rgba(230,255,169,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: "28px" }}>👑</div>
        <p style={{ margin: 0, color: "rgb(230,255,169)", fontSize: "18px", fontWeight: 700 }}>Gold Member</p>
        <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>Since Jan 2024</p>
      </div>
    ),
  },
  {
    key: "cashback", icon: "💰", title: "Cashback Cards",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #2d2d4a 100%)",
    features: [
      { title: "Track & Redeem", desc: "Track cashback and redeem directly — no paper vouchers needed." },
      { title: "Personalized Deals", desc: "Tailor cashback rates based on spending habits." },
      { title: "POS Integration", desc: "Integrates with any POS or CRM to extend cashback mechanics." },
    ],
    visual: (
      <div>
        <p style={{ margin: "0 0 4px", color: "rgba(255,255,255,0.5)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Cashback Balance</p>
        <p style={{ margin: "0 0 4px", color: "white", fontSize: "36px", fontWeight: 700 }}>€12.40</p>
        <p style={{ margin: 0, color: "rgb(230,255,169)", fontSize: "12px", fontWeight: 600 }}>5% on every purchase</p>
      </div>
    ),
  },
  {
    key: "discount", icon: "🏷️", title: "Discount Cards",
    gradient: "linear-gradient(135deg, #6C47FF 0%, #AA89F2 100%)",
    features: [
      { title: "Always on Hand", desc: "Digital format — always on their phone, never forgotten at home." },
      { title: "Push Notifications", desc: "Instant alerts about new discounts and flash sales." },
      { title: "Wider Reach", desc: "Easily shared online, expanding your customer base." },
    ],
    visual: (
      <div style={{ textAlign: "center" }}>
        <p style={{ margin: "0 0 8px", color: "rgb(230,255,169)", fontSize: "48px", fontWeight: 700 }}>10%</p>
        <p style={{ margin: 0, color: "white", fontSize: "14px", fontWeight: 500 }}>Off every purchase</p>
      </div>
    ),
  },
];

export default function LoyaltyMechanics() {
  const { ref, isVisible } = useInView();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const scrolled = -rect.top;
      const cardHeight = (sectionHeight - window.innerHeight) / cards.length;
      const index = Math.max(0, Math.min(cards.length - 1, Math.floor(scrolled / cardHeight)));
      setActiveIndex(index);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={ref} style={{ backgroundColor: "white", padding: "80px 0 0" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
        <div className={isVisible ? "animate-fade-in-up" : ""} style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 48px" }}>
          <h2 className="font-display section-h2" style={{ fontWeight: 500, fontSize: "52px", lineHeight: "55px", color: "rgb(11,5,29)", margin: "0 0 16px" }}>
            5 loyalty mechanics
          </h2>
          <p style={{ fontSize: "20px", lineHeight: "32px", color: "rgb(97,95,109)", margin: 0, fontWeight: 400 }}>
            Choose from the most popular strategies to keep your customers coming back.
          </p>
        </div>
      </div>

      {/* Scroll container */}
      <div ref={sectionRef} style={{ height: `${cards.length * 600}px`, position: "relative" }}>
        <div style={{
          position: "sticky",
          top: "100px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: "20px",
        }}>
          <div style={{ maxWidth: "1140px", width: "100%", padding: "0 24px", position: "relative", height: "560px" }}>
            {cards.map((card, i) => {
              const isActive = i <= activeIndex;
              const offset = isActive ? Math.min(i, activeIndex) * 12 : 0;
              const scale = isActive ? 1 - (activeIndex - i) * 0.03 : 0.9;
              const opacity = i <= activeIndex ? 1 : 0;
              const translateY = isActive ? offset : 200;

              return (
                <div
                  key={card.key}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "24px",
                    right: "24px",
                    zIndex: i,
                    transform: `translateY(${translateY}px) scale(${scale})`,
                    opacity,
                    transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease",
                    transformOrigin: "top center",
                  }}
                >
                  {/* Card */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      borderRadius: "24px",
                      overflow: "hidden",
                      minHeight: "480px",
                      boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
                    }}
                    className="mechanics-card"
                  >
                    {/* Left */}
                    <div style={{
                      background: card.gradient,
                      padding: "48px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}>
                      <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.06)" }} />
                      <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "240px", height: "240px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.04)" }} />
                      <div style={{ width: "280px", background: "rgba(255,255,255,0.12)", borderRadius: "20px", padding: "28px", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)", position: "relative", zIndex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                          <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
                            {card.icon}
                          </div>
                          <div>
                            <p style={{ margin: 0, color: "white", fontSize: "16px", fontWeight: 600 }}>{card.title}</p>
                            <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>Café Bloom</p>
                          </div>
                        </div>
                        {card.visual}
                      </div>
                    </div>

                    {/* Right */}
                    <div style={{ backgroundColor: "rgb(249,248,245)", padding: "48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <h3 className="font-display" style={{ fontSize: "32px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 32px" }}>
                        {card.title}
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        {card.features.map((f, fi) => (
                          <div key={fi} style={{ display: "flex", gap: "14px" }}>
                            <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "rgba(11,5,29,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "13px", fontWeight: 700, color: "rgb(11,5,29)" }}>
                              {fi + 1}
                            </div>
                            <div>
                              <p style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: 600, color: "rgb(11,5,29)" }}>{f.title}</p>
                              <p style={{ margin: 0, fontSize: "13px", lineHeight: "20px", color: "rgb(97,95,109)" }}>{f.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <a href={`/card/${card.key}`} style={{
                        display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "28px",
                        padding: "10px 22px", borderRadius: "100px", backgroundColor: "rgb(11,5,29)",
                        color: "white", fontSize: "14px", fontWeight: 500, textDecoration: "none", width: "fit-content",
                      }}>
                        Explore {card.title.toLowerCase()}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Progress dots */}
            <div style={{ position: "absolute", right: "-40px", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "8px" }} className="mechanics-dots">
              {cards.map((_, i) => (
                <div key={i} style={{
                  width: "8px", height: i === activeIndex ? "24px" : "8px",
                  borderRadius: "4px",
                  backgroundColor: i === activeIndex ? "rgb(11,5,29)" : "rgb(228,227,223)",
                  transition: "all 0.3s ease",
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
