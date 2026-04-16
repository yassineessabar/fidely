import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import ScanActions from "./ScanActions";

export default async function ScanPage({ params }: { params: { code: string } }) {
  const supabase = createAdminClient();

  const { data: enrollmentRaw, error } = await supabase
    .from("card_enrollments" as any)
    .select("id, card_id, customer_name, customer_email, membership_code, stamps_collected, points_balance, status, created_at")
    .eq("membership_code", params.code)
    .single();

  const enrollment = enrollmentRaw as any;

  if (error || !enrollment) {
    notFound();
  }

  const { data: card } = await supabase
    .from("loyalty_cards")
    .select("id, name, type, business_details, branding, logic")
    .eq("id", enrollment.card_id)
    .single();

  if (!card) {
    notFound();
  }

  const br = (card as any).branding || {};
  const bd = (card as any).business_details || {};
  const bg = br.backgroundColor || "#0B051D";
  const primary = br.primaryColor || "#FFFFFF";
  const secondary = br.secondaryColor || "#E6FFA9";
  const accent = br.accentColor || "#6C47FF";
  const merchantName = bd.name || (card as any).name || "Merchant";

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
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        {br.logoUrl ? (
          <img
            src={br.logoUrl}
            alt={merchantName}
            style={{ width: "48px", height: "48px", borderRadius: "12px", objectFit: "cover", marginBottom: "12px" }}
          />
        ) : (
          <div
            style={{
              width: "48px", height: "48px", borderRadius: "12px", backgroundColor: accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "22px", fontWeight: 800, color: primary, margin: "0 auto 12px",
            }}
          >
            {merchantName.charAt(0).toUpperCase()}
          </div>
        )}
        <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: primary }}>{merchantName}</h1>
        <div style={{ fontSize: "13px", color: secondary, opacity: 0.7, marginTop: "4px" }}>
          Merchant Scanner
        </div>
      </div>

      {/* Scan actions */}
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <ScanActions enrollment={enrollment as any} card={card as any} />
      </div>

      {/* Footer */}
      <div style={{ marginTop: "48px", fontSize: "12px", color: primary, opacity: 0.25 }}>
        Powered by Kyro
      </div>
    </div>
  );
}
