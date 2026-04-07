import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole, getSessionFromRequest } from '@/lib/auth'

// GET — list companies for current user's company (or all for super admin)
export async function GET(request: NextRequest) {
  const authError = checkRole(request, ['hr_admin'])
  if (authError) return authError

  const session = getSessionFromRequest(request)!
  const { data, error } = await supabaseAdmin
    .from('companies')
    .select('*')
    .eq('id', session.companyId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST — create a new company
export async function POST(request: NextRequest) {
  const authError = checkRole(request, ['hr_admin'])
  if (authError) return authError

  const body = await request.json()
  const { name, industry, size, mission } = body

  if (!name) return NextResponse.json({ error: 'Company name is required' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('companies')
    .insert({ name, industry, size, mission })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
