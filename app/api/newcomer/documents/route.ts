import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRole, getSessionFromRequest } from '@/lib/auth'

// GET — visible documents for the newcomer's company
export async function GET(request: NextRequest) {
  const authError = checkRole(request, ['newcomer'])
  if (authError) return authError

  const session = getSessionFromRequest(request)!

  const { data: docs } = await supabaseAdmin
    .from('company_documents')
    .select('id, dimension, title, description, url, content')
    .eq('company_id', session.companyId)
    .eq('visible', true)
    .order('sort_order')

  // Only return docs that have content or a URL — empty placeholders are hidden
  const filtered = (docs || []).filter(d => d.content || d.url)
  return NextResponse.json(filtered)
}
