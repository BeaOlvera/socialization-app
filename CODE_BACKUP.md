# CODE BACKUP — Onboard Socialization App
# Project: C:/Users/bolve/projects/socialization-app
# Contains all source files in full. Use this to reconstruct the project.

---

## package.json
```json
{
  "name": "socialization-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "lucide-react": "^0.577.0",
    "next": "16.2.1",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "recharts": "^3.8.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.1",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

---

## app/globals.css
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
@import "tailwindcss";

:root {
  --bg: #F5F4F0;
  --surface: #FFFFFF;
  --border: #E2E0DA;
  --ink: #0A0A0A;
  --muted: #6B6B6B;
  --faint: #AEABA3;
  --accent: #1A1A2E;
  --accent-light: #EEEEF5;
  --green: #2D6A4F;
  --green-light: #EAF4EF;
  --yellow: #B7791F;
  --yellow-light: #FEF3E2;
  --red: #9B2335;
  --red-light: #FBEAEC;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  background: var(--bg);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@media (prefers-color-scheme: dark) {
  html, body { background: var(--bg); color: var(--ink); }
}

/* Mobile responsive utilities */
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

---

## app/layout.tsx
```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Onboard — Newcomer Socialization Platform",
  description: "Accelerating newcomer socialization",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

---

## lib/mock.ts
```ts
export const newcomer = {
  name: "Sofia Martínez",
  role: "Senior Marketing Manager",
  department: "Marketing",
  startDate: "March 3, 2026",
  day: 18,
  buddy: { name: "James Okafor", role: "Marketing Strategist" },
  manager: { name: "Claire Bennett", role: "VP Marketing" },
  company: "Meridian Group",
  phase: "Arrival",
};

export const buckets = [
  {
    id: "job",
    label: "My Job",
    number: "01",
    score: 62,
    color: "accent",
    items: [
      { label: "Role clarity", done: true },
      { label: "30-60-90 day goals", done: true },
      { label: "Performance criteria", done: false },
      { label: "Tools & systems access", done: true },
      { label: "Who to ask for what", done: false },
    ],
  },
  {
    id: "org",
    label: "My Organization",
    number: "02",
    score: 48,
    color: "ink",
    items: [
      { label: "Org chart & team structure", done: true },
      { label: "Company values & culture", done: true },
      { label: "Strategy & current priorities", done: false },
      { label: "How decisions are made", done: false },
      { label: "Norms & rituals", done: false },
    ],
  },
  {
    id: "people",
    label: "My People",
    number: "03",
    score: 35,
    color: "muted",
    items: [
      { label: "Met my buddy", done: true },
      { label: "Met my direct team", done: true },
      { label: "Key cross-functional contacts", done: false },
      { label: "Informal networks", done: false },
      { label: "Sense of belonging", done: false },
    ],
  },
];

export const todayActions = [
  { bucket: "job", text: "Review your 90-day goals with Claire", urgent: true },
  { bucket: "people", text: "Send a coffee chat request to Ana Lima (Finance)", urgent: false },
  { bucket: "org", text: "Watch the 5-min company strategy video", urgent: false },
];

export const myTeam = [
  { name: "Claire Bennett", role: "VP Marketing", relation: "Your manager", avatar: "CB" },
  { name: "James Okafor", role: "Marketing Strategist", relation: "Your buddy", avatar: "JO" },
  { name: "Priya Nair", role: "Content Lead", relation: "Peer", avatar: "PN" },
  { name: "Tom Reyes", role: "Brand Designer", relation: "Peer", avatar: "TR" },
  { name: "Ana Lima", role: "Finance Business Partner", relation: "Key contact", avatar: "AL" },
];

export const managerNewcomers = [
  {
    name: "Sofia Martínez",
    role: "Sr. Marketing Manager",
    day: 18,
    phase: "Arrival",
    status: "yellow",
    scores: { job: 62, org: 48, people: 35 },
    selfScore: 48,
    managerScore: 65,
    flag: "Self vs manager divergence — schedule a check-in",
  },
  {
    name: "Daniel Cruz",
    role: "Data Analyst",
    day: 54,
    phase: "Integration",
    status: "green",
    scores: { job: 78, org: 72, people: 68 },
    selfScore: 72,
    managerScore: 74,
    flag: null,
  },
  {
    name: "Yuki Tanaka",
    role: "Product Designer",
    day: 91,
    phase: "Adjustment",
    status: "red",
    scores: { job: 55, org: 40, people: 28 },
    selfScore: 38,
    managerScore: 60,
    flag: "Social isolation — Bucket 3 critically low",
  },
];

export const hrOverview = {
  total: 14,
  green: 8,
  yellow: 4,
  red: 2,
  avgScores: { job: 69, org: 58, people: 52 },
  flightRisk: 2,
  phases: { arrival: 5, integration: 4, adjustment: 3, stabilization: 1, embedding: 1 },
};

export const hrNewcomers = [
  { name: "Sofia Martínez", dept: "Marketing", day: 18, status: "yellow", manager: "Claire Bennett" },
  { name: "Daniel Cruz", dept: "Analytics", day: 54, status: "green", manager: "Ravi Sharma" },
  { name: "Yuki Tanaka", dept: "Product", day: 91, status: "red", manager: "Claire Bennett" },
  { name: "Marcus Webb", dept: "Sales", day: 134, status: "green", manager: "Lee Park" },
  { name: "Fatima Al-Hassan", dept: "Legal", day: 201, status: "green", manager: "Susan Cole" },
  { name: "Ben Kowalski", dept: "Engineering", day: 12, status: "green", manager: "Ravi Sharma" },
];

export const evalQuestions = {
  job: [
    "I clearly understand what is expected of me in my role",
    "I feel confident performing my core tasks",
    "I know where to find the resources I need",
    "I understand how my performance will be evaluated",
    "I have achieved meaningful results since joining",
  ],
  org: [
    "I understand how decisions are made in this company",
    "I feel aligned with the company's values and culture",
    "I understand how my role contributes to company goals",
    "I know who to go to for information outside my team",
    "I feel comfortable navigating this organization",
  ],
  people: [
    "I have built meaningful relationships with colleagues",
    "I feel like I belong in this team",
    "I feel comfortable asking others for help",
    "I know who my key contacts are across the company",
    "I feel socially integrated in this organization",
  ],
};
```

---

## components/ui.tsx
```tsx
"use client";
import Link from "next/link";
import React, { ReactNode } from "react";

export function Card({ children, className = "", style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`${className}`} style={{
      background: "#FFFFFF",
      borderRadius: 16,
      border: "1px solid #E2E0DA",
      padding: "20px 22px",
      ...style
    }}>
      {children}
    </div>
  );
}

export function ScoreRing({ score, size = 72 }: { score: number; size?: number }) {
  const r = (size / 2) - 6;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 70 ? "#2D6A4F" : score >= 50 ? "#B7791F" : "#9B2335";
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E2E0DA" strokeWidth={5} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={5}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text
        x={size/2} y={size/2 + 5}
        textAnchor="middle" fill="#0A0A0A"
        fontSize={size > 60 ? 15 : 11} fontWeight={600}
        style={{ transform: `rotate(90deg) translate(0px, -${size}px)`, transformOrigin: `${size/2}px ${size/2}px` }}
      >
        {score}%
      </text>
    </svg>
  );
}

export function StatusDot({ status }: { status: "green" | "yellow" | "red" }) {
  const colors = { green: "#2D6A4F", yellow: "#B7791F", red: "#9B2335" };
  const bgs = { green: "#EAF4EF", yellow: "#FEF3E2", red: "#FBEAEC" };
  const labels = { green: "On track", yellow: "Needs attention", red: "At risk" };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
      style={{ background: bgs[status], color: colors[status] }}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: colors[status] }} />
      {labels[status]}
    </span>
  );
}

export function Avatar({ initials, size = 36 }: { initials: string; size?: number }) {
  return (
    <div className="rounded-full bg-[#EEEEF5] flex items-center justify-center flex-shrink-0 font-semibold text-[#1A1A2E]"
      style={{ width: size, height: size, fontSize: size * 0.33 }}>
      {initials}
    </div>
  );
}

export function NavBar({ role, active }: { role: "newcomer" | "manager" | "hr"; active: string }) {
  const links = {
    newcomer: [
      { href: "/newcomer", label: "Home" },
      { href: "/newcomer/docs", label: "Documents" },
      { href: "/newcomer/timeline", label: "Timeline" },
      { href: "/newcomer/progress", label: "Progress" },
      { href: "/newcomer/buckets", label: "My Journey" },
      { href: "/newcomer/org", label: "Org Chart" },
      { href: "/newcomer/people", label: "My People" },
      { href: "/newcomer/evaluation", label: "Check-in" },
    ],
    manager: [
      { href: "/manager", label: "My Team" },
      { href: "/manager/newcomer/sofia", label: "Sofia M." },
    ],
    hr: [
      { href: "/hr", label: "Overview" },
      { href: "/hr/newcomers", label: "All Newcomers" },
    ],
  };

  const roleLabel = { newcomer: "Newcomer", manager: "Manager", hr: "HR Admin" };
  const roleColors = { newcomer: "#1A1A2E", manager: "#2D6A4F", hr: "#9B2335" };

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "#FFFFFF", borderBottom: "1px solid #E2E0DA" }}>
      <div className="nav-inner" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo + back */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/" style={{
            display: "flex", alignItems: "center", gap: 6, textDecoration: "none",
            padding: "5px 10px 5px 8px", borderRadius: 8, border: "1px solid #E2E0DA",
            background: "#F5F4F0", color: "#6B6B6B", fontSize: 12, fontWeight: 500,
          }}>
            <span style={{ fontSize: 14 }}>←</span> Home
          </Link>
          <div style={{ width: 1, height: 16, background: "#E2E0DA" }} />
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "#1A1A2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#FFF", fontWeight: 800, fontSize: 11 }}>ob</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#0A0A0A", letterSpacing: "-0.3px" }}>onboard</span>
          <div style={{ width: 1, height: 16, background: "#E2E0DA" }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#FFFFFF", background: roleColors[role], padding: "2px 10px", borderRadius: 20 }}>
            {roleLabel[role]}
          </span>
        </div>
        {/* Nav links */}
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {links[role].map(l => (
            <Link key={l.href} href={l.href} style={{
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              textDecoration: "none",
              background: active === l.label ? "#0A0A0A" : "transparent",
              color: active === l.label ? "#FFFFFF" : "#6B6B6B",
              transition: "all 0.15s"
            }}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export function PageShell({ children, nav }: { children: ReactNode; nav: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#F5F4F0" }}>
      {nav}
      <main className="page-main" style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
        {children}
      </main>
    </div>
  );
}

export function TwoCol({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{left}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{right}</div>
    </div>
  );
}

export function ThreeCol({ children }: { children: ReactNode }) {
  return (
    <div className="three-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-widest text-[#AEABA3] uppercase mb-3">
      {children}
    </p>
  );
}

export function BucketTag({ bucket }: { bucket: string }) {
  const map: Record<string, string> = {
    job: "My Job", org: "My Org", people: "My People"
  };
  const colors: Record<string, string> = {
    job: "#EEEEF5", org: "#F5F4F0", people: "#F5F4F0"
  };
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full text-[#6B6B6B]"
      style={{ background: colors[bucket] }}>
      {map[bucket]}
    </span>
  );
}
```

---

## components/Charts.tsx
```tsx
"use client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart, Legend
} from "recharts";

const monthlyData = [
  { month: "Mar W1", job: 30, org: 20, people: 15, self: 22, manager: 38 },
  { month: "Mar W3", job: 45, org: 32, people: 25, self: 34, manager: 52 },
  { month: "Apr",    job: 58, org: 42, people: 35, self: 45, manager: 61 },
  { month: "May",    job: 65, org: 55, people: 45, self: 55, manager: 66 },
  { month: "Jun",    job: 70, org: 62, people: 55, self: 62, manager: 70 },
  { month: "Jul",    job: 74, org: 68, people: 63, self: 68, manager: 73 },
  { month: "Aug",    job: 77, org: 72, people: 70, self: 73, manager: 76 },
  { month: "Sep",    job: 80, org: 76, people: 74, self: 76, manager: 79 },
  { month: "Oct",    job: 82, org: 78, people: 77, self: 79, manager: 81 },
  { month: "Nov",    job: 84, org: 80, people: 80, self: 81, manager: 82 },
  { month: "Dec",    job: 86, org: 82, people: 82, self: 83, manager: 84 },
  { month: "Feb 27", job: 88, org: 84, people: 85, self: 85, manager: 86 },
];

const currentData = monthlyData.slice(0, 3);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#FFFFFF", border: "1px solid #E2E0DA", borderRadius: 10, padding: "10px 14px", fontSize: 12 }}>
        <p style={{ fontWeight: 700, color: "#0A0A0A", marginBottom: 6 }}>{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <div style={{ width: 8, height: 8, borderRadius: 99, background: p.color }} />
            <span style={{ color: "#6B6B6B" }}>{p.name}:</span>
            <span style={{ fontWeight: 600, color: "#0A0A0A" }}>{p.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function BucketLineChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={currentData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
        <CartesianGrid stroke="#F5F4F0" strokeDasharray="0" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#AEABA3" }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#AEABA3" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={70} stroke="#E2E0DA" strokeDasharray="4 4" label={{ value: "Target", position: "right", fontSize: 10, fill: "#AEABA3" }} />
        <Line type="monotone" dataKey="job" name="My Job" stroke="#1A1A2E" strokeWidth={2.5} dot={{ fill: "#1A1A2E", r: 4 }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="org" name="My Org" stroke="#2D6A4F" strokeWidth={2.5} dot={{ fill: "#2D6A4F", r: 4 }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="people" name="My People" stroke="#9B2335" strokeWidth={2.5} dot={{ fill: "#9B2335", r: 4 }} activeDot={{ r: 6 }} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ProjectedAreaChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={monthlyData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
        <defs>
          <linearGradient id="jobGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1A1A2E" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#1A1A2E" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="peopleGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#9B2335" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#9B2335" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#F5F4F0" strokeDasharray="0" />
        <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#AEABA3" }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#AEABA3" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine x="Mar W3" stroke="#E2E0DA" strokeDasharray="4 4" label={{ value: "Today", position: "top", fontSize: 9, fill: "#AEABA3" }} />
        <ReferenceLine y={70} stroke="#E2E0DA" strokeDasharray="4 4" />
        <Area type="monotone" dataKey="job" name="My Job" stroke="#1A1A2E" strokeWidth={2} fill="url(#jobGrad)" />
        <Area type="monotone" dataKey="people" name="My People" stroke="#9B2335" strokeWidth={2} fill="url(#peopleGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function DivergenceChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={currentData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
        <defs>
          <linearGradient id="gapGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#B7791F" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#B7791F" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#F5F4F0" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#AEABA3" }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#AEABA3" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="manager" name="Manager view" stroke="#1A1A2E" strokeWidth={2.5} fill="transparent" />
        <Area type="monotone" dataKey="self" name="Self view" stroke="#B7791F" strokeWidth={2.5} fill="url(#gapGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export { currentData, monthlyData };
```

---

## app/page.tsx
```tsx
"use client";
import Link from "next/link";
import { useState } from "react";

const roles = [
  {
    label: "Newcomer",
    sub: "Sofia Martínez · Day 18",
    accent: "#1A1A2E",
    accentBg: "#EEEEF5",
    icon: "NW",
    children: [
      { href: "/welcome", label: "Welcome flow", sub: "Before Day 1 — onboarding steps" },
      { href: "/newcomer/docs", label: "Pre-arrival documents", sub: "Letter, role, culture, first week" },
      { href: "/newcomer", label: "Dashboard", sub: "Day 18 · Arrival phase" },
      { href: "/newcomer/timeline", label: "12-month timeline", sub: "All phases, all buckets" },
      { href: "/newcomer/progress", label: "Progress charts", sub: "Scores over time · divergence" },
      { href: "/newcomer/buckets", label: "My Journey", sub: "Three-bucket progress" },
      { href: "/newcomer/org", label: "Org Chart", sub: "Company structure & your connections" },
      { href: "/newcomer/people", label: "My People", sub: "Relationships & network" },
      { href: "/newcomer/evaluation", label: "Monthly check-in", sub: "Self-evaluation form" },
      { href: "/newcomer/complete", label: "Journey complete", sub: "12-month completion screen" },
      { href: "/notifications", label: "Notifications", sub: "Alerts, reminders, updates" },
    ],
  },
  {
    label: "Manager",
    sub: "Claire Bennett · VP Marketing",
    accent: "#2D6A4F",
    accentBg: "#EAF4EF",
    icon: "MG",
    children: [
      { href: "/manager", label: "Team overview", sub: "3 active newcomers" },
      { href: "/manager/newcomer/sofia", label: "Sofia Martínez", sub: "Individual view · divergence alert" },
      { href: "/manager/checkin/sofia", label: "Manager check-in", sub: "Rate Sofia's three buckets" },
      { href: "/notifications", label: "Notifications", sub: "Alerts & reminders" },
    ],
  },
  {
    label: "HR Admin",
    sub: "Meridian Group · 14 newcomers",
    accent: "#9B2335",
    accentBg: "#FBEAEC",
    icon: "HR",
    children: [
      { href: "/hr", label: "Organization overview", sub: "Health, scores, flight risk" },
      { href: "/hr/newcomers", label: "All newcomers", sub: "Sorted by adjustment risk" },
      { href: "/notifications", label: "Notifications", sub: "Alerts & flight risk" },
    ],
  },
  {
    label: "Company Setup",
    sub: "Consultant view",
    accent: "#6B6B6B",
    accentBg: "#F5F4F0",
    icon: "CS",
    children: [
      { href: "/setup", label: "Onboarding setup", sub: "Company, culture, role, people, launch" },
    ],
  },
];

export default function Home() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "#F5F4F0", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px" }}>
      <div style={{ width: "100%", maxWidth: 500 }}>

        {/* Logo block */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E0DA", borderRadius: 20, padding: "36px 40px 32px", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "#1A1A2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#FFFFFF", fontWeight: 800, fontSize: 13 }}>ob</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: 19, color: "#0A0A0A", letterSpacing: "-0.5px" }}>onboard</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.5px", lineHeight: 1.25, marginBottom: 8 }}>
            Accelerating newcomer<br />socialization
          </h1>
          <p style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.7 }}>
            Three parallel tracks. Twelve months. Built on Allen&apos;s socialization framework.
          </p>
        </div>

        {/* Role accordion */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E0DA", borderRadius: 20, padding: "20px 20px 16px", marginBottom: 12 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#AEABA3", textTransform: "uppercase", marginBottom: 14 }}>
            Demo — select a role
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {roles.map((role, ri) => {
              const isOpen = open === role.label;
              return (
                <div key={role.label}>
                  {/* Role row — clickable header */}
                  <button
                    onClick={() => setOpen(isOpen ? null : role.label)}
                    style={{
                      width: "100%", textAlign: "left", cursor: "pointer", border: "none", fontFamily: "inherit",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 14px", borderRadius: 12,
                      background: isOpen ? "#0A0A0A" : "#F5F4F0",
                      transition: "background 0.15s",
                    }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: isOpen ? "#1A1A1A" : role.accentBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 9, fontWeight: 800, color: isOpen ? role.accentBg : role.accent }}>{role.icon}</span>
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: isOpen ? "#FFFFFF" : "#0A0A0A" }}>{role.label}</p>
                        <p style={{ fontSize: 11, color: isOpen ? "#888" : "#AEABA3" }}>{role.sub}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: 13, color: isOpen ? "#888" : "#AEABA3", transition: "transform 0.2s", display: "inline-block", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
                  </button>

                  {/* Subfolders */}
                  {isOpen && (
                    <div style={{ paddingLeft: 14, paddingTop: 6, paddingBottom: 4, display: "flex", flexDirection: "column", gap: 3 }}>
                      {role.children.map(child => (
                        <Link key={child.href} href={child.href} style={{ textDecoration: "none" }}>
                          <div style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "9px 14px", borderRadius: 10,
                            background: "#F5F4F0", border: "1px solid #ECEAE4",
                            cursor: "pointer",
                          }}>
                            <div>
                              <p style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", marginBottom: 1 }}>{child.label}</p>
                              <p style={{ fontSize: 11, color: "#AEABA3" }}>{child.sub}</p>
                            </div>
                            <span style={{ color: "#AEABA3", fontSize: 14, marginLeft: 8 }}>›</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {ri < roles.length - 1 && !isOpen && (
                    <div style={{ height: 1, background: "#F5F4F0", margin: "2px 0" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <p style={{ fontSize: 11, color: "#AEABA3", textAlign: "center", marginTop: 12 }}>
          Prototype · v0.1 · Allen Socialization Framework
        </p>
      </div>
    </div>
  );
}
```

