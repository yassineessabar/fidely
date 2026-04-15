-- ============================================================
-- Kyro / Fidely — Full Database Schema (all migrations combined)
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. ENUMS
-- ────────────────────────────────────────────────────────────

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'company_size') THEN CREATE TYPE public.company_size AS ENUM ('1', '2-5', '6-20', '20+'); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'team_role') THEN CREATE TYPE public.team_role AS ENUM ('owner', 'manager', 'staff'); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'signup_role') THEN CREATE TYPE public.signup_role AS ENUM ('owner_founder', 'manager', 'marketing', 'operations', 'other'); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'customer_status') THEN CREATE TYPE public.customer_status AS ENUM ('vip', 'active', 'inactive', 'new'); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'card_tier') THEN CREATE TYPE public.card_tier AS ENUM ('gold', 'silver', 'bronze', 'basic'); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'campaign_status') THEN CREATE TYPE public.campaign_status AS ENUM ('draft', 'active', 'sent', 'paused'); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'program_type') THEN CREATE TYPE public.program_type AS ENUM ('stamp_card', 'points', 'cashback', 'referral', 'vip_tiers', 'subscriptions', 'gift_rewards', 'passes'); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'card_style') THEN CREATE TYPE public.card_style AS ENUM ('gradient', 'dark', 'light'); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan_tier') THEN CREATE TYPE public.plan_tier AS ENUM ('starter', 'growth', 'enterprise'); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invoice_status') THEN CREATE TYPE public.invoice_status AS ENUM ('paid', 'pending', 'failed'); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'location_status') THEN CREATE TYPE public.location_status AS ENUM ('active', 'inactive'); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type') THEN CREATE TYPE public.user_type AS ENUM ('merchant', 'admin'); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN CREATE TYPE public.application_status AS ENUM ('pending', 'approved', 'rejected'); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'card_type') THEN CREATE TYPE public.card_type AS ENUM ('coupon', 'stamp', 'points'); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'card_status') THEN CREATE TYPE public.card_status AS ENUM ('draft', 'active', 'archived'); END IF; END $$;

