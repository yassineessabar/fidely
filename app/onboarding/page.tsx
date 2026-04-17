"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { businessTypes, getThemesForType, OnboardingTheme } from "@/lib/onboarding-themes";
import { Coffee, UtensilsCrossed, Cake, Scissors, Sparkles, Dumbbell, ShoppingBag, Store, ArrowLeft, ArrowRight, Check } from "lucide-react";

const TOTAL_STEPS = 5;

const iconMap: Record<string, any> = {
  coffee: Coffee, utensils: UtensilsCrossed, cake: Cake, scissors: Scissors,
  sparkles: Sparkles, dumbbell: Dumbbell, "shopping-bag": ShoppingBag, store: Store,
};

const objectives = [
  { id: "retention", label: "Bring customers back", desc: "Turn one-time visitors into regulars with rewards", icon: "🔄" },
  { id: "sales", label: "Increase revenue", desc: "Drive more spend per visit with loyalty incentives", icon: "📈" },
  { id: "database", label: "Grow your audience", desc: "Capture customer details and build your database", icon: "👥" },
];

type State = {
  businessType: string;
  theme: OnboardingTheme | null;
  selectedObjectives: string[];
  name: string;
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
    selectedObjectives: [],
    name: "",
    description: "",
    logoUrl: "",
    bannerUrl: "",
  });

  const progress = step / TOTAL_STEPS;

  const canContinue = () => {
    if (step === 1) return !!data.businessType;
    if (step === 2) return !!data.theme;
    if (step === 3) return true; // objectives optional
    if (step === 4) return !!data.name;
    return true;
  };

  const handleFinish = async () => {
    setCreating(true);
    try {
      const theme = data.theme!;
      const res = await fetch("/api/merchant/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "stamp",
          name: `${data.name} Loyalty Card`,
          business_details: {
            name: data.name,
            category: data.businessType,
            description: data.description,
            tagline: "",
          },
          branding: {
            backgroundColor: theme.backgroundColor,
            primaryColor: theme.primaryColor,
            secondaryColor: theme.secondaryColor,
            accentColor: theme.accentColor,
            logoUrl: data.logoUrl,
            heroImageUrl: data.bannerUrl,
          },
          logic: {
            totalStamps: 10,
            reward: "Free item",
            progressLabel: "collected",
          },
        }),
      });
      if (res.ok) {
        const result = await res.json();
        // Publish the card
        await fetch(`/api/admin/cards/${result.card.id}/publish`, { method: "POST" }).catch(() => {});
        router.push("/dashboard/loyalty");
      }
    } catch {}
    finally { setCreating(false); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Progress bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "white", padding: "20px 24px 0" }}>
        <div style={{ height: 4, backgroundColor: "rgba(10,10,10,0.06)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%", backgroundColor: "#0b051d", borderRadius: 99,
            width: `${progress * 100}%`, transition: "width 0.4s cubic-bezier(0.2, 0, 0, 1)",
          }} />
        </div>
        <div style={{ fontSize: 12, color: "rgba(10,10,10,0.3)", textAlign: "center", marginTop: 8, fontWeight: 500 }}>
          Step {step} of {TOTAL_STEPS}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "40px 24px 120px" }}>
        <div style={{ width: "100%", maxWidth: step === 2 ? 800 : step === 4 ? 900 : 640 }}>

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
                        border: selected ? "2px solid #0b051d" : "1px solid rgba(10,10,10,0.08)",
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
                          color: selected ? "#0b051d" : "rgba(10,10,10,0.65)",
                        }}>
                          {bt.label}
                        </span>
                        {selected && (
                          <div style={{
                            width: 20, height: 20, borderRadius: "50%",
                            backgroundColor: "#0b051d", display: "flex",
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

          {/* Step 2: Theme — tall phone-shaped card previews like Linktree */}
          {step === 2 && (
            <div style={{ animation: "fadeInUp 0.5s ease" }}>
              <h1 style={{ fontSize: 30, fontWeight: 800, color: "rgba(0,0,0,0.9)", margin: "0 0 16px", textAlign: "center", letterSpacing: "-0.45px" }}>
                Select a theme
              </h1>
              <p style={{ fontSize: 16, color: "rgba(0,0,0,0.55)", textAlign: "center", margin: "0 0 24px", letterSpacing: "0.16px" }}>
                Pick the style that feels right — you can customize it later
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }} className="theme-grid">
                {getThemesForType(data.businessType).map((t) => {
                  const selected = data.theme?.id === t.id;
                  return (
                    <div key={t.id} style={{ animation: "fadeInUp 0.6s cubic-bezier(0.2, 0, 0, 1)" }}>
                      <div style={{
                        borderRadius: 16, overflow: "hidden",
                        outline: selected ? "1.5px solid rgb(0,0,0)" : "none",
                        outlineOffset: "1.5px",
                        display: "flex", flexDirection: "column", alignItems: "center",
                      }}>
                        <button
                          onClick={() => setData({ ...data, theme: t })}
                          style={{
                            display: "block", borderRadius: 16, overflow: "hidden",
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
                            {/* Top bar: logo image + business name */}
                            <div style={{ padding: "12px 12px 6px", display: "flex", alignItems: "center", gap: 6 }}>
                              <img
                                src={t.logoImage}
                                alt=""
                                style={{
                                  width: 22, height: 22, borderRadius: 5,
                                  objectFit: "cover", flexShrink: 0,
                                }}
                              />
                              <span style={{ fontSize: 8, fontWeight: 700, color: t.primaryColor, opacity: 0.9 }}>
                                {t.mockBusiness}
                              </span>
                            </div>

                            {/* Banner image strip */}
                            <div style={{
                              flex: "0 0 38%", position: "relative", overflow: "hidden",
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
                              {/* Stamp emojis — big, no background, like real wallet */}
                              <div style={{
                                position: "absolute", bottom: 2, left: 0, right: 0,
                                display: "flex", justifyContent: "center", gap: 1, padding: "0 4px", flexWrap: "wrap",
                              }}>
                                {Array.from({ length: Math.min(t.mockStamps, 10) }).map((_, i) => (
                                  <div key={i} style={{
                                    width: 18, height: 18,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    position: "relative",
                                  }}>
                                    <span style={{
                                      fontSize: 14, lineHeight: 1,
                                      opacity: i < 3 ? 1 : 0.2,
                                      filter: i >= 3 ? "grayscale(1)" : "none",
                                    }}>
                                      {t.stampEmoji}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Fields */}
                            <div style={{ padding: "8px 12px", flex: 1 }}>
                              <div style={{ fontSize: 6, fontWeight: 600, color: t.secondaryColor, textTransform: "uppercase", letterSpacing: "0.3px", marginBottom: 1 }}>
                                REWARD
                              </div>
                              <div style={{ fontSize: 9, fontWeight: 600, color: t.primaryColor, marginBottom: 6 }}>
                                {t.mockReward}
                              </div>
                              <div style={{ fontSize: 6, fontWeight: 600, color: t.secondaryColor, textTransform: "uppercase", letterSpacing: "0.3px", marginBottom: 1 }}>
                                MEMBER
                              </div>
                              <div style={{ fontSize: 8, fontWeight: 500, color: t.primaryColor, opacity: 0.6 }}>
                                Jane Smith
                              </div>
                            </div>

                            {/* QR code */}
                            <div style={{ padding: "0 12px 8px", display: "flex", justifyContent: "center" }}>
                              <div style={{
                                width: 40, height: 40, borderRadius: 5,
                                backgroundColor: "white", padding: 3,
                                display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridTemplateRows: "repeat(7, 1fr)", gap: 0.5,
                              }}>
                                {/* Simplified QR pattern */}
                                {[1,1,1,0,1,1,1, 1,0,1,0,1,0,1, 1,1,1,0,1,1,1, 0,0,0,0,0,0,0, 1,0,1,1,0,1,0, 0,1,0,0,1,0,1, 1,0,1,0,1,1,1].map((v, i) => (
                                  <div key={i} style={{ backgroundColor: v ? "#0b051d" : "white", borderRadius: 0.5 }} />
                                ))}
                              </div>
                            </div>

                            {/* Powered by */}
                            <div style={{ textAlign: "center", paddingBottom: 6, fontSize: 5, color: t.secondaryColor, opacity: 0.35 }}>
                              Powered by Kyro
                            </div>
                          </div>
                        </button>
                      </div>
                      {/* Theme name below card */}
                      <div style={{ textAlign: "center", marginTop: 8, fontSize: 12, fontWeight: 500, color: selected ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.5)" }}>
                        {t.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Objectives */}
          {step === 3 && (
            <div style={{ animation: "fadeInUp 0.5s ease" }}>
              <h1 style={{ fontSize: 30, fontWeight: 800, color: "rgba(0,0,0,0.9)", margin: "0 0 16px", textAlign: "center", letterSpacing: "-0.45px" }}>
                What are your goals?
              </h1>
              <p style={{ fontSize: 16, color: "rgba(0,0,0,0.55)", textAlign: "center", margin: "0 0 40px" }}>
                Select all that apply
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 560, margin: "0 auto" }} className="goals-grid">
                {objectives.map((obj) => {
                  const selected = data.selectedObjectives.includes(obj.id);
                  return (
                    <button
                      key={obj.id}
                      onClick={() => {
                        const next = selected
                          ? data.selectedObjectives.filter((o) => o !== obj.id)
                          : [...data.selectedObjectives, obj.id];
                        setData({ ...data, selectedObjectives: next });
                      }}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center",
                        padding: "28px 16px", borderRadius: 16, cursor: "pointer", fontFamily: "inherit",
                        border: selected ? "2px solid #0b051d" : "1px solid rgba(10,10,10,0.08)",
                        backgroundColor: selected ? "rgba(11,5,29,0.03)" : "white",
                        textAlign: "center", transition: "all 0.2s",
                        boxShadow: selected ? "0 4px 16px rgba(11,5,29,0.08)" : "none",
                      }}
                    >
                      <div style={{ fontSize: 32, marginBottom: 12 }}>{obj.icon}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(10,10,10,0.85)", marginBottom: 4 }}>{obj.label}</div>
                      <div style={{ fontSize: 12, color: "rgba(10,10,10,0.4)", lineHeight: 1.4 }}>{obj.desc}</div>
                      {selected && (
                        <div style={{ width: 22, height: 22, borderRadius: "50%", backgroundColor: "#0b051d", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 12 }}>
                          <Check size={13} style={{ color: "white" }} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Business Details — name, logo, banner + iPhone preview */}
          {step === 4 && (
            <div style={{ animation: "fadeInUp 0.5s ease", display: "flex", gap: 48 }}>
              <div style={{ flex: 1 }}>
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
              <div className="onboard-preview" style={{ width: 300, flexShrink: 0 }}>
                <div style={{ position: "sticky", top: 60 }}>
                  {data.theme && (
                    <div style={{
                      border: "8px solid #e5e5e5", borderRadius: 40,
                      overflow: "hidden", backgroundColor: "#000",
                      boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
                    }}>
                      {/* iPhone notch */}
                      <div style={{ height: 28, backgroundColor: "#000", display: "flex", justifyContent: "center", alignItems: "flex-end", paddingBottom: 4 }}>
                        <div style={{ width: 80, height: 5, borderRadius: 3, backgroundColor: "#333" }} />
                      </div>

                      {/* Wallet card */}
                      <div style={{ backgroundColor: data.theme.backgroundColor, margin: 8, borderRadius: 14, overflow: "hidden" }}>
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
                          {/* Stamp emojis */}
                          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 3, flexWrap: "wrap", padding: "8px 12px" }}>
                            {Array.from({ length: 10 }).map((_, i) => (
                              <span key={i} style={{ fontSize: 16, opacity: i < 3 ? 1 : 0.25, filter: i >= 3 ? "grayscale(1)" : "none" }}>
                                {data.theme!.stampEmoji}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Fields */}
                        <div style={{ padding: "10px 14px", display: "flex", justifyContent: "space-between" }}>
                          <div>
                            <div style={{ fontSize: 7, fontWeight: 600, color: data.theme.secondaryColor, textTransform: "uppercase" }}>STAMPS UNTIL REWARD</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: data.theme.primaryColor }}>10 stamps</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 7, fontWeight: 600, color: data.theme.secondaryColor, textTransform: "uppercase" }}>MEMBER</div>
                            <div style={{ fontSize: 12, fontWeight: 500, color: data.theme.primaryColor }}>Jane Smith</div>
                          </div>
                        </div>

                        {/* QR */}
                        <div style={{ padding: "8px 14px 12px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <div style={{ width: 56, height: 56, borderRadius: 8, backgroundColor: "white", padding: 4, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridTemplateRows: "repeat(7, 1fr)", gap: 0.5 }}>
                            {[1,1,1,0,1,1,1, 1,0,1,0,1,0,1, 1,1,1,0,1,1,1, 0,0,0,0,0,0,0, 1,0,1,1,0,1,0, 0,1,0,0,1,0,1, 1,0,1,0,1,1,1].map((v, i) => (
                              <div key={i} style={{ backgroundColor: v ? "#0b051d" : "white" }} />
                            ))}
                          </div>
                          <div style={{ fontSize: 7, color: data.theme.secondaryColor, marginTop: 4, opacity: 0.4 }}>Powered by Kyro</div>
                        </div>
                      </div>

                      {/* iPhone bottom bar */}
                      <div style={{ height: 20, backgroundColor: "#000", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <div style={{ width: 100, height: 4, borderRadius: 2, backgroundColor: "#333" }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div style={{ animation: "fadeInUp 0.5s ease", textAlign: "center", paddingTop: 40 }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                backgroundColor: "rgba(16,185,129,0.1)", display: "flex",
                alignItems: "center", justifyContent: "center", margin: "0 auto 24px",
              }}>
                <Check size={36} style={{ color: "rgb(16,185,129)" }} />
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 700, color: "rgba(10,10,10,0.9)", margin: "0 0 8px" }}>
                You&apos;re all set!
              </h1>
              <p style={{ fontSize: 15, color: "rgba(10,10,10,0.45)", margin: "0 0 40px", maxWidth: 400, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
                Your loyalty card has been created. Share it with your customers to start building loyalty.
              </p>
              <button
                onClick={() => router.push("/dashboard/loyalty")}
                style={{
                  padding: "14px 40px", borderRadius: 99, border: "none",
                  backgroundColor: "#0b051d", color: "white", fontSize: 15, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom navigation */}
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
              {step === 3 && (
                <button
                  onClick={() => setStep(step + 1)}
                  style={{
                    padding: "12px 20px", borderRadius: 99, border: "none",
                    backgroundColor: "transparent", color: "rgba(10,10,10,0.4)", fontSize: 14, fontWeight: 500,
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Skip
                </button>
              )}
              <button
                onClick={() => {
                  if (step === 4) {
                    handleFinish().then(() => setStep(5));
                  } else {
                    setStep(step + 1);
                  }
                }}
                disabled={!canContinue() || creating}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "12px 28px", borderRadius: 99, border: "none",
                  backgroundColor: canContinue() ? "#0b051d" : "rgba(10,10,10,0.08)",
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
        @media (max-width: 768px) {
          .onboard-preview { display: none !important; }
          .theme-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
          .biz-type-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .goals-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 400px) {
          .theme-grid { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
        }
      `}</style>
    </div>
  );
}
