import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole, getSessionFromRequest } from '@/lib/auth'
import { getPreArrivalSummary } from '@/lib/pre-arrival-summary'

// GET — manager sees full summary for their newcomer
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['manager'])
  if (authError) return authError

  const session = getSessionFromRequest(request)!
  const { id } = await params

  // Verify this newcomer belongs to this manager
  const { data: newcomer } = await supabaseAdmin
    .from('newcomers').select('id').eq('id', id).eq('manager_id', session.userId).single()

  if (!newcomer) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const summary = await getPreArrivalSummary(id)
  return NextResponse.json(summary)
}