-- ────────────────────────────────────────────────────────────
-- 2. HELPER FUNCTION
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ────────────────────────────────────────────────────────────
-- 3. TABLES
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.businesses (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                      text NOT NULL,
  email                     text,
  phone                     text,
  address                   text,
  city                      text,
  postal_code               text,
  website                   text,
  business_type             text,
  company_size              public.company_size,
  logo_url                  text,
  brand_color               text DEFAULT '#6C47FF',
  card_style                public.card_style DEFAULT 'gradient',
  card_title                text,
  card_subtitle             text,
  notify_welcome            boolean DEFAULT true,
  notify_reward_reminders   boolean DEFAULT true,
  notify_birthday           boolean DEFAULT true,
  notify_inactivity         boolean DEFAULT false,
  notify_weekly_summary     boolean DEFAULT true,
  notify_campaign_reports   boolean DEFAULT false,
  inactivity_threshold_days integer DEFAULT 14,
  plan                      public.plan_tier DEFAULT 'starter',
  stripe_customer_id        text,
  stripe_subscription_id    text,
  api_key                   text,
  webhook_url               text,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id   uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  first_name    text,
  last_name     text,
  email         text NOT NULL,
  phone         text,
  role          public.team_role NOT NULL DEFAULT 'staff',
  signup_role   public.signup_role,
  user_type     public.user_type NOT NULL DEFAULT 'merchant',
  avatar_url    text,
  status        text DEFAULT 'active',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Add user_type column if profiles existed before this migration
DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_type public.user_type NOT NULL DEFAULT 'merchant';
EXCEPTION WHEN others THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.locations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name          text NOT NULL,
  address       text,
  city          text,
  postal_code   text,
  latitude      double precision,
  longitude     double precision,
  status        public.location_status DEFAULT 'active',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.customers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id     uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  email           text,
  name            text,
  phone           text,
  date_of_birth   date,
  status          public.customer_status DEFAULT 'new',
  card_tier       public.card_tier DEFAULT 'basic',
  total_visits    integer DEFAULT 0,
  total_spend     numeric(10,2) DEFAULT 0,
  total_points    integer DEFAULT 0,
  last_visit_at   timestamptz,
  referral_code   text,
  referred_by     uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.visits (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  customer_id   uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  location_id   uuid REFERENCES public.locations(id) ON DELETE SET NULL,
  amount        numeric(10,2),
  points_earned integer DEFAULT 0,
  stamps_earned integer DEFAULT 0,
  visited_at    timestamptz NOT NULL DEFAULT now(),
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.loyalty_programs (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id      uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  type             public.program_type NOT NULL,
  name             text NOT NULL,
  description      text,
  is_active        boolean DEFAULT false,
  config           jsonb NOT NULL DEFAULT '{}',
  member_count     integer DEFAULT 0,
  redemption_count integer DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.redemptions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id       uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  customer_id       uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  program_id        uuid NOT NULL REFERENCES public.loyalty_programs(id) ON DELETE CASCADE,
  location_id       uuid REFERENCES public.locations(id) ON DELETE SET NULL,
  points_spent      integer DEFAULT 0,
  reward_description text,
  redeemed_at       timestamptz NOT NULL DEFAULT now(),
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.campaigns (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id      uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name             text NOT NULL,
  status           public.campaign_status DEFAULT 'draft',
  template_key     text,
  audience_segment text,
  message_title    text,
  message_body     text,
  sent_count       integer DEFAULT 0,
  open_count       integer DEFAULT 0,
  revenue          numeric(10,2) DEFAULT 0,
  scheduled_at     timestamptz,
  sent_at          timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.campaign_sends (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id   uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  customer_id   uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  opened        boolean DEFAULT false,
  opened_at     timestamptz,
  sent_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wallet_passes (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id     uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  customer_id     uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  pass_type       text NOT NULL,
  serial_number   text NOT NULL UNIQUE,
  barcode_format  text DEFAULT 'QR',
  barcode_value   text,
  platform        text,
  is_active       boolean DEFAULT true,
  pass_data       jsonb DEFAULT '{}',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.integrations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  provider      text NOT NULL,
  is_connected  boolean DEFAULT false,
  config        jsonb DEFAULT '{}',
  connected_at  timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.invoices (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id      uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  stripe_invoice_id text,
  amount           numeric(10,2) NOT NULL,
  currency         text DEFAULT 'usd',
  plan             public.plan_tier NOT NULL,
  status           public.invoice_status DEFAULT 'pending',
  invoice_date     date NOT NULL,
  pdf_url          text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.signup_applications (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name  text NOT NULL,
  company_size  public.company_size,
  role          text,
  first_name    text NOT NULL,
  last_name     text NOT NULL,
  email         text NOT NULL,
  phone         text,
  status        public.application_status DEFAULT 'pending',
  reviewed_by   uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at   timestamptz,
  notes         text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.loyalty_cards (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id      uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  type             public.card_type NOT NULL,
  name             text NOT NULL,
  status           public.card_status DEFAULT 'draft',
  business_details jsonb NOT NULL DEFAULT '{}',
  branding         jsonb NOT NULL DEFAULT '{}',
  logic            jsonb NOT NULL DEFAULT '{}',
  share_url        text,
  qr_code_data     text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- 4. INDEXES
-- ────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_businesses_plan ON public.businesses(plan);
CREATE INDEX IF NOT EXISTS idx_profiles_business ON public.profiles(business_id);
CREATE INDEX IF NOT EXISTS idx_locations_business ON public.locations(business_id);
CREATE INDEX IF NOT EXISTS idx_customers_business ON public.customers(business_id);
CREATE INDEX IF NOT EXISTS idx_customers_status ON public.customers(business_id, status);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(business_id, email);
CREATE INDEX IF NOT EXISTS idx_customers_last_visit ON public.customers(business_id, last_visit_at);
CREATE INDEX IF NOT EXISTS idx_visits_business ON public.visits(business_id);
CREATE INDEX IF NOT EXISTS idx_visits_customer ON public.visits(customer_id);
CREATE INDEX IF NOT EXISTS idx_visits_date ON public.visits(business_id, visited_at);
CREATE INDEX IF NOT EXISTS idx_loyalty_programs_business ON public.loyalty_programs(business_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_business ON public.redemptions(business_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_customer ON public.redemptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_business ON public.campaigns(business_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(business_id, status);
CREATE INDEX IF NOT EXISTS idx_campaign_sends_campaign ON public.campaign_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_sends_customer ON public.campaign_sends(customer_id);
CREATE INDEX IF NOT EXISTS idx_wallet_passes_business ON public.wallet_passes(business_id);
CREATE INDEX IF NOT EXISTS idx_wallet_passes_customer ON public.wallet_passes(customer_id);
CREATE INDEX IF NOT EXISTS idx_integrations_business ON public.integrations(business_id);
CREATE INDEX IF NOT EXISTS idx_invoices_business ON public.invoices(business_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.signup_applications(status);
CREATE INDEX IF NOT EXISTS idx_loyalty_cards_business ON public.loyalty_cards(business_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_cards_status ON public.loyalty_cards(status);

-- ────────────────────────────────────────────────────────────
-- 5. TRIGGERS (updated_at)
-- ────────────────────────────────────────────────────────────

DROP TRIGGER IF EXISTS set_updated_at ON public.businesses;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.businesses FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.locations;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.locations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.customers;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.loyalty_programs;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.loyalty_programs FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.campaigns;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.wallet_passes;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.wallet_passes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.integrations;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.integrations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.signup_applications;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.signup_applications FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.loyalty_cards;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.loyalty_cards FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ────────────────────────────────────────────────────────────
-- 6. AUTO-CREATE PROFILE + BUSINESS ON SIGNUP
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_business_id uuid;
BEGIN
  INSERT INTO public.businesses (name, company_size)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'company_name', 'My Business'),
    CASE
      WHEN NEW.raw_user_meta_data->>'company_size' IS NOT NULL
      THEN (NEW.raw_user_meta_data->>'company_size')::public.company_size
      ELSE NULL
    END
  )
  RETURNING id INTO new_business_id;

  INSERT INTO public.profiles (id, business_id, first_name, last_name, email, phone, role, signup_role, user_type)
  VALUES (
    NEW.id,
    new_business_id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'owner',
    CASE
      WHEN NEW.raw_user_meta_data->>'signup_role' IS NOT NULL
      THEN (NEW.raw_user_meta_data->>'signup_role')::public.signup_role
      ELSE 'owner_founder'
    END,
    COALESCE(
      (NEW.raw_user_meta_data->>'user_type')::public.user_type,
      'merchant'
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ────────────────────────────────────────────────────────────
-- 7. RLS HELPER
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.get_my_business_id()
RETURNS uuid AS $$
  SELECT business_id FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ────────────────────────────────────────────────────────────
-- 8. ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────────────

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signup_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_cards ENABLE ROW LEVEL SECURITY;

-- Businesses
DROP POLICY IF EXISTS "Users can view own business" ON public.businesses;
CREATE POLICY "Users can view own business" ON public.businesses FOR SELECT USING (id = public.get_my_business_id());
DROP POLICY IF EXISTS "Users can update own business" ON public.businesses;
CREATE POLICY "Users can update own business" ON public.businesses FOR UPDATE USING (id = public.get_my_business_id());

-- Profiles
DROP POLICY IF EXISTS "Users can view team profiles" ON public.profiles;
CREATE POLICY "Users can view team profiles" ON public.profiles FOR SELECT USING (business_id = public.get_my_business_id());
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());

-- Tenant-scoped tables
DROP POLICY IF EXISTS "Tenant isolation" ON public.locations;
CREATE POLICY "Tenant isolation" ON public.locations FOR ALL USING (business_id = public.get_my_business_id()) WITH CHECK (business_id = public.get_my_business_id());

DROP POLICY IF EXISTS "Tenant isolation" ON public.customers;
CREATE POLICY "Tenant isolation" ON public.customers FOR ALL USING (business_id = public.get_my_business_id()) WITH CHECK (business_id = public.get_my_business_id());

DROP POLICY IF EXISTS "Tenant isolation" ON public.visits;
CREATE POLICY "Tenant isolation" ON public.visits FOR ALL USING (business_id = public.get_my_business_id()) WITH CHECK (business_id = public.get_my_business_id());

DROP POLICY IF EXISTS "Tenant isolation" ON public.loyalty_programs;
CREATE POLICY "Tenant isolation" ON public.loyalty_programs FOR ALL USING (business_id = public.get_my_business_id()) WITH CHECK (business_id = public.get_my_business_id());

DROP POLICY IF EXISTS "Tenant isolation" ON public.redemptions;
CREATE POLICY "Tenant isolation" ON public.redemptions FOR ALL USING (business_id = public.get_my_business_id()) WITH CHECK (business_id = public.get_my_business_id());

DROP POLICY IF EXISTS "Tenant isolation" ON public.campaigns;
CREATE POLICY "Tenant isolation" ON public.campaigns FOR ALL USING (business_id = public.get_my_business_id()) WITH CHECK (business_id = public.get_my_business_id());

DROP POLICY IF EXISTS "Tenant isolation" ON public.campaign_sends;
CREATE POLICY "Tenant isolation" ON public.campaign_sends FOR ALL
  USING (campaign_id IN (SELECT id FROM public.campaigns WHERE business_id = public.get_my_business_id()))
  WITH CHECK (campaign_id IN (SELECT id FROM public.campaigns WHERE business_id = public.get_my_business_id()));

DROP POLICY IF EXISTS "Tenant isolation" ON public.wallet_passes;
CREATE POLICY "Tenant isolation" ON public.wallet_passes FOR ALL USING (business_id = public.get_my_business_id()) WITH CHECK (business_id = public.get_my_business_id());

DROP POLICY IF EXISTS "Tenant isolation" ON public.integrations;
CREATE POLICY "Tenant isolation" ON public.integrations FOR ALL USING (business_id = public.get_my_business_id()) WITH CHECK (business_id = public.get_my_business_id());

DROP POLICY IF EXISTS "Tenant isolation" ON public.invoices;
CREATE POLICY "Tenant isolation" ON public.invoices FOR ALL USING (business_id = public.get_my_business_id()) WITH CHECK (business_id = public.get_my_business_id());

-- Admin-only tables
DROP POLICY IF EXISTS "Admins can manage applications" ON public.signup_applications;
CREATE POLICY "Admins can manage applications" ON public.signup_applications FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin'));

DROP POLICY IF EXISTS "Admins can manage cards" ON public.loyalty_cards;
CREATE POLICY "Admins can manage cards" ON public.loyalty_cards FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin'));

-- ────────────────────────────────────────────────────────────
-- 9. CREATE ADMIN USER (after running, set password in Auth dashboard)
-- ────────────────────────────────────────────────────────────

-- Run this AFTER creating the auth user in Authentication → Users → Add User
-- with email: yassine@kyro.com, password: icecube!, Auto Confirm checked.
-- Then uncomment and run:

-- DO $$
-- DECLARE
--   v_user_id uuid;
--   v_business_id uuid;
-- BEGIN
--   SELECT id INTO v_user_id FROM auth.users WHERE email = 'yassine@kyro.com';
--   IF v_user_id IS NULL THEN
--     RAISE EXCEPTION 'Create the auth user first in Authentication → Users → Add User';
--   END IF;
--   IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_user_id) THEN
--     INSERT INTO public.businesses (name, email) VALUES ('Kyro Admin', 'yassine@kyro.com') RETURNING id INTO v_business_id;
--     INSERT INTO public.profiles (id, business_id, first_name, last_name, email, role, user_type)
--     VALUES (v_user_id, v_business_id, 'Yassine', 'Essabar', 'yassine@kyro.com', 'owner', 'admin');
--     RAISE NOTICE 'Admin created!';
--   ELSE
--     UPDATE public.profiles SET user_type = 'admin' WHERE id = v_user_id;
--     RAISE NOTICE 'Existing profile updated to admin';
--   END IF;
-- END $$;
