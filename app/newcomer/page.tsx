"use client";
import { NavBar, PageShell, Card, ScoreRing, SectionLabel, BucketTag, TwoCol } from "@/components/ui";
import { DIMENSIONS } from "@/lib/framework";
import { useEffect, useState } from "react";
import Link from "next/link";

type Dim = keyof typeof DIMENSIONS;

interface Task {
  id: string;
  phase: string;
  dimension: string;
  activity: string;
  done: boolean;
  estimated_time: string | null;
  type: string;
  output: string | null;
  who: string | null;
  days: string | null;
}

export default function NewcomerHome() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/newcomer/tasks")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setTasks(data); })
      .finally(() => setLoading(false));
  }, []);

  // Check if there are undone pre-arrival tasks (phase=arrival tasks that came from pre_arrival templates)
  const preArrivalTasks = tasks.filter(t =>
    t.phase === "arrival" && (
      (t.type || "activity") === "checkin" && t.days && t.days.includes("before")
      || t.activity?.toLowerCase().includes("pre-arrival")
      || t.days?.includes("before")
    )
  );
  const preArrivalDone = preArrivalTasks.every(t => t.done);
  const inPreArrival = preArrivalTasks.length > 0 && !preArrivalDone;

  // If in pre-arrival, show focused pre-arrival page
  if (!loading && inPreArrival) {
    return <PreArrivalHome tasks={preArrivalTasks} allTasks={tasks} />;
  }

  // Otherwise show the regular dashboard
  return <RegularHome tasks={tasks} loading={loading} />;
}

