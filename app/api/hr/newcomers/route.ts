import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole, getSessionFromRequest, hashPassword } from '@/lib/auth'
import { PHASE_TASK_TEMPLATES } from '@/lib/framework'

// GET — list newcomers for company, with optional filters
export async function GET(request: NextRequest) {
  const authError = checkRole(request, ['hr_admin', 'manager'])
  if (authError) return authError

  const session = getSessionFromRequest(request)!
  const url = new URL(request.url)
  const status = url.searchParams.get('status')
  const phase = url.searchParams.get('phase')

  let query = supabaseAdmin
    .from('newcomers')
    .select(`
      *,
      user:users!newcomers_user_id_fkey(name, email),
      manager:users!newcomers_manager_id_fkey(name)
    `)
    .eq('company_id', session.companyId)

  if (status) query = query.eq('status', status)
  if (phase) query = query.eq('current_phase', phase)

  // Managers only see their own newcomers
  if (session.role === 'manager') {
    query = query.eq('manager_id', session.userId)
  }

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST — create a newcomer (creates user + newcomer + phase tasks)
export async function POST(request: NextRequest) {
  const authError = checkRole(request, ['hr_admin'])
  if (authError) return authError

  const session = getSessionFromRequest(request)!
  const body = await request.json()
  const { name, email, department, position, start_date, manager_id, buddy_id } = body

  if (!name || !email || !start_date) {
    return NextResponse.json({ error: 'Name, email and start date are required' }, { status: 400 })
  }

  // Create user record for the newcomer
  const { data: user, error: userError } = await supabaseAdmin
    .from('users')
    .insert({
      company_id: session.companyId,
      email: email.toLowerCase().trim(),
      name,
      role: 'newcomer',
    })
    .select()
    .single()

  if (userError) {
    if (userError.message.includes('duplicate')) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  // Create newcomer record
  const { data: newcomer, error: newcomerError } = await supabaseAdmin
    .from('newcomers')
    .insert({
      user_id: user.id,
      company_id: session.companyId,
      manager_id: manager_id || null,
      buddy_id: buddy_id || null,
      department,
      position,
      start_date,
    })
    .select()
    .single()

  if (newcomerError) {
    return NextResponse.json({ error: newcomerError.message }, { status: 500 })
  }

  // Generate phase tasks from templates
  const tasks = PHASE_TASK_TEMPLATES.map(t => ({
    newcomer_id: newcomer.id,
    phase: t.phase,
    dimension: t.dimension,
    task_index: t.task_index,
    label: t.label,
  }))

  await supabaseAdmin.from('phase_tasks').insert(tasks)

  return NextResponse.json({ user, newcomer, inviteToken: user.token }, { status: 201 })
}