---

## app/welcome/page.tsx
```tsx
"use client";
import { useState } from "react";
import Link from "next/link";

const steps = [
  {
    id: "invite",
    label: null,
  },
  {
    id: "profile",
    label: "Tell us about you",
  },
  {
    id: "expectations",
    label: "Your mindset",
  },
  {
    id: "preview",
    label: "Your first week",
  },
  {
    id: "ready",
    label: null,
  },
];

export default function WelcomePage() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({ name: "Sofia", role: "Senior Marketing Manager", excitement: "", nervous: "", workStyle: [] as string[] });
  const [expectations, setExpectations] = useState({ focus: "", strength: "" });

  const next = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div style={{ minHeight: "100vh", background: "#F5F4F0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>

      {/* Back to home */}
      <a href="/" style={{ position: "fixed", top: 20, left: 24, display: "flex", alignItems: "center", gap: 6, textDecoration: "none", padding: "6px 12px 6px 10px", borderRadius: 8, border: "1px solid #E2E0DA", background: "#FFFFFF", color: "#6B6B6B", fontSize: 12, fontWeight: 500, zIndex: 50 }}>
        ← Home
      </a>

      {/* Progress dots */}
      {step > 0 && step < steps.length - 1 && (
        <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
          {steps.slice(1, -1).map((_, i) => (
            <div key={i} style={{
              width: i === step - 1 ? 24 : 6,
              height: 6,
              borderRadius: 99,
              background: i === step - 1 ? "#0A0A0A" : "#DDDBD5",
              transition: "all 0.3s"
            }} />
          ))}
        </div>
      )}

      <div style={{ width: "100%", maxWidth: 520 }}>

        {/* ── Step 0: Invite ── */}
        {step === 0 && (
          <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E0DA", padding: "48px 40px", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "#1A1A2E", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
              <span style={{ color: "#FFFFFF", fontWeight: 800, fontSize: 18 }}>ob</span>
            </div>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", color: "#AEABA3", textTransform: "uppercase", marginBottom: 12 }}>
              Meridian Group
            </p>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.5px", marginBottom: 12, lineHeight: 1.25 }}>
              Welcome, Sofia.
            </h1>
            <p style={{ fontSize: 14, color: "#6B6B6B", lineHeight: 1.7, marginBottom: 32 }}>
              We&apos;re so glad you&apos;re joining us.<br />
              This app will guide your first 12 months — your role, your organization, and your people.
            </p>
            <div style={{ background: "#F5F4F0", borderRadius: 12, padding: "16px 20px", marginBottom: 32, textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "#6B6B6B" }}>Your role</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A" }}>Senior Marketing Manager</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "#6B6B6B" }}>Start date</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A" }}>March 3, 2026</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "#6B6B6B" }}>Your manager</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A" }}>Claire Bennett</span>
              </div>
            </div>
            <button onClick={next} style={{
              width: "100%", padding: "14px", background: "#0A0A0A", color: "#FFFFFF",
              borderRadius: 12, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer"
            }}>
              Get started →
            </button>
            <p style={{ fontSize: 11, color: "#AEABA3", marginTop: 16 }}>Takes about 3 minutes</p>
          </div>
        )}

        {/* ── Step 1: Profile ── */}
        {step === 1 && (
          <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E0DA", padding: "36px 40px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#AEABA3", textTransform: "uppercase", marginBottom: 8 }}>Step 1 of 3</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0A0A0A", marginBottom: 6, letterSpacing: "-0.3px" }}>Tell us about you</h2>
            <p style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 28, lineHeight: 1.6 }}>This helps your buddy and manager understand who you are before Day 1.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 8 }}>
                  What are you most excited about?
                </label>
                <textarea
                  value={profile.excitement}
                  onChange={e => setProfile(p => ({ ...p, excitement: e.target.value }))}
                  placeholder="Meeting the team, diving into new challenges..."
                  rows={3}
                  style={{
                    width: "100%", padding: "12px 14px", border: "1px solid #E2E0DA",
                    borderRadius: 10, fontSize: 13, color: "#0A0A0A", resize: "none",
                    outline: "none", fontFamily: "inherit", background: "#FAFAF9"
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 8 }}>
                  What makes you a little nervous?
                </label>
                <textarea
                  value={profile.nervous}
                  onChange={e => setProfile(p => ({ ...p, nervous: e.target.value }))}
                  placeholder="Learning all the new processes, finding my footing..."
                  rows={3}
                  style={{
                    width: "100%", padding: "12px 14px", border: "1px solid #E2E0DA",
                    borderRadius: 10, fontSize: 13, color: "#0A0A0A", resize: "none",
                    outline: "none", fontFamily: "inherit", background: "#FAFAF9"
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 10 }}>
                  How do you prefer to work?
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Independently", "Collaboratively", "Structured", "Flexible", "Deep focus", "Fast-paced"].map(tag => {
                    const selected = profile.workStyle.includes(tag);
                    return (
                      <button key={tag}
                        onClick={() => setProfile(p => ({
                          ...p,
                          workStyle: selected ? p.workStyle.filter(t => t !== tag) : [...p.workStyle, tag]
                        }))}
                        style={{
                          padding: "6px 14px", borderRadius: 99, cursor: "pointer", fontFamily: "inherit",
                          border: selected ? "2px solid #0A0A0A" : "1px solid #E2E0DA",
                          background: selected ? "#0A0A0A" : "#F5F4F0",
                          color: selected ? "#FFFFFF" : "#6B6B6B",
                          fontSize: 12, fontWeight: selected ? 600 : 400
                        }}>
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
              <button onClick={back} style={{
                flex: 1, padding: "13px", background: "#F5F4F0", color: "#6B6B6B",
                borderRadius: 12, fontWeight: 600, fontSize: 13, border: "1px solid #E2E0DA", cursor: "pointer"
              }}>
                Back
              </button>
              <button onClick={next} style={{
                flex: 2, padding: "13px", background: "#0A0A0A", color: "#FFFFFF",
                borderRadius: 12, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer"
              }}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Expectations ── */}
        {step === 2 && (
          <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E0DA", padding: "36px 40px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#AEABA3", textTransform: "uppercase", marginBottom: 8 }}>Step 2 of 3</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0A0A0A", marginBottom: 6, letterSpacing: "-0.3px" }}>Your mindset</h2>
            <p style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 28, lineHeight: 1.6 }}>No right or wrong answers — this helps us personalize your journey.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 12 }}>
                  In your first months, your priority is:
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { id: "learn", label: "Learn as much as possible before acting", icon: "📖" },
                    { id: "deliver", label: "Deliver results fast to show my value", icon: "⚡" },
                    { id: "connect", label: "Build relationships before anything else", icon: "🤝" },
                  ].map(opt => (
                    <button key={opt.id} onClick={() => setExpectations(p => ({ ...p, focus: opt.id }))}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "14px 16px", borderRadius: 12, cursor: "pointer",
                        border: expectations.focus === opt.id ? "2px solid #0A0A0A" : "1px solid #E2E0DA",
                        background: expectations.focus === opt.id ? "#F5F4F0" : "#FFFFFF",
                        fontFamily: "inherit", textAlign: "left"
                      }}>
                      <span style={{ fontSize: 20 }}>{opt.icon}</span>
                      <span style={{ fontSize: 13, color: "#0A0A0A", fontWeight: expectations.focus === opt.id ? 600 : 400 }}>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 12 }}>
                  Your biggest strength coming in:
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Strategic thinking", "Execution", "Communication", "Analytics", "Leadership", "Creativity", "Relationship building"].map(s => (
                    <button key={s} onClick={() => setExpectations(p => ({ ...p, strength: s }))}
                      style={{
                        padding: "7px 14px", borderRadius: 99, cursor: "pointer", fontFamily: "inherit",
                        border: expectations.strength === s ? "2px solid #0A0A0A" : "1px solid #E2E0DA",
                        background: expectations.strength === s ? "#0A0A0A" : "#F5F4F0",
                        color: expectations.strength === s ? "#FFFFFF" : "#6B6B6B",
                        fontSize: 12, fontWeight: expectations.strength === s ? 600 : 400
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
              <button onClick={back} style={{
                flex: 1, padding: "13px", background: "#F5F4F0", color: "#6B6B6B",
                borderRadius: 12, fontWeight: 600, fontSize: 13, border: "1px solid #E2E0DA", cursor: "pointer"
              }}>
                Back
              </button>
              <button onClick={next} style={{
                flex: 2, padding: "13px", background: "#0A0A0A", color: "#FFFFFF",
                borderRadius: 12, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer"
              }}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Preview ── */}
        {step === 3 && (
          <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E0DA", padding: "36px 40px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#AEABA3", textTransform: "uppercase", marginBottom: 8 }}>Step 3 of 3</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0A0A0A", marginBottom: 6, letterSpacing: "-0.3px" }}>Your first week</h2>
            <p style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 24, lineHeight: 1.6 }}>Here&apos;s what we&apos;ve prepared for you across your three tracks.</p>

            {[
              {
                number: "01", label: "My Job", color: "#1A1A2E", bg: "#EEEEF5",
                items: ["Review your job description and 90-day goals", "Get access to all your tools", "Understand how performance is measured"]
              },
              {
                number: "02", label: "My Organization", color: "#2D6A4F", bg: "#EAF4EF",
                items: ["Watch the 5-min company strategy video", "Browse the org chart", "Read the culture guide"]
              },
              {
                number: "03", label: "My People", color: "#9B2335", bg: "#FBEAEC",
                items: ["Meet your buddy James Okafor", "Intro call with your team", "Coffee chat with your manager Claire"]
              },
            ].map(b => (
              <div key={b.number} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: b.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: b.color }}>{b.number}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A" }}>{b.label}</span>
                </div>
                <div style={{ paddingLeft: 38, display: "flex", flexDirection: "column", gap: 6 }}>
                  {b.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <div style={{ width: 4, height: 4, borderRadius: 99, background: "#DDDBD5", marginTop: 6, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: "#6B6B6B", lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
              <button onClick={back} style={{
                flex: 1, padding: "13px", background: "#F5F4F0", color: "#6B6B6B",
                borderRadius: 12, fontWeight: 600, fontSize: 13, border: "1px solid #E2E0DA", cursor: "pointer"
              }}>
                Back
              </button>
              <button onClick={next} style={{
                flex: 2, padding: "13px", background: "#0A0A0A", color: "#FFFFFF",
                borderRadius: 12, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer"
              }}>
                I&apos;m ready →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: Ready ── */}
        {step === 4 && (
          <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E0DA", padding: "48px 40px", textAlign: "center" }}>
            <div style={{
              width: 56, height: 56, borderRadius: 99, background: "#EAF4EF",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px"
            }}>
              <span style={{ fontSize: 24 }}>✓</span>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0A0A0A", marginBottom: 10, letterSpacing: "-0.3px" }}>
              You&apos;re all set, Sofia.
            </h2>
            <p style={{ fontSize: 14, color: "#6B6B6B", lineHeight: 1.7, marginBottom: 32 }}>
              Your journey starts on <strong>March 3</strong>.<br />
              Your buddy James will reach out before then.
            </p>

            <div style={{ background: "#F5F4F0", borderRadius: 12, padding: "16px 20px", marginBottom: 28, textAlign: "left" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#AEABA3", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Your profile summary</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "#6B6B6B" }}>Excited about</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#0A0A0A", maxWidth: "55%", textAlign: "right" }}>
                    {profile.excitement || "Meeting the team"}
                  </span>
                </div>
                <div style={{ height: 1, background: "#E2E0DA" }} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "#6B6B6B" }}>Main strength</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#0A0A0A" }}>{expectations.strength || "Strategic thinking"}</span>
                </div>
                <div style={{ height: 1, background: "#E2E0DA" }} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "#6B6B6B" }}>First priority</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#0A0A0A" }}>
                    {expectations.focus === "learn" ? "Learn first" : expectations.focus === "deliver" ? "Deliver fast" : expectations.focus === "connect" ? "Build relationships" : "Connect with team"}
                  </span>
                </div>
              </div>
            </div>

            <Link href="/newcomer" style={{ display: "block", textDecoration: "none" }}>
              <button style={{
                width: "100%", padding: "14px", background: "#0A0A0A", color: "#FFFFFF",
                borderRadius: 12, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer"
              }}>
                Go to my dashboard →
              </button>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
```

---

## app/setup/page.tsx
```tsx
"use client";
import { useState } from "react";

const steps = ["Company", "Culture", "Role", "People", "Launch"];

export default function SetupPage() {
  const [step, setStep] = useState(0);

  const next = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div style={{ minHeight: "100vh", background: "#F5F4F0", display: "flex" }}>

      {/* Sidebar */}
      <div style={{ width: 260, background: "#0A0A0A", padding: "36px 28px", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "#1A1A2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#FFF", fontWeight: 800, fontSize: 11 }}>ob</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#FFFFFF" }}>onboard</span>
        </div>

        <p style={{ fontSize: 10, fontWeight: 700, color: "#444", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
          Company setup
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {steps.map((s, i) => (
            <button key={s} onClick={() => setStep(i)} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 14px", borderRadius: 10, border: "none",
              background: i === step ? "#1A1A1A" : "transparent",
              cursor: "pointer", textAlign: "left"
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 99, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: i < step ? "#2D6A4F" : i === step ? "#FFFFFF" : "#222",
                fontSize: 10, fontWeight: 700,
                color: i < step ? "#FFFFFF" : i === step ? "#0A0A0A" : "#444"
              }}>
                {i < step ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 13, fontWeight: i === step ? 600 : 400, color: i === step ? "#FFFFFF" : "#6B6B6B" }}>
                {s}
              </span>
            </button>
          ))}
        </div>

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none", padding: "8px 14px", borderRadius: 8, border: "1px solid #222", color: "#6B6B6B", fontSize: 12, fontWeight: 500 }}>
            ← Back to home
          </a>
          <div style={{ padding: "16px 14px", background: "#111", borderRadius: 12 }}>
            <p style={{ fontSize: 11, color: "#444", marginBottom: 4 }}>Consultant</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#FFFFFF" }}>Your Name</p>
            <p style={{ fontSize: 11, color: "#6B6B6B" }}>Setting up Meridian Group</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "48px 56px", overflowY: "auto" }}>

        {/* ── Step 0: Company ── */}
        {step === 0 && (
          <div style={{ maxWidth: 640 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0A0A0A", marginBottom: 6, letterSpacing: "-0.3px" }}>Company information</h1>
            <p style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 36, lineHeight: 1.6 }}>Basic details about the organization. This will appear in every newcomer&apos;s dashboard.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { label: "Company name", placeholder: "Meridian Group", value: "Meridian Group" },
                { label: "Industry", placeholder: "e.g. Financial Services, Technology..." },
                { label: "Company size", placeholder: "e.g. 450 employees" },
                { label: "Headquarters", placeholder: "e.g. Chicago, IL" },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 8 }}>{f.label}</label>
                  <input defaultValue={f.value || ""} placeholder={f.placeholder} style={{
                    width: "100%", padding: "11px 14px", border: "1px solid #E2E0DA",
                    borderRadius: 10, fontSize: 13, color: "#0A0A0A", outline: "none",
                    fontFamily: "inherit", background: "#FFFFFF"
                  }} />
                </div>
              ))}

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 8 }}>Company mission / tagline</label>
                <textarea placeholder="What does this company exist to do?" rows={3} style={{
                  width: "100%", padding: "11px 14px", border: "1px solid #E2E0DA",
                  borderRadius: 10, fontSize: 13, color: "#0A0A0A", resize: "none",
                  outline: "none", fontFamily: "inherit", background: "#FFFFFF"
                }} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 8 }}>Company history (brief)</label>
                <textarea placeholder="Founded in... Key milestones..." rows={4} style={{
                  width: "100%", padding: "11px 14px", border: "1px solid #E2E0DA",
                  borderRadius: 10, fontSize: 13, color: "#0A0A0A", resize: "none",
                  outline: "none", fontFamily: "inherit", background: "#FFFFFF"
                }} />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 1: Culture ── */}
        {step === 1 && (
          <div style={{ maxWidth: 640 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0A0A0A", marginBottom: 6, letterSpacing: "-0.3px" }}>Culture & values</h1>
            <p style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 36, lineHeight: 1.6 }}>This becomes the newcomer&apos;s guide to how things work here — beyond the handbook.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 8 }}>Core values (one per line)</label>
                <textarea placeholder={"Integrity\nCollaboration\nCuriosity\n..."} rows={5} style={{
                  width: "100%", padding: "11px 14px", border: "1px solid #E2E0DA",
                  borderRadius: 10, fontSize: 13, color: "#0A0A0A", resize: "none",
                  outline: "none", fontFamily: "inherit", background: "#FFFFFF"
                }} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 8 }}>How decisions are made here</label>
                <textarea placeholder="Describe how decisions get made — top-down, consensus, data-driven..." rows={3} style={{
                  width: "100%", padding: "11px 14px", border: "1px solid #E2E0DA",
                  borderRadius: 10, fontSize: 13, color: "#0A0A0A", resize: "none",
                  outline: "none", fontFamily: "inherit", background: "#FFFFFF"
                }} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 8 }}>Unwritten rules (what every insider knows)</label>
                <textarea placeholder="e.g. Meetings start on time. Slack is preferred over email. Fridays are async..." rows={4} style={{
                  width: "100%", padding: "11px 14px", border: "1px solid #E2E0DA",
                  borderRadius: 10, fontSize: 13, color: "#0A0A0A", resize: "none",
                  outline: "none", fontFamily: "inherit", background: "#FFFFFF"
                }} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 8 }}>Rituals & traditions</label>
                <textarea placeholder="e.g. All-hands every Monday. Friday team lunches. Quarterly off-sites..." rows={3} style={{
                  width: "100%", padding: "11px 14px", border: "1px solid #E2E0DA",
                  borderRadius: 10, fontSize: 13, color: "#0A0A0A", resize: "none",
                  outline: "none", fontFamily: "inherit", background: "#FFFFFF"
                }} />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Role ── */}
        {step === 2 && (
          <div style={{ maxWidth: 640 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0A0A0A", marginBottom: 6, letterSpacing: "-0.3px" }}>Role setup</h1>
            <p style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 36, lineHeight: 1.6 }}>Define what success looks like for this specific newcomer — Sofia Martínez, Sr. Marketing Manager.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: "#EEEEF5", borderRadius: 12, padding: "14px 18px" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#1A1A2E", marginBottom: 2 }}>Newcomer</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#0A0A0A" }}>Sofia Martínez — Senior Marketing Manager</p>
                <p style={{ fontSize: 12, color: "#6B6B6B", marginTop: 2 }}>Start date: March 3, 2026 · Manager: Claire Bennett</p>
              </div>

              {[
                { label: "30-day goal", placeholder: "What should she accomplish in the first 30 days?" },
                { label: "60-day goal", placeholder: "What should she accomplish by day 60?" },
                { label: "90-day goal", placeholder: "What does success look like at 3 months?" },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 8 }}>{f.label}</label>
                  <textarea placeholder={f.placeholder} rows={2} style={{
                    width: "100%", padding: "11px 14px", border: "1px solid #E2E0DA",
                    borderRadius: 10, fontSize: 13, color: "#0A0A0A", resize: "none",
                    outline: "none", fontFamily: "inherit", background: "#FFFFFF"
                  }} />
                </div>
              ))}

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 8 }}>Key tools she needs access to</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Slack", "Notion", "Google Workspace", "Salesforce", "Asana", "Figma", "Jira", "HubSpot"].map(tool => (
                    <button key={tool} style={{
                      padding: "6px 14px", borderRadius: 99, fontSize: 12, cursor: "pointer",
                      border: "1px solid #E2E0DA", background: "#F5F4F0", color: "#6B6B6B", fontFamily: "inherit"
                    }}>
                      {tool}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 8 }}>Key stakeholders for her role</label>
                <textarea placeholder="e.g. Head of Product (for campaign alignment), CFO (for budget approvals)..." rows={3} style={{
                  width: "100%", padding: "11px 14px", border: "1px solid #E2E0DA",
                  borderRadius: 10, fontSize: 13, color: "#0A0A0A", resize: "none",
                  outline: "none", fontFamily: "inherit", background: "#FFFFFF"
                }} />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: People ── */}
        {step === 3 && (
          <div style={{ maxWidth: 640 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0A0A0A", marginBottom: 6, letterSpacing: "-0.3px" }}>People & network</h1>
            <p style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 36, lineHeight: 1.6 }}>Set up the human side of Sofia&apos;s onboarding — buddy, team, and key connections.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Buddy */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E2E0DA", borderRadius: 14, padding: "20px 22px" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#0A0A0A", marginBottom: 14 }}>Buddy assignment</p>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: "#6B6B6B", display: "block", marginBottom: 6 }}>Buddy name</label>
                    <input defaultValue="James Okafor" style={{
                      width: "100%", padding: "10px 12px", border: "1px solid #E2E0DA",
                      borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "inherit"
                    }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: "#6B6B6B", display: "block", marginBottom: 6 }}>Their role</label>
                    <input defaultValue="Marketing Strategist" style={{
                      width: "100%", padding: "10px 12px", border: "1px solid #E2E0DA",
                      borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "inherit"
                    }} />
                  </div>
                </div>
              </div>

              {/* Team */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E2E0DA", borderRadius: 14, padding: "20px 22px" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#0A0A0A", marginBottom: 14 }}>Direct team members</p>
                {[
                  { name: "Priya Nair", role: "Content Lead" },
                  { name: "Tom Reyes", role: "Brand Designer" },
                ].map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                    <input defaultValue={m.name} style={{
                      flex: 1, padding: "10px 12px", border: "1px solid #E2E0DA",
                      borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "inherit"
                    }} />
                    <input defaultValue={m.role} style={{
                      flex: 1, padding: "10px 12px", border: "1px solid #E2E0DA",
                      borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "inherit"
                    }} />
                  </div>
                ))}
                <button style={{
                  fontSize: 12, color: "#1A1A2E", fontWeight: 600, background: "none",
                  border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit"
                }}>
                  + Add team member
                </button>
              </div>

              {/* Key contacts */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E2E0DA", borderRadius: 14, padding: "20px 22px" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#0A0A0A", marginBottom: 4 }}>Key cross-functional contacts</p>
                <p style={{ fontSize: 12, color: "#6B6B6B", marginBottom: 14 }}>People outside her team she should know early</p>
                {[{ name: "Ana Lima", role: "Finance Business Partner", reason: "Budget approvals" }].map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <input defaultValue={c.name} style={{
                      flex: 1, padding: "10px 12px", border: "1px solid #E2E0DA",
                      borderRadius: 8, fontSize: 12, outline: "none", fontFamily: "inherit"
                    }} />
                    <input defaultValue={c.role} style={{
                      flex: 1, padding: "10px 12px", border: "1px solid #E2E0DA",
                      borderRadius: 8, fontSize: 12, outline: "none", fontFamily: "inherit"
                    }} />
                    <input defaultValue={c.reason} style={{
                      flex: 1, padding: "10px 12px", border: "1px solid #E2E0DA",
                      borderRadius: 8, fontSize: 12, outline: "none", fontFamily: "inherit"
                    }} />
                  </div>
                ))}
                <button style={{
                  fontSize: 12, color: "#1A1A2E", fontWeight: 600, background: "none",
                  border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit"
                }}>
                  + Add contact
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: Launch ── */}
        {step === 4 && (
          <div style={{ maxWidth: 640 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0A0A0A", marginBottom: 6, letterSpacing: "-0.3px" }}>Ready to launch</h1>
            <p style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 36, lineHeight: 1.6 }}>Everything is set up. Review and send Sofia her invite.</p>

            {/* Summary */}
            {[
              { label: "Company", items: ["Meridian Group", "Financial Services", "450 employees"] },
              { label: "Culture", items: ["4 core values entered", "Decision-making style defined", "3 rituals added"] },
              { label: "Role", items: ["30/60/90 day goals set", "6 tools assigned", "4 stakeholders mapped"] },
              { label: "People", items: ["Buddy: James Okafor", "2 team members", "3 key contacts"] },
            ].map(s => (
              <div key={s.label} style={{
                display: "flex", alignItems: "flex-start", gap: 16,
                padding: "16px 0", borderBottom: "1px solid #F5F4F0"
              }}>
                <div style={{ width: 22, height: 22, borderRadius: 99, background: "#EAF4EF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <span style={{ fontSize: 11, color: "#2D6A4F" }}>✓</span>
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", marginBottom: 4 }}>{s.label}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {s.items.map(item => (
                      <span key={item} style={{ fontSize: 11, color: "#6B6B6B", background: "#F5F4F0", padding: "3px 10px", borderRadius: 99 }}>{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <div style={{ marginTop: 32, background: "#F5F4F0", borderRadius: 14, padding: "20px 22px", marginBottom: 24 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", marginBottom: 10 }}>Send invite to newcomer</p>
              <div style={{ display: "flex", gap: 10 }}>
                <input defaultValue="sofia.martinez@meridiangroup.com" style={{
                  flex: 1, padding: "11px 14px", border: "1px solid #E2E0DA",
                  borderRadius: 10, fontSize: 13, outline: "none", fontFamily: "inherit", background: "#FFFFFF"
                }} />
                <button style={{
                  padding: "11px 20px", background: "#0A0A0A", color: "#FFFFFF",
                  borderRadius: 10, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer", whiteSpace: "nowrap"
                }}>
                  Send invite
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", gap: 10, marginTop: 40, maxWidth: 640 }}>
          {step > 0 && (
            <button onClick={back} style={{
              padding: "12px 24px", background: "#FFFFFF", color: "#6B6B6B",
              borderRadius: 10, fontWeight: 600, fontSize: 13, border: "1px solid #E2E0DA", cursor: "pointer"
            }}>
              Back
            </button>
          )}
          {step < steps.length - 1 && (
            <button onClick={next} style={{
              padding: "12px 28px", background: "#0A0A0A", color: "#FFFFFF",
              borderRadius: 10, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer"
            }}>
              Save & continue →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## app/notifications/page.tsx
```tsx
"use client";
import { useState } from "react";
import { PageShell, Card, SectionLabel } from "@/components/ui";
import Link from "next/link";
import { NavBar } from "@/components/ui";

