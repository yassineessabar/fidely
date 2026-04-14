import { createAdminClient } from "@/lib/supabase/admin";
import { generateGoogleWalletUrl } from "@/lib/wallet/google";
import { cardToPassTemplate } from "@/lib/wallet/generate";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createAdminClient();
  const { id } = params;

  const { data: card, error } = await supabase
    .from("loyalty_cards")
    .select("id, type, business_details, branding, logic")
    .eq("id", id)
    .eq("status", "active" as any)
    .single();

  if (error || !card) {
    return NextResponse.json({ error: "Card not found or not active" }, { status: 404 });
  }

  const template = cardToPassTemplate(card as any);
  const origin = new URL(request.url).origin;

  try {
    const url = generateGoogleWalletUrl(template, origin);
    return NextResponse.json({ url });
  } catch (err: any) {
    console.error("Google Wallet URL generation failed:", err);
    return NextResponse.json(
      { error: "Google Wallet generation failed. Credentials may not be configured." },
      { status: 500 }
    );
  }
}
