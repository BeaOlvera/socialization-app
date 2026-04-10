import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole } from '@/lib/auth'
import { getPreArrivalCodingPrompt, getPreArrivalSummaryPrompt } from '@/lib/prompts'
import Anthropic from '@anthropic-ai/sdk'

// POST — code a pre-arrival interview transcript using AI
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; newcomerId: string }> }
) {
  const authError = checkRole(request, ['admin'])
  if (authError) return authError
  const { newcomerId } = await params

  // Get newcomer + user info
  const { data: newcomer } = await supabaseAdmin
    .from('newcomers')
    .select('id, user_id, start_date, position')
    .eq('id', newcomerId)
    .single()

  if (!newcomer) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: user } = await supabaseAdmin
    .from('users').select('name').eq('id', newcomer.user_id).single()

  // Get pre-arrival interview transcript (month_number = 0)
  const { data: checkin } = await supabaseAdmin
    .from('checkins')
    .select('id')
    .eq('newcomer_id', newcomerId)
    .eq('month_number', 0)
    .eq('interview_status', 'completed')
    .single()

  if (!checkin) {
    return NextResponse.json({ error: 'No completed pre-arrival interview found' }, { status: 404 })
  }

  const { data: messages } = await supabaseAdmin
    .from('messages')
    .select('role, content')
    .eq('checkin_id', checkin.id)
    .order('created_at', { ascending: true })

  if (!messages || messages.length < 4) {
    return NextResponse.json({ error: 'Transcript too short to code' }, { status: 400 })
  }

  // Build transcript text
  const transcript = messages.map(m =>
    `${m.role === 'assistant' ? 'INTERVIEWER' : user?.name || 'NEWCOMER'}: ${m.content}`
  ).join('\n\n')

  // Call Claude to code the transcript
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const systemPrompt = getPreArrivalCodingPrompt()

  const codingTools: Anthropic.Tool[] = [{
    name: 'submit_coding',
    description: 'Submit the coded interview analysis',
    input_schema: {
      type: 'object' as const,
      properties: {
        coded: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              quote: { type: 'string', description: 'Exact quote from transcript' },
              category: { type: 'string', enum: ['expectations', 'career_fit', 'embeddedness_links', 'embeddedness_fit', 'embeddedness_sacrifice', 'psychological_contract', 'social_orientation', 'prior_experience', 'anxiety_excitement'], description: 'Coding category' },
              category_label: { type: 'string', description: 'Human-readable category name' },
              behaviour: { type: 'string', description: 'What the passage reveals (1 sentence)' },
              valence: { type: 'string', enum: ['positive', 'negative', 'neutral'] },
              intensity: { type: 'string', enum: ['low', 'moderate', 'high'] },
              incident_type: { type: 'string', enum: ['concrete_incident', 'projection', 'reflection'] },
            },
            required: ['quote', 'category', 'category_label', 'behaviour', 'valence', 'intensity', 'incident_type'],
          },
        },
        rejected: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              quote: { type: 'string' },
              reason: { type: 'string' },
            },
            required: ['quote', 'reason'],
          },
        },
        summary: {
          type: 'object',
          properties: {
            expectations_profile: { type: 'string', description: '2-3 sentences summarizing their expectations' },
            career_fit_assessment: { type: 'string', description: '2-3 sentences on career fit' },
            embeddedness_baseline: { type: 'string', description: '2-3 sentences on links/fit/sacrifice' },
            psychological_contract: { type: 'string', description: '2-3 sentences on what they expect vs owe' },
            social_readiness: { type: 'string', description: '2-3 sentences on social orientation' },
            risk_factors: { type: 'array', items: { type: 'string' }, description: 'Early warning signs for turnover' },
            protective_factors: { type: 'array', items: { type: 'string' }, description: 'Factors that may promote retention' },
            recommended_actions: { type: 'array', items: { type: 'string' }, description: '3-5 specific onboarding actions based on this interview' },
            flight_risk: { type: 'string', enum: ['low', 'moderate', 'high'], description: 'Pre-arrival flight risk assessment' },
            flight_risk_justification: { type: 'string' },
          },
          required: ['expectations_profile', 'career_fit_assessment', 'embeddedness_baseline', 'psychological_contract', 'social_readiness', 'risk_factors', 'protective_factors', 'recommended_actions', 'flight_risk', 'flight_risk_justification'],
        },
      },
      required: ['coded', 'rejected', 'summary'],
    },
  }]

  const models = ['claude-sonnet-4-6', 'claude-haiku-4-5-20251001'] as const

  for (const model of models) {
    try {
      const response = await client.messages.create({
        model,
        max_tokens: 8000,
        system: systemPrompt,
        messages: [{ role: 'user', content: `Here is the pre-arrival interview transcript to code:\n\n${transcript}` }],
        tools: codingTools,
        tool_choice: { type: 'tool', name: 'submit_coding' },
      })

      const toolBlock = response.content.find(b => b.type === 'tool_use')
      if (!toolBlock || toolBlock.type !== 'tool_use') {
        return NextResponse.json({ error: 'AI did not return coding results' }, { status: 500 })
      }

      const result = toolBlock.input as any

      // Save to checkin record
      await supabaseAdmin
        .from('checkins')
        .update({
          details: result,
        })
        .eq('id', checkin.id)

      // Also save to a dedicated field if we add one, for now use details
      // Store in audit log
      await supabaseAdmin.from('audit_logs').insert({
        actor_type: 'admin',
        action: 'code_pre_arrival_interview',
        resource_type: 'newcomer',
        resource_id: newcomerId,
        details: {
          coded_count: result.coded?.length || 0,
          rejected_count: result.rejected?.length || 0,
          flight_risk: result.summary?.flight_risk,
          model,
        },
      })

      return NextResponse.json(result)
    } catch (e: any) {
      if (e.message?.includes('overloaded') || e.message?.includes('529')) continue
      return NextResponse.json({ error: e.message }, { status: 500 })
    }
  }

  return NextResponse.json({ error: 'All AI models failed' }, { status: 500 })
}
