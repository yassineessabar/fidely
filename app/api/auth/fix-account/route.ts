import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

// Fixes accounts where the handle_new_user trigger failed
// (e.g. due to invalid signup_role enum value)
export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();

  // Check if profile exists
  const { data: profile } = await admin
    .from("profiles")
    .select("id, business_id")
    .eq("id", user.id)
    .single();

  if (profile?.business_id) {
    return NextResponse.json({ message: "Account already set up", business_id: profile.business_id });
  }

  // Get user metadata for business name
  const meta = user.user_metadata || {};
  const companyName = meta.company_name || meta.companyName || "My Business";
  const firstName = meta.first_name || meta.firstName || "";
  const lastName = meta.last_name || meta.lastName || "";

  // Create business
  const { data: business, error: bizError } = await admin
    .from("businesses")
    .insert({
      name: companyName,
      company_size: meta.company_size || null,
      phone: meta.phone || null,
    } as any)
    .select("id")
    .single();

  if (bizError) {
    console.error("Fix account — business creation failed:", bizError);
    return NextResponse.json({ error: "Failed to create business" }, { status: 500 });
  }

  if (profile) {
    // Profile exists but no business_id — update it
    await admin
      .from("profiles")
      .update({ business_id: business.id } as any)
      .eq("id", user.id);
  } else {
    // No profile at all — create it
    const { error: profError } = await admin
      .from("profiles")
      .insert({
        id: user.id,
        business_id: business.id,
        first_name: firstName,
        last_name: lastName,
        email: user.email || "",
        phone: meta.phone || "",
        role: "owner",
        user_type: "admin",
      } as any);

    if (profError) {
      console.error("Fix account — profile creation failed:", profError);
      return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, business_id: business.id });
}
