import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyPassUpdate } from "@/lib/wallet/apns";
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
    .select("id, name")
    .eq("business_id", profile.business_id);

  const cardIds = (cards || []).map((c: any) => c.id);
  if (cardIds.length === 0) {
    return NextResponse.json({ notifications: [], cards: [] });
  }

  const cardMap = Object.fromEntries((cards || []).map((c: any) => [c.id, c.name]));

  // Get all notifications for merchant's cards
  const { data: notifications } = await admin
    .from("card_notifications" as any)
    .select("*")
    .in("card_id", cardIds)
    .order("created_at", { ascending: false })
    .limit(50);

  const enriched = ((notifications || []) as any[]).map((n) => ({
    ...n,
    card_name: cardMap[n.card_id] || "Unknown",
  }));

  return NextResponse.json({
    notifications: enriched,
    cards: (cards || []).map((c: any) => ({ id: c.id, name: c.name })),
  });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const adminDb = createAdminClient();
  const { data: profile } = await adminDb
    .from("profiles")
    .select("business_id")
    .eq("id", user.id)
    .single();
  if (!profile?.business_id) return NextResponse.json({ error: "No business" }, { status: 403 });

  let body: { title: string; message?: string; card_id?: string; scheduled_at?: string; campaign_type?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, message, card_id, scheduled_at, campaign_type } = body;
  const notifType = campaign_type === "birthday" ? "birthday" : "custom";
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Get merchant's cards (or specific card)
  let cardQuery = admin
    .from("loyalty_cards")
    .select("id")
    .eq("business_id", profile.business_id)
    .eq("status", "active" as any);

  if (card_id) {
    cardQuery = cardQuery.eq("id", card_id);
  }

  const { data: cards } = await cardQuery;
  if (!cards || cards.length === 0) {
    return NextResponse.json({ error: "No active cards found" }, { status: 404 });
  }

  const cardIds = cards.map((c: any) => c.id);

  // If scheduled, save as pending for each card
  if (scheduled_at) {
    for (const cid of cardIds) {
      await admin.from("card_notifications" as any).insert({
        card_id: cid,
        type: notifType as any,
        title,
        message: message || null,
        scheduled_at,
        status: "pending",
      });
    }
    return NextResponse.json({ status: "scheduled", cards: cardIds.length });
  }

  // Send immediately
  let totalRecipients = 0;

  for (const cid of cardIds) {
    const { data: enrollments } = await admin
      .from("card_enrollments" as any)
      .select("id")
      .eq("card_id", cid)
      .eq("status", "active");

    const recipients = enrollments ? (enrollments as any[]).length : 0;
    totalRecipients += recipients;

    for (const e of (enrollments || []) as any[]) {
      notifyPassUpdate(e.id, admin).catch(console.error);
    }

    await admin.from("card_notifications" as any).insert({
      card_id: cid,
      type: notifType as any,
      title,
      message: message || null,
      sent_at: new Date().toISOString(),
      recipients,
      status: "sent",
    });
  }

  return NextResponse.json({ status: "sent", recipients: totalRecipients });
}
