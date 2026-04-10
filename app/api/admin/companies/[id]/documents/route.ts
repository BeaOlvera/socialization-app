import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole } from '@/lib/auth'

const DEFAULT_DOCS = [
  { dimension: 'fit', title: 'Job Description', description: 'Full role description, responsibilities, and reporting line', sort_order: 0 },
  { dimension: 'fit', title: 'Org Chart', description: 'Company organizational structure', sort_order: 1 },
  { dimension: 'fit', title: 'Strategic Plan', description: 'Company strategy and annual objectives', sort_order: 2 },
  { dimension: 'fit', title: 'RACI Matrix', description: 'Decision rights and responsibility assignments', sort_order: 3 },
  { dimension: 'ace', title: '30-60-90 Day Plan', description: 'Onboarding milestones and training schedule', sort_order: 4 },
  { dimension: 'ace', title: 'Performance Appraisal Template', description: 'How performance is evaluated and when', sort_order: 5 },
  { dimension: 'ace', title: 'SOPs & Playbooks', description: 'Standard operating procedures for key processes', sort_order: 6 },
  { dimension: 'ace', title: 'Tools & Systems Guide', description: 'Access and usage guides for company tools', sort_order: 7 },
  { dimension: 'tie', title: 'Company Values & Culture Guide', description: 'Mission, values, and how they are lived', sort_order: 8 },
  { dimension: 'tie', title: 'Team Rituals & Meetings', description: 'Regular meetings, social events, team norms', sort_order: 9 },
  { dimension: 'tie', title: 'Employee Communities & ERGs', description: 'Internal groups, networks, and how to join', sort_order: 10 },
  { dimension: 'tie', title: 'Welcome Pack', description: 'Welcome letter and first-day information', sort_order: 11 },
]

// GET — list documents for a company (creates defaults if none exist)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['admin'])
  if (authError) return authError
  const { id } = await params

  let { data: docs } = await supabaseAdmin
    .from('company_documents')
    .select('*')
    .eq('company_id', id)
    .order('sort_order')

  // Seed defaults if none exist
  if (!docs || docs.length === 0) {
    const defaults = DEFAULT_DOCS.map(d => ({
      ...d,
      company_id: id,
      visible: true,
      is_default: true,
    }))
    await supabaseAdmin.from('company_documents').insert(defaults)
    const { data } = await supabaseAdmin
      .from('company_documents')
      .select('*')
      .eq('company_id', id)
      .order('sort_order')
    docs = data
  }

  return NextResponse.json(docs || [])
}

// POST — add a new document
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['admin'])
  if (authError) return authError
  const { id } = await params
  const body = await request.json()

  const { data, error } = await supabaseAdmin
    .from('company_documents')
    .insert({
      company_id: id,
      dimension: body.dimension || 'fit',
      title: body.title,
      description: body.description || null,
      url: body.url || null,
      visible: body.visible !== false,
      sort_order: body.sort_order ?? 99,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

// PATCH — update document (toggle visibility, edit title, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['admin'])
  if (authError) return authError
  const body = await request.json()
  const { docId, ...updates } = body

  if (!docId) return NextResponse.json({ error: 'docId required' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('company_documents')
    .update(updates)
    .eq('id', docId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE — remove a document
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['admin'])
  if (authError) return authError
  const { docId } = await request.json()

  if (!docId) return NextResponse.json({ error: 'docId required' }, { status: 400 })

  await supabaseAdmin.from('company_documents').delete().eq('id', docId)
  return NextResponse.json({ ok: true })
}