type Role = "newcomer" | "manager" | "hr";

const notifications: Record<Role, {
  id: string; type: "alert" | "reminder" | "info"; title: string; body: string;
  time: string; href?: string; read: boolean;
}[]> = {
  newcomer: [
    { id: "n1", type: "reminder", title: "Monthly check-in due", body: "Your March self-evaluation is due in 3 days. It takes about 5 minutes.", time: "Today", href: "/newcomer/evaluation", read: false },
    { id: "n2", type: "alert", title: "My People score needs attention", body: "Your social integration score (35%) is below the target. Consider reaching out to 2 new colleagues this week.", time: "2 days ago", href: "/newcomer/buckets", read: false },
    { id: "n3", type: "info", title: "Manager check-in scheduled", body: "Claire Bennett has scheduled a 1:1 for Thursday March 26 at 10:00 AM.", time: "3 days ago", read: false },
    { id: "n4", type: "reminder", title: "Task pending: Watch strategy video", body: "You have an uncompleted task in My Organization. It's quick — 5 minutes.", time: "5 days ago", href: "/newcomer/timeline", read: true },
    { id: "n5", type: "info", title: "Welcome to Arrival phase", body: "You're on Day 18 of 30 in your Arrival phase. Keep going!", time: "18 days ago", read: true },
  ],
  manager: [
    { id: "m1", type: "alert", title: "Yuki Tanaka — flight risk", body: "Yuki's My People score dropped to 28%. Social isolation detected. Immediate check-in recommended.", time: "Today", href: "/manager/newcomer/sofia", read: false },
    { id: "m2", type: "alert", title: "Divergence alert — Sofia Martínez", body: "17-point gap between manager and self scores. Schedule a check-in to align perceptions.", time: "Yesterday", href: "/manager/checkin/sofia", read: false },
    { id: "m3", type: "reminder", title: "March evaluations pending", body: "2 of your 3 newcomers are awaiting your monthly evaluation. Due by March 31.", time: "2 days ago", href: "/manager/checkin/sofia", read: false },
    { id: "m4", type: "info", title: "Daniel Cruz — Integration phase", body: "Daniel moved into Integration phase today (Day 31). New milestones are now active.", time: "5 days ago", read: true },
    { id: "m5", type: "info", title: "Sofia completed Welcome flow", body: "Sofia Martínez completed her pre-arrival documents and welcome steps on Day 1.", time: "18 days ago", read: true },
  ],
  hr: [
    { id: "h1", type: "alert", title: "2 newcomers at high risk", body: "Yuki Tanaka and one other show critical adjustment risk. Review immediately.", time: "Today", href: "/hr/newcomers/yuki", read: false },
    { id: "h2", type: "reminder", title: "March check-ins: 4 overdue", body: "4 newcomers have not completed their March self-evaluation. Send reminders.", time: "Yesterday", href: "/hr/newcomers", read: false },
    { id: "h3", type: "alert", title: "Average My People score declining", body: "Company-wide average dropped 3 pts this month. Review cohort strategy.", time: "3 days ago", href: "/hr", read: false },
    { id: "h4", type: "info", title: "Ben Kowalski joined the program", body: "New newcomer added: Ben Kowalski (Engineering, Day 12). Assigned to Ravi Sharma.", time: "12 days ago", read: true },
    { id: "h5", type: "info", title: "Marcus Webb — Stabilization phase", body: "Marcus advanced to Stabilization phase (Day 134). On track across all buckets.", time: "4 days ago", read: true },
  ],
};

const typeConfig = {
  alert:    { color: "#9B2335", bg: "#FBEAEC", dot: "#9B2335",  label: "Alert" },
  reminder: { color: "#B7791F", bg: "#FEF3E2", dot: "#B7791F",  label: "Reminder" },
  info:     { color: "#2D6A4F", bg: "#EAF4EF", dot: "#2D6A4F",  label: "Info" },
};

