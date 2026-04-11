import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole, getSessionFromRequest } from '@/lib/auth'

// GET — tasks assigned to this manager (check-ins, 1:1s, etc.)
export async function GET(request: NextRequest) {
  const authError = checkRole(request, ['manager'])
  if (authError) return authError

  const session = getSessionFromRequest(request)!

  // Get tasks assigned to this user
  const { data: tasks } = await supabaseAdmin
    .from('phase_tasks')
    .select('id, activity, label, due_date, done, dimension, type, newcomer_id, assigned_to')
    .eq('assigned_to_user_id', session.userId)
    .order('due_date', { ascending: true })

  if (!tasks || tasks.length === 0) {
    // Fallback: get tasks assigned_to='manager' for newcomers managed by this user
    const { data: newcomers } = await supabaseAdmin
      .from('newcomers')
      .select('id, user_id')
      .eq('manager_id', session.userId)

    if (!newcomers || newcomers.length === 0) return NextResponse.json([])

    const newcomerIds = newcomers.map(n => n.id)
    const { data: mgrTasks } = await supabaseAdmin
      .from('phase_tasks')
      .select('id, activity, label, due_date, done, dimension, type, newcomer_id')
      .in('newcomer_id', newcomerIds)
      .eq('assigned_to', 'manager')
      .order('due_date', { ascending: true })

    // Get newcomer names
    const userIds = newcomers.map(n => n.user_id)
    const { data: users } = await supabaseAdmin
      .from('users')
      .select('id, name')
      .in('id', userIds)

    const newcomerUserMap: Record<string, string> = {}
    newcomers.forEach(n => {
      const user = users?.find(u => u.id === n.user_id)
      newcomerUserMap[n.id] = user?.name || 'Unknown'
    })

    const result = (mgrTasks || []).map(t => ({
      ...t,
      activity: t.activity || t.label,
      newcomer_name: newcomerUserMap[t.newcomer_id] || 'Unknown',
    }))

    return NextResponse.json(result)
  }

  // Get newcomer names for the tasks
  const newcomerIds = [...new Set(tasks.map(t => t.newcomer_id))]
  const { data: newcomers } = await supabaseAdmin
    .from('newcomers')
    .select('id, user_id')
    .in('id', newcomerIds)

  const userIds = newcomers?.map(n => n.user_id) || []
  const { data: users } = await supabaseAdmin
    .from('users')
    .select('id, name')
    .in('id', userIds.length > 0 ? userIds : ['none'])

  const newcomerNameMap: Record<string, string> = {}
  newcomers?.forEach(n => {
    const user = users?.find(u => u.id === n.user_id)
    newcomerNameMap[n.id] = user?.name || 'Unknown'
  })

  const result = tasks.map(t => ({
    ...t,
    activity: t.activity || t.label,
    newcomer_name: newcomerNameMap[t.newcomer_id] || 'Unknown',
  }))

  return NextResponse.json(result)
}

// PATCH — mark a manager check-in task as done
export async function PATCH(request: NextRequest) {
  const authError = checkRole(request, ['manager'])
  if (authError) return authError

  const session = getSessionFromRequest(request)!
  const { taskId, done } = await request.json()

  if (!taskId || typeof done !== 'boolean') {
    return NextResponse.json({ error: 'taskId and done required' }, { status: 400 })
  }

  // Verify this task belongs to a newcomer managed by this user
  const { data: task } = await supabaseAdmin
    .from('phase_tasks')
    .select('id, newcomer_id, assigned_to')
    .eq('id', taskId)
    .single()

  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

  const { data: newcomer } = await supabaseAdmin
    .from('newcomers')
    .select('id')
    .eq('id', task.newcomer_id)
    .eq('manager_id', session.userId)
    .single()

  if (!newcomer) return NextResponse.json({ error: 'Not authorized' }, { status: 403 })

  const { data: updated, error } = await supabaseAdmin
    .from('phase_tasks')
    .update({ done, completed_at: done ? new Date().toISOString() : null })
    .eq('id', taskId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(updated)
}
