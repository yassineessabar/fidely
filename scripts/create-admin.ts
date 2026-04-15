import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const email = "yassine@kyro.com";
  const password = "icecube!";

  console.log("1. Cleaning up old data...");

  // Clean profiles and businesses first (before deleting auth user due to FK)
  await supabase.from("profiles").delete().eq("email", email);
  await supabase.from("businesses").delete().eq("email", email);
  await supabase.from("businesses").delete().eq("name", "My Business");
  await supabase.from("businesses").delete().eq("name", "Kyro Admin");

  // Delete existing auth users
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  for (const u of existingUsers?.users || []) {
    if (u.email === email) {
      console.log("   Deleting existing auth user:", u.id);
      await supabase.auth.admin.deleteUser(u.id);
    }
  }

  // Wait a moment for cleanup
  await new Promise((r) => setTimeout(r, 1000));

  console.log("2. Creating auth user...");

  // Try signUp (goes through a different code path than createUser)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: "Yassine",
        last_name: "Essabar",
      },
    },
  });

  if (error) {
    console.error("   signUp failed:", error.message);

    // Last resort: create directly in auth.users via SQL
    console.log("\n3. Trying direct SQL insert...");
    const { error: sqlError } = await supabase.rpc("create_admin_user" as any, {});

    if (sqlError) {
      console.log("   RPC not available. Run this in SQL Editor:\n");
      console.log(`
-- Insert auth user directly
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password,
  email_confirmed_at, aud, role,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  '${email}',
  crypt('${password}', gen_salt('bf')),
  now(), 'authenticated', 'authenticated',
  '{"provider":"email","providers":["email"]}',
  '{"first_name":"Yassine","last_name":"Essabar"}',
  now(), now()
);

-- Then create identity
INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
SELECT id, id, '${email}', jsonb_build_object('sub', id::text, 'email', '${email}'), 'email', now(), now(), now()
FROM auth.users WHERE email = '${email}';

-- Then create admin profile
DO $$
DECLARE v_user_id uuid; v_biz_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = '${email}';
  INSERT INTO public.businesses (name, email) VALUES ('Kyro Admin', '${email}') RETURNING id INTO v_biz_id;
  INSERT INTO public.profiles (id, business_id, first_name, last_name, email, role, user_type)
  VALUES (v_user_id, v_biz_id, 'Yassine', 'Essabar', '${email}', 'owner', 'admin');
END $$;
      `);
    }
    process.exit(1);
  }

  const userId = data.user!.id;
  console.log("   User created:", userId);

  // Check if trigger created the profile
  await new Promise((r) => setTimeout(r, 500));
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, user_type")
    .eq("id", userId)
    .single();

  if (profile) {
    console.log("3. Profile exists (trigger fired), upgrading to admin...");
    await supabase.from("profiles").update({ user_type: "admin" } as any).eq("id", userId);
  } else {
    console.log("3. No profile (trigger disabled), creating manually...");
    const { data: biz } = await supabase
      .from("businesses")
      .insert({ name: "Kyro Admin", email })
      .select("id")
      .single();

    await supabase.from("profiles").insert({
      id: userId,
      business_id: biz!.id,
      first_name: "Yassine",
      last_name: "Essabar",
      email,
      role: "owner",
      user_type: "admin",
    });
  }

  // Confirm email via admin API
  await supabase.auth.admin.updateUserById(userId, { email_confirm: true });

  console.log("\n✅ Admin user created!");
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
  console.log(`   Sign in at: http://localhost:3000/signin`);
}

main().catch(console.error);
