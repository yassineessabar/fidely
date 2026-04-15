-- ============================================================
-- Fidely Card — Initial Database Schema
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. CUSTOM TYPES (ENUMS)
-- ────────────────────────────────────────────────────────────

CREATE TYPE public.company_size    AS ENUM ('1', '2-5', '6-20', '20+');
CREATE TYPE public.team_role       AS ENUM ('owner', 'manager', 'staff');
CREATE TYPE public.signup_role     AS ENUM ('owner_founder', 'manager', 'marketing', 'operations', 'other');
CREATE TYPE public.customer_status AS ENUM ('vip', 'active', 'inactive', 'new');
CREATE TYPE public.card_tier       AS ENUM ('gold', 'silver', 'bronze', 'basic');
CREATE TYPE public.campaign_status AS ENUM ('draft', 'active', 'sent', 'paused');
CREATE TYPE public.program_type    AS ENUM ('stamp_card', 'points', 'cashback', 'referral', 'vip_tiers', 'subscriptions', 'gift_rewards', 'passes');
CREATE TYPE public.card_style      AS ENUM ('gradient', 'dark', 'light');
CREATE TYPE public.plan_tier       AS ENUM ('starter', 'growth', 'enterprise');
CREATE TYPE public.invoice_status  AS ENUM ('paid', 'pending', 'failed');
CREATE TYPE public.location_status AS ENUM ('active', 'inactive');
CREATE TYPE public.user_type       AS ENUM ('merchant', 'admin');

-- ────────────────────────────────────────────────────────────
-- 2. HELPER FUNCTION: auto-update updated_at
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

-- ── businesses (tenant / organisation) ──────────────────────

