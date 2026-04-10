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

  const { data: allTasks } = await supabaseAdmin
    .from('phase_tasks')
    .select('*')
    .eq('newcomer_id', newcomer.id)
    .order('phase').order('dimension').order('task_index')

  if (!allTasks) return NextResponse.json([])

  // Filter check-ins:
  // 1. Only show check-ins assigned to 'newcomer' (not manager/buddy/HR ones)
  // 2. Only show when due (within 7 days) or already done
  const now = new Date()
  const windowDays = 7
  const cutoff = new Date(now.getTime() + windowDays * 24 * 60 * 60 * 1000)

  const tasks = allTasks.filter(t => {
    // Activities always visible
    if ((t.type || 'activity') !== 'checkin') return true
    // Hide check-ins not assigned to newcomer
    if (t.assigned_to && t.assigned_to !== 'newcomer') return false
    // Completed check-ins always visible
    if (t.done) return true
    // Check-ins without due_date always visible
    if (!t.due_date) return true
    // Check-ins with due_date: show if due_date <= today + 7 days
    const dueDate = new Date(t.due_date)
    return dueDate <= cutoff
  })

  return NextResponse.json(tasks)
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
