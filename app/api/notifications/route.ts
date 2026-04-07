import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getSessionFromRequest } from '@/lib/auth'

// GET — list notifications for current user
export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('notifications')
    .select('*')
    .eq('user_id', session.userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}

// PATCH — mark notifications as read
export async function PATCH(request: NextRequest) {
  const session = getSessionFromRequest(request)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { ids, markAll } = await request.json()

  if (markAll) {
    await supabaseAdmin
      .from('notifications')
      .update({ read: true })
      .eq('user_id', session.userId)
      .eq('read', false)
  } else if (ids && Array.isArray(ids)) {
    await supabaseAdmin
      .from('notifications')
      .update({ read: true })
      .in('id', ids)
      .eq('user_id', session.userId)
  }

  return NextResponse.json({ ok: true })
}
