# Gated Signup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace instant auth signup with an application-based flow where admins review and approve merchants before they get access.

**Architecture:** Signup form saves to a `signup_applications` table (no auth user). Admins review via a dedicated `/admin` page. On approval, `supabase.auth.admin.inviteUserByEmail()` creates the user and sends a set-password email. The existing `handle_new_user()` trigger creates business + profile rows.

**Tech Stack:** Next.js API routes, Supabase Auth Admin API, Supabase service role client, Resend for emails.

**Spec:** `docs/superpowers/specs/2026-04-14-gated-signup-design.md`

---

## File Structure

### Create
| File | Responsibility |
|------|---------------|
| `supabase/migrations/0002_signup_applications.sql` | New table, enum, RLS, trigger |
| `lib/supabase/admin.ts` | Service role Supabase client |
| `lib/admin-auth.ts` | Helper to verify admin from request |
| `app/api/admin/applications/route.ts` | GET list of applications |
| `app/api/admin/applications/[id]/approve/route.ts` | POST approve application |
| `app/api/admin/applications/[id]/reject/route.ts` | POST reject application |
| `app/admin/layout.tsx` | Admin layout (logo + logout) |
| `app/admin/page.tsx` | Admin applications table UI |

### Modify
| File | Change |
|------|--------|
| `app/api/auth/signup/route.ts` | Rewrite: insert into signup_applications instead of auth.signUp |
| `app/signup/page.tsx` | Update success message, remove "Go to sign in" link |
| `lib/supabase/middleware.ts` | Add /admin route protection |
| `lib/supabase/database.types.ts` | Add signup_applications table + application_status enum |

---

### Task 1: Database Migration

**Files:**
- Create: `supabase/migrations/0002_signup_applications.sql`

- [ ] **Step 1: Write the migration SQL**

Create `supabase/migrations/0002_signup_applications.sql`:

```sql
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
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/0002_signup_applications.sql
git commit -m "feat: add signup_applications migration"
```

---

### Task 2: TypeScript Types

**Files:**
- Modify: `lib/supabase/database.types.ts`

- [ ] **Step 1: Add signup_applications table type**

Add the following inside `Database['public']['Tables']`, after the `invoices` table block (before the closing `}` of `Tables`):

```typescript
      signup_applications: {
        Row: {
          id: string
          company_name: string
          company_size: Database['public']['Enums']['company_size'] | null
          role: string | null
          first_name: string
          last_name: string
          email: string
          phone: string | null
          status: Database['public']['Enums']['application_status']
          reviewed_by: string | null
          reviewed_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_name: string
          company_size?: Database['public']['Enums']['company_size'] | null
          role?: string | null
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          status?: Database['public']['Enums']['application_status']
          reviewed_by?: string | null
          reviewed_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          company_size?: Database['public']['Enums']['company_size'] | null
          role?: string | null
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          status?: Database['public']['Enums']['application_status']
          reviewed_by?: string | null
          reviewed_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
```

- [ ] **Step 2: Add application_status enum**

Add to `Database['public']['Enums']`:

```typescript
      application_status: 'pending' | 'approved' | 'rejected'
```

- [ ] **Step 3: Commit**

```bash
git add lib/supabase/database.types.ts
git commit -m "feat: add signup_applications TypeScript types"
```

---

### Task 3: Service Role Client + Admin Auth Helper

**Files:**
- Create: `lib/supabase/admin.ts`
- Create: `lib/admin-auth.ts`

- [ ] **Step 1: Create the service role client**

Create `lib/supabase/admin.ts`:

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

- [ ] **Step 2: Create the admin auth helper**

Create `lib/admin-auth.ts`:

```typescript
import { createClient } from '@/lib/supabase/server'

export async function verifyAdmin(): Promise<{ adminId: string } | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('user_type')
    .eq('id', user.id)
    .single()

  if (!profile || profile.user_type !== 'admin') return null

  return { adminId: user.id }
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/supabase/admin.ts lib/admin-auth.ts
git commit -m "feat: add service role client and admin auth helper"
```

---

### Task 4: Rewrite Signup API Route

**Files:**
- Modify: `app/api/auth/signup/route.ts`

