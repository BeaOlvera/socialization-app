import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole, getSessionFromRequest } from '@/lib/auth'

// POST — copy activity templates to a newcomer's phase_tasks
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['hr_admin'])
  if (authError) return authError

  const session = getSessionFromRequest(request)!
  const { id } = await params

  // Verify newcomer exists and belongs to this company
  const { data: newcomer } = await supabaseAdmin
    .from('newcomers')
    .select('id, company_id')
    .eq('id', id)
    .eq('company_id', session.companyId)
    .single()

  if (!newcomer) return NextResponse.json({ error: 'Newcomer not found' }, { status: 404 })

  // Get active templates for this company
  const { data: templates } = await supabaseAdmin
    .from('activity_templates')
    .select('*')
    .eq('company_id', session.companyId)
    .eq('active', true)
    .order('sort_order')

  if (!templates || templates.length === 0) {
    return NextResponse.json({ error: 'No activity templates found. Upload templates first.' }, { status: 400 })
  }

  // Delete existing phase_tasks for this newcomer (fresh assignment)
  await supabaseAdmin.from('phase_tasks').delete().eq('newcomer_id', id)

  // Copy templates to phase_tasks
  const tasks = templates.map((t, i) => ({
    newcomer_id: id,
    phase: t.phase === 'pre_arrival' ? 'arrival' : t.phase, // pre_arrival maps to arrival phase in tasks
    dimension: t.dimension,
    task_index: i,
    label: t.activity,
    week: t.week,
    days: t.days,
    subdimension: t.subdimension,
    activity: t.activity,
    who: t.who,
    estimated_time: t.estimated_time,
    builds_on: t.builds_on,
    output: t.output,
    type: t.type || 'activity',
    assigned_to: t.assigned_to || 'newcomer',
    format: t.format || null,
    duration: t.duration || null,
    done: false,
  }))

  const { data, error } = await supabaseAdmin
    .from('phase_tasks')
    .insert(tasks)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ assigned: data?.length || 0 }, { status: 201 })
}
