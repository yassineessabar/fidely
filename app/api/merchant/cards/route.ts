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

  const { data: cards } = await admin
    .from("loyalty_cards")
    .select("id, name, type, status, business_details, branding, logic, share_url, created_at")
    .eq("business_id", profile.business_id)
    .order("created_at", { ascending: false });

  // Get enrollment counts per card
  const cardsWithStats = await Promise.all(
    ((cards || []) as any[]).map(async (card) => {
      const { count } = await admin
        .from("card_enrollments" as any)
        .select("id", { count: "exact", head: true })
        .eq("card_id", card.id);

      return {
        ...card,
        enrollmentCount: count || 0,
      };
    })
  );

  return NextResponse.json({ cards: cardsWithStats });
}
