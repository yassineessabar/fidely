import { createAdminClient } from "@/lib/supabase/admin";
import { generateApplePass } from "@/lib/wallet/apple";
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

  try {
    const buffer = await generateApplePass(template);
    return new NextResponse(buffer as any, {
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": `attachment; filename="${template.merchantName.replace(/[^a-zA-Z0-9]/g, "_")}.pkpass"`,
      },
    });
  } catch (err: any) {
    console.error("Apple pass generation failed:", err);
    return NextResponse.json(
      { error: "Pass generation failed. Certificates may not be configured." },
      { status: 500 }
    );
  }
}
