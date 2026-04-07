import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyPassword, createSessionToken, setSessionCookie } from '@/lib/auth'
import type { SessionPayload } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Look up user by email
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, name, role, password_hash, company_id')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (error || !user || !user.password_hash) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Verify password
    const valid = await verifyPassword(password, user.password_hash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Update last_login_at
    await supabaseAdmin
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id)

    // Create JWT session
    const payload: SessionPayload = {
      userId: user.id,
      role: user.role,
      companyId: user.company_id,
      name: user.name,
      email: user.email,
    }
    const token = createSessionToken(payload)

    // Set cookie and return user info
    const response = NextResponse.json({
      user: { id: user.id, name: user.name, role: user.role, email: user.email },
    })
    return setSessionCookie(response, token)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
