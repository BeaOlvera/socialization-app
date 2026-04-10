"use client";
import { NavBar, PageShell, Card, SectionLabel, BucketTag } from "@/components/ui";
import { PHASES, DIMENSIONS } from "@/lib/framework";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Task {
  id: string;
  phase: string;
  dimension: string;
  activity: string;
  estimated_time: string | null;
  output: string | null;
  who: string | null;
  subdimension: string | null;
  week: string | null;
  days: string | null;
  done: boolean;
  completed_at: string | null;
  type: string;
  assigned_to: string;
  due_date: string | null;
  format: string | null;
}

type Phase = keyof typeof PHASES;

const DIM_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  fit: { border: "#1A1A2E", bg: "#EEEEF5", text: "#1A1A2E" },
  ace: { border: "#2D6A4F", bg: "#EAF4EF", text: "#2D6A4F" },
  tie: { border: "#9B2335", bg: "#FBEAEC", text: "#9B2335" },
};

export default function ActivitiesPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePhase, setActivePhase] = useState<Phase>("arrival");
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/newcomer/tasks")
      .then(r => r.json())
      .then(data => {
        setTasks(Array.isArray(data) ? data : []);
        // Set active phase to the first phase that has tasks
        if (Array.isArray(data) && data.length > 0) {
          const phases = Object.keys(PHASES) as Phase[];
          const first = phases.find(p => data.some((t: Task) => t.phase === p));
          if (first) setActivePhase(first);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function toggleTask(taskId: string, done: boolean) {
    setToggling(taskId);
    const res = await fetch("/api/newcomer/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, done }),
    });
    if (res.ok) {
      const updated = await res.json();
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, done: updated.done, completed_at: updated.completed_at } : t));
    }
    setToggling(null);
  }

  const phaseTasks = tasks.filter(t => t.phase === activePhase);
  const dimensions = ["fit", "ace", "tie"] as const;

  // Phase progress
  const phaseProgress = (phase: string) => {
    const pt = tasks.filter(t => t.phase === phase);
    if (pt.length === 0) return 0;
    return Math.round((pt.filter(t => t.done).length / pt.length) * 100);
  };

  if (loading) {
    return (
      <PageShell nav={<NavBar role="newcomer" active="Activities" />}>
        <div style={{ textAlign: "center", padding: 60, color: "#6B6B6B" }}>Loading activities...</div>
      </PageShell>
    );
  }

  if (tasks.length === 0) {
    return (
      <PageShell nav={<NavBar role="newcomer" active="Activities" />}>
        <div style={{ textAlign: "center", padding: 60 }}>
          <p style={{ fontSize: 16, color: "#6B6B6B", marginBottom: 8 }}>No activities assigned yet.</p>
          <p style={{ fontSize: 13, color: "#AEABA3" }}>Your HR admin will assign your onboarding activities soon.</p>
        </div>
      </PageShell>
    );
  }

  const totalDone = tasks.filter(t => t.done).length;
  const totalAll = tasks.length;

  return (
    <PageShell nav={<NavBar role="newcomer" active="Activities" />}>
      {/* Header */}
      <Card style={{ background: "#ECECEA", border: "1px solid #DDDBD5" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 10, color: "#AEABA3", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
              Activity Calendar
            </p>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A", marginBottom: 4 }}>Your onboarding activities</h2>
            <p style={{ fontSize: 13, color: "#6B6B6B" }}>{totalDone} of {totalAll} completed</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#0A0A0A" }}>{Math.round((totalDone / totalAll) * 100)}%</div>
            <p style={{ fontSize: 10, color: "#AEABA3" }}>Overall</p>
          </div>
        </div>
        <div style={{ marginTop: 16, height: 6, background: "#C8C6C0", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", background: "#0A0A0A", borderRadius: 99, width: `${(totalDone / totalAll) * 100}%`, transition: "width 0.4s ease" }} />
        </div>
      </Card>

      {/* Phase tabs */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {(Object.keys(PHASES) as Phase[]).map(p => {
          const hasActivities = tasks.some(t => t.phase === p);
          if (!hasActivities) return null;
          const progress = phaseProgress(p);
          return (
            <button
              key={p}
              onClick={() => setActivePhase(p)}
              style={{
                padding: "8px 16px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                border: activePhase === p ? "2px solid #0A0A0A" : "1px solid #E2E0DA",
                background: activePhase === p ? "#0A0A0A" : "#FFFFFF",
                color: activePhase === p ? "#FFFFFF" : "#6B6B6B",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {PHASES[p].label}
              <span style={{ marginLeft: 8, fontSize: 11, opacity: 0.7 }}>{progress}%</span>
            </button>
          );
        })}
      </div>

      {/* Phase info */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0A0A0A" }}>{PHASES[activePhase].label}</h3>
          <p style={{ fontSize: 13, color: "#6B6B6B" }}>{PHASES[activePhase].period} — {PHASES[activePhase].description}</p>
        </div>
        <span style={{ fontSize: 12, color: "#AEABA3" }}>
          {phaseTasks.filter(t => t.done).length}/{phaseTasks.length} done
        </span>
      </div>

      {/* Check-ins first (prominent) */}
      {(() => {
        const checkinTasks = phaseTasks.filter(t => (t.type || "activity") === "checkin");
        if (checkinTasks.length === 0) return null;
        return (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#FEF3E2", color: "#B7791F" }}>Check-ins</span>
              <SectionLabel>Scheduled touchpoints</SectionLabel>
              <span style={{ fontSize: 11, color: "#AEABA3", marginBottom: 12 }}>
                {checkinTasks.filter(t => t.done).length}/{checkinTasks.length}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {checkinTasks.map(task => {
                const colors = DIM_COLORS[task.dimension] || DIM_COLORS.fit;
                return (
                  <Card key={task.id} style={{
                    borderLeft: "4px solid #B7791F",
                    background: task.done ? "#F5F4F0" : "#FFFCF5",
                    opacity: task.done ? 0.6 : 1,
                  }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <button
                        onClick={() => toggleTask(task.id, !task.done)}
                        disabled={toggling === task.id}
                        style={{
                          width: 22, height: 22, borderRadius: 6,
                          border: task.done ? "none" : "2px solid #B7791F",
                          background: task.done ? "#B7791F" : "transparent",
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, marginTop: 2,
                        }}
                      >
                        {task.done && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <p onClick={() => { if (!task.done) router.push(`/newcomer/checkin/${task.id}`); }}
                            style={{
                              fontSize: 15, fontWeight: 700, color: "#0A0A0A",
                              textDecoration: task.done ? "line-through" : "none",
                              cursor: !task.done ? "pointer" : "default",
                            }}>
                            {task.activity}
                          </p>
                          {!task.done && (
                            <button onClick={() => router.push(`/newcomer/checkin/${task.id}`)}
                              style={{
                                fontSize: 11, fontWeight: 600, padding: "4px 14px", borderRadius: 8,
                                background: "#B7791F", color: "#FFF", border: "none", cursor: "pointer",
                                flexShrink: 0, marginLeft: "auto",
                              }}>
                              Open
                            </button>
                          )}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 12, color: "#6B6B6B" }}>
                          {task.estimated_time && <span><span style={{ color: "#AEABA3" }}>Time:</span> {task.estimated_time}</span>}
                          {task.who && <span><span style={{ color: "#AEABA3" }}>With:</span> {task.who}</span>}
                          {task.due_date && <span><span style={{ color: "#AEABA3" }}>Due:</span> {task.due_date}</span>}
                        </div>
                        {task.output && (
                          <div style={{ marginTop: 8, padding: "8px 12px", background: "#FEF3E2", borderRadius: 8, fontSize: 12, color: "#B7791F" }}>
                            <span style={{ fontWeight: 600 }}>Output:</span> {task.output}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Activities by dimension */}
      {dimensions.map(dim => {
        const dimTasks = phaseTasks.filter(t => t.dimension === dim && (t.type || "activity") !== "checkin");
        if (dimTasks.length === 0) return null;
        const dimInfo = DIMENSIONS[dim];
        const colors = DIM_COLORS[dim];
        const done = dimTasks.filter(t => t.done).length;

        return (
          <div key={dim}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <BucketTag bucket={dim} />
              <SectionLabel>{dimInfo.name}</SectionLabel>
              <span style={{ fontSize: 11, color: "#AEABA3", marginBottom: 12 }}>{done}/{dimTasks.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {dimTasks.map(task => (
                <Card
                  key={task.id}
                  style={{
                    borderLeft: `4px solid ${colors.border}`,
                    opacity: task.done ? 0.6 : 1,
                    transition: "opacity 0.2s",
                  }}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTask(task.id, !task.done)}
                      disabled={toggling === task.id}
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        border: task.done ? "none" : `2px solid ${colors.border}`,
                        background: task.done ? colors.border : "transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 2,
                        transition: "all 0.15s",
                      }}
                    >
                      {task.done && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <p
                          onClick={() => {
                            if ((task.type || "activity") === "checkin" && !task.done) {
                              router.push(`/newcomer/checkin/${task.id}`);
                            }
                          }}
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#0A0A0A",
                            textDecoration: task.done ? "line-through" : "none",
                            cursor: (task.type || "activity") === "checkin" && !task.done ? "pointer" : "default",
                          }}
                        >
                          {task.activity}
                        </p>
                        {(task.type || "activity") === "checkin" && (
                          <span style={{
                            fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                            background: "#FEF3E2", color: "#B7791F", flexShrink: 0,
                          }}>
                            Check-in
                          </span>
                        )}
                        {(task.type || "activity") === "checkin" && !task.done && (
                          <button
                            onClick={() => router.push(`/newcomer/checkin/${task.id}`)}
                            style={{
                              fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 6,
                              background: "#0A0A0A", color: "#FFF", border: "none", cursor: "pointer",
                              flexShrink: 0, marginLeft: "auto",
                            }}
                          >
                            Open
                          </button>
                        )}
                      </div>

                      {/* Meta row */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 12, color: "#6B6B6B" }}>
                        {task.estimated_time && (
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ color: "#AEABA3" }}>Time:</span> {task.estimated_time}
                          </span>
                        )}
                        {task.who && (
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ color: "#AEABA3" }}>With:</span> {task.who}
                          </span>
                        )}
                        {task.due_date && (
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ color: "#AEABA3" }}>Due:</span> {task.due_date}
                          </span>
                        )}
                        {task.days && !task.due_date && (
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ color: "#AEABA3" }}>When:</span> {task.days}
                          </span>
                        )}
                      </div>

                      {/* Output */}
                      {task.output && (
                        <div style={{
                          marginTop: 8,
                          padding: "8px 12px",
                          background: colors.bg,
                          borderRadius: 8,
                          fontSize: 12,
                          color: colors.text,
                        }}>
                          <span style={{ fontWeight: 600 }}>Output:</span> {task.output}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </PageShell>
  );
}
