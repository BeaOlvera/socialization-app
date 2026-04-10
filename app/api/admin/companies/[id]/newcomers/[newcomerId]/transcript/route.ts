import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole } from '@/lib/auth'

// GET — download interview transcript as text
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; newcomerId: string }> }
) {
  const authError = checkRole(request, ['admin', 'hr_admin'])
  if (authError) return authError
  const { newcomerId } = await params

  const checkinType = new URL(request.url).searchParams.get('type') || 'all'

  // Get newcomer info
  const { data: newcomer } = await supabaseAdmin
    .from('newcomers')
    .select('id, user_id, start_date, position')
    .eq('id', newcomerId)
    .single()

  if (!newcomer) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: user } = await supabaseAdmin
    .from('users').select('name, email').eq('id', newcomer.user_id).single()

  // Get checkins with messages
  let query = supabaseAdmin
    .from('checkins')
    .select('id, month_number, checkin_type, interview_status, submitted_at')
    .eq('newcomer_id', newcomerId)
    .eq('interview_status', 'completed')
    .order('month_number')

  if (checkinType === 'pre-arrival') {
    query = query.eq('month_number', 0)
  }

  const { data: checkins } = await query
  if (!checkins || checkins.length === 0) {
    return NextResponse.json({ error: 'No completed interviews found' }, { status: 404 })
  }

  // Build transcript text
  let transcript = `INTERVIEW TRANSCRIPT\n`
  transcript += `${'='.repeat(60)}\n`
  transcript += `Newcomer: ${user?.name || 'Unknown'} (${user?.email || ''})\n`
  transcript += `Position: ${newcomer.position || 'N/A'}\n`
  transcript += `Start Date: ${newcomer.start_date}\n`
  transcript += `Generated: ${new Date().toISOString().split('T')[0]}\n`
  transcript += `${'='.repeat(60)}\n\n`

  for (const checkin of checkins) {
    const label = checkin.month_number === 0 ? 'Pre-Arrival Interview' : `Month ${checkin.month_number} Check-in`
    transcript += `\n${'─'.repeat(60)}\n`
    transcript += `${label} (${checkin.checkin_type})\n`
    if (checkin.submitted_at) transcript += `Date: ${checkin.submitted_at.split('T')[0]}\n`
    transcript += `${'─'.repeat(60)}\n\n`

    const { data: messages } = await supabaseAdmin
      .from('messages')
      .select('role, content, created_at')
      .eq('checkin_id', checkin.id)
      .order('created_at', { ascending: true })

    for (const msg of messages || []) {
      const speaker = msg.role === 'assistant' ? 'INTERVIEWER' : (user?.name?.toUpperCase() || 'NEWCOMER')
      transcript += `${speaker}:\n${msg.content}\n\n`
    }
  }

  const filename = `${user?.name?.replace(/\s+/g, '_') || 'transcript'}_${checkinType === 'pre-arrival' ? 'pre_arrival' : 'interviews'}.txt`

  return new NextResponse(transcript, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
