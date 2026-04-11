import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole } from '@/lib/auth'

// GET — list all employees (users) for a company
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['admin'])
  if (authError) return authError
  const { id } = await params

  const { data: users } = await supabaseAdmin
    .from('users')
    .select('id, email, name, role')
    .eq('company_id', id)
    .order('role').order('name')

  // Get newcomer records to show manager/buddy info
  const { data: newcomers } = await supabaseAdmin
    .from('newcomers')
    .select('user_id, manager_id, buddy_id, department, position, start_date')
    .eq('company_id', id)

  const newcomerMap: Record<string, any> = {}
  newcomers?.forEach(n => { newcomerMap[n.user_id] = n })

  const userMap: Record<string, string> = {}
  users?.forEach(u => { userMap[u.id] = u.name })

  const result = (users || []).map(u => ({
    ...u,
    department: newcomerMap[u.id]?.department || null,
    position: newcomerMap[u.id]?.position || u.role,
    start_date: newcomerMap[u.id]?.start_date || null,
    manager_name: newcomerMap[u.id]?.manager_id ? userMap[newcomerMap[u.id].manager_id] || null : null,
    buddy_name: newcomerMap[u.id]?.buddy_id ? userMap[newcomerMap[u.id].buddy_id] || null : null,
  }))

  return NextResponse.json(result)
}

// PATCH — update an employee
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['admin'])
  if (authError) return authError
  const { id: companyId } = await params
  const { userId, ...updates } = await request.json()

  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  // Update user fields
  const userFields: Record<string, any> = {}
  if (updates.name) userFields.name = updates.name
  if (updates.email) userFields.email = updates.email
  if (updates.role) userFields.role = updates.role

  if (Object.keys(userFields).length > 0) {
    await supabaseAdmin.from('users').update(userFields).eq('id', userId)
  }

  // Update newcomer fields if they exist
  if (updates.department || updates.position || updates.start_date) {
    const newcomerFields: Record<string, any> = {}
    if (updates.department) newcomerFields.department = updates.department
    if (updates.position) newcomerFields.position = updates.position
    if (updates.start_date) newcomerFields.start_date = updates.start_date

    await supabaseAdmin.from('newcomers').update(newcomerFields).eq('user_id', userId)
  }

  return NextResponse.json({ ok: true })
}

// DELETE — remove an employee
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['admin'])
  if (authError) return authError
  const { userId } = await request.json()

  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  // Delete newcomer record first (cascade will handle tasks, team_members, etc.)
  await supabaseAdmin.from('newcomers').delete().eq('user_id', userId)
  // Delete user
  await supabaseAdmin.from('users').delete().eq('id', userId)

  return NextResponse.json({ ok: true })
}
