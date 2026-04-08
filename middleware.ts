import { NextRequest, NextResponse } from 'next/server'
import type { UserRole } from './lib/supabase'

const SESSION_COOKIE = 'ob_session'

// Map protected path prefixes to allowed roles
const ROLE_ROUTES: [string, UserRole[]][] = [
  ['/admin', ['admin']],
  ['/api/admin', ['admin']],
  ['/newcomer', ['newcomer']],
  ['/manager', ['manager']],
  ['/hr', ['hr_admin']],
  ['/setup', ['hr_admin']],
  ['/api/newcomer', ['newcomer']],
  ['/api/manager', ['manager']],
  ['/api/hr', ['hr_admin']],
]

// Public paths that don't need authentication
const PUBLIC_PATHS = ['/', '/login', '/invite', '/api/auth']

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (isPublic(pathname)) return NextResponse.next()

  // Allow static assets and Next.js internals
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon')) return NextResponse.next()

  // Check if this path requires role-based protection
  const matchedRoute = ROLE_ROUTES.find(([prefix]) => pathname.startsWith(prefix))
  if (!matchedRoute) return NextResponse.next()

  const [, allowedRoles] = matchedRoute

  // Verify session cookie exists
  const cookie = request.cookies.get(SESSION_COOKIE)
  if (!cookie) {
    // API routes return 401, page routes redirect to login
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Decode JWT to check role (lightweight check — full verification in API routes)
  try {
    const payload = JSON.parse(
      Buffer.from(cookie.value.split('.')[1], 'base64').toString()
    )
    if (!allowedRoles.includes(payload.role)) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } catch {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/newcomer/:path*',
    '/manager/:path*',
    '/hr/:path*',
    '/setup/:path*',
    '/api/newcomer/:path*',
    '/api/manager/:path*',
    '/api/hr/:path*',
  ],
}
