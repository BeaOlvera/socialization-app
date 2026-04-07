import Anthropic from '@anthropic-ai/sdk'

/**
 * Get AI response from Anthropic Claude.
 * Primary: Sonnet 4.6 for interviews. Falls back on overload.
 */
export async function getAIResponse(
  messages: Array<{ role: 'assistant' | 'user'; content: string }>,
  systemPrompt: string,
  maxTokens: number = 500
): Promise<string> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  // Anthropic requires at least one message — seed with "Hi" if empty (opening question)
  const apiMessages = messages.length > 0 ? messages : [{ role: 'user' as const, content: 'Hi' }]

  const models = ['claude-sonnet-4-6', 'claude-haiku-4-5-20251001'] as const
  let lastError: Error | null = null

  for (const model of models) {
    try {
      const response = await client.messages.create({
        model,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: apiMessages,
      })

      const block = response.content[0]
      const reply = block.type === 'text' ? block.text : ''
      return reply.trim()
    } catch (e: unknown) {
      lastError = e as Error
      const msg = (e as Error).message || ''
      // Retry with next model on overload
      if (msg.includes('overloaded') || msg.includes('529')) continue
      throw e
    }
  }

  throw lastError || new Error('All AI models failed')
}
