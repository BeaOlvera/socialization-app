import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole, getSessionFromRequest } from '@/lib/auth'
import { likertToPercentage } from '@/lib/scores'

// GET — list own checkins
export async function GET(request: NextRequest) {
  const authError = checkRole(request, ['newcomer'])
  if (authError) return authError

  const session = getSessionFromRequest(request)!

  // Find newcomer
  const { data: newcomer } = await supabaseAdmin
    .from('newcomers')
    .select('id')
    .eq('user_id', session.userId)
    .single()

  if (!newcomer) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: checkins } = await supabaseAdmin
    .from('checkins')
    .select('*')
    .eq('newcomer_id', newcomer.id)
    .order('month_number')

  return NextResponse.json(checkins || [])
}

// POST — submit self-evaluation (Likert scores)
export async function POST(request: NextRequest) {
  const authError = checkRole(request, ['newcomer'])
  if (authError) return authError

  const session = getSessionFromRequest(request)!
  const body = await request.json()
  const { scores_fit, scores_ace, scores_tie, month_number } = body

  if (!scores_fit || !scores_ace || !scores_tie || !month_number) {
    return NextResponse.json({ error: 'All dimension scores and month number are required' }, { status: 400 })
  }

  // Find newcomer
  const { data: newcomer } = await supabaseAdmin
    .from('newcomers')
    .select('id, current_phase')
    .eq('user_id', session.userId)
    .single()

  if (!newcomer) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Compute averages
  const score_fit_avg = likertToPercentage(scores_fit)
  const score_ace_avg = likertToPercentage(scores_ace)
  const score_tie_avg = likertToPercentage(scores_tie)

  // Create checkin
  const { data: checkin, error } = await supabaseAdmin
    .from('checkins')
    .insert({
      newcomer_id: newcomer.id,
      checkin_type: 'self',
      submitted_by: session.userId,
      month_number,
      phase: newcomer.current_phase,
      scores_fit,
      scores_ace,
      scores_tie,
      score_fit_avg,
      score_ace_avg,
      score_tie_avg,
      submitted_at: new Date().toISOString(),
      retention_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Record dimension scores in history
  const now = new Date().toISOString()
  const historyRows = [
    { newcomer_id: newcomer.id, dimension: 'fit', score: score_fit_avg!, source: 'self', checkin_id: checkin.id, recorded_at: now },
    { newcomer_id: newcomer.id, dimension: 'ace', score: score_ace_avg!, source: 'self', checkin_id: checkin.id, recorded_at: now },
    { newcomer_id: newcomer.id, dimension: 'tie', score: score_tie_avg!, source: 'self', checkin_id: checkin.id, recorded_at: now },
  ]
  await supabaseAdmin.from('dimension_scores_history').insert(historyRows)

  return NextResponse.json(checkin, { status: 201 })
}
