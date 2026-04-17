"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "../hooks/useInView";
import Image from "next/image";

function PhoneMockup({ src, alt }: { src: string; alt: string }) {
  return (
    <div style={{
      width: "260px",
      height: "530px",
      margin: "40px auto -265px",
      position: "relative",
    }}>
      {/* Phone shadow on surface */}
      <div style={{
        position: "absolute",
        bottom: "-20px",
        left: "10%",
        right: "10%",
        height: "40px",
        background: "radial-gradient(ellipse, rgba(0,0,0,0.35) 0%, transparent 70%)",
        filter: "blur(15px)",
        zIndex: 0,
      }} />

      {/* Main phone body */}
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
      }}>
        {/* Outer chassis — brushed titanium */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: "52px",
          background: "linear-gradient(165deg, #d4d4d8 0%, #a1a1aa 8%, #71717a 20%, #52525b 45%, #3f3f46 55%, #52525b 70%, #a1a1aa 90%, #d4d4d8 100%)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.4), 0 15px 35px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.15), inset 0 0.5px 0 rgba(255,255,255,0.4), inset 0 -0.5px 0 rgba(0,0,0,0.3)",
        }}>
          {/* Antenna lines */}
          <div style={{ position: "absolute", top: "80px", left: 0, right: 0, height: "0.5px", background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.15), transparent)" }} />
          <div style={{ position: "absolute", bottom: "80px", left: 0, right: 0, height: "0.5px", background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.15), transparent)" }} />

          {/* Inner bezel */}
          <div style={{
            position: "absolute",
            top: "2px",
            left: "2px",
            right: "2px",
            bottom: "2px",
            borderRadius: "50px",
            backgroundColor: "#0b051d",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.8)",
          }}>
            {/* Screen glass */}
            <div style={{
              position: "absolute",
              top: "3px",
              left: "3px",
              right: "3px",
              bottom: "3px",
              borderRadius: "47px",
              overflow: "hidden",
              backgroundColor: "#000000",
            }}>
              {/* Black wallet background */}
              <div style={{ position: "absolute", inset: 0, backgroundColor: "#000" }} />

              {/* Wallet header */}
              <div style={{
                position: "absolute",
                top: "44px",
                left: "18px",
                right: "18px",
                zIndex: 5,
              }}>
                {/* Top row: Wallet + icons */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                  <span style={{ fontSize: "28px", fontWeight: 700, color: "white", letterSpacing: "-0.5px", fontFamily: "-apple-system, SF Pro Display, system-ui, sans-serif" }}>Wallet</span>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <div style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(118,118,128,0.24)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <circle cx="6" cy="6" r="5" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2"/>
                        <circle cx="6" cy="4.5" r="1.5" stroke="rgba(255,255,255,0.85)" strokeWidth="1"/>
                        <path d="M3 9.5a3 3 0 016 0" stroke="rgba(255,255,255,0.85)" strokeWidth="1" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(118,118,128,0.24)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M6.5 1.5v10M1.5 6.5h10" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loyalty card */}
              <div style={{
                position: "absolute",
                top: "88px",
                left: "14px",
                right: "14px",
                bottom: "30px",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
                zIndex: 5,
              }}>
                <Image src={src} alt={alt} fill style={{ objectFit: "cover", objectPosition: "center top" }} />
              </div>

              {/* Dynamic Island */}
              <div style={{
                position: "absolute",
                top: "10px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "90px",
                height: "26px",
                backgroundColor: "#000",
                borderRadius: "13px",
                zIndex: 5,
                boxShadow: "0 0 0 0.5px rgba(255,255,255,0.06), 0 2px 8px rgba(0,0,0,0.3)",
              }}>
                {/* Camera lens */}
                <div style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 40% 35%, #1a1a3e 0%, #0a0a15 60%, #000 100%)",
                  boxShadow: "inset 0 0.5px 1px rgba(255,255,255,0.15), 0 0 0 0.5px rgba(255,255,255,0.05)",
                }} />
              </div>

              {/* Status bar */}
              <div style={{
                position: "absolute",
                top: "14px",
                left: "24px",
                right: "24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 4,
              }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "white", textShadow: "0 0.5px 1px rgba(0,0,0,0.4)" }}>9:41</span>
                <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                  {/* Cellular */}
                  <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
                    <rect x="0" y="7" width="2.5" height="4" rx="0.5" fill="white"/>
                    <rect x="3.5" y="5" width="2.5" height="6" rx="0.5" fill="white"/>
                    <rect x="7" y="2.5" width="2.5" height="8.5" rx="0.5" fill="white"/>
                    <rect x="10.5" y="0" width="2.5" height="11" rx="0.5" fill="white"/>
                  </svg>
                  {/* WiFi */}
                  <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
                    <path d="M0.5 3a8 8 0 0112 0" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
                    <path d="M2.5 5.5a5 5 0 018 0" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
                    <path d="M4.5 8a2 2 0 014 0" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  {/* Battery */}
                  <div style={{ display: "flex", alignItems: "center", gap: "1px" }}>
                    <div style={{ width: "20px", height: "10px", borderRadius: "2.5px", border: "1.2px solid rgba(255,255,255,0.5)", position: "relative" }}>
                      <div style={{ position: "absolute", top: "1.5px", left: "1.5px", right: "3px", bottom: "1.5px", borderRadius: "1px", backgroundColor: "#34c759" }} />
                    </div>
                    <div style={{ width: "1.5px", height: "4px", borderRadius: "0 1px 1px 0", backgroundColor: "rgba(255,255,255,0.4)" }} />
                  </div>
                </div>
              </div>

              {/* Home indicator */}
              <div style={{
                position: "absolute",
                bottom: "7px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "100px",
                height: "4px",
                borderRadius: "2px",
                backgroundColor: "rgba(0,0,0,0.2)",
                zIndex: 5,
              }} />

              {/* Glass reflection */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(155deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 15%, transparent 35%, transparent 65%, rgba(255,255,255,0.02) 85%, rgba(255,255,255,0.06) 100%)",
                borderRadius: "47px",
                pointerEvents: "none",
                zIndex: 6,
              }} />
              {/* Edge light catch */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "50%",
                background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)",
                borderRadius: "47px 47px 0 0",
                pointerEvents: "none",
                zIndex: 6,
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Side buttons */}
      {/* Silent switch */}
      <div style={{ position: "absolute", left: "-3.5px", top: "95px", width: "3.5px", height: "22px", borderRadius: "0 2px 2px 0", background: "linear-gradient(180deg, #a1a1aa, #71717a, #a1a1aa)", boxShadow: "-1px 0 3px rgba(0,0,0,0.4), inset 0 0.5px 0 rgba(255,255,255,0.2)", zIndex: 2 }} />
      {/* Volume up */}
      <div style={{ position: "absolute", left: "-3.5px", top: "140px", width: "3.5px", height: "44px", borderRadius: "0 2px 2px 0", background: "linear-gradient(180deg, #a1a1aa, #71717a, #a1a1aa)", boxShadow: "-1px 0 3px rgba(0,0,0,0.4), inset 0 0.5px 0 rgba(255,255,255,0.2)", zIndex: 2 }} />
      {/* Volume down */}
      <div style={{ position: "absolute", left: "-3.5px", top: "195px", width: "3.5px", height: "44px", borderRadius: "0 2px 2px 0", background: "linear-gradient(180deg, #a1a1aa, #71717a, #a1a1aa)", boxShadow: "-1px 0 3px rgba(0,0,0,0.4), inset 0 0.5px 0 rgba(255,255,255,0.2)", zIndex: 2 }} />
      {/* Power */}
      <div style={{ position: "absolute", right: "-3.5px", top: "165px", width: "3.5px", height: "60px", borderRadius: "2px 0 0 2px", background: "linear-gradient(180deg, #a1a1aa, #71717a, #a1a1aa)", boxShadow: "1px 0 3px rgba(0,0,0,0.4), inset 0 0.5px 0 rgba(255,255,255,0.2)", zIndex: 2 }} />
    </div>
  );
}

