import { verifyAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { id } = params;

  // Verify card exists
  const { data: card, error: fetchError } = await supabase
    .from("loyalty_cards")
    .select("id, status")
    .eq("id", id)
    .single();

  if (fetchError || !card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  // Generate share URL
  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const shareUrl = `${origin}/c/${id}`;

  // Generate QR code as data URL
  let qrCodeData = "";
  try {
    qrCodeData = await QRCode.toDataURL(shareUrl, {
      width: 300,
      margin: 2,
      color: { dark: "#0B051D", light: "#FFFFFF" },
    });
  } catch (err) {
    console.error("QR generation failed:", err);
  }

  // Update card status + share URL + QR
  const { error: updateError } = await supabase
    .from("loyalty_cards")
    .update({
      status: "active" as any,
      share_url: shareUrl,
      qr_code_data: qrCodeData,
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ shareUrl, qrCodeData });
}
