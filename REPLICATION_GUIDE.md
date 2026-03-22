# Onboard — Newcomer Socialization Platform
## Full Replication Guide

---

## 1. WHAT THIS IS

A prototype web app (PWA) for accelerating newcomer socialization inside companies. Built on **David Allen's three-bucket framework**:
- **My Job** — role clarity, tasks, performance criteria
- **My Organization** — culture, structure, strategy, norms
- **My People** — relationships, network, belonging

The journey lasts **12 months**, structured in 5 phases with decreasing intervention:
Arrival (Days 1–30) → Integration (Days 31–90) → Adjustment (Months 4–6) → Stabilization (Months 7–9) → Embedding (Months 10–12)

**Persona used throughout:** Sofia Martínez, Marketing Specialist, Day 18, at Meridian Group.

---

## 2. TECH STACK

| Layer | Tool | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.1 |
| Language | TypeScript | ^5 |
| Styling | Inline styles + Tailwind CSS v4 (limited use) | ^4 |
| Charts | recharts | ^3.8.0 |
| Icons | lucide-react | ^0.577.0 |
| Runtime | Node.js | any recent |

**No backend. No database. All data is mocked in `lib/mock.ts` and inline in each page.**

### To install and run from scratch:
```bash
npx create-next-app@16.2.1 socialization-app --typescript --tailwind --app
cd socialization-app
npm install recharts lucide-react
npm run dev
```

---

## 3. CRITICAL ARCHITECTURE DECISIONS

### 3a. Styling approach
**Use inline styles, NOT Tailwind responsive classes.** Tailwind v4 responsive prefixes (`lg:`, `md:`) do not work reliably in this setup. Use inline `style={{ gridTemplateColumns: "1fr 1fr" }}` instead.

The only Tailwind classes used are:
- Utility classes for flex/spacing/text that don't need responsive variants
- The responsive utility classes added in `globals.css` via media queries (`.two-col`, `.three-col`, `.page-main`, `.nav-links`)

### 3b. Card component pattern
The `Card` component accepts a `style` prop that **spreads over** the defaults. Always pass background/border overrides via `style={}`, not via `className`:
```tsx
// CORRECT — overrides default white background
<Card style={{ background: "#0A0A0A", border: "1px solid #1A1A1A" }}>

// WRONG — className bg will be overridden by inline style default
<Card className="bg-[#0A0A0A]">
```

### 3c. recharts SSR fix
recharts uses browser APIs incompatible with Next.js SSR. **Never import recharts directly in a page.** Always:
1. Put chart components in `components/Charts.tsx` (which has `"use client"` at the top)
2. Import them with `next/dynamic` and `ssr: false` in the page

```tsx
// In the page file:
const BucketLineChart = dynamic(
  () => import("@/components/Charts").then(m => ({ default: m.BucketLineChart })),
  { ssr: false }
);
```

### 3d. "use client" directive
Every page that uses `useState`, `useEffect`, or any interactive component needs `"use client"` at the very top. All pages in this app are client components.

### 3e. NavBar active prop
The `NavBar` component highlights the active nav link by matching the `active` string prop against `l.label`. The string must match exactly:
```tsx
<NavBar role="newcomer" active="Timeline" />
// "Timeline" must match exactly what's in the links array in ui.tsx
```

---

## 4. DESIGN SYSTEM

### Colors
```
Background:   #F5F4F0  (warm off-white)
Surface:      #FFFFFF
Border:       #E2E0DA
Ink (text):   #0A0A0A
Muted text:   #6B6B6B
Faint text:   #AEABA3
Divider:      #DDDBD5

Bucket 1 — Job:    #1A1A2E (dark navy)   bg: #EEEEF5
Bucket 2 — Org:    #2D6A4F (dark green)  bg: #EAF4EF
Bucket 3 — People: #9B2335 (dark red)    bg: #FBEAEC

Status green:  #2D6A4F  bg: #EAF4EF
Status yellow: #B7791F  bg: #FEF3E2
Status red:    #9B2335  bg: #FBEAEC
```

### Typography
Font: **Inter** — imported from Google Fonts in `globals.css`.

