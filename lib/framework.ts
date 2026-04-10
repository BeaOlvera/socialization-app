/**
 * FACET Model — FIT / ACE / TIE
 * Static definitions: eval questions, phase task templates, dimension config.
 * These are part of the framework, not user data — they don't belong in the DB.
 */

import type { Phase, Dimension } from './supabase'

// ─── Dimension configuration ────────────────────────────────

export const DIMENSIONS = {
  fit: { code: 'FIT', name: 'Role Clarity', label: 'FIT · Role Clarity', color: '#1A1A2E', bg: '#EEEEF5', num: '01' },
  ace: { code: 'ACE', name: 'Task Mastery', label: 'ACE · Task Mastery', color: '#2D6A4F', bg: '#EAF4EF', num: '02' },
  tie: { code: 'TIE', name: 'Social Acceptance', label: 'TIE · Social Acceptance', color: '#9B2335', bg: '#FBEAEC', num: '03' },
} as const

// ─── Evaluation questions (Likert 1–5) ──────────────────────

export const EVAL_QUESTIONS: Record<Dimension, string[]> = {
  fit: [
    "I clearly understand my role, responsibilities and reporting line",
    "I know where my role sits in the org structure and who to collaborate with",
    "I understand my KPIs and what success looks like",
    "I'm clear on decision rights and where my role ends and others' begin",
    "I see how my daily work connects to the company's strategic objectives",
  ],
  ace: [
    "I'm following a structured onboarding plan with clear milestones",
    "I can navigate the tools and systems I need for my daily work",
    "I know where to find SOPs, playbooks and quality standards",
    "I understand how my performance will be evaluated and when",
    "I know my skill gaps and have a plan to close them",
  ],
  tie: [
    "My buddy/mentor has been a valuable support in my first weeks",
    "I'm included in team rituals — meetings, lunches, informal chats",
    "I see the company values lived in action, not just on the wall",
    "I've connected with people beyond my immediate team",
    "I feel like I belong here and people have my back",
  ],
}

// ─── Manager evaluation questions ───────────────────────────

export const MANAGER_EVAL_QUESTIONS: Record<Dimension, string[]> = {
  fit: [
    "They clearly understand their role, responsibilities and reporting line",
    "They know where their role fits in the org structure",
    "They understand their KPIs and how success is measured",
    "They are clear on decision rights and RACI boundaries",
    "They see how their work connects to the company strategy",
  ],
  ace: [
    "They are following their onboarding plan and hitting milestones",
    "They navigate the tools and systems with confidence",
    "They know where to find SOPs and follow documented processes",
    "They understand how their performance will be appraised",
    "They are actively closing their skill gaps",
  ],
  tie: [
    "They have a good relationship with their buddy/mentor",
    "They participate in team rituals and informal gatherings",
    "They are aligning with the company values in their behaviour",
    "They are connecting with people beyond their immediate team",
    "They seem to feel a sense of belonging",
  ],
}

// ─── Phase task templates ───────────────────────────────────
// When a newcomer is created, these templates are used to generate
// their phase_tasks rows in the database.

export interface TaskTemplate {
  phase: Phase
  dimension: Dimension
  task_index: number
  label: string
}

