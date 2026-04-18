import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, firstName, lastName, companyName, companySize, phone } = body;

  if (!email || !password || !firstName || !companyName) {
    return NextResponse.json(
      { error: "Email, password, first name, and company name are required" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // Create user in Supabase Auth — the DB trigger (handle_new_user) will
  // automatically create the business + profile from user_metadata
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      first_name: firstName,
      last_name: lastName || "",
      company_name: companyName,
      company_size: companySize || null,
      phone: phone || null,
      signup_role: "owner",
      user_type: "admin",
    },
  });

  if (authError) {
    console.error("Auth creation failed:", authError);
    return NextResponse.json(
      { error: authError.message === "User already registered"
          ? "An account with this email already exists. Try signing in."
          : authError.message },
      { status: 400 }
    );
  }

  // Sign the user in
  const supabase = createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return NextResponse.json(
      { error: "Account created but sign-in failed. Try signing in manually." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, userId: authData.user.id });
}
