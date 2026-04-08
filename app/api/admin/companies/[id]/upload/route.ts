import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole } from '@/lib/auth'
import * as XLSX from 'xlsx'

// POST — upload Excel file (activities or check-ins)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['admin'])
  if (authError) return authError
  const { id } = await params

  const formData = await request.formData()
  const file = formData.get('file') as File
  const type = (formData.get('type') as string) || 'activity'

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  // Parse Excel
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet)

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Excel file is empty' }, { status: 400 })
  }

  // Phase name mapping
  const PHASE_MAP: Record<string, string> = {
    'Pre-arrival': 'pre_arrival',
    'Arrival': 'arrival',
    'Integration': 'integration',
    'Adjustment': 'adjustment',
    'Stabilization': 'stabilization',
    'Embedding': 'embedding',
  }

  const DIM_MAP: Record<string, string> = {
    'FIT': 'fit', 'ACE': 'ace', 'TIE': 'tie',
    'FIT, ACE, TIE': 'fit', 'FIT, TIE': 'fit', 'FIT, ACE': 'fit',
    'TIE, ACE': 'tie', 'ACE, TIE': 'ace',
  }

  const ASSIGNED_MAP: Record<string, string> = {
    'Newcomer (self)': 'newcomer',
    'Newcomer alone': 'newcomer',
    'Newcomer': 'newcomer',
    'Manager': 'manager',
    'Buddy': 'buddy',
    'HR Admin': 'hr',
    'HR': 'hr',
  }

  // Delete existing templates of this type for this company
  await supabaseAdmin
    .from('activity_templates')
    .delete()
    .eq('company_id', id)
    .eq('type', type)

  // Map rows to templates
  const templates = rows.map((row, i) => {
    if (type === 'checkin') {
      // Check-in Excel columns: Phase, Month, Week, Day(s), Check-in Type, Who Initiates, Who Participates, Format, Duration, Dimensions Covered, Key Focus, Output
      const phase = PHASE_MAP[row['Phase']] || row['Phase']?.toLowerCase() || 'arrival'
      const dims = (row['Dimensions Covered'] || 'fit').toString()
      const primaryDim = DIM_MAP[dims] || dims.split(',')[0]?.trim().toLowerCase() || 'fit'
      const initiator = row['Who Initiates'] || ''
      const assignedTo = ASSIGNED_MAP[initiator] || 'newcomer'

      return {
        company_id: id,
        phase,
        week: row['Week']?.toString() || null,
        days: row['Day(s)']?.toString() || null,
        dimension: primaryDim,
        subdimension: row['Dimensions Covered']?.toString() || null,
        activity: row['Check-in Type'] || row['Activity'] || 'Check-in',
        who: row['Who Participates'] || row['Who'] || null,
        estimated_time: row['Duration'] || null,
        builds_on: row['Key Focus / Questions'] || null,
        output: row['Output / Deliverable'] || row['Output'] || null,
        type: 'checkin',
        assigned_to: assignedTo,
        format: row['Format'] || null,
        duration: row['Duration'] || null,
        sort_order: i,
        active: true,
      }
    } else {
      // Activity Excel columns: Phase, Week, Day(s), Dimension, Subdimension, Activity, Who, Est. Time, Builds On, Output / Deliverable
      const phase = PHASE_MAP[row['Phase']] || row['Phase']?.toLowerCase() || 'arrival'
      const dim = DIM_MAP[row['Dimension']] || row['Dimension']?.toLowerCase() || 'fit'
      const who = row['Who'] || null
      const assignedTo = ASSIGNED_MAP[who] || 'newcomer'

      let buildsOn = row['Builds On'] || null
      if (buildsOn && typeof buildsOn === 'string' && ['\u2014', '\u2013', '-', '\u2212'].includes(buildsOn.trim())) {
        buildsOn = null
      }

      return {
        company_id: id,
        phase,
        week: row['Week']?.toString() || null,
        days: row['Day(s)']?.toString() || null,
        dimension: dim,
        subdimension: row['Subdimension'] || null,
        activity: row['Activity'] || 'Activity',
        who,
        estimated_time: row['Est. Time'] || null,
        builds_on: buildsOn,
        output: row['Output / Deliverable'] || row['Output'] || null,
        type: 'activity',
        assigned_to: assignedTo,
        format: null,
        duration: null,
        sort_order: i,
        active: true,
      }
    }
  })

  // Insert in batches
  const batchSize = 50
  for (let start = 0; start < templates.length; start += batchSize) {
    const batch = templates.slice(start, start + batchSize)
    const { error } = await supabaseAdmin.from('activity_templates').insert(batch)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ count: templates.length }, { status: 201 })
}
