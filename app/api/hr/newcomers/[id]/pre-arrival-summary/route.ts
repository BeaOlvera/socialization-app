import { NextRequest, NextResponse } from 'next/server'
import { checkRole } from '@/lib/auth'
import { getPreArrivalSummary } from '@/lib/pre-arrival-summary'

// GET — HR sees full summary including flight risk
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkRole(request, ['hr_admin'])
  if (authError) return authError
  const { id } = await params

  const summary = await getPreArrivalSummary(id)
  return NextResponse.json(summary)
}