### Border radius conventions
- Cards: `borderRadius: 16`
- Inner cards/chips: `borderRadius: 12` or `10`
- Buttons/pills: `borderRadius: 8` or `99` (pill)
- Small icons/badges: `borderRadius: 6` or `4`

---

## 5. FILE STRUCTURE

```
socialization-app/
├── app/
│   ├── layout.tsx                        # Root layout — minimal, imports globals.css
│   ├── globals.css                       # Inter font, CSS variables, mobile media queries
│   ├── page.tsx                          # Landing page — role accordion
│   ├── welcome/
│   │   └── page.tsx                      # 4-step newcomer welcome flow
│   ├── setup/
│   │   └── page.tsx                      # 5-step consultant company setup
│   ├── notifications/
│   │   └── page.tsx                      # Notification center (all 3 roles)
│   ├── newcomer/
│   │   ├── page.tsx                      # Newcomer dashboard (Day 18)
│   │   ├── docs/page.tsx                 # Pre-arrival document library + viewer
│   │   ├── timeline/page.tsx             # 12-month interactive timeline
│   │   ├── progress/page.tsx             # Progress charts (uses dynamic imports)
│   │   ├── buckets/page.tsx              # Three-bucket detail with checklists
│   │   ├── people/page.tsx               # Relationship map
│   │   ├── org/page.tsx                  # Visual org chart
│   │   ├── evaluation/page.tsx           # Monthly self-evaluation form
│   │   └── complete/page.tsx             # 12-month completion screen
│   ├── manager/
│   │   ├── page.tsx                      # Manager team overview
│   │   ├── checkin/sofia/page.tsx        # Manager check-in form
│   │   └── newcomer/sofia/page.tsx       # Individual newcomer view
│   └── hr/
│       ├── page.tsx                      # HR org-wide dashboard
│       └── newcomers/
│           ├── page.tsx                  # All newcomers list
│           └── [slug]/page.tsx           # Dynamic newcomer detail page
├── components/
│   ├── ui.tsx                            # Shared components
│   └── Charts.tsx                        # recharts components (client only)
└── lib/
    └── mock.ts                           # All mock data
```

---

## 6. SHARED COMPONENTS (`components/ui.tsx`)

All exported from `components/ui.tsx`. Import with `@/components/ui`.

### `<Card>`
White surface card. Pass `style` to override background/border/padding.
```tsx
<Card style={{ background: "#0A0A0A" }}>content</Card>
```

### `<NavBar role="newcomer" active="Timeline" />`
Sticky top nav. Role options: `"newcomer"` | `"manager"` | `"hr"`.
Contains a ← Home button that links to `/`.
Active link is highlighted in black. On mobile (≤768px) nav links hide via `.nav-links` CSS class.

### `<PageShell nav={...}>`
Full page wrapper. Sets `min-height: 100vh`, `background: #F5F4F0`, renders the nav, then a `<main>` with max-width 1100px and padding.

### `<TwoCol left={...} right={...}>`
Two-column grid. Has `className="two-col"` — stacks to 1 column on mobile via CSS.

### `<ThreeCol>`
Three-column grid. Has `className="three-col"` — stacks to 1 column on mobile via CSS.

### `<ScoreRing score={62} size={72} />`
SVG circular progress ring. Color: green ≥70%, yellow ≥50%, red <50%.

### `<StatusDot status="yellow" />`
Pill badge. Options: `"green"` | `"yellow"` | `"red"`. Shows "On track", "Needs attention", "At risk".

### `<Avatar initials="SM" size={36} />`
Circle avatar with initials.

### `<SectionLabel>`
Uppercase small-caps grey label above a section.

### `<BucketTag bucket="job" />`
Small pill showing "My Job", "My Org", or "My People".

---

## 7. CHARTS (`components/Charts.tsx`)

Must have `"use client"` at the top. Exports:
- `BucketLineChart` — line chart of 3 bucket scores over time (first 3 data points)
- `ProjectedAreaChart` — area chart showing full 12-month projection
- `DivergenceChart` — area chart comparing self vs. manager scores
- `currentData` — first 3 months of mock data (exported for use in pages)
- `monthlyData` — full 12-month mock data

