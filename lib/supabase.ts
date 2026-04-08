import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Guard: during build, env vars may not be set — create dummy clients
const hasConfig = supabaseUrl.length > 0 && supabaseAnonKey.length > 0

// Public client — safe for newcomer/interview routes (anon key)
export const supabasePublic: SupabaseClient = hasConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as unknown as SupabaseClient

// Admin client — uses service role key, only for server-side API routes
export const supabaseAdmin: SupabaseClient = hasConfig && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null as unknown as SupabaseClient

// ─── TypeScript types matching supabase/schema.sql ──────────

export type UserRole = 'newcomer' | 'manager' | 'hr_admin' | 'admin'
export type Phase = 'arrival' | 'integration' | 'adjustment' | 'stabilization' | 'embedding'
export type Status = 'green' | 'yellow' | 'red'
export type Dimension = 'fit' | 'ace' | 'tie'
export type CheckinType = 'self' | 'manager'
export type InterviewStatus = 'pending' | 'in_progress' | 'completed'

export interface Company {
  id: string
  name: string
  industry: string | null
  size: string | null
  values: unknown[] | null
  rituals: string | null
  decision_making_style: string | null
  unwritten_rules: string | null
  mission: string | null
  created_at: string
}

export interface User {
  id: string
  company_id: string
  email: string
  name: string
  role: UserRole
  password_hash: string | null
  token: string
  last_login_at: string | null
  created_at: string
}

export interface Newcomer {
  id: string
  user_id: string
  company_id: string
  manager_id: string | null
  buddy_id: string | null
  department: string | null
  position: string | null
  start_date: string
  current_phase: Phase
  status: Status
  created_at: string
  data_deletion_requested_at: string | null
  data_deletion_completed_at: string | null
}

export interface TeamMember {
  id: string
  newcomer_id: string
  name: string
  role: string | null
  relation: 'manager' | 'buddy' | 'peer' | 'key_contact'
  email: string | null
  avatar: string | null
  created_at: string
}

export interface Checkin {
  id: string
  newcomer_id: string
  checkin_type: CheckinType
  submitted_by: string | null
  month_number: number
  phase: string | null
  scores_fit: number[]
  scores_ace: number[]
  scores_tie: number[]
  score_fit_avg: number | null
  score_ace_avg: number | null
  score_tie_avg: number | null
  interview_status: InterviewStatus
  submitted_at: string | null
  created_at: string
  retention_expires_at: string | null
  data_deleted_at: string | null
}

export interface Message {
  id: string
  checkin_id: string
  role: 'assistant' | 'user'
  content: string
  created_at: string
}

export interface PhaseTask {
  id: string
  newcomer_id: string
  phase: Phase
  dimension: Dimension
  task_index: number
  label: string
  done: boolean
  completed_at: string | null
  created_at: string
}

export interface Action {
  id: string
  newcomer_id: string
  dimension: Dimension
  text: string
  urgent: boolean
  completed: boolean
  due_date: string | null
  created_at: string
}

export interface DimensionScoreHistory {
  id: string
  newcomer_id: string
  dimension: Dimension
  score: number
  source: 'self' | 'manager'
  checkin_id: string | null
  recorded_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: 'alert' | 'reminder' | 'info'
  title: string
  body: string
  href: string | null
  read: boolean
  created_at: string
}

export interface AuditLog {
  id: string
  actor_type: string
  actor_id: string | null
  action: string
  resource_type: string | null
  resource_id: string | null
  details: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

export interface PrivacyConsent {
  id: string
  person_type: string
  person_id: string
  consent_type: string
  consent_text: string | null
  accepted: boolean
  accepted_at: string | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export interface AILog {
  id: string
  checkin_id: string | null
  action_type: string
  model: string | null
  prompt_length: number | null
  response_length: number | null
  tokens_used: number | null
  duration_ms: number | null
  details: Record<string, unknown> | null
  created_at: string
}
