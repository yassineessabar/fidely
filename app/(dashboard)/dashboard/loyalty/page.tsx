"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Check, Copy, ExternalLink, Globe } from "lucide-react";
import { UpgradeModal } from "../../components/UpgradeModal";

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

// Realistic QR SVG
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

type Card = {
  id: string;
  name: string;
  type: string;
  status: string;
  business_details: any;
  branding: any;
  logic: any;
  share_url: string | null;
  enrollmentCount: number;
};

const typeLabels: Record<string, string> = { stamp: "Stamp Card", points: "Points Card", coupon: "Coupon", vip: "VIP Card" };

export default function LinksPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Card | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [plan, setPlan] = useState("free");
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  // Appearance editing (inline)
  const [editingAppearance, setEditingAppearance] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmoji, setEditEmoji] = useState("☕");
  const [editLogo, setEditLogo] = useState("");
  const [editBanner, setEditBanner] = useState("");
  const [bgColor, setBgColor] = useState("#0B051D");
  const [primaryColor, setPrimaryColor] = useState("#FFFFFF");
  const [secondaryColor, setSecondaryColor] = useState("#E6FFA9");
  const [accentColor, setAccentColor] = useState("#6C47FF");

  function loadCards() {
    fetch("/api/merchant/cards")
      .then((r) => r.json())
      .then((d) => {
        const c = d.cards || [];
        setCards(c);
        if (c.length > 0 && !selectedCard) {
          setSelectedCard(c[0]);
          syncEditFields(c[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  function syncEditFields(card: Card) {
    const br = card.branding || {};
    setEditName(card.business_details?.name || card.name || "");
    setEditEmoji(br.stampEmoji || "☕");
    setEditLogo(br.logoUrl || "");
    setEditBanner(br.heroImageUrl || "");
    setBgColor(br.backgroundColor || "#0B051D");
    setPrimaryColor(br.primaryColor || "#FFFFFF");
    setSecondaryColor(br.secondaryColor || "#E6FFA9");
    setAccentColor(br.accentColor || "#6C47FF");
  }

  useEffect(() => {
    loadCards();
    fetch("/api/merchant/plan").then((r) => r.json()).then((d) => { if (d?.plan) setPlan(d.plan); }).catch(() => {});
  }, []);

  function selectCard(card: Card) {
    setSelectedCard(card);
    syncEditFields(card);
    setEditingAppearance(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/merchant/cards/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        const updated = cards.filter((c) => c.id !== deleteTarget.id);
        setCards(updated);
        if (selectedCard?.id === deleteTarget.id) {
          const next = updated[0] || null;
          setSelectedCard(next);
          if (next) syncEditFields(next);
        }
        setDeleteTarget(null);
      }
    } finally { setDeleting(false); }
  }

  function handleCopy(text: string, cardId: string) {
    navigator.clipboard.writeText(text);
    setCopied(cardId);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleSaveAppearance() {
    if (!selectedCard) return;
    setSaving(true);
    try {
      await fetch(`/api/merchant/cards/${selectedCard.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName ? `${editName} Loyalty Card` : selectedCard.name,
          business_details: { ...selectedCard.business_details, name: editName },
          branding: {
            ...selectedCard.branding,
            backgroundColor: bgColor, primaryColor, secondaryColor, accentColor,
            logoUrl: editLogo, heroImageUrl: editBanner, stampEmoji: editEmoji,
          },
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      loadCards();
    } finally { setSaving(false); }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setter(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  if (loading) return <div style={{ padding: 48, textAlign: "center", color: "rgba(10,10,10,0.4)" }}>Loading...</div>;

  const sc = selectedCard;
  const previewBr = editingAppearance
    ? { backgroundColor: bgColor, primaryColor, secondaryColor, accentColor, logoUrl: editLogo, heroImageUrl: editBanner, stampEmoji: editEmoji }
    : { ...(sc?.branding || {}), stampEmoji: sc?.branding?.stampEmoji || "☕" };
  const previewName = editingAppearance ? editName : (sc?.business_details?.name || sc?.name || "");
  // Resolve display type — "vip" is stored as "points" in DB, but cardVariant preserves the original
  const scDisplayType = sc?.business_details?.cardVariant || sc?.type || "stamp";

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "rgba(10,10,10,0.9)", margin: "0 0 4px", letterSpacing: "-0.3px" }}>My Cards</h1>
          <p style={{ fontSize: 13, color: "rgba(10,10,10,0.4)", margin: 0 }}>Manage your loyalty cards and customize their appearance</p>
        </div>
        {(() => {
          const atLimit = (plan === "starter" || plan === "free") && cards.length >= 1;
          if (atLimit) {
            return (
              <button onClick={() => setUpgradeOpen(true)} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "10px 20px", borderRadius: 12, backgroundColor: "rgba(10,10,10,0.06)", color: "rgba(10,10,10,0.4)",
                fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit",
              }}>
                <Plus size={15} /> Add Card (Upgrade)
              </button>
            );
          }
          return (
            <a href="/dashboard/loyalty/new" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "10px 20px", borderRadius: 12, backgroundColor: "#111", color: "white",
              fontSize: 13, fontWeight: 600, textDecoration: "none", fontFamily: "inherit",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}>
              <Plus size={15} /> Add Card
            </a>
          );
        })()}
      </div>

      {/* Grid: cards list + preview */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 24 }} className="links-grid">
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {cards.length === 0 ? (
            <div style={{ padding: "56px 32px", textAlign: "center", backgroundColor: "white", borderRadius: 20, border: "1px solid rgba(10,10,10,0.06)", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: "rgba(10,10,10,0.03)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <Plus size={28} style={{ color: "rgba(10,10,10,0.2)" }} />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "rgba(10,10,10,0.85)", margin: "0 0 8px" }}>No cards yet</h2>
              <p style={{ fontSize: 14, color: "rgba(10,10,10,0.4)", marginBottom: 24, maxWidth: 300, marginLeft: "auto", marginRight: "auto", lineHeight: 1.5 }}>Create your first loyalty card and start rewarding your customers.</p>
              <a href="/dashboard/loyalty/new" style={{
                display: "inline-flex", alignItems: "center", gap: 6, padding: "12px 28px",
                borderRadius: 12, backgroundColor: "#111", color: "white",
                fontSize: 14, fontWeight: 600, textDecoration: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}><Plus size={16} /> Create Card</a>
            </div>
          ) : (
            <>
              {/* Card list — each card with its own link */}
              {cards.map((card) => {
                const isSelected = selectedCard?.id === card.id;
                const br = card.branding || {};
                return (
                  <div key={card.id} onClick={() => selectCard(card)} style={{
                    padding: 0, borderRadius: 16, cursor: "pointer", backgroundColor: "white",
                    border: isSelected ? "2px solid #111" : "1px solid rgba(10,10,10,0.06)",
                    transition: "all 0.2s ease", overflow: "hidden",
                    boxShadow: isSelected ? "0 4px 16px rgba(0,0,0,0.06)" : "0 1px 3px rgba(0,0,0,0.02)",
                    transform: isSelected ? "translateY(-1px)" : "none",
                  }}>
                    {/* Card info row */}
                    <div style={{ padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        {br.logoUrl ? (
                          <img src={br.logoUrl} alt="" style={{
                            width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                            objectFit: "cover", boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }} />
                        ) : (
                          <div style={{
                            width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                            background: `linear-gradient(135deg, ${br.backgroundColor || "#111"}, ${br.accentColor || "#6C47FF"})`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}>
                            <span style={{ fontSize: 20 }}>{br.stampEmoji || "☕"}</span>
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: "rgba(10,10,10,0.9)", marginBottom: 2 }}>{card.business_details?.name || card.name}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(10,10,10,0.4)" }}>
                            <span>{typeLabels[card.business_details?.cardVariant || card.type] || card.type}</span>
                            <span style={{ width: 3, height: 3, borderRadius: 99, backgroundColor: "rgba(10,10,10,0.2)" }} />
                            <span>{card.enrollmentCount} members</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{
                          padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600,
                          backgroundColor: card.status === "active" ? "rgba(16,185,129,0.1)" : "rgba(10,10,10,0.04)",
                          color: card.status === "active" ? "rgb(5,150,105)" : "rgba(10,10,10,0.4)",
                        }}>{card.status === "active" ? "Live" : card.status}</span>
                        <a href={`/dashboard/loyalty/${card.id}`} onClick={(e) => e.stopPropagation()} style={{
                          padding: "6px 10px", borderRadius: 8, color: "rgba(10,10,10,0.4)", textDecoration: "none",
                          display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 500,
                          border: "1px solid rgba(10,10,10,0.06)", backgroundColor: "rgba(10,10,10,0.02)",
                        }}><Pencil size={12} /> Edit</a>
                        <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(card); }} style={{
                          padding: 7, borderRadius: 8, border: "1px solid rgba(10,10,10,0.06)",
                          backgroundColor: "rgba(10,10,10,0.02)", color: "rgba(10,10,10,0.3)", cursor: "pointer",
                          display: "flex", alignItems: "center",
                        }}><Trash2 size={13} /></button>
                      </div>
                    </div>

                    {/* Card share link — one link per card */}
                    {card.share_url && (
                      <div style={{
                        padding: "10px 18px", borderTop: "1px solid rgba(10,10,10,0.05)",
                        display: "flex", alignItems: "center", gap: 8, backgroundColor: "rgba(10,10,10,0.015)",
                      }}>
                        <Globe size={14} style={{ color: "rgba(10,10,10,0.2)", flexShrink: 0 }} />
                        <span style={{ flex: 1, fontSize: 12, color: "rgba(10,10,10,0.45)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "monospace", letterSpacing: "-0.3px" }}>
                          {card.share_url}
                        </span>
                        <button onClick={(e) => { e.stopPropagation(); handleCopy(card.share_url!, card.id); }} style={{
                          padding: "5px 12px", borderRadius: 8, border: "1px solid rgba(10,10,10,0.08)",
                          backgroundColor: copied === card.id ? "rgba(16,185,129,0.06)" : "white",
                          fontSize: 11, fontWeight: 600, cursor: "pointer",
                          fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4,
                          color: copied === card.id ? "rgb(5,150,105)" : "rgba(10,10,10,0.55)",
                          transition: "all 0.2s",
                        }}>
                          {copied === card.id ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); window.open(card.share_url!, "_blank"); }} style={{
                          padding: "5px 10px", borderRadius: 8, border: "1px solid rgba(10,10,10,0.08)",
                          backgroundColor: "white", fontSize: 11, fontWeight: 600, cursor: "pointer",
                          fontFamily: "inherit", color: "rgba(10,10,10,0.55)", display: "flex", alignItems: "center",
                        }}>
                          <ExternalLink size={11} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Customize appearance removed — use Edit page instead */}
              {false && sc && (
                <div style={{
                  backgroundColor: "white", borderRadius: 16, overflow: "hidden",
                  border: editingAppearance ? "2px solid #111" : "1px solid rgba(10,10,10,0.06)",
                  boxShadow: editingAppearance ? "0 4px 20px rgba(0,0,0,0.06)" : "0 1px 3px rgba(0,0,0,0.02)",
                  transition: "all 0.2s",
                }}>
                  <button onClick={() => setEditingAppearance(!editingAppearance)} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    width: "100%", padding: "16px 18px", border: "none",
                    backgroundColor: editingAppearance ? "rgba(10,10,10,0.02)" : "transparent",
                    cursor: "pointer", fontFamily: "inherit",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: "linear-gradient(135deg, #6C47FF, #ec4899)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Palette size={15} style={{ color: "white" }} />
                      </div>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(10,10,10,0.85)" }}>
                          Customize Appearance
                        </div>
                        <div style={{ fontSize: 11, color: "rgba(10,10,10,0.35)" }}>
                          {sc.business_details?.name || sc.name} — colors, logo, emoji
                        </div>
                      </div>
                    </div>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      backgroundColor: editingAppearance ? "rgba(10,10,10,0.06)" : "rgba(10,10,10,0.03)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {editingAppearance ? <ChevronUp size={16} style={{ color: "rgba(10,10,10,0.4)" }} /> : <ChevronDown size={16} style={{ color: "rgba(10,10,10,0.4)" }} />}
                    </div>
                  </button>

                  {editingAppearance && (
                    <div style={{ padding: "0 18px 20px", display: "flex", flexDirection: "column", gap: 20 }}>

                      {/* Business Name */}
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Business Name
                        </label>
                        <input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="e.g. Bean & Grind"
                          style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid rgba(10,10,10,0.1)", fontSize: 14, fontFamily: "inherit", color: "rgba(10,10,10,0.9)", outline: "none", boxSizing: "border-box" }}
                        />
                      </div>

                      {/* Stamp Emoji */}
                      {(scDisplayType === "stamp") && (
                        <div>
                          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.5)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            Stamp Emoji
                          </label>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                            {EMOJI_OPTIONS.map((emoji) => (
                              <button key={emoji} onClick={() => setEditEmoji(emoji)} style={{
                                width: 38, height: 38, borderRadius: 8,
                                border: editEmoji === emoji ? "2px solid #111" : "1.5px solid rgba(10,10,10,0.08)",
                                backgroundColor: editEmoji === emoji ? "rgba(17,17,17,0.05)" : "white",
                                fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all 0.1s",
                              }}>{emoji}</button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Logo */}
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.5)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Logo
                        </label>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ width: 60, height: 60, borderRadius: 12, overflow: "hidden", backgroundColor: "rgba(10,10,10,0.03)", border: "1.5px dashed rgba(10,10,10,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {editLogo ? <img src={editLogo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Image size={20} style={{ color: "rgba(10,10,10,0.2)" }} />}
                          </div>
                          <label style={{ display: "inline-block", padding: "8px 14px", borderRadius: 8, border: "1px solid rgba(10,10,10,0.1)", backgroundColor: "white", fontSize: 12, fontWeight: 500, color: "rgba(10,10,10,0.6)", cursor: "pointer", fontFamily: "inherit" }}>
                            Upload logo
                            <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFileUpload(e, setEditLogo)} />
                          </label>
                        </div>
                      </div>

                      {/* Banner */}
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.5)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Banner Image
                        </label>
                        <div style={{ width: "100%", aspectRatio: "3/1", borderRadius: 12, overflow: "hidden", backgroundColor: "rgba(10,10,10,0.03)", border: "1.5px dashed rgba(10,10,10,0.12)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
                          {editBanner ? <img src={editBanner} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ textAlign: "center" }}><Upload size={20} style={{ color: "rgba(10,10,10,0.15)" }} /><p style={{ fontSize: 11, color: "rgba(10,10,10,0.25)", margin: "4px 0 0" }}>Upload banner</p></div>}
                          <input type="file" accept="image/*" style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} onChange={(e) => handleFileUpload(e, setEditBanner)} />
                        </div>
                      </div>

                      {/* Theme Presets */}
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(10,10,10,0.5)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Theme
                        </label>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }} className="theme-preset-grid">
                          {THEME_PRESETS.map((p) => (
                            <button key={p.id} onClick={() => { setBgColor(p.bg); setPrimaryColor(p.primary); setSecondaryColor(p.secondary); setAccentColor(p.accent); }}
                              style={{
                                width: "100%", aspectRatio: "1", borderRadius: 8, border: bgColor === p.bg && accentColor === p.accent ? "2px solid #111" : "1.5px solid rgba(10,10,10,0.08)",
                                cursor: "pointer", overflow: "hidden", position: "relative", backgroundColor: p.bg, padding: 0,
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
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          {[
                            { label: "Background", value: bgColor, set: setBgColor },
                            { label: "Text", value: primaryColor, set: setPrimaryColor },
                            { label: "Labels", value: secondaryColor, set: setSecondaryColor },
                            { label: "Accent", value: accentColor, set: setAccentColor },
                          ].map((c) => (
                            <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <input type="color" value={c.value} onChange={(e) => c.set(e.target.value)}
                                style={{ width: 32, height: 32, borderRadius: 6, border: "1px solid rgba(10,10,10,0.1)", cursor: "pointer", padding: 2 }} />
                              <div>
                                <div style={{ fontSize: 10, color: "rgba(10,10,10,0.35)", textTransform: "uppercase", letterSpacing: "0.3px" }}>{c.label}</div>
                                <div style={{ fontSize: 12, fontFamily: "monospace", color: "rgba(10,10,10,0.6)" }}>{c.value}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Save */}
                      <button onClick={handleSaveAppearance} disabled={saving} style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        padding: "12px 24px", borderRadius: 10, border: "none",
                        backgroundColor: saved ? "rgb(16,185,129)" : "#111", color: "white",
                        fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer",
                        fontFamily: "inherit", opacity: saving ? 0.7 : 1, transition: "background-color 0.2s",
                        width: "100%",
                      }}>
                        {saved ? <><Check size={15} /> Saved</> : <><Save size={15} /> {saving ? "Saving..." : "Save Changes"}</>}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: iPhone wallet preview */}
        <div className="links-preview">
          <div style={{ position: "sticky", top: 24, display: "flex", justifyContent: "center" }}>
            {sc ? (
              <div style={{
                width: 260, flexShrink: 0,
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
                  <span style={{ fontSize: 11, color: "white", fontWeight: 600, opacity: 0.5, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{previewName || "Loyalty Card"}</span>
                  <span style={{ fontSize: 11, color: "#007AFF", fontWeight: 600 }}>Add</span>
                </div>

                {/* Card */}
                <div style={{ backgroundColor: "#000", padding: "8px 12px 0" }}>
                  <div style={{ backgroundColor: previewBr.backgroundColor || "#0B051D", borderRadius: 14, overflow: "hidden" }}>
                    <div style={{ padding: "12px 14px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {previewBr.logoUrl ? (
                          <img src={previewBr.logoUrl} alt="" style={{ width: 26, height: 26, borderRadius: 6, objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: 26, height: 26, borderRadius: 6, backgroundColor: previewBr.accentColor || "#6C47FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: 9, fontWeight: 900, color: previewBr.primaryColor || "#fff" }}>{(previewName || "K").charAt(0)}</span>
                          </div>
                        )}
                        <span style={{ fontSize: 11, fontWeight: 700, color: previewBr.primaryColor || "#fff" }}>{previewName || "Your Business"}</span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 6, fontWeight: 600, color: previewBr.secondaryColor || "#E6FFA9", textTransform: "uppercase" }}>VALID UNTIL</div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: previewBr.primaryColor || "#fff" }}>18/04/2027</div>
                      </div>
                    </div>

                    <div style={{ height: 90, position: "relative", overflow: "hidden" }}>
                      {previewBr.heroImageUrl ? (
                        <><img src={previewBr.heroImageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /><div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} /></>
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${previewBr.accentColor || "#6C47FF"}40, ${previewBr.backgroundColor || "#0B051D"})` }} />
                      )}
                      {scDisplayType === "stamp" && (
                        <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", alignItems: "center", justifyItems: "center", alignContent: "center", padding: "6px 12px", gap: "2px 0" }}>
                          {Array.from({ length: 8 }).map((_, i) => (
                            <span key={i} style={{ fontSize: 24, lineHeight: 1, opacity: i < 3 ? 1 : 0.15, filter: i >= 3 ? "grayscale(1)" : "none" }}>{previewBr.stampEmoji || "☕"}</span>
                          ))}
                        </div>
                      )}
                      {scDisplayType === "points" && (
                        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                          <div style={{ fontSize: 30, fontWeight: 800, color: "white", textShadow: "0 2px 6px rgba(0,0,0,0.4)", lineHeight: 1 }}>1,250</div>
                          <div style={{ fontSize: 9, fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: "1.5px", marginTop: 3, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>POINTS</div>
                        </div>
                      )}
                      {scDisplayType === "vip" && (
                        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                          <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "2px", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>STATUS</div>
                          <div style={{ fontSize: 20, fontWeight: 800, color: "#FFD700", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>Gold</div>
                        </div>
                      )}
                    </div>

                    <div style={{ padding: "8px 14px", display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 6, fontWeight: 600, color: previewBr.secondaryColor || "#E6FFA9", textTransform: "uppercase" }}>
                          {scDisplayType === "stamp" ? "STAMPS UNTIL REWARD" : scDisplayType === "points" ? "POINTS BALANCE" : "TIER"}
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: previewBr.primaryColor || "#fff" }}>
                          {scDisplayType === "stamp" ? `${sc.logic?.totalStamps || 10} stamps` : scDisplayType === "points" ? "1,250 pts" : "Gold"}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 6, fontWeight: 600, color: previewBr.secondaryColor || "#E6FFA9", textTransform: "uppercase" }}>MEMBER</div>
                        <div style={{ fontSize: 11, fontWeight: 500, color: previewBr.primaryColor || "#fff" }}>Jane Smith</div>
                      </div>
                    </div>

                    <div style={{ padding: "6px 14px 10px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <QrCode size={70} />
                      <div style={{ fontSize: 6, color: previewBr.secondaryColor || "#E6FFA9", marginTop: 3, opacity: 0.4 }}>Powered by Kyro</div>
                    </div>
                  </div>
                </div>

                {/* Home indicator */}
                <div style={{ height: 28, backgroundColor: "#000", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <div style={{ width: 120, height: 5, borderRadius: 3, backgroundColor: "#555" }} />
                </div>
              </div>
            ) : (
              <div style={{ padding: 40, textAlign: "center", color: "rgba(10,10,10,0.3)", fontSize: 14 }}>Select a card to preview</div>
            )}
          </div>
        </div>
      </div>

      {/* Delete modal */}
      {deleteTarget && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => !deleting && setDeleteTarget(null)}>
          <div style={{ backgroundColor: "white", borderRadius: 24, padding: "32px 28px", maxWidth: 380, width: "90%", textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,0.15)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: "rgba(220,38,38,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Trash2 size={22} style={{ color: "rgb(220,38,38)" }} />
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "rgba(10,10,10,0.9)", margin: "0 0 8px" }}>Delete card?</h2>
            <p style={{ fontSize: 14, color: "rgba(10,10,10,0.45)", lineHeight: 1.5, marginBottom: 24 }}>
              <strong style={{ color: "rgba(10,10,10,0.7)" }}>{deleteTarget.business_details?.name || deleteTarget.name}</strong> and all {deleteTarget.enrollmentCount} enrollments will be permanently deleted.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteTarget(null)} disabled={deleting} style={{
                flex: 1, padding: "12px", borderRadius: 12, border: "1px solid rgba(10,10,10,0.1)",
                backgroundColor: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                color: "rgba(10,10,10,0.7)",
              }}>Cancel</button>
              <button onClick={handleDelete} disabled={deleting} style={{
                flex: 1, padding: "12px", borderRadius: 12, border: "none",
                backgroundColor: "rgb(220,38,38)", color: "white", fontSize: 14, fontWeight: 600,
                cursor: deleting ? "not-allowed" : "pointer", fontFamily: "inherit",
                opacity: deleting ? 0.7 : 1,
              }}>{deleting ? "Deleting..." : "Delete"}</button>
            </div>
          </div>
        </div>
      )}

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />

      <style>{`
        @media (max-width: 768px) {
          .links-grid { grid-template-columns: 1fr !important; }
          .links-preview { order: -1 !important; display: flex !important; justify-content: center !important; margin-bottom: 16px !important; }
          .links-preview > div { position: static !important; }
          .links-preview > div > div { transform: scale(0.85); transform-origin: top center; }
          .theme-preset-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
