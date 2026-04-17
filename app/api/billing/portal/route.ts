import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", user.id)
    .single();

  const email = profile?.email || user.email || "";

  try {
    const customers = await getStripe().customers.list({ email, limit: 1 });
    if (customers.data.length === 0) {
      return NextResponse.json({ error: "No billing account found" }, { status: 404 });
    }

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "https://wearekyro.com";

    const session = await getStripe().billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: `${origin}/dashboard/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe portal error:", err);
    return NextResponse.json({ error: err.message || "Portal failed" }, { status: 500 });
  }
}
