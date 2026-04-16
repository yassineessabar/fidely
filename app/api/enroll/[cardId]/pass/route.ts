import { createAdminClient } from "@/lib/supabase/admin";
import { generateApplePass } from "@/lib/wallet/apple";
import { enrollmentToPassTemplate } from "@/lib/wallet/generate";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  const supabase = createAdminClient();
  const { cardId } = params;
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code parameter" }, { status: 400 });
  }

  // Fetch enrollment
  const { data: enrollment, error: enrollError } = await supabase
    .from("card_enrollments" as any)
    .select("id, membership_code, customer_name, stamps_collected, points_balance, auth_token")
    .eq("membership_code", code)
    .eq("card_id", cardId)
    .single();

  if (enrollError || !enrollment) {
    return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
  }

  // Fetch card
  const { data: card, error: cardError } = await supabase
    .from("loyalty_cards")
    .select("id, type, business_details, branding, logic")
    .eq("id", cardId)
    .eq("status", "active" as any)
    .single();

  if (cardError || !card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const template = enrollmentToPassTemplate(card as any, enrollment as any);

  try {
    const buffer = await generateApplePass(template);
    const uint8 = new Uint8Array(buffer);
    return new Response(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Length": String(uint8.byteLength),
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.error("Pass generation failed:", err);
    return NextResponse.json({ error: "Pass generation failed" }, { status: 500 });
  }
}
