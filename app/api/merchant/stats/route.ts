import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("business_id")
    .eq("id", user.id)
    .single();
  if (!profile?.business_id) return NextResponse.json({ error: "No business" }, { status: 403 });

  const admin = createAdminClient();
  const businessId = profile.business_id;

  // Get merchant's cards
  const { data: cards } = await admin
    .from("loyalty_cards")
    .select("id, type, name, status, created_at")
    .eq("business_id", businessId);

  const cardIds = (cards || []).map((c: any) => c.id);
  const activeCards = (cards || []).filter((c: any) => c.status === "active").length;

  // Get total enrollments across all cards
  let totalCustomers = 0;
  let activeCustomers = 0;
  if (cardIds.length > 0) {
    const { count: total } = await admin
      .from("card_enrollments" as any)
      .select("id", { count: "exact", head: true })
      .in("card_id", cardIds);
    totalCustomers = total || 0;

    const { count: active } = await admin
      .from("card_enrollments" as any)
      .select("id", { count: "exact", head: true })
      .in("card_id", cardIds)
      .eq("status", "active");
    activeCustomers = active || 0;
  }

  // Get total notifications sent
  let notificationsSent = 0;
  if (cardIds.length > 0) {
    const { count } = await admin
      .from("card_notifications" as any)
      .select("id", { count: "exact", head: true })
      .in("card_id", cardIds)
      .eq("status", "sent");
    notificationsSent = count || 0;
  }

  return NextResponse.json({
    totalCustomers,
    activeCustomers,
    activeCards,
    totalCards: (cards || []).length,
    notificationsSent,
  });
}
