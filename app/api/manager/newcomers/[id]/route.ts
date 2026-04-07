import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole, getSessionFromRequest } from '@/lib/auth'
import { daysSinceStart } from '@/lib/scores'

// GET — detailed newcomer view for manager (includes divergence data)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['manager'])
  if (authError) return authError

  const session = getSessionFromRequest(request)!
  const { id } = await params

  // Verify this newcomer belongs to this manager
  const { data: newcomer, error } = await supabaseAdmin
    .from('newcomers')
    .select(`
      *,
      user:users!newcomers_user_id_fkey(name, email),
      buddy:users!newcomers_buddy_id_fkey(name)
    `)
    .eq('id', id)
    .eq('manager_id', session.userId)
    .single()

  if (error || !newcomer) {
    return NextResponse.json({ error: 'Newcomer not found or not your direct report' }, { status: 404 })
  }

  const day = daysSinceStart(newcomer.start_date)

  // Fetch checkins, score history
  const [checkinsRes, scoresRes] = await Promise.all([
    supabaseAdmin.from('checkins').select('*').eq('newcomer_id', id).order('month_number'),
    supabaseAdmin.from('dimension_scores_history').select('*').eq('newcomer_id', id).order('recorded_at'),
  ])

  return NextResponse.json({
    newcomer: { ...newcomer, day },
    checkins: checkinsRes.data || [],
    scoreHistory: scoresRes.data || [],
  })
}
