"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type CardType = "coupon" | "stamp" | "points";

type CouponLogic = {
  offerTitle: string;
  offerDescription: string;
  expiryDate: string;
  conditions: string;
};

type StampLogic = {
  totalStamps: number;
  stampIcon: string;
  reward: string;
  progressLabel: string;
};

type PointsLogic = {
  pointsPerDollar: number;
  pointsLabel: string;
  rewardTiers: { points: number; reward: string }[];
  redemptionRules: string;
};

type Branding = {
  logoUrl: string;
  heroImageUrl: string;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  cardStyle: string;
};

type BusinessDetails = {
  category: string;
  address: string;
  phone: string;
  website: string;
  description: string;
};

type CardData = {
  businessId: string;
  type: CardType;
  name: string;
  merchantPin: string;
  businessDetails: BusinessDetails;
  branding: Branding;
  logic: CouponLogic | StampLogic | PointsLogic;
};

type Merchant = {
  id: string;
  name: string;
};

interface CardBuilderFormProps {
  initialData?: Partial<CardData>;
  merchants: Merchant[];
  onChange: (data: CardData) => void;
  onSave: (data: CardData) => void;
  onPublish: (data: CardData) => void;
  saving: boolean;
  publishing: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "cafe", "restaurant", "salon", "barber",
  "gym", "bakery", "retail", "other",
];

const DEFAULT_BRANDING: Branding = {
  logoUrl: "",
  heroImageUrl: "",
  backgroundColor: "#0B051D",
  primaryColor: "#FFFFFF",
  secondaryColor: "#E6FFA9",
  accentColor: "#6C47FF",
  cardStyle: "premium",
};

const DEFAULT_LOGIC: Record<CardType, CouponLogic | StampLogic | PointsLogic> = {
  coupon: { offerTitle: "", offerDescription: "", expiryDate: "", conditions: "" },
  stamp: { totalStamps: 10, stampIcon: "☕", reward: "", progressLabel: "collected" },
  points: { pointsPerDollar: 10, pointsLabel: "Kyro Points", rewardTiers: [{ points: 100, reward: "" }], redemptionRules: "" },
};

const DEFAULT_BUSINESS_DETAILS: BusinessDetails = {
  category: "",
  address: "",
  phone: "",
  website: "",
  description: "",
};

// ─── Style helpers ────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid rgb(228,227,223)",
  fontSize: "14px",
  fontFamily: "inherit",
  color: "rgb(11,5,29)",
  backgroundColor: "white",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  color: "rgb(97,95,109)",
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const sectionHeaderBtnStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 0",
  background: "none",
  border: "none",
  borderBottom: "1px solid rgb(228,227,223)",
  cursor: "pointer",
  fontFamily: "inherit",
};