- [ ] **Step 1: Rewrite the signup route**

Replace the entire contents of `app/api/auth/signup/route.ts` with:

```typescript
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'hello@fidely.com.au'

function mapCompanySize(size: string): string | null {
  const sizeMap: Record<string, string> = {
    '1 location': '1',
    '2–5 locations': '2-5',
    '6–20 locations': '6-20',
    '20+ locations': '20+',
  }
  return sizeMap[size] || null
}

export async function POST(request: Request) {
  const body = await request.json()
  const { companyName, companySize, role, firstName, lastName, email, phone } = body

  if (!email || !companyName || !firstName || !lastName) {
    return NextResponse.json(
      { error: 'Company name, first name, last name, and email are required' },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  // Check if email already has a pending/approved application
  const { data: existing } = await supabase
    .from('signup_applications')
    .select('id, status')
    .eq('email', email)
    .single()

  if (existing) {
    if (existing.status === 'pending') {
      return NextResponse.json(
        { error: 'An application with this email is already under review.' },
        { status: 409 }
      )
    }
    if (existing.status === 'approved') {
      return NextResponse.json(
        { error: 'This email has already been approved. Check your inbox for the invite.' },
        { status: 409 }
      )
    }
    // If rejected, allow re-application by deleting the old one
    await supabase.from('signup_applications').delete().eq('id', existing.id)
  }

  const formattedPhone = phone ? `+61${phone.replace(/\s/g, '')}` : null

  const { error } = await supabase.from('signup_applications').insert({
    company_name: companyName,
    company_size: mapCompanySize(companySize) as any,
    role,
    first_name: firstName,
    last_name: lastName,
    email,
    phone: formattedPhone,
  })

  if (error) {
    console.error('Failed to save application:', error)
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    )
  }

  // Send emails (non-blocking)
  const origin = new URL(request.url).origin
  sendEmails({ companyName, companySize, role, firstName, lastName, email, phone: formattedPhone, origin }).catch(
    (err) => console.error('Failed to send emails:', err)
  )

  return NextResponse.json({
    message: 'Application submitted!',
  })
}

async function sendEmails(app: {
  companyName: string
  companySize: string
  role: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  origin: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log(
      `[EMAIL] Application received from ${app.firstName} ${app.lastName} (${app.email}) for ${app.companyName}\n` +
      `  → Confirmation would be sent to: ${app.email}\n` +
      `  → Admin notification would be sent to: ${ADMIN_EMAIL}`
    )
    return
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
  }

  // 1. Confirmation to applicant
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      from: 'Fidely <noreply@fidely.com.au>',
      to: [app.email],
      subject: 'We received your application',
      html: `
        <div style="font-family:sans-serif;max-width:500px;">
          <h2 style="color:#0b051d;">Thanks, ${app.firstName}!</h2>
          <p>We've received your application for <strong>${app.companyName}</strong>.</p>
          <p>Our team will review it and get back to you within 24 hours.</p>
          <p style="color:#61605f;font-size:13px;margin-top:32px;">— The Fidely Team</p>
        </div>
      `,
    }),
  })

  // 2. Notification to admin
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      from: 'Fidely <noreply@fidely.com.au>',
      to: [ADMIN_EMAIL],
      subject: `New signup: ${app.companyName}`,
      html: `
        <h2>New Fidely Signup Application</h2>
        <table style="border-collapse:collapse;font-family:sans-serif;">
          <tr><td style="padding:8px;font-weight:bold;">Company</td><td style="padding:8px;">${app.companyName}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Size</td><td style="padding:8px;">${app.companySize}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Contact</td><td style="padding:8px;">${app.firstName} ${app.lastName}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;">${app.email}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Phone</td><td style="padding:8px;">${app.phone || 'N/A'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Role</td><td style="padding:8px;">${app.role}</td></tr>
        </table>
        <p style="margin-top:16px;"><a href="${app.origin}/admin">Review in dashboard →</a></p>
      `,
    }),
  })
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/auth/signup/route.ts
git commit -m "feat: rewrite signup to save application instead of creating auth user"
```

---

### Task 5: Update Signup Page Success Message

**Files:**
- Modify: `app/signup/page.tsx`

