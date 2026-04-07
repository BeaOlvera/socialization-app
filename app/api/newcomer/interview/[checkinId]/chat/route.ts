import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole, getSessionFromRequest } from '@/lib/auth'
import { getAIResponse } from '@/lib/anthropic'
import { getNewcomerInterviewPrompt } from '@/lib/prompts'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ checkinId: string }> }
) {
  const authError = checkRole(request, ['newcomer'])
  if (authError) return authError

  const session = getSessionFromRequest(request)!
  const { checkinId } = await params

  // Get checkin and verify ownership
  const { data: checkin, error: checkinError } = await supabaseAdmin
    .from('checkins')
    .select('id, newcomer_id, interview_status, phase')
    .eq('id', checkinId)
    .single()

  if (checkinError || !checkin) {
    return NextResponse.json({ error: 'Check-in not found' }, { status: 404 })
  }

  // Verify newcomer belongs to this user
  const { data: newcomer } = await supabaseAdmin
    .from('newcomers')
    .select('id, user_id, start_date, position, current_phase, company_id')
    .eq('id', checkin.newcomer_id)
    .eq('user_id', session.userId)
    .single()

  if (!newcomer) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  // Check if interview already completed
  if (checkin.interview_status === 'completed') {
    return NextResponse.json({ error: 'Interview already completed' }, { status: 400 })
  }

  // Get company name
  const { data: company } = await supabaseAdmin
    .from('companies')
    .select('name')
    .eq('id', newcomer.company_id)
    .single()

  // Parse user message from body (null for opening question)
  let userMessage: string | null = null
  try {
    const body = await request.json()
    userMessage = body.message || null
  } catch {
    // No body = requesting opening question
  }

  // Save user message if provided
  if (userMessage) {
    await supabaseAdmin.from('messages').insert({
      checkin_id: checkinId,
      role: 'user',
      content: userMessage,
    })
  }

  // Load full message history
  const { data: messages } = await supabaseAdmin
    .from('messages')
    .select('role, content')
    .eq('checkin_id', checkinId)
    .order('created_at', { ascending: true })

  const chatHistory = (messages || []).map(m => ({
    role: m.role as 'assistant' | 'user',
    content: m.content,
  }))

  // Mark as in_progress if first message
  if (checkin.interview_status === 'pending') {
    await supabaseAdmin
      .from('checkins')
      .update({ interview_status: 'in_progress' })
      .eq('id', checkinId)
  }

  // Calculate day number
  const start = new Date(newcomer.start_date)
  const now = new Date()
  const dayNumber = Math.max(1, Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))

  // Generate system prompt
  const systemPrompt = getNewcomerInterviewPrompt(
    session.name,
    company?.name || 'the company',
    newcomer.current_phase as any,
    dayNumber,
    newcomer.position || 'newcomer',
  )

  // Call AI
  const aiResponse = await getAIResponse(chatHistory, systemPrompt, 500)

  // Check for completion code
  const isComplete = aiResponse.includes('x7y8')
  const isModerated = aiResponse.includes('5j3k')

  // Clean response (remove codes)
  let cleanResponse = aiResponse
    .replace(/x7y8/g, '')
    .replace(/5j3k/g, '')
    .trim()

  if (!cleanResponse && isComplete) {
    cleanResponse = "Thank you for sharing your experience. Your responses have been recorded and will help us support your socialization journey better."
  }
  if (!cleanResponse && isModerated) {
    cleanResponse = "This interview has been ended. If you have any concerns, please speak with your manager or HR."
  }

  // Save AI response
  await supabaseAdmin.from('messages').insert({
    checkin_id: checkinId,
    role: 'assistant',
    content: cleanResponse,
  })

  // Mark complete if done
  if (isComplete || isModerated) {
    await supabaseAdmin
      .from('checkins')
      .update({ interview_status: 'completed' })
      .eq('id', checkinId)
  }

  return NextResponse.json({
    message: cleanResponse,
    isComplete: isComplete || isModerated,
    isModerated,
  })
}
