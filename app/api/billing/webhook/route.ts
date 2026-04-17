import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (webhookSecret && sig) {
      event = getStripe().webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.user_id;
      const plan = session.metadata?.plan;

      if (userId && plan) {
        // Update user plan
        await supabase
          .from("businesses")
          .update({ plan } as any)
          .eq("id", (await supabase.from("profiles").select("business_id").eq("id", userId).single()).data?.business_id as string);

        console.log(`[Stripe] User ${userId} subscribed to ${plan}`);
      }
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription;
      if (subscriptionId) {
        try {
          const subscription = await getStripe().subscriptions.retrieve(subscriptionId as string);
          const userId = subscription.metadata?.user_id;
          const plan = subscription.metadata?.plan;
          if (userId && plan) {
            console.log(`[Stripe] Invoice paid for user ${userId}, plan ${plan}`);
          }
        } catch (err) {
          console.error("[Stripe] Failed to retrieve subscription:", err);
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const userId = subscription.metadata?.user_id;
      if (userId) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("business_id")
          .eq("id", userId)
          .single();

        if (profile?.business_id) {
          await supabase
            .from("businesses")
            .update({ plan: "free" } as any)
            .eq("id", profile.business_id);
        }
        console.log(`[Stripe] User ${userId} cancelled subscription, reverted to free`);
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const userId = subscription.metadata?.user_id;
      const plan = subscription.metadata?.plan;
      if (userId && plan) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("business_id")
          .eq("id", userId)
          .single();

        if (profile?.business_id) {
          await supabase
            .from("businesses")
            .update({ plan } as any)
            .eq("id", profile.business_id);
        }
        console.log(`[Stripe] User ${userId} subscription updated to ${plan}`);
      }
      break;
    }

    default:
      console.log(`[Stripe] Unhandled event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
