import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { UserRole } from './supabase'

const SESSION_COOKIE = 'ob_session'
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'

export interface SessionPayload {
  userId: string
  role: UserRole
  companyId: string | null
  name: string
  email: string
}

// ─── Password hashing ───────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// ─── JWT session management ─────────────────────────────────

export function createSessionToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload
  } catch {
    return null
  }
}

/**
 * Set session cookie on a response.
 */
export function setSessionCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
  return response
}

/**
 * Clear session cookie.
 */
export function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.delete(SESSION_COOKIE)
  return response
}

// ─── API route auth checks ──────────────────────────────────

/**
 * Get session from request in API routes.
 * Returns null if not authenticated.
 */
export function getSessionFromRequest(request: NextRequest): SessionPayload | null {
  const cookie = request.cookies.get(SESSION_COOKIE)
  if (!cookie) return null
  return verifySessionToken(cookie.value)
}

/**
 * Check role-based auth in API routes.
 * Returns a 401 NextResponse if not authorized, null if OK.
 */
export function checkRole(request: NextRequest, allowedRoles: UserRole[]): NextResponse | null {
  const session = getSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!allowedRoles.includes(session.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return null
}

// ─── Server Component auth (via next/headers) ───────────────

/**
 * Get session in Server Components. Returns null if not authenticated.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(SESSION_COOKIE)
  if (!cookie) return null
  return verifySessionToken(cookie.value)
}
