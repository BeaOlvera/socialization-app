import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole } from '@/lib/auth'

// GET — get company config
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['admin'])
  if (authError) return authError
  const { id } = await params

  const { data: config } = await supabaseAdmin
    .from('company_config')
    .select('*')
    .eq('company_id', id)
    .single()

  return NextResponse.json(config || { has_buddies: true, checkin_frequency: 'monthly' })
}

// PATCH — update company config
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['admin'])
  if (authError) return authError
  const { id } = await params
  const body = await request.json()

  const { data, error } = await supabaseAdmin
    .from('company_config')
    .upsert({
      company_id: id,
      ...body,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'company_id' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
