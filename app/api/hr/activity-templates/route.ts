import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole, getSessionFromRequest } from '@/lib/auth'

// GET — list all activity templates for the company
export async function GET(request: NextRequest) {
  const authError = checkRole(request, ['hr_admin'])
  if (authError) return authError

  const session = getSessionFromRequest(request)!

  const { data, error } = await supabaseAdmin
    .from('activity_templates')
    .select('*')
    .eq('company_id', session.companyId)
    .order('sort_order', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST — batch upload activity templates (replaces existing)
// Accepts JSON array of activities
export async function POST(request: NextRequest) {
  const authError = checkRole(request, ['hr_admin'])
  if (authError) return authError

  const session = getSessionFromRequest(request)!
  const body = await request.json()

  if (!Array.isArray(body.activities)) {
    return NextResponse.json({ error: 'activities array is required' }, { status: 400 })
  }

  const replace = body.replace !== false // default: replace all existing

  // If replacing, delete existing templates for this company
  if (replace) {
    await supabaseAdmin
      .from('activity_templates')
      .delete()
      .eq('company_id', session.companyId)
  }

  // Map phase names to DB values
  const phaseMap: Record<string, string> = {
    'Pre-arrival': 'pre_arrival',
    'pre_arrival': 'pre_arrival',
    'Arrival': 'arrival',
    'arrival': 'arrival',
    'Integration': 'integration',
    'integration': 'integration',
    'Adjustment': 'adjustment',
    'adjustment': 'adjustment',
    'Stabilization': 'stabilization',
    'stabilization': 'stabilization',
    'Embedding': 'embedding',
    'embedding': 'embedding',
  }

  const dimMap: Record<string, string> = {
    'FIT': 'fit', 'fit': 'fit',
    'ACE': 'ace', 'ace': 'ace',
    'TIE': 'tie', 'tie': 'tie',
  }

  // Insert templates
  const rows = body.activities.map((a: any, i: number) => ({
    company_id: session.companyId,
    phase: phaseMap[a.phase] || a.phase,
    week: a.week || null,
    days: a.days || null,
    dimension: dimMap[a.dimension] || a.dimension,
    subdimension: a.subdimension || null,
    activity: a.activity,
    who: a.who || null,
    estimated_time: a.estimated_time || null,
    builds_on: a.builds_on || null,
    output: a.output || null,
    sort_order: i,
    active: true,
  }))

  const { data, error } = await supabaseAdmin
    .from('activity_templates')
    .insert(rows)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ uploaded: data?.length || 0 }, { status: 201 })
}
