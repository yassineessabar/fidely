import { createAdminClient } from "@/lib/supabase/admin";
import { notifyPassUpdate } from "@/lib/wallet/apns";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const now = new Date();
  const todayMonth = now.getMonth() + 1;
  const todayDay = now.getDate();
  let birthdayCount = 0;
  let expiryCount = 0;
  let customCount = 0;

  // ── 1. Birthday campaigns ──
  const { data: cards } = await supabase
    .from("loyalty_cards")
    .select("id, type, logic")
    .eq("status", "active" as any);

  for (const card of (cards || []) as any[]) {
    const logic = card.logic || {};
    if (!logic.birthdayEnabled) continue;

    const { data: enrollments } = await supabase
      .from("card_enrollments" as any)
      .select("id, customer_name, customer_dob, stamps_collected, points_balance")
      .eq("card_id", card.id)
      .eq("status", "active");

    for (const e of (enrollments || []) as any[]) {
      if (!e.customer_dob) continue;
      const dob = new Date(e.customer_dob);
      if (dob.getMonth() + 1 !== todayMonth || dob.getDate() !== todayDay) continue;

      // Apply birthday reward
      if (logic.birthdayRewardType === "stamp" && card.type === "stamp") {
        const totalStamps = logic.totalStamps || 10;
        const newStamps = Math.min(e.stamps_collected + 1, totalStamps);
        await supabase
          .from("card_enrollments" as any)
          .update({ stamps_collected: newStamps })
          .eq("id", e.id);
      } else if (logic.birthdayRewardType === "points" && card.type === "points") {
        const bonusPoints = logic.birthdayPointsAmount || 50;
        await supabase
          .from("card_enrollments" as any)
          .update({ points_balance: e.points_balance + bonusPoints })
          .eq("id", e.id);
      }

      await notifyPassUpdate(e.id, supabase).catch(console.error);
      birthdayCount++;
    }
  }

  // ── 2. Expiry reminders (7 days before) ──
  const expiryCheckDate = new Date(now);
  expiryCheckDate.setDate(expiryCheckDate.getDate() - 358);
  const expiryStart = new Date(expiryCheckDate);
  expiryStart.setHours(0, 0, 0, 0);
  const expiryEnd = new Date(expiryCheckDate);
  expiryEnd.setHours(23, 59, 59, 999);

  const { data: expiringEnrollments } = await supabase
    .from("card_enrollments" as any)
    .select("id")
    .eq("status", "active")
    .gte("created_at", expiryStart.toISOString())
    .lte("created_at", expiryEnd.toISOString());

  for (const e of (expiringEnrollments || []) as any[]) {
    await notifyPassUpdate(e.id, supabase).catch(console.error);
    expiryCount++;
  }

  // ── 3. Scheduled custom notifications ──
  const { data: pendingNotifs } = await supabase
    .from("card_notifications" as any)
    .select("*")
    .eq("status", "pending")
    .lte("scheduled_at", now.toISOString());

  for (const notif of (pendingNotifs || []) as any[]) {
    const { data: enrollments } = await supabase
      .from("card_enrollments" as any)
      .select("id")
      .eq("card_id", notif.card_id)
      .eq("status", "active");

    const recipients = enrollments ? (enrollments as any[]).length : 0;

    for (const e of (enrollments || []) as any[]) {
      await notifyPassUpdate(e.id, supabase).catch(console.error);
    }

    await supabase
      .from("card_notifications" as any)
      .update({ status: "sent", sent_at: now.toISOString(), recipients })
      .eq("id", notif.id);

    customCount++;
  }

  return NextResponse.json({
    ok: true,
    birthday: birthdayCount,
    expiry: expiryCount,
    custom: customCount,
  });
}
