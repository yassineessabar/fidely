import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import WalletButton from "./WalletButton";

type Card = {
  id: string;
  type: "coupon" | "stamp" | "points";
  status: string;
  business_details: any;
  branding: any;
  logic: any;
};

export default async function PublicCardPage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient();
  const { data: card, error } = await supabase
    .from("loyalty_cards")
    .select("id, type, status, business_details, branding, logic")
    .eq("id", params.id)
    .eq("status", "active" as any)
    .single();

  if (error || !card) {
    notFound();
  }

  const c = card as Card;
  const bd = c.business_details || {};
  const br = c.branding || {};
  const logic = c.logic || {};
  const bg = br.backgroundColor || "#0B051D";
  const primary = br.primaryColor || "#FFFFFF";
  const secondary = br.secondaryColor || "#E6FFA9";
  const accent = br.accentColor || "#6C47FF";
  const merchantName = bd.name || "Merchant";

  const typeLabels: Record<string, string> = {
    coupon: "Coupon",
    stamp: "Stamp Card",
    points: "Points Card",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Logo + merchant name */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        {br.logoUrl ? (
          <img
            src={br.logoUrl}
            alt={merchantName}
            style={{ width: "64px", height: "64px", borderRadius: "16px", objectFit: "cover", marginBottom: "16px" }}
          />
        ) : (
          <div
            style={{
              width: "64px", height: "64px", borderRadius: "16px", backgroundColor: accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "28px", fontWeight: 800, color: primary, margin: "0 auto 16px",
            }}
          >
            {merchantName.charAt(0).toUpperCase()}
          </div>
        )}
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 700, color: primary }}>{merchantName}</h1>
        {bd.tagline && (
          <p style={{ margin: "8px 0 0", fontSize: "16px", color: secondary, opacity: 0.8 }}>{bd.tagline}</p>
        )}
      </div>

      {/* Card type badge */}
      <div
        style={{
          display: "inline-block", padding: "6px 16px", borderRadius: "100px",
          backgroundColor: `${accent}33`, color: secondary,
          fontSize: "13px", fontWeight: 600, marginBottom: "24px",
          textTransform: "uppercase", letterSpacing: "0.5px",
        }}
      >
        {typeLabels[c.type] || c.type}
      </div>

      {/* Card content */}
      <div
        style={{
          width: "100%", maxWidth: "400px", borderRadius: "16px",
          backgroundColor: `${primary}10`, border: `1px solid ${primary}20`,
          padding: "24px", marginBottom: "32px",
        }}
      >
        {c.type === "coupon" && (
          <>
            <div style={{ fontSize: "24px", fontWeight: 800, color: primary, marginBottom: "8px" }}>
              {logic.offerTitle || "Special Offer"}
            </div>
            {logic.offerDescription && (
              <p style={{ fontSize: "15px", color: primary, opacity: 0.7, margin: "0 0 12px" }}>{logic.offerDescription}</p>
            )}
            {logic.expiryDate && (
              <div style={{ fontSize: "13px", color: secondary, fontWeight: 600 }}>
                Valid until {new Date(logic.expiryDate).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            )}
          </>
        )}
        {c.type === "stamp" && (
          <>
            <div style={{ fontSize: "14px", fontWeight: 600, color: secondary, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Collect {logic.totalStamps || 10} {logic.progressLabel || "stamps"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(logic.totalStamps || 10, 5)}, 1fr)`, gap: "8px", marginBottom: "16px" }}>
              {Array.from({ length: logic.totalStamps || 10 }).map((_, i) => (
                <div key={i} style={{
                  aspectRatio: "1", borderRadius: "50%", border: `2px dashed ${primary}30`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
                }}>
                  {logic.stampIcon || "\u2615"}
                </div>
              ))}
            </div>
            <div style={{ fontSize: "14px", color: primary, opacity: 0.7 }}>
              Reward: {logic.reward || "Free item"}
            </div>
          </>
        )}
        {c.type === "points" && (
          <>
            <div style={{ fontSize: "12px", fontWeight: 600, color: secondary, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {logic.pointsLabel || "Kyro Points"}
            </div>
            <div style={{ fontSize: "40px", fontWeight: 800, color: primary, margin: "8px 0" }}>0</div>
            <div style={{ fontSize: "14px", color: primary, opacity: 0.5, marginBottom: "16px" }}>
              Earn {logic.pointsPerDollar || 10} points per $1 spent
            </div>
            {(logic.rewardTiers || []).length > 0 && (
              <div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: secondary, marginBottom: "8px", textTransform: "uppercase" }}>Rewards</div>
                {(logic.rewardTiers || []).map((tier: any, i: number) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${primary}10` }}>
                    <span style={{ fontSize: "14px", color: primary, opacity: 0.7 }}>{tier.reward}</span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: accent }}>{tier.points} pts</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Welcome offer */}
      {bd.welcomeOffer && (
        <div
          style={{
            width: "100%", maxWidth: "400px", padding: "16px 20px", borderRadius: "12px",
            backgroundColor: `${secondary}15`, border: `1px solid ${secondary}30`, marginBottom: "32px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 700, color: secondary, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Welcome Offer</div>
          <div style={{ fontSize: "16px", fontWeight: 600, color: primary }}>{bd.welcomeOffer}</div>
        </div>
      )}

      {/* Add to Wallet — auto-detects Apple vs Google */}
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <WalletButton cardId={c.id} backgroundColor={bg} primaryColor={primary} />
      </div>

      {/* Footer */}
      <div style={{ marginTop: "48px", fontSize: "12px", color: primary, opacity: 0.25 }}>
        Powered by Kyro
      </div>
    </div>
  );
}
