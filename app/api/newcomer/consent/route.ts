import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole, getSessionFromRequest } from '@/lib/auth'
import { logAudit } from '@/lib/audit'

// POST — record privacy consent before AI interview
export async function POST(request: NextRequest) {
  const authError = checkRole(request, ['newcomer'])
  if (authError) return authError

  const session = getSessionFromRequest(request)!
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  const body = await request.json()

  const { data, error } = await supabaseAdmin
    .from('privacy_consents')
    .insert({
      person_type: 'newcomer',
      person_id: session.userId,
      consent_type: body.consent_type || 'interview_participation',
      consent_text: body.consent_text || 'I agree to participate in this AI-guided interview and consent to the processing of my responses.',
      accepted: body.accepted !== false,
      accepted_at: new Date().toISOString(),
      ip_address: ip,
      user_agent: userAgent,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Audit log
  await logAudit({
    action: 'consent.accepted',
    actorType: 'newcomer',
    actorId: session.userId,
    resourceType: 'privacy_consent',
    resourceId: data.id,
    ipAddress: ip,
  })

  return NextResponse.json({ ok: true })
}
