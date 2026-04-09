import { NextRequest, NextResponse } from 'next/server'
import { checkRole } from '@/lib/auth'
import * as XLSX from 'xlsx'

// GET — download Excel templates for People, Activities, or Check-ins
export async function GET(request: NextRequest) {
  const authError = checkRole(request, ['admin', 'hr_admin'])
  if (authError) return authError

  const type = new URL(request.url).searchParams.get('type') || 'people'

  let workbook: XLSX.WorkBook
  let filename: string

  switch (type) {
    case 'people':
      workbook = buildPeopleTemplate()
      filename = 'People_Import_Template.xlsx'
      break
    case 'activities':
      workbook = buildActivitiesTemplate()
      filename = 'Activities_Template.xlsx'
      break
    case 'checkins':
      workbook = buildCheckinsTemplate()
      filename = 'Checkins_Template.xlsx'
      break
    default:
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  }

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}

function buildPeopleTemplate(): XLSX.WorkBook {
  const data = [
    ['Name', 'Email', 'Role/Position', 'Department', 'Reports To', 'Is Newcomer', 'Start Date', 'Buddy Email', 'Password'],
    ['Claire Bennett', 'claire@company.com', 'VP Marketing', 'Marketing', 'ceo@company.com', 'No', '', '', 'welcome123'],
    ['James Okafor', 'james@company.com', 'Marketing Strategist', 'Marketing', 'claire@company.com', 'No', '', '', 'welcome123'],
    ['Sofia Martinez', 'sofia@company.com', 'Sr. Marketing Manager', 'Marketing', 'claire@company.com', 'Yes', '2026-03-03', 'james@company.com', 'welcome123'],
  ]
  const ws = XLSX.utils.aoa_to_sheet(data)
  ws['!cols'] = [{ wch: 20 }, { wch: 25 }, { wch: 22 }, { wch: 15 }, { wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 25 }, { wch: 12 }]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'People')

  // Instructions sheet
  const instr = XLSX.utils.aoa_to_sheet([
    ['People Import Template — Instructions'],
    [''],
    ['Column', 'Required', 'Description'],
    ['Name', 'Yes', 'Full name of the employee'],
    ['Email', 'Yes', 'Email address (used for login)'],
    ['Role/Position', 'No', 'Job title'],
    ['Department', 'No', 'Department name'],
    ['Reports To', 'No', 'Email of their direct manager (must exist in this sheet or already in the system)'],
    ['Is Newcomer', 'Yes', 'Yes or No — newcomers get onboarding activities assigned'],
    ['Start Date', 'If newcomer', 'Start date in YYYY-MM-DD format (e.g. 2026-03-03)'],
    ['Buddy Email', 'No', 'Email of assigned buddy (must exist in this sheet or already in the system)'],
    ['Password', 'No', 'Login password. Defaults to "welcome123" if left empty'],
    [''],
    ['Notes:'],
    ['- Include ALL employees, not just newcomers — non-newcomers are needed for manager/buddy references'],
    ['- The system will auto-create org chart relationships from Reports To'],
    ['- Peers in the same department are auto-linked to newcomers'],
    ['- Activities and check-ins are auto-assigned when importing'],
  ])
  instr['!cols'] = [{ wch: 15 }, { wch: 12 }, { wch: 70 }]
  XLSX.utils.book_append_sheet(wb, instr, 'Instructions')
  return wb
}

function buildActivitiesTemplate(): XLSX.WorkBook {
  const data = [
    ['Phase', 'Week', 'Day(s)', 'Dimension', 'Subdimension', 'Activity', 'Who', 'Est. Time', 'Builds On', 'Output / Deliverable'],
    ['Pre-arrival', '-2', '10 days before', 'FIT', 'Job Description', 'Read the full job description and note questions', 'Newcomer alone', '30 min', '', 'Annotated job description'],
    ['Arrival', '1', 'Day 1', 'FIT', 'Orientation', 'Complete workspace setup and access check', 'Newcomer + Manager', '45 min', '', 'All systems accessible'],
    ['Arrival', '1', 'Day 3', 'TIE', 'Team', 'Meet the team — informal introductions', 'Newcomer + Team', '30 min', '', 'Knows all team members by name'],
    ['Integration', '5', 'Day 31', 'ACE', 'First Project', 'Lead first project end-to-end', 'Newcomer', '1 week', '', 'Completed deliverable'],
  ]
  const ws = XLSX.utils.aoa_to_sheet(data)
  ws['!cols'] = [{ wch: 14 }, { wch: 6 }, { wch: 15 }, { wch: 10 }, { wch: 18 }, { wch: 50 }, { wch: 20 }, { wch: 10 }, { wch: 25 }, { wch: 30 }]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Activities')

  const instr = XLSX.utils.aoa_to_sheet([
    ['Activities Template — Instructions'],
    [''],
    ['Column', 'Required', 'Description'],
    ['Phase', 'Yes', 'One of: Pre-arrival, Arrival, Integration, Adjustment, Stabilization, Embedding'],
    ['Week', 'No', 'Week number (e.g. 1, 2, -2 for pre-arrival)'],
    ['Day(s)', 'No', 'Specific days (e.g. "Day 1", "Day 3-5", "10 days before")'],
    ['Dimension', 'Yes', 'FIT, ACE, or TIE'],
    ['Subdimension', 'No', 'Specific area within the dimension'],
    ['Activity', 'Yes', 'What the newcomer needs to do'],
    ['Who', 'No', 'Who participates (e.g. "Newcomer alone", "Newcomer + Manager")'],
    ['Est. Time', 'No', 'Estimated duration (e.g. "30 min", "1 hour")'],
    ['Builds On', 'No', 'Previous activity this builds on'],
    ['Output / Deliverable', 'No', 'Expected output or deliverable'],
  ])
  instr['!cols'] = [{ wch: 20 }, { wch: 10 }, { wch: 65 }]
  XLSX.utils.book_append_sheet(wb, instr, 'Instructions')
  return wb
}

