import { verifyAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { id } = params;

  const [businessRes, profilesRes, locationsRes, customersRes, invoicesRes] =
    await Promise.all([
      supabase.from("businesses").select("*").eq("id", id).single(),
      supabase
        .from("profiles")
        .select("id, first_name, last_name, email, role, status, created_at")
        .eq("business_id", id)
        .order("created_at", { ascending: true }),
      supabase
        .from("locations")
        .select("id, name, address, city, status")
        .eq("business_id", id),
      supabase
        .from("customers")
        .select("id", { count: "exact", head: true })
        .eq("business_id", id),
      supabase
        .from("invoices")
        .select("id, amount, status, invoice_date, plan")
        .eq("business_id", id)
        .order("invoice_date", { ascending: false })
        .limit(10),
    ]);

  if (businessRes.error || !businessRes.data) {
    return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
  }

  return NextResponse.json({
    business: businessRes.data,
    team: profilesRes.data ?? [],
    locations: locationsRes.data ?? [],
    customerCount: customersRes.count ?? 0,
    recentInvoices: invoicesRes.data ?? [],
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { id } = params;
  const body = await request.json();

  const plan = body.plan;
  if (!plan || !["starter", "growth", "enterprise"].includes(plan)) {
    return NextResponse.json({ error: "Invalid or missing plan" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("businesses")
    .update({ plan: plan as any })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ business: data });
}
