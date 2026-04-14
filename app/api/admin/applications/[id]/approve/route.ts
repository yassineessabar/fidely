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
