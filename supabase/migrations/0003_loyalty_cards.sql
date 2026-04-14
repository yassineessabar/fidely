-- Loyalty Cards table for the card builder feature

CREATE TYPE public.card_type AS ENUM ('coupon', 'stamp', 'points');
CREATE TYPE public.card_status AS ENUM ('draft', 'active', 'archived');

CREATE TABLE public.loyalty_cards (
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

CREATE INDEX idx_loyalty_cards_business ON public.loyalty_cards(business_id);
CREATE INDEX idx_loyalty_cards_status ON public.loyalty_cards(status);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.loyalty_cards
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.loyalty_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage cards"
  ON public.loyalty_cards FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin')
  );
