-- Notification status and type enums
CREATE TYPE public.notification_status AS ENUM ('pending', 'sent', 'cancelled');
CREATE TYPE public.notification_type AS ENUM ('birthday', 'expiry', 'custom');

-- Card notifications table
CREATE TABLE public.card_notifications (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id         uuid NOT NULL REFERENCES public.loyalty_cards(id) ON DELETE CASCADE,
  type            public.notification_type NOT NULL,
  title           text NOT NULL,
  message         text,
  scheduled_at    timestamptz,
  sent_at         timestamptz,
  recipients      integer NOT NULL DEFAULT 0,
  status          public.notification_status NOT NULL DEFAULT 'pending',
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_card ON public.card_notifications(card_id);
CREATE INDEX idx_notifications_pending ON public.card_notifications(status, scheduled_at);

-- RLS
ALTER TABLE public.card_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read"
  ON public.card_notifications FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert"
  ON public.card_notifications FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update"
  ON public.card_notifications FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete"
  ON public.card_notifications FOR DELETE USING (true);
