import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole, getSessionFromRequest } from '@/lib/auth'
import { getAIResponse } from '@/lib/anthropic'
import { getPreArrivalInterviewPrompt } from '@/lib/prompts'

// POST — pre-arrival interview chat (uses newcomer_id directly, no checkin needed)
export async function POST(request: NextRequest) {
  const authError = checkRole(request, ['newcomer'])
  if (authError) return authError

  const session = getSessionFromRequest(request)!

  // Get newcomer
  const { data: newcomer } = await supabaseAdmin
    .from('newcomers')
    .select('id, start_date, position, company_id')
    .eq('user_id', session.userId)
    .single()

  if (!newcomer) return NextResponse.json({ error: 'Newcomer not found' }, { status: 404 })

  // Get company
  const { data: company } = await supabaseAdmin
    .from('companies').select('name').eq('id', newcomer.company_id).single()

  const { message: userMessage } = await request.json()

  // We store pre-arrival messages in a checkin with month_number=0
  // Create or get the pre-arrival checkin
  let { data: checkin } = await supabaseAdmin
    .from('checkins')
    .select('id, interview_status')
    .eq('newcomer_id', newcomer.id)
    .eq('month_number', 0)
    .eq('checkin_type', 'self')
    .single()

  if (!checkin) {
    const { data: newCheckin } = await supabaseAdmin
      .from('checkins')
      .insert({
        newcomer_id: newcomer.id,
        checkin_type: 'self',
        submitted_by: session.userId,
        month_number: 0,
        phase: 'arrival',
        interview_status: 'pending',
      })
      .select('id, interview_status')
      .single()
    checkin = newCheckin
  }

  if (!checkin) return NextResponse.json({ error: 'Failed to create interview' }, { status: 500 })
  if (checkin.interview_status === 'completed') {
    return NextResponse.json({ error: 'Interview already completed', isComplete: true }, { status: 400 })
  }

  // If starting fresh (null message) and there's an old in_progress conversation, reset it
  if (!userMessage && checkin.interview_status === 'in_progress') {
    await supabaseAdmin.from('messages').delete().eq('checkin_id', checkin.id)
    await supabaseAdmin.from('checkins').update({ interview_status: 'pending' }).eq('id', checkin.id)
    checkin.interview_status = 'pending'
  }

  // Save user message
  if (userMessage) {
    await supabaseAdmin.from('messages').insert({
      checkin_id: checkin.id,
      role: 'user',
      content: userMessage,
    })
  }

  // Load history
  const { data: messages } = await supabaseAdmin
    .from('messages')
    .select('role, content')
    .eq('checkin_id', checkin.id)
    .order('created_at', { ascending: true })

  // Build chat history — ensure valid alternating roles for Anthropic API
  const rawHistory = (messages || []).map(m => ({
    role: m.role as 'assistant' | 'user',
    content: m.content,
  }))

  // Fix: remove consecutive same-role messages (keep last of each run)
  const chatHistory: typeof rawHistory = []
  for (const msg of rawHistory) {
    if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === msg.role) {
      chatHistory[chatHistory.length - 1] = msg // replace with latest
    } else {
      chatHistory.push(msg)
    }
  }

  // Mark in_progress
  if (checkin.interview_status === 'pending') {
    await supabaseAdmin.from('checkins')
      .update({ interview_status: 'in_progress' })
      .eq('id', checkin.id)
  }

  // Generate prompt
  const systemPrompt = getPreArrivalInterviewPrompt(
    session.name,
    company?.name || 'the company',
    newcomer.position || 'newcomer',
    newcomer.start_date,
  )

  let aiResponse: string
  try {
    aiResponse = await getAIResponse(chatHistory, systemPrompt, 600)
  } catch (e: any) {
    console.error('Pre-arrival interview AI error:', e.message)
    return NextResponse.json({ error: `AI error: ${e.message}` }, { status: 500 })
  }

  // Check completion
  const isComplete = aiResponse.includes('x7y8')
  const isModerated = aiResponse.includes('5j3k')

  let cleanResponse = aiResponse.replace(/x7y8/g, '').replace(/5j3k/g, '').trim()
  if (!cleanResponse && isComplete) {
    cleanResponse = "Thank you so much for sharing all of this. Your responses are incredibly valuable and will help us make your onboarding experience the best it can be. We're looking forward to welcoming you!"
  }

  // Save AI response
  await supabaseAdmin.from('messages').insert({
    checkin_id: checkin.id,
    role: 'assistant',
    content: cleanResponse,
  })

  if (isComplete || isModerated) {
    await supabaseAdmin.from('checkins')
      .update({ interview_status: 'completed', submitted_at: new Date().toISOString() })
      .eq('id', checkin.id)
  }

  return NextResponse.json({
    message: cleanResponse,
    isComplete: isComplete || isModerated,
    checkinId: checkin.id,
  })
}
