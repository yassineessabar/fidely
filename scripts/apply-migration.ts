import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function run() {
  // Run each statement separately since Supabase doesn't support multi-statement SQL via REST
  const statements = [
    `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'card_type') THEN CREATE TYPE public.card_type AS ENUM ('coupon', 'stamp', 'points'); END IF; END $$`,
    `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'card_status') THEN CREATE TYPE public.card_status AS ENUM ('draft', 'active', 'archived'); END IF; END $$`,
    `CREATE TABLE IF NOT EXISTS public.loyalty_cards (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
      type public.card_type NOT NULL,
      name text NOT NULL,
      status public.card_status DEFAULT 'draft',
      business_details jsonb NOT NULL DEFAULT '{}',
      branding jsonb NOT NULL DEFAULT '{}',
      logic jsonb NOT NULL DEFAULT '{}',
      share_url text,
      qr_code_data text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`,
  ];

  for (const sql of statements) {
    const { error } = await supabase.rpc("exec_sql" as any, { sql });
    if (error) {
      // Try via raw query if rpc doesn't work
      console.log("RPC not available, using alternative...");
      break;
    }
  }

  // Test if table exists by trying to select from it
  const { error: testError } = await supabase.from("loyalty_cards").select("id").limit(1);
  if (testError) {
    console.log("Table not found. You need to apply the migration manually.");
    console.log("\nGo to your Supabase Dashboard > SQL Editor and run this:\n");
    console.log(`
CREATE TYPE public.card_type AS ENUM ('coupon', 'stamp', 'points');
CREATE TYPE public.card_status AS ENUM ('draft', 'active', 'archived');

CREATE TABLE public.loyalty_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  type public.card_type NOT NULL,
  name text NOT NULL,
  status public.card_status DEFAULT 'draft',
  business_details jsonb NOT NULL DEFAULT '{}',
  branding jsonb NOT NULL DEFAULT '{}',
  logic jsonb NOT NULL DEFAULT '{}',
  share_url text,
  qr_code_data text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_loyalty_cards_business ON public.loyalty_cards(business_id);
CREATE INDEX idx_loyalty_cards_status ON public.loyalty_cards(status);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.loyalty_cards
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.loyalty_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage cards"
  ON public.loyalty_cards FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin'));
    `);
  } else {
    console.log("✅ loyalty_cards table exists and is accessible!");
  }
}

run().catch(console.error);
