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
