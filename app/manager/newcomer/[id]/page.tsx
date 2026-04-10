"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { NavBar, PageShell, Card, StatusDot, SectionLabel, BucketTag } from "@/components/ui";
import { PreArrivalReport } from "@/components/PreArrivalReport";
import { DIMENSIONS, PHASES } from "@/lib/framework";

type Dim = keyof typeof DIMENSIONS;

interface Task {
  id: string;
  phase: string;
  dimension: string;
  activity: string;
  label: string;
  estimated_time: string | null;
  output: string | null;
  who: string | null;
  type: string;
  done: boolean;
  due_date: string | null;
}

interface NewcomerInfo {
  id: string;
  department: string;
  position: string;
  start_date: string;
  status: string;
  current_phase: string;
  user: { name: string; email: string };
}

export default function NewcomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [newcomer, setNewcomer] = useState<NewcomerInfo | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [preSummary, setPreSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/manager/newcomers/${id}`).then(r => r.ok ? r.json() : null),
      fetch(`/api/manager/newcomers/${id}/tasks`).then(r => r.ok ? r.json() : []),
      fetch(`/api/manager/newcomers/${id}/pre-arrival-summary`).then(r => r.ok ? r.json() : { available: false }),
    ]).then(([nData, tData, sData]) => {
      if (nData) setNewcomer(nData);
      if (Array.isArray(tData)) setTasks(tData);
      setPreSummary(sData);
    }).finally(() => setLoading(false));
  }, [id]);

  function daysSince(startDate: string) {
    const diff = Date.now() - new Date(startDate).getTime();
    return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }

  const dims: Dim[] = ["fit", "ace", "tie"];
  const totalDone = tasks.filter(t => t.done).length;
  const overallPct = tasks.length > 0 ? Math.round((totalDone / tasks.length) * 100) : 0;

  if (loading) {
    return (
      <PageShell nav={<NavBar role="manager" active="My Team" />}>
        <div style={{ textAlign: "center", padding: 60, color: "#6B6B6B" }}>Loading...</div>
      </PageShell>
    );
  }

  return (
    <PageShell nav={<NavBar role="manager" active="My Team" />}>
      {/* Header */}
      <Card style={{ background: "#ECECEA", border: "1px solid #DDDBD5" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0A0A0A" }}>
              {newcomer?.user?.name || "Unknown"}
            </h2>
            <p style={{ fontSize: 13, color: "#6B6B6B" }}>
              {newcomer?.position} · {newcomer?.department} · Day {newcomer ? daysSince(newcomer.start_date) : "?"}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {newcomer && <StatusDot status={newcomer.status as "green" | "yellow" | "red"} />}
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 24, fontWeight: 700 }}>{overallPct}%</p>
              <p style={{ fontSize: 10, color: "#AEABA3" }}>{totalDone}/{tasks.length} done</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Dimension progress */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {dims.map(dim => {
          const info = DIMENSIONS[dim];
          const dimTasks = tasks.filter(t => t.dimension === dim);
          const done = dimTasks.filter(t => t.done).length;
          const pct = dimTasks.length > 0 ? Math.round((done / dimTasks.length) * 100) : 0;
          return (
            <Card key={dim}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: info.color }}>{info.label}</span>
                <span style={{ fontSize: 11, color: "#AEABA3" }}>{done}/{dimTasks.length}</span>
              </div>
              <div style={{ height: 6, background: "#F5F4F0", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", background: info.color, borderRadius: 99, width: `${pct}%` }} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pre-arrival report */}
      {preSummary?.available && (
        <PreArrivalReport summary={preSummary} showFlightRisk={true} newcomerName={newcomer?.user?.name?.split(" ")[0]} />
      )}

      {/* Activity list */}
      <Card>
        <SectionLabel>All Activities & Check-ins</SectionLabel>
        {tasks.length === 0 ? (
          <p style={{ fontSize: 13, color: "#6B6B6B" }}>No activities assigned yet.</p>
        ) : (
          <div style={{ maxHeight: 500, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
            {tasks.map(t => (
              <div key={t.id} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                background: t.done ? "#F5F4F0" : "#FFFFFF", borderRadius: 8,
                borderLeft: `3px solid ${DIMENSIONS[t.dimension as Dim]?.color || "#E2E0DA"}`,
                opacity: t.done ? 0.6 : 1,
              }}>
                <div style={{
                  width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                  background: t.done ? DIMENSIONS[t.dimension as Dim]?.color : "transparent",
                  border: t.done ? "none" : "2px solid #DDDBD5",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {t.done && <span style={{ fontSize: 9, color: "#FFF", fontWeight: 700 }}>&#10003;</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: 12, color: "#0A0A0A",
                    textDecoration: t.done ? "line-through" : "none",
                  }}>
                    {t.activity || t.label}
                  </p>
                  <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                    <BucketTag bucket={t.dimension} />
                    {t.type === "checkin" && (
                      <span style={{ fontSize: 9, fontWeight: 600, padding: "1px 6px", borderRadius: 10, background: "#FEF3E2", color: "#B7791F" }}>Check-in</span>
                    )}
                    {t.due_date && <span style={{ fontSize: 10, color: "#AEABA3" }}>Due: {t.due_date}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </PageShell>
  );
}
