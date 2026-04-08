"use client";
import { NavBar, PageShell, Card, StatusDot, SectionLabel, TwoCol, ThreeCol } from "@/components/ui";
import { useEffect, useState } from "react";
import Link from "next/link";

interface NewcomerRow {
  id: string;
  user_name: string;
  department: string;
  position: string;
  start_date: string;
  status: string;
  current_phase: string;
  task_total: number;
  task_done: number;
}

export default function HRHome() {
  const [newcomers, setNewcomers] = useState<NewcomerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/hr/dashboard")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setNewcomers(data); })
      .finally(() => setLoading(false));
  }, []);

  const total = newcomers.length;
  const green = newcomers.filter(n => n.status === "green").length;
  const yellow = newcomers.filter(n => n.status === "yellow").length;
  const red = newcomers.filter(n => n.status === "red").length;

  // Day calculation helper
  function daysSince(startDate: string) {
    const diff = Date.now() - new Date(startDate).getTime();
    return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }

  // Phase distribution
  const phases = ["arrival", "integration", "adjustment", "stabilization", "embedding"];
  const phaseCounts = phases.map(p => newcomers.filter(n => n.current_phase === p).length);

  const left = <>
    <div className="space-y-1">
      <h2 className="text-xl font-bold">Organization Overview</h2>
      <p className="text-sm text-[#6B6B6B]">{total} active newcomer{total !== 1 ? "s" : ""}</p>
    </div>

    <ThreeCol>
      {[
        { label: "On track", value: green, color: "#2D6A4F" },
        { label: "Attention", value: yellow, color: "#B7791F" },
        { label: "At risk", value: red, color: "#9B2335" },
      ].map(s => (
        <Card key={s.label} className="text-center py-4" style={{ borderColor: s.color + "33" }}>
          <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
          <p className="text-xs text-[#6B6B6B] mt-1">{s.label}</p>
        </Card>
      ))}
    </ThreeCol>

    {/* Assign activities */}
    <Card>
      <SectionLabel>Assign Activities</SectionLabel>
      <p style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 12 }}>
        One-click assign all uploaded activities and check-ins to a newcomer.
      </p>
      {newcomers.map(n => (
        <AssignRow key={n.id} newcomer={n} />
      ))}
    </Card>
  </>;

  const right = <>
    <Card>
      <SectionLabel>Newcomers by phase</SectionLabel>
      <div className="space-y-2">
        {phases.map((p, i) => (
          <div key={p} className="flex items-center gap-3">
            <span className="text-xs text-[#6B6B6B] w-32 flex-shrink-0 capitalize">{p}</span>
            <div className="flex-1 h-2 bg-[#F5F4F0] rounded-full overflow-hidden">
              <div className="h-full bg-[#0A0A0A] rounded-full"
                style={{ width: total > 0 ? `${(phaseCounts[i] / total) * 100}%` : "0%" }} />
            </div>
            <span className="text-xs font-semibold w-4 text-right">{phaseCounts[i]}</span>
          </div>
        ))}
      </div>
    </Card>

    <Card>
      <SectionLabel>All newcomers</SectionLabel>
      <div className="space-y-2">
        {loading ? (
          <p style={{ fontSize: 13, color: "#6B6B6B" }}>Loading...</p>
        ) : newcomers.length === 0 ? (
          <p style={{ fontSize: 13, color: "#6B6B6B" }}>No newcomers yet.</p>
        ) : (
          newcomers.map(n => (
            <Link key={n.id} href={`/hr/newcomers/${n.id}`} style={{ textDecoration: "none" }}>
              <div className="flex items-center justify-between py-2 border-b border-[#F5F4F0] last:border-0 hover:bg-[#FAFAF8] px-2 rounded">
                <div>
                  <p className="text-sm font-medium text-[#0A0A0A]">{n.user_name}</p>
                  <p className="text-xs text-[#6B6B6B]">
                    {n.department || "No dept"} · Day {daysSince(n.start_date)} ·
                    {n.task_total > 0 ? ` ${n.task_done}/${n.task_total} tasks` : " No tasks"}
                  </p>
                </div>
                <StatusDot status={n.status as "green" | "yellow" | "red"} />
              </div>
            </Link>
          ))
        )}
      </div>
    </Card>
  </>;

  return (
    <PageShell nav={<NavBar role="hr" active="Overview" />}>
      <TwoCol left={left} right={right} />
    </PageShell>
  );
}

function AssignRow({ newcomer }: { newcomer: NewcomerRow }) {
  const [assigning, setAssigning] = useState(false);
  const [result, setResult] = useState("");

  async function assign() {
    setAssigning(true);
    const res = await fetch(`/api/hr/newcomers/${newcomer.id}/assign-activities`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setResult(`Assigned ${data.assigned} items`);
    } else {
      setResult("Error assigning");
    }
    setAssigning(false);
  }

  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "8px 0", borderBottom: "1px solid #F5F4F0",
    }}>
      <div>
        <p style={{ fontSize: 13, fontWeight: 600 }}>{newcomer.user_name}</p>
        <p style={{ fontSize: 11, color: "#6B6B6B" }}>{newcomer.task_done}/{newcomer.task_total} tasks done</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {result && <span style={{ fontSize: 11, color: "#2D6A4F" }}>{result}</span>}
        <button onClick={assign} disabled={assigning} style={{
          padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
          background: assigning ? "#E2E0DA" : "#1A1A2E", color: "#FFFFFF",
          fontSize: 11, fontWeight: 600,
        }}>
          {assigning ? "..." : "Assign All"}
        </button>
      </div>
    </div>
  );
}
