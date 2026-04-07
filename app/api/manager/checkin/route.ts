import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole, getSessionFromRequest } from '@/lib/auth'
import { likertToPercentage } from '@/lib/scores'

// POST — submit manager evaluation for a newcomer
export async function POST(request: NextRequest) {
  const authError = checkRole(request, ['manager'])
  if (authError) return authError

  const session = getSessionFromRequest(request)!
  const body = await request.json()
  const { newcomer_id, scores_fit, scores_ace, scores_tie, month_number, notes } = body

  if (!newcomer_id || !scores_fit || !scores_ace || !scores_tie || !month_number) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  // Verify newcomer belongs to this manager
  const { data: newcomer } = await supabaseAdmin
    .from('newcomers')
    .select('id, current_phase')
    .eq('id', newcomer_id)
    .eq('manager_id', session.userId)
    .single()

  if (!newcomer) return NextResponse.json({ error: 'Newcomer not found or not your direct report' }, { status: 404 })

  const score_fit_avg = likertToPercentage(scores_fit)
  const score_ace_avg = likertToPercentage(scores_ace)
  const score_tie_avg = likertToPercentage(scores_tie)

  // Create manager checkin
  const { data: checkin, error } = await supabaseAdmin
    .from('checkins')
    .insert({
      newcomer_id: newcomer.id,
      checkin_type: 'manager',
      submitted_by: session.userId,
      month_number,
      phase: newcomer.current_phase,
      scores_fit,
      scores_ace,
      scores_tie,
      score_fit_avg,
      score_ace_avg,
      score_tie_avg,
      interview_status: 'completed',
      submitted_at: new Date().toISOString(),
      retention_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Record manager scores in history
  const now = new Date().toISOString()
  await supabaseAdmin.from('dimension_scores_history').insert([
    { newcomer_id: newcomer.id, dimension: 'fit', score: score_fit_avg!, source: 'manager', checkin_id: checkin.id, recorded_at: now },
    { newcomer_id: newcomer.id, dimension: 'ace', score: score_ace_avg!, source: 'manager', checkin_id: checkin.id, recorded_at: now },
    { newcomer_id: newcomer.id, dimension: 'tie', score: score_tie_avg!, source: 'manager', checkin_id: checkin.id, recorded_at: now },
  ])

  return NextResponse.json(checkin, { status: 201 })
}
