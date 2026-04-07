/**
 * Score computation helpers for the FIT/ACE/TIE socialization framework.
 */

import type { Phase } from './supabase'

/**
 * Convert an array of Likert ratings (1–5) to a 0–100 percentage.
 * Returns null if the array is empty or contains no valid ratings.
 */
export function likertToPercentage(ratings: number[]): number | null {
  const valid = ratings.filter(r => r >= 1 && r <= 5)
  if (valid.length === 0) return null
  return Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 20)
}

/**
 * Determine status color from a score (0–100).
 */
export function statusFromScore(score: number): 'green' | 'yellow' | 'red' {
  if (score >= 70) return 'green'
  if (score >= 50) return 'yellow'
  return 'red'
}

/**
 * Compute the overall status from three dimension scores.
 * Uses the lowest dimension as the determining factor.
 */
export function overallStatus(fit: number, ace: number, tie: number): 'green' | 'yellow' | 'red' {
  const min = Math.min(fit, ace, tie)
  return statusFromScore(min)
}

/**
 * Compute divergence between self and manager scores.
 * Returns positive number when manager rates higher than self.
 */
export function divergence(selfScore: number, managerScore: number): number {
  return managerScore - selfScore
}

/**
 * Detect flight risk: returns true if scores have declined
 * for 2+ consecutive check-ins on any dimension.
 */
export function isFlightRisk(
  scoreHistory: { score: number; recorded_at: string }[]
): boolean {
  if (scoreHistory.length < 3) return false
  const sorted = [...scoreHistory].sort(
    (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
  )
  // Check last 3 data points for consecutive decline
  const last3 = sorted.slice(-3)
  return last3[1].score < last3[0].score && last3[2].score < last3[1].score
}

/**
 * Determine the current phase based on number of days since start.
 */
export function phaseFromDay(day: number): Phase {
  if (day <= 30) return 'arrival'
  if (day <= 90) return 'integration'
  if (day <= 180) return 'adjustment'
  if (day <= 270) return 'stabilization'
  return 'embedding'
}

/**
 * Calculate the day number from start date.
 */
export function daysSinceStart(startDate: string | Date): number {
  const start = new Date(startDate)
  const now = new Date()
  const diff = now.getTime() - start.getTime()
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

/**
 * Compute the month number (1–12) from the start date.
 */
export function monthNumberFromStart(startDate: string | Date): number {
  const start = new Date(startDate)
  const now = new Date()
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  return Math.max(1, Math.min(12, months + 1))
}
