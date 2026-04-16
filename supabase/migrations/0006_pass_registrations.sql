-- Store device registrations for pass updates
CREATE TABLE public.pass_registrations (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_library_identifier   text NOT NULL,
  push_token                  text NOT NULL,
  pass_type_identifier        text NOT NULL,
  serial_number               text NOT NULL,
  created_at                  timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_pass_reg_unique ON public.pass_registrations(device_library_identifier, pass_type_identifier, serial_number);
CREATE INDEX idx_pass_reg_serial ON public.pass_registrations(serial_number);

ALTER TABLE public.pass_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public pass registration" ON public.pass_registrations FOR ALL USING (true) WITH CHECK (true);

-- Add auth_token to enrollments for pass authentication
ALTER TABLE public.card_enrollments ADD COLUMN IF NOT EXISTS auth_token text;
