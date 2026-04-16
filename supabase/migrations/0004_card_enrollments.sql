-- Enrollment status enum
CREATE TYPE public.enrollment_status AS ENUM ('active', 'redeemed', 'expired');

-- Card enrollments table
CREATE TABLE public.card_enrollments (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id           uuid NOT NULL REFERENCES public.loyalty_cards(id) ON DELETE CASCADE,
  customer_name     text NOT NULL,
  customer_email    text NOT NULL,
  customer_phone    text NOT NULL,
  customer_dob      date NOT NULL,
  membership_code   text UNIQUE NOT NULL,
  stamps_collected  integer NOT NULL DEFAULT 0,
  points_balance    integer NOT NULL DEFAULT 0,
  status            public.enrollment_status NOT NULL DEFAULT 'active',
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- Prevent duplicate signups per card
CREATE UNIQUE INDEX idx_enrollment_card_email ON public.card_enrollments(card_id, customer_email);

-- Fast lookup by membership code (for scan)
CREATE INDEX idx_enrollment_membership ON public.card_enrollments(membership_code);

-- Fast lookup by card (for admin listing)
CREATE INDEX idx_enrollment_card ON public.card_enrollments(card_id);

-- Auto-update updated_at
CREATE TRIGGER set_updated_at_card_enrollments
  BEFORE UPDATE ON public.card_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- RLS: allow public read/insert for enrollment, admin full access
ALTER TABLE public.card_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public enrollment creation"
  ON public.card_enrollments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public enrollment read by membership code"
  ON public.card_enrollments FOR SELECT
  USING (true);

CREATE POLICY "Allow public enrollment update"
  ON public.card_enrollments FOR UPDATE
  USING (true);
