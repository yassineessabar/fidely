"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Check, Image, Upload, Trash2, Sparkles } from "lucide-react";

const EMOJI_OPTIONS = ["☕", "🍵", "🧁", "🍕", "🍣", "🍽️", "🎂", "🍞", "🍫", "✂️", "💈", "👑", "💅", "💆", "💇", "✨", "💪", "🔥", "🏋️", "🧘", "👜", "🌸", "🎁", "📚", "⭐", "🍦", "🍷", "🐾", "🎵", "🎮", "🏆", "❤️", "🌟", "🎯", "🛍️"];

const THEME_PRESETS = [
  { id: "kyro-dark", name: "Kyro Dark", bg: "#0B051D", primary: "#FFFFFF", secondary: "#E6FFA9", accent: "#6C47FF" },
  { id: "warm-roast", name: "Warm Roast", bg: "#f2e8dc", primary: "#2c1810", secondary: "#c67a2e", accent: "#c67a2e" },
  { id: "dark-brew", name: "Dark Brew", bg: "#1a1006", primary: "#fffbeb", secondary: "#fcd34d", accent: "#f59e0b" },
  { id: "forest", name: "Forest", bg: "#1a2e1a", primary: "#f0fdf4", secondary: "#86efac", accent: "#22c55e" },
  { id: "rose", name: "Rose", bg: "#f5a0a0", primary: "#ffffff", secondary: "#fff0f0", accent: "#e86b6b" },
  { id: "lavender", name: "Lavender", bg: "#ede9fe", primary: "#3b0764", secondary: "#a78bfa", accent: "#7c3aed" },
  { id: "navy", name: "Navy", bg: "#0a1628", primary: "#e0f2fe", secondary: "#7dd3fc", accent: "#0284c7" },
  { id: "noir", name: "Noir", bg: "#111111", primary: "#fafafa", secondary: "#a3a3a3", accent: "#ffffff" },
  { id: "clean", name: "Clean White", bg: "#ffffff", primary: "#1a1a1a", secondary: "#737373", accent: "#111111" },
  { id: "elegant", name: "Elegant", bg: "#1a1a1a", primary: "#f5f0e8", secondary: "#e0c097", accent: "#e0c097" },
  { id: "blush", name: "Blush", bg: "#fdf2f8", primary: "#831843", secondary: "#f9a8d4", accent: "#ec4899" },
  { id: "gold", name: "Gold", bg: "#1a1006", primary: "#fffbeb", secondary: "#fcd34d", accent: "#f59e0b" },
];

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

function QrCode({ size }: { size: number }) {
  const cs = (size - 8) / 25;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius: 8, backgroundColor: "white" }}>
      {QR_PATTERN.map((v, i) => v ? <rect key={i} x={4 + (i % 25) * cs} y={4 + Math.floor(i / 25) * cs} width={cs} height={cs} fill="#111" rx={cs * 0.15} /> : null)}
    </svg>
  );
}

const cardTypes = [
  { id: "stamp", label: "Stamp Card", desc: "Increase repeat visits" },
  { id: "points", label: "Points Card", desc: "Increase spending & engagement" },
  { id: "vip", label: "VIP / Loyalty Card", desc: "Reward loyal customers" },
];

const typeLabels: Record<string, string> = { stamp: "Stamp Card", points: "Points Card", vip: "VIP Card" };

