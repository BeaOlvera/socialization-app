import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getSessionFromRequest } from '@/lib/auth'

// GET — check if current user has accepted platform consent
export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabaseAdmin
    .from('privacy_consents')
    .select('id')
    .eq('person_id', session.userId)
    .eq('consent_type', 'platform_consent')
    .eq('accepted', true)
    .limit(1)

  return NextResponse.json({ consented: (data?.length || 0) > 0 })
}

// POST — record platform consent (data protection + research)
export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  // Record data protection consent
  await supabaseAdmin.from('privacy_consents').insert({
    person_type: session.role,
    person_id: session.userId,
    consent_type: 'data_protection',
    consent_text: 'I understand that my data will be stored securely and processed in accordance with GDPR. I can request access to, correction of, or deletion of my personal data at any time.',
    accepted: true,
    accepted_at: new Date().toISOString(),
    ip_address: ip,
    user_agent: userAgent,
  })

  // Record research consent
  await supabaseAdmin.from('privacy_consents').insert({
    person_type: session.role,
    person_id: session.userId,
    consent_type: 'research_participation',
    consent_text: 'I understand that anonymized data from this platform may be used for academic research purposes. All identifying information will be removed. No individual will be identifiable in any published research. My participation is voluntary and I may withdraw at any time.',
    accepted: true,
    accepted_at: new Date().toISOString(),
    ip_address: ip,
    user_agent: userAgent,
  })

  // Record combined platform consent (used for the quick check)
  await supabaseAdmin.from('privacy_consents').insert({
    person_type: session.role,
    person_id: session.userId,
    consent_type: 'platform_consent',
    consent_text: 'Data protection + research participation consent accepted.',
    accepted: true,
    accepted_at: new Date().toISOString(),
    ip_address: ip,
    user_agent: userAgent,
  })

  // Audit log
  await supabaseAdmin.from('audit_logs').insert({
    actor_type: session.role,
    actor_id: session.userId,
    action: 'platform_consent.accepted',
    resource_type: 'user',
    resource_id: session.userId,
    ip_address: ip,
  })

  return NextResponse.json({ ok: true })
}
