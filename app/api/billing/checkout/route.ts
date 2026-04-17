import { createClient } from "@/lib/supabase/server";
import { getStripe, PLANS } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, business_id")
    .eq("id", user.id)
    .single();

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  let body: { plan: string; cycle: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { plan, cycle } = body;
  const planDef = PLANS[plan];
  if (!planDef || plan === "free" || plan === "enterprise") {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const email = profile.email || user.email || "";
  const amountCents = cycle === "yearly" ? planDef.yearly_price_cents : planDef.monthly_price_cents;

  try {
    // Lookup or create Stripe customer
    const existing = await getStripe().customers.list({ email, limit: 1 });
    let customerId: string;
    if (existing.data.length > 0) {
      customerId = existing.data[0].id;
    } else {
      const customer = await getStripe().customers.create({
        email,
        metadata: { user_id: user.id, business_id: profile.business_id || "" },
      });
      customerId = customer.id;
    }

    // Create price
    const price = await getStripe().prices.create({
      unit_amount: amountCents,
      currency: "usd",
      recurring: { interval: cycle === "yearly" ? "year" : "month" },
      product_data: {
        name: `Kyro ${planDef.name} Plan (${cycle})`,
        metadata: { plan, cycle },
      },
    });

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "https://wearekyro.com";

    // Create checkout session
    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [{ price: price.id, quantity: 1 }],
      mode: "subscription",
      success_url: `${origin}/dashboard/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/billing`,
      metadata: { user_id: user.id, plan, cycle },
      subscription_data: {
        metadata: { user_id: user.id, plan, cycle },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: err.message || "Checkout failed" }, { status: 500 });
  }
}
