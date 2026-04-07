import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { hashPassword, createSessionToken, setSessionCookie } from '@/lib/auth'
import type { SessionPayload } from '@/lib/auth'

// GET — validate token and check if password is set
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('id, name, email, role, password_hash, company_id')
    .eq('token', token)
    .single()

  if (error || !user) {
    return NextResponse.json({ error: 'Invalid or expired invite link' }, { status: 404 })
  }

  return NextResponse.json({
    name: user.name,
    hasPassword: !!user.password_hash,
  })
}

// POST — set password (first time) or login via token (returning user)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('id, name, email, role, password_hash, company_id')
    .eq('token', token)
    .single()

  if (error || !user) {
    return NextResponse.json({ error: 'Invalid or expired invite link' }, { status: 404 })
  }

  // If body has password, set it (first-time setup)
  let body: { password?: string } = {}
  try {
    body = await request.json()
  } catch {
    // No body — token-only login for returning users
  }

  if (body.password) {
    if (body.password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }
    const hash = await hashPassword(body.password)
    await supabaseAdmin
      .from('users')
      .update({ password_hash: hash, last_login_at: new Date().toISOString() })
      .eq('id', user.id)
  } else if (!user.password_hash) {
    // No password in body and no password set — can't proceed
    return NextResponse.json({ error: 'Password required' }, { status: 400 })
  } else {
    // Returning user — just update login time
    await supabaseAdmin
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id)
  }

  // Create session
  const payload: SessionPayload = {
    userId: user.id,
    role: user.role,
    companyId: user.company_id,
    name: user.name,
    email: user.email,
  }
  const token_jwt = createSessionToken(payload)

  const redirectMap: Record<string, string> = {
    newcomer: '/newcomer',
    manager: '/manager',
    hr_admin: '/hr',
  }

  const response = NextResponse.json({ redirect: redirectMap[user.role] || '/' })
  return setSessionCookie(response, token_jwt)
}
