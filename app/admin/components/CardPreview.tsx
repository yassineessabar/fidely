"use client";

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

  return (
    <div style={{ width: "320px", borderRadius: "16px", overflow: "hidden", backgroundColor: bg, boxShadow: "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.12)", fontFamily: "inherit", position: "relative" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px 20px 12px" }}>
        {branding.logoUrl ? (
          <img src={branding.logoUrl} alt="Logo" style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 800, color: primary }}>
            {merchantName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <div style={{ fontSize: "15px", fontWeight: 700, color: primary, lineHeight: 1.2 }}>{merchantName}</div>
          {businessDetails.tagline && (
            <div style={{ fontSize: "11px", color: secondary, opacity: 0.8, marginTop: "2px" }}>{businessDetails.tagline}</div>
          )}
        </div>
      </div>

      {/* Strip / hero */}
      <div style={{ width: "100%", height: "100px", backgroundColor: accent, position: "relative", overflow: "hidden" }}>
        {branding.heroImageUrl ? (
          <img src={branding.heroImageUrl} alt="Hero" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${accent}, ${bg})` }} />
        )}
      </div>

      {/* Type-specific content */}
      <div style={{ padding: "16px 20px" }}>
        {type === "coupon" && <CouponContent logic={logic} primary={primary} secondary={secondary} accent={accent} />}
        {type === "stamp" && <StampContent logic={logic} primary={primary} secondary={secondary} accent={accent} />}
        {type === "points" && <PointsContent logic={logic} primary={primary} secondary={secondary} accent={accent} />}
      </div>

      {/* Welcome offer */}
      {businessDetails.welcomeOffer && (
        <div style={{ margin: "0 20px 12px", padding: "8px 12px", borderRadius: "8px", backgroundColor: `${secondary}22`, border: `1px solid ${secondary}44` }}>
          <div style={{ fontSize: "10px", fontWeight: 600, color: secondary, textTransform: "uppercase", letterSpacing: "0.5px" }}>Welcome Offer</div>
          <div style={{ fontSize: "12px", color: primary, marginTop: "2px" }}>{businessDetails.welcomeOffer}</div>
        </div>
      )}

      {/* QR code — realistic SVG */}
      <div style={{ display: "flex", justifyContent: "center", padding: "8px 20px 12px" }}>
        <div style={{ width: "72px", height: "72px", borderRadius: "10px", backgroundColor: "white", padding: "6px" }}>
          <svg viewBox="0 0 29 29" width="60" height="60" style={{ display: "block" }}>
            {/* Position detection patterns (3 corners) */}
            <rect x="0" y="0" width="7" height="7" fill="#000"/><rect x="1" y="1" width="5" height="5" fill="#fff"/><rect x="2" y="2" width="3" height="3" fill="#000"/>
            <rect x="22" y="0" width="7" height="7" fill="#000"/><rect x="23" y="1" width="5" height="5" fill="#fff"/><rect x="24" y="2" width="3" height="3" fill="#000"/>
            <rect x="0" y="22" width="7" height="7" fill="#000"/><rect x="1" y="23" width="5" height="5" fill="#fff"/><rect x="2" y="24" width="3" height="3" fill="#000"/>
            {/* Timing patterns */}
            <rect x="8" y="6" width="1" height="1" fill="#000"/><rect x="10" y="6" width="1" height="1" fill="#000"/><rect x="12" y="6" width="1" height="1" fill="#000"/>
            <rect x="6" y="8" width="1" height="1" fill="#000"/><rect x="6" y="10" width="1" height="1" fill="#000"/><rect x="6" y="12" width="1" height="1" fill="#000"/>
            {/* Data modules — realistic random pattern */}
            <rect x="8" y="0" width="1" height="1" fill="#000"/><rect x="10" y="0" width="1" height="1" fill="#000"/><rect x="12" y="1" width="1" height="1" fill="#000"/>
            <rect x="9" y="2" width="1" height="1" fill="#000"/><rect x="11" y="2" width="1" height="1" fill="#000"/><rect x="13" y="3" width="1" height="1" fill="#000"/>
            <rect x="8" y="4" width="1" height="1" fill="#000"/><rect x="14" y="1" width="1" height="1" fill="#000"/><rect x="15" y="3" width="1" height="1" fill="#000"/>
            <rect x="9" y="8" width="1" height="1" fill="#000"/><rect x="11" y="8" width="1" height="1" fill="#000"/><rect x="13" y="9" width="1" height="1" fill="#000"/>
            <rect x="8" y="10" width="1" height="1" fill="#000"/><rect x="10" y="11" width="1" height="1" fill="#000"/><rect x="12" y="10" width="1" height="1" fill="#000"/>
            <rect x="14" y="8" width="1" height="1" fill="#000"/><rect x="16" y="9" width="1" height="1" fill="#000"/><rect x="18" y="8" width="1" height="1" fill="#000"/>
            <rect x="15" y="11" width="1" height="1" fill="#000"/><rect x="17" y="10" width="1" height="1" fill="#000"/><rect x="19" y="11" width="1" height="1" fill="#000"/>
            <rect x="20" y="8" width="1" height="1" fill="#000"/><rect x="22" y="9" width="1" height="1" fill="#000"/><rect x="24" y="8" width="1" height="1" fill="#000"/>
            <rect x="21" y="10" width="1" height="1" fill="#000"/><rect x="23" y="11" width="1" height="1" fill="#000"/><rect x="25" y="10" width="1" height="1" fill="#000"/>
            <rect x="8" y="13" width="1" height="1" fill="#000"/><rect x="10" y="14" width="1" height="1" fill="#000"/><rect x="12" y="13" width="1" height="1" fill="#000"/>
            <rect x="9" y="15" width="1" height="1" fill="#000"/><rect x="11" y="16" width="1" height="1" fill="#000"/><rect x="13" y="15" width="1" height="1" fill="#000"/>
            <rect x="14" y="14" width="1" height="1" fill="#000"/><rect x="16" y="13" width="1" height="1" fill="#000"/><rect x="18" y="14" width="1" height="1" fill="#000"/>
            <rect x="15" y="16" width="1" height="1" fill="#000"/><rect x="17" y="15" width="1" height="1" fill="#000"/><rect x="19" y="16" width="1" height="1" fill="#000"/>
            <rect x="20" y="13" width="1" height="1" fill="#000"/><rect x="22" y="14" width="1" height="1" fill="#000"/><rect x="24" y="15" width="1" height="1" fill="#000"/>
            <rect x="8" y="18" width="1" height="1" fill="#000"/><rect x="10" y="19" width="1" height="1" fill="#000"/><rect x="12" y="18" width="1" height="1" fill="#000"/>
            <rect x="14" y="19" width="1" height="1" fill="#000"/><rect x="16" y="18" width="1" height="1" fill="#000"/><rect x="18" y="19" width="1" height="1" fill="#000"/>
            <rect x="20" y="18" width="1" height="1" fill="#000"/><rect x="22" y="19" width="1" height="1" fill="#000"/><rect x="24" y="20" width="1" height="1" fill="#000"/>
            <rect x="9" y="20" width="1" height="1" fill="#000"/><rect x="11" y="21" width="1" height="1" fill="#000"/><rect x="13" y="20" width="1" height="1" fill="#000"/>
            <rect x="15" y="22" width="1" height="1" fill="#000"/><rect x="17" y="23" width="1" height="1" fill="#000"/><rect x="19" y="22" width="1" height="1" fill="#000"/>
            <rect x="21" y="22" width="1" height="1" fill="#000"/><rect x="23" y="23" width="1" height="1" fill="#000"/><rect x="25" y="24" width="1" height="1" fill="#000"/>
            <rect x="8" y="24" width="1" height="1" fill="#000"/><rect x="10" y="25" width="1" height="1" fill="#000"/><rect x="12" y="26" width="1" height="1" fill="#000"/>
            <rect x="14" y="25" width="1" height="1" fill="#000"/><rect x="16" y="26" width="1" height="1" fill="#000"/><rect x="18" y="25" width="1" height="1" fill="#000"/>
            {/* Alignment pattern */}
            <rect x="20" y="20" width="5" height="5" fill="#000"/><rect x="21" y="21" width="3" height="3" fill="#fff"/><rect x="22" y="22" width="1" height="1" fill="#000"/>
          </svg>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "8px 20px 14px", textAlign: "center", fontSize: "9px", color: primary, opacity: 0.35, letterSpacing: "0.3px" }}>
        Powered by Kyro
      </div>
    </div>
  );
}

function CouponContent({ logic, primary, secondary, accent }: { logic: any; primary: string; secondary: string; accent: string }) {
  const offerTitle = logic?.offerTitle || "Special Offer";
  const offerDescription = logic?.offerDescription || "";
  const expiryDate = logic?.expiryDate || "";

  return (
    <>
      <div style={{ fontSize: "20px", fontWeight: 800, color: primary, lineHeight: 1.2 }}>{offerTitle}</div>
      {offerDescription && <div style={{ fontSize: "12px", color: primary, opacity: 0.7, marginTop: "6px" }}>{offerDescription}</div>}
      {expiryDate && (
        <div style={{ marginTop: "10px", display: "inline-block", padding: "4px 10px", borderRadius: "6px", backgroundColor: `${accent}33`, fontSize: "11px", fontWeight: 600, color: secondary }}>
          Expires {new Date(expiryDate).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
        </div>
      )}
    </>
  );
}

function StampContent({ logic, primary, secondary, accent }: { logic: any; primary: string; secondary: string; accent: string }) {
  const total = logic?.totalStamps || 10;
  const icon = logic?.stampIcon || "\u2615";
  const reward = logic?.reward || "Free reward";
  const progressLabel = logic?.progressLabel || "collected";
  const filled = 3;

  return (
    <>
      <div style={{ fontSize: "11px", fontWeight: 600, color: secondary, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
        {filled} / {total} {progressLabel}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(total, 5)}, 1fr)`, gap: "8px", marginBottom: "12px" }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            width: "100%", aspectRatio: "1", borderRadius: "50%",
            backgroundColor: i < filled ? accent : `${primary}10`,
            border: i < filled ? `2px solid ${accent}` : `2px dashed ${primary}25`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: i < filled ? "20px" : "12px",
            transition: "all 0.2s",
          }}>
            {i < filled ? icon : ""}
          </div>
        ))}
      </div>
      <div style={{ fontSize: "11px", color: primary, opacity: 0.6 }}>Reward: {reward}</div>
    </>
  );
}