export default function NewCardPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1); // 1=type, 2=design, 3=customize

  // Card data
  const [cardType, setCardType] = useState("stamp");
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("☕");
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [bgColor, setBgColor] = useState("#0B051D");
  const [primaryColor, setPrimaryColor] = useState("#FFFFFF");
  const [secondaryColor, setSecondaryColor] = useState("#E6FFA9");
  const [accentColor, setAccentColor] = useState("#6C47FF");
  const [totalStamps, setTotalStamps] = useState(10);
  const [reward, setReward] = useState("Free item");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setter(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  async function handleCreate() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const dbType = cardType === "vip" ? "points" : cardType;
      const res = await fetch("/api/merchant/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: dbType,
          name: `${name} Loyalty Card`,
          business_details: {
            name,
            category: "",
            cardVariant: cardType,
          },
          branding: {
            backgroundColor: bgColor, primaryColor, secondaryColor, accentColor,
            logoUrl, heroImageUrl: bannerUrl, stampEmoji: emoji,
          },
          logic: cardType === "stamp" ? {
            totalStamps, reward, progressLabel: "collected",
          } : cardType === "points" ? {
            pointsPerDollar: 1, rewardThreshold: 100, reward, progressLabel: "earned",
          } : {
            tierName: "Gold", reward, progressLabel: "member",
          },
        }),
      });
      if (res.ok) {
        const { card } = await res.json();
        // Auto-publish
        await fetch(`/api/admin/cards/${card.id}/publish`, { method: "POST" }).catch(() => {});
        router.push("/dashboard/loyalty");
      }
    } finally { setSaving(false); }
  }

  const canContinue = step === 1 ? true : step === 2 ? !!name.trim() : true;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => step > 1 ? setStep(step - 1) : router.push("/dashboard/loyalty")} style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 36, height: 36, borderRadius: 10,
            border: "1px solid rgba(10,10,10,0.1)", backgroundColor: "white",
            cursor: "pointer", color: "rgba(10,10,10,0.5)",
          }}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "rgba(10,10,10,0.9)", margin: 0, letterSpacing: "-0.3px" }}>Create New Card</h1>
            <p style={{ fontSize: 12, color: "rgba(10,10,10,0.4)", margin: "2px 0 0" }}>
              Step {step} of 3 — {step === 1 ? "Choose card type" : step === 2 ? "Customize your card" : "Design & colors"}
            </p>
          </div>
        </div>
        {/* Progress dots */}
        <div style={{ display: "flex", gap: 6 }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{
              width: s === step ? 24 : 8, height: 8, borderRadius: 99,
              backgroundColor: s <= step ? "#111" : "rgba(10,10,10,0.1)",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>
      </div>

      {/* Content + Preview */}
      <div className="new-card-layout" style={{ display: "flex", gap: 40 }}>
        {/* Left: form steps */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Step 1: Card Type */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "rgba(10,10,10,0.9)", margin: "0 0 4px" }}>What type of card?</h2>
              <p style={{ fontSize: 14, color: "rgba(10,10,10,0.45)", margin: "0 0 8px" }}>Choose the card that fits your goals</p>
              {cardTypes.map((ct) => {
                const selected = cardType === ct.id;
                return (
                  <button key={ct.id} onClick={() => setCardType(ct.id)} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "20px 22px", borderRadius: 16, cursor: "pointer", fontFamily: "inherit",
                    border: selected ? "2px solid #111" : "1.5px solid rgba(10,10,10,0.08)",
                    backgroundColor: selected ? "rgba(17,17,17,0.02)" : "white",
                    textAlign: "left", transition: "all 0.2s",
                    boxShadow: selected ? "0 4px 16px rgba(0,0,0,0.06)" : "0 1px 3px rgba(0,0,0,0.02)",
                  }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "rgba(10,10,10,0.85)", marginBottom: 3 }}>{ct.label}</div>
                      <div style={{ fontSize: 13, color: "rgba(10,10,10,0.45)" }}>{ct.desc}</div>
                    </div>
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                      border: selected ? "none" : "2px solid rgba(10,10,10,0.12)",
                      backgroundColor: selected ? "#111" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {selected && <Check size={14} style={{ color: "white" }} />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 2: Name, Emoji, Logo, Banner */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "rgba(10,10,10,0.9)", margin: "0 0 4px" }}>Customize your card</h2>
                <p style={{ fontSize: 14, color: "rgba(10,10,10,0.45)", margin: "0 0 16px" }}>Add your business details</p>
              </div>

              {/* Business Name */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Business Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Bean & Grind"
                  style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1.5px solid rgba(10,10,10,0.1)", fontSize: 15, fontFamily: "inherit", color: "rgba(10,10,10,0.9)", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {/* Stamp Emoji */}
              {cardType === "stamp" && (
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.5)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Stamp Emoji</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {EMOJI_OPTIONS.map((e) => (
                      <button key={e} onClick={() => setEmoji(e)} style={{
                        width: 40, height: 40, borderRadius: 8,
                        border: emoji === e ? "2px solid #111" : "1.5px solid rgba(10,10,10,0.08)",
                        backgroundColor: emoji === e ? "rgba(17,17,17,0.05)" : "white",
                        fontSize: 19, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      }}>{e}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Card logic */}
              {cardType === "stamp" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Stamps</label>
                    <input type="number" min={3} max={20} value={totalStamps} onChange={(e) => setTotalStamps(Number(e.target.value))}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid rgba(10,10,10,0.1)", fontSize: 14, fontFamily: "inherit", color: "rgba(10,10,10,0.9)", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Reward</label>
                    <input value={reward} onChange={(e) => setReward(e.target.value)} placeholder="e.g. Free coffee"
                      style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid rgba(10,10,10,0.1)", fontSize: 14, fontFamily: "inherit", color: "rgba(10,10,10,0.9)", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                </div>
              )}

              {/* Logo */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.5)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Logo</label>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 72, height: 72, borderRadius: 14, overflow: "hidden", backgroundColor: "rgba(10,10,10,0.04)", border: "1.5px dashed rgba(10,10,10,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {logoUrl ? <img src={logoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Image size={24} style={{ color: "rgba(10,10,10,0.2)" }} />}
                  </div>
                  <div>
                    <label style={{ display: "inline-block", padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(10,10,10,0.1)", backgroundColor: "white", fontSize: 13, fontWeight: 500, color: "rgba(10,10,10,0.7)", cursor: "pointer", fontFamily: "inherit" }}>
                      Upload logo
                      <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFile(e, setLogoUrl)} />
                    </label>
                    {logoUrl && <button onClick={() => setLogoUrl("")} style={{ marginLeft: 8, padding: 8, borderRadius: 8, border: "none", backgroundColor: "transparent", cursor: "pointer", color: "rgba(10,10,10,0.3)" }}><Trash2 size={14} /></button>}
                    <p style={{ fontSize: 11, color: "rgba(10,10,10,0.3)", margin: "4px 0 0" }}>Square, 200x200px+</p>
                  </div>
                </div>
              </div>

              {/* Banner */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.5)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Banner Image</label>
                <div style={{ width: "100%", aspectRatio: "3/1", borderRadius: 14, overflow: "hidden", backgroundColor: "rgba(10,10,10,0.04)", border: "1.5px dashed rgba(10,10,10,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
                  {bannerUrl ? <img src={bannerUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ textAlign: "center" }}><Upload size={28} style={{ color: "rgba(10,10,10,0.15)" }} /><p style={{ fontSize: 12, color: "rgba(10,10,10,0.3)", margin: "4px 0 0" }}>Upload banner</p></div>}
                  <input type="file" accept="image/*" style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} onChange={(e) => handleFile(e, setBannerUrl)} />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Theme & Colors */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "rgba(10,10,10,0.9)", margin: "0 0 4px" }}>Design & Colors</h2>
                <p style={{ fontSize: 14, color: "rgba(10,10,10,0.45)", margin: "0 0 16px" }}>Pick a theme or customize colors</p>
              </div>

              {/* Theme Presets */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.5)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Theme</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }} className="new-theme-grid">
                  {THEME_PRESETS.map((p) => (
                    <button key={p.id} onClick={() => { setBgColor(p.bg); setPrimaryColor(p.primary); setSecondaryColor(p.secondary); setAccentColor(p.accent); }}
                      style={{
                        width: "100%", aspectRatio: "1", borderRadius: 10,
                        border: bgColor === p.bg && accentColor === p.accent ? "2.5px solid #111" : "1.5px solid rgba(10,10,10,0.08)",
                        cursor: "pointer", overflow: "hidden", position: "relative", backgroundColor: p.bg, padding: 0,
                      }}>
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", backgroundColor: p.accent, opacity: 0.6 }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.5)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Custom Colors</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { label: "Background", value: bgColor, set: setBgColor },
                    { label: "Text", value: primaryColor, set: setPrimaryColor },
                    { label: "Labels", value: secondaryColor, set: setSecondaryColor },
                    { label: "Accent", value: accentColor, set: setAccentColor },
                  ].map((c) => (
                    <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <input type="color" value={c.value} onChange={(e) => c.set(e.target.value)}
                        style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(10,10,10,0.1)", cursor: "pointer", padding: 2 }} />
                      <div>
                        <div style={{ fontSize: 11, color: "rgba(10,10,10,0.35)", textTransform: "uppercase", letterSpacing: "0.3px" }}>{c.label}</div>
                        <div style={{ fontSize: 13, fontFamily: "monospace", color: "rgba(10,10,10,0.6)" }}>{c.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bottom navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32, paddingBottom: 40 }}>
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} style={{
                padding: "12px 24px", borderRadius: 12, border: "1px solid rgba(10,10,10,0.1)",
                backgroundColor: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                color: "rgba(10,10,10,0.6)",
              }}>Back</button>
            ) : <div />}

            {step < 3 ? (
              <button onClick={() => setStep(step + 1)} disabled={!canContinue} style={{
                padding: "12px 28px", borderRadius: 12, border: "none",
                backgroundColor: canContinue ? "#111" : "rgba(10,10,10,0.08)",
                color: canContinue ? "white" : "rgba(10,10,10,0.3)",
                fontSize: 14, fontWeight: 600, cursor: canContinue ? "pointer" : "not-allowed", fontFamily: "inherit",
                boxShadow: canContinue ? "0 2px 8px rgba(0,0,0,0.12)" : "none",
              }}>Continue</button>
            ) : (
              <button onClick={handleCreate} disabled={saving || !name.trim()} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "12px 28px", borderRadius: 12, border: "none",
                backgroundColor: "#111", color: "white",
                fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit",
                opacity: saving ? 0.7 : 1, boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              }}>
                <Sparkles size={15} />
                {saving ? "Creating..." : "Create & Publish"}
              </button>
            )}
          </div>
        </div>

        {/* Right: iPhone preview */}
        <div className="new-card-preview" style={{ width: 260, flexShrink: 0 }}>
          <div style={{ position: "sticky", top: 60 }}>
            <div style={{
              border: "10px solid #1a1a1a", borderRadius: 52,
              overflow: "hidden", backgroundColor: "#000",
              boxShadow: "0 24px 60px rgba(0,0,0,0.25), inset 0 0 0 2px #333",
            }}>
              {/* Status bar */}
              <div style={{ height: 54, backgroundColor: "#000", padding: "14px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: "white" }}>9:41</span>
                <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 120, height: 34, borderRadius: 20, backgroundColor: "#000" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="9" width="3" height="3" rx="0.5" fill="white"/><rect x="4.5" y="6" width="3" height="6" rx="0.5" fill="white"/><rect x="9" y="3" width="3" height="9" rx="0.5" fill="white"/><rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="white"/></svg>
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 11.5a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" fill="white"/><path d="M4.7 7.8a4.7 4.7 0 016.6 0" stroke="white" strokeWidth="1.3" strokeLinecap="round"/><path d="M2.3 5.3a8 8 0 0111.4 0" stroke="white" strokeWidth="1.3" strokeLinecap="round"/></svg>
                  <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="white" strokeOpacity="0.35"/><rect x="2" y="2" width="18" height="9" rx="2" fill="white"/><path d="M25 4.5v4a2 2 0 000-4z" fill="white" fillOpacity="0.4"/></svg>
                </div>
              </div>

              {/* Wallet bar */}
              <div style={{ padding: "4px 16px 8px", backgroundColor: "#000", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: "#007AFF", fontWeight: 500 }}>Cancel</span>
                <span style={{ fontSize: 11, color: "white", fontWeight: 600, opacity: 0.5, maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name || "Loyalty Card"}</span>
                <span style={{ fontSize: 11, color: "#007AFF", fontWeight: 600 }}>Add</span>
              </div>

              {/* Card */}
              <div style={{ backgroundColor: "#000", padding: "8px 12px 0" }}>
                <div style={{ backgroundColor: bgColor, borderRadius: 14, overflow: "hidden" }}>
                  <div style={{ padding: "12px 14px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {logoUrl ? (
                        <img src={logoUrl} alt="" style={{ width: 28, height: 28, borderRadius: 7, objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: 28, height: 28, borderRadius: 7, backgroundColor: accentColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 10, fontWeight: 900, color: primaryColor }}>{(name || "K").charAt(0)}</span>
                        </div>
                      )}
                      <span style={{ fontSize: 12, fontWeight: 700, color: primaryColor }}>{name || "Your Business"}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 7, fontWeight: 600, color: secondaryColor, textTransform: "uppercase" }}>VALID UNTIL</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: primaryColor }}>18/04/2027</div>
                    </div>
                  </div>

                  <div style={{ height: 90, position: "relative", overflow: "hidden" }}>
                    {bannerUrl ? (
                      <><img src={bannerUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /><div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} /></>
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${accentColor}40, ${bgColor})` }} />
                    )}
                    {cardType === "stamp" && (
                      <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", alignItems: "center", justifyItems: "center", alignContent: "center", padding: "6px 12px", gap: "2px 0" }}>
                        {Array.from({ length: 8 }).map((_, i) => (
                          <span key={i} style={{ fontSize: 24, lineHeight: 1, opacity: i < 3 ? 1 : 0.15, filter: i >= 3 ? "grayscale(1)" : "none" }}>{emoji}</span>
                        ))}
                      </div>
                    )}
                    {cardType === "points" && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ fontSize: 36, fontWeight: 800, color: "white", textShadow: "0 2px 6px rgba(0,0,0,0.4)", lineHeight: 1 }}>1,250</div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: "2px", marginTop: 4 }}>POINTS</div>
                      </div>
                    )}
                    {cardType === "vip" && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "3px", marginBottom: 4 }}>STATUS</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: "#FFD700", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>Gold</div>
                      </div>
                    )}
                  </div>

                  <div style={{ padding: "10px 14px", display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 7, fontWeight: 600, color: secondaryColor, textTransform: "uppercase" }}>
                        {cardType === "stamp" ? "STAMPS UNTIL REWARD" : cardType === "points" ? "POINTS BALANCE" : "TIER"}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: primaryColor }}>
                        {cardType === "stamp" ? `${totalStamps} stamps` : cardType === "points" ? "1,250 pts" : "Gold"}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 7, fontWeight: 600, color: secondaryColor, textTransform: "uppercase" }}>MEMBER</div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: primaryColor }}>Jane Smith</div>
                    </div>
                  </div>

                  <div style={{ padding: "8px 14px 12px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <QrCode size={80} />
                    <div style={{ fontSize: 7, color: secondaryColor, marginTop: 4, opacity: 0.4 }}>Powered by Kyro</div>
                  </div>
                </div>
              </div>

              <div style={{ height: 28, backgroundColor: "#000", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ width: 120, height: 5, borderRadius: 3, backgroundColor: "#555" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .new-card-layout { flex-direction: column !important; }
          .new-card-preview { width: 100% !important; display: flex !important; justify-content: center !important; order: -1 !important; margin-bottom: 16px !important; }
          .new-card-preview > div { position: static !important; }
          .new-card-preview > div > div { transform: scale(0.85); transform-origin: top center; }
          .new-theme-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
