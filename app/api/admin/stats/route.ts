import { verifyAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const [businessesRes, pendingRes, customersRes, invoicesRes] =
    await Promise.all([
      supabase.from("businesses").select("id", { count: "exact", head: true }),
      supabase
        .from("signup_applications")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending" as any),
      supabase.from("customers").select("id", { count: "exact", head: true }),
      supabase
        .from("invoices")
        .select("amount")
        .eq("status", "paid" as any)
        .gte(
          "invoice_date",
          new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            .toISOString()
            .split("T")[0]
        ),
    ]);

  const monthlyRevenue = (invoicesRes.data ?? []).reduce(
    (sum, inv) => sum + Number(inv.amount),
    0
  );

  return NextResponse.json({
    totalMerchants: businessesRes.count ?? 0,
    pendingApplications: pendingRes.count ?? 0,
    totalCustomers: customersRes.count ?? 0,
    monthlyRevenue,
  });
}
