import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole } from '@/lib/auth'
import { getFileReformatPrompt, DOC_BUILDERS } from '@/lib/doc-builder-prompts'
import Anthropic from '@anthropic-ai/sdk'

// POST — upload a file, Claude reformats it into a newcomer-friendly document
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['admin'])
  if (authError) return authError
  const { id: companyId } = await params

  const formData = await request.formData()
  const file = formData.get('file') as File
  const docId = formData.get('docId') as string
  const customTitle = formData.get('title') as string

  if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })

  // Read file content
  const text = await file.text()
  if (!text.trim()) return NextResponse.json({ error: 'File is empty' }, { status: 400 })

  const builderConfig = DOC_BUILDERS.find(b => b.id === docId)
  const title = customTitle || builderConfig?.title || file.name.replace(/\.[^/.]+$/, '')
  const dimension = builderConfig?.dimension || 'fit'

  const { data: company } = await supabaseAdmin
    .from('companies').select('name').eq('id', companyId).single()

  const systemPrompt = getFileReformatPrompt(title, company?.name || 'the company')

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const tools: Anthropic.Tool[] = [{
    name: 'submit_document',
    description: 'Submit the reformatted document',
    input_schema: {
      type: 'object' as const,
      properties: {
        title: { type: 'string' },
        content: { type: 'string', description: 'Reformatted document content' },
        description: { type: 'string', description: 'One-line summary' },
      },
      required: ['title', 'content', 'description'],
    },
  }]

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: `Here is the original document to reformat:\n\n${text.substring(0, 10000)}` }],
      tools,
      tool_choice: { type: 'tool', name: 'submit_document' },
    })

    const toolBlock = response.content.find(b => b.type === 'tool_use')
    if (!toolBlock || toolBlock.type !== 'tool_use') {
      return NextResponse.json({ error: 'AI did not generate document' }, { status: 500 })
    }

    const result = toolBlock.input as { title: string; content: string; description: string }

    // Save or update
    const { data: existing } = await supabaseAdmin
      .from('company_documents')
      .select('id')
      .eq('company_id', companyId)
      .eq('title', title)
      .single()

    if (existing) {
      await supabaseAdmin.from('company_documents').update({
        content: result.content,
        description: result.description,
        source: 'file_upload',
        visible: true,
      }).eq('id', existing.id)
    } else {
      await supabaseAdmin.from('company_documents').insert({
        company_id: companyId,
        dimension,
        title: result.title || title,
        description: result.description,
        content: result.content,
        source: 'file_upload',
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