CREATE TABLE public.businesses (
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

  -- Brand settings
  logo_url                  text,
  brand_color               text DEFAULT '#6C47FF',
  card_style                public.card_style DEFAULT 'gradient',
  card_title                text,
  card_subtitle             text,

  -- Notification defaults
  notify_welcome            boolean DEFAULT true,
  notify_reward_reminders   boolean DEFAULT true,
  notify_birthday           boolean DEFAULT true,
  notify_inactivity         boolean DEFAULT false,
  notify_weekly_summary     boolean DEFAULT true,
  notify_campaign_reports   boolean DEFAULT false,
  inactivity_threshold_days integer DEFAULT 14,

  -- Billing
  plan                      public.plan_tier DEFAULT 'starter',
  stripe_customer_id        text,
  stripe_subscription_id    text,

  -- Integrations
  api_key                   text,
  webhook_url               text,

  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_businesses_plan ON public.businesses(plan);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── profiles (auth.users → business, team members) ─────────

CREATE TABLE public.profiles (
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

CREATE INDEX idx_profiles_business ON public.profiles(business_id);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── locations ───────────────────────────────────────────────

CREATE TABLE public.locations (
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

CREATE INDEX idx_locations_business ON public.locations(business_id);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.locations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── customers (end consumers / card holders) ────────────────

CREATE TABLE public.customers (
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

CREATE INDEX idx_customers_business   ON public.customers(business_id);
CREATE INDEX idx_customers_status     ON public.customers(business_id, status);
CREATE INDEX idx_customers_email      ON public.customers(business_id, email);
CREATE INDEX idx_customers_last_visit ON public.customers(business_id, last_visit_at);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── visits (core transactional table) ───────────────────────

CREATE TABLE public.visits (
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

CREATE INDEX idx_visits_business ON public.visits(business_id);
CREATE INDEX idx_visits_customer ON public.visits(customer_id);
CREATE INDEX idx_visits_date     ON public.visits(business_id, visited_at);

-- ── loyalty_programs (8 program types) ──────────────────────

CREATE TABLE public.loyalty_programs (
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

CREATE INDEX  idx_loyalty_programs_business ON public.loyalty_programs(business_id);
CREATE UNIQUE INDEX idx_loyalty_programs_type ON public.loyalty_programs(business_id, type);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.loyalty_programs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── redemptions ─────────────────────────────────────────────

CREATE TABLE public.redemptions (
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

CREATE INDEX idx_redemptions_business ON public.redemptions(business_id);
CREATE INDEX idx_redemptions_customer ON public.redemptions(customer_id);

-- ── campaigns (push notification campaigns) ─────────────────

CREATE TABLE public.campaigns (
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

CREATE INDEX idx_campaigns_business ON public.campaigns(business_id);
CREATE INDEX idx_campaigns_status   ON public.campaigns(business_id, status);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── campaign_sends (per-recipient records) ──────────────────

CREATE TABLE public.campaign_sends (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id   uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  customer_id   uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  opened        boolean DEFAULT false,
  opened_at     timestamptz,
  sent_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_campaign_sends_campaign ON public.campaign_sends(campaign_id);
CREATE INDEX idx_campaign_sends_customer ON public.campaign_sends(customer_id);

-- ── wallet_passes (Apple / Google Wallet) ───────────────────

CREATE TABLE public.wallet_passes (
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

CREATE INDEX idx_wallet_passes_business ON public.wallet_passes(business_id);
CREATE INDEX idx_wallet_passes_customer ON public.wallet_passes(customer_id);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.wallet_passes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── integrations (third-party connected apps) ───────────────

CREATE TABLE public.integrations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  provider      text NOT NULL,
  is_connected  boolean DEFAULT false,
  config        jsonb DEFAULT '{}',
  connected_at  timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX  idx_integrations_business ON public.integrations(business_id);
CREATE UNIQUE INDEX idx_integrations_provider ON public.integrations(business_id, provider);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.integrations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── invoices (billing history) ──────────────────────────────

CREATE TABLE public.invoices (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id       uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  stripe_invoice_id text,
  amount            numeric(10,2) NOT NULL,
  currency          text DEFAULT 'usd',
  plan              public.plan_tier NOT NULL,
  status            public.invoice_status DEFAULT 'pending',
  invoice_date      date NOT NULL,
  pdf_url           text,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_invoices_business ON public.invoices(business_id);

-- ────────────────────────────────────────────────────────────
-- 4. AUTO-CREATE PROFILE + BUSINESS ON SIGNUP
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ────────────────────────────────────────────────────────────
-- 5. ROW LEVEL SECURITY (RLS)
-- ────────────────────────────────────────────────────────────

-- Helper: get current user's business_id
CREATE OR REPLACE FUNCTION public.get_my_business_id()
RETURNS uuid AS $$
  SELECT business_id FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE public.businesses      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemptions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_sends  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_passes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices        ENABLE ROW LEVEL SECURITY;

-- ── businesses ──────────────────────────────────────────────

CREATE POLICY "Users can view own business"
  ON public.businesses FOR SELECT
  USING (id = public.get_my_business_id());

CREATE POLICY "Users can update own business"
  ON public.businesses FOR UPDATE
  USING (id = public.get_my_business_id());

-- ── profiles ────────────────────────────────────────────────

CREATE POLICY "Users can view team profiles"
  ON public.profiles FOR SELECT
  USING (business_id = public.get_my_business_id());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Owners can insert team members"
  ON public.profiles FOR INSERT
  WITH CHECK (
    business_id = public.get_my_business_id()
    AND EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'owner'
    )
  );

CREATE POLICY "Owners can delete team members"
  ON public.profiles FOR DELETE
  USING (
    business_id = public.get_my_business_id()
    AND EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'owner'
    )
  );

-- ── tenant-scoped tables (same pattern) ─────────────────────

CREATE POLICY "Tenant isolation" ON public.locations
  FOR ALL USING (business_id = public.get_my_business_id())
  WITH CHECK (business_id = public.get_my_business_id());

CREATE POLICY "Tenant isolation" ON public.customers
  FOR ALL USING (business_id = public.get_my_business_id())
  WITH CHECK (business_id = public.get_my_business_id());

CREATE POLICY "Tenant isolation" ON public.visits
  FOR ALL USING (business_id = public.get_my_business_id())
  WITH CHECK (business_id = public.get_my_business_id());

CREATE POLICY "Tenant isolation" ON public.loyalty_programs
  FOR ALL USING (business_id = public.get_my_business_id())
  WITH CHECK (business_id = public.get_my_business_id());

CREATE POLICY "Tenant isolation" ON public.redemptions
  FOR ALL USING (business_id = public.get_my_business_id())
  WITH CHECK (business_id = public.get_my_business_id());

CREATE POLICY "Tenant isolation" ON public.campaigns
  FOR ALL USING (business_id = public.get_my_business_id())
  WITH CHECK (business_id = public.get_my_business_id());

CREATE POLICY "Tenant isolation" ON public.campaign_sends
  FOR ALL USING (
    campaign_id IN (
      SELECT id FROM public.campaigns WHERE business_id = public.get_my_business_id()
    )
  )
  WITH CHECK (
    campaign_id IN (
      SELECT id FROM public.campaigns WHERE business_id = public.get_my_business_id()
    )
  );

CREATE POLICY "Tenant isolation" ON public.wallet_passes
  FOR ALL USING (business_id = public.get_my_business_id())
  WITH CHECK (business_id = public.get_my_business_id());

CREATE POLICY "Tenant isolation" ON public.integrations
  FOR ALL USING (business_id = public.get_my_business_id())
  WITH CHECK (business_id = public.get_my_business_id());

CREATE POLICY "Tenant isolation" ON public.invoices
  FOR ALL USING (business_id = public.get_my_business_id())
  WITH CHECK (business_id = public.get_my_business_id());
