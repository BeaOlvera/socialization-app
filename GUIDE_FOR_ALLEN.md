# Onboard: Newcomer Socialization Platform
## Complete Guide for David Allen

**Platform URL:** https://socialization-app.vercel.app/login

---

## 1. What is this?

Onboard is a fully functional web platform that operationalizes a 12-month newcomer socialization framework based on three dimensions:

- **FIT** (Role Clarity) — Does the newcomer understand their role, KPIs, org chart, responsibilities?
- **ACE** (Task Mastery) — Do they feel competent with tools, processes, training?
- **TIE** (Social Acceptance) — Do they feel part of the team, have relationships, belong?

The platform tracks newcomers across 5 phases: **Arrival** (Days 1-30), **Integration** (Days 31-90), **Adjustment** (Months 4-6), **Stabilization** (Months 7-9), and **Embedding** (Months 10-12).

It is designed as a **consultant-led SaaS tool**: the consultant (Admin) sets up each client company, uploads customized activity calendars and check-in schedules, and the client's HR team manages day-to-day onboarding with minimal effort.

---

## 2. The Four Roles

The platform has four user roles, each with a different view and set of capabilities:

| Role | Who | What they do |
|------|-----|-------------|
| **Admin** | Consultant (Bea) | Creates companies, uploads templates, configures everything |
| **HR Admin** | Client's HR person | Assigns activities to newcomers, monitors progress |
| **Manager** | Newcomer's direct manager | Sees their newcomers' progress, completes manager check-ins |
| **Newcomer** | The new employee | Completes activities, does check-ins, tracks their own journey |

**Navigation note:** Each role has its own home. The "← Home" button in the top-left nav takes newcomers to `/newcomer`, managers to `/manager`, and HR to `/hr` — users stay inside their own role. Only the Admin sees the cross-role landing page at `/`, which lists all roles and is clearly marked with a black-bordered **Admin · All roles** badge to distinguish it from user-facing screens.

---

## 3. Login Credentials (Demo Data)

