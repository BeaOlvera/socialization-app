/**
 * Shared logic for extracting the safe summary from coded interview data.
 * Returns ONLY the summary — no raw quotes, no transcript, no coded passages.
 * This is what newcomer, HR, and manager all see.
 */

import { supabaseAdmin } from './supabase'

export interface PreArrivalSummary {
  available: boolean
  expectations_profile: string | null
  career_fit_assessment: string | null
  embeddedness_baseline: string | null
  psychological_contract: string | null
  social_readiness: string | null
  risk_factors: string[]
  protective_factors: string[]
  recommended_actions: string[]
  flight_risk: string | null
  flight_risk_justification: string | null
}

const EMPTY: PreArrivalSummary = {
  available: false,
  expectations_profile: null,
  career_fit_assessment: null,
  embeddedness_baseline: null,
  psychological_contract: null,
  social_readiness: null,
  risk_factors: [],
  protective_factors: [],
  recommended_actions: [],
  flight_risk: null,
  flight_risk_justification: null,
}

export async function getPreArrivalSummary(newcomerId: string): Promise<PreArrivalSummary> {
  // Get pre-arrival checkin (month_number = 0)
  const { data: checkin } = await supabaseAdmin
    .from('checkins')
    .select('details')
    .eq('newcomer_id', newcomerId)
    .eq('month_number', 0)
    .single()

  if (!checkin?.details) return EMPTY

  const details = checkin.details as any
  const summary = details.summary

  if (!summary) return EMPTY

  return {
    available: true,
    expectations_profile: summary.expectations_profile || null,
    career_fit_assessment: summary.career_fit_assessment || null,
    embeddedness_baseline: summary.embeddedness_baseline || null,
    psychological_contract: summary.psychological_contract || null,
    social_readiness: summary.social_readiness || null,
    risk_factors: summary.risk_factors || [],
    protective_factors: summary.protective_factors || [],
    recommended_actions: summary.recommended_actions || [],
    // HR and manager see flight risk; newcomer sees a softer version
    flight_risk: summary.flight_risk || null,
    flight_risk_justification: summary.flight_risk_justification || null,
  }
}

/**
 * Returns the summary WITHOUT flight risk details — for the newcomer's own view.
 * They see insights about themselves but not the risk classification.
 */
export async function getPreArrivalSummaryForNewcomer(newcomerId: string): Promise<Omit<PreArrivalSummary, 'flight_risk' | 'flight_risk_justification'>> {
  const full = await getPreArrivalSummary(newcomerId)
  const { flight_risk, flight_risk_justification, ...safe } = full
  return safe
}
