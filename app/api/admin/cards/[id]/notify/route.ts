import { createAdminClient } from "@/lib/supabase/admin";
import { notifyPassUpdate } from "@/lib/wallet/apns";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createAdminClient();
  const cardId = params.id;

  let body: { title: string; message?: string; scheduled_at?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, message, scheduled_at } = body;
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  // Verify card exists
  const { data: card } = await supabase
    .from("loyalty_cards")
    .select("id")
    .eq("id", cardId)
    .single();

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  // If scheduled, save as pending
  if (scheduled_at) {
    const { data: notif, error } = await supabase
      .from("card_notifications" as any)
      .insert({
        card_id: cardId,
        type: "custom",
        title,
        message: message || null,
        scheduled_at,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to schedule" }, { status: 500 });
    }

    return NextResponse.json({ id: (notif as any).id, status: "pending" });
  }

  // Send immediately — get all enrollments for this card
  const { data: enrollments } = await supabase
    .from("card_enrollments" as any)
    .select("id")
    .eq("card_id", cardId)
    .eq("status", "active");

  const recipients = enrollments ? (enrollments as any[]).length : 0;

  // Send APNs push to all devices
  for (const enrollment of (enrollments || []) as any[]) {
    notifyPassUpdate(enrollment.id, supabase).catch(console.error);
  }

  // Save notification record
  const { data: notif, error } = await supabase
    .from("card_notifications" as any)
    .insert({
      card_id: cardId,
      type: "custom",
      title,
      message: message || null,
      sent_at: new Date().toISOString(),
      recipients,
      status: "sent",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to save notification" }, { status: 500 });
  }

  return NextResponse.json({ id: (notif as any).id, recipients, status: "sent" });
}
