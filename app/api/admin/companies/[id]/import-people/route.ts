import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole } from '@/lib/auth'
import { hashPassword } from '@/lib/auth'
import * as XLSX from 'xlsx'

// POST — bulk import employees + newcomers from Excel
// Columns: Name, Email, Role/Position, Department, Reports To (email), Is Newcomer (yes/no), Start Date, Buddy Email, Password
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['admin'])
  if (authError) return authError
  const { id: companyId } = await params

  const formData = await request.formData()
  const file = formData.get('file') as File
  const autoAssign = formData.get('autoAssign') === 'true'

  if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })

  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet)

  if (rows.length === 0) return NextResponse.json({ error: 'Excel is empty' }, { status: 400 })

  const defaultPassword = await hashPassword('welcome123')
  const results = { users_created: 0, newcomers_created: 0, org_links: 0, errors: [] as string[] }

  // Phase 1: Create all user records
  const emailToUserId: Record<string, string> = {}

  // First, load existing users for this company
  const { data: existingUsers } = await supabaseAdmin
    .from('users')
    .select('id, email')
    .eq('company_id', companyId)

  existingUsers?.forEach(u => { emailToUserId[u.email.toLowerCase()] = u.id })

  for (const row of rows) {
    const name = row['Name']?.toString().trim()
    const email = row['Email']?.toString().trim().toLowerCase()
    if (!name || !email) continue

    // Skip if user already exists
    if (emailToUserId[email]) continue

    const isNewcomer = (row['Is Newcomer'] || '').toString().toLowerCase()
    const role = isNewcomer === 'yes' || isNewcomer === 'si' || isNewcomer === 'true'
      ? 'newcomer'
      : 'manager' // non-newcomers default to manager role (can manage newcomers)

    const password = row['Password']?.toString() || 'welcome123'
    const passwordHash = password === 'welcome123' ? defaultPassword : await hashPassword(password)

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        company_id: companyId,
        email,
        name,
        role,
        password_hash: passwordHash,
      })
      .select('id')
      .single()

    if (error) {
      results.errors.push(`User ${email}: ${error.message}`)
      continue
    }

    emailToUserId[email] = user.id
    results.users_created++
  }

  // Phase 2: Create newcomer records + org links
  for (const row of rows) {
    const email = row['Email']?.toString().trim().toLowerCase()
    if (!email || !emailToUserId[email]) continue

    const isNewcomer = (row['Is Newcomer'] || '').toString().toLowerCase()
    if (isNewcomer !== 'yes' && isNewcomer !== 'si' && isNewcomer !== 'true') continue

    const userId = emailToUserId[email]
    const startDate = parseDate(row['Start Date'])
    if (!startDate) {
      results.errors.push(`${email}: invalid or missing start date`)
      continue
    }

    // Check if newcomer already exists
    const { data: existing } = await supabaseAdmin
      .from('newcomers')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (existing) continue

    // Resolve manager and buddy
    const reportsToEmail = row['Reports To']?.toString().trim().toLowerCase()
    const buddyEmail = row['Buddy Email']?.toString().trim().toLowerCase()
    const managerId = reportsToEmail ? emailToUserId[reportsToEmail] || null : null
    const buddyId = buddyEmail ? emailToUserId[buddyEmail] || null : null

    const { data: newcomer, error } = await supabaseAdmin
      .from('newcomers')
      .insert({
        user_id: userId,
        company_id: companyId,
        manager_id: managerId,
        buddy_id: buddyId,
        department: row['Department']?.toString() || null,
        position: row['Role/Position']?.toString() || row['Position']?.toString() || null,
        start_date: startDate,
      })
      .select('id')
      .single()

    if (error) {
      results.errors.push(`Newcomer ${email}: ${error.message}`)
      continue
    }

    results.newcomers_created++

    // Create team_members entries from org relationships
    const name = row['Name']?.toString().trim()
    if (managerId) {
      const mgrName = rows.find(r => r['Email']?.toString().trim().toLowerCase() === reportsToEmail)?.['Name'] || 'Manager'
      const mgrRole = rows.find(r => r['Email']?.toString().trim().toLowerCase() === reportsToEmail)?.['Role/Position'] || ''
      await supabaseAdmin.from('team_members').insert({
        newcomer_id: newcomer.id,
        name: mgrName.toString(),
        role: mgrRole.toString(),
        relation: 'manager',
        email: reportsToEmail,
        avatar: mgrName.toString().split(' ').map((w: string) => w[0]).join(''),
      })
      results.org_links++
    }

    if (buddyId) {
      const buddyName = rows.find(r => r['Email']?.toString().trim().toLowerCase() === buddyEmail)?.['Name'] || 'Buddy'
      const buddyRole = rows.find(r => r['Email']?.toString().trim().toLowerCase() === buddyEmail)?.['Role/Position'] || ''
      await supabaseAdmin.from('team_members').insert({
        newcomer_id: newcomer.id,
        name: buddyName.toString(),
        role: buddyRole.toString(),
        relation: 'buddy',
        email: buddyEmail,
        avatar: buddyName.toString().split(' ').map((w: string) => w[0]).join(''),
      })
      results.org_links++
    }

    // Add peers (other people in same department who aren't newcomers)
    const dept = row['Department']?.toString()
    if (dept) {
      const peers = rows.filter(r => {
        const rEmail = r['Email']?.toString().trim().toLowerCase()
        const rDept = r['Department']?.toString()
        const rIsNewcomer = (r['Is Newcomer'] || '').toString().toLowerCase()
        return rDept === dept && rEmail !== email && rIsNewcomer !== 'yes' && rIsNewcomer !== 'si' && rIsNewcomer !== 'true'
          && rEmail !== reportsToEmail && rEmail !== buddyEmail
      })
      for (const peer of peers.slice(0, 5)) { // max 5 peers
        await supabaseAdmin.from('team_members').insert({
          newcomer_id: newcomer.id,
          name: peer['Name']?.toString() || 'Peer',
          role: peer['Role/Position']?.toString() || '',
          relation: 'peer',
          email: peer['Email']?.toString().toLowerCase(),
          avatar: (peer['Name']?.toString() || 'P').split(' ').map((w: string) => w[0]).join(''),
        })
        results.org_links++
      }
    }

    // Auto-assign templates if requested
    if (autoAssign) {
      const { data: config } = await supabaseAdmin
        .from('company_config')
        .select('has_buddies')
        .eq('company_id', companyId)
        .single()

      const hasBuddies = config?.has_buddies !== false

      const { data: templates } = await supabaseAdmin
        .from('activity_templates')
        .select('*')
        .eq('company_id', companyId)
        .eq('active', true)
        .order('sort_order')

      if (templates && templates.length > 0) {
        const filtered = hasBuddies ? templates : templates.filter(t => t.assigned_to !== 'buddy')
        const startDateObj = new Date(startDate)

        const tasks = filtered.map((t, i) => {
          let dayOffset = 0
          if (t.days) {
            const dayMatch = t.days.match(/Day\s+(\d+)/i)
            if (dayMatch) dayOffset = parseInt(dayMatch[1])
            const beforeMatch = t.days.match(/(\d+)\s+days?\s+before/i)
            if (beforeMatch) dayOffset = -parseInt(beforeMatch[1])
          }
          if (!dayOffset && t.week) {
            const wMatch = t.week.match(/-?\d+/)
            if (wMatch) dayOffset = parseInt(wMatch[0]) * 7
          }
          const dueDate = new Date(startDateObj)
          dueDate.setDate(dueDate.getDate() + dayOffset)

          return {
            newcomer_id: newcomer.id,
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
            assigned_to_user_id: t.assigned_to === 'manager' ? managerId : t.assigned_to === 'buddy' ? buddyId : null,
            due_date: dayOffset ? dueDate.toISOString().split('T')[0] : null,
            format: t.format,
            duration: t.duration,
            done: false,
          }
        })

        // Batch insert
        for (let s = 0; s < tasks.length; s += 50) {
          await supabaseAdmin.from('phase_tasks').insert(tasks.slice(s, s + 50))
        }
      }
    }
  }

  return NextResponse.json(results, { status: 201 })
}

function parseDate(val: any): string | null {
  if (!val) return null
  if (typeof val === 'number') {
    // Excel serial date
    const date = new Date((val - 25569) * 86400000)
    return date.toISOString().split('T')[0]
  }
  const str = val.toString().trim()
  const d = new Date(str)
  if (isNaN(d.getTime())) return null
  return d.toISOString().split('T')[0]
}
