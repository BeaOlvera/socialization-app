import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole, getSessionFromRequest } from '@/lib/auth'

// GET — get own phase tasks
export async function GET(request: NextRequest) {
  const authError = checkRole(request, ['newcomer'])
  if (authError) return authError

  const session = getSessionFromRequest(request)!

  const { data: newcomer } = await supabaseAdmin
    .from('newcomers').select('id').eq('user_id', session.userId).single()
  if (!newcomer) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: tasks } = await supabaseAdmin
    .from('phase_tasks')
    .select('*')
    .eq('newcomer_id', newcomer.id)
    .order('phase').order('dimension').order('task_index')

  return NextResponse.json(tasks || [])
}

// PATCH — toggle task completion
export async function PATCH(request: NextRequest) {
  const authError = checkRole(request, ['newcomer'])
  if (authError) return authError

  const session = getSessionFromRequest(request)!
  const { taskId, done } = await request.json()

  if (!taskId || typeof done !== 'boolean') {
    return NextResponse.json({ error: 'taskId and done are required' }, { status: 400 })
  }

  // Verify task belongs to this newcomer
  const { data: newcomer } = await supabaseAdmin
    .from('newcomers').select('id').eq('user_id', session.userId).single()
  if (!newcomer) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: task, error } = await supabaseAdmin
    .from('phase_tasks')
    .update({
      done,
      completed_at: done ? new Date().toISOString() : null,
    })
    .eq('id', taskId)
    .eq('newcomer_id', newcomer.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(task)
}
