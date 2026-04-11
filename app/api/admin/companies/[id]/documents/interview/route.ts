import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole, getSessionFromRequest } from '@/lib/auth'
import { getAIResponse } from '@/lib/anthropic'
import { getDocInterviewPrompt } from '@/lib/doc-builder-prompts'

// POST — chat for document builder interview
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['admin'])
  if (authError) return authError
  const { id: companyId } = await params
  const session = getSessionFromRequest(request)!

  const { message, docId, history } = await request.json()

  // Get company name
  const { data: company } = await supabaseAdmin
    .from('companies').select('name').eq('id', companyId).single()

  const systemPrompt = getDocInterviewPrompt(
    docId,
    company?.name || 'the company',
    session.name
  )

  // Build chat history
  const chatHistory = (history || []).map((m: any) => ({
    role: m.role as 'assistant' | 'user',
    content: m.content,
  }))

  if (message) {
    chatHistory.push({ role: 'user' as const, content: message })
  }

  try {
    const aiResponse = await getAIResponse(chatHistory, systemPrompt, 600)

    const isComplete = aiResponse.includes('x7y8')
    let cleanResponse = aiResponse.replace(/x7y8/g, '').replace(/5j3k/g, '').trim()

    if (!cleanResponse && isComplete) {
      cleanResponse = "Thank you! I have everything I need to generate the document."
    }

    return NextResponse.json({
      message: cleanResponse,
      isComplete,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
