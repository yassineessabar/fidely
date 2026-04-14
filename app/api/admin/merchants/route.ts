import { verifyAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const plan = searchParams.get("plan");
  const search = searchParams.get("search");

  const supabase = createAdminClient();

  let query = supabase
    .from("businesses")
    .select("id, name, email, phone, city, plan, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (plan && ["starter", "growth", "enterprise"].includes(plan)) {
    query = query.eq("plan", plan as any);
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ merchants: data });
}
