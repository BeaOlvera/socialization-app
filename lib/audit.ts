/**
 * Audit logging for GDPR + EU AI Act compliance.
 * Adapted from 360 app — logs all sensitive actions.
 */

import { supabaseAdmin } from './supabase'

export type AuditAction =
  // Check-in lifecycle
  | 'checkin.submitted'
  | 'checkin.viewed'
  | 'scores.viewed'
  | 'scores.exported'
  // AI interactions
  | 'ai.interview_conducted'
  | 'ai.analysis_generated'
  | 'ai.flight_risk_assessed'
  // Newcomer management
  | 'newcomer.created'
  | 'newcomer.updated'
  | 'newcomer.invited'
  | 'newcomer.data_exported'
  | 'newcomer.data_deleted'
  // Dashboard access
  | 'dashboard.accessed'
  | 'report.viewed'
  // Privacy
  | 'consent.accepted'
  | 'consent.withdrawn'
  | 'data_request.access'
  | 'data_request.erasure'

export async function logAudit(params: {
  action: AuditAction
  actorType: 'hr_admin' | 'manager' | 'newcomer' | 'system'
  actorId?: string
  resourceType: string
  resourceId?: string
  details?: Record<string, unknown>
  ipAddress?: string
}): Promise<void> {
  try {
    await supabaseAdmin.from('audit_logs').insert({
      actor_type: params.actorType,
      actor_id: params.actorId ?? null,
      action: params.action,
      resource_type: params.resourceType,
      resource_id: params.resourceId ?? null,
      details: params.details ?? null,
      ip_address: params.ipAddress ?? null,
    })
  } catch (err) {
    // Never let audit logging break the main flow
    console.error('Audit log failed:', err)
  }
}

/**
 * Log an AI interaction for EU AI Act compliance.
 */
export async function logAI(params: {
  checkinId?: string
  actionType: string
  model: string
  promptLength: number
  responseLength: number
  tokensUsed?: number
  durationMs?: number
  details?: Record<string, unknown>
}): Promise<void> {
  try {
    await supabaseAdmin.from('ai_logs').insert({
      checkin_id: params.checkinId ?? null,
      action_type: params.actionType,
      model: params.model,
      prompt_length: params.promptLength,
      response_length: params.responseLength,
      tokens_used: params.tokensUsed ?? null,
      duration_ms: params.durationMs ?? null,
      details: params.details ?? null,
    })
  } catch (err) {
    console.error('AI log failed:', err)
  }
}
