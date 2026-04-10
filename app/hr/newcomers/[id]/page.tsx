"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { NavBar, PageShell, Card, SectionLabel, StatusDot, Avatar, ScoreRing } from "@/components/ui";
import { PreArrivalReport } from "@/components/PreArrivalReport";
import { DIMENSIONS } from "@/lib/framework";

type Dim = keyof typeof DIMENSIONS;

interface NewcomerInfo {
  id: string;
  department: string;
  position: string;
  start_date: string;
  status: string;
  current_phase: string;
  user: { name: string; email: string };
  manager: { name: string } | null;
}

interface Task {
  id: string;
  phase: string;
  dimension: string;
  activity: string;
  label: string;
  done: boolean;
  type: string;
  due_date: string | null;
}

const bucketConfig = {
  fit: { label: "FIT", color: "#1A1A2E", bg: "#EEEEF5" },
  ace: { label: "ACE", color: "#2D6A4F", bg: "#EAF4EF" },
  tie: { label: "TIE", color: "#9B2335", bg: "#FBEAEC" },
};

export default function HRNewcomerDetail() {
  const { id } = useParams<{ id: string }>();
  const [newcomer, setNewcomer] = useState<NewcomerInfo | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [preSummary, setPreSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/hr/newcomers/${id}`).then(r => r.ok ? r.json() : null),
      fetch(`/api/manager/newcomers/${id}/tasks`).then(r => r.ok ? r.json() : []),
      fetch(`/api/hr/newcomers/${id}/pre-arrival-summary`).then(r => r.ok ? r.json() : { available: false }),
    ]).then(([nData, tData, sData]) => {
      if (nData) setNewcomer(nData);
      if (Array.isArray(tData)) setTasks(tData);
      setPreSummary(sData);
    }).finally(() => setLoading(false));
  }, [id]);

  function daysSince(startDate: string) {
    return Math.max(1, Math.floor((Date.now() - new Date(startDate).getTime()) / 86400000));
  }

  const dims: Dim[] = ["fit", "ace", "tie"];
  function dimScore(dim: string) {
    const dt = tasks.filter(t => t.dimension === dim);
    return dt.length > 0 ? Math.round((dt.filter(t => t.done).length / dt.length) * 100) : 0;
  }
  const overall = tasks.length > 0 ? Math.round((tasks.filter(t => t.done).length / tasks.length) * 100) : 0;

  if (loading) {
    return (
      <PageShell nav={<NavBar role="hr" active="All Newcomers" />}>
        <div style={{ textAlign: "center", padding: 60, color: "#6B6B6B" }}>Loading...</div>
      </PageShell>
    );
  }

  if (!newcomer) {
    return (
      <PageShell nav={<NavBar role="hr" active="All Newcomers" />}>
        <div style={{ textAlign: "center", padding: 60 }}>
          <p style={{ fontSize: 16, color: "#6B6B6B" }}>Newcomer not found.</p>
          <a href="/hr/newcomers" style={{ fontSize: 13, color: "#1A1A2E" }}>← Back to all newcomers</a>
        </div>
      </PageShell>
    );
  }

  const name = newcomer.user?.name || "Unknown";
  const initials = name.split(" ").map((w: string) => w[0]).join("");

  return (
    <PageShell nav={<NavBar role="hr" active="All Newcomers" />}>
      {/* Header */}
      <Card style={{ background: "#ECECEA", border: "1px solid #DDDBD5" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Avatar initials={initials} size={52} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A" }}>{name}</h2>
                <StatusDot status={newcomer.status as "green" | "yellow" | "red"} />
              </div>
              <p style={{ fontSize: 13, color: "#6B6B6B" }}>{newcomer.position} · {newcomer.department}</p>
              <p style={{ fontSize: 12, color: "#AEABA3", marginTop: 2 }}>
                Day {daysSince(newcomer.start_date)} · {newcomer.current_phase} · Manager: {newcomer.manager?.name || "Unassigned"}
              </p>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 28, fontWeight: 700, color: "#0A0A0A" }}>{overall}%</p>
            <p style={{ fontSize: 11, color: "#AEABA3" }}>completion</p>
          </div>
        </div>
      </Card>

      {/* Pre-arrival report */}
      {preSummary?.available && (
        <PreArrivalReport summary={preSummary} showFlightRisk={true} newcomerName={newcomer?.user?.name?.split(" ")[0]} />
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <SectionLabel>FACET scores</SectionLabel>
            <div style={{ display: "flex", gap: 16, justifyContent: "space-around", marginBottom: 16 }}>
              {dims.map(dim => (
                <div key={dim} style={{ textAlign: "center" }}>
                  <ScoreRing score={dimScore(dim)} size={80} />
                  <p style={{ fontSize: 11, color: "#6B6B6B", marginTop: 6 }}>{bucketConfig[dim].label}</p>
                </div>
              ))}
            </div>
            {dims.map(dim => {
              const bc = bucketConfig[dim];
              const score = dimScore(dim);
              const dt = tasks.filter(t => t.dimension === dim);
              return (
                <div key={dim} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{bc.label}</span>
                    <span style={{ fontSize: 12, color: "#AEABA3" }}>{dt.filter(t => t.done).length}/{dt.length} · {score}%</span>
                  </div>
                  <div style={{ height: 6, background: "#F5F4F0", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: bc.color, borderRadius: 99, width: `${score}%` }} />
                  </div>
                </div>
              );
            })}
          </Card>

          <Card>
            <SectionLabel>Activities ({tasks.filter(t => (t.type || "activity") === "activity").length})</SectionLabel>
            <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
              {tasks.filter(t => (t.type || "activity") === "activity").map(t => (
                <div key={t.id} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "6px 8px",
                  background: t.done ? "#F5F4F0" : "#FFF", borderRadius: 6,
                  borderLeft: `3px solid ${DIMENSIONS[t.dimension as Dim]?.color || "#E2E0DA"}`,
                  opacity: t.done ? 0.5 : 1,
                }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                    background: t.done ? DIMENSIONS[t.dimension as Dim]?.color : "transparent",
                    border: t.done ? "none" : "2px solid #DDDBD5",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {t.done && <span style={{ fontSize: 8, color: "#FFF", fontWeight: 700 }}>&#10003;</span>}
                  </div>
                  <span style={{ fontSize: 11, textDecoration: t.done ? "line-through" : "none" }}>{t.activity || t.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <SectionLabel>Check-ins ({tasks.filter(t => t.type === "checkin").length})</SectionLabel>
            {tasks.filter(t => t.type === "checkin").length === 0 ? (
              <p style={{ fontSize: 12, color: "#6B6B6B" }}>No check-ins assigned.</p>
            ) : (
              <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
                {tasks.filter(t => t.type === "checkin").map(t => (
                  <div key={t.id} style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "6px 8px",
                    background: t.done ? "#F5F4F0" : "#FEF3E2", borderRadius: 6, opacity: t.done ? 0.5 : 1,
                  }}>
                    <div style={{
                      width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                      background: t.done ? "#B7791F" : "transparent",
                      border: t.done ? "none" : "2px solid #B7791F",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {t.done && <span style={{ fontSize: 8, color: "#FFF", fontWeight: 700 }}>&#10003;</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 11, textDecoration: t.done ? "line-through" : "none" }}>{t.activity || t.label}</span>
                      {t.due_date && <span style={{ fontSize: 9, color: "#AEABA3", marginLeft: 6 }}>Due: {t.due_date}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card style={{ background: "#0A0A0A" }}>
            <SectionLabel>Recommended HR actions</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {newcomer.status === "red" && (
                <>
                  <div style={{ background: "#1A1A1A", borderRadius: 10, padding: "10px 12px" }}>
                    <p style={{ fontSize: 12, color: "#FFF" }}>→ Flag for immediate manager follow-up</p>
                  </div>
                  <div style={{ background: "#1A1A1A", borderRadius: 10, padding: "10px 12px" }}>
                    <p style={{ fontSize: 12, color: "#FFF" }}>→ Schedule buddy session within 5 days</p>
                  </div>
                </>
              )}
              {newcomer.status === "yellow" && (
                <div style={{ background: "#1A1A1A", borderRadius: 10, padding: "10px 12px" }}>
                  <p style={{ fontSize: 12, color: "#FFF" }}>→ Prompt manager to run divergence check-in</p>
                </div>
              )}
              {newcomer.status === "green" && (
                <div style={{ background: "#1A1A1A", borderRadius: 10, padding: "10px 12px" }}>
                  <p style={{ fontSize: 12, color: "#FFF" }}>→ No action needed · Continue monitoring</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