**How to import in a page:**
```tsx
import dynamic from "next/dynamic";
import { currentData, monthlyData } from "@/components/Charts";

const BucketLineChart = dynamic(
  () => import("@/components/Charts").then(m => ({ default: m.BucketLineChart })),
  { ssr: false }
);
```

---

## 8. MOCK DATA (`lib/mock.ts`)

All prototype data lives here. No real backend.

| Export | Contents |
|---|---|
| `newcomer` | Sofia's profile (name, role, dept, startDate, day, buddy, manager, company, phase) |
| `buckets` | 3 buckets with score and checklist items |
| `todayActions` | 3 daily action items with bucket tag |
| `myTeam` | 5 team members with relation labels |
| `managerNewcomers` | 3 newcomers for manager view (Sofia, Daniel, Yuki) |
| `hrOverview` | Org-wide stats (total, green/yellow/red split, avg scores, flight risk) |
| `hrNewcomers` | 6 newcomers for HR list |
| `evalQuestions` | 5 questions per bucket for self-evaluation |

---

## 9. ALL PAGES — WHAT EACH DOES

### `/` — Landing page (`app/page.tsx`)
Role accordion. Four collapsible role groups (Newcomer, Manager, HR Admin, Company Setup). Each expands to show sub-pages as links. Uses `useState<string | null>` to track which role is open.

### `/welcome` — Welcome flow (`app/welcome/page.tsx`)
4-step linear flow for newcomers before Day 1:
1. Personal welcome message from manager
2. Interactive work style tag selection (multi-select with `useState<string[]>`)
3. Priority selector (single-select)
4. First week preview calendar

Fixed ← Home button in top-left. Step counter and Next/Back navigation.

### `/setup` — Company Setup (`app/setup/page.tsx`)
5-step consultant-led onboarding:
1. Company info (name, size, industry)
2. Culture (values, keywords)
3. Role definition
4. People (buddy assignment, manager)
5. Launch checklist

Sidebar navigation showing all steps. Uses `useState` for step tracking.

### `/notifications` — Notification Center (`app/notifications/page.tsx`)
Single page with role switcher (Newcomer / Manager / HR). Shows notifications for each role:
- Alerts (red left border)
- Reminders (yellow left border)
- Info (green left border)

Dismissable with ✕ button. Clickable notifications link to relevant page. Uses `useState` to track read/unread per role.

### `/newcomer` — Dashboard (`app/newcomer/page.tsx`)
Day 18 dashboard for Sofia. Shows:
- Grey header card with phase status
- 3 bucket progress bars with scores
- Today's actions (3 items)
- Buddy card

### `/newcomer/docs` — Documents (`app/newcomer/docs/page.tsx`)
Split view: sidebar (doc list) + main viewer.
5 documents: Welcome Letter, Role & 90-Day Plan, Culture Guide, Org Structure, First Week Schedule.
Prev/Next navigation. Last doc shows "Go to dashboard →" instead of "Next →".
Uses `useState` for selected doc index. Content typed as `any` to avoid union type issues.

### `/newcomer/timeline` — Timeline (`app/newcomer/timeline/page.tsx`)
Fully interactive 12-month timeline. Features:
- Clickable phase ribbon at top (5 phases)
- Overall progress by bucket (across all phases)
- Phase detail section with tab switcher
- **Interactive checkboxes** — click to toggle done/not done
- Progress bars update live via `useState`

All checklist state is in `useState(initialPhases)`. Toggle function updates nested arrays immutably.

### `/newcomer/progress` — Progress Charts (`app/newcomer/progress/page.tsx`)
Two-column layout with charts. Uses `dynamic()` imports for all recharts components.
Left: 3-bucket line chart + growth badges + projected area chart
Right: Divergence chart + weekly snapshot bars + insight card

### `/newcomer/buckets` — My Journey (`app/newcomer/buckets/page.tsx`)
Three-bucket detail view with checklists and tips per bucket.

### `/newcomer/people` — My People (`app/newcomer/people/page.tsx`)
Relationship map showing team members with relation types (manager, buddy, peer, key contact). Suggested connections section.