- [ ] **Step 1: Update the success state text**

In `app/signup/page.tsx`, find the success state block and make these changes:

Change the heading from:
```
Application submitted!
```
to:
```
Application received!
```

Change the email confirmation paragraph from:
```
We've sent a confirmation email to <strong>{formData.email}</strong>. Please check your inbox to verify your account.
```
to:
```
We've sent a confirmation to <strong>{formData.email}</strong>. Our team will review your application and get back to you within 24 hours.
```

Change the secondary text from:
```
Our team will review your application and get back to you shortly.
```
to:
```
We'll send you an email with next steps once your application is approved.
```

Remove the "Go to sign in" link entirely (the `<a href="/signin" ...>Go to sign in</a>` block). Replace it with a plain link back to the homepage:

```tsx
<a
  href="/"
  style={{
    display: "inline-block",
    marginTop: "32px",
    padding: "12px 32px",
    backgroundColor: "rgb(11,5,29)",
    color: "rgb(249,248,245)",
    borderRadius: "9999px",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: 500,
  }}
>
  Back to homepage
</a>
```

- [ ] **Step 2: Commit**

```bash
git add app/signup/page.tsx
git commit -m "feat: update signup success state for application-based flow"
```

---

### Task 6: Admin API — List Applications

**Files:**
- Create: `app/api/admin/applications/route.ts`

- [ ] **Step 1: Create the list endpoint**

Create `app/api/admin/applications/route.ts`:

```typescript
import { verifyAdmin } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const admin = await verifyAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  const supabase = createAdminClient()

  let query = supabase
    .from('signup_applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (status && ['pending', 'approved', 'rejected'].includes(status)) {
    query = query.eq('status', status as any)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ applications: data })
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/admin/applications/route.ts
git commit -m "feat: add GET /api/admin/applications endpoint"
```

---

### Task 7: Admin API — Approve Application

**Files:**
- Create: `app/api/admin/applications/[id]/approve/route.ts`

- [ ] **Step 1: Create the approve endpoint**

Create directory and file `app/api/admin/applications/[id]/approve/route.ts`:

```typescript
import { verifyAdmin } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const { id } = params

  // Fetch the application
  const { data: application, error: fetchError } = await supabase
    .from('signup_applications')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !application) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 })
  }

  if (application.status !== 'pending') {
    return NextResponse.json(
      { error: `Application is already ${application.status}` },
      { status: 400 }
    )
  }

  // Create auth user via invite (sends set-password email automatically)
  const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
    application.email,
    {
      data: {
        company_name: application.company_name,
        company_size: application.company_size,
        first_name: application.first_name,
        last_name: application.last_name,
        phone: application.phone || '',
        signup_role: application.role || 'owner_founder',
        user_type: 'merchant',
      },
    }
  )

  if (inviteError) {
    console.error('Failed to invite user:', inviteError)
    return NextResponse.json(
      { error: `Failed to create user: ${inviteError.message}` },
      { status: 500 }
    )
  }

  // Update application status
  const { error: updateError } = await supabase
    .from('signup_applications')
    .update({
      status: 'approved' as any,
      reviewed_by: admin.adminId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (updateError) {
    console.error('Failed to update application status:', updateError)
  }

  return NextResponse.json({ message: 'Application approved. Invite email sent.' })
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/admin/applications/[id]/approve/route.ts
git commit -m "feat: add POST /api/admin/applications/[id]/approve endpoint"
```

---

### Task 8: Admin API — Reject Application

**Files:**
- Create: `app/api/admin/applications/[id]/reject/route.ts`

- [ ] **Step 1: Create the reject endpoint**

Create `app/api/admin/applications/[id]/reject/route.ts`:

