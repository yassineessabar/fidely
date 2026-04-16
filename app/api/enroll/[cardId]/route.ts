import { createAdminClient } from "@/lib/supabase/admin";
import { generateApplePass } from "@/lib/wallet/apple";
import { enrollmentToPassTemplate } from "@/lib/wallet/generate";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { cardId: string } }
) {
  const supabase = createAdminClient();
  const { cardId } = params;

  let body: { name: string; email: string; phone: string; dob: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, phone, dob } = body;
  if (!name || !email || !phone || !dob) {
    return NextResponse.json(
      { error: "All fields required: name, email, phone, dob" },
      { status: 400 }
    );
  }

  const { data: card, error: cardError } = await supabase
    .from("loyalty_cards")
    .select("id, type, business_details, branding, logic")
    .eq("id", cardId)
    .eq("status", "active" as any)
    .single();

  if (cardError || !card) {
    return NextResponse.json({ error: "Card not found or not active" }, { status: 404 });
  }

  const { data: existing } = await supabase
    .from("card_enrollments" as any)
    .select("id, membership_code, customer_name, stamps_collected, points_balance")
    .eq("card_id", cardId)
    .eq("customer_email", email.toLowerCase().trim())
    .single();

  let enrollment: {
    id: string;
    membership_code: string;
    customer_name: string;
    stamps_collected: number;
    points_balance: number;
  };

  if (existing) {
    enrollment = existing as any;
  } else {
    const { data: newEnrollment, error: insertError } = await supabase
      .from("card_enrollments" as any)
      .insert({
        card_id: cardId,
        customer_name: name.trim(),
        customer_email: email.toLowerCase().trim(),
        customer_phone: phone.trim(),
        customer_dob: dob,
        membership_code: `KYRO-MBR-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        stamps_collected: 0,
        points_balance: 0,
        status: "active",
      })
      .select("id, membership_code, customer_name, stamps_collected, points_balance")
      .single();

    if (insertError || !newEnrollment) {
      console.error("Enrollment insert failed:", insertError);
      return NextResponse.json({ error: "Failed to create enrollment" }, { status: 500 });
    }

    enrollment = newEnrollment as any;
  }

  const template = enrollmentToPassTemplate(card as any, enrollment);

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
    return NextResponse.json(
      { error: "Pass generation failed" },
      { status: 500 }
    );
  }
}
