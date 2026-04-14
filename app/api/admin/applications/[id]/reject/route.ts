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
