"use client";
import { useState, useEffect } from "react";
import { NavBar, PageShell, Card, SectionLabel, BucketTag } from "@/components/ui";
import { PHASES, DIMENSIONS } from "@/lib/framework";
import Link from "next/link";

type Phase = keyof typeof PHASES;
type Dim = keyof typeof DIMENSIONS;

interface Task {
  id: string;
  phase: string;
  dimension: string;
  label: string;
  activity: string;
  estimated_time: string | null;
  output: string | null;
  done: boolean;
}

const bucketConfig = {
  fit: { label: "FIT · Role Clarity", color: "#1A1A2E", bg: "#EEEEF5", num: "01" },
  ace: { label: "ACE · Task Mastery", color: "#2D6A4F", bg: "#EAF4EF", num: "02" },
  tie: { label: "TIE · Social Acceptance", color: "#9B2335", bg: "#FBEAEC", num: "03" },
};

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  active: { bg: "#0A0A0A", color: "#FFFFFF", label: "In progress" },
  upcoming: { bg: "#F5F4F0", color: "#0A0A0A", label: "Up next" },
  future: { bg: "#F5F4F0", color: "#AEABA3", label: "Ahead" },
};

export default function TimelinePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePhase, setActivePhase] = useState<Phase>("arrival");

  useEffect(() => {
    fetch("/api/newcomer/tasks")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTasks(data);
          const phases = Object.keys(PHASES) as Phase[];
          const first = phases.find(p => data.some((t: Task) => t.phase === p));
          if (first) setActivePhase(first);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Determine phase status based on completion
  function phaseStatus(phase: Phase): string {
    const pt = tasks.filter(t => t.phase === phase);
    if (pt.length === 0) return "future";
    const done = pt.filter(t => t.done).length;
    if (done === pt.length) return "completed";
    if (done > 0) return "active";
    // Check if any earlier phase is still active
    const phases = Object.keys(PHASES) as Phase[];
    const idx = phases.indexOf(phase);
    for (let i = 0; i < idx; i++) {
      const earlier = tasks.filter(t => t.phase === phases[i]);
      if (earlier.length > 0 && earlier.some(t => !t.done)) return "upcoming";
    }
    if (idx === 0) return "active";
    return "upcoming";
  }

  function phasePct(phase: string): number {
    const pt = tasks.filter(t => t.phase === phase);
    if (pt.length === 0) return 0;
    return Math.round((pt.filter(t => t.done).length / pt.length) * 100);
  }

  // Calculate day based on start_date (approximation: day 18 for demo)
  const today = { day: 18, total: 365 };
  const overallPct = tasks.length > 0
    ? Math.round((tasks.filter(t => t.done).length / tasks.length) * 100)
    : 0;

  const phasesWithTasks = (Object.keys(PHASES) as Phase[]).filter(
    p => tasks.some(t => t.phase === p)
  );
  const currentPhaseTasks = tasks.filter(t => t.phase === activePhase);
  const dims: Dim[] = ["fit", "ace", "tie"];

  if (loading) {
    return (
      <PageShell nav={<NavBar role="newcomer" active="Timeline" />}>
        <div style={{ textAlign: "center", padding: 60, color: "#6B6B6B" }}>Loading timeline...</div>
      </PageShell>
    );
  }

  if (tasks.length === 0) {
    return (
      <PageShell nav={<NavBar role="newcomer" active="Timeline" />}>
        <div style={{ textAlign: "center", padding: 60 }}>
          <p style={{ fontSize: 16, color: "#6B6B6B" }}>No activities assigned yet.</p>
          <p style={{ fontSize: 13, color: "#AEABA3" }}>Your HR admin will assign your onboarding activities soon.</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell nav={<NavBar role="newcomer" active="Timeline" />}>

      {/* Header */}
      <Card style={{ background: "#ECECEA", border: "1px solid #DDDBD5" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#AEABA3", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Your 12-month journey</p>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A" }}>Day {today.day} of 365</h2>
            <p style={{ fontSize: 13, color: "#6B6B6B", marginTop: 2 }}>Currently in <strong>{PHASES[activePhase].label} phase</strong> · {PHASES[activePhase].period}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 28, fontWeight: 700, color: "#0A0A0A" }}>{overallPct}%</p>
            <p style={{ fontSize: 11, color: "#AEABA3" }}>of journey complete</p>
          </div>
        </div>

        {/* Phase ribbon */}
        <div style={{ display: "flex", gap: 6 }}>
          {phasesWithTasks.map(p => {
            const isActive = p === activePhase;
            const pp = phasePct(p);
            const status = phaseStatus(p);
            return (
              <button
                key={p}
                onClick={() => setActivePhase(p)}
                style={{ flex: 1, background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}
              >
                <div style={{
                  height: 10, borderRadius: 99, overflow: "hidden",
                  background: status === "future" ? "#EBEBEB" : "#DDDBD5",
                  border: isActive ? "2px solid #0A0A0A" : "2px solid transparent",
                  transition: "border 0.15s",
                }}>
                  <div style={{
                    height: "100%", borderRadius: 99,
                    background: status === "active" || status === "completed" ? "#0A0A0A" : status === "upcoming" ? "#6B6B6B" : "#DDDBD5",
                    width: `${pp}%`, transition: "width 0.4s ease",
                  }} />
                </div>
                <p style={{ fontSize: 9, marginTop: 4, fontWeight: isActive ? 700 : 400, color: isActive ? "#0A0A0A" : "#AEABA3" }}>
                  {PHASES[p].label}
                </p>
                <p style={{ fontSize: 9, color: "#AEABA3" }}>{pp}%</p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Overall dimension progress */}
      <Card>
        <SectionLabel>Overall progress by dimension</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {dims.map(dim => {
            const bc = bucketConfig[dim];
            const dimTasks = tasks.filter(t => t.dimension === dim);
            const done = dimTasks.filter(t => t.done).length;
            const total = dimTasks.length;
            const p = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <div key={dim}>
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
      <Card style={{ border: phaseStatus(activePhase) === "active" ? "2px solid #0A0A0A" : "1px solid #E2E0DA" }}>
        {/* Phase tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 18, overflowX: "auto" }}>
          {phasesWithTasks.map(p => (
            <button
              key={p}
              onClick={() => setActivePhase(p)}
              style={{
                padding: "6px 14px", borderRadius: 99, border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
                background: p === activePhase ? "#0A0A0A" : "#F5F4F0",
                color: p === activePhase ? "#FFFFFF" : "#6B6B6B",
                transition: "all 0.15s",
              }}
            >
              {PHASES[p].label}
            </button>
          ))}
        </div>

        {/* Phase header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0A0A0A" }}>{PHASES[activePhase].label}</h3>
              {(() => {
                const s = phaseStatus(activePhase);
                const cfg = statusConfig[s] || statusConfig.future;
                return (
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: cfg.bg, color: cfg.color }}>
                    {cfg.label}
                  </span>
                );
              })()}
            </div>
            <p style={{ fontSize: 12, color: "#6B6B6B" }}>{PHASES[activePhase].period}</p>
            <p style={{ fontSize: 12, color: "#AEABA3", fontStyle: "italic", marginTop: 3 }}>{PHASES[activePhase].description}</p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <p style={{ fontSize: 24, fontWeight: 700, color: "#0A0A0A" }}>{phasePct(activePhase)}%</p>
            <p style={{ fontSize: 10, color: "#AEABA3" }}>
              {currentPhaseTasks.filter(t => t.done).length}/{currentPhaseTasks.length} done
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 6, background: "#F5F4F0", borderRadius: 99, marginBottom: 18, overflow: "hidden" }}>
          <div style={{ height: "100%", background: "#0A0A0A", borderRadius: 99, width: `${phasePct(activePhase)}%`, transition: "width 0.5s" }} />
        </div>

        {/* Three dimension columns — read-only overview */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {dims.map(dim => {
            const bc = bucketConfig[dim];
            const dimTasks = currentPhaseTasks.filter(t => t.dimension === dim);
            const done = dimTasks.filter(t => t.done).length;
            const dimPct = dimTasks.length > 0 ? Math.round((done / dimTasks.length) * 100) : 0;
            return (
              <div key={dim} style={{ background: "#F5F4F0", borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, background: bc.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 8, fontWeight: 800, color: bc.color }}>{bc.num}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#0A0A0A" }}>{bc.label}</span>
                  <span style={{ fontSize: 10, color: "#AEABA3", marginLeft: "auto" }}>{done}/{dimTasks.length}</span>
                </div>
                <div style={{ height: 4, background: "#E2E0DA", borderRadius: 99, marginBottom: 10, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: bc.color, borderRadius: 99, width: `${dimPct}%`, transition: "width 0.4s" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {dimTasks.map(task => (
                    <div
                      key={task.id}
                      style={{
                        display: "flex", alignItems: "flex-start", gap: 8,
                        background: task.done ? "transparent" : "#FFFFFF",
                        borderRadius: 8, padding: "6px 8px",
                      }}
                    >
                      <div style={{
                        width: 16, height: 16, borderRadius: 4, flexShrink: 0, marginTop: 1,
                        background: task.done ? bc.color : "transparent",
                        border: task.done ? `2px solid ${bc.color}` : "2px solid #DDDBD5",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {task.done && <span style={{ fontSize: 9, color: "#FFFFFF", fontWeight: 700 }}>&#10003;</span>}
                      </div>
                      <span style={{
                        fontSize: 11, color: task.done ? "#AEABA3" : "#0A0A0A",
                        textDecoration: task.done ? "line-through" : "none",
                        lineHeight: 1.4,
                      }}>
                        {task.activity || task.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Link to Activities */}
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <Link href="/newcomer/activities" style={{
            fontSize: 13, fontWeight: 600, color: "#1A1A2E", textDecoration: "none",
            padding: "8px 20px", borderRadius: 10, background: "#EEEEF5",
            display: "inline-block",
          }}>
            View full activity details →
          </Link>
        </div>
      </Card>

    </PageShell>
  );
}
