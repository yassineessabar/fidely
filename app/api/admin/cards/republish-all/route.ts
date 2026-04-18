import { verifyAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import QRCode from "qrcode";

// Re-publishes all active cards with the correct URL (fixes localhost URLs)
export async function POST(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;

  const { data: cards } = await supabase
    .from("loyalty_cards")
    .select("id")
    .eq("status", "active" as any);

  if (!cards || cards.length === 0) {
    return NextResponse.json({ message: "No active cards to republish" });
  }

  let updated = 0;
  for (const card of cards) {
    const shareUrl = `${origin}/c/${card.id}`;
    let qrCodeData = "";
    try {
      qrCodeData = await QRCode.toDataURL(shareUrl, {
        width: 300, margin: 2,
        color: { dark: "#0B051D", light: "#FFFFFF" },
      });
    } catch {}

    await supabase
      .from("loyalty_cards")
      .update({ share_url: shareUrl, qr_code_data: qrCodeData } as any)
      .eq("id", card.id);
    updated++;
  }

  return NextResponse.json({ success: true, updated, origin });
}
