import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole } from '@/lib/auth'

// POST — assign templates to a newcomer (activities + check-ins with dates)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; newcomerId: string }> }
) {
  const authError = checkRole(request, ['admin', 'hr_admin'])
  if (authError) return authError
  const { id, newcomerId } = await params

  // Get newcomer with start_date
  const { data: newcomer } = await supabaseAdmin
    .from('newcomers')
    .select('id, start_date, manager_id, buddy_id, company_id')
    .eq('id', newcomerId)
    .eq('company_id', id)
    .single()

  if (!newcomer) return NextResponse.json({ error: 'Newcomer not found' }, { status: 404 })

  // Get company config
  const { data: config } = await supabaseAdmin
    .from('company_config')
    .select('has_buddies')
    .eq('company_id', id)
    .single()

  const hasBuddies = config?.has_buddies !== false

  // Get active templates
  const { data: templates } = await supabaseAdmin
    .from('activity_templates')
    .select('*')
    .eq('company_id', id)
    .eq('active', true)
    .order('sort_order')

  if (!templates || templates.length === 0) {
    return NextResponse.json({ error: 'No templates found. Upload templates first.' }, { status: 400 })
  }

  // Filter out buddy check-ins if no buddies
  const filtered = hasBuddies
    ? templates
    : templates.filter(t => t.assigned_to !== 'buddy')

  // Delete existing tasks
  await supabaseAdmin.from('phase_tasks').delete().eq('newcomer_id', newcomerId)

  // Calculate due dates from start_date
  const startDate = new Date(newcomer.start_date)

  function calcDueDate(days: string | null, week: string | null): string | null {
    if (!days && !week) return null
    let dayOffset = 0

    // Parse "Day X" or "X days before"
    if (days) {
      const dayMatch = days.match(/Day\s+(\d+)/i)
      if (dayMatch) {
        dayOffset = parseInt(dayMatch[1])
      }
      const beforeMatch = days.match(/(\d+)\s+days?\s+before/i)
      if (beforeMatch) {
        dayOffset = -parseInt(beforeMatch[1])
      }
    }
    // Parse week number
    if (!dayOffset && week) {
      const weekMatch = week.match(/-?(\d+)/i)
      if (weekMatch) {
        const w = parseInt(week.match(/-?\d+/)![0])
        dayOffset = w * 7
      }
    }

    const date = new Date(startDate)
    date.setDate(date.getDate() + dayOffset)
    return date.toISOString().split('T')[0]
  }

  // Map assigned_to to actual user_id
  function resolveAssignedUser(assignedTo: string): string | null {
    switch (assignedTo) {
      case 'manager': return newcomer!.manager_id
      case 'buddy': return newcomer!.buddy_id
      case 'newcomer': return null // newcomer sees via newcomer_id
      case 'hr': return null // HR sees via company queries
      default: return null
    }
  }

  const tasks = filtered.map((t, i) => ({
    newcomer_id: newcomerId,
    phase: t.phase === 'pre_arrival' ? 'arrival' : t.phase,
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
    assigned_to_user_id: resolveAssignedUser(t.assigned_to || 'newcomer'),
    due_date: calcDueDate(t.days, t.week),
    format: t.format,
    duration: t.duration,
    done: false,
  }))

  // Insert in batches
  const batchSize = 50
  for (let start = 0; start < tasks.length; start += batchSize) {
    const batch = tasks.slice(start, start + batchSize)
    const { error } = await supabaseAdmin.from('phase_tasks').insert(batch)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    assigned: tasks.length,
    activities: tasks.filter(t => t.type === 'activity').length,
    checkins: tasks.filter(t => t.type === 'checkin').length,
  }, { status: 201 })
}