const cards = [
  {
    key: "coupon", title: "Coupon",
    tagline: "Get customers in",
    gradient: "rgb(29,25,42)",
    fullImage: true,
    features: [
      { title: "First-visit incentive", desc: "Offer a compelling deal that turns curious passersby into first-time customers." },
      { title: "Viral sharing", desc: "Customers share coupons with friends — your reach grows organically, at zero cost." },
      { title: "Time-limited urgency", desc: "Expiry dates and push reminders create urgency that drives immediate action." },
    ],
    visual: (
      <PhoneMockup src="/images/loyalty/loyalty-discount.png" alt="Coupon card in Apple Wallet" />
    ),
  },
  {
    key: "stamp", title: "Stamp Card",
    tagline: "Bring them back",
    gradient: "rgb(29,25,42)",
    fullImage: true,
    features: [
      { title: "Visual progress", desc: "Customers see stamps fill up on their phone — a simple, satisfying loop that drives repeat visits." },
      { title: "Automatic reminders", desc: "Push notifications nudge customers when they're close to a reward, pulling them back in." },
      { title: "No paper, no friction", desc: "Always in their wallet — never lost, never forgotten. Works with any POS." },
    ],
    visual: (
      <PhoneMockup src="/images/loyalty/loyalty-stamp.png" alt="Stamp card in Apple Wallet" />
    ),
  },
  {
    key: "points", title: "Points",
    tagline: "Grow revenue",
    gradient: "rgb(29,25,42)",
    fullImage: true,
    features: [
      { title: "Spend more, earn more", desc: "Customers increase basket size to hit the next reward tier — revenue grows naturally." },
      { title: "Tiered rewards", desc: "VIP levels and exclusive perks turn casual buyers into loyal regulars." },
      { title: "Real-time tracking", desc: "Customers see their balance instantly and redeem rewards with one tap." },
    ],
    visual: (
      <PhoneMockup src="/images/loyalty/loyalty-points.png" alt="Points card in Apple Wallet" />
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
    <section ref={ref} style={{ backgroundColor: "#F9F8F5", padding: "80px 0 0" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
        <div className={isVisible ? "animate-fade-in-up" : ""} style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 48px" }}>
          <h2 className="font-display section-h2" style={{ fontWeight: 500, fontSize: "52px", lineHeight: "55px", color: "rgb(11,5,29)", margin: "0 0 16px" }}>
            3 loyalty mechanics
          </h2>
          <p style={{ fontSize: "20px", lineHeight: "32px", color: "rgb(97,95,109)", margin: 0, fontWeight: 400 }}>
            Coupon to attract. Stamp to retain. Points to grow.
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
                      borderRadius: "40px",
                      overflow: "hidden",
                      minHeight: "480px",
                      boxShadow: "0 16px 60px rgba(0,0,0,0.15), 0 4px 20px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)",
                    }}
                    className="mechanics-card"
                  >
                    {/* Left */}
                    <div style={{
                      background: card.gradient,
                      padding: card.fullImage ? "0" : "48px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}>
                      {/* Texture elements */}
                      <div style={{ position: "absolute", inset: 0, opacity: 0.07, backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none", zIndex: 1 }} />
                      <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
                      <div style={{ position: "absolute", bottom: "-100px", left: "-60px", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(230,255,169,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
                      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(108,71,255,0.1) 0%, transparent 60%)", pointerEvents: "none" }} />
                      {/* Noise grain overlay */}
                      <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, pointerEvents: "none", zIndex: 1 }} />

                      {card.fullImage ? (
                        <div style={{ width: "100%", height: "100%", position: "relative", zIndex: 2 }}>
                          {card.visual}
                        </div>
                      ) : (
                        <>
                          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.06)" }} />
                          <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "240px", height: "240px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.04)" }} />
                          <div style={{ width: "280px", background: "rgba(255,255,255,0.12)", borderRadius: "20px", padding: "28px", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)", position: "relative", zIndex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                              <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
                                {(card as any).icon}
                              </div>
                              <div>
                                <p style={{ margin: 0, color: "white", fontSize: "16px", fontWeight: 600 }}>{card.title}</p>
                                <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>Café Bloom</p>
                              </div>
                            </div>
                            {card.visual}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Right */}
                    <div style={{ backgroundColor: "rgb(249,248,245)", padding: "48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgb(108,71,255)", margin: "0 0 8px" }}>
                        {card.tagline}
                      </p>
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
                        Explore {card.title.toLowerCase().replace(" card", "")}
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
