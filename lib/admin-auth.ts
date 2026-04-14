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