### `/newcomer/org` — Org Chart (`app/newcomer/org/page.tsx`)
Visual hierarchical org chart. Features:
- Full company tree (CEO → VPs → teams), 3 levels
- **Clickable nodes** — click a person to see their detail panel on the right
- Sofia highlighted in black with "You · Day 18" tag
- Claire tagged as "Your manager", James as "Your buddy"
- Connecting lines drawn with `<div>` elements (no SVG, no pseudo-elements)
- Department legend + key connections panel

Connector lines technique: a vertical `<div>` down from parent, a horizontal `<div>` spanning children, vertical drops to each child. Width calculated from `count * (nodeWidth + gap)`.

### `/newcomer/evaluation` — Monthly Check-in (`app/newcomer/evaluation/page.tsx`)
Self-evaluation form with 3 bucket tabs. Per tab: 5 statements rated 1–5. Open text question. Submit button enabled when all items rated. Uses `useState` for ratings and submitted state.

### `/newcomer/complete` — Completion Screen (`app/newcomer/complete/page.tsx`)
12-month journey completion. Shows:
- Black hero card with "You are no longer new" headline
- Final scores in all 3 buckets via `ScoreRing`
- Growth comparison (Day 1 vs Month 12)
- Certificate card with tags
- Milestone timeline (7 moments across 12 months)

### `/manager` — Manager Team Overview (`app/manager/page.tsx`)
Overview of 3 newcomers. Red alert for flight risk. Each newcomer card has bucket bars and status dot. Data from `managerNewcomers` in mock.ts.

### `/manager/newcomer/sofia` — Individual Newcomer (`app/manager/newcomer/sofia/page.tsx`)
Sofia's profile from manager's perspective. Shows divergence alert, score rings (self vs. manager), qualitative quotes, nudges, 4-week trend.

### `/manager/checkin/sofia` — Manager Check-in (`app/manager/checkin/sofia/page.tsx`)
Manager rates Sofia's 3 buckets. Features:
- 3 bucket tabs with fill status indicator
- 5 questions per bucket, rated 1–5 (click buttons)
- Optional notes textarea per bucket
- Right panel: live comparison vs. Sofia's self-score with divergence gap
- Submit button enabled only when all 15 questions rated
- Post-submit confirmation screen

### `/hr` — HR Dashboard (`app/hr/page.tsx`)
Org-wide health. Shows green/yellow/red counts, avg bucket scores, phase distribution, flight risk, manager effectiveness.

### `/hr/newcomers` — All Newcomers (`app/hr/newcomers/page.tsx`)
List of 6 newcomers sorted by risk. Each row is a link to the detail page for known newcomers (via `slugMap`). Shows name, status dot, dept, day, manager.

### `/hr/newcomers/[slug]` — Newcomer Detail (`app/hr/newcomers/[slug]/page.tsx`)
Dynamic route. Slugs: `sofia`, `daniel`, `yuki`, `marcus`, `fatima`, `ben`.
Shows: header with status, 3 score rings, bucket progress bars, check-in history, alerts, strengths, self vs. manager gap, recommended HR actions.
Uses `notFound()` for unknown slugs.

---

## 10. KNOWN ISSUES AND FIXES APPLIED

### Issue 1: recharts crashes with SSR error
**Symptom:** `ReferenceError: window is not defined` or similar on pages that import recharts.
**Fix:** Never import recharts directly in a page. Extract to `components/Charts.tsx` (`"use client"`) and import with `dynamic(() => ..., { ssr: false })`.

### Issue 2: Card background not overriding
**Symptom:** `<Card className="bg-[#1A1A2E]">` shows white background.
**Cause:** Card's inline `style={{ background: "#FFFFFF" }}` overrides Tailwind className.
**Fix:** Use `<Card style={{ background: "#1A1A2E" }}>` — the `...style` spread wins.

### Issue 3: Tailwind responsive classes not working
**Symptom:** `lg:grid-cols-2` has no effect.
**Cause:** Tailwind v4 + Next.js 16 configuration issue.
**Fix:** Use inline CSS for layouts. For mobile responsiveness, add CSS classes in `globals.css` with `@media` queries and apply classNames to wrapper elements.

### Issue 4: TypeScript errors with document content union types
**Symptom:** TS error accessing `.body`, `.sections`, `.days` on content objects.
**Fix:** Cast content to `any`: `const c = doc.content as any`.

