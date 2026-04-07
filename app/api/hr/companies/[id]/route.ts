import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['hr_admin'])
  if (authError) return authError

  const { id } = await params
  const { data, error } = await supabaseAdmin.from('companies').select('*').eq('id', id).single()
  if (error) return NextResponse.json({ error: 'Company not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['hr_admin'])
  if (authError) return authError

  const { id } = await params
  const body = await request.json()
  const { data, error } = await supabaseAdmin.from('companies').update(body).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['hr_admin'])
  if (authError) return authError

  const { id } = await params
  const { error } = await supabaseAdmin.from('companies').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
