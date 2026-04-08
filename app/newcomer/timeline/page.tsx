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
      fit: [
        { label: "Review job description & reporting line", done: true },
        { label: "Explore org chart and team structure", done: true },
        { label: "Understand first-quarter KPIs with manager", done: false },
        { label: "Map key stakeholders (RACI)", done: false },
      ],
      ace: [
        { label: "Complete tool onboarding (Slack, HubSpot, Asana)", done: true },
        { label: "Start 30-60-90 day training plan", done: false },
        { label: "Locate SOPs & playbooks in Notion", done: true },
        { label: "Understand performance review timeline", done: true },
      ],
      tie: [
        { label: "Meet buddy James", done: true },
        { label: "Attend first team stand-up and All-Hands", done: true },
        { label: "Read company values guide", done: true },
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
    description: "Deepen understanding, take ownership, deliver first results.",
    buckets: {
      fit: [
        { label: "Align priorities with strategic plan", done: false },
        { label: "Clarify RACI for cross-functional projects", done: false },
        { label: "Present 90-day marketing calendar", done: false },
        { label: "Get first KPI review from manager", done: false },
      ],
      ace: [
        { label: "Lead first campaign brief end-to-end", done: false },
        { label: "Complete all mandatory training modules", done: false },
        { label: "Execute one process using documented SOP", done: false },
        { label: "Identify top skill gap and start closing it", done: false },
      ],
      tie: [
        { label: "Build working relationship with Product & Sales", done: false },
        { label: "Attend quarterly off-site", done: false },
        { label: "Join one employee community or ERG", done: false },
        { label: "Complete 60-day pulse survey", done: false },
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
      fit: [
        { label: "Own Q3 marketing roadmap priorities", done: false },
        { label: "Identify one boundary/RACI improvement", done: false },
        { label: "Connect work to annual strategic goals", done: false },
        { label: "Update job scope with manager if needed", done: false },
      ],
      ace: [
        { label: "Deliver measurable campaign results", done: false },
        { label: "Master all core tools independently", done: false },
        { label: "Propose one process improvement", done: false },
        { label: "Complete mid-year performance self-assessment", done: false },
      ],
      tie: [
        { label: "Have a network beyond immediate team", done: false },
        { label: "Participate in informal social rituals regularly", done: false },
        { label: "Demonstrate values alignment in daily work", done: false },
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
      fit: [
        { label: "Be the go-to expert for your domain", done: false },
        { label: "Lead cross-functional initiatives with clarity", done: false },
        { label: "Contribute to team strategic planning", done: false },
        { label: "Define your development path forward", done: false },
      ],
      ace: [
        { label: "Consistently high-quality deliverables", done: false },
        { label: "Mentor a newer team member on tools/processes", done: false },
        { label: "Complete required certifications", done: false },
        { label: "Get strong performance appraisal feedback", done: false },
      ],
      tie: [
        { label: "Have trusted allies across departments", done: false },
        { label: "Give and receive honest peer feedback", done: false },
        { label: "Support new newcomers (pay it forward)", done: false },
        { label: "Strong sense of identity within the org", done: false },
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
      fit: [
        { label: "Strategic contributor, not just executor", done: false },
        { label: "Define next year's goals with manager", done: false },
        { label: "Recognized for unique value you bring", done: false },
        { label: "Complete 12-month role reflection", done: false },
      ],
      ace: [
        { label: "Full mastery of role's technical demands", done: false },
        { label: "Shape SOPs and processes for the team", done: false },
        { label: "Skills matrix shows no critical gaps", done: false },
        { label: "Exceed performance appraisal expectations", done: false },
      ],
      tie: [
        { label: "Rich network of genuine relationships", done: false },
        { label: "Trusted across the organization", done: false },
        { label: "Part of informal and formal communities", done: false },
        { label: "Fully socially embedded", done: false },
      ],
    },
  },
];

const bucketConfig = {
  fit: { label: "FIT · Role Clarity",       color: "#1A1A2E", bg: "#EEEEF5", num: "01" },
  ace: { label: "ACE · Task Mastery",        color: "#2D6A4F", bg: "#EAF4EF", num: "02" },
  tie: { label: "TIE · Social Acceptance",   color: "#9B2335", bg: "#FBEAEC", num: "03" },
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

      {/* Overall dimension progress bars */}
      <Card>
        <SectionLabel>Overall progress by dimension</SectionLabel>
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

        {/* Three dimension columns — interactive */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {(Object.entries(currentPhase.buckets) as [BucketKey, typeof currentPhase.buckets.fit][]).map(([key, items]) => {
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
                  {items.map((item: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => toggle(currentPhase.id, key, i)}
                      style={{
                        display: "flex", alignItems: "flex-start", gap: 8,
                        background: item.done ? "transparent" : "#FFFFFF",
                        border: "none", cursor: "pointer", borderRadius: 8,
                        padding: "6px 8px", textAlign: "left", width: "100%",
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
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{
                          fontSize: 11, color: item.done ? "#AEABA3" : "#0A0A0A",
                          textDecoration: item.done ? "line-through" : "none",
                          lineHeight: 1.4, display: "block",
                        }}>
                          {item.label}
                        </span>
                        {(item.estimated_time || item.output) && !item.done && (
                          <div style={{ display: "flex", gap: 6, marginTop: 3, flexWrap: "wrap" }}>
                            {item.estimated_time && (
                              <span style={{ fontSize: 8, color: "#AEABA3", background: "#F5F4F0", padding: "1px 5px", borderRadius: 4 }}>
                                {item.estimated_time}
                              </span>
                            )}
                            {item.output && (
                              <span style={{ fontSize: 8, color: "#6B6B6B", lineHeight: 1.3 }}>
                                → {item.output}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
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
