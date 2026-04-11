import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole } from '@/lib/auth'

// GET — org chart data for a company (all employees with reporting lines)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['admin'])
  if (authError) return authError
  const { id } = await params

  const { data: users } = await supabaseAdmin
    .from('users')
    .select('id, name, email, role')
    .eq('company_id', id)
    .order('name')

  const { data: newcomers } = await supabaseAdmin
    .from('newcomers')
    .select('user_id, manager_id, buddy_id, department, position')
    .eq('company_id', id)

  const newcomerMap: Record<string, any> = {}
  newcomers?.forEach(n => { newcomerMap[n.user_id] = n })

  const nodes = (users || []).map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    position: newcomerMap[u.id]?.position || u.role,
    department: newcomerMap[u.id]?.department || null,
    manager_id: newcomerMap[u.id]?.manager_id || null,
    buddy_id: newcomerMap[u.id]?.buddy_id || null,
    is_newcomer: u.role === 'newcomer',
  }))

  return NextResponse.json(nodes)
}
