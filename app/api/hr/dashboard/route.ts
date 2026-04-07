import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole, getSessionFromRequest } from '@/lib/auth'

// GET — aggregated dashboard stats for HR
export async function GET(request: NextRequest) {
  const authError = checkRole(request, ['hr_admin'])
  if (authError) return authError

  const session = getSessionFromRequest(request)!
  const companyId = session.companyId

  // Get all newcomers for company
  const { data: newcomers } = await supabaseAdmin
    .from('newcomers')
    .select('id, status, current_phase, manager_id')
    .eq('company_id', companyId)

  if (!newcomers) return NextResponse.json({ error: 'Failed to load data' }, { status: 500 })

  const total = newcomers.length
  const green = newcomers.filter(n => n.status === 'green').length
  const yellow = newcomers.filter(n => n.status === 'yellow').length
  const red = newcomers.filter(n => n.status === 'red').length

  // Phase distribution
  const phases = {
    arrival: newcomers.filter(n => n.current_phase === 'arrival').length,
    integration: newcomers.filter(n => n.current_phase === 'integration').length,
    adjustment: newcomers.filter(n => n.current_phase === 'adjustment').length,
    stabilization: newcomers.filter(n => n.current_phase === 'stabilization').length,
    embedding: newcomers.filter(n => n.current_phase === 'embedding').length,
  }

  // Get latest scores for averages
  const newcomerIds = newcomers.map(n => n.id)
  const { data: latestScores } = await supabaseAdmin
    .from('dimension_scores_history')
    .select('newcomer_id, dimension, score')
    .in('newcomer_id', newcomerIds.length > 0 ? newcomerIds : ['none'])
    .eq('source', 'self')
    .order('recorded_at', { ascending: false })

  // Compute averages per dimension (using latest score per newcomer)
  const latestByNewcomer: Record<string, Record<string, number>> = {}
  for (const s of latestScores || []) {
    if (!latestByNewcomer[s.newcomer_id]) latestByNewcomer[s.newcomer_id] = {}
    if (!latestByNewcomer[s.newcomer_id][s.dimension]) {
      latestByNewcomer[s.newcomer_id][s.dimension] = s.score
    }
  }

  const avgScores = { fit: 0, ace: 0, tie: 0 }
  const counts = { fit: 0, ace: 0, tie: 0 }
  for (const scores of Object.values(latestByNewcomer)) {
    for (const dim of ['fit', 'ace', 'tie'] as const) {
      if (scores[dim] !== undefined) {
        avgScores[dim] += scores[dim]
        counts[dim]++
      }
    }
  }
  if (counts.fit > 0) avgScores.fit = Math.round(avgScores.fit / counts.fit)
  if (counts.ace > 0) avgScores.ace = Math.round(avgScores.ace / counts.ace)
  if (counts.tie > 0) avgScores.tie = Math.round(avgScores.tie / counts.tie)

  return NextResponse.json({
    total,
    green,
    yellow,
    red,
    flightRisk: red,
    phases,
    avgScores,
  })
}
