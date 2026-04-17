import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import EnrollForm from "./EnrollForm";

export const dynamic = "force-dynamic";

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
    .select("id, type, name, status, business_details, branding, logic")
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
  const merchantName = bd.name || (c as any).name || "Merchant";
  const bannerUrl = br.heroImageUrl || null;
  const logoUrl = br.logoUrl || null;

  const typeLabels: Record<string, string> = {
    coupon: "Coupon",
    stamp: "Stamp Card",
    points: "Points Card",
  };

  const totalStamps = logic.totalStamps || 10;
  const reward = logic.reward || "Free item";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: bg,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Banner hero section */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: bannerUrl ? "220px" : "140px",
          overflow: "hidden",
        }}
      >
        {bannerUrl ? (
          <>
            <img
              src={bannerUrl}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {/* Gradient overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(to bottom, ${bg}00 0%, ${bg}40 40%, ${bg}CC 80%, ${bg} 100%)`,
              }}
            />
          </>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `linear-gradient(135deg, ${accent}40 0%, ${bg} 100%)`,
            }}
          />
        )}
      </div>

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 20px 40px",
          marginTop: bannerUrl ? "-60px" : "-40px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo + name row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "4px",
          }}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={merchantName}
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                objectFit: "cover",
                border: `3px solid ${bg}`,
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                backgroundColor: bg,
                flexShrink: 0,
              }}
            />
          ) : (
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                backgroundColor: accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: 800,
                color: "#fff",
                border: `3px solid ${bg}`,
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                flexShrink: 0,
              }}
            >
              {merchantName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: 700,
                color: primary,
              }}
            >
              {merchantName}
            </h1>
            {bd.tagline && (
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "14px",
                  color: secondary,
                  opacity: 0.8,
                }}
              >
                {bd.tagline}
              </p>
            )}
          </div>
        </div>

        {/* Form card */}
        <div
          style={{
            marginTop: "28px",
            width: "100%",
            maxWidth: "400px",
            borderRadius: "20px",
            backgroundColor: `${primary}08`,
            border: `1px solid ${primary}12`,
            padding: "28px 24px",
          }}
        >
          <EnrollForm
            cardId={c.id}
            backgroundColor={bg}
            primaryColor={primary}
            secondaryColor={secondary}
            accentColor={accent}
          />
        </div>

        {/* Footer */}
        <div style={{ marginTop: "40px", fontSize: "12px", color: primary, opacity: 0.2 }}>
          Powered by Kyro
        </div>
      </div>
    </div>
  );
}
