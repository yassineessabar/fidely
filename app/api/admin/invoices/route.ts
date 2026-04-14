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
    .from("invoices")
    .select("id, business_id, amount, currency, plan, status, invoice_date, created_at")
    .order("invoice_date", { ascending: false });

  if (status && ["paid", "pending", "failed"].includes(status)) {
    query = query.eq("status", status as any);
  }

  const { data: invoices, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch business names for all unique business_ids
  const businessIds = [...new Set((invoices ?? []).map((inv) => inv.business_id))];
  let businessMap: Record<string, string> = {};

  if (businessIds.length > 0) {
    const { data: businesses } = await supabase
      .from("businesses")
      .select("id, name")
      .in("id", businessIds);

    businessMap = (businesses ?? []).reduce(
      (acc, b) => ({ ...acc, [b.id]: b.name }),
      {} as Record<string, string>
    );
  }

  const enriched = (invoices ?? []).map((inv) => ({
    ...inv,
    business_name: businessMap[inv.business_id] || "Unknown",
  }));

  // Summary stats
  const allPaid = (invoices ?? []).filter((inv) => inv.status === "paid");
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const monthlyPaid = allPaid.filter((inv) => inv.invoice_date >= monthStart);

  const totalRevenue = allPaid.reduce((sum, inv) => sum + Number(inv.amount), 0);
  const mrr = monthlyPaid.reduce((sum, inv) => sum + Number(inv.amount), 0);
  const merchantCount = businessIds.length || 1;

  return NextResponse.json({
    invoices: enriched,
    summary: {
      totalRevenue,
      mrr,
      avgPerMerchant: Math.round((totalRevenue / merchantCount) * 100) / 100,
    },
  });
}