export default function NotificationsPage() {
  const [role, setRole] = useState<Role>("newcomer");
  const [items, setItems] = useState(notifications);

  const list = items[role];
  const unread = list.filter(n => !n.read).length;

  function markRead(id: string) {
    setItems(prev => ({
      ...prev,
      [role]: prev[role].map(n => n.id === id ? { ...n, read: true } : n),
    }));
  }

  function markAllRead() {
    setItems(prev => ({
      ...prev,
      [role]: prev[role].map(n => ({ ...n, read: true })),
    }));
  }

  const roleColors: Record<Role, string> = {
    newcomer: "#1A1A2E", manager: "#2D6A4F", hr: "#9B2335",
  };

  return (
    <PageShell nav={<NavBar role={role} active="Home" />}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A", marginBottom: 4 }}>Notifications</h2>
          <p style={{ fontSize: 13, color: "#6B6B6B" }}>{unread} unread</p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            style={{ fontSize: 12, fontWeight: 600, color: "#6B6B6B", background: "#F5F4F0", border: "1px solid #E2E0DA", borderRadius: 8, padding: "6px 14px", cursor: "pointer" }}
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Role switcher */}
      <Card style={{ padding: "12px 16px" }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#AEABA3", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>View as role</p>
        <div style={{ display: "flex", gap: 6 }}>
          {(["newcomer", "manager", "hr"] as Role[]).map(r => {
            const labels = { newcomer: "Newcomer", manager: "Manager", hr: "HR Admin" };
            const counts = notifications[r].filter(n => !items[r].find(x => x.id === n.id)?.read && !notifications[r].find(x => x.id === n.id)?.read).length;
            const unreadCount = items[r].filter(n => !n.read).length;
            return (
              <button
                key={r}
                onClick={() => setRole(r)}
                style={{
                  flex: 1, padding: "8px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                  background: role === r ? "#0A0A0A" : "#F5F4F0",
                  color: role === r ? "#FFFFFF" : "#6B6B6B",
                  fontSize: 12, fontWeight: 600, transition: "all 0.15s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
              >
                {labels[r]}
                {unreadCount > 0 && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, minWidth: 18, height: 18,
                    background: role === r ? "#FFFFFF22" : roleColors[r],
                    color: "#FFFFFF", borderRadius: 99, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px",
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Alerts first */}
      {list.some(n => n.type === "alert" && !n.read) && (
        <div>
          <SectionLabel>Alerts</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {list.filter(n => n.type === "alert" && !n.read).map(n => (
              <NotifCard key={n.id} n={n} onRead={markRead} />
            ))}
          </div>
        </div>
      )}

      {/* Reminders */}
      {list.some(n => n.type === "reminder" && !n.read) && (
        <div>
          <SectionLabel>Reminders</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {list.filter(n => n.type === "reminder" && !n.read).map(n => (
              <NotifCard key={n.id} n={n} onRead={markRead} />
            ))}
          </div>
        </div>
      )}

      {/* Info + read */}
      {list.some(n => (n.type === "info" && !n.read) || n.read) && (
        <div>
          <SectionLabel>Earlier</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {list.filter(n => n.type === "info" || n.read).map(n => (
              <NotifCard key={n.id} n={n} onRead={markRead} />
            ))}
          </div>
        </div>
      )}

    </PageShell>
  );
}

function NotifCard({ n, onRead }: {
  n: { id: string; type: "alert" | "reminder" | "info"; title: string; body: string; time: string; href?: string; read: boolean };
  onRead: (id: string) => void;
}) {
  const tc = typeConfig[n.type];

  const inner = (
    <Card
      style={{
        opacity: n.read ? 0.6 : 1,
        borderLeft: n.read ? "1px solid #E2E0DA" : `3px solid ${tc.dot}`,
        padding: "14px 16px",
        cursor: n.href ? "pointer" : "default",
        transition: "opacity 0.2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
            {!n.read && <div style={{ width: 7, height: 7, borderRadius: 99, background: tc.dot, flexShrink: 0 }} />}
            <span style={{ fontSize: 10, fontWeight: 700, color: tc.color, background: tc.bg, padding: "2px 7px", borderRadius: 99 }}>
              {tc.label}
            </span>
            <span style={{ fontSize: 10, color: "#AEABA3" }}>{n.time}</span>
          </div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A", marginBottom: 3 }}>{n.title}</p>
          <p style={{ fontSize: 12, color: "#6B6B6B", lineHeight: 1.5 }}>{n.body}</p>
        </div>
        {!n.read && (
          <button
            onClick={(e) => { e.preventDefault(); onRead(n.id); }}
            style={{ fontSize: 10, color: "#AEABA3", background: "none", border: "none", cursor: "pointer", flexShrink: 0, padding: "2px 6px" }}
          >
            ✕
          </button>
        )}
      </div>
    </Card>
  );

  return n.href ? <Link href={n.href} style={{ textDecoration: "none" }}>{inner}</Link> : inner;
}
```

---

## app/newcomer/page.tsx
```tsx
"use client";
import { NavBar, PageShell, Card, ScoreRing, SectionLabel, Avatar, BucketTag, TwoCol } from "@/components/ui";
import { newcomer, buckets, todayActions } from "@/lib/mock";
import Link from "next/link";

export default function NewcomerHome() {
  const overall = Math.round(buckets.reduce((s, b) => s + b.score, 0) / buckets.length);

  const left = <>
    {/* Header */}
    <Card style={{ background: "#ECECEA", border: "1px solid #DDDBD5" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 10, color: "#AEABA3", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
            Day {newcomer.day} of 365
          </p>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A", marginBottom: 4 }}>Good morning, Sofia.</h2>
          <p style={{ fontSize: 13, color: "#6B6B6B" }}>{newcomer.role} · {newcomer.company}</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <ScoreRing score={overall} size={64} />
          <p style={{ fontSize: 10, color: "#AEABA3", marginTop: 4 }}>Overall</p>
        </div>
      </div>
      <div style={{ marginTop: 16, background: "#DDDBD5", borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A" }}>Phase: Arrival</span>
          <span style={{ fontSize: 11, color: "#6B6B6B" }}>Day 1–30</span>
        </div>
        <div style={{ height: 6, background: "#C8C6C0", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", background: "#0A0A0A", borderRadius: 99, width: `${(newcomer.day / 30) * 100}%` }} />
        </div>
      </div>
    </Card>

    {/* Today */}
    <div>
      <SectionLabel>Today&apos;s actions</SectionLabel>
      <div className="space-y-2">
        {todayActions.map((a, i) => (
          <Card key={i} className={`flex items-start gap-3 ${a.urgent ? "border-[#1A1A2E]" : ""}`}>
            <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${a.urgent ? "bg-[#1A1A2E]" : "bg-[#E2E0DA]"}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#0A0A0A]">{a.text}</p>
              <BucketTag bucket={a.bucket} />
            </div>
            {a.urgent && <span className="text-xs font-semibold text-[#1A1A2E] flex-shrink-0">Priority</span>}
          </Card>
        ))}
      </div>
    </div>
  </>;

  const right = <>
    {/* Three buckets */}
    <div>
      <SectionLabel>My three tracks</SectionLabel>
      <div className="space-y-2">
        {buckets.map(b => (
          <Link key={b.id} href="/newcomer/buckets">
            <Card className="flex items-center gap-4 hover:border-[#0A0A0A] transition-colors cursor-pointer">
              <div className="w-9 h-9 rounded-lg bg-[#F5F4F0] flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-[#6B6B6B]">{b.number}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[#0A0A0A]">{b.label}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-1.5 bg-[#F5F4F0] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{
                        width: `${b.score}%`,
                        background: b.score >= 70 ? "#2D6A4F" : b.score >= 50 ? "#B7791F" : "#9B2335"
                      }} />
                  </div>
                  <span className="text-xs text-[#6B6B6B] flex-shrink-0">{b.score}%</span>
                </div>
              </div>
              <span className="text-[#AEABA3] text-sm">›</span>
            </Card>
          </Link>
        ))}
      </div>
    </div>

    {/* Buddy */}
    <div>
      <SectionLabel>Your buddy</SectionLabel>
      <Card className="flex items-center gap-3">
        <Avatar initials="JO" size={44} />
        <div className="flex-1">
          <p className="font-semibold text-sm">{newcomer.buddy.name}</p>
          <p className="text-xs text-[#6B6B6B]">{newcomer.buddy.role}</p>
        </div>
        <button className="text-sm font-medium text-[#1A1A2E] bg-[#EEEEF5] px-3 py-1.5 rounded-lg hover:bg-[#DDD] transition-colors">
          Message
        </button>
      </Card>
    </div>
  </>;

  return (
    <PageShell nav={<NavBar role="newcomer" active="Home" />}>
      <TwoCol left={left} right={right} />
    </PageShell>
  );
}
```

---

## app/newcomer/docs/page.tsx
```tsx
"use client";
import { useState } from "react";

const docs = [
  {
    id: "welcome-letter",
    category: "Personal",
    icon: "✉",
    title: "Welcome letter from Claire",
    subtitle: "From your manager · 2 min read",
    tag: "New",
    content: {
      type: "letter",
      from: "Claire Bennett, VP Marketing",
      date: "February 28, 2026",
      body: [
        "Dear Sofia,",
        "I am genuinely thrilled to welcome you to the Meridian Group Marketing team. We searched for a long time for the right person for this role, and when we met you, we knew immediately.",
        "Your background in brand strategy and your track record of building campaigns that actually move the needle is exactly what we need right now. We are at an exciting inflection point — we have just launched a new product line and we need someone like you to help us tell that story.",
        "A few things I want you to know before you start:",
        "First — take your time. The first 30 days are for learning, not for proving yourself. Ask every question you have. There are no silly ones.",
        "Second — I am here for you. We will meet every week, and my door (or Slack) is always open. If something is unclear, feels off, or you simply need to think out loud, come to me.",
        "Third — the team is wonderful. You will love James, Priya, and Tom. They are excited to meet you.",
        "See you on March 3. We are ready for you.",
        "Warmly,\nClaire"
      ]
    }
  },
  {
    id: "your-role",
    category: "My Job",
    icon: "01",
    title: "Your role & 90-day plan",
    subtitle: "What success looks like · 5 min read",
    tag: null,
    content: {
      type: "role",
      sections: [
        {
          heading: "Your role in one sentence",
          body: "Lead the development and execution of integrated marketing campaigns that drive brand awareness and pipeline growth for Meridian Group's new product line."
        },
        {
          heading: "Who you report to",
          body: "Claire Bennett, VP Marketing. You will have a weekly 1:1 every Monday at 10am. Claire's leadership style is direct, collaborative, and data-informed."
        },
        {
          heading: "Day 30 — Learn",
          items: [
            "Understand the company's current brand positioning and messaging",
            "Complete all tool onboarding (Slack, Notion, HubSpot, Asana)",
            "Meet every member of your direct team and key cross-functional contacts",
            "Review the last 3 campaign reports and understand what worked and what didn't",
          ]
        },
        {
          heading: "Day 60 — Contribute",
          items: [
            "Lead your first campaign brief from scratch",
            "Present a 90-day marketing calendar to Claire",
            "Own at least one active project end-to-end",
            "Build a working relationship with the Product and Sales teams",
          ]
        },
        {
          heading: "Day 90 — Own",
          items: [
            "Deliver first campaign results with measurable impact",
            "Have a clear view of the Q2 marketing roadmap",
            "Be the go-to person for brand decisions on your product line",
            "Identify one process improvement opportunity",
          ]
        },
        {
          heading: "How your performance will be measured",
          items: [
            "Campaign delivery — on time and on brief",
            "Pipeline contribution from marketing activities",
            "Cross-functional collaboration quality (peer feedback)",
            "Brand consistency across all touchpoints",
          ]
        }
      ]
    }
  },
  {
    id: "culture-guide",
    category: "My Organization",
    icon: "02",
    title: "Culture guide",
    subtitle: "How we work at Meridian · 6 min read",
    tag: null,
    content: {
      type: "culture",
      sections: [
        {
          heading: "Who we are",
          body: "Meridian Group was founded in 2008 with a simple idea: financial services don't have to be complicated. We have grown to 450 people across 3 offices and we still believe that. Our clients stay with us because we are straightforward, reliable, and genuinely good at what we do."
        },
        {
          heading: "Our values",
          items: [
            { title: "Integrity first", desc: "We do what we say. Always. Even when it's inconvenient." },
            { title: "Curiosity over certainty", desc: "We ask questions. We test assumptions. We change our minds when the evidence calls for it." },
            { title: "Collaboration without ego", desc: "The best idea wins, regardless of who had it or what their title is." },
            { title: "Clarity is kindness", desc: "We communicate directly and honestly. Vague feedback and unclear expectations cost everyone time." },
          ]
        },
        {
          heading: "How decisions get made",
          body: "We are not a top-down company, but we are not a consensus-by-committee company either. Most decisions are made by the person closest to the problem, with input from stakeholders. Big decisions (budget, strategy, people) go to leadership. When in doubt, ask your manager: 'Is this mine to decide?'"
        },
        {
          heading: "The unwritten rules",
          items: [
            { title: "Meetings start on time", desc: "We respect each other's calendars. Join 1 minute early." },
            { title: "Slack over email", desc: "Email is for external communication. Internally, we use Slack. Keep channels organized." },
            { title: "Docs before meetings", desc: "If you are calling a meeting, share a doc first. We read before we talk." },
            { title: "Cameras on", desc: "For small meetings (under 8 people), cameras on is the norm." },
            { title: "Friday afternoons are sacred", desc: "No new big projects or requests land on Friday afternoons. It is for wrapping up and recharging." },
          ]
        },
        {
          heading: "Our rituals",
          items: [
            { title: "Monday All-Hands (9am)", desc: "Company-wide, 20 minutes. Priorities for the week, quick wins from last week." },
            { title: "Quarterly off-sites", desc: "Each team does a full-day off-site every quarter. Part strategy, part team building." },
            { title: "Birthday celebrations", desc: "We celebrate birthdays with a team lunch. Simple but it matters." },
            { title: "Friday wins channel", desc: "Every Friday people post wins — big and small — in #wins on Slack." },
          ]
        }
      ]
    }
  },
  {
    id: "org-structure",
    category: "My Organization",
    icon: "02",
    title: "Org structure & key people",
    subtitle: "Who's who at Meridian · 4 min read",
    tag: null,
    content: {
      type: "org",
      sections: [
        {
          heading: "Leadership team",
          people: [
            { name: "Robert Yates", role: "CEO & Co-founder", note: "Hosts Monday All-Hands. Approachable, data-driven, direct." },
            { name: "Sandra Lim", role: "COO", note: "Runs operations and strategy. The person who makes things actually happen." },
            { name: "Marcus Webb", role: "CFO", note: "Controls budget approvals over $10K. Works closely with all department heads." },
          ]
        },
        {
          heading: "Your department — Marketing",
          people: [
            { name: "Claire Bennett", role: "VP Marketing", note: "Your manager. Strategic, supportive, very Slack-responsive." },
            { name: "James Okafor", role: "Marketing Strategist · Your buddy", note: "Your go-to for everything in the first months. Has been here 4 years." },
            { name: "Priya Nair", role: "Content Lead", note: "Owns all content and copywriting. Key collaborator for your campaigns." },
            { name: "Tom Reyes", role: "Brand Designer", note: "All visual assets go through Tom. Book him 2 weeks in advance for big projects." },
          ]
        },
        {
          heading: "Key cross-functional contacts",
          people: [
            { name: "Ana Lima", role: "Finance Business Partner", note: "Your contact for budget questions and approvals." },
            { name: "Carlos Mendez", role: "Head of Product", note: "Close partner — your campaigns need to align with Product roadmap." },
            { name: "Nina Johansson", role: "HR Business Partner", note: "Any people-related questions, career development, or concerns." },
            { name: "Leo Tran", role: "Head of Sales", note: "Marketing and Sales need to be in sync. Build this relationship early." },
          ]
        }
      ]
    }
  },
  {
    id: "first-week",
    category: "My Job",
    icon: "01",
    title: "Your first week schedule",
    subtitle: "Day by day · March 3–7, 2026",
    tag: "Starts Mar 3",
    content: {
      type: "schedule",
      days: [
        {
          day: "Monday, March 3",
          label: "Day 1",
          events: [
            { time: "9:00am", title: "Welcome breakfast with Claire & team", type: "social" },
            { time: "10:30am", title: "IT setup — laptop, tools, accounts", type: "task" },
            { time: "1:00pm", title: "Company All-Hands (your first one)", type: "company" },
            { time: "3:00pm", title: "1:1 with Claire — intro & expectations", type: "manager" },
            { time: "4:30pm", title: "Meet your buddy James for coffee", type: "social" },
          ]
        },
        {
          day: "Tuesday, March 4",
          label: "Day 2",
          events: [
            { time: "9:30am", title: "HR onboarding — policies & benefits", type: "task" },
            { time: "11:00am", title: "Meet Priya Nair (Content Lead)", type: "social" },
            { time: "2:00pm", title: "Meet Tom Reyes (Brand Designer)", type: "social" },
            { time: "3:30pm", title: "Review last 3 campaign reports", type: "task" },
          ]
        },
        {
          day: "Wednesday, March 5",
          label: "Day 3",
          events: [
            { time: "10:00am", title: "Meet Carlos Mendez — Head of Product", type: "social" },
            { time: "11:30am", title: "Watch company strategy video", type: "task" },
            { time: "2:00pm", title: "Tool deep-dive: HubSpot & Asana", type: "task" },
            { time: "4:00pm", title: "Check-in with buddy James", type: "social" },
          ]
        },
        {
          day: "Thursday, March 6",
          label: "Day 4",
          events: [
            { time: "9:00am", title: "Meet Ana Lima — Finance Business Partner", type: "social" },
            { time: "11:00am", title: "Read culture guide & org chart", type: "task" },
            { time: "2:00pm", title: "Shadow Priya on content review session", type: "learning" },
            { time: "4:00pm", title: "Write your Week 1 reflection in the app", type: "task" },
          ]
        },
        {
          day: "Friday, March 7",
          label: "Day 5",
          events: [
            { time: "10:00am", title: "Coffee with Leo Tran — Head of Sales", type: "social" },
            { time: "12:00pm", title: "Team Friday lunch", type: "social" },
            { time: "2:00pm", title: "1:1 with Claire — Week 1 debrief", type: "manager" },
            { time: "3:30pm", title: "Post your first win in #wins on Slack", type: "social" },
          ]
        },
      ]
    }
  },
];

const typeColors: Record<string, { bg: string; color: string; label: string }> = {
  social:   { bg: "#EAF4EF", color: "#2D6A4F", label: "Social" },
  task:     { bg: "#EEEEF5", color: "#1A1A2E", label: "Task" },
  manager:  { bg: "#F5F4F0", color: "#0A0A0A", label: "Manager" },
  company:  { bg: "#FEF3E2", color: "#B7791F", label: "Company" },
  learning: { bg: "#FBEAEC", color: "#9B2335", label: "Learning" },
};

function DocContent({ doc }: { doc: typeof docs[0] }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = doc.content as any;

  if (c.type === "letter") {
    return (
      <div>
        <div style={{ borderBottom: "1px solid #F5F4F0", paddingBottom: 20, marginBottom: 24 }}>
          <p style={{ fontSize: 12, color: "#6B6B6B" }}>From: <strong style={{ color: "#0A0A0A" }}>{c.from}</strong></p>
          <p style={{ fontSize: 12, color: "#6B6B6B" }}>{c.date}</p>
        </div>
        {c.body!.map((para: string, i: number) => (
          <p key={i} style={{ fontSize: 14, color: i === 0 || i === c.body!.length - 1 ? "#0A0A0A" : "#444", lineHeight: 1.8, marginBottom: 16, fontWeight: i === 0 ? 600 : 400, whiteSpace: "pre-line" }}>
            {para}
          </p>
        ))}
      </div>
    );
  }

  if (c.type === "role") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {c.sections!.map((s: any, i: number) => (
          <div key={i}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A", marginBottom: 10, letterSpacing: "-0.2px" }}>{s.heading}</h3>
            {s.body && <p style={{ fontSize: 14, color: "#444", lineHeight: 1.8 }}>{s.body}</p>}
            {s.items && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {s.items.map((item: any, j: number) => (
                  <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 5, height: 5, borderRadius: 99, background: "#1A1A2E", marginTop: 7, flexShrink: 0 }} />
                    <p style={{ fontSize: 14, color: "#444", lineHeight: 1.7 }}>{item}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (c.type === "culture") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {c.sections!.map((s: any, i: number) => (
          <div key={i}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A", marginBottom: 10 }}>{s.heading}</h3>
            {s.body && <p style={{ fontSize: 14, color: "#444", lineHeight: 1.8 }}>{s.body}</p>}
            {s.items && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {s.items.map((item: any, j: number) => (
                  <div key={j} style={{ background: "#F5F4F0", borderRadius: 10, padding: "12px 16px" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", marginBottom: 4 }}>{item.title}</p>
                    <p style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (c.type === "org") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {c.sections!.map((s: any, i: number) => (
          <div key={i}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A", marginBottom: 12 }}>{s.heading}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {s.people.map((p: any, j: number) => (
                <div key={j} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 16px", background: "#F5F4F0", borderRadius: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 99, background: "#E2E0DA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 700, fontSize: 12, color: "#6B6B6B" }}>
                    {p.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", marginBottom: 2 }}>{p.name}</p>
                    <p style={{ fontSize: 12, color: "#1A1A2E", fontWeight: 500, marginBottom: 4 }}>{p.role}</p>
                    <p style={{ fontSize: 12, color: "#6B6B6B", lineHeight: 1.5 }}>{p.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (c.type === "schedule") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {c.days!.map((day: any, i: number) => (
          <div key={i}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A" }}>{day.day}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#AEABA3", background: "#F5F4F0", padding: "2px 8px", borderRadius: 99 }}>{day.label}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {day.events.map((ev: any, j: number) => {
                const tc = typeColors[ev.type];
                return (
                  <div key={j} style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "#AEABA3", width: 52, flexShrink: 0, textAlign: "right" }}>{ev.time}</span>
                    <div style={{ width: 3, height: 36, background: tc.bg, borderRadius: 99, flexShrink: 0 }} />
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                      <p style={{ fontSize: 13, color: "#0A0A0A", lineHeight: 1.4 }}>{ev.title}</p>
                      <span style={{ fontSize: 10, fontWeight: 600, color: tc.color, background: tc.bg, padding: "3px 8px", borderRadius: 99, flexShrink: 0 }}>{tc.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default function DocsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const activeDoc = docs.find(d => d.id === selected);

  const categoryColor: Record<string, string> = {
    "Personal": "#B7791F",
    "My Job": "#1A1A2E",
    "My Organization": "#2D6A4F",
  };
  const categoryBg: Record<string, string> = {
    "Personal": "#FEF3E2",
    "My Job": "#EEEEF5",
    "My Organization": "#EAF4EF",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F5F4F0", display: "flex", flexDirection: "column" }}>

      {/* Navbar */}
      <nav style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E0DA", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none", padding: "5px 10px 5px 8px", borderRadius: 8, border: "1px solid #E2E0DA", background: "#F5F4F0", color: "#6B6B6B", fontSize: 12, fontWeight: 500 }}>
              <span style={{ fontSize: 14 }}>←</span> Home
            </a>
            <div style={{ width: 1, height: 16, background: "#E2E0DA" }} />
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "#1A1A2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#FFF", fontWeight: 800, fontSize: 11 }}>ob</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#0A0A0A" }}>onboard</span>
            <div style={{ width: 1, height: 16, background: "#E2E0DA" }} />
            <span style={{ fontSize: 13, color: "#6B6B6B" }}>Pre-arrival documents</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 99, background: "#EEEEF5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#1A1A2E" }}>SM</div>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A" }}>Sofia Martínez</span>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 32px", display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, flex: 1, width: "100%" }}>

        {/* Sidebar — doc list */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#AEABA3", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
            Your documents
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {docs.map(doc => (
              <button key={doc.id} onClick={() => setSelected(doc.id)} style={{
                textAlign: "left", padding: "14px 16px", borderRadius: 14, border: "none", cursor: "pointer", fontFamily: "inherit",
                background: selected === doc.id ? "#0A0A0A" : "#FFFFFF",
                outline: selected === doc.id ? "none" : "1px solid #E2E0DA",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    background: selected === doc.id ? "#1A1A1A" : categoryBg[doc.category] || "#F5F4F0" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: selected === doc.id ? "#FFFFFF" : categoryColor[doc.category] || "#6B6B6B" }}>{doc.icon}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: selected === doc.id ? "#FFFFFF" : "#0A0A0A", lineHeight: 1.3 }}>{doc.title}</p>
                      {doc.tag && (
                        <span style={{ fontSize: 9, fontWeight: 700, color: selected === doc.id ? "#888" : "#B7791F", background: selected === doc.id ? "#222" : "#FEF3E2", padding: "2px 6px", borderRadius: 99, flexShrink: 0 }}>
                          {doc.tag}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 11, color: selected === doc.id ? "#888" : "#AEABA3" }}>{doc.subtitle}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main — doc viewer */}
        <div>
          {!activeDoc ? (
            <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E0DA", padding: "64px 48px", textAlign: "center" }}>
              <p style={{ fontSize: 32, marginBottom: 16 }}>📄</p>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0A0A0A", marginBottom: 8 }}>Select a document</h3>
              <p style={{ fontSize: 14, color: "#6B6B6B", lineHeight: 1.7 }}>
                You have {docs.length} documents ready to read before your first day.<br />
                Start with the welcome letter from Claire.
              </p>
              <button onClick={() => setSelected("welcome-letter")} style={{
                marginTop: 24, padding: "12px 24px", background: "#0A0A0A", color: "#FFFFFF",
                borderRadius: 10, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer"
              }}>
                Read welcome letter →
              </button>
            </div>
          ) : (
            <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E0DA", padding: "36px 44px" }}>
              {/* Doc header */}
              <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid #F5F4F0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: categoryColor[activeDoc.category] || "#6B6B6B", background: categoryBg[activeDoc.category] || "#F5F4F0", padding: "3px 10px", borderRadius: 99 }}>
                    {activeDoc.category}
                  </span>
                  {activeDoc.tag && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#B7791F", background: "#FEF3E2", padding: "3px 8px", borderRadius: 99 }}>
                      {activeDoc.tag}
                    </span>
                  )}
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0A0A0A", marginBottom: 4, letterSpacing: "-0.3px" }}>{activeDoc.title}</h2>
                <p style={{ fontSize: 13, color: "#AEABA3" }}>{activeDoc.subtitle}</p>
              </div>

              {/* Doc body */}
              <DocContent doc={activeDoc} />

              {/* Navigation between docs */}
              <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid #F5F4F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  onClick={() => {
                    const idx = docs.findIndex(d => d.id === selected);
                    if (idx > 0) setSelected(docs[idx - 1].id);
                  }}
                  style={{ fontSize: 13, color: "#6B6B6B", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                  ← Previous
                </button>
                <span style={{ fontSize: 12, color: "#AEABA3" }}>
                  {docs.findIndex(d => d.id === selected) + 1} of {docs.length}
                </span>
                {docs.findIndex(d => d.id === selected) < docs.length - 1 ? (
                  <button
                    onClick={() => {
                      const idx = docs.findIndex(d => d.id === selected);
                      setSelected(docs[idx + 1].id);
                    }}
                    style={{ fontSize: 13, color: "#0A0A0A", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                    Next →
                  </button>
                ) : (
                  <a href="/newcomer" style={{ fontSize: 13, color: "#0A0A0A", fontWeight: 600, textDecoration: "none" }}>
                    Go to dashboard →
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## app/newcomer/timeline/page.tsx
```tsx
"use client";
import { useState } from "react";
import { NavBar, PageShell, Card, SectionLabel } from "@/components/ui";

const initialPhases = [
  {
    id: "arrival",
    label: "Arrival",
    period: "Days 1–30",
    months: "March 2026",
    status: "active",
    description: "Learn the basics, meet the team, get oriented.",
    buckets: {
      job: [
        { label: "Complete tool onboarding", done: true },
        { label: "Review job description & goals", done: true },
        { label: "Understand performance criteria", done: false },
        { label: "Map key stakeholders", done: false },
      ],
      org: [
        { label: "Read culture guide", done: true },
        { label: "Watch strategy video", done: false },
        { label: "Browse org chart", done: true },
        { label: "Attend first All-Hands", done: true },
      ],
      people: [
        { label: "Meet buddy James", done: true },
        { label: "Intro to direct team", done: true },
        { label: "Coffee with manager Claire", done: true },
        { label: "Meet 2 cross-functional contacts", done: false },
      ],
    },
  },
  {
    id: "integration",
    label: "Integration",
    period: "Days 31–90",
    months: "Apr – May 2026",
    status: "upcoming",
    description: "Deepen relationships, take ownership, deliver first results.",
    buckets: {
      job: [
        { label: "Lead first campaign brief", done: false },
        { label: "Present 90-day marketing calendar", done: false },
        { label: "Own one project end-to-end", done: false },
        { label: "Get first performance feedback", done: false },
      ],
      org: [
        { label: "Understand budget & approval process", done: false },
        { label: "Attend quarterly off-site", done: false },
        { label: "Grasp strategic priorities for the year", done: false },
        { label: "Know how decisions are made", done: false },
      ],
      people: [
        { label: "Build working relationship with Product", done: false },
        { label: "Build working relationship with Sales", done: false },
        { label: "Have regular 1:1 rhythm with manager", done: false },
        { label: "Connect with 5+ colleagues informally", done: false },
      ],
    },
  },
  {
    id: "adjustment",
    label: "Adjustment",
    period: "Months 4–6",
    months: "Jun – Aug 2026",
    status: "future",
    description: "Work independently, expand your network, find your voice.",
    buckets: {
      job: [
        { label: "Deliver measurable campaign results", done: false },
        { label: "Identify one process improvement", done: false },
        { label: "Own Q3 marketing roadmap", done: false },
        { label: "Mentor a junior team member", done: false },
      ],
      org: [
        { label: "Understand how culture affects decisions", done: false },
        { label: "Be known outside your department", done: false },
        { label: "Know the informal power structure", done: false },
        { label: "Feel at home in the organization", done: false },
      ],
      people: [
        { label: "Have a network beyond immediate team", done: false },
        { label: "Be someone others come to for advice", done: false },
        { label: "Participate in informal social rituals", done: false },
        { label: "Feel genuine belonging", done: false },
      ],
    },
  },
  {
    id: "stabilization",
    label: "Stabilization",
    period: "Months 7–9",
    months: "Sep – Nov 2026",
    status: "future",
    description: "Consolidate your position, refine your approach, grow.",
    buckets: {
      job: [
        { label: "Consistently high performance", done: false },
        { label: "Lead a cross-functional initiative", done: false },
        { label: "Be the go-to expert in your area", done: false },
        { label: "Define your development path", done: false },
      ],
      org: [
        { label: "Contribute to culture, not just absorb it", done: false },
        { label: "Influence decisions in your domain", done: false },
        { label: "Understand long-term company direction", done: false },
        { label: "Recognized as a reliable colleague", done: false },
      ],
      people: [
        { label: "Have trusted allies across departments", done: false },
        { label: "Give and receive honest peer feedback", done: false },
        { label: "Support new newcomers", done: false },
        { label: "Strong sense of identity within org", done: false },
      ],
    },
  },
  {
    id: "embedding",
    label: "Embedding",
    period: "Months 10–12",
    months: "Dec 2026 – Feb 2027",
    status: "future",
    description: "You are no longer new. You are part of the fabric.",
    buckets: {
      job: [
        { label: "Strategic contributor, not just executor", done: false },
        { label: "Define next year's goals with manager", done: false },
        { label: "Recognized for unique value you bring", done: false },
        { label: "Complete 12-month reflection", done: false },
      ],
      org: [
        { label: "Deep understanding of org dynamics", done: false },
        { label: "Shape culture through actions", done: false },
        { label: "Confidently navigate any situation", done: false },
        { label: "Feel like you've always been here", done: false },
      ],
      people: [
        { label: "Rich network of genuine relationships", done: false },
        { label: "Trusted across the organization", done: false },
        { label: "Part of informal and formal networks", done: false },
        { label: "Fully socially embedded", done: false },
      ],
    },
  },
];

const bucketConfig = {
  job:    { label: "My Job",          color: "#1A1A2E", bg: "#EEEEF5", num: "01" },
  org:    { label: "My Organization", color: "#2D6A4F", bg: "#EAF4EF", num: "02" },
  people: { label: "My People",       color: "#9B2335", bg: "#FBEAEC", num: "03" },
};

const statusConfig = {
  active:   { bg: "#0A0A0A", color: "#FFFFFF", label: "In progress" },
  upcoming: { bg: "#F5F4F0", color: "#0A0A0A", label: "Up next" },
  future:   { bg: "#F5F4F0", color: "#AEABA3", label: "Ahead" },
};

type BucketKey = keyof typeof bucketConfig;
type PhaseData = typeof initialPhases[number];

function pct(phase: PhaseData) {
  const all = Object.values(phase.buckets).flat();
  return Math.round((all.filter(i => i.done).length / all.length) * 100);
}

export default function TimelinePage() {
  const [phases, setPhases] = useState(initialPhases);
  const [activePhase, setActivePhase] = useState("arrival");
  const [expandedBucket, setExpandedBucket] = useState<string | null>(null);

  const today = { day: 18, total: 365 };
  const overallPct = Math.round((today.day / today.total) * 100);

  function toggle(phaseId: string, bucket: BucketKey, itemIdx: number) {
    setPhases(prev => prev.map(p => {
      if (p.id !== phaseId) return p;
      return {
        ...p,
        buckets: {
          ...p.buckets,
          [bucket]: p.buckets[bucket].map((item, i) =>
            i === itemIdx ? { ...item, done: !item.done } : item
          ),
        },
      };
    }));
  }

  const currentPhase = phases.find(p => p.id === activePhase)!;

  return (
    <PageShell nav={<NavBar role="newcomer" active="Timeline" />}>

      {/* Header */}
      <Card style={{ background: "#ECECEA", border: "1px solid #DDDBD5" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#AEABA3", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Your 12-month journey</p>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A" }}>Day {today.day} of 365</h2>
            <p style={{ fontSize: 13, color: "#6B6B6B", marginTop: 2 }}>Currently in <strong>Arrival phase</strong> · March 2026</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 28, fontWeight: 700, color: "#0A0A0A" }}>{overallPct}%</p>
            <p style={{ fontSize: 11, color: "#AEABA3" }}>of journey complete</p>
          </div>
        </div>

        {/* Clickable phase ribbon */}
        <div style={{ display: "flex", gap: 6 }}>
          {phases.map((p) => {
            const isActive = p.id === activePhase;
            const phasePct = pct(p);
            return (
              <button
                key={p.id}
                onClick={() => setActivePhase(p.id)}
                style={{
                  flex: 1, background: "none", border: "none", cursor: "pointer",
                  padding: 0, textAlign: "left",
                }}
              >
                {/* bar */}
                <div style={{
                  height: 10, borderRadius: 99, overflow: "hidden",
                  background: p.status === "future" ? "#EBEBEB" : "#DDDBD5",
                  border: isActive ? "2px solid #0A0A0A" : "2px solid transparent",
                  transition: "border 0.15s",
                  position: "relative",
                }}>
                  <div style={{
                    height: "100%", borderRadius: 99,
                    background: p.status === "active" ? "#0A0A0A" : p.status === "upcoming" ? "#6B6B6B" : "#DDDBD5",
                    width: `${phasePct}%`,
                    transition: "width 0.4s ease",
                  }} />
                </div>
                <p style={{
                  fontSize: 9, marginTop: 4, fontWeight: isActive ? 700 : 400,
                  color: isActive ? "#0A0A0A" : "#AEABA3",
                  transition: "color 0.15s",
                }}>
                  {p.label}
                </p>
                <p style={{ fontSize: 9, color: "#AEABA3" }}>{phasePct}%</p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Overall bucket progress bars */}
      <Card>
        <SectionLabel>Overall progress by bucket</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {(Object.keys(bucketConfig) as BucketKey[]).map(key => {
            const bc = bucketConfig[key];
            const allItems = phases.flatMap(p => p.buckets[key]);
            const done = allItems.filter(i => i.done).length;
            const total = allItems.length;
            const p = Math.round((done / total) * 100);
            return (
              <div key={key}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 5, background: bc.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 7, fontWeight: 800, color: bc.color }}>{bc.num}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A" }}>{bc.label}</span>
                  </div>
                  <span style={{ fontSize: 12, color: "#AEABA3" }}>{done}/{total} tasks</span>
                </div>
                <div style={{ height: 8, background: "#F5F4F0", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: bc.color, borderRadius: 99, width: `${p}%`, transition: "width 0.5s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Active phase detail */}
      <Card style={{ border: currentPhase.status === "active" ? "2px solid #0A0A0A" : "1px solid #E2E0DA" }}>
        {/* Phase selector tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 18, overflowX: "auto" }}>
          {phases.map(p => {
            const sc = statusConfig[p.status as keyof typeof statusConfig];
            const isSelected = p.id === activePhase;
            return (
              <button
                key={p.id}
                onClick={() => setActivePhase(p.id)}
                style={{
                  padding: "6px 14px", borderRadius: 99, border: "none", cursor: "pointer",
                  fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
                  background: isSelected ? "#0A0A0A" : "#F5F4F0",
                  color: isSelected ? "#FFFFFF" : "#6B6B6B",
                  transition: "all 0.15s",
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Phase header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0A0A0A" }}>{currentPhase.label}</h3>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
                background: statusConfig[currentPhase.status as keyof typeof statusConfig].bg,
                color: statusConfig[currentPhase.status as keyof typeof statusConfig].color,
              }}>
                {statusConfig[currentPhase.status as keyof typeof statusConfig].label}
              </span>
            </div>
            <p style={{ fontSize: 12, color: "#6B6B6B" }}>{currentPhase.period} · {currentPhase.months}</p>
            <p style={{ fontSize: 12, color: "#AEABA3", fontStyle: "italic", marginTop: 3 }}>{currentPhase.description}</p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <p style={{ fontSize: 24, fontWeight: 700, color: "#0A0A0A" }}>{pct(currentPhase)}%</p>
            <p style={{ fontSize: 10, color: "#AEABA3" }}>
              {Object.values(currentPhase.buckets).flat().filter(i => i.done).length}/
              {Object.values(currentPhase.buckets).flat().length} done
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 6, background: "#F5F4F0", borderRadius: 99, marginBottom: 18, overflow: "hidden" }}>
          <div style={{ height: "100%", background: "#0A0A0A", borderRadius: 99, width: `${pct(currentPhase)}%`, transition: "width 0.5s" }} />
        </div>

        {/* Three bucket columns — interactive */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {(Object.entries(currentPhase.buckets) as [BucketKey, typeof currentPhase.buckets.job][]).map(([key, items]) => {
            const bc = bucketConfig[key];
            const bucketDone = items.filter(i => i.done).length;
            const bucketPct = Math.round((bucketDone / items.length) * 100);
            return (
              <div key={key} style={{ background: "#F5F4F0", borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, background: bc.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 8, fontWeight: 800, color: bc.color }}>{bc.num}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#0A0A0A" }}>{bc.label}</span>
                  <span style={{ fontSize: 10, color: "#AEABA3", marginLeft: "auto" }}>{bucketDone}/{items.length}</span>
                </div>
                {/* mini progress bar */}
                <div style={{ height: 4, background: "#E2E0DA", borderRadius: 99, marginBottom: 10, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: bc.color, borderRadius: 99, width: `${bucketPct}%`, transition: "width 0.4s" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {items.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => toggle(currentPhase.id, key, i)}
                      style={{
                        display: "flex", alignItems: "flex-start", gap: 8,
                        background: "none", border: "none", cursor: "pointer",
                        padding: "4px 0", textAlign: "left", width: "100%",
                      }}
                    >
                      <div style={{
                        width: 16, height: 16, borderRadius: 4, flexShrink: 0, marginTop: 1,
                        background: item.done ? bc.color : "transparent",
                        border: item.done ? `2px solid ${bc.color}` : "2px solid #DDDBD5",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s",
                      }}>
                        {item.done && <span style={{ fontSize: 9, color: "#FFFFFF", fontWeight: 700 }}>✓</span>}
                      </div>
                      <span style={{
                        fontSize: 11, color: item.done ? "#AEABA3" : "#0A0A0A",
                        textDecoration: item.done ? "line-through" : "none",
                        lineHeight: 1.4, transition: "color 0.15s",
                      }}>
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

    </PageShell>
  );
}
```

---

## app/newcomer/progress/page.tsx
```tsx
"use client";
import { NavBar, PageShell, Card, SectionLabel, TwoCol } from "@/components/ui";
import dynamic from "next/dynamic";

const BucketLineChart = dynamic(() => import("@/components/Charts").then(m => ({ default: m.BucketLineChart })), { ssr: false });
const ProjectedAreaChart = dynamic(() => import("@/components/Charts").then(m => ({ default: m.ProjectedAreaChart })), { ssr: false });
const DivergenceChart = dynamic(() => import("@/components/Charts").then(m => ({ default: m.DivergenceChart })), { ssr: false });

import { currentData, monthlyData } from "@/components/Charts";

export default function ProgressPage() {
  const latest = currentData[currentData.length - 1];
  const first = currentData[0];
  const jobGrowth = latest.job - first.job;
  const orgGrowth = latest.org - first.org;
  const peopleGrowth = latest.people - first.people;

  const left = <>
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A", marginBottom: 4 }}>Progress over time</h2>
      <p style={{ fontSize: 13, color: "#6B6B6B" }}>Sofia Martínez · Day 18 · Arrival phase</p>
    </div>

    {/* Three bucket trend */}
    <Card>
      <SectionLabel>Three-bucket scores — Month 1</SectionLabel>
      <BucketLineChart />
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        {[
          { label: "My Job", growth: jobGrowth, color: "#1A1A2E", bg: "#EEEEF5" },
          { label: "My Org", growth: orgGrowth, color: "#2D6A4F", bg: "#EAF4EF" },
          { label: "My People", growth: peopleGrowth, color: "#9B2335", bg: "#FBEAEC" },
        ].map(b => (
          <div key={b.label} style={{ flex: 1, background: b.bg, borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: b.color }}>+{b.growth}%</p>
            <p style={{ fontSize: 10, color: "#6B6B6B", marginTop: 2 }}>{b.label}</p>
          </div>
        ))}
      </div>
    </Card>

    {/* Projected 12-month */}
    <Card>
      <SectionLabel>Projected trajectory — 12 months</SectionLabel>
      <p style={{ fontSize: 11, color: "#AEABA3", marginBottom: 12 }}>Based on current rate of progress</p>
      <ProjectedAreaChart />
      <p style={{ fontSize: 11, color: "#AEABA3", marginTop: 8, textAlign: "center" }}>
        Solid lines = actual · area after &quot;Today&quot; = projected
      </p>
    </Card>
  </>;

  const right = <>
    {/* Self vs manager divergence */}
    <Card>
      <SectionLabel>Self vs. manager — divergence</SectionLabel>
      <p style={{ fontSize: 11, color: "#AEABA3", marginBottom: 12 }}>Gap between how you see yourself and how your manager sees you</p>
      <DivergenceChart />
      <div style={{ marginTop: 14, background: "#FEF3E2", borderRadius: 10, padding: "12px 14px" }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#B7791F", marginBottom: 4 }}>
          Current gap: {latest.manager - latest.self} points
        </p>
        <p style={{ fontSize: 12, color: "#B7791F", lineHeight: 1.5 }}>
          Your manager rates you higher than you rate yourself. This is common in early phases — your confidence will catch up as you settle in.
        </p>
      </div>
    </Card>

    {/* Weekly snapshot */}
    <Card>
      <SectionLabel>This week vs. last week</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          { label: "My Job", current: latest.job, prev: currentData[currentData.length - 2]?.job || 0, color: "#1A1A2E", bg: "#EEEEF5" },
          { label: "My Organization", current: latest.org, prev: currentData[currentData.length - 2]?.org || 0, color: "#2D6A4F", bg: "#EAF4EF" },
          { label: "My People", current: latest.people, prev: currentData[currentData.length - 2]?.people || 0, color: "#9B2335", bg: "#FBEAEC" },
        ].map(b => {
          const delta = b.current - b.prev;
          return (
            <div key={b.label}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A" }}>{b.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: delta >= 0 ? "#2D6A4F" : "#9B2335", background: delta >= 0 ? "#EAF4EF" : "#FBEAEC", padding: "2px 8px", borderRadius: 99 }}>
                    {delta >= 0 ? "+" : ""}{delta}%
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A" }}>{b.current}%</span>
                </div>
              </div>
              <div style={{ height: 8, background: "#F5F4F0", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 99, background: b.color, width: `${b.current}%`, transition: "width 0.5s ease" }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>

    {/* Insight */}
    <Card style={{ background: "#ECECEA", border: "1px solid #DDDBD5" }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#AEABA3", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Insight</p>
      <p style={{ fontSize: 14, color: "#0A0A0A", lineHeight: 1.7 }}>
        Your <strong>My Job</strong> track is progressing fastest. Focus energy on <strong>My People</strong> — social integration at this stage has a strong long-term effect on overall adjustment.
      </p>
    </Card>
  </>;

  return (
    <PageShell nav={<NavBar role="newcomer" active="Progress" />}>
      <TwoCol left={left} right={right} />
    </PageShell>
  );
}
```

---

## app/newcomer/buckets/page.tsx
```tsx
"use client";
import { NavBar, PageShell, Card, ScoreRing, SectionLabel } from "@/components/ui";
import { buckets } from "@/lib/mock";
import { CheckCircle2, Circle } from "lucide-react";

export default function BucketsPage() {
  return (
    <PageShell nav={<NavBar role="newcomer" active="My Journey" />}>
      <div className="space-y-1">
        <h2 className="text-xl font-bold">My Journey</h2>
        <p className="text-sm text-[#6B6B6B]">Three tracks running in parallel — all day, every day.</p>
      </div>

      {buckets.map((b, bi) => (
        <Card key={b.id}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-xs font-bold text-[#AEABA3] tracking-widest uppercase">{b.number}</span>
              <h3 className="text-lg font-bold mt-0.5">{b.label}</h3>
            </div>
            <ScoreRing score={b.score} size={64} />
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-[#F5F4F0] rounded-full overflow-hidden mb-4">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${b.score}%`,
                background: b.score >= 70 ? "#2D6A4F" : b.score >= 50 ? "#B7791F" : "#9B2335"
              }}
            />
          </div>

          {/* Checklist */}
          <SectionLabel>Progress checklist</SectionLabel>
          <div className="space-y-2.5">
            {b.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                {item.done
                  ? <CheckCircle2 size={16} className="text-[#2D6A4F] flex-shrink-0" />
                  : <Circle size={16} className="text-[#AEABA3] flex-shrink-0" />
                }
                <span className={`text-sm ${item.done ? "text-[#6B6B6B] line-through" : "text-[#0A0A0A]"}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Next step */}
          {bi === 0 && (
            <div className="mt-4 bg-[#EEEEF5] rounded-lg p-3">
              <p className="text-xs font-semibold text-[#1A1A2E] mb-1">Next step</p>
              <p className="text-sm text-[#1A1A2E]">Ask Claire to walk you through your performance KPIs in your next 1:1.</p>
            </div>
          )}
          {bi === 1 && (
            <div className="mt-4 bg-[#FEF3E2] rounded-lg p-3">
              <p className="text-xs font-semibold text-[#B7791F] mb-1">Tip</p>
              <p className="text-sm text-[#B7791F]">Watch the 5-min strategy video in your resources section — it will unlock three items at once.</p>
            </div>
          )}
          {bi === 2 && (
            <div className="mt-4 bg-[#FBEAEC] rounded-lg p-3">
              <p className="text-xs font-semibold text-[#9B2335] mb-1">Focus area</p>
              <p className="text-sm text-[#9B2335]">Building relationships takes time — but starting early matters most. Try one coffee chat this week.</p>
            </div>
          )}
        </Card>
      ))}
    </PageShell>
  );
}
```

---

## app/newcomer/people/page.tsx
```tsx
"use client";
import { NavBar, PageShell, Card, Avatar, SectionLabel } from "@/components/ui";
import { myTeam } from "@/lib/mock";
import { MessageCircle, Coffee } from "lucide-react";

const suggested = [
  { name: "Ana Lima", role: "Finance Business Partner", reason: "Key contact for budget approvals in Marketing", avatar: "AL" },
  { name: "Carlos Mendez", role: "Head of Product", reason: "Your campaigns will need close alignment with Product", avatar: "CM" },
  { name: "Nina Johansson", role: "HR Business Partner", reason: "Your go-to for any people-related questions", avatar: "NJ" },
];

export default function PeoplePage() {
  return (
    <PageShell nav={<NavBar role="newcomer" active="My People" />}>
      <div className="space-y-1">
        <h2 className="text-xl font-bold">My People</h2>
        <p className="text-sm text-[#6B6B6B]">Build your network — one conversation at a time.</p>
      </div>

      {/* Relationship map visual */}
      <Card style={{ background: "#0A0A0A", border: "1px solid #0A0A0A", overflow: "hidden" }}>
        <p className="text-xs font-semibold tracking-widest text-[#444] uppercase mb-4">Relationship map</p>
        <div className="flex flex-col items-center gap-3 py-2">
          {/* You */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#1A1A2E] flex items-center justify-center text-white font-bold text-sm border-2 border-white">
              SM
            </div>
            <span className="text-xs text-white mt-1 font-medium">You</span>
          </div>
          {/* Lines */}
          <div className="flex gap-6 items-start">
            {myTeam.slice(0, 4).map((p, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-0.5 h-4 bg-[#333]" />
                <Avatar initials={p.avatar} size={36} />
                <span className="text-[10px] text-[#6B6B6B] text-center w-14 leading-tight">{p.name.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* My team */}
      <div>
        <SectionLabel>My team</SectionLabel>
        <div className="space-y-2">
          {myTeam.map((p, i) => (
            <Card key={i} className="flex items-center gap-3">
              <Avatar initials={p.avatar} size={40} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{p.name}</p>
                <p className="text-xs text-[#6B6B6B]">{p.role}</p>
                <span className="text-[10px] font-medium text-[#1A1A2E] bg-[#EEEEF5] px-1.5 py-0.5 rounded mt-0.5 inline-block">
                  {p.relation}
                </span>
              </div>
              <div className="flex gap-1.5">
                <button className="p-2 rounded-lg bg-[#F5F4F0] hover:bg-[#E2E0DA] transition-colors">
                  <MessageCircle size={14} className="text-[#6B6B6B]" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Suggested */}
      <div>
        <SectionLabel>Suggested connections</SectionLabel>
        <div className="space-y-2">
          {suggested.map((p, i) => (
            <Card key={i} className="flex items-start gap-3 border-dashed">
              <Avatar initials={p.avatar} size={40} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{p.name}</p>
                <p className="text-xs text-[#6B6B6B]">{p.role}</p>
                <p className="text-xs text-[#AEABA3] mt-1 leading-relaxed">{p.reason}</p>
              </div>
              <button className="flex items-center gap-1 text-xs font-medium text-[#1A1A2E] bg-[#EEEEF5] px-2.5 py-1.5 rounded-lg hover:bg-[#DDD] transition-colors flex-shrink-0 mt-1">
                <Coffee size={11} />
                Chat
              </button>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
```

---

## app/newcomer/org/page.tsx
```tsx
"use client";
import { useState } from "react";
import { NavBar, PageShell, Card, SectionLabel } from "@/components/ui";

type Person = {
  id: string;
  name: string;
  role: string;
  dept: string;
  avatar: string;
  tag?: string;
  tagColor?: string;
  tagBg?: string;
  children?: Person[];
};

const org: Person = {
  id: "ceo",
  name: "Sarah Chen",
  role: "Chief Executive Officer",
  dept: "Executive",
  avatar: "SC",
  children: [
    {
      id: "claire",
      name: "Claire Bennett",
      role: "VP Marketing",
      dept: "Marketing",
      avatar: "CB",
      tag: "Your manager",
      tagColor: "#2D6A4F",
      tagBg: "#EAF4EF",
      children: [
        {
          id: "sofia",
          name: "Sofia Martínez",
          role: "Marketing Specialist",
          dept: "Marketing",
          avatar: "SM",
          tag: "You · Day 18",
          tagColor: "#1A1A2E",
          tagBg: "#EEEEF5",
        },
        {
          id: "james",
          name: "James Okafor",
          role: "Senior Marketing Manager",
          dept: "Marketing",
          avatar: "JO",
          tag: "Your buddy",
          tagColor: "#B7791F",
          tagBg: "#FEF3E2",
        },
        {
          id: "maya",
          name: "Maya Torres",
          role: "Content Lead",
          dept: "Marketing",
          avatar: "MT",
        },
        {
          id: "raj",
          name: "Raj Patel",
          role: "Brand Designer",
          dept: "Marketing",
          avatar: "RP",
        },
      ],
    },
    {
      id: "jp",
      name: "James Park",
      role: "VP Product",
      dept: "Product",
      avatar: "JP",
      children: [
        { id: "lc", name: "Lisa Chen", role: "Product Manager", dept: "Product", avatar: "LC" },
        { id: "ar", name: "Alex Rivera", role: "UX Lead", dept: "Product", avatar: "AR" },
      ],
    },
    {
      id: "al",
      name: "Ana Lima",
      role: "VP Sales",
      dept: "Sales",
      avatar: "AL",
      children: [
        { id: "bm", name: "Ben Morris", role: "Account Executive", dept: "Sales", avatar: "BM" },
        { id: "ps", name: "Priya Shah", role: "Sales Manager", dept: "Sales", avatar: "PS" },
        { id: "tn", name: "Tom Nielsen", role: "Account Executive", dept: "Sales", avatar: "TN" },
      ],
    },
    {
      id: "dr",
      name: "David Ross",
      role: "CFO",
      dept: "Finance",
      avatar: "DR",
      children: [
        { id: "km", name: "Kate Murphy", role: "Finance Manager", dept: "Finance", avatar: "KM" },
      ],
    },
  ],
};

const deptColors: Record<string, { color: string; bg: string }> = {
  Executive: { color: "#1A1A2E", bg: "#EEEEF5" },
  Marketing:  { color: "#9B2335", bg: "#FBEAEC" },
  Product:    { color: "#2D6A4F", bg: "#EAF4EF" },
  Sales:      { color: "#B7791F", bg: "#FEF3E2" },
  Finance:    { color: "#6B6B6B", bg: "#F5F4F0" },
};

function NodeCard({ person, selected, onSelect }: { person: Person; selected: string | null; onSelect: (p: Person) => void }) {
  const dc = deptColors[person.dept] || deptColors.Finance;
  const isSelected = selected === person.id;
  const isMe = person.id === "sofia";

  return (
    <button
      onClick={() => onSelect(person)}
      style={{
        background: isMe ? "#0A0A0A" : "#FFFFFF",
        border: isSelected ? `2px solid ${dc.color}` : isMe ? "2px solid #0A0A0A" : "1px solid #E2E0DA",
        borderRadius: 12,
        padding: "10px 12px",
        cursor: "pointer",
        textAlign: "left",
        width: 148,
        flexShrink: 0,
        transition: "all 0.15s",
        boxShadow: isSelected ? `0 0 0 3px ${dc.bg}` : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 99,
          background: isMe ? "#FFFFFF22" : dc.bg,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <span style={{ fontSize: 9, fontWeight: 800, color: isMe ? "#FFFFFF" : dc.color }}>{person.avatar}</span>
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: isMe ? "#FFFFFF" : "#0A0A0A", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {person.name}
          </p>
          <p style={{ fontSize: 9, color: isMe ? "#AAAAAA" : "#AEABA3", lineHeight: 1.3 }}>{person.dept}</p>
        </div>
      </div>
      <p style={{ fontSize: 10, color: isMe ? "#CCCCCC" : "#6B6B6B", lineHeight: 1.3, marginBottom: person.tag ? 6 : 0 }}>
        {person.role}
      </p>
      {person.tag && (
        <span style={{
          fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 99,
          background: isMe ? "#FFFFFF22" : person.tagBg,
          color: isMe ? "#FFFFFF" : person.tagColor,
        }}>
          {person.tag}
        </span>
      )}
    </button>
  );
}

// Draws a connector line between parent and children
function Connector({ count }: { count: number }) {
  if (count === 0) return null;
  const childWidth = 148;
  const gap = 12;
  const totalWidth = count * childWidth + (count - 1) * gap;
  const segW = childWidth + gap;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: totalWidth }}>
      {/* vertical stem down from parent */}
      <div style={{ width: 2, height: 16, background: "#E2E0DA" }} />
      {count > 1 ? (
        <>
          {/* horizontal bar */}
          <div style={{ position: "relative", width: "100%", height: 2, background: "#E2E0DA" }} />
          {/* vertical drops to each child */}
          <div style={{ display: "flex", gap: `${gap}px`, width: "100%" }}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} style={{ width: childWidth, display: "flex", justifyContent: "center" }}>
                <div style={{ width: 2, height: 16, background: "#E2E0DA" }} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ width: 2, height: 16, background: "#E2E0DA" }} />
      )}
    </div>
  );
}

export default function OrgPage() {
  const [selected, setSelected] = useState<Person | null>(null);

  const vpList = org.children || [];
  const marketingTeam = vpList.find(v => v.id === "claire")?.children || [];

  function handleSelect(p: Person) {
    setSelected(prev => prev?.id === p.id ? null : p);
  }

  return (
    <PageShell nav={<NavBar role="newcomer" active="Org" />}>

      {/* Header */}
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A", marginBottom: 4 }}>Org Chart</h2>
        <p style={{ fontSize: 13, color: "#6B6B6B" }}>Meridian Group · Click any person to see their details</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, alignItems: "start" }}>

        {/* Chart area */}
        <Card style={{ overflowX: "auto", padding: "28px 24px" }}>

          {/* Level 0 — CEO */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 0 }}>
            <NodeCard person={org} selected={selected?.id || null} onSelect={handleSelect} />

            {/* connector to VPs */}
            <Connector count={vpList.length} />

            {/* Level 1 — VPs */}
            <div style={{ display: "flex", gap: 12 }}>
              {vpList.map(vp => (
                <div key={vp.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <NodeCard person={vp} selected={selected?.id || null} onSelect={handleSelect} />

                  {/* connector to children */}
                  {vp.children && vp.children.length > 0 && (
                    <>
                      <Connector count={vp.children.length} />
                      {/* Level 2 — team members */}
                      <div style={{ display: "flex", gap: 12 }}>
                        {vp.children.map(member => (
                          <NodeCard key={member.id} person={member} selected={selected?.id || null} onSelect={handleSelect} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Detail panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {selected ? (
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 99,
                  background: deptColors[selected.dept]?.bg || "#F5F4F0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: deptColors[selected.dept]?.color || "#6B6B6B" }}>
                    {selected.avatar}
                  </span>
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#0A0A0A" }}>{selected.name}</p>
                  <p style={{ fontSize: 12, color: "#6B6B6B" }}>{selected.role}</p>
                </div>
              </div>
              {selected.tag && (
                <span style={{
                  display: "inline-block", fontSize: 11, fontWeight: 600,
                  padding: "3px 10px", borderRadius: 99,
                  background: selected.tagBg, color: selected.tagColor,
                  marginBottom: 14,
                }}>
                  {selected.tag}
                </span>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "#AEABA3" }}>Department</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A" }}>{selected.dept}</span>
                </div>
                {selected.children && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: "#AEABA3" }}>Direct reports</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A" }}>{selected.children.length}</span>
                  </div>
                )}
                {selected.id === "sofia" && (
                  <div style={{ marginTop: 8, background: "#EEEEF5", borderRadius: 10, padding: "10px 12px" }}>
                    <p style={{ fontSize: 11, color: "#6B6B6B", lineHeight: 1.6 }}>
                      Day 18 · Arrival phase · On track across all three buckets.
                    </p>
                  </div>
                )}
                {selected.id === "claire" && (
                  <div style={{ marginTop: 8, background: "#EAF4EF", borderRadius: 10, padding: "10px 12px" }}>
                    <p style={{ fontSize: 11, color: "#2D6A4F", lineHeight: 1.6 }}>
                      Sofia's direct manager. Monthly check-ins scheduled. Divergence alert active.
                    </p>
                  </div>
                )}
                {selected.id === "james" && (
                  <div style={{ marginTop: 8, background: "#FEF3E2", borderRadius: 10, padding: "10px 12px" }}>
                    <p style={{ fontSize: 11, color: "#B7791F", lineHeight: 1.6 }}>
                      Sofia's assigned buddy. First meeting completed on Day 3.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card style={{ background: "#F5F4F0", border: "1px solid #E2E0DA" }}>
              <p style={{ fontSize: 12, color: "#AEABA3", textAlign: "center", padding: "16px 0" }}>
                Click any person to see their details
              </p>
            </Card>
          )}

          {/* Legend */}
          <Card>
            <SectionLabel>Departments</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {Object.entries(deptColors).map(([dept, c]) => (
                <div key={dept} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: c.bg, border: `1.5px solid ${c.color}22` }} />
                  <span style={{ fontSize: 12, color: "#6B6B6B" }}>{dept}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* My connections */}
          <Card>
            <SectionLabel>Your key connections</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { name: "Claire Bennett", role: "Manager", color: "#2D6A4F", bg: "#EAF4EF", avatar: "CB" },
                { name: "James Okafor", role: "Buddy", color: "#B7791F", bg: "#FEF3E2", avatar: "JO" },
                { name: "Maya Torres", role: "Colleague", color: "#9B2335", bg: "#FBEAEC", avatar: "MT" },
              ].map(p => (
                <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 99, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 9, fontWeight: 800, color: p.color }}>{p.avatar}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A" }}>{p.name}</p>
                    <p style={{ fontSize: 10, color: "#AEABA3" }}>{p.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

    </PageShell>
  );
}
```

---

## app/newcomer/evaluation/page.tsx
```tsx
"use client";
import { useState } from "react";
import { NavBar, PageShell, Card, SectionLabel } from "@/components/ui";
import { evalQuestions } from "@/lib/mock";

const bucketKeys = ["job", "org", "people"] as const;
const bucketLabels = { job: "My Job", org: "My Organization", people: "My People" };

const labels = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];

export default function EvaluationPage() {
  const [scores, setScores] = useState<Record<string, number[]>>({
    job: [0, 0, 0, 0, 0],
    org: [0, 0, 0, 0, 0],
    people: [0, 0, 0, 0, 0],
  });
  const [qualitative, setQualitative] = useState({ surprise: "", unclear: "" });
  const [submitted, setSubmitted] = useState(false);
  const [activeBucket, setActiveBucket] = useState<"job" | "org" | "people">("job");

  const setScore = (bucket: string, idx: number, val: number) => {
    setScores(prev => ({
      ...prev,
      [bucket]: prev[bucket].map((s, i) => i === idx ? val : s),
    }));
  };

  const bucketComplete = (b: string) => scores[b].every(s => s > 0);
  const allComplete = bucketKeys.every(bucketComplete) && qualitative.surprise && qualitative.unclear;

  if (submitted) {
    return (
      <PageShell nav={<NavBar role="newcomer" active="Check-in" />}>
        <Card className="text-center py-10">
          <div className="text-4xl mb-4">✓</div>
          <h3 className="text-lg font-bold mb-2">Check-in complete</h3>
          <p className="text-sm text-[#6B6B6B] leading-relaxed max-w-xs mx-auto">
            Your responses have been recorded. Your manager will be notified of any areas that need attention.
          </p>
          <p className="text-xs text-[#AEABA3] mt-6">Next check-in: April 21, 2026</p>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell nav={<NavBar role="newcomer" active="Check-in" />}>
      <div className="space-y-1">
        <h2 className="text-xl font-bold">Monthly Check-in</h2>
        <p className="text-sm text-[#6B6B6B]">Takes about 5 minutes. Honest answers help you get better support.</p>
      </div>

      {/* Bucket tabs */}
      <div className="flex gap-2">
        {bucketKeys.map(b => (
          <button key={b} onClick={() => setActiveBucket(b)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeBucket === b ? "bg-[#0A0A0A] text-white" : "bg-white text-[#6B6B6B] border border-[#E2E0DA]"
            }`}>
            {bucketLabels[b]}
            {bucketComplete(b) && <span className="ml-1 text-[#2D6A4F]">✓</span>}
          </button>
        ))}
      </div>

      {/* Questions */}
      <Card>
        <SectionLabel>{bucketLabels[activeBucket]}</SectionLabel>
        <div className="space-y-5">
          {evalQuestions[activeBucket].map((q, i) => (
            <div key={i}>
              <p className="text-sm font-medium text-[#0A0A0A] mb-2.5 leading-relaxed">{q}</p>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map(val => (
                  <button key={val} onClick={() => setScore(activeBucket, i, val)}
                    className={`flex-1 h-9 rounded-lg text-sm font-semibold transition-colors ${
                      scores[activeBucket][i] === val
                        ? "bg-[#0A0A0A] text-white"
                        : "bg-[#F5F4F0] text-[#6B6B6B] hover:bg-[#E2E0DA]"
                    }`}>
                    {val}
                  </button>
                ))}
              </div>
              {scores[activeBucket][i] > 0 && (
                <p className="text-xs text-[#AEABA3] mt-1">{labels[scores[activeBucket][i] - 1]}</p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Open questions */}
      <Card>
        <SectionLabel>In your own words</SectionLabel>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#0A0A0A] block mb-2">
              What has surprised you most so far?
            </label>
            <textarea
              value={qualitative.surprise}
              onChange={e => setQualitative(p => ({ ...p, surprise: e.target.value }))}
              className="w-full border border-[#E2E0DA] rounded-lg p-3 text-sm text-[#0A0A0A] resize-none focus:outline-none focus:border-[#0A0A0A] transition-colors bg-white"
              rows={3} placeholder="Share anything that surprised you..."
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#0A0A0A] block mb-2">
              What feels most unclear right now?
            </label>
            <textarea
              value={qualitative.unclear}
              onChange={e => setQualitative(p => ({ ...p, unclear: e.target.value }))}
              className="w-full border border-[#E2E0DA] rounded-lg p-3 text-sm text-[#0A0A0A] resize-none focus:outline-none focus:border-[#0A0A0A] transition-colors bg-white"
              rows={3} placeholder="Be honest — this helps your manager support you better..."
            />
          </div>
        </div>
      </Card>

      <button
        onClick={() => allComplete && setSubmitted(true)}
        className={`w-full py-4 rounded-xl font-semibold text-sm transition-colors ${
          allComplete
            ? "bg-[#0A0A0A] text-white hover:bg-[#1A1A2E]"
            : "bg-[#E2E0DA] text-[#AEABA3] cursor-not-allowed"
        }`}>
        Submit check-in
      </button>
    </PageShell>
  );
}
```

---

## app/newcomer/complete/page.tsx
```tsx
"use client";
import { NavBar, PageShell, Card, SectionLabel, ScoreRing } from "@/components/ui";
import Link from "next/link";

const finalScores = { job: 88, org: 84, people: 85 };
const startScores = { job: 30, org: 20, people: 15 };

const milestones = [
  { month: "Day 1",    label: "First day at Meridian Group", icon: "🏁" },
  { month: "Day 18",   label: "Completed all arrival-phase tasks", icon: "✓" },
  { month: "Day 45",   label: "Led first campaign brief", icon: "📋" },
  { month: "Month 3",  label: "Built cross-functional relationships", icon: "🤝" },
  { month: "Month 6",  label: "Delivered measurable campaign results", icon: "📈" },
  { month: "Month 9",  label: "Became go-to expert in brand strategy", icon: "⭐" },
  { month: "Month 12", label: "Fully embedded — strategic contributor", icon: "🎯" },
];

const bucketConfig = {
  job:    { label: "My Job",          color: "#1A1A2E", bg: "#EEEEF5", num: "01" },
  org:    { label: "My Organization", color: "#2D6A4F", bg: "#EAF4EF", num: "02" },
  people: { label: "My People",       color: "#9B2335", bg: "#FBEAEC", num: "03" },
};

export default function CompletePage() {
  const avg = Math.round((finalScores.job + finalScores.org + finalScores.people) / 3);

  return (
    <PageShell nav={<NavBar role="newcomer" active="Home" />}>

      {/* Hero */}
      <Card style={{ background: "#0A0A0A", textAlign: "center", padding: "48px 32px" }}>
        <div style={{ width: 72, height: 72, borderRadius: 99, background: "#1A1A1A", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <span style={{ fontSize: 32 }}>🎯</span>
        </div>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#AEABA3", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>
          12-month journey complete
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.5px", marginBottom: 8, lineHeight: 1.2 }}>
          You are no longer new.<br />You are part of the fabric.
        </h1>
        <p style={{ fontSize: 14, color: "#888888", marginBottom: 28, lineHeight: 1.6 }}>
          Sofia Martínez · Meridian Group · March 2026 — February 2027
        </p>
        <div style={{ display: "inline-block", background: "#FFFFFF", borderRadius: 16, padding: "16px 32px" }}>
          <p style={{ fontSize: 40, fontWeight: 800, color: "#0A0A0A", letterSpacing: "-1px" }}>{avg}%</p>
          <p style={{ fontSize: 12, color: "#6B6B6B" }}>Overall socialization score</p>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Final scores */}
        <Card>
          <SectionLabel>Final scores — all three buckets</SectionLabel>
          <div style={{ display: "flex", gap: 12, justifyContent: "space-around", marginBottom: 20 }}>
            {(Object.entries(finalScores) as [keyof typeof bucketConfig, number][]).map(([key, score]) => (
              <div key={key} style={{ textAlign: "center" }}>
                <ScoreRing score={score} size={80} />
                <p style={{ fontSize: 11, color: "#6B6B6B", marginTop: 6 }}>{bucketConfig[key].label}</p>
              </div>
            ))}
          </div>

          <SectionLabel>Growth from Day 1</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(Object.entries(finalScores) as [keyof typeof bucketConfig, number][]).map(([key, score]) => {
              const bc = bucketConfig[key];
              const start = startScores[key];
              const growth = score - start;
              return (
                <div key={key} style={{ background: "#F5F4F0", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 6, background: bc.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 8, fontWeight: 800, color: bc.color }}>{bc.num}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A" }}>{bc.label}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11, color: "#AEABA3" }}>{start}%</span>
                    <span style={{ fontSize: 11, color: "#AEABA3" }}>→</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: bc.color }}>{score}%</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#2D6A4F", background: "#EAF4EF", padding: "2px 8px", borderRadius: 99 }}>+{growth}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Certificate */}
          <Card style={{ border: "2px solid #0A0A0A", textAlign: "center", padding: "28px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "#1A1A2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#FFF", fontWeight: 800, fontSize: 10 }}>ob</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: 15, color: "#0A0A0A" }}>onboard</span>
            </div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#AEABA3", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>Certificate of embedding</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A", marginBottom: 4 }}>Sofia Martínez</p>
            <p style={{ fontSize: 12, color: "#6B6B6B", marginBottom: 16 }}>has successfully completed the 12-month<br />socialization journey at Meridian Group</p>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
              {["Fully embedded", "3/3 buckets ≥ 80%", "No flight risk", "Social network built"].map(tag => (
                <span key={tag} style={{ fontSize: 10, fontWeight: 600, background: "#EEEEF5", color: "#1A1A2E", padding: "3px 10px", borderRadius: 99 }}>
                  {tag}
                </span>
              ))}
            </div>
            <p style={{ fontSize: 10, color: "#AEABA3", marginTop: 16 }}>February 27, 2027</p>
          </Card>

          {/* Insight */}
          <Card style={{ background: "#ECECEA", border: "1px solid #DDDBD5" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#AEABA3", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Reflection</p>
            <p style={{ fontSize: 13, color: "#0A0A0A", lineHeight: 1.7 }}>
              Your <strong>My People</strong> track showed the most growth (+70 pts). The social integration effort in months 2–4 paid off long-term. You are now someone others seek out.
            </p>
          </Card>

          <Link href="/newcomer" style={{ textDecoration: "none" }}>
            <div style={{ background: "#F5F4F0", border: "1px solid #E2E0DA", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#6B6B6B" }}>Back to dashboard</span>
              <span style={{ color: "#AEABA3", fontSize: 16 }}>›</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Milestones timeline */}
      <Card>
        <SectionLabel>12-month milestones</SectionLabel>
        <div style={{ display: "flex", gap: 0 }}>
          {milestones.map((m, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
              {/* connector line */}
              {i < milestones.length - 1 && (
                <div style={{ position: "absolute", top: 18, left: "50%", right: "-50%", height: 2, background: "#E2E0DA", zIndex: 0 }} />
              )}
              <div style={{ width: 36, height: 36, borderRadius: 99, background: i === milestones.length - 1 ? "#0A0A0A" : "#EEEEF5", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, marginBottom: 8 }}>
                <span style={{ fontSize: 14 }}>{m.icon}</span>
              </div>
              <p style={{ fontSize: 9, fontWeight: 700, color: "#AEABA3", marginBottom: 3, textAlign: "center" }}>{m.month}</p>
              <p style={{ fontSize: 10, color: "#0A0A0A", textAlign: "center", lineHeight: 1.4, padding: "0 4px" }}>{m.label}</p>
            </div>
          ))}
        </div>
      </Card>

    </PageShell>
  );
}
```

---

## app/manager/page.tsx
```tsx
"use client";
import { NavBar, PageShell, Card, StatusDot, Avatar, SectionLabel, TwoCol } from "@/components/ui";
import { managerNewcomers } from "@/lib/mock";
import Link from "next/link";

export default function ManagerHome() {
  const left = <>
    <div className="space-y-1">
      <h2 className="text-xl font-bold">My Team</h2>
      <p className="text-sm text-[#6B6B6B]">Claire Bennett · VP Marketing</p>
    </div>

    <Card style={{ background: "#FBEAEC", border: "1px solid #9B2335" }}>
      <p className="text-xs font-semibold text-[#9B2335] uppercase tracking-widest mb-1">Action needed</p>
      <p className="text-sm text-[#9B2335]">Yuki Tanaka shows signs of social isolation — low Bucket 3 score for 3 consecutive weeks.</p>
    </Card>

    <div>
      <SectionLabel>Pending from you</SectionLabel>
      <Card className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-sm">Monthly evaluation — Sofia Martínez</p>
          <p className="text-xs text-[#6B6B6B] mt-0.5">Due March 25 · Takes 3 minutes</p>
        </div>
        <button className="text-sm font-medium text-white bg-[#0A0A0A] px-3 py-1.5 rounded-lg hover:bg-[#1A1A2E] transition-colors">
          Start
        </button>
      </Card>
    </div>
  </>;

  const right = <>
    <div>
      <SectionLabel>Active newcomers ({managerNewcomers.length})</SectionLabel>
      <div className="space-y-2">
        {managerNewcomers.map((n, i) => (
          <Link key={i} href={i === 0 ? "/manager/newcomer/sofia" : "#"}>
            <Card className="hover:border-[#0A0A0A] transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <Avatar initials={n.name.split(" ").map(w => w[0]).join("")} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-sm">{n.name}</p>
                    <StatusDot status={n.status as "green" | "yellow" | "red"} />
                  </div>
                  <p className="text-xs text-[#6B6B6B]">{n.role} · Day {n.day}</p>
                  <div className="mt-2.5 space-y-1.5">
                    {(["job", "org", "people"] as const).map(b => (
                      <div key={b} className="flex items-center gap-2">
                        <span className="text-[10px] text-[#AEABA3] w-12 flex-shrink-0 capitalize">{b}</span>
                        <div className="flex-1 h-1.5 bg-[#F5F4F0] rounded-full overflow-hidden">
                          <div className="h-full rounded-full"
                            style={{
                              width: `${n.scores[b]}%`,
                              background: n.scores[b] >= 70 ? "#2D6A4F" : n.scores[b] >= 50 ? "#B7791F" : "#9B2335"
                            }} />
                        </div>
                        <span className="text-[10px] text-[#AEABA3] w-7 text-right">{n.scores[b]}%</span>
                      </div>
                    ))}
                  </div>
                  {n.flag && (
                    <p className="text-xs text-[#B7791F] mt-2 bg-[#FEF3E2] px-2 py-1 rounded">
                      ⚠ {n.flag}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  </>;

  return (
    <PageShell nav={<NavBar role="manager" active="My Team" />}>
      <TwoCol left={left} right={right} />
    </PageShell>
  );
}
```

---

## app/manager/checkin/sofia/page.tsx
```tsx
"use client";
import { useState } from "react";
import { NavBar, PageShell, Card, SectionLabel } from "@/components/ui";

const buckets = [
  {
    id: "job", label: "My Job", num: "01", color: "#1A1A2E", bg: "#EEEEF5",
    questions: [
      "Sofia clearly understands her role and responsibilities",
      "She is performing her core tasks with confidence",
      "She knows how to find the resources she needs",
      "She understands how her performance is evaluated",
      "She has already delivered meaningful results",
    ],
  },
  {
    id: "org", label: "My Organization", num: "02", color: "#2D6A4F", bg: "#EAF4EF",
    questions: [
      "She understands how decisions are made here",
      "She is aligning with the company's values and culture",
      "She grasps how her role fits the broader strategy",
      "She navigates the organization comfortably",
      "She participates in team rituals and norms",
    ],
  },
  {
    id: "people", label: "My People", num: "03", color: "#9B2335", bg: "#FBEAEC",
    questions: [
      "She is building meaningful relationships with the team",
      "She seems to feel a sense of belonging",
      "She asks for help when needed",
      "She is connecting with key cross-functional contacts",
      "She is becoming socially integrated",
    ],
  },
];

const sofiaScores = { job: 62, org: 48, people: 35 };

export default function ManagerCheckinPage() {
  const [tab, setTab] = useState("job");
  const [ratings, setRatings] = useState<Record<string, number[]>>({
    job:    [0, 0, 0, 0, 0],
    org:    [0, 0, 0, 0, 0],
    people: [0, 0, 0, 0, 0],
  });
  const [notes, setNotes] = useState<Record<string, string>>({ job: "", org: "", people: "" });
  const [submitted, setSubmitted] = useState(false);

  const activeBucket = buckets.find(b => b.id === tab)!;

  function setRating(bucketId: string, idx: number, val: number) {
    setRatings(prev => ({
      ...prev,
      [bucketId]: prev[bucketId].map((v, i) => i === idx ? val : v),
    }));
  }

  function bucketScore(id: string) {
    const vals = ratings[id].filter(v => v > 0);
    if (!vals.length) return null;
    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 20);
  }

  const allFilled = buckets.every(b => ratings[b.id].every(v => v > 0));

  if (submitted) {
    return (
      <PageShell nav={<NavBar role="manager" active="My Team" />}>
        <Card style={{ textAlign: "center", padding: "48px 32px" }}>
          <div style={{ width: 56, height: 56, borderRadius: 99, background: "#EAF4EF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <span style={{ fontSize: 24 }}>✓</span>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A", marginBottom: 8 }}>Check-in submitted</h2>
          <p style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 24 }}>Sofia's evaluation for March 2026 has been recorded. She will be notified.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            {buckets.map(b => {
              const score = bucketScore(b.id);
              return (
                <div key={b.id} style={{ background: b.bg, borderRadius: 12, padding: "14px 20px", textAlign: "center" }}>
                  <p style={{ fontSize: 22, fontWeight: 700, color: b.color }}>{score ?? "—"}%</p>
                  <p style={{ fontSize: 11, color: "#6B6B6B", marginTop: 2 }}>{b.label}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell nav={<NavBar role="manager" active="My Team" />}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A", marginBottom: 4 }}>Manager check-in</h2>
        <p style={{ fontSize: 13, color: "#6B6B6B" }}>Sofia Martínez · March 2026 · Day 18</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Bucket tabs */}
          <div style={{ display: "flex", gap: 6 }}>
            {buckets.map(b => {
              const score = bucketScore(b.id);
              const filled = ratings[b.id].every(v => v > 0);
              return (
                <button
                  key={b.id}
                  onClick={() => setTab(b.id)}
                  style={{
                    flex: 1, padding: "10px 12px", borderRadius: 12, border: "none", cursor: "pointer",
                    background: tab === b.id ? b.color : "#F5F4F0",
                    textAlign: "left", transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 5, background: tab === b.id ? "#FFFFFF22" : b.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 8, fontWeight: 800, color: tab === b.id ? "#FFFFFF" : b.color }}>{b.num}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: tab === b.id ? "#FFFFFF" : "#0A0A0A" }}>{b.label}</span>
                  </div>
                  {filled && score !== null
                    ? <p style={{ fontSize: 11, color: tab === b.id ? "#FFFFFF99" : "#6B6B6B" }}>{score}% rated</p>
                    : <p style={{ fontSize: 11, color: tab === b.id ? "#FFFFFF66" : "#AEABA3" }}>Not rated yet</p>
                  }
                </button>
              );
            })}
          </div>

          {/* Questions */}
          <Card>
            <SectionLabel>{activeBucket.label} — Rate each statement (1–5)</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {activeBucket.questions.map((q, i) => (
                <div key={i}>
                  <p style={{ fontSize: 13, color: "#0A0A0A", marginBottom: 8, lineHeight: 1.5 }}>{q}</p>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[1, 2, 3, 4, 5].map(val => {
                      const selected = ratings[activeBucket.id][i] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => setRating(activeBucket.id, i, val)}
                          style={{
                            width: 44, height: 44, borderRadius: 10, border: "none", cursor: "pointer",
                            fontWeight: 700, fontSize: 14,
                            background: selected ? activeBucket.color : "#F5F4F0",
                            color: selected ? "#FFFFFF" : "#6B6B6B",
                            transition: "all 0.12s",
                          }}
                        >
                          {val}
                        </button>
                      );
                    })}
                    <div style={{ marginLeft: 8, display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 10, color: "#AEABA3" }}>1 = Not at all</span>
                      <span style={{ fontSize: 10, color: "#AEABA3" }}>5 = Fully</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", marginBottom: 6 }}>Additional notes (optional)</p>
              <textarea
                value={notes[activeBucket.id]}
                onChange={e => setNotes(prev => ({ ...prev, [activeBucket.id]: e.target.value }))}
                placeholder="Any observations about Sofia's progress in this area..."
                style={{
                  width: "100%", minHeight: 80, borderRadius: 10, border: "1px solid #E2E0DA",
                  padding: "10px 12px", fontSize: 12, color: "#0A0A0A", resize: "vertical",
                  fontFamily: "inherit", background: "#FAFAF8", outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </Card>

          <button
            onClick={() => allFilled && setSubmitted(true)}
            style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none", cursor: allFilled ? "pointer" : "not-allowed",
              background: allFilled ? "#0A0A0A" : "#E2E0DA",
              color: allFilled ? "#FFFFFF" : "#AEABA3",
              fontSize: 14, fontWeight: 700, transition: "all 0.15s",
            }}
          >
            {allFilled ? "Submit evaluation" : "Complete all sections to submit"}
          </button>
        </div>

        {/* Right — comparison */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Card>
            <SectionLabel>Your rating vs. Sofia's self-score</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {buckets.map(b => {
                const managerScore = bucketScore(b.id);
                const selfScore = sofiaScores[b.id as keyof typeof sofiaScores];
                const gap = managerScore !== null ? managerScore - selfScore : null;
                return (
                  <div key={b.id} style={{ background: "#F5F4F0", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                      <div style={{ width: 16, height: 16, borderRadius: 4, background: b.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 7, fontWeight: 800, color: b.color }}>{b.num}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#0A0A0A" }}>{b.label}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: "#6B6B6B" }}>Sofia's self</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#0A0A0A" }}>{selfScore}%</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: "#6B6B6B" }}>Your rating</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: b.color }}>{managerScore !== null ? `${managerScore}%` : "—"}</span>
                    </div>
                    {gap !== null && (
                      <div style={{
                        background: Math.abs(gap) > 15 ? "#FEF3E2" : "#EAF4EF",
                        borderRadius: 8, padding: "5px 8px", textAlign: "center",
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: Math.abs(gap) > 15 ? "#B7791F" : "#2D6A4F" }}>
                          {gap > 0 ? "+" : ""}{gap} pts divergence
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          <Card style={{ background: "#ECECEA", border: "1px solid #DDDBD5" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#AEABA3", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Tip</p>
            <p style={{ fontSize: 12, color: "#0A0A0A", lineHeight: 1.6 }}>
              A gap of more than 15 points between your rating and Sofia's self-score warrants a 1:1 conversation to align expectations.
            </p>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
```

---

## app/manager/newcomer/sofia/page.tsx
```tsx
"use client";
import { NavBar, PageShell, Card, StatusDot, Avatar, SectionLabel, ScoreRing, TwoCol } from "@/components/ui";
import { managerNewcomers } from "@/lib/mock";

const sofia = managerNewcomers[0];

const nudges = [
  { text: "Review 90-day goals together in your next 1:1 — she may need more clarity on KPIs." },
  { text: "Introduce Sofia to 1–2 people outside Marketing this week — her people score is the lowest." },
];

const qualQuotes = [
  { q: "What has surprised you most?", a: "How fast-paced everything is. I'm learning a lot but sometimes feel I'm missing context." },
  { q: "What feels most unclear?", a: "I'm still not sure exactly how my work connects to the broader strategy." },
];

const history = [
  { month: "Month 1 (Feb)", self: 42, manager: 60 },
  { month: "Month 1 wk3 (now)", self: 48, manager: 65 },
];

export default function SofiaPage() {
  const left = <>
    <Card>
      <div className="flex items-start gap-3">
        <Avatar initials="SM" size={48} />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-bold">{sofia.name}</h2>
            <StatusDot status="yellow" />
          </div>
          <p className="text-sm text-[#6B6B6B]">{sofia.role} · Day {sofia.day} · {sofia.phase} phase</p>
        </div>
      </div>
    </Card>

    <Card style={{ background: "#FEF3E2", border: "1px solid #B7791F" }}>
      <p className="text-xs font-semibold text-[#B7791F] uppercase tracking-widest mb-1">Divergence detected</p>
      <p className="text-sm text-[#B7791F] leading-relaxed">
        Sofia rates her own adjustment at <strong>{sofia.selfScore}%</strong> — you rated her at <strong>{sofia.managerScore}%</strong>.
        This gap suggests she may be struggling in ways not yet visible. A direct conversation is recommended.
      </p>
    </Card>

    {/* Score comparison */}
    <Card>
      <SectionLabel>Score comparison</SectionLabel>
      <div className="flex justify-around mb-5">
        <div className="text-center">
          <ScoreRing score={sofia.selfScore} size={72} />
          <p className="text-xs text-[#6B6B6B] mt-2">Self-rating</p>
        </div>
        <div className="flex items-center text-[#E2E0DA] text-2xl font-light">vs</div>
        <div className="text-center">
          <ScoreRing score={sofia.managerScore} size={72} />
          <p className="text-xs text-[#6B6B6B] mt-2">Your rating</p>
        </div>
      </div>
      <div className="space-y-3">
        {(["job", "org", "people"] as const).map(b => {
          const labels = { job: "My Job", org: "My Organization", people: "My People" };
          return (
            <div key={b}>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-medium">{labels[b]}</span>
                <span className="text-xs text-[#6B6B6B]">{sofia.scores[b]}%</span>
              </div>
              <div className="h-2 bg-[#F5F4F0] rounded-full overflow-hidden">
                <div className="h-full rounded-full"
                  style={{
                    width: `${sofia.scores[b]}%`,
                    background: sofia.scores[b] >= 70 ? "#2D6A4F" : sofia.scores[b] >= 50 ? "#B7791F" : "#9B2335"
                  }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  </>;

  const right = <>
    {/* What she said */}
    <div>
      <SectionLabel>What Sofia said</SectionLabel>
      <div className="space-y-2">
        {qualQuotes.map((q, i) => (
          <Card key={i}>
            <p className="text-xs font-semibold text-[#AEABA3] mb-1.5">{q.q}</p>
            <p className="text-sm text-[#0A0A0A] italic leading-relaxed">&quot;{q.a}&quot;</p>
          </Card>
        ))}
      </div>
    </div>

    {/* Nudges */}
    <div>
      <SectionLabel>Suggested actions for you</SectionLabel>
      <div className="space-y-2">
        {nudges.map((n, i) => (
          <Card key={i} className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A2E] mt-2 flex-shrink-0" />
            <p className="text-sm text-[#0A0A0A] leading-relaxed">{n.text}</p>
          </Card>
        ))}
      </div>
    </div>

    {/* Trend */}
    <div>
      <SectionLabel>Trend</SectionLabel>
      <Card>
        <div className="space-y-3">
          {history.map((h, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-[#6B6B6B]">{h.month}</span>
                <span className="text-xs text-[#AEABA3]">self {h.self}% · you {h.manager}%</span>
              </div>
              <div className="flex gap-1.5">
                <div className="flex-1 h-2 bg-[#F5F4F0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#B7791F] rounded-full" style={{ width: `${h.self}%` }} />
                </div>
                <div className="flex-1 h-2 bg-[#F5F4F0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#1A1A2E] rounded-full" style={{ width: `${h.manager}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1.5 rounded bg-[#B7791F]" />
            <span className="text-xs text-[#6B6B6B]">Self</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1.5 rounded bg-[#1A1A2E]" />
            <span className="text-xs text-[#6B6B6B]">Manager</span>
          </div>
        </div>
      </Card>
    </div>
  </>;

  return (
    <PageShell nav={<NavBar role="manager" active="Sofia M." />}>
      <TwoCol left={left} right={right} />
    </PageShell>
  );
}
```

---

## app/hr/page.tsx
```tsx
"use client";
import { NavBar, PageShell, Card, StatusDot, SectionLabel, TwoCol, ThreeCol } from "@/components/ui";
import { hrOverview, hrNewcomers } from "@/lib/mock";
import Link from "next/link";

export default function HRHome() {
  const total = hrOverview.total;

  const left = <>
    <div className="space-y-1">
      <h2 className="text-xl font-bold">Organization Overview</h2>
      <p className="text-sm text-[#6B6B6B]">Meridian Group · {total} active newcomers</p>
    </div>

    {/* Health summary */}
    <ThreeCol>
      {[
        { label: "On track", value: hrOverview.green, color: "#2D6A4F" },
        { label: "Attention", value: hrOverview.yellow, color: "#B7791F" },
        { label: "At risk", value: hrOverview.red, color: "#9B2335" },
      ].map(s => (
        <Card key={s.label} className="text-center py-4" style={{ borderColor: s.color + "33" }}>
          <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
          <p className="text-xs text-[#6B6B6B] mt-1">{s.label}</p>
        </Card>
      ))}
    </ThreeCol>

    {/* Avg scores */}
    <Card>
      <SectionLabel>Average bucket scores</SectionLabel>
      <div className="space-y-3">
        {[
          { label: "My Job", score: hrOverview.avgScores.job },
          { label: "My Organization", score: hrOverview.avgScores.org },
          { label: "My People", score: hrOverview.avgScores.people },
        ].map(s => (
          <div key={s.label}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{s.label}</span>
              <span className="text-sm text-[#6B6B6B]">{s.score}%</span>
            </div>
            <div className="h-2.5 bg-[#F5F4F0] rounded-full overflow-hidden">
              <div className="h-full rounded-full"
                style={{
                  width: `${s.score}%`,
                  background: s.score >= 70 ? "#2D6A4F" : s.score >= 50 ? "#B7791F" : "#9B2335"
                }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 bg-[#FEF3E2] rounded-lg p-3">
        <p className="text-xs font-semibold text-[#B7791F] mb-1">Organization insight</p>
        <p className="text-sm text-[#B7791F]">
          &quot;My People&quot; is the weakest bucket (52%). Social integration is the main gap — consider strengthening the buddy program.
        </p>
      </div>
    </Card>

    {/* Flight risk */}
    <Card style={{ background: "#FBEAEC", border: "1px solid #9B2335" }}>
      <p className="text-xs font-semibold text-[#9B2335] uppercase tracking-widest mb-2">Flight risk</p>
      <p className="text-3xl font-bold text-[#9B2335]">{hrOverview.flightRisk}</p>
      <p className="text-sm text-[#9B2335] mt-1">newcomers with declining scores for 2+ consecutive check-ins</p>
      <Link href="/hr/newcomers">
        <button className="mt-3 text-xs font-semibold text-[#9B2335] underline underline-offset-2">
          View all newcomers →
        </button>
      </Link>
    </Card>
  </>;

  const right = <>
    {/* Phase distribution */}
    <Card>
      <SectionLabel>Newcomers by phase</SectionLabel>
      <div className="space-y-2">
        {[
          { phase: "Arrival (Days 1–30)", count: hrOverview.phases.arrival, pct: hrOverview.phases.arrival / total },
          { phase: "Integration (Days 31–90)", count: hrOverview.phases.integration, pct: hrOverview.phases.integration / total },
          { phase: "Adjustment (Months 4–6)", count: hrOverview.phases.adjustment, pct: hrOverview.phases.adjustment / total },
          { phase: "Stabilization (Months 7–9)", count: hrOverview.phases.stabilization, pct: hrOverview.phases.stabilization / total },
          { phase: "Embedding (Months 10–12)", count: hrOverview.phases.embedding, pct: hrOverview.phases.embedding / total },
        ].map(p => (
          <div key={p.phase} className="flex items-center gap-3">
            <span className="text-xs text-[#6B6B6B] w-44 flex-shrink-0">{p.phase}</span>
            <div className="flex-1 h-2 bg-[#F5F4F0] rounded-full overflow-hidden">
              <div className="h-full bg-[#0A0A0A] rounded-full" style={{ width: `${p.pct * 100}%` }} />
            </div>
            <span className="text-xs font-semibold w-4 text-right">{p.count}</span>
          </div>
        ))}
      </div>
    </Card>

    {/* Manager effectiveness */}
    <Card>
      <SectionLabel>Manager effectiveness</SectionLabel>
      <div className="space-y-2">
        {[
          { name: "Ravi Sharma", newcomers: 2, avgScore: 75, trend: "↑" },
          { name: "Claire Bennett", newcomers: 2, avgScore: 49, trend: "↓" },
          { name: "Lee Park", newcomers: 1, avgScore: 72, trend: "→" },
        ].map(m => (
          <div key={m.name} className="flex items-center justify-between py-2 border-b border-[#F5F4F0] last:border-0">
            <div>
              <p className="text-sm font-medium">{m.name}</p>
              <p className="text-xs text-[#6B6B6B]">{m.newcomers} newcomer{m.newcomers > 1 ? "s" : ""}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{m.avgScore}%</p>
              <p className={`text-xs ${m.trend === "↑" ? "text-[#2D6A4F]" : m.trend === "↓" ? "text-[#9B2335]" : "text-[#6B6B6B]"}`}>
                {m.trend} avg adjustment
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>

    {/* All newcomers shortcut */}
    <Card>
      <SectionLabel>Quick view — all newcomers</SectionLabel>
      <div className="space-y-2">
        {hrNewcomers.slice(0, 4).map((n, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#F5F4F0] last:border-0">
            <div>
              <p className="text-sm font-medium">{n.name}</p>
              <p className="text-xs text-[#6B6B6B]">{n.dept} · Day {n.day}</p>
            </div>
            <StatusDot status={n.status as "green" | "yellow" | "red"} />
          </div>
        ))}
      </div>
      <Link href="/hr/newcomers">
        <button className="mt-3 text-xs font-semibold text-[#0A0A0A] underline underline-offset-2">
          View all {hrNewcomers.length} →
        </button>
      </Link>
    </Card>
  </>;

  return (
    <PageShell nav={<NavBar role="hr" active="Overview" />}>
      <TwoCol left={left} right={right} />
    </PageShell>
  );
}
```

---

## app/hr/newcomers/page.tsx
```tsx
"use client";
import Link from "next/link";
import { NavBar, PageShell, Card, StatusDot, Avatar, SectionLabel } from "@/components/ui";
import { hrNewcomers } from "@/lib/mock";

const slugMap: Record<string, string> = {
  "Sofia Martínez": "sofia", "Daniel Cruz": "daniel", "Yuki Tanaka": "yuki",
  "Marcus Webb": "marcus", "Fatima Al-Hassan": "fatima", "Ben Kowalski": "ben",
};

export default function AllNewcomersPage() {
  return (
    <PageShell nav={<NavBar role="hr" active="All Newcomers" />}>
      <div className="space-y-1">
        <h2 className="text-xl font-bold">All Newcomers</h2>
        <p className="text-sm text-[#6B6B6B]">{hrNewcomers.length} active · sorted by risk</p>
      </div>

      <div>
        <SectionLabel>Needs attention first</SectionLabel>
        <div className="space-y-2">
          {[...hrNewcomers]
            .sort((a, b) => {
              const order = { red: 0, yellow: 1, green: 2 };
              return order[a.status as keyof typeof order] - order[b.status as keyof typeof order];
            })
            .map((n, i) => {
              const slug = slugMap[n.name];
              const inner = (
                <Card key={i} style={{ display: "flex", alignItems: "center", gap: 12, cursor: slug ? "pointer" : "default" }}>
                  <Avatar initials={n.name.split(" ").map((w: string) => w[0]).join("")} size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                      <p style={{ fontWeight: 600, fontSize: 13, color: "#0A0A0A" }}>{n.name}</p>
                      <StatusDot status={n.status as "green" | "yellow" | "red"} />
                    </div>
                    <p style={{ fontSize: 11, color: "#6B6B6B" }}>{n.dept} · Day {n.day} · {n.manager}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
                    <div>
                      <p style={{ fontSize: 10, color: "#AEABA3" }}>day</p>
                      <p style={{ fontSize: 17, fontWeight: 700, color: "#0A0A0A" }}>{n.day}</p>
                    </div>
                    {slug && <span style={{ color: "#AEABA3", fontSize: 16 }}>›</span>}
                  </div>
                </Card>
              );
              return slug
                ? <Link key={i} href={`/hr/newcomers/${slug}`} style={{ textDecoration: "none" }}>{inner}</Link>
                : inner;
            })}
        </div>
      </div>
    </PageShell>
  );
}
```

---

## app/hr/newcomers/[slug]/page.tsx
```tsx
"use client";
import { NavBar, PageShell, Card, SectionLabel, StatusDot, Avatar, ScoreRing } from "@/components/ui";
import { notFound } from "next/navigation";

const profiles: Record<string, {
  name: string; role: string; dept: string; day: number; phase: string;
  status: "green" | "yellow" | "red"; manager: string; avatar: string;
  scores: { job: number; org: number; people: number };
  selfScore: number; managerScore: number;
  alerts: string[]; strengths: string[];
  checkins: { date: string; job: number; org: number; people: number }[];
}> = {
  sofia: {
    name: "Sofia Martínez", role: "Marketing Specialist", dept: "Marketing",
    day: 18, phase: "Arrival", status: "yellow",
    manager: "Claire Bennett", avatar: "SM",
    scores: { job: 62, org: 48, people: 35 },
    selfScore: 48, managerScore: 65,
    alerts: ["Self vs manager divergence — 17 pts gap", "My People score below 40 — social integration at risk"],
    strengths: ["Fast learner in role tasks", "Proactive communication with manager"],
    checkins: [
      { date: "Mar W1", job: 30, org: 20, people: 15 },
      { date: "Mar W3", job: 62, org: 48, people: 35 },
    ],
  },
  daniel: {
    name: "Daniel Cruz", role: "Data Analyst", dept: "Analytics",
    day: 54, phase: "Integration", status: "green",
    manager: "Ravi Sharma", avatar: "DC",
    scores: { job: 78, org: 72, people: 68 },
    selfScore: 72, managerScore: 74,
    alerts: [],
    strengths: ["Strong cross-functional relationships", "Exceeds expectations in role clarity"],
    checkins: [
      { date: "Feb W1", job: 40, org: 30, people: 22 },
      { date: "Feb W3", job: 60, org: 52, people: 48 },
      { date: "Mar W3", job: 78, org: 72, people: 68 },
    ],
  },
  yuki: {
    name: "Yuki Tanaka", role: "Product Designer", dept: "Product",
    day: 91, phase: "Adjustment", status: "red",
    manager: "Claire Bennett", avatar: "YT",
    scores: { job: 55, org: 40, people: 28 },
    selfScore: 38, managerScore: 60,
    alerts: ["Social isolation — My People critically low (28%)", "Large divergence gap — 22 pts", "No informal connections reported in 3 weeks"],
    strengths: ["Strong design output quality"],
    checkins: [
      { date: "Jan", job: 35, org: 25, people: 20 },
      { date: "Feb", job: 48, org: 35, people: 24 },
      { date: "Mar", job: 55, org: 40, people: 28 },
    ],
  },
  marcus: {
    name: "Marcus Webb", role: "Account Executive", dept: "Sales",
    day: 134, phase: "Stabilization", status: "green",
    manager: "Lee Park", avatar: "MW",
    scores: { job: 82, org: 75, people: 79 },
    selfScore: 78, managerScore: 80,
    alerts: [],
    strengths: ["Excellent relationship building", "Leading informal team rituals"],
    checkins: [
      { date: "Nov", job: 55, org: 48, people: 50 },
      { date: "Dec", job: 68, org: 60, people: 65 },
      { date: "Jan", job: 75, org: 68, people: 72 },
      { date: "Mar", job: 82, org: 75, people: 79 },
    ],
  },
  fatima: {
    name: "Fatima Al-Hassan", role: "Legal Counsel", dept: "Legal",
    day: 201, phase: "Embedding", status: "green",
    manager: "Susan Cole", avatar: "FA",
    scores: { job: 88, org: 84, people: 86 },
    selfScore: 85, managerScore: 87,
    alerts: [],
    strengths: ["Fully embedded", "Acts as informal mentor to newer hires", "Strong influence across departments"],
    checkins: [
      { date: "Sep", job: 72, org: 65, people: 68 },
      { date: "Nov", job: 80, org: 76, people: 78 },
      { date: "Mar", job: 88, org: 84, people: 86 },
    ],
  },
  ben: {
    name: "Ben Kowalski", role: "Software Engineer", dept: "Engineering",
    day: 12, phase: "Arrival", status: "green",
    manager: "Ravi Sharma", avatar: "BK",
    scores: { job: 42, org: 28, people: 22 },
    selfScore: 35, managerScore: 40,
    alerts: ["Very early stage — monitoring only"],
    strengths: ["Strong technical onboarding progress"],
    checkins: [
      { date: "Mar W1", job: 25, org: 18, people: 12 },
      { date: "Mar W3", job: 42, org: 28, people: 22 },
    ],
  },
};

const bucketConfig = {
  job:    { label: "My Job",    color: "#1A1A2E", bg: "#EEEEF5", num: "01" },
  org:    { label: "My Org",    color: "#2D6A4F", bg: "#EAF4EF", num: "02" },
  people: { label: "My People", color: "#9B2335", bg: "#FBEAEC", num: "03" },
};

export default function HRNewcomerDetail({ params }: { params: { slug: string } }) {
  const profile = profiles[params.slug];
  if (!profile) notFound();

  const avg = Math.round((profile.scores.job + profile.scores.org + profile.scores.people) / 3);
  const gap = profile.managerScore - profile.selfScore;

  return (
    <PageShell nav={<NavBar role="hr" active="All Newcomers" />}>

      {/* Header */}
      <Card style={{ background: "#ECECEA", border: "1px solid #DDDBD5" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Avatar initials={profile.avatar} size={52} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A" }}>{profile.name}</h2>
                <StatusDot status={profile.status} />
              </div>
              <p style={{ fontSize: 13, color: "#6B6B6B" }}>{profile.role} · {profile.dept}</p>
              <p style={{ fontSize: 12, color: "#AEABA3", marginTop: 2 }}>Day {profile.day} · {profile.phase} phase · Manager: {profile.manager}</p>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 28, fontWeight: 700, color: "#0A0A0A" }}>{avg}%</p>
            <p style={{ fontSize: 11, color: "#AEABA3" }}>overall avg</p>
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Bucket scores */}
          <Card>
            <SectionLabel>Three-bucket scores</SectionLabel>
            <div style={{ display: "flex", gap: 16, justifyContent: "space-around", marginBottom: 16 }}>
              {(Object.entries(profile.scores) as [keyof typeof bucketConfig, number][]).map(([key, score]) => {
                const bc = bucketConfig[key];
                return (
                  <div key={key} style={{ textAlign: "center" }}>
                    <ScoreRing score={score} size={80} />
                    <p style={{ fontSize: 11, color: "#6B6B6B", marginTop: 6 }}>{bc.label}</p>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(Object.entries(profile.scores) as [keyof typeof bucketConfig, number][]).map(([key, score]) => {
                const bc = bucketConfig[key];
                return (
                  <div key={key}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "#0A0A0A", fontWeight: 500 }}>{bc.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: bc.color }}>{score}%</span>
                    </div>
                    <div style={{ height: 6, background: "#F5F4F0", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", background: bc.color, borderRadius: 99, width: `${score}%`, transition: "width 0.5s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Check-in history */}
          <Card>
            <SectionLabel>Check-in history</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {profile.checkins.map((c, i) => (
                <div key={i} style={{ background: "#F5F4F0", borderRadius: 10, padding: "10px 12px" }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#6B6B6B", marginBottom: 6 }}>{c.date}</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    {(["job", "org", "people"] as const).map(k => {
                      const bc = bucketConfig[k];
                      return (
                        <div key={k} style={{ flex: 1, background: bc.bg, borderRadius: 7, padding: "5px 8px", textAlign: "center" }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: bc.color }}>{c[k]}%</p>
                          <p style={{ fontSize: 9, color: "#6B6B6B" }}>{bc.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Alerts */}
          {profile.alerts.length > 0 && (
            <Card style={{ border: "1px solid #F5C6CC" }}>
              <SectionLabel>Active alerts</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {profile.alerts.map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "#FBEAEC", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ width: 8, height: 8, borderRadius: 99, background: "#9B2335", marginTop: 4, flexShrink: 0 }} />
                    <p style={{ fontSize: 12, color: "#9B2335", lineHeight: 1.5 }}>{a}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Strengths */}
          <Card>
            <SectionLabel>Strengths observed</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {profile.strengths.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "#EAF4EF", borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ width: 8, height: 8, borderRadius: 99, background: "#2D6A4F", marginTop: 4, flexShrink: 0 }} />
                  <p style={{ fontSize: 12, color: "#2D6A4F", lineHeight: 1.5 }}>{s}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Self vs manager */}
          <Card>
            <SectionLabel>Self vs. manager perception</SectionLabel>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 1, background: "#F5F4F0", borderRadius: 10, padding: "12px", textAlign: "center" }}>
                <p style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A" }}>{profile.selfScore}%</p>
                <p style={{ fontSize: 11, color: "#6B6B6B" }}>Self</p>
              </div>
              <div style={{ flex: 1, background: "#F5F4F0", borderRadius: 10, padding: "12px", textAlign: "center" }}>
                <p style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A" }}>{profile.managerScore}%</p>
                <p style={{ fontSize: 11, color: "#6B6B6B" }}>Manager</p>
              </div>
              <div style={{ flex: 1, background: Math.abs(gap) > 15 ? "#FEF3E2" : "#EAF4EF", borderRadius: 10, padding: "12px", textAlign: "center" }}>
                <p style={{ fontSize: 20, fontWeight: 700, color: Math.abs(gap) > 15 ? "#B7791F" : "#2D6A4F" }}>{gap > 0 ? "+" : ""}{gap}</p>
                <p style={{ fontSize: 11, color: "#6B6B6B" }}>Gap</p>
              </div>
            </div>
            {Math.abs(gap) > 15 && (
              <div style={{ background: "#FEF3E2", borderRadius: 10, padding: "10px 12px" }}>
                <p style={{ fontSize: 12, color: "#B7791F", lineHeight: 1.5 }}>
                  Gap exceeds 15 points. Recommend scheduling a check-in to align perceptions.
                </p>
              </div>
            )}
          </Card>

          {/* Recommended actions */}
          <Card style={{ background: "#0A0A0A" }}>
            <SectionLabel>Recommended HR actions</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {profile.status === "red" && (
                <>
                  <div style={{ background: "#1A1A1A", borderRadius: 10, padding: "10px 12px" }}>
                    <p style={{ fontSize: 12, color: "#FFFFFF", lineHeight: 1.5 }}>→ Flag for immediate manager follow-up</p>
                  </div>
                  <div style={{ background: "#1A1A1A", borderRadius: 10, padding: "10px 12px" }}>
                    <p style={{ fontSize: 12, color: "#FFFFFF", lineHeight: 1.5 }}>→ Schedule buddy session within 5 days</p>
                  </div>
                </>
              )}
              {profile.status === "yellow" && (
                <div style={{ background: "#1A1A1A", borderRadius: 10, padding: "10px 12px" }}>
                  <p style={{ fontSize: 12, color: "#FFFFFF", lineHeight: 1.5 }}>→ Prompt manager to run divergence check-in</p>
                </div>
              )}
              {profile.status === "green" && (
                <div style={{ background: "#1A1A1A", borderRadius: 10, padding: "10px 12px" }}>
                  <p style={{ fontSize: 12, color: "#FFFFFF", lineHeight: 1.5 }}>→ No action needed · Continue monitoring monthly</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
```

---

