import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole } from '@/lib/auth'

// GET — list newcomers for a company (admin view)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['admin'])
  if (authError) return authError
  const { id } = await params

  const { data: newcomers } = await supabaseAdmin
    .from('newcomers')
    .select('id, user_id, department, position, start_date, status, current_phase')
    .eq('company_id', id)
    .order('start_date', { ascending: false })

  if (!newcomers || newcomers.length === 0) {
    return NextResponse.json([])
  }

  // Get user names
  const userIds = newcomers.map(n => n.user_id)
  const { data: users } = await supabaseAdmin
    .from('users')
    .select('id, name, email')
    .in('id', userIds)

  const userMap: Record<string, { name: string; email: string }> = {}
  users?.forEach(u => { userMap[u.id] = { name: u.name, email: u.email } })

  const result = newcomers.map(n => ({
    ...n,
    user_name: userMap[n.user_id]?.name || 'Unknown',
    user_email: userMap[n.user_id]?.email || '',
  }))

  return NextResponse.json(result)
}
