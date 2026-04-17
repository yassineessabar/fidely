"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { businessTypes, getThemesForType, OnboardingTheme } from "@/lib/onboarding-themes";
import { Coffee, UtensilsCrossed, Cake, Scissors, Sparkles, Dumbbell, ShoppingBag, Store, ArrowLeft, ArrowRight, Check, CreditCard, Palette } from "lucide-react";

const TOTAL_STEPS = 5;

// Realistic 25x25 QR code pattern
const QR_PATTERN = [
  1,1,1,1,1,1,1,0,0,1,0,1,1,0,1,0,0,0,1,1,1,1,1,1,1,
  1,0,0,0,0,0,1,0,1,1,0,0,1,0,0,1,0,0,1,0,0,0,0,0,1,
  1,0,1,1,1,0,1,0,0,0,1,0,1,1,0,0,1,0,1,0,1,1,1,0,1,
  1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,0,0,0,1,0,1,1,1,0,1,
  1,0,1,1,1,0,1,0,0,1,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1,
  1,0,0,0,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,0,0,0,1,
  1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,
  0,0,0,0,0,0,0,0,1,1,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,
  1,0,0,1,1,0,1,1,0,1,1,0,1,0,1,0,0,1,1,0,1,0,0,1,0,
  0,1,1,0,0,1,0,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,
  1,0,0,1,0,1,1,1,0,1,1,0,1,0,0,1,0,1,0,0,1,0,1,1,0,
  0,1,0,0,1,0,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,0,0,1,1,
  1,1,0,1,0,1,1,0,0,1,0,0,1,0,1,1,0,1,0,1,0,1,0,0,0,
  1,0,1,0,1,0,0,1,1,0,1,0,0,1,0,0,1,0,1,0,1,0,1,1,0,
  0,0,1,1,0,0,1,0,1,1,0,1,1,0,1,0,0,1,0,0,1,1,0,1,1,
  1,1,0,0,1,1,0,1,0,0,1,0,0,1,0,1,1,0,0,1,0,0,1,0,0,
  0,1,1,0,1,0,1,0,1,0,0,1,0,0,1,0,1,0,1,0,1,0,0,1,1,
  0,0,0,0,0,0,0,0,1,0,1,0,1,1,0,0,0,1,0,1,0,0,1,0,1,
  1,1,1,1,1,1,1,0,0,1,0,1,0,0,1,0,1,0,1,0,0,1,0,1,0,
  1,0,0,0,0,0,1,0,1,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,1,
  1,0,1,1,1,0,1,0,0,1,1,1,0,1,1,0,1,0,0,1,1,0,0,1,0,
  1,0,1,1,1,0,1,0,1,0,0,0,1,0,0,1,0,0,1,0,0,1,1,0,1,
  1,0,1,1,1,0,1,0,0,1,0,1,1,0,1,0,1,1,0,1,0,0,1,0,0,
  1,0,0,0,0,0,1,0,1,0,1,0,0,1,0,0,0,1,0,0,1,0,0,1,1,
  1,1,1,1,1,1,1,0,0,0,1,1,0,1,1,0,1,0,1,0,1,1,0,1,0,
];

const QrCode = ({ size }: { size: number }) => {
  const cellSize = (size - 8) / 25; // padding of 4 each side
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius: 8, backgroundColor: "white" }}>
      {QR_PATTERN.map((v, i) => v ? (
        <rect
          key={i}
          x={4 + (i % 25) * cellSize}
          y={4 + Math.floor(i / 25) * cellSize}
          width={cellSize}
          height={cellSize}
          fill="#111111"
          rx={cellSize * 0.15}
        />
      ) : null)}
    </svg>
  );
};

const iconMap: Record<string, any> = {
  coffee: Coffee, utensils: UtensilsCrossed, cake: Cake, scissors: Scissors,
  sparkles: Sparkles, dumbbell: Dumbbell, "shopping-bag": ShoppingBag, store: Store,
};

const cardTypes = [
  { id: "stamp", label: "Stamp Card", desc: "Increase repeat visits" },
  { id: "points", label: "Points Card", desc: "Increase spending & engagement" },
  { id: "vip", label: "VIP / Loyalty Card", desc: "Reward loyal customers & build long-term relationships" },
];

const EMOJI_OPTIONS = ["☕", "🍵", "🧁", "🍕", "🍣", "🍽️", "🎂", "🍞", "🍫", "✂️", "💈", "👑", "💅", "💆", "💇", "✨", "💪", "🔥", "🏋️", "🧘", "👜", "🌸", "🎁", "📚", "⭐", "🍦", "🍷", "🐾", "🎵", "🎮", "🏆", "❤️", "🌟", "🎯", "🛍️"];

