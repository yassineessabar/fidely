"use client";

import { useState, useEffect } from "react";
import { Save, Check } from "lucide-react";

const THEME_PRESETS = [
  { id: "kyro-dark", name: "Kyro Dark", bg: "#0B051D", primary: "#FFFFFF", secondary: "#E6FFA9", accent: "#6C47FF" },
  { id: "warm-roast", name: "Warm Roast", bg: "#f2e8dc", primary: "#2c1810", secondary: "#c67a2e", accent: "#c67a2e" },
  { id: "dark-brew", name: "Dark Brew", bg: "#1a1006", primary: "#fffbeb", secondary: "#fcd34d", accent: "#f59e0b" },
  { id: "forest", name: "Forest", bg: "#1a2e1a", primary: "#f0fdf4", secondary: "#86efac", accent: "#22c55e" },
  { id: "rose", name: "Rose", bg: "#f5a0a0", primary: "#ffffff", secondary: "#fff0f0", accent: "#e86b6b" },
  { id: "lavender", name: "Lavender", bg: "#ede9fe", primary: "#3b0764", secondary: "#a78bfa", accent: "#7c3aed" },
  { id: "navy", name: "Navy", bg: "#0a1628", primary: "#e0f2fe", secondary: "#7dd3fc", accent: "#0284c7" },
  { id: "noir", name: "Noir", bg: "#111111", primary: "#fafafa", secondary: "#a3a3a3", accent: "#ffffff" },
  { id: "clean", name: "Clean White", bg: "#ffffff", primary: "#1a1a1a", secondary: "#737373", accent: "#0b051d" },
  { id: "gold", name: "Gold", bg: "#1a1006", primary: "#fffbeb", secondary: "#fcd34d", accent: "#f59e0b" },
  { id: "blush", name: "Blush", bg: "#fdf2f8", primary: "#831843", secondary: "#f9a8d4", accent: "#ec4899" },
  { id: "elegant", name: "Elegant", bg: "#1a1a1a", primary: "#f5f0e8", secondary: "#e0c097", accent: "#e0c097" },
];

