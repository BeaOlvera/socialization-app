import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getSessionFromRequest } from '@/lib/auth'

// GET — get company config for the logged-in user (any role)
export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Admin has no company
  if (!session.companyId) {
    return NextResponse.json({ visible_pages: ["home","activities","timeline","buckets","progress","org","people","docs"], has_buddies: true })
  }

  const { data: config } = await supabaseAdmin
    .from('company_config')
    .select('visible_pages, has_buddies, checkin_frequency')
    .eq('company_id', session.companyId)
    .single()

  return NextResponse.json(config || {
    visible_pages: ["home","activities","timeline","buckets","progress","org","people","docs"],
    has_buddies: true,
    checkin_frequency: "monthly",
  })
}
