import { verifyAdmin } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email'
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

  let notes: string | null = null
  try {
    const body = await request.json()
    notes = body.notes || null
  } catch {}

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
  sendEmail({
    to: application.email,
    subject: 'Update on your Kyro application',
    html: `
      <div style="font-family:sans-serif;max-width:500px;">
        <h2 style="color:#0b051d;">Hi ${application.first_name},</h2>
        <p>Thanks for your interest in Kyro and for submitting an application for <strong>${application.company_name}</strong>.</p>
        <p>After reviewing your application, we're unable to onboard your business at this time.</p>
        <p>If you have any questions or would like to reapply in the future, feel free to reach out at <a href="mailto:withkyro@gmail.com">withkyro@gmail.com</a>.</p>
        <p style="color:#61605f;font-size:13px;margin-top:32px;">— The Kyro Team</p>
      </div>
    `,
  }).catch((err) => console.error('Failed to send rejection email:', err))

  return NextResponse.json({ message: 'Application rejected.' })
}
