import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole } from '@/lib/auth'
import { sendNewcomerInvite } from '@/lib/email'

// POST — send or resend invite email to newcomer
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['hr_admin'])
  if (authError) return authError

  const { id } = await params

  // Get newcomer with user and manager info
  const { data: newcomer, error } = await supabaseAdmin
    .from('newcomers')
    .select(`
      id,
      company_id,
      user:users!newcomers_user_id_fkey(name, email, token),
      manager:users!newcomers_manager_id_fkey(name)
    `)
    .eq('id', id)
    .single()

  if (error || !newcomer) {
    return NextResponse.json({ error: 'Newcomer not found' }, { status: 404 })
  }

  // Get company name
  const { data: company } = await supabaseAdmin
    .from('companies')
    .select('name')
    .eq('id', newcomer.company_id)
    .single()

  const user = newcomer.user as any
  const manager = newcomer.manager as any

  try {
    await sendNewcomerInvite(
      user.email,
      user.name,
      company?.name || 'Your Company',
      manager?.name || 'Your Manager',
      user.token,
    )

    return NextResponse.json({
      ok: true,
      inviteUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${user.token}`,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to send email' }, { status: 500 })
  }
}