```typescript
import { verifyAdmin } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const { id } = params

  // Parse optional notes from body
  let notes: string | null = null
  try {
    const body = await request.json()
    notes = body.notes || null
  } catch {
    // No body is fine
  }

  // Fetch the application
  const { data: application, error: fetchError } = await supabase
    .from('signup_applications')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !application) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 })
  }

  if (application.status !== 'pending') {
    return NextResponse.json(
      { error: `Application is already ${application.status}` },
      { status: 400 }
    )
  }

  // Update application status
  const { error: updateError } = await supabase
    .from('signup_applications')
    .update({
      status: 'rejected' as any,
      reviewed_by: admin.adminId,
      reviewed_at: new Date().toISOString(),
      notes,
    })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // Send rejection email (non-blocking)
  sendRejectionEmail(application.email, application.first_name, application.company_name).catch(
    (err) => console.error('Failed to send rejection email:', err)
  )

  return NextResponse.json({ message: 'Application rejected.' })
}

async function sendRejectionEmail(email: string, firstName: string, companyName: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[EMAIL] Rejection email would be sent to: ${email}`)
    return
  }

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'Fidely <noreply@fidely.com.au>',
      to: [email],
      subject: 'Update on your Fidely application',
      html: `
        <div style="font-family:sans-serif;max-width:500px;">
          <h2 style="color:#0b051d;">Hi ${firstName},</h2>
          <p>Thanks for your interest in Fidely and for submitting an application for <strong>${companyName}</strong>.</p>
          <p>After reviewing your application, we're unable to onboard your business at this time.</p>
          <p>If you have any questions or would like to reapply in the future, feel free to reach out at <a href="mailto:hello@fidely.com.au">hello@fidely.com.au</a>.</p>
          <p style="color:#61605f;font-size:13px;margin-top:32px;">— The Fidely Team</p>
        </div>
      `,
    }),
  })
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/admin/applications/[id]/reject/route.ts
git commit -m "feat: add POST /api/admin/applications/[id]/reject endpoint"
```

---

### Task 9: Middleware — Admin Route Protection

**Files:**
- Modify: `lib/supabase/middleware.ts`

- [ ] **Step 1: Add /admin protection**

Replace the entire contents of `lib/supabase/middleware.ts` with:

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard']
const adminRoutes = ['/admin']
const authRoutes = ['/signin', '/signup']

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Redirect unauthenticated users away from protected routes
  if (!user && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone()
    url.pathname = '/signin'
    return NextResponse.redirect(url)
  }

  // Admin routes: require auth + admin user_type
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/signin'
      return NextResponse.redirect(url)
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single()

    if (!profile || profile.user_type !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // Redirect authenticated users away from auth pages
  if (user && authRoutes.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/supabase/middleware.ts
git commit -m "feat: add admin route protection to middleware"
```

---

### Task 10: Admin Layout

**Files:**
- Create: `app/admin/layout.tsx`

- [ ] **Step 1: Create admin layout**

