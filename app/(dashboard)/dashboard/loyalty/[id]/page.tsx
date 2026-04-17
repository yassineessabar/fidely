"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Check, Image, Upload, Trash2 } from "lucide-react";

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

const typeLabels: Record<string, string> = { stamp: "Stamp Card", points: "Points Card", coupon: "Coupon", vip: "VIP Card" };

export default function EditCardPage() {
  const router = useRouter();
  const params = useParams();
  const cardId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [card, setCard] = useState<any>(null);

  // Editable fields
  const [name, setName] = useState("");
  const [cardType, setCardType] = useState("stamp");
  const [emoji, setEmoji] = useState("☕");
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [bgColor, setBgColor] = useState("#0B051D");
  const [primaryColor, setPrimaryColor] = useState("#FFFFFF");
  const [secondaryColor, setSecondaryColor] = useState("#E6FFA9");
  const [accentColor, setAccentColor] = useState("#6C47FF");
  const [totalStamps, setTotalStamps] = useState(10);
  const [reward, setReward] = useState("Free item");

  useEffect(() => {
    fetch(`/api/merchant/cards/${cardId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.card) {
          const c = d.card;
          setCard(c);
          setName(c.business_details?.name || c.name?.replace(" Loyalty Card", "") || "");
          setCardType(c.business_details?.cardVariant || c.type || "stamp");
          setEmoji(c.branding?.stampEmoji || "☕");
          setLogoUrl(c.branding?.logoUrl || "");
          setBannerUrl(c.branding?.heroImageUrl || "");
          setBgColor(c.branding?.backgroundColor || "#0B051D");
          setPrimaryColor(c.branding?.primaryColor || "#FFFFFF");
          setSecondaryColor(c.branding?.secondaryColor || "#E6FFA9");
          setAccentColor(c.branding?.accentColor || "#6C47FF");
          setTotalStamps(c.logic?.totalStamps || 10);
          setReward(c.logic?.reward || "Free item");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [cardId]);

  async function handleSave() {
    setSaving(true);
    try {
      const dbType = cardType === "vip" ? "points" : cardType;
      await fetch(`/api/merchant/cards/${cardId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${name} Loyalty Card`,
          type: dbType,
          business_details: { ...card?.business_details, name, cardVariant: cardType },
          branding: {
            ...card?.branding,
            backgroundColor: bgColor, primaryColor, secondaryColor, accentColor,
            logoUrl, heroImageUrl: bannerUrl, stampEmoji: emoji,
          },
          logic: cardType === "stamp" ? {
            totalStamps, reward, progressLabel: "collected",
          } : cardType === "points" ? {
            ...card?.logic, reward, progressLabel: "earned",
          } : {
            ...card?.logic, tierName: "Gold", reward, progressLabel: "member",
          },
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally { setSaving(false); }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setter(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  if (loading) return <div style={{ padding: 48, textAlign: "center", color: "rgba(10,10,10,0.4)" }}>Loading card...</div>;
  if (!card) return <div style={{ padding: 48, textAlign: "center", color: "rgba(10,10,10,0.4)" }}>Card not found.</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => router.push("/dashboard/loyalty")} style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 36, height: 36, borderRadius: 10,
            border: "1px solid rgba(10,10,10,0.1)", backgroundColor: "white",
            cursor: "pointer", color: "rgba(10,10,10,0.5)",
          }}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "rgba(10,10,10,0.9)", margin: 0, letterSpacing: "-0.3px" }}>Edit Card</h1>
            <p style={{ fontSize: 12, color: "rgba(10,10,10,0.4)", margin: "2px 0 0" }}>{name || "Untitled"} — {typeLabels[cardType]}</p>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "10px 24px", borderRadius: 12,
          border: "none", backgroundColor: saved ? "rgb(16,185,129)" : "#111", color: "white",
          fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit",
          opacity: saving ? 0.7 : 1, transition: "background-color 0.2s",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}>
          {saved ? <><Check size={15} /> Saved</> : <><Save size={15} /> {saving ? "Saving..." : "Save Changes"}</>}
        </button>
      </div>

      {/* 2-col: form + preview */}
      <div className="edit-layout" style={{ display: "flex", gap: 40 }}>
        {/* Left: form */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Business Name */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Business Name
            </label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Bean & Grind"
              style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1.5px solid rgba(10,10,10,0.1)", fontSize: 15, fontFamily: "inherit", color: "rgba(10,10,10,0.9)", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {/* Card Type */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.5)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Card Type
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              {(["stamp", "points", "vip"] as const).map((t) => (
                <button key={t} onClick={() => setCardType(t)} style={{
                  flex: 1, padding: "12px 16px", borderRadius: 10,
                  border: cardType === t ? "2px solid #111" : "1.5px solid rgba(10,10,10,0.08)",
                  backgroundColor: cardType === t ? "rgba(17,17,17,0.03)" : "white",
                  fontSize: 13, fontWeight: 600, color: cardType === t ? "rgba(10,10,10,0.9)" : "rgba(10,10,10,0.45)",
                  cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                }}>{typeLabels[t]}</button>
              ))}
            </div>
          </div>

          {/* Stamp Emoji */}
          {cardType === "stamp" && (
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.5)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Stamp Emoji
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {EMOJI_OPTIONS.map((e) => (
                  <button key={e} onClick={() => setEmoji(e)} style={{
                    width: 40, height: 40, borderRadius: 8,
                    border: emoji === e ? "2px solid #111" : "1.5px solid rgba(10,10,10,0.08)",
                    backgroundColor: emoji === e ? "rgba(17,17,17,0.05)" : "white",
                    fontSize: 19, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.1s",
                  }}>{e}</button>
                ))}
              </div>
            </div>
          )}

          {/* Card Logic */}
          {cardType === "stamp" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Total Stamps
                </label>
                <input type="number" min={3} max={20} value={totalStamps} onChange={(e) => setTotalStamps(Number(e.target.value))}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid rgba(10,10,10,0.1)", fontSize: 14, fontFamily: "inherit", color: "rgba(10,10,10,0.9)", outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Reward
                </label>
                <input value={reward} onChange={(e) => setReward(e.target.value)} placeholder="e.g. Free coffee"
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid rgba(10,10,10,0.1)", fontSize: 14, fontFamily: "inherit", color: "rgba(10,10,10,0.9)", outline: "none", boxSizing: "border-box" }}
                />
              </div>
            </div>
          )}

          {/* Logo */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.5)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Logo
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 72, height: 72, borderRadius: 14, overflow: "hidden", backgroundColor: "rgba(10,10,10,0.04)", border: "1.5px dashed rgba(10,10,10,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {logoUrl ? <img src={logoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Image size={24} style={{ color: "rgba(10,10,10,0.2)" }} />}
              </div>
              <div>
                <label style={{ display: "inline-block", padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(10,10,10,0.1)", backgroundColor: "white", fontSize: 13, fontWeight: 500, color: "rgba(10,10,10,0.7)", cursor: "pointer", fontFamily: "inherit" }}>
                  Upload logo
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFile(e, setLogoUrl)} />
                </label>
                {logoUrl && (
                  <button onClick={() => setLogoUrl("")} style={{ marginLeft: 8, padding: "8px", borderRadius: 8, border: "none", backgroundColor: "transparent", cursor: "pointer", color: "rgba(10,10,10,0.3)" }}>
                    <Trash2 size={14} />
                  </button>
                )}
                <p style={{ fontSize: 11, color: "rgba(10,10,10,0.3)", margin: "4px 0 0" }}>Square image, 200x200px or larger</p>
              </div>
            </div>
          </div>

          {/* Banner */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.5)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Banner Image
            </label>
            <div style={{ width: "100%", aspectRatio: "3/1", borderRadius: 14, overflow: "hidden", backgroundColor: "rgba(10,10,10,0.04)", border: "1.5px dashed rgba(10,10,10,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
              {bannerUrl ? <img src={bannerUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ textAlign: "center" }}><Upload size={28} style={{ color: "rgba(10,10,10,0.15)" }} /><p style={{ fontSize: 12, color: "rgba(10,10,10,0.3)", margin: "4px 0 0" }}>Upload banner</p></div>}
              <input type="file" accept="image/*" style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} onChange={(e) => handleFile(e, setBannerUrl)} />
            </div>
          </div>

          {/* Theme Presets */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.5)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Theme
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }} className="edit-theme-grid">
              {THEME_PRESETS.map((p) => (
                <button key={p.id} onClick={() => { setBgColor(p.bg); setPrimaryColor(p.primary); setSecondaryColor(p.secondary); setAccentColor(p.accent); }}
                  style={{
                    width: "100%", aspectRatio: "1", borderRadius: 10,
                    border: bgColor === p.bg && accentColor === p.accent ? "2.5px solid #111" : "1.5px solid rgba(10,10,10,0.08)",
                    cursor: "pointer", overflow: "hidden", position: "relative", backgroundColor: p.bg, padding: 0,
                    transition: "all 0.15s",
                  }}>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", backgroundColor: p.accent, opacity: 0.6 }} />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.5)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Custom Colors
            </label>
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

          {/* Save (bottom) */}
          <button onClick={handleSave} disabled={saving} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "14px 24px", borderRadius: 12, border: "none",
            backgroundColor: saved ? "rgb(16,185,129)" : "#111", color: "white",
            fontSize: 15, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit",
            opacity: saving ? 0.7 : 1, width: "100%", marginBottom: 40,
          }}>
            {saved ? <><Check size={16} /> Saved</> : <><Save size={16} /> {saving ? "Saving..." : "Save Changes"}</>}
          </button>
        </div>

        {/* Right: iPhone preview */}
        <div className="edit-preview" style={{ width: 260, flexShrink: 0 }}>
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
                  {/* Header */}
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

                  {/* Banner */}
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
                        <div style={{ fontSize: 10, fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: "2px", marginTop: 4, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>POINTS</div>
                      </div>
                    )}
                    {cardType === "vip" && (
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

                  {/* QR */}
                  <div style={{ padding: "8px 14px 12px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <QrCode size={80} />
                    <div style={{ fontSize: 7, color: secondaryColor, marginTop: 4, opacity: 0.4 }}>Powered by Kyro</div>
                  </div>
                </div>
              </div>

              {/* Home indicator */}
              <div style={{ height: 28, backgroundColor: "#000", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ width: 120, height: 5, borderRadius: 3, backgroundColor: "#555" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .edit-layout { flex-direction: column !important; }
          .edit-preview { width: 100% !important; display: flex !important; justify-content: center !important; order: -1 !important; margin-bottom: 16px !important; }
          .edit-preview > div { position: static !important; }
          .edit-preview > div > div { transform: scale(0.85); transform-origin: top center; }
          .edit-theme-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
