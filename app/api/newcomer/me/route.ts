import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole, getSessionFromRequest } from '@/lib/auth'
import { daysSinceStart, phaseFromDay } from '@/lib/scores'

// GET — current newcomer's full profile with scores, team, tasks, actions
export async function GET(request: NextRequest) {
  const authError = checkRole(request, ['newcomer'])
  if (authError) return authError

  const session = getSessionFromRequest(request)!

  // Get newcomer record linked to this user
  const { data: newcomer, error } = await supabaseAdmin
    .from('newcomers')
    .select(`
      *,
      manager:users!newcomers_manager_id_fkey(name, email),
      buddy:users!newcomers_buddy_id_fkey(name, email)
    `)
    .eq('user_id', session.userId)
    .single()

  if (error || !newcomer) {
    return NextResponse.json({ error: 'Newcomer profile not found' }, { status: 404 })
  }

  // Compute current day and phase
  const day = daysSinceStart(newcomer.start_date)
  const phase = phaseFromDay(day)

  // Update phase if changed
  if (phase !== newcomer.current_phase) {
    await supabaseAdmin.from('newcomers').update({ current_phase: phase }).eq('id', newcomer.id)
  }

  // Fetch related data in parallel
  const [teamRes, tasksRes, actionsRes, checkinsRes, scoresRes] = await Promise.all([
    supabaseAdmin.from('team_members').select('*').eq('newcomer_id', newcomer.id),
    supabaseAdmin.from('phase_tasks').select('*').eq('newcomer_id', newcomer.id).order('task_index'),
    supabaseAdmin.from('actions').select('*').eq('newcomer_id', newcomer.id).eq('completed', false).order('urgent', { ascending: false }),
    supabaseAdmin.from('checkins').select('*').eq('newcomer_id', newcomer.id).order('month_number'),
    supabaseAdmin.from('dimension_scores_history').select('*').eq('newcomer_id', newcomer.id).order('recorded_at'),
  ])

  // Compute latest dimension scores from history
  const latestScores = { fit: 0, ace: 0, tie: 0 }
  for (const s of (scoresRes.data || []).reverse()) {
    if (s.source === 'self') {
      const dim = s.dimension as 'fit' | 'ace' | 'tie'
      if (latestScores[dim] === 0) latestScores[dim] = s.score
    }
  }

  return NextResponse.json({
    newcomer: {
      ...newcomer,
      day,
      current_phase: phase,
    },
    company: { name: session.name }, // from JWT — enriched later
    user: { name: session.name, email: session.email },
    teamMembers: teamRes.data || [],
    tasks: tasksRes.data || [],
    actions: actionsRes.data || [],
    checkins: checkinsRes.data || [],
    scoreHistory: scoresRes.data || [],
    latestScores,
  })
}