Create `app/admin/layout.tsx`:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Fidely",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/layout.tsx
git commit -m "feat: add admin layout with metadata"
```

---

### Task 11: Admin Applications Page

**Files:**
- Create: `app/admin/page.tsx`

- [ ] **Step 1: Create the admin page**

Create `app/admin/page.tsx`:

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import KyroLogo from "../components/KyroLogo";

type Application = {
  id: string;
  company_name: string;
  company_size: string | null;
  role: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: "pending" | "approved" | "rejected";
  reviewed_at: string | null;
  notes: string | null;
  created_at: string;
};

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: "rgb(254,249,195)", text: "rgb(133,77,14)" },
  approved: { bg: "rgb(220,252,231)", text: "rgb(22,101,52)" },
  rejected: { bg: "rgb(254,226,226)", text: "rgb(153,27,27)" },
};

const tabs = ["all", "pending", "approved", "rejected"] as const;

export default function AdminPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    const params = activeTab !== "all" ? `?status=${activeTab}` : "";
    const res = await fetch(`/api/admin/applications${params}`);
    if (res.ok) {
      const data = await res.json();
      setApplications(data.applications);
    } else if (res.status === 401) {
      router.push("/signin");
    }
    setLoading(false);
  }, [activeTab, router]);

  useEffect(() => {
    setLoading(true);
    fetchApplications();
  }, [fetchApplications]);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id);
    const res = await fetch(`/api/admin/applications/${id}/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      fetchApplications();
    } else {
      const data = await res.json();
      alert(data.error || `Failed to ${action}`);
    }
    setActionLoading(null);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/signin");
    router.refresh();
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "rgb(249,248,245)" }}>
      {/* Header */}
      <header
        style={{
          height: "64px",
          backgroundColor: "white",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
        }}
      >
        <KyroLogo color="#0b051d" height={22} />
        <button
          onClick={handleLogout}
          style={{
            background: "none",
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: "8px",
            padding: "6px 16px",
            fontSize: "13px",
            cursor: "pointer",
            fontFamily: "inherit",
            color: "rgb(97,95,109)",
          }}
        >
          Log out
        </button>
      </header>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>
        <h1
          className="font-display"
          style={{ fontSize: "28px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 24px" }}
        >
          Applications
        </h1>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "24px" }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: activeTab === tab ? "rgb(11,5,29)" : "white",
                color: activeTab === tab ? "white" : "rgb(97,95,109)",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
                textTransform: "capitalize",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            border: "1px solid rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          {loading ? (
            <div style={{ padding: "48px", textAlign: "center", color: "rgb(97,95,109)" }}>
              Loading...
            </div>
          ) : applications.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center", color: "rgb(97,95,109)" }}>
              No {activeTab !== "all" ? activeTab : ""} applications.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  {["Name", "Company", "Email", "Phone", "Date", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "rgb(97,95,109)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                    <td style={{ padding: "14px 16px", fontWeight: 500, color: "rgb(11,5,29)" }}>
                      {app.first_name} {app.last_name}
                    </td>
                    <td style={{ padding: "14px 16px", color: "rgb(11,5,29)" }}>
                      {app.company_name}
                      {app.company_size && (
                        <span style={{ color: "rgb(97,95,109)", fontSize: "12px", marginLeft: "6px" }}>
                          ({app.company_size})
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px", color: "rgb(97,95,109)" }}>{app.email}</td>
                    <td style={{ padding: "14px 16px", color: "rgb(97,95,109)" }}>{app.phone || "—"}</td>
                    <td style={{ padding: "14px 16px", color: "rgb(97,95,109)", fontSize: "13px" }}>
                      {new Date(app.created_at).toLocaleDateString("en-AU", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 600,
                          backgroundColor: statusColors[app.status].bg,
                          color: statusColors[app.status].text,
                          textTransform: "capitalize",
                        }}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {app.status === "pending" && (
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            onClick={() => handleAction(app.id, "approve")}
                            disabled={actionLoading === app.id}
                            style={{
                              padding: "6px 14px",
                              borderRadius: "6px",
                              border: "none",
                              backgroundColor: "rgb(22,163,74)",
                              color: "white",
                              fontSize: "12px",
                              fontWeight: 600,
                              cursor: actionLoading === app.id ? "not-allowed" : "pointer",
                              opacity: actionLoading === app.id ? 0.6 : 1,
                              fontFamily: "inherit",
                            }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(app.id, "reject")}
                            disabled={actionLoading === app.id}
                            style={{
                              padding: "6px 14px",
                              borderRadius: "6px",
                              border: "1px solid rgb(220,38,38)",
                              backgroundColor: "white",
                              color: "rgb(220,38,38)",
                              fontSize: "12px",
                              fontWeight: 600,
                              cursor: actionLoading === app.id ? "not-allowed" : "pointer",
                              opacity: actionLoading === app.id ? 0.6 : 1,
                              fontFamily: "inherit",
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/page.tsx
git commit -m "feat: add admin applications review page"
```

---

### Task 12: Verification

- [ ] **Step 1: Type-check**

Run: `npx tsc --noEmit 2>&1 | grep -v "recharts\|wallet/apple" | head -20`

Expected: No new errors (only pre-existing recharts/wallet ones).

- [ ] **Step 2: Manual verification checklist**

Verify these flows work end-to-end once Supabase is connected:

1. Fill signup form → row appears in `signup_applications` with status `pending`
2. No auth user is created
3. Console shows email logs (or real emails if `RESEND_API_KEY` set)
4. Visit `/admin` as admin → see pending application
5. Click Approve → `supabase.auth.admin.inviteUserByEmail()` fires, application status becomes `approved`
6. Click Reject on another → status becomes `rejected`, rejection email sent
7. Non-admin at `/admin` → redirected to `/dashboard`
8. Unauthenticated at `/admin` → redirected to `/signin`

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete gated signup with admin review flow"
```