function PointsContent({ logic, primary, secondary, accent }: { logic: any; primary: string; secondary: string; accent: string }) {
  const pointsLabel = logic?.pointsLabel || "Kyro Points";
  const pointsPerDollar = logic?.pointsPerDollar || 10;
  const tiers = logic?.rewardTiers || [];

  return (
    <>
      <div style={{ fontSize: "10px", fontWeight: 600, color: secondary, textTransform: "uppercase", letterSpacing: "0.5px" }}>{pointsLabel}</div>
      <div style={{ fontSize: "32px", fontWeight: 800, color: primary, lineHeight: 1.1, marginTop: "4px" }}>0</div>
      <div style={{ fontSize: "11px", color: primary, opacity: 0.5, marginTop: "4px" }}>Earn {pointsPerDollar} {pointsLabel.toLowerCase()} per $1 spent</div>
      {tiers.length > 0 && (
        <div style={{ marginTop: "12px" }}>
          <div style={{ fontSize: "10px", fontWeight: 600, color: secondary, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Rewards</div>
          {tiers.slice(0, 3).map((tier: { points: number; reward: string }, i: number) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: i < Math.min(tiers.length, 3) - 1 ? `1px solid ${primary}15` : "none" }}>
              <span style={{ fontSize: "11px", color: primary, opacity: 0.7 }}>{tier.reward}</span>
              <span style={{ fontSize: "10px", fontWeight: 700, color: accent, backgroundColor: `${accent}22`, padding: "2px 6px", borderRadius: "4px" }}>{tier.points} pts</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
