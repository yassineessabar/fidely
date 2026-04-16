import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, ADMIN_EMAIL } from "@/lib/email";
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
    .select("id, name, type, business_details")
    .eq("id", cardId)
    .eq("status", "active" as any)
    .single();

  if (cardError || !card) {
    return NextResponse.json({ error: "Card not found or not active" }, { status: 404 });
  }

  const bd = (card as any).business_details || {};
  const merchantName = bd.name || (card as any).name || "Merchant";
  const cardType = (card as any).type || "loyalty";

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
      auth_token: crypto.randomUUID(),
    })
    .select("membership_code, auth_token")
    .single();

  if (insertError || !newEnrollment) {
    console.error("Enrollment insert failed:", insertError);
    return NextResponse.json({ error: "Failed to create enrollment" }, { status: 500 });
  }

  const membershipCode = (newEnrollment as any).membership_code;

  // Send emails (non-blocking)
  const customerEmail = email.toLowerCase().trim();
  const customerName = name.trim();

  // 1. Admin notification
  sendEmail({
    to: ADMIN_EMAIL,
    subject: `New customer signup: ${customerName} → ${merchantName}`,
    html: `
    <div style="font-family:sans-serif;max-width:500px;">
      <h2 style="color:#0b051d;">New Customer Enrollment</h2>
      <table style="border-collapse:collapse;">
        <tr><td style="padding:8px;font-weight:bold;">Customer</td><td style="padding:8px;">${customerName}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;">${customerEmail}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Phone</td><td style="padding:8px;">${phone}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">DOB</td><td style="padding:8px;">${dob}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Merchant</td><td style="padding:8px;">${merchantName}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Card Type</td><td style="padding:8px;">${cardType}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Membership</td><td style="padding:8px;">${membershipCode}</td></tr>
      </table>
    </div>
    `,
  });

  // 2. Welcome email to customer
  sendEmail({
    to: customerEmail,
    subject: `Welcome to ${merchantName}! Your loyalty card is ready`,
    html: `
    <div style="font-family:sans-serif;max-width:500px;">
      <h2 style="color:#0b051d;">Welcome, ${customerName}!</h2>
      <p>You've been enrolled in <strong>${merchantName}</strong>'s loyalty program.</p>
      <p>Your membership code is: <strong>${membershipCode}</strong></p>
      <p>Add the card to your Apple Wallet and start earning rewards on every visit.</p>
      <p style="color:#61605f;font-size:13px;margin-top:32px;">— The Kyro Team</p>
    </div>
    `,
  });

  return NextResponse.json({ membership_code: membershipCode });
}
