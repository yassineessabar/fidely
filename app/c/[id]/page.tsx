import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";

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

      {/* Add to Wallet buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: "400px" }}>
        <a
          href={`/api/wallet/apple/card/${c.id}`}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            padding: "16px", borderRadius: "12px", backgroundColor: "#000",
            color: "#fff", textDecoration: "none", fontSize: "16px", fontWeight: 600,
          }}
        >
          <svg width="20" height="24" viewBox="0 0 814 1000" fill="white">
            <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.7C46 792.2 0 605.2 0 427c0-171.1 111.1-261.7 220.4-261.7 58 0 106.3 38.2 142.6 38.2 34.5 0 88.1-40.5 155.5-40.5 25.3 0 114.8 1.3 173.6 98z"/>
          </svg>
          Add to Apple Wallet
        </a>
        <button
          id="google-wallet-btn"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            padding: "16px", borderRadius: "12px", backgroundColor: "#fff", border: `1px solid ${primary}20`,
            color: bg, fontSize: "16px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Add to Google Wallet
        </button>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "48px", fontSize: "12px", color: primary, opacity: 0.25 }}>
        Powered by Kyro
      </div>

      {/* Client-side script for Google Wallet button */}
      <script dangerouslySetInnerHTML={{ __html: `
        document.getElementById('google-wallet-btn').addEventListener('click', async function() {
          try {
            const res = await fetch('/api/wallet/google/card/${c.id}');
            const data = await res.json();
            if (data.url) window.open(data.url, '_blank');
            else alert('Google Wallet is not configured yet.');
          } catch(e) { alert('Failed to generate Google Wallet pass.'); }
        });
      `}} />
    </div>
  );
}
