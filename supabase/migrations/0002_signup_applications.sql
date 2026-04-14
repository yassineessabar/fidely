-- New enum for application status
CREATE TYPE public.application_status AS ENUM ('pending', 'approved', 'rejected');

-- Applications table
CREATE TABLE public.signup_applications (
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

CREATE INDEX idx_applications_status ON public.signup_applications(status);
CREATE UNIQUE INDEX idx_applications_email ON public.signup_applications(email);

-- Auto-update updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.signup_applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS: only admins can read/write via authenticated client
ALTER TABLE public.signup_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage applications"
  ON public.signup_applications FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );
