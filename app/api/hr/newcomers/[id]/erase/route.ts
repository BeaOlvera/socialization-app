import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole, getSessionFromRequest } from '@/lib/auth'
import { logAudit } from '@/lib/audit'

// POST — right to erasure: anonymize and delete newcomer data
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['hr_admin'])
  if (authError) return authError

  const session = getSessionFromRequest(request)!
  const { id } = await params
  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  // Get newcomer
  const { data: newcomer } = await supabaseAdmin
    .from('newcomers')
    .select('id, user_id')
    .eq('id', id)
    .single()

  if (!newcomer) return NextResponse.json({ error: 'Newcomer not found' }, { status: 404 })

  // Mark deletion timestamps
  await supabaseAdmin.from('newcomers').update({
    data_deletion_requested_at: new Date().toISOString(),
    data_deletion_completed_at: new Date().toISOString(),
  }).eq('id', id)

  // Delete all interview messages (cascading won't cover this if we keep checkin records)
  const { data: checkins } = await supabaseAdmin
    .from('checkins').select('id').eq('newcomer_id', id)
  if (checkins) {
    for (const c of checkins) {
      await supabaseAdmin.from('messages').delete().eq('checkin_id', c.id)
    }
  }

  // Delete score history, tasks, actions, checkins
  await supabaseAdmin.from('dimension_scores_history').delete().eq('newcomer_id', id)
  await supabaseAdmin.from('phase_tasks').delete().eq('newcomer_id', id)
  await supabaseAdmin.from('actions').delete().eq('newcomer_id', id)
  await supabaseAdmin.from('checkins').delete().eq('newcomer_id', id)
  await supabaseAdmin.from('team_members').delete().eq('newcomer_id', id)
  await supabaseAdmin.from('notifications').delete().eq('user_id', newcomer.user_id)

  // Delete newcomer record
  await supabaseAdmin.from('newcomers').delete().eq('id', id)

  // Anonymize user record (keep for audit trail but strip PII)
  await supabaseAdmin.from('users').update({
    name: '[DELETED]',
    email: `deleted_${id}@erased.local`,
    password_hash: null,
    token: null,
  }).eq('id', newcomer.user_id)

  // Audit log (this is retained per GDPR 36-month requirement)
  await logAudit({
    action: 'newcomer.data_deleted',
    actorType: 'hr_admin',
    actorId: session.userId,
    resourceType: 'newcomer',
    resourceId: id,
    details: { reason: 'Right to erasure request' },
    ipAddress: ip,
  })

  return NextResponse.json({ ok: true, message: 'Newcomer data erased per GDPR Article 17' })
}
