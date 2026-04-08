"use client";
import { NavBar, PageShell, Card, SectionLabel, TwoCol } from "@/components/ui";
import { DIMENSIONS, PHASES } from "@/lib/framework";
import { useEffect, useState } from "react";
import Link from "next/link";

type Dim = keyof typeof DIMENSIONS;
type Phase = keyof typeof PHASES;

interface Task {
  id: string;
  phase: string;
  dimension: string;
  done: boolean;
  type: string;
}

export default function ProgressPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/newcomer/tasks")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setTasks(data); })
      .finally(() => setLoading(false));
  }, []);

  const dims: Dim[] = ["fit", "ace", "tie"];
  const phases = Object.keys(PHASES) as Phase[];

  // Calculate scores per dimension
  function dimScore(dim: string) {
    const dt = tasks.filter(t => t.dimension === dim);
    if (dt.length === 0) return 0;
    return Math.round((dt.filter(t => t.done).length / dt.length) * 100);
  }

  // Calculate phase progress
  function phaseScore(phase: string) {
    const pt = tasks.filter(t => t.phase === phase);
    if (pt.length === 0) return 0;
    return Math.round((pt.filter(t => t.done).length / pt.length) * 100);
  }

  // Overall
  const overall = tasks.length > 0 ? Math.round((tasks.filter(t => t.done).length / tasks.length) * 100) : 0;

  // Activity vs check-in breakdown
  const activities = tasks.filter(t => (t.type || "activity") === "activity");
  const checkins = tasks.filter(t => t.type === "checkin");
  const activitiesDone = activities.filter(t => t.done).length;
  const checkinsDone = checkins.filter(t => t.done).length;

  if (loading) {
    return (
      <PageShell nav={<NavBar role="newcomer" active="Progress" />}>
        <div style={{ textAlign: "center", padding: 60, color: "#6B6B6B" }}>Loading...</div>
      </PageShell>
    );
  }

  const left = <>
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A", marginBottom: 4 }}>Progress Overview</h2>
      <p style={{ fontSize: 13, color: "#6B6B6B" }}>Your onboarding journey — real-time completion data</p>
    </div>

    {/* Overall progress */}
    <Card style={{ background: "#ECECEA", border: "1px solid #DDDBD5" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: 10, color: "#AEABA3", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Overall completion</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: "#0A0A0A" }}>{overall}%</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 13, color: "#6B6B6B" }}>{tasks.filter(t => t.done).length} / {tasks.length}</p>
          <p style={{ fontSize: 11, color: "#AEABA3" }}>tasks completed</p>
        </div>
      </div>
      <div style={{ height: 8, background: "#C8C6C0", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", background: "#0A0A0A", borderRadius: 99, width: `${overall}%`, transition: "width 0.5s" }} />
      </div>
    </Card>

    {/* Dimension breakdown */}
    <Card>
      <SectionLabel>Progress by dimension</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {dims.map(dim => {
          const info = DIMENSIONS[dim];
          const score = dimScore(dim);
          const dt = tasks.filter(t => t.dimension === dim);
          const done = dt.filter(t => t.done).length;
          return (
            <div key={dim}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: info.color }}>{info.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "#AEABA3" }}>{done}/{dt.length}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: info.color }}>{score}%</span>
                </div>
              </div>
              <div style={{ height: 8, background: "#F5F4F0", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", background: info.color, borderRadius: 99, width: `${score}%`, transition: "width 0.5s" }} />
              </div>
              {/* Per-phase mini bars */}
              <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                {phases.map(phase => {
                  const pt = tasks.filter(t => t.phase === phase && t.dimension === dim);
                  if (pt.length === 0) return null;
                  const pp = Math.round((pt.filter(t => t.done).length / pt.length) * 100);
                  return (
                    <div key={phase} style={{ flex: 1 }} title={`${PHASES[phase].label}: ${pp}%`}>
                      <div style={{ height: 3, background: "#E2E0DA", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", background: info.color, borderRadius: 99, width: `${pp}%`, opacity: 0.6 }} />
                      </div>
                      <p style={{ fontSize: 7, color: "#AEABA3", marginTop: 2, textAlign: "center" }}>{PHASES[phase].label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  </>;

  const right = <>
    {/* Phase breakdown */}
    <Card>
      <SectionLabel>Progress by phase</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {phases.map(phase => {
          const pt = tasks.filter(t => t.phase === phase);
          if (pt.length === 0) return null;
          const score = phaseScore(phase);
          const done = pt.filter(t => t.done).length;
          return (
            <div key={phase}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A" }}>{PHASES[phase].label}</span>
                  <span style={{ fontSize: 11, color: "#AEABA3", marginLeft: 8 }}>{PHASES[phase].period}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A" }}>{score}%</span>
              </div>
              <div style={{ height: 6, background: "#F5F4F0", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", background: "#0A0A0A", borderRadius: 99, width: `${score}%`, transition: "width 0.5s" }} />
              </div>
              <p style={{ fontSize: 10, color: "#AEABA3", marginTop: 2 }}>{done}/{pt.length} tasks</p>
            </div>
          );
        })}
      </div>
    </Card>

    {/* Activities vs check-ins */}
    {checkins.length > 0 && (
      <Card>
        <SectionLabel>Activities vs Check-ins</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ background: "#EEEEF5", borderRadius: 10, padding: 14, textAlign: "center" }}>
            <p style={{ fontSize: 24, fontWeight: 700, color: "#1A1A2E" }}>{activitiesDone}/{activities.length}</p>
            <p style={{ fontSize: 11, color: "#6B6B6B", marginTop: 4 }}>Activities</p>
          </div>
          <div style={{ background: "#FEF3E2", borderRadius: 10, padding: 14, textAlign: "center" }}>
            <p style={{ fontSize: 24, fontWeight: 700, color: "#B7791F" }}>{checkinsDone}/{checkins.length}</p>
            <p style={{ fontSize: 11, color: "#6B6B6B", marginTop: 4 }}>Check-ins</p>
          </div>
        </div>
      </Card>
    )}

    {/* Insight */}
    <Card style={{ background: "#ECECEA", border: "1px solid #DDDBD5" }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#AEABA3", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Insight</p>
      {(() => {
        const scores = dims.map(d => ({ dim: d, score: dimScore(d), info: DIMENSIONS[d] }));
        const best = scores.reduce((a, b) => a.score > b.score ? a : b);
        const worst = scores.reduce((a, b) => a.score < b.score ? a : b);
        if (best.dim === worst.dim) {
          return <p style={{ fontSize: 14, color: "#0A0A0A", lineHeight: 1.7 }}>All dimensions are progressing evenly. Keep up the momentum!</p>;
        }
        return (
          <p style={{ fontSize: 14, color: "#0A0A0A", lineHeight: 1.7 }}>
            Your <strong>{best.info.name}</strong> is progressing fastest ({best.score}%).
            Focus energy on <strong>{worst.info.name}</strong> ({worst.score}%) — {worst.dim === "tie"
              ? "social integration at this stage has a strong long-term effect on overall adjustment."
              : worst.dim === "ace"
              ? "building task mastery early gives you confidence for everything else."
              : "role clarity is the foundation — everything else builds on it."}
          </p>
        );
      })()}
    </Card>

    <div style={{ textAlign: "center" }}>
      <Link href="/newcomer/activities" style={{
        fontSize: 13, fontWeight: 600, color: "#1A1A2E", textDecoration: "none",
        padding: "8px 20px", borderRadius: 10, background: "#EEEEF5", display: "inline-block",
      }}>
        View all activities →
      </Link>
    </div>
  </>;

  return (
    <PageShell nav={<NavBar role="newcomer" active="Progress" />}>
      <TwoCol left={left} right={right} />
    </PageShell>
  );
}
