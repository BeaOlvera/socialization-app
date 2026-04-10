import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole, getSessionFromRequest } from '@/lib/auth'
import { getPreArrivalSummaryForNewcomer } from '@/lib/pre-arrival-summary'

// GET — newcomer sees their own summary (no flight risk)
export async function GET(request: NextRequest) {
  const authError = checkRole(request, ['newcomer'])
  if (authError) return authError

  const session = getSessionFromRequest(request)!
  const { data: newcomer } = await supabaseAdmin
    .from('newcomers').select('id').eq('user_id', session.userId).single()

  if (!newcomer) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const summary = await getPreArrivalSummaryForNewcomer(newcomer.id)
  return NextResponse.json(summary)
}