### Issue 5: Google Fonts @import order
**Symptom:** CSS error about @import order.
**Fix:** Google Fonts `@import url(...)` must come BEFORE `@import "tailwindcss"` in globals.css.

### Issue 6: Multiple lockfiles warning
**Symptom:** Warning about `C:/Users/bolve/package-lock.json` conflicting with project lockfile.
**Cause:** There is a `package-lock.json` in the user's home directory.
**Status:** Non-blocking warning, safe to ignore.

### Issue 7: Old dev server serving stale code
**Symptom:** Changes not visible in browser.
**Fix:** Find and kill old node process. In bash: `cmd //c "taskkill /PID <PID> /F"`. Then restart with `npm run dev`.

### Issue 8: Org chart connecting lines
**Approach:** Use explicit `<div>` elements for vertical and horizontal connector lines. No SVG, no pseudo-elements (can't do pseudo-elements with inline styles). Calculate widths from `count * nodeWidth + (count-1) * gap`.

---

## 11. HOW TO START THE DEV SERVER

```bash
cd C:/Users/bolve/projects/socialization-app
npm run dev
# Opens on http://localhost:3000
```

If port 3000 is already in use by a stale process:
```bash
# In bash (Git Bash on Windows):
cmd //c "taskkill /PID <PID_NUMBER> /F"
# Then restart npm run dev
```

---

## 12. THE POWERPOINT DECKS

Two separate decks in `C:/Users/bolve/deck/`:

### `Allen_Socialization_Platform.pptx` (built with `build.js`)
12-slide **concept deck** — theory, framework, business case, roadmap. Present first.
Slides: Cover · Problem · Three-bucket theory · 12-month phases · Evaluation system · Dashboards · Newcomer experience · Business model · Go-to-market · Roadmap · Academic value · Next steps

### `Allen_Prototype_Deck.pptx` (built with `prototype.js`)
8-slide **prototype deck** — shows what was actually built. Present after the concept deck.
Slides: Cover · What was built · Newcomer flow · Three buckets operationalized · Self vs. manager divergence · Manager & HR views · Research value of the platform · From prototype to pilot

To regenerate either deck:
```bash
cd C:/Users/bolve/deck
node build.js        # regenerates concept deck
node prototype.js    # regenerates prototype deck
```

Requires: `npm install pptxgenjs` (in the deck folder)

---

## 13. PERSONAS AND MOCK DATA USED

| Person | Role | Details |
|---|---|---|
| Sofia Martínez | Newcomer | Marketing Specialist, Day 18, Arrival phase |
| Claire Bennett | Manager | VP Marketing, Sofia's direct manager |
| James Okafor | Buddy | Senior Marketing Manager |
| Daniel Cruz | Newcomer | Data Analyst, Day 54, Integration, green status |
| Yuki Tanaka | Newcomer | Product Designer, Day 91, Adjustment, red status (social isolation) |
| Marcus Webb | Newcomer | Account Executive, Day 134, Stabilization, green |
| Fatima Al-Hassan | Newcomer | Legal Counsel, Day 201, Embedding, green |
| Ben Kowalski | Newcomer | Software Engineer, Day 12, Arrival, green |
| Ravi Sharma | Manager | Daniel's and Ben's manager |
| Sarah Chen | CEO | Top of org chart |
| Ana Lima | VP Sales | Cross-functional contact |

---

## 14. MOBILE RESPONSIVENESS

Applied via CSS media queries in `globals.css`:
```css
@media (max-width: 768px) {
  .two-col   { grid-template-columns: 1fr !important; }
  .three-col { grid-template-columns: 1fr !important; }
  .page-main { padding: 16px 14px !important; }
  .nav-links { display: none !important; }
  .nav-inner { padding: 0 16px !important; }
}
@media (max-width: 480px) {
  .card-pad  { padding: 14px 14px !important; }
}
```

Classes are applied in `ui.tsx`:
- `TwoCol` → `className="two-col"`
- `ThreeCol` → `className="three-col"`
- `PageShell` main → `className="page-main"`
- NavBar nav links wrapper → `className="nav-links"`
- NavBar inner div → `className="nav-inner"`