Use these credentials to explore each role:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@onboard.app` | `admin123` |
| **HR Admin** | `hr@meridian.demo` | `demo123` |
| **Manager** | `claire@meridian.demo` | `demo123` |
| **Newcomer** | `sofia@meridian.demo` | `demo123` |

The demo company is **Meridian Group** (Financial Services, 200-500 employees). Sofia Martinez is a Senior Marketing Manager who started on March 3, 2026. Her manager is Claire Bennett (VP Marketing) and her buddy is James Okafor (Marketing Strategist).

---

## 4. Admin Role — The Consultant's Control Panel

**Login as:** `admin@onboard.app` / `admin123`

### 4.1 Admin Dashboard

After login, you land on the Admin Dashboard showing all companies you manage. Currently there's one: Meridian Group.

- Click **"+ New Company"** to create a new client company
- Each company card shows the name, industry, and number of active newcomers
- Click any company to enter its setup page

### 4.2 Company Setup Page

This is the core of the admin experience. It has 5 tabs:

#### Tab 1: Activities

This is the master activity calendar — the 105 onboarding activities across all 6 phases and 3 dimensions. Each activity has:
- **Phase** (Pre-arrival through Embedding)
- **Dimension** (FIT, ACE, or TIE)
- **Activity description** (what the newcomer needs to do)
- **Who** (who participates — newcomer alone, with manager, with buddy, etc.)

**Key features:**
- **"Download Template"** — downloads a sample Excel file with the correct column format and instructions
- **"Upload Excel"** — replaces all activities with the ones in your Excel file
- Activities are company-specific — each client can have a different calendar

#### Tab 2: Check-ins

The 41 check-in touchpoints across 12 months. These are different from activities — they are structured evaluation moments:

- **Self check-ins** (Likert surveys — 15 questions across FIT/ACE/TIE)
- **Self check-ins + AI interview** (Likert + qualitative AI-guided conversation)
- **Manager 1:1s** (structured meeting with agenda)
- **Manager assessments** (manager rates newcomer on same 15 questions)
- **Buddy informal check-ins** (quick social integration log)
- **HR formal reviews** (90-day, 6-month, 12-month structured reviews)

Each check-in shows who initiates it, who participates, the format, and what dimensions it covers.

**Key features:**
- **"Download Template"** — Excel template with sample check-ins and instructions explaining which form type each name triggers
- **"Upload Excel"** — upload your customized check-in schedule
- Check-ins are color-coded by who initiates (newcomer/manager/buddy/HR)

#### Tab 3: Import People

This is how you onboard a new client's employees in bulk. Instead of creating users one by one, you upload a single Excel file with ALL employees:

**Excel columns:**
| Column | Required | Example |
|--------|----------|---------|
| Name | Yes | Sofia Martinez |
| Email | Yes | sofia@company.com |
| Role/Position | No | Sr. Marketing Manager |
| Department | No | Marketing |
| Reports To | No | claire@company.com |
| Is Newcomer | Yes | Yes / No |
| Start Date | If newcomer | 2026-03-03 |
| Buddy Email | No | james@company.com |
| Password | No | Defaults to welcome123 |

**What happens when you upload:**
1. User accounts are created for ALL employees (not just newcomers)
2. Newcomer records are created for those marked "Is Newcomer = Yes"
3. Org chart relationships are built from "Reports To" column (manager links)
4. Buddy assignments are set from "Buddy Email" column
5. Peers in the same department are automatically linked
6. ALL activities + check-ins are auto-assigned to each newcomer with calculated due dates based on their start date

**Key feature:** "Download Template" gives you a sample file with instructions.

#### Tab 4: Newcomers

Lists all newcomers for this company. For each newcomer you can:
- **"Transcript"** — download the pre-arrival interview transcript as a text file
- **"Code Interview"** — run AI analysis on the pre-arrival interview (see Section 8)
- **"Assign All"** — (re)assign all activity + check-in templates to this newcomer

#### Tab 5: Config

Company-level settings:

- **Buddy System** — toggle on/off. When off, buddy check-ins are excluded from assignments
- **Check-in Frequency** — biweekly, monthly, or quarterly
- **Visible Pages** — choose which pages newcomers can see in their navigation. If a company didn't provide org chart data, uncheck "Org Chart" and newcomers won't see an empty page. Home and Activities are always on.

---

## 5. Newcomer Role — The Onboarding Experience

**Login as:** `sofia@meridian.demo` / `demo123`

### 5.1 Home

The newcomer's dashboard showing:
- Overall completion percentage
- **"Up next"** — the next 4 undone activities with estimated time and dimension tag
- **Three dimensions** — FIT, ACE, TIE progress bars with percentage
- Quick links to Activities and Timeline

### 5.2 Activities (the main working page)

This is where newcomers spend most of their time. It shows ALL assigned activities and check-ins organized by phase.

**Phase tabs** at the top (Arrival, Integration, Adjustment, Stabilization, Embedding) — click to switch phases. Each tab shows its completion percentage.

Within each phase, activities are grouped by dimension (FIT, ACE, TIE):

**For regular activities:**
- Checkbox to mark as done (persists to database)
- Activity description
- Time estimate, who participates, when it's due
- Expected output (color-coded by dimension)

**For check-ins:**
- Tagged with a yellow **"Check-in"** badge
- **"Open"** button that opens the appropriate form (see Section 6)
- Due date calculated from start date

### 5.3 Timeline

A visual overview of the 12-month journey:
- **Phase ribbon** at the top showing progress across all phases
- **Overall dimension progress** — FIT, ACE, TIE bars across all phases
- **Phase detail** — 3-column grid showing activities per dimension with completion status
- **"View full activity details"** link to the Activities page
- Read-only — you complete activities on the Activities page, not here

### 5.4 My Journey

Dimension-focused view:
- Each dimension (FIT, ACE, TIE) gets its own card with a score ring
- Progress breakdown by phase for each dimension
- Tips and guidance per dimension

### 5.5 Progress

Real-time completion statistics:
- Overall completion percentage with total tasks done
- Progress by dimension with per-phase mini-bars
- Progress by phase with period labels
- Activities vs. Check-ins breakdown (how many of each completed)
- Dynamic insight based on which dimension is strongest/weakest

### 5.6 Org Chart

The newcomer's **local network** (not the full company org chart):
- Visual dark-themed tree: Manager above → You in center → Buddy, Peers, Key contacts below
- Detailed list view with relationship tags (manager, buddy, peer, key contact)
- Built automatically from the People import data

### 5.7 My People

Team members list from the database:
- Visual relationship map
- Each person shows name, role, and relationship type
- Message button (UI placeholder)

### 5.8 Documents

Pre-arrival documents and resources (currently demo content).

### 5.9 Check-in (Evaluation)

The monthly self-assessment survey:
- 15 Likert questions (5 per dimension: FIT, ACE, TIE)
- Scale: Strongly disagree → Strongly agree
- Submits scores to the database for trend tracking

---

## 6. Check-in Forms — Different Types

When a newcomer clicks **"Open"** on a check-in task, the platform detects the type from the activity name and opens the appropriate form:

### 6.1 Self-Assessment (Likert)
**Triggered by:** "self check-in", "2-week self check-in", etc.
- 15 questions across FIT/ACE/TIE
- 5-point Likert scale
- Quick — takes about 5 minutes

### 6.2 Self-Assessment + AI Interview
**Triggered by:** "formal check-in (Self)"
- Same Likert survey PLUS a qualitative AI-guided conversation
- The AI asks 8-10 follow-up questions exploring the newcomer's experience
- Generates research-grade qualitative data

### 6.3 Manager Assessment (Likert)
**Triggered by:** "formal check-in (Manager)"
- Manager rates the newcomer on the same 15 questions
- Enables self vs. manager divergence analysis

### 6.4 Manager 1:1
**Triggered by:** "Manager 1:1", "End-of-week check-in"
- Shows key focus areas from the check-in template
- Notes field for capturing discussion points, actions, observations
- Structured meeting support

### 6.5 Buddy Log
**Triggered by:** "Buddy check-in", "Buddy informal check-in"
- Shows topics to cover (social integration, concerns)
- Quick notes field
- Warm yellow design to match the informal nature

### 6.6 HR Formal Review
**Triggered by:** "HR 90-day review", "HR 6-month review", "HR 12-month review"
- Shows review agenda
- Detailed notes field for progress, blockers, development plan, risk flags
- Expected output reminder

### 6.7 Pre-Arrival Interview
**Triggered by:** Welcome call, Manager intro call
- Redirects to the dedicated pre-arrival interview page (see Section 7)

---

## 7. Pre-Arrival AI Interview — The Research Baseline

**Page:** `/newcomer/pre-arrival`

This is a deep qualitative interview conducted BEFORE the newcomer's first day. It captures the baseline for longitudinal research.

### What it explores (12-15 questions):

1. **Expectations** (Met Expectations Theory — Wanous) — What they imagine the job, team, and culture will be like
2. **Career Fit** (Person-Job/Org Fit) — How this role fits their career trajectory, why they chose this company
3. **Anticipated Embeddedness** (Mitchell, Lee & Holtom):
   - **Links** — Pre-existing connections, network plans
   - **Fit** — Perceived compatibility with role/org/lifestyle
   - **Sacrifice** — What they gave up, switching costs
4. **Values & Psychological Contract** (Rousseau) — What they expect beyond salary, what they feel they owe
5. **Social Orientation** (Allen & Shanock) — How important work relationships are, how they build connections
6. **Prior Experience & Anxiety** — Past onboarding incidents (positive/negative), emotional readiness

### How it works:

- The newcomer clicks **"Start conversation"**
- Claude AI conducts a natural, warm conversation — NOT a rigid Q&A
- The AI probes for **concrete incidents** from past experiences, not generalizations
- It asks about emotions: "How did that make you feel?" "What struck you the most?"
- The full transcript is saved to the database
- Takes about 10-15 minutes

### Research value:

This creates a **T0 baseline** for every construct that will be measured longitudinally. At each monthly check-in, you can compare:
- Expectation-reality gaps (did what they expected match what happened?)
- Embeddedness growth curves (are links, fit, sacrifice increasing?)
- Psychological contract evolution (are promises being kept?)
- Social integration trajectory (passive vs. proactive socialization)

---

## 8. Transcript Coding & Analysis — The Research Tool

**Admin → Company → Newcomers tab → "Code Interview" button**

This adapts the Critical Incident Technique coding engine from the 360-degree evaluation platform for socialization research.

### What it does:

When you click **"Code Interview"**, the AI reads the full pre-arrival transcript and:

1. **Codes every meaningful passage** into one of 7 categories:
   - Expectations
   - Career Fit
   - Embeddedness: Links / Fit / Sacrifice (3 sub-categories)
   - Psychological Contract
   - Social Orientation
   - Prior Socialization Experience
   - Anticipatory Anxiety & Excitement

2. **For each coded passage, records:**
   - Exact quote from the transcript
   - What the passage reveals (1 sentence)
   - Emotional valence: positive, negative, or neutral
   - Intensity: low, moderate, or high
   - Incident type: concrete incident, projection (future expectation), or reflection

3. **Rejects passages that aren't codable** with explanation (too vague, interviewer's words, social desirability response, etc.)

4. **Generates a summary report:**
   - Expectations profile (2-3 sentences)
   - Career fit assessment
   - Embeddedness baseline (links, fit, sacrifice)
   - Psychological contract analysis
   - Social readiness assessment
   - **Risk factors** for early turnover
   - **Protective factors** for retention
   - **Recommended onboarding actions** (3-5 specific actions)
   - **Flight risk assessment** (low / moderate / high) with justification

### Transcript download:

Click **"Transcript"** to download the full interview as a text file — useful for manual coding, sharing with research team, or archiving.

---

## 9. HR Admin Role — The Client's View

**Login as:** `hr@meridian.demo` / `demo123`

The HR view is deliberately simple — the Admin has already done the heavy lifting.

### 9.1 Overview Dashboard

- Health summary: how many newcomers are On Track (green), Need Attention (yellow), At Risk (red)
- **Assign Activities** section: one-click "Assign All" per newcomer
- Newcomers by phase distribution
- All newcomers list with status, department, day count, and task progress

### 9.2 All Newcomers

Sortable list of all newcomers in the company, sorted by risk level (red first). Click any newcomer to see their detail page.

### 9.3 Newcomer Detail

For each newcomer:
- FIT/ACE/TIE completion scores with score rings
- Full activity list with completion status
- Check-in list with due dates
- Recommended HR actions based on status (green/yellow/red)

---

## 10. Manager Role

**Login as:** `claire@meridian.demo` / `demo123`

### 10.1 My Team

- List of newcomers assigned to this manager
- Each card shows name, position, department, day count, status dot
- **"Your upcoming check-ins"** — manager 1:1s and assessments that are due

### 10.2 Newcomer Detail

Click any newcomer to see:
- Overall completion percentage and status
- FIT/ACE/TIE dimension progress bars
- Full activity + check-in list with completion status
- Check-in badges and due dates

---

## 11. Data Architecture — What Gets Captured

### Quantitative data:
- **Likert scores** (1-5) on 15 items across FIT/ACE/TIE at each monthly check-in
- **Self scores** vs. **Manager scores** (divergence analysis)
- **Activity completion** rates by dimension, phase, and time
- **Check-in completion** rates by type and timing

### Qualitative data:
- **Pre-arrival interview** transcript (T0 baseline)
- **Monthly AI interviews** transcripts (T1-T12)
- **Manager 1:1 notes**
- **Buddy check-in logs**
- **HR review notes**

### Coded data:
- **Pre-arrival coding** — 7 constructs with valence, intensity, incident type
- **Monthly analysis** — FIT/ACE/TIE assessment with quotes, flight risk

### Longitudinal tracking:
- Dimension scores over time (self + manager)
- Activity completion curves
- Expectation-reality gap evolution
- Embeddedness growth
- Psychological contract changes

---

## 12. Research Potential

This platform generates publication-ready data for several paper ideas:

1. **Pre-arrival predictors of socialization outcomes** — Do T0 expectations, embeddedness, and psychological contract predict T3/T6/T12 adjustment? (Using the pre-arrival interview coding)

2. **Expectation-reality gaps and turnover** — Measure what newcomers expected vs. what they experienced at each check-in. How big does the gap need to be before turnover intention rises?

3. **Embeddedness growth curves** — Map links/fit/sacrifice over 12 months. When does embeddedness "lock in"? Is there a critical window?

4. **AI vs. human coding of socialization interviews** — Compare the AI-coded pre-arrival data against manual coding by trained researchers

5. **Proactive socialization and adjustment speed** — Use the social orientation data from T0 to predict TIE score trajectories

6. **The role of buddies in newcomer socialization** — Compare companies with vs. without buddy systems on TIE scores and social integration speed

---

## 13. Technical Stack

- **Frontend:** Next.js 16 (React), TypeScript, Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **AI:** Claude (Anthropic) for interviews and coding
- **Email:** Resend for notifications
- **Hosting:** Vercel (auto-deploys from GitHub)
- **Security:** JWT authentication, Row-Level Security, GDPR compliance (audit logs, consent tracking, data retention)

---

## 14. Try It Yourself — Quick Walkthrough

1. Go to https://socialization-app.vercel.app/login
2. Login as **Sofia** (`sofia@meridian.demo` / `demo123`)
3. Click **Activities** — see the full activity calendar with check-ins
4. Click an **"Open"** button on any check-in to see the form
5. Try the **Pre-Arrival Interview** at `/newcomer/pre-arrival` (need to type the URL)
6. Logout (clear cookies or use incognito)
7. Login as **Admin** (`admin@onboard.app` / `admin123`)
8. Click **Meridian Group** → explore the 5 tabs
9. Try **"Download Template"** on Activities, Check-ins, or People tabs
10. Go to **Newcomers** tab → click **"Transcript"** or **"Code Interview"**

---

---

## 15. Screenshots Guide (for Bea)

To add screenshots to this document before sharing with Allen, capture these pages:

1. **Login page** — `/login`
2. **Admin dashboard** — `/admin` (logged in as admin)
3. **Company setup — Activities tab** — `/admin/company/[id]` (Activities tab with template table)
4. **Company setup — Check-ins tab** — same page, Check-ins tab
5. **Company setup — Import People tab** — same page, Import People tab with column guide
6. **Company setup — Config tab** — same page, Config tab with visible pages toggles
7. **Newcomer Home** — `/newcomer` (logged in as Sofia)
8. **Newcomer Activities** — `/newcomer/activities` (showing check-in badges + Open buttons)
9. **Newcomer Timeline** — `/newcomer/timeline` (phase ribbon + 3-column grid)
10. **Newcomer Progress** — `/newcomer/progress` (dimension bars + phase breakdown)
11. **Pre-arrival Interview** — `/newcomer/pre-arrival` (the start screen, then a mid-conversation screenshot)
12. **Check-in form (Self Likert)** — open any self check-in from Activities
13. **Check-in form (Manager 1:1)** — open a Manager 1:1 check-in
14. **HR Dashboard** — `/hr` (logged in as HR)
15. **Manager Team** — `/manager` (logged in as Claire)

Paste screenshots inline after each section heading to make the guide visual.

---

*Built by Bea Olvera-Arias with Claude AI. Platform designed to support longitudinal socialization research and commercial consulting delivery.*
