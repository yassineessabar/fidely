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

  // Build fields matching what the wallet pass will show
  let headerLabel = "";
  let headerValue = "";
  let primaryLabel = "";
  let primaryValue = "";
  let secondaryLabel = "";
  let secondaryValue = "";
  let auxiliaryLabel = "MEMBER";
  let auxiliaryValue = "Jane Smith";

  if (type === "stamp") {
    const total = logic?.totalStamps || 10;
    const icon = logic?.stampIcon || "⭐";
    headerLabel = "STAMPS";
    headerValue = `0/${total}`;
    primaryLabel = "REWARD";
    primaryValue = logic?.reward || "Free item";
    secondaryLabel = "PROGRESS";
    secondaryValue = Array.from({ length: total }, () => "○").join("");
  } else if (type === "points") {
    headerLabel = logic?.pointsLabel || "POINTS";
    headerValue = "0";
    primaryLabel = "EARN RATE";
    primaryValue = `${logic?.pointsPerDollar || 10} pts per $1`;
    const tiers = logic?.rewardTiers || [];
    if (tiers.length > 0) {
      secondaryLabel = "NEXT REWARD";
      secondaryValue = `${tiers[0].reward || "Reward"} (${tiers[0].points || 0} pts)`;
    }
  } else if (type === "coupon") {
    primaryLabel = "OFFER";
    primaryValue = logic?.offerTitle || "Special Offer";
    if (logic?.expiryDate) {
      secondaryLabel = "EXPIRES";
      secondaryValue = new Date(logic.expiryDate).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
    }
  }

  return (
    <div style={{
      width: "320px",
      borderRadius: "16px",
      overflow: "hidden",
      backgroundColor: bg,
      boxShadow: "0 24px 48px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.15)",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      {/* ── Top bar: logo + name (left), header field (right) ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 16px 10px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {branding.logoUrl ? (
            <img src={branding.logoUrl} alt="Logo" style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover" }} />
          ) : (
            <div style={{
              width: "36px", height: "36px", borderRadius: "8px",
              backgroundColor: accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px", fontWeight: 800, color: primary,
            }}>
              {merchantName.charAt(0).toUpperCase()}
            </div>
          )}
          <div style={{ fontSize: "14px", fontWeight: 700, color: primary }}>{merchantName}</div>
        </div>
        {headerLabel && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "9px", fontWeight: 600, color: secondary, textTransform: "uppercase", letterSpacing: "0.5px" }}>{headerLabel}</div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: primary, lineHeight: 1.1 }}>{headerValue}</div>
          </div>
        )}
      </div>

      {/* ── Strip with gradient + primary field overlay ── */}
      <div style={{
        position: "relative", width: "100%", height: "100px",
        background: branding.heroImageUrl
          ? `url(${branding.heroImageUrl}) center/cover`
          : `linear-gradient(135deg, ${accent}dd 0%, ${bg} 60%, ${accent}44 100%)`,
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "0 16px",
      }}>
        {/* Subtle pattern overlay */}
        {!branding.heroImageUrl && (
          <div style={{
            position: "absolute", inset: 0, opacity: 0.05,
            backgroundImage: `radial-gradient(circle at 20% 50%, ${primary} 1px, transparent 1px), radial-gradient(circle at 80% 30%, ${primary} 1px, transparent 1px)`,
            backgroundSize: "20px 20px, 30px 30px",
          }} />
        )}
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: "28px", fontWeight: 800, color: primary, lineHeight: 1.15, letterSpacing: "-0.3px" }}>
            {primaryValue}
          </div>
          <div style={{ fontSize: "11px", fontWeight: 600, color: secondary, marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {primaryLabel}
          </div>
        </div>
      </div>

      {/* ── Secondary + Auxiliary fields ── */}
      <div style={{ padding: "12px 16px" }}>
        {secondaryLabel && (
          <div style={{ marginBottom: auxiliaryLabel ? "10px" : "0" }}>
            <div style={{ fontSize: "9px", fontWeight: 600, color: secondary, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>{secondaryLabel}</div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: primary }}>{secondaryValue}</div>
          </div>
        )}
        {auxiliaryLabel && (
          <div>
            <div style={{ fontSize: "9px", fontWeight: 600, color: secondary, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>{auxiliaryLabel}</div>
            <div style={{ fontSize: "13px", fontWeight: 500, color: `${primary}90` }}>{auxiliaryValue}</div>
          </div>
        )}
      </div>

      {/* ── Divider ── */}
      <div style={{ margin: "0 16px", height: "1px", backgroundColor: `${primary}12` }} />

      {/* ── QR code ── */}
      <div style={{ display: "flex", justifyContent: "center", padding: "14px 16px 10px" }}>
        <div style={{
          width: "80px", height: "80px", borderRadius: "12px",
          backgroundColor: "white", padding: "4px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR Code" style={{ width: "72px", height: "72px", borderRadius: "4px" }} />
          ) : (
            <div style={{ width: "72px", height: "72px", borderRadius: "4px", backgroundColor: "#f5f5f5" }} />
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ padding: "4px 16px 14px", textAlign: "center", fontSize: "9px", color: `${primary}30`, letterSpacing: "0.5px" }}>
        Powered by Kyro
      </div>
    </div>
  );
}
