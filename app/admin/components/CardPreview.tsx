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

      {/* QR placeholder */}
      <div style={{ display: "flex", justifyContent: "center", padding: "8px 20px 12px" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "8px", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "4px", background: "repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 8px 8px" }} />
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
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(total, 5)}, 1fr)`, gap: "6px", marginBottom: "10px" }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            width: "100%", aspectRatio: "1", borderRadius: "50%",
            backgroundColor: i < filled ? accent : `${primary}15`,
            border: i < filled ? "none" : `1.5px dashed ${primary}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: i < filled ? "14px" : "10px",
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
