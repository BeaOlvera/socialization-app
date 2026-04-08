import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole, getSessionFromRequest } from '@/lib/auth'

// GET — get all tasks for a newcomer (manager view)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['manager', 'hr_admin'])
  if (authError) return authError

  const session = getSessionFromRequest(request)!
  const { id } = await params

  // Verify this newcomer belongs to this manager (or HR can see all)
  const query = supabaseAdmin
    .from('newcomers')
    .select('id')
    .eq('id', id)

  if (session.role === 'manager') {
    query.eq('manager_id', session.userId)
  }

  const { data: newcomer } = await query.single()
  if (!newcomer) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: tasks } = await supabaseAdmin
    .from('phase_tasks')
    .select('*')
    .eq('newcomer_id', id)
    .order('phase').order('dimension').order('task_index')

  return NextResponse.json(tasks || [])
}
