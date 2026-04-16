import { createAdminClient } from "@/lib/supabase/admin";
import { notifyPassUpdate } from "@/lib/wallet/apns";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { code: string } }
) {
  const supabase = createAdminClient();
  const { code } = params;

  const { data: enrollmentRaw, error } = await supabase
    .from("card_enrollments" as any)
    .select("id, card_id, customer_name, customer_email, membership_code, stamps_collected, points_balance, status, created_at")
    .eq("membership_code", code)
    .single();

  const enrollment = enrollmentRaw as any;

  if (error || !enrollment) {
    return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
  }

  const { data: card } = await supabase
    .from("loyalty_cards")
    .select("id, name, type, business_details, branding, logic")
    .eq("id", enrollment.card_id)
    .single();

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  return NextResponse.json({
    enrollment: {
      id: enrollment.id,
      customer_name: enrollment.customer_name,
      customer_email: enrollment.customer_email,
      membership_code: enrollment.membership_code,
      stamps_collected: enrollment.stamps_collected,
      points_balance: enrollment.points_balance,
      status: enrollment.status,
      created_at: enrollment.created_at,
    },
    card: {
      id: card.id,
      name: card.name,
      type: card.type,
      business_details: card.business_details,
      branding: card.branding,
      logic: card.logic,
    },
  });
}

export async function POST(
  request: Request,
  { params }: { params: { code: string } }
) {
  const supabase = createAdminClient();
  const { code } = params;

  let body: { action: string; amount?: number; pin?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { action, amount, pin } = body;

  if (!action) {
    return NextResponse.json({ error: "action is required" }, { status: 400 });
  }

  const { data: enrollmentRaw2, error: fetchError } = await supabase
    .from("card_enrollments" as any)
    .select("id, card_id, stamps_collected, points_balance, status")
    .eq("membership_code", code)
    .single();

  const enrollment = enrollmentRaw2 as any;

  if (fetchError || !enrollment) {
    return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
  }

  if (enrollment.status !== "active") {
    return NextResponse.json({ error: "Enrollment is not active" }, { status: 400 });
  }

  const { data: cardRaw, error: cardError } = await supabase
    .from("loyalty_cards")
    .select("*")
    .eq("id", enrollment.card_id)
    .single();

  const card = cardRaw as any;

  if (cardError || !card) {
    console.error("Card lookup failed:", cardError);
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  // Verify merchant PIN
  const merchantPin = card.merchant_pin || "0000";
  if (pin !== merchantPin) {
    return NextResponse.json({ error: "Invalid PIN" }, { status: 403 });
  }

  const logic = card.logic || {};

  if (action === "stamp" && card.type === "stamp") {
    const stampsToAdd = amount || 1;
    const newStamps = enrollment.stamps_collected + stampsToAdd;
    const totalStamps = logic.totalStamps || 10;

    const { error: updateError } = await supabase
      .from("card_enrollments" as any)
      .update({ stamps_collected: newStamps })
      .eq("id", enrollment.id);

    if (updateError) {
      return NextResponse.json({ error: "Failed to update stamps" }, { status: 500 });
    }

    // Notify Apple Wallet to update the pass
    notifyPassUpdate(enrollment.id, supabase).catch(console.error);

    return NextResponse.json({
      success: true,
      action: "stamp",
      stamps_collected: newStamps,
      total_stamps: totalStamps,
      reward_ready: newStamps >= totalStamps,
    });
  }

  if (action === "points" && card.type === "points") {
    const pointsToAdd = amount || (logic.pointsPerDollar || 10);
    const newPoints = enrollment.points_balance + pointsToAdd;

    const { error: updateError } = await supabase
      .from("card_enrollments" as any)
      .update({ points_balance: newPoints })
      .eq("id", enrollment.id);

    if (updateError) {
      return NextResponse.json({ error: "Failed to update points" }, { status: 500 });
    }

    // Notify Apple Wallet to update the pass
    notifyPassUpdate(enrollment.id, supabase).catch(console.error);

    return NextResponse.json({
      success: true,
      action: "points",
      points_balance: newPoints,
      points_added: pointsToAdd,
    });
  }

  if (action === "redeem") {
    if (card.type === "stamp") {
      const totalStamps = logic.totalStamps || 10;
      if (enrollment.stamps_collected < totalStamps) {
        return NextResponse.json({
          error: `Need ${totalStamps} stamps to redeem, currently have ${enrollment.stamps_collected}`,
        }, { status: 400 });
      }

      const { error: updateError } = await supabase
        .from("card_enrollments" as any)
        .update({ stamps_collected: 0 })
        .eq("id", enrollment.id);

      if (updateError) {
        return NextResponse.json({ error: "Failed to redeem" }, { status: 500 });
      }

      // Notify Apple Wallet to update the pass
      notifyPassUpdate(enrollment.id, supabase).catch(console.error);

      return NextResponse.json({
        success: true,
        action: "redeem",
        reward: logic.reward || "Free item",
        stamps_collected: 0,
      });
    }

    if (card.type === "points") {
      const pointsToRedeem = amount || 0;
      if (pointsToRedeem <= 0) {
        return NextResponse.json({ error: "Specify points amount to redeem" }, { status: 400 });
      }
      if (enrollment.points_balance < pointsToRedeem) {
        return NextResponse.json({
          error: `Insufficient points. Balance: ${enrollment.points_balance}, requested: ${pointsToRedeem}`,
        }, { status: 400 });
      }

      const newPoints = enrollment.points_balance - pointsToRedeem;

      const { error: updateError } = await supabase
        .from("card_enrollments" as any)
        .update({ points_balance: newPoints })
        .eq("id", enrollment.id);

      if (updateError) {
        return NextResponse.json({ error: "Failed to redeem" }, { status: 500 });
      }

      // Notify Apple Wallet to update the pass
      notifyPassUpdate(enrollment.id, supabase).catch(console.error);

      return NextResponse.json({
        success: true,
        action: "redeem",
        points_redeemed: pointsToRedeem,
        points_balance: newPoints,
      });
    }

    if (card.type === "coupon") {
      const { error: updateError } = await supabase
        .from("card_enrollments" as any)
        .update({ status: "redeemed" })
        .eq("id", enrollment.id);

      if (updateError) {
        return NextResponse.json({ error: "Failed to redeem" }, { status: 500 });
      }

      // Notify Apple Wallet to update the pass
      notifyPassUpdate(enrollment.id, supabase).catch(console.error);

      return NextResponse.json({
        success: true,
        action: "redeem",
        status: "redeemed",
      });
    }
  }

  return NextResponse.json({ error: `Invalid action '${action}' for card type '${card.type}'` }, { status: 400 });
}
