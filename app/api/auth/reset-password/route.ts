import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { password } = await request.json()

  if (!password) {
    return NextResponse.json(
      { error: 'Password is required' },
      { status: 400 }
    )
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: 'Password must be at least 6 characters' },
      { status: 400 }
    )
  }

  const supabase = createClient()

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ message: 'Password updated successfully' })
}