export default function AppearancePage() {
  const [cards, setCards] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("");

  // Editable colors
  const [bgColor, setBgColor] = useState("#0B051D");
  const [primaryColor, setPrimaryColor] = useState("#FFFFFF");
  const [secondaryColor, setSecondaryColor] = useState("#E6FFA9");
  const [accentColor, setAccentColor] = useState("#6C47FF");

  useEffect(() => {
    fetch("/api/merchant/cards")
      .then((r) => r.json())
      .then((d) => {
        const c = d.cards || [];
        setCards(c);
        if (c.length > 0) {
          const card = c[0];
          setSelectedCard(card);
          const br = card.branding || {};
          setBgColor(br.backgroundColor || "#0B051D");
          setPrimaryColor(br.primaryColor || "#FFFFFF");
          setSecondaryColor(br.secondaryColor || "#E6FFA9");
          setAccentColor(br.accentColor || "#6C47FF");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function applyTheme(preset: typeof THEME_PRESETS[0]) {
    setSelectedTheme(preset.id);
    setBgColor(preset.bg);
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
    setAccentColor(preset.accent);
  }

  async function handleSave() {
    if (!selectedCard) return;
    setSaving(true);
    try {
      await fetch(`/api/merchant/cards/${selectedCard.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branding: {
            ...selectedCard.branding,
            backgroundColor: bgColor,
            primaryColor,
            secondaryColor,
            accentColor,
          },
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ padding: 48, textAlign: "center", color: "rgba(10,10,10,0.4)" }}>Loading...</div>;
  if (!selectedCard) return <div style={{ padding: 48, textAlign: "center", color: "rgba(10,10,10,0.4)" }}>No cards to customize. Create one first.</div>;

  const theme = { backgroundColor: bgColor, primaryColor, secondaryColor, accentColor, logoUrl: selectedCard.branding?.logoUrl, heroImageUrl: selectedCard.branding?.heroImageUrl };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 20 }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(10,10,10,0.4)" }}>Customizing: {selectedCard.name}</span>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "8px 20px", borderRadius: 99, border: "none",
            backgroundColor: saved ? "rgb(16,185,129)" : "#0b051d",
            color: "white", fontSize: 13, fontWeight: 600,
            cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit",
            opacity: saving ? 0.7 : 1, transition: "background-color 0.2s",
          }}
        >
          {saved ? <><Check size={14} /> Saved</> : <><Save size={14} /> {saving ? "Saving..." : "Save Changes"}</>}
        </button>
      </div>

      {/* 2-column: settings + preview */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 24 }} className="appearance-grid">
        {/* Left: Settings */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Theme presets */}
          <div style={{ backgroundColor: "white", borderRadius: 14, border: "1px solid rgba(10,10,10,0.06)", padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "rgba(10,10,10,0.85)", margin: "0 0 16px" }}>Theme Presets</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }} className="theme-preset-grid">
              {THEME_PRESETS.map((preset) => {
                const isSelected = selectedTheme === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => applyTheme(preset)}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center",
                      padding: 8, border: isSelected ? "2px solid #0b051d" : "1px solid rgba(10,10,10,0.08)",
                      borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
                      backgroundColor: "white", transition: "all 0.15s",
                    }}
                  >
                    <div style={{
                      width: "100%", height: 56, borderRadius: 6, overflow: "hidden",
                      position: "relative", backgroundColor: preset.bg,
                    }}>
                      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "33%", backgroundColor: preset.accent, opacity: 0.5 }} />
                      <div style={{ position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)", width: "70%", height: 4, borderRadius: 2, backgroundColor: preset.primary, opacity: 0.5 }} />
                      <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", width: "70%", height: 4, borderRadius: 2, backgroundColor: preset.primary, opacity: 0.3 }} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 500, color: "rgba(10,10,10,0.6)", marginTop: 6, whiteSpace: "nowrap" }}>{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom colors */}
          <div style={{ backgroundColor: "white", borderRadius: 14, border: "1px solid rgba(10,10,10,0.06)", padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "rgba(10,10,10,0.85)", margin: "0 0 16px" }}>Custom Colors</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { label: "Background", value: bgColor, set: setBgColor },
                { label: "Text Color", value: primaryColor, set: setPrimaryColor },
                { label: "Label Color", value: secondaryColor, set: setSecondaryColor },
                { label: "Accent Color", value: accentColor, set: setAccentColor },
              ].map((c) => (
                <div key={c.label}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "rgba(10,10,10,0.4)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>{c.label}</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="color"
                      value={c.value}
                      onChange={(e) => { c.set(e.target.value); setSelectedTheme("custom"); }}
                      style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(10,10,10,0.1)", cursor: "pointer", padding: 2 }}
                    />
                    <input
                      type="text"
                      value={c.value}
                      onChange={(e) => { c.set(e.target.value); setSelectedTheme("custom"); }}
                      style={{
                        flex: 1, padding: "8px 12px", borderRadius: 8,
                        border: "1px solid rgba(10,10,10,0.08)", fontSize: 13,
                        fontFamily: "monospace", color: "rgba(10,10,10,0.7)",
                        outline: "none", boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card selector (if multiple cards) */}
          {cards.length > 1 && (
            <div style={{ backgroundColor: "white", borderRadius: 14, border: "1px solid rgba(10,10,10,0.06)", padding: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: "rgba(10,10,10,0.85)", margin: "0 0 12px" }}>Select Card</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {cards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => {
                      setSelectedCard(card);
                      const br = card.branding || {};
                      setBgColor(br.backgroundColor || "#0B051D");
                      setPrimaryColor(br.primaryColor || "#FFFFFF");
                      setSecondaryColor(br.secondaryColor || "#E6FFA9");
                      setAccentColor(br.accentColor || "#6C47FF");
                      setSelectedTheme("");
                    }}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "10px 14px", borderRadius: 10, border: "none",
                      backgroundColor: selectedCard.id === card.id ? "rgba(11,5,29,0.04)" : "transparent",
                      cursor: "pointer", fontFamily: "inherit", textAlign: "left", width: "100%",
                    }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: selectedCard.id === card.id ? "#0b051d" : "rgba(10,10,10,0.15)" }} />
                    <span style={{ fontSize: 13, fontWeight: selectedCard.id === card.id ? 600 : 400, color: "rgba(10,10,10,0.8)" }}>{card.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: iPhone wallet preview */}
        <div className="appearance-preview">
          <div style={{ position: "sticky", top: 24, display: "flex", flexDirection: "column", alignItems: "center", padding: 24, background: "linear-gradient(135deg, rgba(10,10,10,0.02), rgba(10,10,10,0.04))", borderRadius: 16, height: "fit-content" }}>
            <div style={{ position: "relative", width: 280, borderRadius: 40, backgroundColor: "#000", boxShadow: "0 24px 60px rgba(0,0,0,0.2)", border: "10px solid #333", overflow: "hidden" }}>
              {/* Notch */}
              <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 100, height: 22, backgroundColor: "#000", borderRadius: "0 0 14px 14px", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: "#444" }} />
              </div>

              {/* Wallet card */}
              <div style={{ backgroundColor: bgColor, paddingTop: 28 }}>
                <div style={{ padding: "10px 14px 6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {theme.logoUrl ? (
                      <img src={theme.logoUrl} alt="" style={{ width: 26, height: 26, borderRadius: 6, objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: 26, height: 26, borderRadius: 6, backgroundColor: accentColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 9, fontWeight: 900, color: primaryColor }}>{(selectedCard.name || "K").charAt(0)}</span>
                      </div>
                    )}
                    <span style={{ fontSize: 11, fontWeight: 700, color: primaryColor }}>{selectedCard.business_details?.name || selectedCard.name}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 6, fontWeight: 600, color: secondaryColor, textTransform: "uppercase" }}>VALID UNTIL</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: primaryColor }}>18/04/2027</div>
                  </div>
                </div>

                <div style={{ height: 80, position: "relative", overflow: "hidden" }}>
                  {theme.heroImageUrl ? (
                    <><img src={theme.heroImageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /><div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} /></>
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${accentColor}40, ${bgColor})` }} />
                  )}
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 2, flexWrap: "wrap", padding: "6px 10px" }}>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <span key={i} style={{ fontSize: 14, opacity: i < 1 ? 1 : 0.2, filter: i >= 1 ? "grayscale(1)" : "none" }}>☕</span>
                    ))}
                  </div>
                </div>

                <div style={{ padding: "8px 14px", display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 6, fontWeight: 600, color: secondaryColor, textTransform: "uppercase" }}>STAMPS UNTIL REWARD</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: primaryColor }}>10 stamps</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 6, fontWeight: 600, color: secondaryColor, textTransform: "uppercase" }}>MEMBER</div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: primaryColor }}>Jane Smith</div>
                  </div>
                </div>

                <div style={{ padding: "8px 14px 12px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 50, height: 50, borderRadius: 7, backgroundColor: "white", padding: 3, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridTemplateRows: "repeat(7, 1fr)", gap: 0.5 }}>
                    {[1,1,1,0,1,1,1, 1,0,1,0,1,0,1, 1,1,1,0,1,1,1, 0,0,0,0,0,0,0, 1,0,1,1,0,1,0, 0,1,0,0,1,0,1, 1,0,1,0,1,1,1].map((v, i) => (
                      <div key={i} style={{ backgroundColor: v ? "#0b051d" : "white" }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 6, color: secondaryColor, marginTop: 4, opacity: 0.4 }}>Powered by Kyro</div>
                </div>
              </div>

              <div style={{ height: 16, backgroundColor: "#000", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ width: 80, height: 4, borderRadius: 2, backgroundColor: "#444" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .appearance-grid { grid-template-columns: 1fr !important; }
          .appearance-preview { display: none !important; }
          .theme-preset-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
