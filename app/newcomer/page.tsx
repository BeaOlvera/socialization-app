"use client";
import { NavBar, PageShell, Card, ScoreRing, SectionLabel, Avatar, BucketTag, TwoCol } from "@/components/ui";
import { DIMENSIONS, PHASES } from "@/lib/framework";
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

  const totalDone = tasks.filter(t => t.done).length;
  const overall = tasks.length > 0 ? Math.round((totalDone / tasks.length) * 100) : 0;

  // Next undone: check-ins first, then activities, ordered by phase
  const phaseOrder = ["arrival", "integration", "adjustment", "stabilization", "embedding"];
  const undone = tasks.filter(t => !t.done).sort((a, b) => {
    // Check-ins before activities
    const aIsCheckin = (a.type || "activity") === "checkin" ? 0 : 1;
    const bIsCheckin = (b.type || "activity") === "checkin" ? 0 : 1;
    if (aIsCheckin !== bIsCheckin) return aIsCheckin - bIsCheckin;
    // Then by phase order
    return phaseOrder.indexOf(a.phase) - phaseOrder.indexOf(b.phase);
  });
  const nextActivities = undone.slice(0, 4);

  // Dimension scores
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
    {/* Header */}
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

    {/* Next activities */}
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
    {/* Three dimensions */}
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

    {/* Quick links */}
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