const fieldWrap: React.CSSProperties = { marginBottom: "16px" };

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({
  title,
  open,
  onToggle,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        ...sectionHeaderBtnStyle,
        borderBottom: open ? "1px solid rgb(228,227,223)" : "none",
      }}
    >
      <span style={{ fontSize: "14px", fontWeight: 600, color: "rgb(11,5,29)" }}>{title}</span>
      <ChevronDown
        size={18}
        color="rgb(97,95,109)"
        style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
      />
    </button>
  );
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={fieldWrap}>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: "40px", height: "40px", border: "1px solid rgb(228,227,223)", borderRadius: "8px", padding: "2px", cursor: "pointer", backgroundColor: "white" }}
        />
        <span style={{ fontSize: "13px", color: "rgb(97,95,109)", fontFamily: "monospace" }}>{value}</span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CardBuilderForm({
  initialData,
  merchants,
  onChange,
  onSave,
  onPublish,
  saving,
  publishing,
}: CardBuilderFormProps) {
  const buildInitial = (): CardData => {
    const type: CardType = initialData?.type ?? "stamp";
    return {
      businessId: initialData?.businessId ?? "",
      type,
      name: initialData?.name ?? "",
      merchantPin: initialData?.merchantPin ?? "0000",
      businessDetails: { ...DEFAULT_BUSINESS_DETAILS, ...(initialData?.businessDetails ?? {}) },
      branding: { ...DEFAULT_BRANDING, ...(initialData?.branding ?? {}) },
      logic: initialData?.logic ?? DEFAULT_LOGIC[type],
    };
  };

  const [cardData, setCardData] = useState<CardData>(buildInitial);

  const [open, setOpen] = useState<Record<string, boolean>>({
    merchant: true,
    type: true,
    details: true,
    branding: false,
    logic: true,
    preview: false,
  });

  const toggle = (key: string) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  // Propagate changes upward
  useEffect(() => {
    onChange(cardData);
  }, [cardData]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = <K extends keyof CardData>(key: K, value: CardData[K]) =>
    setCardData((prev) => ({ ...prev, [key]: value }));

  const setDetails = (patch: Partial<BusinessDetails>) =>
    setCardData((prev) => ({
      ...prev,
      businessDetails: { ...prev.businessDetails, ...patch },
    }));

  const setBranding = (patch: Partial<Branding>) =>
    setCardData((prev) => ({
      ...prev,
      branding: { ...prev.branding, ...patch },
    }));

  const setLogic = (patch: Partial<CouponLogic & StampLogic & PointsLogic>) =>
    setCardData((prev) => ({
      ...prev,
      logic: { ...(prev.logic as Record<string, unknown>), ...patch } as CardData["logic"],
    }));

  const handleTypeChange = (t: CardType) => {
    setCardData((prev) => ({ ...prev, type: t, logic: DEFAULT_LOGIC[t] }));
  };

  // ── Points reward tier helpers
  const tiers = cardData.type === "points"
    ? (cardData.logic as PointsLogic).rewardTiers
    : [];

  const updateTier = (idx: number, patch: Partial<{ points: number; reward: string }>) => {
    const updated = tiers.map((t, i) => (i === idx ? { ...t, ...patch } : t));
    setLogic({ rewardTiers: updated } as never);
  };

  const addTier = () =>
    setLogic({ rewardTiers: [...tiers, { points: 0, reward: "" }] } as never);

  const removeTier = (idx: number) =>
    setLogic({ rewardTiers: tiers.filter((_, i) => i !== idx) } as never);

  // ── Type toggle button style
  const typeBtn = (t: CardType): React.CSSProperties =>
    cardData.type === t
      ? { backgroundColor: "rgb(108,71,255)", color: "white", border: "none" }
      : { backgroundColor: "white", border: "1px solid rgb(228,227,223)", color: "rgb(11,5,29)" };

  const sharedTypeBtn: React.CSSProperties = {
    padding: "10px 18px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background-color 0.15s, color 0.15s",
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>

      {/* ── Section 1: Merchant ── */}
      <div style={{ marginBottom: "4px" }}>
        <SectionHeader title="1. Merchant" open={open.merchant} onToggle={() => toggle("merchant")} />
        {open.merchant && (
          <div style={{ paddingTop: "18px", paddingBottom: "8px" }}>
            <div style={fieldWrap}>
              <label style={labelStyle}>Merchant</label>
              <select
                value={cardData.businessId}
                onChange={(e) => set("businessId", e.target.value)}
                style={inputStyle}
              >
                <option value="">Select a merchant…</option>
                {merchants.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div style={fieldWrap}>
              <label style={labelStyle}>Card Name</label>
              <input
                type="text"
                value={cardData.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. VIP Rewards Card"
                style={inputStyle}
              />
            </div>
            <div style={fieldWrap}>
              <label style={labelStyle}>Merchant PIN</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                pattern="[0-9]{4}"
                value={cardData.merchantPin}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                  set("merchantPin", v);
                }}
                placeholder="0000"
                style={{ ...inputStyle, width: "120px", letterSpacing: "4px", textAlign: "center" }}
              />
              <p style={{ fontSize: "12px", color: "rgb(97,95,109)", marginTop: "4px" }}>
                4-digit PIN required by merchants to perform scan actions.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Section 2: Card Type ── */}
      <div style={{ marginBottom: "4px" }}>
        <SectionHeader title="2. Card Type" open={open.type} onToggle={() => toggle("type")} />
        {open.type && (
          <div style={{ paddingTop: "18px", paddingBottom: "8px" }}>
            <label style={labelStyle}>Type</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
              {(["coupon", "stamp", "points"] as CardType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTypeChange(t)}
                  style={{ ...sharedTypeBtn, ...typeBtn(t), textTransform: "capitalize" }}
                >
                  {t === "coupon" ? "Coupon" : t === "stamp" ? "Stamp Card" : "Points Card"}
                </button>
              ))}
            </div>
            <p style={{ fontSize: "13px", color: "rgb(97,95,109)", margin: 0, lineHeight: 1.5 }}>
              {cardData.type === "coupon" && "Customers redeem a one-time or recurring discount offer."}
              {cardData.type === "stamp" && "Customers collect stamps toward a free reward."}
              {cardData.type === "points" && "Customers earn points per dollar spent and redeem for rewards."}
            </p>
          </div>
        )}
      </div>

      {/* ── Section 3: Business Details ── */}
      <div style={{ marginBottom: "4px" }}>
        <SectionHeader title="3. Business Details" open={open.details} onToggle={() => toggle("details")} />
        {open.details && (
          <div style={{ paddingTop: "18px", paddingBottom: "8px" }}>
            <div style={fieldWrap}>
              <label style={labelStyle}>Category</label>
              <select
                value={cardData.businessDetails.category}
                onChange={(e) => setDetails({ category: e.target.value })}
                style={inputStyle}
              >
                <option value="">Select category…</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} style={{ textTransform: "capitalize" }}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div style={fieldWrap}>
              <label style={labelStyle}>Address</label>
              <input
                type="text"
                value={cardData.businessDetails.address}
                onChange={(e) => setDetails({ address: e.target.value })}
                placeholder="123 Main St, Sydney NSW 2000"
                style={inputStyle}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={fieldWrap}>
                <label style={labelStyle}>Phone</label>
                <input
                  type="tel"
                  value={cardData.businessDetails.phone}
                  onChange={(e) => setDetails({ phone: e.target.value })}
                  placeholder="+61 2 0000 0000"
                  style={inputStyle}
                />
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle}>Website</label>
                <input
                  type="url"
                  value={cardData.businessDetails.website}
                  onChange={(e) => setDetails({ website: e.target.value })}
                  placeholder="https://example.com"
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={fieldWrap}>
              <label style={labelStyle}>Description</label>
              <textarea
                value={cardData.businessDetails.description}
                onChange={(e) => setDetails({ description: e.target.value })}
                placeholder="Brief description shown on the card…"
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Section 4: Branding ── */}
      <div style={{ marginBottom: "4px" }}>
        <SectionHeader title="4. Branding" open={open.branding} onToggle={() => toggle("branding")} />
        {open.branding && (
          <div style={{ paddingTop: "18px", paddingBottom: "8px" }}>
            {/* Logo upload */}
            <div style={fieldWrap}>
              <label style={labelStyle}>Business Logo</label>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {cardData.branding.logoUrl && (
                  <img
                    src={cardData.branding.logoUrl}
                    alt="Logo"
                    style={{ width: "48px", height: "48px", borderRadius: "10px", objectFit: "cover", border: "1px solid rgb(228,227,223)" }}
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 500000) { alert("Logo must be under 500KB"); return; }
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      setBranding({ logoUrl: ev.target?.result as string });
                    };
                    reader.readAsDataURL(file);
                  }}
                  style={{ fontSize: "13px", color: "rgb(97,95,109)" }}
                />
                {cardData.branding.logoUrl && (
                  <button
                    type="button"
                    onClick={() => setBranding({ logoUrl: "" })}
                    style={{ fontSize: "12px", color: "#ff6b6b", background: "none", border: "none", cursor: "pointer", padding: "4px 8px" }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <ColorRow label="Background" value={cardData.branding.backgroundColor} onChange={(v) => setBranding({ backgroundColor: v })} />
              <ColorRow label="Primary" value={cardData.branding.primaryColor} onChange={(v) => setBranding({ primaryColor: v })} />
              <ColorRow label="Secondary" value={cardData.branding.secondaryColor} onChange={(v) => setBranding({ secondaryColor: v })} />
              <ColorRow label="Accent" value={cardData.branding.accentColor} onChange={(v) => setBranding({ accentColor: v })} />
            </div>
            <div style={fieldWrap}>
              <label style={labelStyle}>Card Style</label>
              <select
                value={cardData.branding.cardStyle}
                onChange={(e) => setBranding({ cardStyle: e.target.value })}
                style={inputStyle}
              >
                {["premium", "minimal", "bold", "gradient"].map((s) => (
                  <option key={s} value={s} style={{ textTransform: "capitalize" }}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* ── Section 5: Card Logic ── */}
      <div style={{ marginBottom: "4px" }}>
        <SectionHeader title="5. Card Logic" open={open.logic} onToggle={() => toggle("logic")} />
        {open.logic && (
          <div style={{ paddingTop: "18px", paddingBottom: "8px" }}>

            {/* Coupon logic */}
            {cardData.type === "coupon" && (() => {
              const l = cardData.logic as CouponLogic;
              return (
                <>
                  <div style={fieldWrap}>
                    <label style={labelStyle}>Offer Title</label>
                    <input type="text" value={l.offerTitle} onChange={(e) => setLogic({ offerTitle: e.target.value })} placeholder="e.g. 20% Off Your Next Visit" style={inputStyle} />
                  </div>
                  <div style={fieldWrap}>
                    <label style={labelStyle}>Offer Description</label>
                    <textarea value={l.offerDescription} onChange={(e) => setLogic({ offerDescription: e.target.value })} placeholder="Describe the offer in detail…" rows={3} style={{ ...inputStyle, resize: "vertical" }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={fieldWrap}>
                      <label style={labelStyle}>Expiry Date</label>
                      <input type="date" value={l.expiryDate} onChange={(e) => setLogic({ expiryDate: e.target.value })} style={inputStyle} />
                    </div>
                    <div style={fieldWrap}>
                      <label style={labelStyle}>Conditions</label>
                      <input type="text" value={l.conditions} onChange={(e) => setLogic({ conditions: e.target.value })} placeholder="e.g. Min. spend $20" style={inputStyle} />
                    </div>
                  </div>
                </>
              );
            })()}

            {/* Stamp logic */}
            {cardData.type === "stamp" && (() => {
              const l = cardData.logic as StampLogic;
              return (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={fieldWrap}>
                      <label style={labelStyle}>Total Stamps</label>
                      <input type="number" min={3} max={20} value={l.totalStamps} onChange={(e) => { const v = parseInt(e.target.value) || 3; setLogic({ totalStamps: Math.min(20, Math.max(3, v)) }); }} style={inputStyle} />
                    </div>
                    <div style={fieldWrap}>
                      <label style={labelStyle}>Stamp Icon</label>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "6px" }}>
                        {["☕", "🍕", "🍔", "🍩", "🧁", "🍺", "🍷", "🥤", "🍣", "💇", "💅", "✨", "⭐", "🎁", "💎", "🔥", "❤️", "🌸", "🏋️", "🧖", "💆", "🍦", "🥐", "🌮"].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setLogic({ stampIcon: emoji })}
                            style={{
                              width: "100%",
                              aspectRatio: "1",
                              borderRadius: "8px",
                              border: l.stampIcon === emoji ? "2px solid rgb(108,71,255)" : "1px solid rgb(228,227,223)",
                              backgroundColor: l.stampIcon === emoji ? "rgb(237,233,254)" : "white",
                              fontSize: "20px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.15s",
                            }}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={fieldWrap}>
                    <label style={labelStyle}>Reward</label>
                    <input type="text" value={l.reward} onChange={(e) => setLogic({ reward: e.target.value })} placeholder="e.g. Free coffee" style={inputStyle} />
                  </div>
                  <div style={fieldWrap}>
                    <label style={labelStyle}>Progress Label</label>
                    <input type="text" value={l.progressLabel} onChange={(e) => setLogic({ progressLabel: e.target.value })} placeholder="e.g. collected" style={inputStyle} />
                  </div>
                </>
              );
            })()}

            {/* Points logic */}
            {cardData.type === "points" && (() => {
              const l = cardData.logic as PointsLogic;
              return (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={fieldWrap}>
                      <label style={labelStyle}>Points per Dollar</label>
                      <input type="number" min={1} value={l.pointsPerDollar} onChange={(e) => setLogic({ pointsPerDollar: parseInt(e.target.value) || 1 })} style={inputStyle} />
                    </div>
                    <div style={fieldWrap}>
                      <label style={labelStyle}>Points Label</label>
                      <input type="text" value={l.pointsLabel} onChange={(e) => setLogic({ pointsLabel: e.target.value })} placeholder="e.g. Kyro Points" style={inputStyle} />
                    </div>
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ ...labelStyle, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span>Reward Tiers</span>
                      <button
                        type="button"
                        onClick={addTier}
                        style={{ fontSize: "12px", fontWeight: 600, color: "rgb(108,71,255)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", letterSpacing: 0, textTransform: "none" }}
                      >
                        + Add tier
                      </button>
                    </label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {tiers.map((tier, idx) => (
                        <div key={idx} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <input
                            type="number"
                            min={0}
                            value={tier.points}
                            onChange={(e) => updateTier(idx, { points: parseInt(e.target.value) || 0 })}
                            placeholder="pts"
                            style={{ ...inputStyle, width: "90px", flexShrink: 0 }}
                          />
                          <input
                            type="text"
                            value={tier.reward}
                            onChange={(e) => updateTier(idx, { reward: e.target.value })}
                            placeholder="Reward description"
                            style={{ ...inputStyle, flex: 1 }}
                          />
                          {tiers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTier(idx)}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "rgb(220,38,38)", fontSize: "18px", lineHeight: 1, padding: "0 4px", flexShrink: 0 }}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={fieldWrap}>
                    <label style={labelStyle}>Redemption Rules</label>
                    <textarea
                      value={l.redemptionRules}
                      onChange={(e) => setLogic({ redemptionRules: e.target.value })}
                      placeholder="e.g. Points expire after 12 months…"
                      rows={3}
                      style={{ ...inputStyle, resize: "vertical" }}
                    />
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* ── Section 6: Preview Notes ── */}
      <div style={{ marginBottom: "24px" }}>
        <SectionHeader title="6. Preview & Notes" open={open.preview} onToggle={() => toggle("preview")} />
        {open.preview && (
          <div style={{ paddingTop: "18px", paddingBottom: "8px" }}>
            <p style={{ fontSize: "13px", color: "rgb(97,95,109)", margin: "0 0 16px 0", lineHeight: 1.6 }}>
              A live preview of the card will appear in the sidebar once a merchant and card type are selected.
              Use this space for internal notes.
            </p>
            <div style={fieldWrap}>
              <label style={labelStyle}>Internal Notes</label>
              <textarea
                placeholder="Notes visible only to admins…"
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Action Buttons ── */}
      <div style={{ display: "flex", gap: "10px", paddingTop: "8px", borderTop: "1px solid rgb(228,227,223)" }}>
        <button
          type="button"
          onClick={() => onSave(cardData)}
          disabled={saving}
          style={{
            flex: 1,
            padding: "12px 20px",
            borderRadius: "10px",
            border: "1px solid rgb(228,227,223)",
            backgroundColor: "white",
            color: "rgb(11,5,29)",
            fontSize: "14px",
            fontWeight: 600,
            cursor: saving ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            opacity: saving ? 0.6 : 1,
            transition: "opacity 0.15s",
          }}
        >
          {saving ? "Saving…" : "Save as Draft"}
        </button>
        <button
          type="button"
          onClick={() => onPublish(cardData)}
          disabled={publishing}
          style={{
            flex: 1,
            padding: "12px 20px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "rgb(108,71,255)",
            color: "white",
            fontSize: "14px",
            fontWeight: 600,
            cursor: publishing ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            opacity: publishing ? 0.6 : 1,
            transition: "opacity 0.15s",
          }}
        >
          {publishing ? "Publishing…" : "Publish"}
        </button>
      </div>
    </div>
  );
}
