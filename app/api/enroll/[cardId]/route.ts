import { createAdminClient } from "@/lib/supabase/admin";
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
    .select("id")
    .eq("id", cardId)
    .eq("status", "active" as any)
    .single();

  if (cardError || !card) {
    return NextResponse.json({ error: "Card not found or not active" }, { status: 404 });
  }

  // Check if already enrolled
  const { data: existing } = await supabase
    .from("card_enrollments" as any)
    .select("membership_code")
    .eq("card_id", cardId)
    .eq("customer_email", email.toLowerCase().trim())
    .single();

  if (existing) {
    return NextResponse.json({ membership_code: (existing as any).membership_code });
  }

  // Create new enrollment
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
    .select("membership_code")
    .single();

  if (insertError || !newEnrollment) {
    console.error("Enrollment insert failed:", insertError);
    return NextResponse.json({ error: "Failed to create enrollment" }, { status: 500 });
  }

  return NextResponse.json({ membership_code: (newEnrollment as any).membership_code });
}