type State = {
  businessType: string;
  theme: OnboardingTheme | null;
  cardType: string;
  stampEmoji: string;
  name: string;
  cardName: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [creating, setCreating] = useState(false);
  const [data, setData] = useState<State>({
    businessType: "",
    theme: null,
    cardType: "stamp",
    stampEmoji: "",
    name: "",
    cardName: "",
    description: "",
    logoUrl: "",
    bannerUrl: "",
  });

  const progress = step / TOTAL_STEPS;

  const canContinue = () => {
    if (step === 1) return !!data.businessType;
    if (step === 2) return !!data.cardType;
    if (step === 3) return !!data.theme;
    if (step === 4) return !!data.name;
    return true;
  };

  const handleFinish = async (): Promise<boolean> => {
    setCreating(true);
    try {
      const theme = data.theme!;
      const dbType = data.cardType === "vip" ? "points" : data.cardType;
      const res = await fetch("/api/merchant/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: dbType,
          name: data.cardName || `${data.name} Loyalty Card`,
          business_details: {
            name: data.name,
            category: data.businessType,
            description: data.description,
            tagline: "",
            cardVariant: data.cardType,
          },
          branding: {
            backgroundColor: theme.backgroundColor,
            primaryColor: theme.primaryColor,
            secondaryColor: theme.secondaryColor,
            accentColor: theme.accentColor,
            logoUrl: data.logoUrl,
            heroImageUrl: data.bannerUrl,
            stampEmoji: data.stampEmoji || theme.stampEmoji,
          },
          logic: data.cardType === "stamp" ? {
            totalStamps: 10,
            reward: "Free item",
            progressLabel: "collected",
          } : data.cardType === "points" ? {
            pointsPerDollar: 1,
            rewardThreshold: 100,
            reward: "10% off",
            progressLabel: "earned",
          } : {
            tierName: "Gold",
            reward: "VIP perks",
            progressLabel: "member",
          },
        }),
      });
      if (!res.ok) return false;
      const result = await res.json();
      await fetch(`/api/admin/cards/${result.card.id}/publish`, { method: "POST" }).catch(() => {});
      return true;
    } catch {
      return false;
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Progress bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "white", padding: "20px 24px 0" }}>
        <div style={{ height: 4, backgroundColor: "rgba(10,10,10,0.06)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%", backgroundColor: "#111111", borderRadius: 99,
            width: `${progress * 100}%`, transition: "width 0.4s cubic-bezier(0.2, 0, 0, 1)",
          }} />
        </div>
        <div style={{ fontSize: 12, color: "rgba(10,10,10,0.3)", textAlign: "center", marginTop: 8, fontWeight: 500 }}>
          Step {step} of {TOTAL_STEPS}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "40px 24px 120px" }}>
        <div style={{ width: "100%", maxWidth: step === 3 ? 800 : step === 4 ? 900 : 640 }}>

          {/* Step 1: Business Type */}
          {step === 1 && (() => {
            const bizImages: Record<string, string> = {
              cafe: "/images/brands/biz-cafe.png",
              restaurant: "/images/brands/biz-sushi.png",
              bakery: "/images/brands/biz-bakery.png",
              barber: "/images/brands/biz-barber.png",
              salon: "/images/brands/biz-salon.png",
              gym: "/images/brands/biz-gym.png",
              retail: "/images/brands/biz-books.png",
              other: "/images/brands/biz-flowers.png",
            };
            return (
            <div style={{ animation: "fadeInUp 0.5s ease" }}>
              <h1 style={{ fontSize: 30, fontWeight: 800, color: "rgba(0,0,0,0.9)", margin: "0 0 16px", textAlign: "center", letterSpacing: "-0.45px" }}>
                What type of business do you run?
              </h1>
              <p style={{ fontSize: 16, color: "rgba(0,0,0,0.55)", textAlign: "center", margin: "0 0 32px", letterSpacing: "0.16px" }}>
                We&apos;ll customize your loyalty card based on your industry
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="biz-type-grid">
                {businessTypes.map((bt) => {
                  const selected = data.businessType === bt.id;
                  return (
                    <button
                      key={bt.id}
                      onClick={() => setData({ ...data, businessType: bt.id })}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "stretch",
                        padding: 0, borderRadius: 16, cursor: "pointer", fontFamily: "inherit",
                        border: selected ? "2px solid #111111" : "1px solid rgba(10,10,10,0.08)",
                        backgroundColor: "white", overflow: "hidden",
                        transition: "all 0.2s ease",
                        boxShadow: selected ? "0 4px 20px rgba(11,5,29,0.12)" : "none",
                        transform: selected ? "translateY(-2px)" : "none",
                      }}
                    >
                      {/* Image */}
                      <div style={{
                        aspectRatio: "4/3", overflow: "hidden",
                        backgroundColor: "rgb(243,242,238)",
                      }}>
                        <img
                          src={bizImages[bt.id] || bizImages.other}
                          alt={bt.label}
                          style={{
                            width: "100%", height: "100%", objectFit: "cover",
                            display: "block",
                            filter: selected ? "none" : "grayscale(0.3)",
                            transition: "filter 0.2s",
                          }}
                        />
                      </div>
                      {/* Label */}
                      <div style={{
                        padding: "12px 14px",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                      }}>
                        <span style={{
                          fontSize: 13, fontWeight: 600,
                          color: selected ? "#111111" : "rgba(10,10,10,0.65)",
                        }}>
                          {bt.label}
                        </span>
                        {selected && (
                          <div style={{
                            width: 20, height: 20, borderRadius: "50%",
                            backgroundColor: "#111111", display: "flex",
                            alignItems: "center", justifyContent: "center",
                          }}>
                            <Check size={12} style={{ color: "white" }} />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            );
          })()}

          {/* Step 3: Theme — tall phone-shaped card previews */}
          {step === 3 && (
            <div style={{ animation: "fadeInUp 0.5s ease" }}>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 16, backgroundColor: "rgba(10,10,10,0.03)", marginBottom: 16 }}>
                  <CreditCard size={24} style={{ color: "rgba(10,10,10,0.5)" }} />
                </div>
                <h1 style={{ fontSize: 30, fontWeight: 800, color: "rgba(0,0,0,0.9)", margin: "0 0 8px", letterSpacing: "-0.45px" }}>
                  Select a theme
                </h1>
                <p style={{ fontSize: 16, color: "rgba(0,0,0,0.45)", margin: 0, letterSpacing: "0.16px" }}>
                  Pick the style that feels right — you can customize colors and emoji later
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }} className="theme-grid">
                {getThemesForType(data.businessType).map((t) => {
                  const selected = data.theme?.id === t.id;
                  return (
                    <div key={t.id} style={{ animation: "fadeInUp 0.6s cubic-bezier(0.2, 0, 0, 1)" }}>
                      <div style={{
                        borderRadius: 20, overflow: "hidden",
                        outline: selected ? "2.5px solid #111" : "none",
                        outlineOffset: "3px",
                        display: "flex", flexDirection: "column", alignItems: "center",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        transform: selected ? "translateY(-4px)" : "none",
                        boxShadow: selected ? "0 12px 28px rgba(0,0,0,0.12)" : "0 2px 8px rgba(0,0,0,0.06)",
                      }}>
                        <button
                          onClick={() => setData({ ...data, theme: t, stampEmoji: t.stampEmoji })}
                          style={{
                            display: "block", borderRadius: 20, overflow: "hidden",
                            cursor: "pointer", border: "none", padding: 0,
                            backgroundColor: "transparent", fontFamily: "inherit", width: "100%",
                          }}
                        >
                          {/* Phone-shaped wallet card mockup with realistic content */}
                          <div style={{
                            aspectRatio: "172.5 / 320",
                            backgroundColor: t.backgroundColor,
                            display: "flex", flexDirection: "column",
                            overflow: "hidden", position: "relative",
                          }}>
                            {/* Top bar: logo image + business name + valid until */}
                            <div style={{ padding: "10px 10px 6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <img
                                  src={t.logoImage}
                                  alt=""
                                  style={{
                                    width: 20, height: 20, borderRadius: 4,
                                    objectFit: "cover", flexShrink: 0,
                                  }}
                                />
                                <span style={{ fontSize: 8, fontWeight: 700, color: t.primaryColor, opacity: 0.9 }}>
                                  {t.mockBusiness}
                                </span>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 5, fontWeight: 600, color: t.secondaryColor, textTransform: "uppercase", letterSpacing: "0.2px" }}>VALID UNTIL</div>
                                <div style={{ fontSize: 8, fontWeight: 700, color: t.primaryColor }}>17/04/2027</div>
                              </div>
                            </div>

                            {/* Banner image strip */}
                            <div style={{
                              flex: "0 0 36%", position: "relative", overflow: "hidden",
                            }}>
                              <img
                                src={t.bannerImage}
                                alt=""
                                style={{
                                  width: "100%", height: "100%", objectFit: "cover",
                                  display: "block",
                                }}
                              />
                              <div style={{
                                position: "absolute", inset: 0,
                                background: `linear-gradient(transparent 20%, ${t.backgroundColor}cc 100%)`,
                              }} />
                              {/* Card type overlay */}
                              {data.cardType === "stamp" && (
                                <div style={{
                                  position: "absolute", inset: 0,
                                  display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
                                  alignItems: "center", justifyItems: "center",
                                  alignContent: "center",
                                  padding: "4px 8px", gap: "2px 0",
                                }}>
                                  {Array.from({ length: 8 }).map((_, i) => (
                                    <span key={i} style={{
                                      fontSize: 24, lineHeight: 1,
                                      opacity: i < 3 ? 1 : 0.15,
                                      filter: i >= 3 ? "grayscale(1)" : "none",
                                    }}>
                                      {t.stampEmoji}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {data.cardType === "points" && (
                                <div style={{
                                  position: "absolute", inset: 0,
                                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                  padding: "4px 10px",
                                }}>
                                  <div style={{ fontSize: 28, fontWeight: 800, color: "white", textShadow: "0 1px 4px rgba(0,0,0,0.4)", lineHeight: 1 }}>1,250</div>
                                  <div style={{ fontSize: 7, fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: "1px", marginTop: 2, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>POINTS</div>
                                </div>
                              )}
                              {data.cardType === "vip" && (
                                <div style={{
                                  position: "absolute", inset: 0,
                                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                  padding: "4px 10px",
                                }}>
                                  <div style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 2, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>STATUS</div>
                                  <div style={{ fontSize: 16, fontWeight: 800, color: "#FFD700", textShadow: "0 1px 6px rgba(0,0,0,0.5)", letterSpacing: "0.5px" }}>Gold</div>
                                  <div style={{ width: 20, height: 1, backgroundColor: "rgba(255,215,0,0.5)", margin: "4px 0", borderRadius: 1 }} />
                                  <div style={{ fontSize: 6, fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "1px", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>VIP MEMBER</div>
                                </div>
                              )}
                            </div>

                            {/* Fields */}
                            <div style={{ padding: "6px 10px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <div>
                                <div style={{ fontSize: 5, fontWeight: 600, color: t.secondaryColor, textTransform: "uppercase", letterSpacing: "0.2px", marginBottom: 1 }}>
                                  {data.cardType === "stamp" ? "STAMPS UNTIL THE REWARD" : data.cardType === "points" ? "POINTS BALANCE" : "TIER"}
                                </div>
                                <div style={{ fontSize: 9, fontWeight: 600, color: t.primaryColor }}>
                                  {data.cardType === "stamp" ? "10 stamps" : data.cardType === "points" ? "1,250 pts" : "Gold"}
                                </div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 5, fontWeight: 600, color: t.secondaryColor, textTransform: "uppercase", letterSpacing: "0.2px", marginBottom: 1 }}>
                                  MEMBER
                                </div>
                                <div style={{ fontSize: 9, fontWeight: 600, color: t.primaryColor }}>
                                  John
                                </div>
                              </div>
                            </div>

                            {/* QR code */}
                            <div style={{ padding: "0 10px 6px", display: "flex", flexDirection: "column", alignItems: "center", flex: 1, justifyContent: "flex-end" }}>
                              <QrCode size={48} />
                              <div style={{ textAlign: "center", marginTop: 3, fontSize: 5, color: t.secondaryColor, opacity: 0.35 }}>
                                Powered by Kyro
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                      {/* Theme name + check */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12 }}>
                        {selected && (
                          <div style={{ width: 18, height: 18, borderRadius: 99, backgroundColor: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Check size={11} style={{ color: "white" }} />
                          </div>
                        )}
                        <span style={{ fontSize: 13, fontWeight: selected ? 700 : 500, color: selected ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.45)", transition: "all 0.15s" }}>
                          {t.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Card Type */}
          {step === 2 && (
            <div style={{ animation: "fadeInUp 0.5s ease" }}>
              <h1 style={{ fontSize: 30, fontWeight: 800, color: "rgba(0,0,0,0.9)", margin: "0 0 16px", textAlign: "center", letterSpacing: "-0.45px" }}>
                What are your goals?
              </h1>
              <p style={{ fontSize: 16, color: "rgba(0,0,0,0.55)", textAlign: "center", margin: "0 0 40px" }}>
                Choose the card type that fits your objective
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 480, margin: "0 auto" }}>
                {cardTypes.map((ct) => {
                  const selected = data.cardType === ct.id;
                  return (
                    <button
                      key={ct.id}
                      onClick={() => setData({ ...data, cardType: ct.id })}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "20px 24px", borderRadius: 16, cursor: "pointer", fontFamily: "inherit",
                        border: selected ? "2px solid #111111" : "1.5px solid rgba(10,10,10,0.08)",
                        backgroundColor: selected ? "rgba(11,5,29,0.03)" : "white",
                        textAlign: "left", transition: "all 0.2s",
                        boxShadow: selected ? "0 4px 16px rgba(11,5,29,0.08)" : "none",
                        transform: selected ? "scale(1.01)" : "none",
                      }}
                    >
                      <div>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: "rgba(10,10,10,0.85)", marginBottom: 3 }}>{ct.label}</div>
                          <div style={{ fontSize: 13, color: "rgba(10,10,10,0.45)", lineHeight: 1.4 }}>{ct.desc}</div>
                        </div>
                      </div>

                      <div style={{
                        width: 24, height: 24, borderRadius: "50%", flexShrink: 0, marginLeft: 16,
                        border: selected ? "none" : "2px solid rgba(10,10,10,0.12)",
                        backgroundColor: selected ? "#111111" : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s",
                      }}>
                        {selected && <Check size={14} style={{ color: "white" }} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Business Details — name, logo, banner + iPhone preview */}
          {step === 4 && (
            <div className="onboard-step4-layout" style={{ animation: "fadeInUp 0.5s ease", display: "flex", gap: 48 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1 style={{ fontSize: 30, fontWeight: 800, color: "rgba(0,0,0,0.9)", margin: "0 0 16px", letterSpacing: "-0.45px" }}>
                  Customize your card
                </h1>
                <p style={{ fontSize: 16, color: "rgba(0,0,0,0.55)", margin: "0 0 32px" }}>
                  Add your business name, logo, and banner image
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Business Name
                    </label>
                    <input
                      value={data.name}
                      onChange={(e) => setData({ ...data, name: e.target.value })}
                      placeholder="e.g. Bean & Grind"
                      style={{
                        width: "100%", padding: "14px 16px", borderRadius: 12,
                        border: "1.5px solid rgba(10,10,10,0.1)", fontSize: 15, fontFamily: "inherit",
                        color: "rgba(10,10,10,0.9)", outline: "none", boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* Card Name */}
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Card Name <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "rgba(10,10,10,0.3)" }}>(optional)</span>
                    </label>
                    <input
                      value={data.cardName}
                      onChange={(e) => setData({ ...data, cardName: e.target.value })}
                      placeholder={`e.g. ${data.name || "My"} Rewards`}
                      style={{
                        width: "100%", padding: "14px 16px", borderRadius: 12,
                        border: "1.5px solid rgba(10,10,10,0.1)", fontSize: 15, fontFamily: "inherit",
                        color: "rgba(10,10,10,0.9)", outline: "none", boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* Stamp emoji picker — only for stamp cards */}
                  {data.cardType === "stamp" && (
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.5)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Stamp Emoji
                      </label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {EMOJI_OPTIONS.map((emoji) => {
                          const active = (data.stampEmoji || data.theme?.stampEmoji) === emoji;
                          return (
                            <button key={emoji} onClick={() => setData({ ...data, stampEmoji: emoji })}
                              style={{
                                width: 42, height: 42, borderRadius: 10, border: active ? "2px solid #111" : "1.5px solid rgba(10,10,10,0.08)",
                                backgroundColor: active ? "rgba(17,17,17,0.05)" : "white",
                                fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all 0.15s", transform: active ? "scale(1.1)" : "none",
                              }}
                            >{emoji}</button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Logo upload */}
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.5)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Logo
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{
                        width: 72, height: 72, borderRadius: 14, overflow: "hidden",
                        backgroundColor: "rgba(10,10,10,0.04)", border: "1.5px dashed rgba(10,10,10,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        {data.logoUrl ? (
                          <img src={data.logoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <span style={{ fontSize: 24, color: "rgba(10,10,10,0.2)" }}>+</span>
                        )}
                      </div>
                      <div>
                        <label style={{
                          display: "inline-block", padding: "8px 16px", borderRadius: 8,
                          border: "1px solid rgba(10,10,10,0.1)", backgroundColor: "white",
                          fontSize: 13, fontWeight: 500, color: "rgba(10,10,10,0.7)",
                          cursor: "pointer", fontFamily: "inherit",
                        }}>
                          Upload logo
                          <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => setData({ ...data, logoUrl: ev.target?.result as string });
                              reader.readAsDataURL(file);
                            }
                          }} />
                        </label>
                        <p style={{ fontSize: 11, color: "rgba(10,10,10,0.3)", margin: "4px 0 0" }}>Square image, 200x200px or larger</p>
                      </div>
                    </div>
                  </div>

                  {/* Banner upload */}
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.5)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Banner Image
                    </label>
                    <div style={{
                      width: "100%", aspectRatio: "3/1", borderRadius: 14, overflow: "hidden",
                      backgroundColor: "rgba(10,10,10,0.04)", border: "1.5px dashed rgba(10,10,10,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", position: "relative",
                    }}>
                      {data.bannerUrl ? (
                        <img src={data.bannerUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ textAlign: "center" }}>
                          <span style={{ fontSize: 28, color: "rgba(10,10,10,0.15)" }}>+</span>
                          <p style={{ fontSize: 12, color: "rgba(10,10,10,0.3)", margin: "4px 0 0" }}>Upload banner</p>
                        </div>
                      )}
                      <input type="file" accept="image/*" style={{
                        position: "absolute", inset: 0, opacity: 0, cursor: "pointer",
                      }} onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => setData({ ...data, bannerUrl: ev.target?.result as string });
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* iPhone mockup preview */}
              <div className="onboard-preview" style={{ width: 260, flexShrink: 0 }}>
                <div style={{ position: "sticky", top: 60 }}>
                  {data.theme && (
                    <div style={{
                      border: "10px solid #1a1a1a", borderRadius: 52,
                      overflow: "hidden", backgroundColor: "#000",
                      boxShadow: "0 24px 60px rgba(0,0,0,0.25), inset 0 0 0 2px #333",
                      position: "relative",
                    }}>
                      {/* Status bar */}
                      <div style={{ height: 54, backgroundColor: "#000", padding: "14px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
                        <span style={{ fontSize: 15, fontWeight: 600, color: "white", letterSpacing: "-0.3px" }}>9:41</span>
                        {/* Dynamic Island */}
                        <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 120, height: 34, borderRadius: 20, backgroundColor: "#000", zIndex: 2 }} />
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          {/* Signal bars */}
                          <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="9" width="3" height="3" rx="0.5" fill="white"/><rect x="4.5" y="6" width="3" height="6" rx="0.5" fill="white"/><rect x="9" y="3" width="3" height="9" rx="0.5" fill="white"/><rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="white"/></svg>
                          {/* WiFi */}
                          <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 11.5a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" fill="white"/><path d="M4.7 7.8a4.7 4.7 0 016.6 0" stroke="white" strokeWidth="1.3" strokeLinecap="round"/><path d="M2.3 5.3a8 8 0 0111.4 0" stroke="white" strokeWidth="1.3" strokeLinecap="round"/></svg>
                          {/* Battery */}
                          <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="white" strokeOpacity="0.35"/><rect x="2" y="2" width="18" height="9" rx="2" fill="white"/><path d="M25 4.5v4a2 2 0 000-4z" fill="white" fillOpacity="0.4"/></svg>
                        </div>
                      </div>

                      {/* Wallet top bar */}
                      <div style={{ padding: "4px 16px 8px", backgroundColor: "#000", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: "#007AFF", fontWeight: 500 }}>Cancel</span>
                        <span style={{ fontSize: 11, color: "white", fontWeight: 600, opacity: 0.5, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{data.name || "Loyalty Card"}</span>
                        <span style={{ fontSize: 11, color: "#007AFF", fontWeight: 600 }}>Add</span>
                      </div>

                      {/* Wallet card */}
                      <div style={{ backgroundColor: "#000", padding: "8px 12px 0" }}>
                        <div style={{ backgroundColor: data.theme.backgroundColor, borderRadius: 14, overflow: "hidden" }}>
                          {/* Header */}
                          <div style={{ padding: "12px 14px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              {data.logoUrl ? (
                                <img src={data.logoUrl} alt="" style={{ width: 28, height: 28, borderRadius: 7, objectFit: "cover" }} />
                              ) : (
                                <div style={{ width: 28, height: 28, borderRadius: 7, backgroundColor: data.theme.accentColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <span style={{ fontSize: 10, fontWeight: 900, color: data.theme.primaryColor }}>{(data.name || "K").charAt(0)}</span>
                                </div>
                              )}
                              <span style={{ fontSize: 12, fontWeight: 700, color: data.theme.primaryColor }}>{data.name || "Your Business"}</span>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: 7, fontWeight: 600, color: data.theme.secondaryColor, textTransform: "uppercase" }}>VALID UNTIL</div>
                              <div style={{ fontSize: 11, fontWeight: 700, color: data.theme.primaryColor }}>18/04/2027</div>
                            </div>
                          </div>

                          {/* Banner strip */}
                          <div style={{ height: 90, position: "relative", overflow: "hidden" }}>
                            {data.bannerUrl ? (
                              <>
                                <img src={data.bannerUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
                              </>
                            ) : (
                              <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${data.theme.accentColor}40, ${data.theme.backgroundColor})` }} />
                            )}
                            {data.cardType === "stamp" && (
                              <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", alignItems: "center", justifyItems: "center", alignContent: "center", padding: "6px 12px", gap: "2px 0" }}>
                                {Array.from({ length: 8 }).map((_, i) => (
                                  <span key={i} style={{ fontSize: 20, opacity: i < 3 ? 1 : 0.25, filter: i >= 3 ? "grayscale(1)" : "none" }}>
                                    {data.stampEmoji || data.theme!.stampEmoji}
                                  </span>
                                ))}
                              </div>
                            )}
                            {data.cardType === "points" && (
                              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                <div style={{ fontSize: 36, fontWeight: 800, color: "white", textShadow: "0 2px 6px rgba(0,0,0,0.4)", lineHeight: 1 }}>1,250</div>
                                <div style={{ fontSize: 10, fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: "2px", marginTop: 4, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>POINTS</div>
                              </div>
                            )}
                            {data.cardType === "vip" && (
                              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "3px", marginBottom: 4, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>STATUS</div>
                                <div style={{ fontSize: 22, fontWeight: 800, color: "#FFD700", textShadow: "0 2px 8px rgba(0,0,0,0.5)", letterSpacing: "1px" }}>Gold</div>
                                <div style={{ width: 30, height: 1, backgroundColor: "rgba(255,215,0,0.5)", margin: "6px 0", borderRadius: 1 }} />
                                <div style={{ fontSize: 8, fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "2px", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>VIP MEMBER</div>
                              </div>
                            )}
                          </div>

                          {/* Fields */}
                          <div style={{ padding: "10px 14px", display: "flex", justifyContent: "space-between" }}>
                            <div>
                              <div style={{ fontSize: 7, fontWeight: 600, color: data.theme.secondaryColor, textTransform: "uppercase" }}>
                                {data.cardType === "stamp" ? "STAMPS UNTIL REWARD" : data.cardType === "points" ? "POINTS BALANCE" : "TIER"}
                              </div>
                              <div style={{ fontSize: 12, fontWeight: 600, color: data.theme.primaryColor }}>
                                {data.cardType === "stamp" ? "10 stamps" : data.cardType === "points" ? "1,250 pts" : "Gold"}
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: 7, fontWeight: 600, color: data.theme.secondaryColor, textTransform: "uppercase" }}>MEMBER</div>
                              <div style={{ fontSize: 12, fontWeight: 500, color: data.theme.primaryColor }}>Jane Smith</div>
                            </div>
                          </div>

                          {/* QR */}
                          <div style={{ padding: "8px 14px 12px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <QrCode size={80} />
                            <div style={{ fontSize: 7, color: data.theme.secondaryColor, marginTop: 4, opacity: 0.4 }}>Powered by Kyro</div>
                          </div>
                        </div>
                      </div>

                      {/* iPhone home indicator */}
                      <div style={{ height: 28, backgroundColor: "#000", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <div style={{ width: 120, height: 5, borderRadius: 3, backgroundColor: "#555" }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Success — iPhone mockup with confetti */}
          {step === 5 && (() => {
            const t = data.theme;
            return (
            <div style={{ animation: "fadeInUp 0.5s ease", position: "relative" }}>
              {/* Confetti canvas */}
              <div className="confetti-container" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50, overflow: "hidden" }}>
                {Array.from({ length: 150 }).map((_, i) => (
                  <div key={i} className="confetti-piece" style={{
                    position: "absolute",
                    left: `${Math.random() * 100}%`,
                    top: `-${Math.random() * 15 + 2}%`,
                    width: Math.random() * 12 + 6,
                    height: Math.random() * 16 + 8,
                    backgroundColor: ["#f59e0b", "#ec4899", "#10b981", "#0ea5e9", "#ef4444", "#f97316", "#8b5cf6", "#14b8a6", "#eab308"][Math.floor(Math.random() * 9)],
                    borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                    animation: `confettiFall ${Math.random() * 2.5 + 1.5}s ease-in ${Math.random() * 1}s forwards`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                    opacity: 0.9,
                  }} />
                ))}
              </div>

              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <h1 style={{ fontSize: 30, fontWeight: 800, color: "rgba(0,0,0,0.9)", margin: "0 0 8px", letterSpacing: "-0.45px" }}>
                  Looking good!
                </h1>
                <p style={{ fontSize: 16, color: "rgba(0,0,0,0.55)", margin: 0 }}>
                  Your loyalty card is ready. Share it with your customers.
                </p>
              </div>

              {/* iPhone mockup with card */}
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1, position: "relative", zIndex: 2 }}>
                <div style={{
                  width: "100%", maxWidth: 280,
                  border: "10px solid #1a1a1a", borderRadius: 52,
                  overflow: "hidden", backgroundColor: "#000",
                  boxShadow: "0 30px 80px rgba(0,0,0,0.3), inset 0 0 0 2px #333",
                  position: "relative",
                }}>
                  {/* Status bar */}
                  <div style={{ height: 54, backgroundColor: "#000", padding: "14px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "white", letterSpacing: "-0.3px" }}>9:41</span>
                    <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 120, height: 34, borderRadius: 20, backgroundColor: "#000", zIndex: 2 }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="9" width="3" height="3" rx="0.5" fill="white"/><rect x="4.5" y="6" width="3" height="6" rx="0.5" fill="white"/><rect x="9" y="3" width="3" height="9" rx="0.5" fill="white"/><rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="white"/></svg>
                      <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 11.5a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" fill="white"/><path d="M4.7 7.8a4.7 4.7 0 016.6 0" stroke="white" strokeWidth="1.3" strokeLinecap="round"/><path d="M2.3 5.3a8 8 0 0111.4 0" stroke="white" strokeWidth="1.3" strokeLinecap="round"/></svg>
                      <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="white" strokeOpacity="0.35"/><rect x="2" y="2" width="18" height="9" rx="2" fill="white"/><path d="M25 4.5v4a2 2 0 000-4z" fill="white" fillOpacity="0.4"/></svg>
                    </div>
                  </div>

                  {/* Wallet top bar */}
                  <div style={{ padding: "4px 16px 8px", backgroundColor: "#000", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "#007AFF", fontWeight: 500 }}>Cancel</span>
                    <span style={{ fontSize: 11, color: "white", fontWeight: 600, opacity: 0.5, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{data.name || "Loyalty Card"}</span>
                    <span style={{ fontSize: 11, color: "#007AFF", fontWeight: 600 }}>Add</span>
                  </div>

                  {t && (
                    <div style={{ backgroundColor: "#000", padding: "8px 12px 0" }}>
                      <div style={{ backgroundColor: t.backgroundColor, borderRadius: 14, overflow: "hidden" }}>
                        <div style={{ padding: "14px 16px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            {data.logoUrl ? (
                              <img src={data.logoUrl} alt="" style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover" }} />
                            ) : (
                              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: t.accentColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ fontSize: 12, fontWeight: 900, color: t.primaryColor }}>{(data.name || "K").charAt(0)}</span>
                              </div>
                            )}
                            <span style={{ fontSize: 14, fontWeight: 700, color: t.primaryColor }}>{data.name || "Your Business"}</span>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 8, fontWeight: 600, color: t.secondaryColor, textTransform: "uppercase" }}>VALID UNTIL</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: t.primaryColor }}>18/04/2027</div>
                          </div>
                        </div>

                        <div style={{ height: 110, position: "relative", overflow: "hidden" }}>
                          {data.bannerUrl ? (
                            <><img src={data.bannerUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /><div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} /></>
                          ) : (
                            <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${t.accentColor}40, ${t.backgroundColor})` }} />
                          )}
                          {data.cardType === "stamp" && (
                            <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", alignItems: "center", justifyItems: "center", alignContent: "center", padding: "6px 14px", gap: "2px 0" }}>
                              {Array.from({ length: 8 }).map((_, i) => (
                                <span key={i} style={{ fontSize: 22, opacity: i < 3 ? 1 : 0.15, filter: i >= 3 ? "grayscale(1)" : "none" }}>{data.stampEmoji || t.stampEmoji}</span>
                              ))}
                            </div>
                          )}
                          {data.cardType === "points" && (
                            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                              <div style={{ fontSize: 40, fontWeight: 800, color: "white", textShadow: "0 2px 8px rgba(0,0,0,0.4)", lineHeight: 1 }}>1,250</div>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: "2px", marginTop: 4, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>POINTS</div>
                            </div>
                          )}
                          {data.cardType === "vip" && (
                            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "3px", marginBottom: 4, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>STATUS</div>
                              <div style={{ fontSize: 26, fontWeight: 800, color: "#FFD700", textShadow: "0 2px 10px rgba(0,0,0,0.5)", letterSpacing: "1px" }}>Gold</div>
                              <div style={{ width: 36, height: 1, backgroundColor: "rgba(255,215,0,0.5)", margin: "6px 0", borderRadius: 1 }} />
                              <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "2px", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>VIP MEMBER</div>
                            </div>
                          )}
                        </div>

                        <div style={{ padding: "10px 16px", display: "flex", justifyContent: "space-between" }}>
                          <div>
                            <div style={{ fontSize: 8, fontWeight: 600, color: t.secondaryColor, textTransform: "uppercase" }}>
                              {data.cardType === "stamp" ? "STAMPS UNTIL REWARD" : data.cardType === "points" ? "POINTS BALANCE" : "TIER"}
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: t.primaryColor }}>
                              {data.cardType === "stamp" ? "10 stamps" : data.cardType === "points" ? "1,250 pts" : "Gold"}
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 8, fontWeight: 600, color: t.secondaryColor, textTransform: "uppercase" }}>MEMBER</div>
                            <div style={{ fontSize: 14, fontWeight: 500, color: t.primaryColor }}>Jane Smith</div>
                          </div>
                        </div>

                        <div style={{ padding: "10px 16px 14px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <QrCode size={90} />
                          <div style={{ fontSize: 8, color: t.secondaryColor, marginTop: 6, opacity: 0.4 }}>Powered by Kyro</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Home indicator */}
                  <div style={{ height: 28, backgroundColor: "#000", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ width: 120, height: 5, borderRadius: 3, backgroundColor: "#555" }} />
                  </div>
                </div>
              </div>
            </div>
            );
          })()}
        </div>
      </div>

      {/* Bottom navigation */}
      {/* Step 5: auto-redirects after 4s, no button needed */}
      {step < 5 && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 10,
          background: "linear-gradient(transparent, white 30%)", padding: "40px 24px 24px",
        }}>
          <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "12px 20px", borderRadius: 99, border: "1px solid rgba(10,10,10,0.1)",
                  backgroundColor: "white", color: "rgba(10,10,10,0.7)", fontSize: 14, fontWeight: 500,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                <ArrowLeft size={16} /> Back
              </button>
            ) : <div />}

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                onClick={() => {
                  if (step === 4) {
                    handleFinish().then((ok) => {
                      if (ok) {
                        setStep(5);
                        setTimeout(() => router.push("/dashboard/loyalty"), 4000);
                      }
                    });
                  } else {
                    setStep(step + 1);
                  }
                }}
                disabled={!canContinue() || creating}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "12px 28px", borderRadius: 99, border: "none",
                  backgroundColor: canContinue() ? "#111111" : "rgba(10,10,10,0.08)",
                  color: canContinue() ? "white" : "rgba(10,10,10,0.3)",
                  fontSize: 14, fontWeight: 600, cursor: canContinue() ? "pointer" : "not-allowed",
                  fontFamily: "inherit", opacity: creating ? 0.7 : 1,
                }}
              >
                {creating ? "Creating..." : step === 4 ? "Create Card" : "Continue"} {!creating && step < 4 && <ArrowRight size={16} />}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(800px) rotate(720deg); opacity: 0; }
        }
        @media (max-width: 768px) {
          .onboard-preview { order: -1 !important; width: 100% !important; display: flex !important; justify-content: center !important; margin-bottom: 16px !important; }
          .onboard-preview > div { position: static !important; }
          .onboard-preview > div > div { transform: scale(0.8); transform-origin: top center; }
          .theme-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 14px !important; max-width: 100% !important; }
          .biz-type-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .goals-grid { grid-template-columns: 1fr !important; }
          .onboard-step4-layout { flex-direction: column !important; gap: 24px !important; }
        }
        @media (max-width: 480px) {
          .theme-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .biz-type-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
        }
      `}</style>
    </div>
  );
}
