import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole } from '@/lib/auth'

// GET — list all templates (activities + check-ins) for a company
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['admin'])
  if (authError) return authError
  const { id } = await params

  const { data } = await supabaseAdmin
    .from('activity_templates')
    .select('*')
    .eq('company_id', id)
    .order('sort_order')

  return NextResponse.json(data || [])
}

// POST — batch upload templates (replaces existing)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['admin'])
  if (authError) return authError
  const { id } = await params
  const { templates, replace } = await request.json()

  if (!Array.isArray(templates) || templates.length === 0) {
    return NextResponse.json({ error: 'templates array required' }, { status: 400 })
  }

  // Optionally replace all existing templates
  if (replace) {
    await supabaseAdmin.from('activity_templates').delete().eq('company_id', id)
  }

  // Insert with company_id
  const rows = templates.map((t: any, i: number) => ({
    company_id: id,
    phase: t.phase,
    week: t.week || null,
    days: t.days || null,
    dimension: t.dimension,
    subdimension: t.subdimension || null,
    activity: t.activity,
    who: t.who || null,
    estimated_time: t.estimated_time || null,
    builds_on: t.builds_on || null,
    output: t.output || null,
    type: t.type || 'activity',
    assigned_to: t.assigned_to || 'newcomer',
    format: t.format || null,
    duration: t.duration || null,
    sort_order: t.sort_order ?? i,
    active: t.active !== false,
  }))

  const { error } = await supabaseAdmin.from('activity_templates').insert(rows)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ uploaded: rows.length }, { status: 201 })
}