// ─── PRE-ARRIVAL HOME ──────────────────────────────────────
function PreArrivalHome({ tasks: rawTasks, allTasks }: { tasks: Task[]; allTasks: Task[] }) {
  // Sort: interview first, then check-ins, then activities
  const tasks = [...rawTasks].sort((a, b) => {
    const aIsInterview = a.activity?.toLowerCase().includes("interview") ? 0 : 1;
    const bIsInterview = b.activity?.toLowerCase().includes("interview") ? 0 : 1;
    if (aIsInterview !== bIsInterview) return aIsInterview - bIsInterview;
    const aIsCheckin = (a.type || "activity") === "checkin" ? 0 : 1;
    const bIsCheckin = (b.type || "activity") === "checkin" ? 0 : 1;
    return aIsCheckin - bIsCheckin;
  });
  const done = tasks.filter(t => t.done).length;
  const total = tasks.length;

  return (
    <PageShell nav={<NavBar role="newcomer" active="Home" />}>
      {/* Dark header */}
      <Card style={{ background: "#ECECEA", border: "1px solid #DDDBD5" }}>
        <p style={{ fontSize: 10, color: "#AEABA3", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
          Before your first day
        </p>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0A0A0A", marginBottom: 6 }}>
          Welcome! Let's get you ready.
        </h2>
        <p style={{ fontSize: 14, color: "#6B6B6B", lineHeight: 1.7 }}>
          Complete these steps before you start. They help us understand your expectations
          and set you up for a great first day.
        </p>
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 8, background: "#DDDBD5", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", background: "#0A0A0A", borderRadius: 99, width: `${(done / total) * 100}%`, transition: "width 0.5s" }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A" }}>{done}/{total}</span>
        </div>
      </Card>

      {/* Pre-arrival tasks */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {tasks.map(task => {
          const isCheckin = (task.type || "activity") === "checkin";
          const isInterview = task.activity?.toLowerCase().includes("interview");
          return (
            <Link
              key={task.id}
              href={isCheckin ? `/newcomer/checkin/${task.id}` : "/newcomer/activities"}
              style={{ textDecoration: "none" }}
            >
              <Card
                className="hover:border-[#1A1A2E] transition-colors cursor-pointer"
                style={{
                  borderLeft: `4px solid ${isInterview ? "#1A1A2E" : "#B7791F"}`,
                  background: task.done ? "#F5F4F0" : "#FFFFFF",
                  opacity: task.done ? 0.5 : 1,
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 6, flexShrink: 0, marginTop: 2,
                    background: task.done ? "#1A1A2E" : "transparent",
                    border: task.done ? "none" : "2px solid #1A1A2E",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {task.done && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: 16, fontWeight: 700, color: "#0A0A0A",
                      textDecoration: task.done ? "line-through" : "none",
                      marginBottom: 4,
                    }}>
                      {task.activity}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, fontSize: 12, color: "#6B6B6B" }}>
                      {isCheckin && (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 20, background: isInterview ? "#EEEEF5" : "#FEF3E2", color: isInterview ? "#1A1A2E" : "#B7791F" }}>
                          {isInterview ? "Interview" : "Check-in"}
                        </span>
                      )}
                      {task.estimated_time && <span>{task.estimated_time}</span>}
                      {task.who && <span>{task.who}</span>}
                    </div>
                    {task.output && (
                      <p style={{ fontSize: 12, color: "#AEABA3", marginTop: 6 }}>
                        {task.output}
                      </p>
                    )}
                  </div>
                  {!task.done && (
                    <span style={{
                      fontSize: 12, fontWeight: 700, padding: "6px 16px", borderRadius: 8,
                      background: "#1A1A2E", color: "#FFFFFF", flexShrink: 0, alignSelf: "center",
                    }}>
                      {(task.type || "activity") === "checkin" ? "Start" : "View"}
                    </span>
                  )}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* What's coming next teaser */}
      <Card style={{ background: "#F5F4F0", border: "1px solid #E2E0DA" }}>
        <p style={{ fontSize: 10, color: "#AEABA3", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
          After you complete these
        </p>
        <p style={{ fontSize: 14, color: "#6B6B6B", lineHeight: 1.7 }}>
          Your full onboarding journey begins with {allTasks.length} activities and check-ins across 12 months,
          organized around three dimensions: <strong>Role Clarity</strong>, <strong>Task Mastery</strong>, and <strong>Social Acceptance</strong>.
        </p>
      </Card>
    </PageShell>
  );
}

// ─── REGULAR HOME (post pre-arrival) ───────────────────────
function RegularHome({ tasks, loading }: { tasks: Task[]; loading: boolean }) {
  const totalDone = tasks.filter(t => t.done).length;
  const overall = tasks.length > 0 ? Math.round((totalDone / tasks.length) * 100) : 0;

  const phaseOrder = ["arrival", "integration", "adjustment", "stabilization", "embedding"];
  const undone = tasks.filter(t => !t.done).sort((a, b) => {
    const aIsCheckin = (a.type || "activity") === "checkin" ? 0 : 1;
    const bIsCheckin = (b.type || "activity") === "checkin" ? 0 : 1;
    if (aIsCheckin !== bIsCheckin) return aIsCheckin - bIsCheckin;
    return phaseOrder.indexOf(a.phase) - phaseOrder.indexOf(b.phase);
  });
  const nextActivities = undone.slice(0, 4);

  const dims: Dim[] = ["fit", "ace", "tie"];
  const dimScores = dims.map(dim => {
    const dt = tasks.filter(t => t.dimension === dim);
    const done = dt.filter(t => t.done).length;
    return {
      dim,
      info: DIMENSIONS[dim],
      score: dt.length > 0 ? Math.round((done / dt.length) * 100) : 0,
    };
  });

  const left = <>
    <Card style={{ background: "#ECECEA", border: "1px solid #DDDBD5" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 10, color: "#AEABA3", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
            {loading ? "Loading..." : `${totalDone} of ${tasks.length} activities done`}
          </p>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A", marginBottom: 4 }}>Welcome back.</h2>
          <p style={{ fontSize: 13, color: "#6B6B6B" }}>Your onboarding journey</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <ScoreRing score={overall} size={64} />
          <p style={{ fontSize: 10, color: "#AEABA3", marginTop: 4 }}>Overall</p>
        </div>
      </div>
    </Card>

    <div>
      <SectionLabel>Up next</SectionLabel>
      <div className="space-y-2">
        {loading ? (
          <Card><p style={{ fontSize: 13, color: "#6B6B6B" }}>Loading activities...</p></Card>
        ) : nextActivities.length === 0 ? (
          <Card><p style={{ fontSize: 13, color: "#6B6B6B" }}>All activities completed!</p></Card>
        ) : (
          nextActivities.map(a => {
            const isCheckin = (a.type || "activity") === "checkin";
            const href = isCheckin ? `/newcomer/checkin/${a.id}` : "/newcomer/activities";
            return (
              <Link key={a.id} href={href} style={{ textDecoration: "none" }}>
                <Card className="flex items-start gap-3 hover:border-[#0A0A0A] transition-colors cursor-pointer"
                  style={isCheckin ? { borderLeft: "4px solid #B7791F", background: "#FFFCF5" } : {}}>
                  <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: isCheckin ? "#B7791F" : "#1A1A2E" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0A0A0A]">{a.activity}</p>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
                      {isCheckin ? (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "#FEF3E2", color: "#B7791F" }}>Check-in</span>
                      ) : (
                        <BucketTag bucket={a.dimension} />
                      )}
                      {a.estimated_time && (
                        <span style={{ fontSize: 11, color: "#AEABA3" }}>{a.estimated_time}</span>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  </>;

  const right = <>
    <div>
      <SectionLabel>My three dimensions</SectionLabel>
      <div className="space-y-2">
        {dimScores.map(({ dim, info, score }) => (
          <Link key={dim} href="/newcomer/buckets" style={{ textDecoration: "none" }}>
            <Card className="flex items-center gap-4 hover:border-[#0A0A0A] transition-colors cursor-pointer">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: info.bg }}>
                <span className="text-xs font-bold" style={{ color: info.color }}>{info.num}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[#0A0A0A]">{info.label}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-1.5 bg-[#F5F4F0] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: info.color }} />
                  </div>
                  <span className="text-xs text-[#6B6B6B] flex-shrink-0">{score}%</span>
                </div>
              </div>
              <span className="text-[#AEABA3] text-sm">&#8250;</span>
            </Card>
          </Link>
        ))}
      </div>
    </div>

    <div>
      <SectionLabel>Quick links</SectionLabel>
      <div className="space-y-2">
        <Link href="/newcomer/activities" style={{ textDecoration: "none" }}>
          <Card className="hover:border-[#0A0A0A] transition-colors cursor-pointer">
            <p className="font-semibold text-sm">All Activities</p>
            <p className="text-xs text-[#6B6B6B] mt-1">View and complete your onboarding activities</p>
          </Card>
        </Link>
        <Link href="/newcomer/timeline" style={{ textDecoration: "none" }}>
          <Card className="hover:border-[#0A0A0A] transition-colors cursor-pointer">
            <p className="font-semibold text-sm">Timeline</p>
            <p className="text-xs text-[#6B6B6B] mt-1">See your 12-month journey overview</p>
          </Card>
        </Link>
      </div>
    </div>
  </>;

  return (
    <PageShell nav={<NavBar role="newcomer" active="Home" />}>
      <TwoCol left={left} right={right} />
    </PageShell>
  );
}
