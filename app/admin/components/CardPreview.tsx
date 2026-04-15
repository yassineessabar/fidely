"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";

type CardPreviewProps = {
  type: "coupon" | "stamp" | "points";
  businessDetails: {
    name: string;
    category: string;
    tagline: string;
    description: string;
    welcomeOffer: string;
  };
  branding: {
    logoUrl: string;
    heroImageUrl: string;
    backgroundColor: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    cardStyle: string;
  };
  logic: any;
};

export default function CardPreview({ type, businessDetails, branding, logic }: CardPreviewProps) {
  const bg = branding.backgroundColor || "#0B051D";
  const primary = branding.primaryColor || "#FFFFFF";
  const secondary = branding.secondaryColor || "#E6FFA9";
  const accent = branding.accentColor || "#6C47FF";
  const merchantName = businessDetails.name || "Business Name";

  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  useEffect(() => {
    const url = `https://kyro.com/c/${merchantName.toLowerCase().replace(/\s+/g, "-")}`;
    QRCode.toDataURL(url, { width: 200, margin: 1, color: { dark: "#000000", light: "#ffffff" }, errorCorrectionLevel: "M" })
      .then(setQrDataUrl)
      .catch(() => {});
  }, [merchantName]);

  const typeLabel: Record<string, string> = {
    coupon: "COUPON",
    stamp: "STAMP CARD",
    points: "REWARDS",
  };

  return (
    <div style={{
      width: "320px",
      borderRadius: "20px",
      overflow: "hidden",
      backgroundColor: bg,
      boxShadow: `0 24px 48px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 ${primary}10`,
      fontFamily: "inherit",
      position: "relative",
    }}>
      {/* Ambient glow */}
      <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: `radial-gradient(circle, ${accent}25, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "60px", left: "-30px", width: "120px", height: "120px", borderRadius: "50%", background: `radial-gradient(circle, ${secondary}15, transparent 70%)`, pointerEvents: "none" }} />

      {/* Header bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 14px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {branding.logoUrl ? (
            <img src={branding.logoUrl} alt="Logo" style={{ width: "40px", height: "40px", borderRadius: "10px", objectFit: "cover", border: `1px solid ${primary}20` }} />
          ) : (
            <div style={{
              width: "40px", height: "40px", borderRadius: "10px",
              background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", fontWeight: 800, color: primary,
              boxShadow: `0 4px 12px ${accent}40`,
            }}>
              {merchantName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: primary, lineHeight: 1.2, letterSpacing: "-0.2px" }}>{merchantName}</div>
            {businessDetails.tagline && (
              <div style={{ fontSize: "11px", color: `${primary}90`, marginTop: "2px" }}>{businessDetails.tagline}</div>
            )}
          </div>
        </div>
        <div style={{
          padding: "3px 8px", borderRadius: "6px",
          backgroundColor: `${primary}10`, border: `1px solid ${primary}15`,
          fontSize: "8px", fontWeight: 700, color: `${primary}70`,
          letterSpacing: "1px",
        }}>
          {typeLabel[type] || "CARD"}
        </div>
      </div>

      {/* Hero strip */}
      <div style={{ width: "100%", height: "90px", position: "relative", overflow: "hidden" }}>
        {branding.heroImageUrl ? (
          <img src={branding.heroImageUrl} alt="Hero" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: `linear-gradient(135deg, ${accent}dd 0%, ${bg} 60%, ${accent}44 100%)`,
          }}>
            {/* Decorative pattern */}
            <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: `radial-gradient(circle at 20% 50%, ${primary} 1px, transparent 1px), radial-gradient(circle at 80% 30%, ${primary} 1px, transparent 1px)`, backgroundSize: "20px 20px, 30px 30px" }} />
          </div>
        )}
        {/* Gradient fade at bottom */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40px", background: `linear-gradient(transparent, ${bg})` }} />
      </div>

      {/* Content area */}
      <div style={{ padding: "14px 20px 16px", position: "relative", zIndex: 1 }}>
        {type === "coupon" && <CouponContent logic={logic} primary={primary} secondary={secondary} accent={accent} />}
        {type === "stamp" && <StampContent logic={logic} primary={primary} secondary={secondary} accent={accent} bg={bg} />}
        {type === "points" && <PointsContent logic={logic} primary={primary} secondary={secondary} accent={accent} bg={bg} />}
      </div>

      {/* Welcome offer */}
      {businessDetails.welcomeOffer && (
        <div style={{
          margin: "0 16px 14px", padding: "10px 14px", borderRadius: "10px",
          background: `linear-gradient(135deg, ${secondary}18, ${secondary}08)`,
          border: `1px solid ${secondary}30`,
          backdropFilter: "blur(4px)",
        }}>
          <div style={{ fontSize: "9px", fontWeight: 700, color: secondary, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "3px" }}>Welcome Offer</div>
          <div style={{ fontSize: "13px", fontWeight: 500, color: primary }}>{businessDetails.welcomeOffer}</div>
        </div>
      )}

      {/* Divider */}
      <div style={{ margin: "0 20px", height: "1px", background: `linear-gradient(90deg, transparent, ${primary}15, transparent)` }} />

      {/* QR code — real generated */}
      <div style={{ display: "flex", justifyContent: "center", padding: "14px 20px 10px" }}>
        <div style={{
          width: "72px", height: "72px", borderRadius: "12px",
          backgroundColor: "white", padding: "4px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR Code" style={{ width: "64px", height: "64px", borderRadius: "4px" }} />
          ) : (
            <div style={{ width: "64px", height: "64px", borderRadius: "4px", backgroundColor: "#f5f5f5" }} />
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "6px 20px 16px", textAlign: "center", fontSize: "9px", color: `${primary}40`, letterSpacing: "0.5px" }}>
        Powered by Kyro
      </div>
    </div>
  );
}

/* ── Coupon ── */
function CouponContent({ logic, primary, secondary, accent }: { logic: any; primary: string; secondary: string; accent: string }) {
  const offerTitle = logic?.offerTitle || "Special Offer";
  const offerDescription = logic?.offerDescription || "";
  const expiryDate = logic?.expiryDate || "";

  return (
    <>
      <div style={{ fontSize: "24px", fontWeight: 800, color: primary, lineHeight: 1.15, letterSpacing: "-0.5px" }}>{offerTitle}</div>
      {offerDescription && (
        <div style={{ fontSize: "13px", color: `${primary}99`, marginTop: "8px", lineHeight: 1.5 }}>{offerDescription}</div>
      )}
      {expiryDate && (
        <div style={{
          marginTop: "12px", display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "5px 12px", borderRadius: "8px",
          background: `linear-gradient(135deg, ${accent}30, ${accent}15)`,
          border: `1px solid ${accent}40`,
          fontSize: "11px", fontWeight: 600, color: secondary,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={secondary} strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          Expires {new Date(expiryDate).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
        </div>
      )}
    </>
  );
}

/* ── Stamp ── */
function StampContent({ logic, primary, secondary, accent, bg }: { logic: any; primary: string; secondary: string; accent: string; bg: string }) {
  const total = Math.min(20, Math.max(3, logic?.totalStamps || 10));
  const icon = logic?.stampIcon || "\u2615";
  const reward = logic?.reward || "Free reward";
  const progressLabel = logic?.progressLabel || "collected";
  const filled = Math.min(3, total);
  const cols = total <= 5 ? total : total <= 10 ? 5 : total <= 15 ? 5 : 5;

  return (
    <>
      {/* Progress bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <div style={{ fontSize: "12px", fontWeight: 700, color: primary }}>
          {filled}<span style={{ color: `${primary}50` }}>/{total}</span> <span style={{ fontWeight: 400, color: `${primary}60`, fontSize: "11px" }}>{progressLabel}</span>
        </div>
        <div style={{ fontSize: "10px", fontWeight: 600, color: secondary, backgroundColor: `${secondary}20`, padding: "3px 8px", borderRadius: "6px" }}>
          {Math.round((filled / total) * 100)}%
        </div>
      </div>

      {/* Progress track */}
      <div style={{ width: "100%", height: "4px", borderRadius: "4px", backgroundColor: `${primary}12`, marginBottom: "16px", overflow: "hidden" }}>
        <div style={{ width: `${(filled / total) * 100}%`, height: "100%", borderRadius: "4px", background: `linear-gradient(90deg, ${accent}, ${secondary})`, transition: "width 0.3s ease" }} />
      </div>

      {/* Stamp grid */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "8px", marginBottom: "14px" }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            width: "100%", aspectRatio: "1", borderRadius: "12px",
            backgroundColor: i < filled ? `${accent}` : `${primary}08`,
            border: i < filled ? "none" : `2px dashed ${primary}18`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: i < filled ? "22px" : "14px",
            boxShadow: i < filled ? `0 2px 8px ${accent}40` : "none",
            transition: "all 0.2s",
          }}>
            {i < filled ? icon : <span style={{ color: `${primary}20` }}>{i + 1}</span>}
          </div>
        ))}
      </div>

      {/* Reward badge */}
      <div style={{
        display: "flex", alignItems: "center", gap: "8px",
        padding: "8px 12px", borderRadius: "10px",
        backgroundColor: `${primary}08`, border: `1px solid ${primary}10`,
      }}>
        <span style={{ fontSize: "16px" }}>🎁</span>
        <div>
          <div style={{ fontSize: "9px", fontWeight: 700, color: `${primary}50`, textTransform: "uppercase", letterSpacing: "0.5px" }}>Reward</div>
          <div style={{ fontSize: "12px", fontWeight: 600, color: primary }}>{reward}</div>
        </div>
      </div>
    </>
  );
}

/* ── Points ── */
function PointsContent({ logic, primary, secondary, accent, bg }: { logic: any; primary: string; secondary: string; accent: string; bg: string }) {
  const pointsLabel = logic?.pointsLabel || "Kyro Points";
  const pointsPerDollar = logic?.pointsPerDollar || 10;
  const tiers = logic?.rewardTiers || [];

  return (
    <>
      <div style={{ fontSize: "9px", fontWeight: 700, color: secondary, textTransform: "uppercase", letterSpacing: "1.5px" }}>{pointsLabel}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginTop: "4px" }}>
        <span style={{ fontSize: "40px", fontWeight: 800, color: primary, lineHeight: 1, letterSpacing: "-2px" }}>0</span>
        <span style={{ fontSize: "14px", fontWeight: 500, color: `${primary}40` }}>pts</span>
      </div>

      {/* Earn rate chip */}
      <div style={{
        marginTop: "10px", display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "5px 10px", borderRadius: "8px",
        backgroundColor: `${accent}15`, border: `1px solid ${accent}25`,
        fontSize: "11px", fontWeight: 500, color: `${primary}80`,
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={secondary} strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
        Earn {pointsPerDollar} pts per $1
      </div>

      {/* Reward tiers */}
      {tiers.length > 0 && (
        <div style={{ marginTop: "16px" }}>
          <div style={{ fontSize: "9px", fontWeight: 700, color: `${primary}50`, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Rewards</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {tiers.slice(0, 3).map((tier: { points: number; reward: string }, i: number) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 10px", borderRadius: "8px",
                backgroundColor: `${primary}06`, border: `1px solid ${primary}08`,
              }}>
                <span style={{ fontSize: "12px", fontWeight: 500, color: `${primary}90` }}>{tier.reward || "Reward"}</span>
                <span style={{
                  fontSize: "10px", fontWeight: 700, color: accent,
                  backgroundColor: `${accent}18`, padding: "3px 8px", borderRadius: "6px",
                }}>{tier.points} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
