import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole, getSessionFromRequest } from '@/lib/auth'
import { hashPassword } from '@/lib/auth'

// GET — list all companies (admin sees all)
export async function GET(request: NextRequest) {
  const authError = checkRole(request, ['admin'])
  if (authError) return authError

  const { data: companies } = await supabaseAdmin
    .from('companies')
    .select('id, name, industry, size, created_at')
    .order('created_at', { ascending: false })

  // Get newcomer counts per company
  const { data: newcomerCounts } = await supabaseAdmin
    .from('newcomers')
    .select('company_id')

  const counts: Record<string, number> = {}
  newcomerCounts?.forEach(n => {
    counts[n.company_id] = (counts[n.company_id] || 0) + 1
  })

  const result = (companies || []).map(c => ({
    ...c,
    newcomer_count: counts[c.id] || 0,
  }))

  return NextResponse.json(result)
}

// POST — create a new company + HR admin user + config
export async function POST(request: NextRequest) {
  const authError = checkRole(request, ['admin'])
  if (authError) return authError

  const body = await request.json()
  const { name, industry, size, mission, hr_email, hr_name, hr_password, has_buddies } = body

  if (!name || !hr_email || !hr_name || !hr_password) {
    return NextResponse.json({ error: 'name, hr_email, hr_name, hr_password required' }, { status: 400 })
  }

  // Create company (convert empty strings to null)
  const { data: company, error: compError } = await supabaseAdmin
    .from('companies')
    .insert({
      name,
      industry: industry || null,
      size: size || null,
      mission: mission || null,
    })
    .select()
    .single()

  if (compError) return NextResponse.json({ error: compError.message }, { status: 500 })

  // Create company config
  await supabaseAdmin.from('company_config').insert({
    company_id: company.id,
    has_buddies: has_buddies !== false,
  })

  // Create HR admin user
  const passwordHash = await hashPassword(hr_password)
  const { data: hrUser, error: hrError } = await supabaseAdmin
    .from('users')
    .insert({
      company_id: company.id,
      email: hr_email.toLowerCase().trim(),
      name: hr_name,
      role: 'hr_admin',
      password_hash: passwordHash,
    })
    .select()
    .single()

  if (hrError) return NextResponse.json({ error: hrError.message }, { status: 500 })

  return NextResponse.json({ company, hr_user: { id: hrUser.id, email: hrUser.email } }, { status: 201 })
}
