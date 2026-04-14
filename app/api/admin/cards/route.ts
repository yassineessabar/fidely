import { verifyAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const supabase = createAdminClient();

  let query = supabase
    .from("loyalty_cards")
    .select("id, name, type, status, business_id, created_at, businesses(name)")
    .order("created_at", { ascending: false });

  if (status && ["draft", "active", "archived"].includes(status)) {
    query = query.eq("status", status as any);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const cards = (data ?? []).map((card: any) => ({
    id: card.id,
    name: card.name,
    type: card.type,
    status: card.status,
    business_id: card.business_id,
    business_name: card.businesses?.name ?? "Unknown",
    created_at: card.created_at,
  }));

  return NextResponse.json({ cards });
}

export async function POST(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { business_id, type, name, business_details, branding, logic } = body;

  if (!business_id || !type || !name) {
    return NextResponse.json(
      { error: "business_id, type, and name are required" },
      { status: 400 }
    );
  }

  if (!["coupon", "stamp", "points"].includes(type)) {
    return NextResponse.json({ error: "Invalid card type" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("loyalty_cards")
    .insert({
      business_id,
      type,
      name,
      business_details: business_details ?? {},
      branding: branding ?? {},
      logic: logic ?? {},
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ card: data }, { status: 201 });
}
