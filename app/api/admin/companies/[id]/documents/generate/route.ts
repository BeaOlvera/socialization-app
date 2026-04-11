import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole } from '@/lib/auth'
import { getDocGenerationPrompt, DOC_BUILDERS } from '@/lib/doc-builder-prompts'
import Anthropic from '@anthropic-ai/sdk'

// POST — generate document from interview transcript
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['admin'])
  if (authError) return authError
  const { id: companyId } = await params
  const { docId, transcript } = await request.json()

  if (!docId || !transcript) {
    return NextResponse.json({ error: 'docId and transcript required' }, { status: 400 })
  }

  const builderConfig = DOC_BUILDERS.find(b => b.id === docId)
  if (!builderConfig) return NextResponse.json({ error: 'Unknown document type' }, { status: 400 })

  const { data: company } = await supabaseAdmin
    .from('companies').select('name').eq('id', companyId).single()

  const systemPrompt = getDocGenerationPrompt(docId, company?.name || 'the company')

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const tools: Anthropic.Tool[] = [{
    name: 'submit_document',
    description: 'Submit the generated document',
    input_schema: {
      type: 'object' as const,
      properties: {
        title: { type: 'string', description: 'Document title' },
        content: { type: 'string', description: 'Full document content (plain text, 500-800 words)' },
        description: { type: 'string', description: 'One-line summary for the document list' },
      },
      required: ['title', 'content', 'description'],
    },
  }]

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: `Here is the interview transcript:\n\n${transcript}` }],
      tools,
      tool_choice: { type: 'tool', name: 'submit_document' },
    })

    const toolBlock = response.content.find(b => b.type === 'tool_use')
    if (!toolBlock || toolBlock.type !== 'tool_use') {
      return NextResponse.json({ error: 'AI did not generate document' }, { status: 500 })
    }

    const result = toolBlock.input as { title: string; content: string; description: string }

    // Save or update the document
    const { data: existing } = await supabaseAdmin
      .from('company_documents')
      .select('id')
      .eq('company_id', companyId)
      .eq('title', builderConfig.title)
      .single()

    if (existing) {
      await supabaseAdmin.from('company_documents').update({
        content: result.content,
        description: result.description,
        source: 'ai_interview',
        visible: true,
      }).eq('id', existing.id)
    } else {
      await supabaseAdmin.from('company_documents').insert({
        company_id: companyId,
        dimension: builderConfig.dimension,
        title: result.title || builderConfig.title,
        description: result.description,
        content: result.content,
        source: 'ai_interview',
        visible: true,
      })
    }

    return NextResponse.json({
      title: result.title,
      content: result.content,
      description: result.description,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
