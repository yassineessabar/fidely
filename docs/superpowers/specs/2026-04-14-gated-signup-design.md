# Gated Signup — Application-Based Merchant Onboarding

## Context

Fidely currently creates a Supabase auth user immediately on signup (with a random password). This produces orphaned accounts, undercuts premium positioning, and eliminates the ability to charge setup fees. We're switching to an application-based flow where merchants submit an application, admins review it, and only approved merchants get an account.

## Flow

```
Merchant fills signup form
  -> Application saved to signup_applications table (NO auth user created)
  -> Confirmation email to applicant ("We received your application")
  -> Notification email to admin ("New application from X")

Admin visits /admin
  -> Sees pending applications table
  -> Clicks "Approve" or "Reject"

On Approve:
  -> Creates auth user via supabase.auth.admin.inviteUserByEmail()
  -> DB trigger auto-creates business + profile rows (existing trigger, unchanged)
  -> Supabase sends "Set your password" invite email to merchant
  -> Application status -> 'approved'

On Reject:
  -> Sends polite rejection email via Resend
  -> Application status -> 'rejected'

Merchant receives invite email
  -> Clicks link -> /api/auth/callback exchanges code for session
  -> Redirected to set-password page or directly to /dashboard
```

## Database Changes

### New table: `signup_applications`

```sql
CREATE TYPE public.application_status AS ENUM ('pending', 'approved', 'rejected');

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
```

RLS: Only admin users can read/write this table.

```sql
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
```

The signup API route uses the service role key to INSERT (bypasses RLS).

### No changes to existing tables

The `businesses`, `profiles`, and `handle_new_user()` trigger remain unchanged. They fire when the auth user is created on approval — same mechanism, just triggered later.

## API Routes

### `POST /api/auth/signup` (rewrite)

**Before:** Called `supabase.auth.signUp()` with a random password.
**After:** Inserts into `signup_applications` using the service role client (bypasses RLS). Sends two emails:

1. **Confirmation to applicant** — "We received your application. We'll review it within 24 hours."
2. **Notification to admin** — table with applicant details.

Both emails sent via Resend (if `RESEND_API_KEY` is set), otherwise logged to console.

Returns `{ message: "Application submitted!" }` — no user object.

### `GET /api/admin/applications` (new)

Returns all applications. Optional `?status=pending` query param to filter.
Requires admin auth (checks `user_type = 'admin'` from profile).

### `POST /api/admin/applications/[id]/approve` (new)

1. Reads application from `signup_applications`
2. Calls `supabase.auth.admin.inviteUserByEmail(email, { data: { company_name, first_name, last_name, phone, signup_role, user_type: 'merchant' } })`
   - This creates the auth user AND sends the invite email in one call
   - The existing `handle_new_user()` trigger fires, creating business + profile
3. Updates application: `status = 'approved'`, `reviewed_by = admin_uid`, `reviewed_at = now()`

Uses service role client for the admin API call.

### `POST /api/admin/applications/[id]/reject` (new)

1. Updates application: `status = 'rejected'`, `reviewed_by = admin_uid`, `reviewed_at = now()`
2. Sends rejection email via Resend:
   - From: "Fidely <noreply@fidely.com.au>"
   - Subject: "Update on your Fidely application"
   - Body: Polite message thanking them, saying we can't onboard at this time, inviting them to reapply in the future.

### `POST /api/auth/signout` (unchanged)

### `POST /api/auth/signin` (unchanged)

### `GET /api/auth/callback` (unchanged)

## Admin Page

### Route: `/admin`

Protected by middleware — only `user_type = 'admin'` can access. Non-admin authenticated users get redirected to `/dashboard`. Unauthenticated users get redirected to `/signin`.

### Layout

Simple, clean page matching the existing dashboard aesthetic:

- Header: "Applications" title
- Filter tabs: All | Pending | Approved | Rejected
- Table columns: Name, Company, Email, Phone, Date, Status, Actions
- Actions column: "Approve" (green) and "Reject" (red) buttons for pending applications
- Status badges: yellow for pending, green for approved, red for rejected
- Optional notes field (admin can add a note before approving/rejecting)

### Components

- `app/admin/page.tsx` — the admin applications page
- `app/admin/layout.tsx` — admin layout with minimal nav (logo + logout)

## Middleware Updates

File: `lib/supabase/middleware.ts`

```
/dashboard/*  -> requires auth (any user_type)
/admin/*      -> requires auth + user_type = 'admin'
/signin       -> redirects to /dashboard if authenticated
/signup       -> redirects to /dashboard if authenticated
```

For `/admin` protection, middleware fetches the user's profile to check `user_type`. This is a single query cached per request.

## Signup Page Changes

File: `app/signup/page.tsx`

- Form fields stay identical
- `onSubmit` calls `POST /api/auth/signup` (the rewritten route)
- Success state message changes to: "We've received your application. Our team will review it and get back to you within 24 hours."
- No "Go to sign in" button in success state (they can't sign in yet)

## Email Templates

### 1. Application Received (to applicant)

Subject: "We received your application"
Body: Thanks {firstName}, we've received your application for {companyName}. Our team will review it and get back to you within 24 hours.

### 2. New Application (to admin)

Subject: "New signup: {companyName}"
Body: Table with all form fields. Link to /admin to review.

### 3. Application Approved (sent by Supabase)

Supabase's built-in invite email with "Set your password" link. Customizable in Supabase Dashboard > Auth > Email Templates.

### 4. Application Rejected (to applicant)

Subject: "Update on your Fidely application"
Body: Thanks for your interest in Fidely. After reviewing your application, we're unable to onboard {companyName} at this time. Feel free to reach out at hello@fidely.com.au if you have questions or would like to reapply in the future.

## Service Role Client

A new Supabase client using the service role key is needed for:
- Inserting applications (bypass RLS)
- Calling `auth.admin.inviteUserByEmail()` (admin API)
- Reading applications in API routes (bypass RLS)

File: `lib/supabase/admin.ts`

```typescript
import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
```

## Files to Create/Modify

### Create
- `supabase/migrations/0002_signup_applications.sql` — new table + RLS
- `lib/supabase/admin.ts` — service role client
- `app/api/admin/applications/route.ts` — GET list
- `app/api/admin/applications/[id]/approve/route.ts` — POST approve
- `app/api/admin/applications/[id]/reject/route.ts` — POST reject
- `app/admin/page.tsx` — admin applications UI
- `app/admin/layout.tsx` — admin layout

### Modify
- `app/api/auth/signup/route.ts` — rewrite to save application instead of creating user
- `app/signup/page.tsx` — update success message
- `lib/supabase/middleware.ts` — add /admin route protection
- `lib/supabase/database.types.ts` — add signup_applications types

## Verification

1. Fill out signup form -> application appears in signup_applications table (no auth user)
2. Applicant receives "we received your application" email
3. Admin receives notification email
4. Admin visits /admin -> sees pending application
5. Admin clicks Approve -> auth user created, invite email sent, status changes to approved
6. Merchant clicks invite link -> sets password -> lands in /dashboard
7. Admin clicks Reject on another application -> rejection email sent, status changes to rejected
8. Non-admin user trying to access /admin gets redirected to /dashboard
9. Unauthenticated user trying to access /admin gets redirected to /signin