export const PHASE_TASK_TEMPLATES: TaskTemplate[] = [
  // ── Arrival (Days 1–30) ──
  { phase: 'arrival', dimension: 'fit', task_index: 0, label: 'Review job description & reporting line' },
  { phase: 'arrival', dimension: 'fit', task_index: 1, label: 'Explore org chart and team structure' },
  { phase: 'arrival', dimension: 'fit', task_index: 2, label: 'Understand first-quarter KPIs with manager' },
  { phase: 'arrival', dimension: 'fit', task_index: 3, label: 'Map key stakeholders (RACI)' },
  { phase: 'arrival', dimension: 'ace', task_index: 0, label: 'Complete tool onboarding' },
  { phase: 'arrival', dimension: 'ace', task_index: 1, label: 'Start 30-60-90 day training plan' },
  { phase: 'arrival', dimension: 'ace', task_index: 2, label: 'Locate SOPs & playbooks' },
  { phase: 'arrival', dimension: 'ace', task_index: 3, label: 'Understand performance review timeline' },
  { phase: 'arrival', dimension: 'tie', task_index: 0, label: 'Meet buddy / mentor' },
  { phase: 'arrival', dimension: 'tie', task_index: 1, label: 'Attend first team rituals and All-Hands' },
  { phase: 'arrival', dimension: 'tie', task_index: 2, label: 'Read company values guide' },
  { phase: 'arrival', dimension: 'tie', task_index: 3, label: 'Meet 2 cross-functional contacts' },

  // ── Integration (Days 31–90) ──
  { phase: 'integration', dimension: 'fit', task_index: 0, label: 'Align priorities with strategic plan' },
  { phase: 'integration', dimension: 'fit', task_index: 1, label: 'Clarify RACI for cross-functional projects' },
  { phase: 'integration', dimension: 'fit', task_index: 2, label: 'Present 90-day plan to manager' },
  { phase: 'integration', dimension: 'fit', task_index: 3, label: 'Get first KPI review from manager' },
  { phase: 'integration', dimension: 'ace', task_index: 0, label: 'Lead first project end-to-end' },
  { phase: 'integration', dimension: 'ace', task_index: 1, label: 'Complete all mandatory training modules' },
  { phase: 'integration', dimension: 'ace', task_index: 2, label: 'Execute one process using documented SOP' },
  { phase: 'integration', dimension: 'ace', task_index: 3, label: 'Identify top skill gap and start closing it' },
  { phase: 'integration', dimension: 'tie', task_index: 0, label: 'Build working relationship with 2+ departments' },
  { phase: 'integration', dimension: 'tie', task_index: 1, label: 'Attend a team off-site or social event' },
  { phase: 'integration', dimension: 'tie', task_index: 2, label: 'Join one employee community or ERG' },
  { phase: 'integration', dimension: 'tie', task_index: 3, label: 'Complete 60-day pulse survey' },

  // ── Adjustment (Months 4–6) ──
  { phase: 'adjustment', dimension: 'fit', task_index: 0, label: 'Own quarterly roadmap priorities' },
  { phase: 'adjustment', dimension: 'fit', task_index: 1, label: 'Identify one boundary/RACI improvement' },
  { phase: 'adjustment', dimension: 'fit', task_index: 2, label: 'Connect work to annual strategic goals' },
  { phase: 'adjustment', dimension: 'fit', task_index: 3, label: 'Update job scope with manager if needed' },
  { phase: 'adjustment', dimension: 'ace', task_index: 0, label: 'Deliver measurable results' },
  { phase: 'adjustment', dimension: 'ace', task_index: 1, label: 'Master all core tools independently' },
  { phase: 'adjustment', dimension: 'ace', task_index: 2, label: 'Propose one process improvement' },
  { phase: 'adjustment', dimension: 'ace', task_index: 3, label: 'Complete mid-year performance self-assessment' },
  { phase: 'adjustment', dimension: 'tie', task_index: 0, label: 'Have a network beyond immediate team' },
  { phase: 'adjustment', dimension: 'tie', task_index: 1, label: 'Participate in informal social rituals regularly' },
  { phase: 'adjustment', dimension: 'tie', task_index: 2, label: 'Demonstrate values alignment in daily work' },
  { phase: 'adjustment', dimension: 'tie', task_index: 3, label: 'Feel genuine belonging' },

  // ── Stabilization (Months 7–9) ──
  { phase: 'stabilization', dimension: 'fit', task_index: 0, label: 'Be the go-to expert for your domain' },
  { phase: 'stabilization', dimension: 'fit', task_index: 1, label: 'Lead cross-functional initiatives with clarity' },
  { phase: 'stabilization', dimension: 'fit', task_index: 2, label: 'Contribute to team strategic planning' },
  { phase: 'stabilization', dimension: 'fit', task_index: 3, label: 'Define your development path forward' },
  { phase: 'stabilization', dimension: 'ace', task_index: 0, label: 'Consistently high-quality deliverables' },
  { phase: 'stabilization', dimension: 'ace', task_index: 1, label: 'Mentor a newer team member on tools/processes' },
  { phase: 'stabilization', dimension: 'ace', task_index: 2, label: 'Complete required certifications' },
  { phase: 'stabilization', dimension: 'ace', task_index: 3, label: 'Get strong performance appraisal feedback' },
  { phase: 'stabilization', dimension: 'tie', task_index: 0, label: 'Have trusted allies across departments' },
  { phase: 'stabilization', dimension: 'tie', task_index: 1, label: 'Give and receive honest peer feedback' },
  { phase: 'stabilization', dimension: 'tie', task_index: 2, label: 'Support new newcomers (pay it forward)' },
  { phase: 'stabilization', dimension: 'tie', task_index: 3, label: 'Strong sense of identity within the org' },

  // ── Embedding (Months 10–12) ──
  { phase: 'embedding', dimension: 'fit', task_index: 0, label: 'Strategic contributor, not just executor' },
  { phase: 'embedding', dimension: 'fit', task_index: 1, label: "Define next year's goals with manager" },
  { phase: 'embedding', dimension: 'fit', task_index: 2, label: 'Recognized for unique value you bring' },
  { phase: 'embedding', dimension: 'fit', task_index: 3, label: 'Complete 12-month role reflection' },
  { phase: 'embedding', dimension: 'ace', task_index: 0, label: "Full mastery of role's technical demands" },
  { phase: 'embedding', dimension: 'ace', task_index: 1, label: 'Shape SOPs and processes for the team' },
  { phase: 'embedding', dimension: 'ace', task_index: 2, label: 'Skills matrix shows no critical gaps' },
  { phase: 'embedding', dimension: 'ace', task_index: 3, label: 'Exceed performance appraisal expectations' },
  { phase: 'embedding', dimension: 'tie', task_index: 0, label: 'Rich network of genuine relationships' },
  { phase: 'embedding', dimension: 'tie', task_index: 1, label: 'Trusted across the organization' },
  { phase: 'embedding', dimension: 'tie', task_index: 2, label: 'Part of informal and formal communities' },
  { phase: 'embedding', dimension: 'tie', task_index: 3, label: 'Fully socially embedded' },
]

// ─── Phase metadata ─────────────────────────────────────────

export const PHASES: Record<Phase, { label: string; period: string; description: string; dayRange: [number, number] }> = {
  arrival:       { label: 'Arrival',       period: 'Days 1–30',     description: 'Learn the basics, meet the team, get oriented.', dayRange: [1, 30] },
  integration:   { label: 'Integration',   period: 'Days 31–90',    description: 'Deepen understanding, take ownership, deliver first results.', dayRange: [31, 90] },
  adjustment:    { label: 'Adjustment',    period: 'Months 4–6',    description: 'Work independently, expand your network, find your voice.', dayRange: [91, 180] },
  stabilization: { label: 'Stabilization', period: 'Months 7–9',    description: 'Consolidate your position, refine your approach, grow.', dayRange: [181, 270] },
  embedding:     { label: 'Embedding',     period: 'Months 10–12',  description: 'You are no longer new. You are part of the fabric.', dayRange: [271, 365] },
}

// ─── Likert scale labels ────────────────────────────────────

export const LIKERT_LABELS = ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'] as const
