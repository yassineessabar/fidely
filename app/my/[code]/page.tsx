import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const CATEGORY_STAMP_ICONS: Record<string, string> = {
  cafe: "☕", restaurant: "🍽", salon: "💇", barber: "✂️",
  gym: "💪", bakery: "🧁", retail: "🛍", other: "⭐",
};

export default async function MyCardPage({ params }: { params: { code: string } }) {
  const supabase = createAdminClient();
  const { code } = params;

  const { data: enrollment, error } = await supabase
    .from("card_enrollments" as any)
    .select("*")
    .eq("membership_code", code)
    .single();

  if (error || !enrollment) notFound();

  const e = enrollment as any;

  const { data: card } = await supabase
    .from("loyalty_cards")
    .select("id, type, name, business_details, branding, logic")
    .eq("id", e.card_id)
    .single();

  if (!card) notFound();

  const bd = (card as any).business_details || {};
  const br = (card as any).branding || {};
  const logic = (card as any).logic || {};
  const bg = br.backgroundColor || "#0B051D";
  const primary = br.primaryColor || "#FFFFFF";
  const secondary = br.secondaryColor || "#E6FFA9";
  const accent = br.accentColor || "#6C47FF";
  const merchantName = bd.name || (card as any).name || "Merchant";
  const stampIcon = CATEGORY_STAMP_ICONS[bd.category] || logic.stampIcon || "⭐";

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: bg,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "40px 20px", fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      {/* Merchant header */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        {br.logoUrl ? (
          <img src={br.logoUrl} alt={merchantName}
            style={{ width: "56px", height: "56px", borderRadius: "14px", objectFit: "cover", marginBottom: "12px" }} />
        ) : (
          <div style={{
            width: "56px", height: "56px", borderRadius: "14px", backgroundColor: accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "24px", fontWeight: 800, color: primary, margin: "0 auto 12px",
          }}>
            {merchantName.charAt(0).toUpperCase()}
          </div>
        )}
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: primary }}>{merchantName}</h1>
        {bd.tagline && (
          <p style={{ margin: "4px 0 0", fontSize: "14px", color: secondary, opacity: 0.8 }}>{bd.tagline}</p>
        )}
      </div>

      {/* Customer name */}
      <div style={{ fontSize: "15px", color: primary, opacity: 0.6, marginBottom: "24px" }}>
        Hi {e.customer_name}!
      </div>

      {/* Progress card */}
      <div style={{
        width: "100%", maxWidth: "400px", borderRadius: "16px",
        backgroundColor: `${primary}10`, border: `1px solid ${primary}20`,
        padding: "28px 24px", marginBottom: "24px", textAlign: "center",
      }}>
        {card.type === "stamp" && (
          <>
            <div style={{ fontSize: "12px", fontWeight: 600, color: secondary, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>
              Your Stamps
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
              {Array.from({ length: logic.totalStamps || 10 }).map((_: any, i: number) => (
                <div key={i} style={{
                  width: "44px", height: "44px", borderRadius: "50%",
                  backgroundColor: i < e.stamps_collected ? accent : `${primary}10`,
                  border: i < e.stamps_collected ? "none" : `2px dashed ${primary}20`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "20px",
                }}>
                  {i < e.stamps_collected ? stampIcon : ""}
                </div>
              ))}
            </div>
            <div style={{ fontSize: "32px", fontWeight: 800, color: primary, marginBottom: "4px" }}>
              {e.stamps_collected}/{logic.totalStamps || 10}
            </div>
            <div style={{ fontSize: "14px", color: primary, opacity: 0.5 }}>
              {logic.progressLabel || "collected"}
            </div>
            {e.stamps_collected >= (logic.totalStamps || 10) && (
              <div style={{
                marginTop: "16px", padding: "12px 20px", borderRadius: "12px",
                backgroundColor: "#22c55e20", border: "1px solid #22c55e40",
              }}>
                <div style={{ fontSize: "24px", marginBottom: "4px" }}>🎉</div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#4ade80" }}>Reward earned!</div>
                <div style={{ fontSize: "14px", color: primary, opacity: 0.7, marginTop: "4px" }}>{logic.reward || "Free item"}</div>
              </div>
            )}
            {e.stamps_collected < (logic.totalStamps || 10) && (
              <div style={{ marginTop: "16px", fontSize: "13px", color: primary, opacity: 0.5 }}>
                {(logic.totalStamps || 10) - e.stamps_collected} more to earn: {logic.reward || "Free item"}
              </div>
            )}
          </>
        )}

        {card.type === "points" && (
          <>
            <div style={{ fontSize: "12px", fontWeight: 600, color: secondary, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
              {logic.pointsLabel || "Points"}
            </div>
            <div style={{ fontSize: "56px", fontWeight: 800, color: primary, lineHeight: 1 }}>
              {e.points_balance}
            </div>
            <div style={{ fontSize: "14px", color: primary, opacity: 0.4, marginTop: "8px" }}>
              Earn {logic.pointsPerDollar || 10} pts per $1 spent
            </div>
            {(logic.rewardTiers || []).length > 0 && (
              <div style={{ marginTop: "20px", textAlign: "left" }}>
                <div style={{ fontSize: "11px", fontWeight: 600, color: secondary, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Rewards</div>
                {(logic.rewardTiers || []).map((tier: any, i: number) => {
                  const earned = e.points_balance >= tier.points;
                  return (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "10px 0", borderBottom: `1px solid ${primary}10`,
                    }}>
                      <span style={{ fontSize: "14px", color: primary, opacity: earned ? 1 : 0.5 }}>
                        {earned ? "✓ " : ""}{tier.reward}
                      </span>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: earned ? "#4ade80" : accent }}>
                        {tier.points} pts
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {card.type === "coupon" && (
          <>
            <div style={{
              fontSize: "18px", fontWeight: 700, marginBottom: "8px",
              color: e.status === "redeemed" ? "#ff6b6b" : "#4ade80",
            }}>
              {e.status === "redeemed" ? "Redeemed" : "Active"}
            </div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: primary }}>
              {logic.offerTitle || "Special Offer"}
            </div>
            {logic.offerDescription && (
              <div style={{ fontSize: "14px", color: primary, opacity: 0.6, marginTop: "8px" }}>
                {logic.offerDescription}
              </div>
            )}
          </>
        )}
      </div>

      {/* Membership info */}
      <div style={{ fontSize: "12px", color: primary, opacity: 0.3, textAlign: "center" }}>
        {e.membership_code} · Member since {new Date(e.created_at).toLocaleDateString("en-AU", { month: "short", year: "numeric" })}
      </div>

      <div style={{ marginTop: "48px", fontSize: "12px", color: primary, opacity: 0.2 }}>
        Powered by Kyro
      </div>
    </div>
  );
}
