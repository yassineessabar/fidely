import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("business_id")
    .eq("id", user.id)
    .single();
  if (!profile?.business_id) return NextResponse.json({ error: "No business" }, { status: 403 });

  // Get merchant's card IDs
  const { data: cards } = await admin
    .from("loyalty_cards")
    .select("id, name, type")
    .eq("business_id", profile.business_id);

  const cardIds = (cards || []).map((c: any) => c.id);
  if (cardIds.length === 0) {
    return NextResponse.json({ customers: [] });
  }

  // Get all enrollments for merchant's cards
  const { data: enrollments } = await admin
    .from("card_enrollments" as any)
    .select("id, card_id, customer_name, customer_email, customer_phone, stamps_collected, points_balance, status, created_at")
    .in("card_id", cardIds)
    .order("created_at", { ascending: false })
    .limit(200);

  // Map card names
  const cardMap = Object.fromEntries((cards || []).map((c: any) => [c.id, { name: c.name, type: c.type }]));

  const customers = ((enrollments || []) as any[]).map((e) => ({
    id: e.id,
    name: e.customer_name,
    email: e.customer_email,
    phone: e.customer_phone,
    stamps: e.stamps_collected,
    points: e.points_balance,
    status: e.status,
    cardName: cardMap[e.card_id]?.name || "Unknown",
    cardType: cardMap[e.card_id]?.type || "stamp",
    joinedAt: e.created_at,
  }));

  return NextResponse.json({ customers });
}
