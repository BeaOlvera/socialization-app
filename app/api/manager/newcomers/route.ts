import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole, getSessionFromRequest } from '@/lib/auth'
import { daysSinceStart } from '@/lib/scores'

// GET — list newcomers managed by current user
export async function GET(request: NextRequest) {
  const authError = checkRole(request, ['manager'])
  if (authError) return authError

  const session = getSessionFromRequest(request)!

  const { data: newcomers, error } = await supabaseAdmin
    .from('newcomers')
    .select(`
      *,
      user:users!newcomers_user_id_fkey(name, email)
    `)
    .eq('manager_id', session.userId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Enrich with day count and latest scores
  const enriched = await Promise.all((newcomers || []).map(async (n) => {
    const day = daysSinceStart(n.start_date)

    // Get latest self-scores
    const { data: scores } = await supabaseAdmin
      .from('dimension_scores_history')
      .select('dimension, score, source')
      .eq('newcomer_id', n.id)
      .order('recorded_at', { ascending: false })
      .limit(6)

    const latestScores = { fit: 0, ace: 0, tie: 0 }
    const selfScore = { fit: 0, ace: 0, tie: 0 }
    const managerScore = { fit: 0, ace: 0, tie: 0 }

    for (const s of scores || []) {
      const dim = s.dimension as 'fit' | 'ace' | 'tie'
      if (s.source === 'self' && selfScore[dim] === 0) selfScore[dim] = s.score
      if (s.source === 'manager' && managerScore[dim] === 0) managerScore[dim] = s.score
      if (latestScores[dim] === 0) latestScores[dim] = s.score
    }

    const selfAvg = Math.round((selfScore.fit + selfScore.ace + selfScore.tie) / 3)
    const managerAvg = Math.round((managerScore.fit + managerScore.ace + managerScore.tie) / 3)

    return {
      ...n,
      day,
      scores: latestScores,
      selfScore: selfAvg,
      managerScore: managerAvg,
    }
  }))

  return NextResponse.json(enriched)
}
