import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

async function verifyMerchant() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("business_id")
    .eq("id", user.id)
    .single();

  if (!profile?.business_id) return null;
  return { userId: user.id, businessId: profile.business_id };
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const merchant = await verifyMerchant();
  if (!merchant) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data: card, error } = await admin
    .from("loyalty_cards")
    .select("*")
    .eq("id", params.id)
    .eq("business_id", merchant.businessId)
    .single();

  if (error || !card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  return NextResponse.json({ card });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const merchant = await verifyMerchant();
  if (!merchant) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();

  // Verify card belongs to merchant
  const { data: existing } = await admin
    .from("loyalty_cards")
    .select("id")
    .eq("id", params.id)
    .eq("business_id", merchant.businessId)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const updates: any = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.type !== undefined) updates.type = body.type;
  if (body.merchant_pin !== undefined) updates.merchant_pin = body.merchant_pin;
  if (body.business_details !== undefined) updates.business_details = body.business_details;
  if (body.branding !== undefined) updates.branding = body.branding;
  if (body.logic !== undefined) updates.logic = body.logic;

  const { data: card, error } = await admin
    .from("loyalty_cards")
    .update(updates)
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }

  return NextResponse.json({ card });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const merchant = await verifyMerchant();
  if (!merchant) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();

  // Verify card belongs to merchant
  const { data: existing } = await admin
    .from("loyalty_cards")
    .select("id")
    .eq("id", params.id)
    .eq("business_id", merchant.businessId)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const { error } = await admin
    .from("loyalty_cards")
    .delete()
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