function buildCheckinsTemplate(): XLSX.WorkBook {
  const data = [
    ['Phase', 'Month', 'Week', 'Day(s)', 'Check-in Type', 'Who Initiates', 'Who Participates', 'Format', 'Duration', 'Dimensions Covered', 'Key Focus / Questions', 'Output / Deliverable'],
    ['Arrival', '1', 'W2', 'Day 14', '2-week self check-in', 'Newcomer (self)', 'Newcomer', 'App survey (Likert)', '10 min', 'FIT, ACE, TIE', '5 questions per dimension: role clarity, tool mastery, belonging', 'Self-assessment baseline score'],
    ['Arrival', '1', 'W3', 'Day 18', 'Manager 1:1', 'Manager', 'Newcomer + Manager', '1:1 meeting', '30 min', 'FIT, ACE', 'KPI discussion, training progress, feedback on first tasks', 'KPIs understood; training gaps identified'],
    ['Arrival', '1', 'W4', 'Day 25', 'Buddy check-in', 'Buddy', 'Newcomer + Buddy', 'Informal', '15 min', 'TIE', 'Social integration, cross-team connections', 'Newcomer expanding network'],
    ['Arrival', '1', 'W4', 'Day 30', 'Month 1 formal check-in (Self)', 'Newcomer (self)', 'Newcomer', 'App survey (Likert) + AI interview', '15 min', 'FIT, ACE, TIE', 'Full Likert + qualitative AI-guided reflection', 'Month 1 self-score; qualitative insights'],
    ['Arrival', '1', 'W4', 'Day 30', 'Month 1 formal check-in (Manager)', 'Manager', 'Manager', 'App survey (Likert)', '10 min', 'FIT, ACE, TIE', 'Manager rates newcomer on same 15 questions', 'Manager score; divergence analysis'],
  ]
  const ws = XLSX.utils.aoa_to_sheet(data)
  ws['!cols'] = [{ wch: 14 }, { wch: 6 }, { wch: 6 }, { wch: 12 }, { wch: 30 }, { wch: 18 }, { wch: 22 }, { wch: 14 }, { wch: 8 }, { wch: 16 }, { wch: 50 }, { wch: 30 }]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Check-ins')

  const instr = XLSX.utils.aoa_to_sheet([
    ['Check-ins Template — Instructions'],
    [''],
    ['Column', 'Required', 'Description'],
    ['Phase', 'Yes', 'One of: Pre-arrival, Arrival, Integration, Adjustment, Stabilization, Embedding'],
    ['Month', 'No', 'Month number (1-12)'],
    ['Week', 'No', 'Week identifier (e.g. W1, W2, W-1 for pre-arrival)'],
    ['Day(s)', 'No', 'Specific day (e.g. "Day 14", "Day 30")'],
    ['Check-in Type', 'Yes', 'Name of the check-in (determines form type)'],
    ['Who Initiates', 'Yes', 'One of: Newcomer (self), Manager, Buddy, HR Admin'],
    ['Who Participates', 'No', 'Everyone involved in this check-in'],
    ['Format', 'No', 'How it happens (e.g. App survey, 1:1 meeting, Informal)'],
    ['Duration', 'No', 'Expected duration'],
    ['Dimensions Covered', 'No', 'Which dimensions: FIT, ACE, TIE (comma-separated)'],
    ['Key Focus / Questions', 'No', 'What to cover during this check-in'],
    ['Output / Deliverable', 'No', 'Expected output'],
    [''],
    ['Check-in types and their forms:'],
    ['"self check-in" or "self check"', '', 'Opens Likert survey (15 questions)'],
    ['"formal check-in (Self)"', '', 'Opens Likert survey + AI qualitative interview'],
    ['"formal check-in (Manager)"', '', 'Opens manager Likert assessment'],
    ['"Manager 1:1" or "1:1"', '', 'Opens manager notes form with agenda'],
    ['"Buddy check-in"', '', 'Opens buddy quick log form'],
    ['"HR review"', '', 'Opens HR formal review form'],
    ['"Welcome call" / "celebration"', '', 'Simple mark-as-completed event'],
  ])
  instr['!cols'] = [{ wch: 30 }, { wch: 10 }, { wch: 60 }]
  XLSX.utils.book_append_sheet(wb, instr, 'Instructions')
  return wb
}
