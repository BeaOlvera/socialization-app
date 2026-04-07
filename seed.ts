/**
 * Seed script — creates a demo company with sample data for testing.
 * Run: npx tsx seed.ts
 * Requires: .env.local with SUPABASE_URL + SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function seed() {
  console.log('Seeding demo data...')

  // 1. Create company
  const { data: company } = await supabase
    .from('companies')
    .insert({
      name: 'Meridian Group',
      industry: 'Financial Services',
      size: '200_500',
      mission: 'Making financial services simple, reliable, and genuinely good.',
    })
    .select()
    .single()

  if (!company) { console.error('Failed to create company'); return }
  console.log(`  Company: ${company.name} (${company.id})`)

  const passwordHash = await bcrypt.hash('demo123', 12)

  // 2. Create HR admin
  const { data: hrUser } = await supabase.from('users').insert({
    company_id: company.id, email: 'hr@meridian.demo', name: 'Nina Johansson',
    role: 'hr_admin', password_hash: passwordHash,
  }).select().single()
  console.log(`  HR Admin: ${hrUser?.email} / demo123`)

  // 3. Create manager
  const { data: managerUser } = await supabase.from('users').insert({
    company_id: company.id, email: 'claire@meridian.demo', name: 'Claire Bennett',
    role: 'manager', password_hash: passwordHash,
  }).select().single()
  console.log(`  Manager: ${managerUser?.email} / demo123`)

  // 4. Create buddy user
  const { data: buddyUser } = await supabase.from('users').insert({
    company_id: company.id, email: 'james@meridian.demo', name: 'James Okafor',
    role: 'manager', password_hash: passwordHash,
  }).select().single()

  // 5. Create newcomer user
  const { data: newcomerUser } = await supabase.from('users').insert({
    company_id: company.id, email: 'sofia@meridian.demo', name: 'Sofia Martínez',
    role: 'newcomer', password_hash: passwordHash,
  }).select().single()
  console.log(`  Newcomer: ${newcomerUser?.email} / demo123`)
  console.log(`  Invite link: /invite/${newcomerUser?.token}`)

  // 6. Create newcomer record
  const { data: newcomer } = await supabase.from('newcomers').insert({
    user_id: newcomerUser!.id,
    company_id: company.id,
    manager_id: managerUser!.id,
    buddy_id: buddyUser!.id,
    department: 'Marketing',
    position: 'Senior Marketing Manager',
    start_date: '2026-03-03',
    current_phase: 'arrival',
    status: 'yellow',
  }).select().single()

  // 7. Seed phase tasks (arrival only for demo)
  const arrivalTasks = [
    { phase: 'arrival', dimension: 'fit', task_index: 0, label: 'Review job description & reporting line', done: true },
    { phase: 'arrival', dimension: 'fit', task_index: 1, label: 'Explore org chart and team structure', done: true },
    { phase: 'arrival', dimension: 'fit', task_index: 2, label: 'Understand first-quarter KPIs with manager', done: false },
    { phase: 'arrival', dimension: 'fit', task_index: 3, label: 'Map key stakeholders (RACI)', done: false },
    { phase: 'arrival', dimension: 'ace', task_index: 0, label: 'Complete tool onboarding', done: true },
    { phase: 'arrival', dimension: 'ace', task_index: 1, label: 'Start 30-60-90 day training plan', done: false },
    { phase: 'arrival', dimension: 'ace', task_index: 2, label: 'Locate SOPs & playbooks', done: true },
    { phase: 'arrival', dimension: 'ace', task_index: 3, label: 'Understand performance review timeline', done: true },
    { phase: 'arrival', dimension: 'tie', task_index: 0, label: 'Meet buddy / mentor', done: true },
    { phase: 'arrival', dimension: 'tie', task_index: 1, label: 'Attend first team rituals and All-Hands', done: true },
    { phase: 'arrival', dimension: 'tie', task_index: 2, label: 'Read company values guide', done: false },
    { phase: 'arrival', dimension: 'tie', task_index: 3, label: 'Meet 2 cross-functional contacts', done: false },
  ].map(t => ({ ...t, newcomer_id: newcomer!.id }))

  await supabase.from('phase_tasks').insert(arrivalTasks)

  // 8. Seed score history
  await supabase.from('dimension_scores_history').insert([
    { newcomer_id: newcomer!.id, dimension: 'fit', score: 62, source: 'self', recorded_at: '2026-03-21T10:00:00Z' },
    { newcomer_id: newcomer!.id, dimension: 'ace', score: 48, source: 'self', recorded_at: '2026-03-21T10:00:00Z' },
    { newcomer_id: newcomer!.id, dimension: 'tie', score: 35, source: 'self', recorded_at: '2026-03-21T10:00:00Z' },
  ])

  // 9. Seed team members
  await supabase.from('team_members').insert([
    { newcomer_id: newcomer!.id, name: 'Claire Bennett', role: 'VP Marketing', relation: 'manager', avatar: 'CB' },
    { newcomer_id: newcomer!.id, name: 'James Okafor', role: 'Marketing Strategist', relation: 'buddy', avatar: 'JO' },
    { newcomer_id: newcomer!.id, name: 'Priya Nair', role: 'Content Lead', relation: 'peer', avatar: 'PN' },
    { newcomer_id: newcomer!.id, name: 'Tom Reyes', role: 'Brand Designer', relation: 'peer', avatar: 'TR' },
    { newcomer_id: newcomer!.id, name: 'Ana Lima', role: 'Finance Business Partner', relation: 'key_contact', avatar: 'AL' },
  ])

  console.log('\nDone! Demo credentials:')
  console.log('  HR Admin:  hr@meridian.demo / demo123')
  console.log('  Manager:   claire@meridian.demo / demo123')
  console.log('  Newcomer:  sofia@meridian.demo / demo123')
}

seed().catch(console.error)
