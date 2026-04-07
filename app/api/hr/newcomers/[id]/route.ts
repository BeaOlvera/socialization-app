import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole, getSessionFromRequest } from '@/lib/auth'

// GET — full newcomer detail with scores, checkins, tasks
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['hr_admin', 'manager'])
  if (authError) return authError

  const { id } = await params

  // Fetch newcomer with relations
  const { data: newcomer, error } = await supabaseAdmin
    .from('newcomers')
    .select(`
      *,
      user:users!newcomers_user_id_fkey(name, email, token),
      manager:users!newcomers_manager_id_fkey(name, email),
      buddy:users!newcomers_buddy_id_fkey(name, email)
    `)
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: 'Newcomer not found' }, { status: 404 })

  // Fetch checkins
  const { data: checkins } = await supabaseAdmin
    .from('checkins')
    .select('*')
    .eq('newcomer_id', id)
    .order('month_number', { ascending: true })

  // Fetch score history
  const { data: scoreHistory } = await supabaseAdmin
    .from('dimension_scores_history')
    .select('*')
    .eq('newcomer_id', id)
    .order('recorded_at', { ascending: true })

  // Fetch team members
  const { data: teamMembers } = await supabaseAdmin
    .from('team_members')
    .select('*')
    .eq('newcomer_id', id)

  return NextResponse.json({
    newcomer,
    checkins: checkins || [],
    scoreHistory: scoreHistory || [],
    teamMembers: teamMembers || [],
  })
}

// PUT — update newcomer
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['hr_admin'])
  if (authError) return authError

  const { id } = await params
  const body = await request.json()
  const { data, error } = await supabaseAdmin
    .from('newcomers')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE — delete newcomer and all associated data (cascading)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['hr_admin'])
  if (authError) return authError

  const { id } = await params

  // Get user_id to delete the user record too
  const { data: newcomer } = await supabaseAdmin
    .from('newcomers')
    .select('user_id')
    .eq('id', id)
    .single()

  // Delete newcomer (cascades to checkins, messages, tasks, actions, scores)
  await supabaseAdmin.from('newcomers').delete().eq('id', id)

  // Delete the user record
  if (newcomer?.user_id) {
    await supabaseAdmin.from('users').delete().eq('id', newcomer.user_id)
  }

  return NextResponse.json({ ok: true })
}
