"use client";
import { NavBar, PageShell, Card, ScoreRing, SectionLabel } from "@/components/ui";
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
}

const tips: Record<Dim, { title: string; text: string }> = {
  fit: { title: "Next step", text: "Ask your manager to walk you through your KPIs and how success is measured in your next 1:1." },
  ace: { title: "Tip", text: "Find the SOPs and playbooks — completing one process end-to-end will unlock confidence fast." },
  tie: { title: "Focus area", text: "Building relationships takes time — but starting early matters most. Try one coffee chat this week." },
};

export default function BucketsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/newcomer/tasks")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setTasks(data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PageShell nav={<NavBar role="newcomer" active="My Journey" />}>
        <div style={{ textAlign: "center", padding: 60, color: "#6B6B6B" }}>Loading...</div>
      </PageShell>
    );
  }

  const dims: Dim[] = ["fit", "ace", "tie"];
  const phases = Object.keys(PHASES) as Phase[];

  return (
    <PageShell nav={<NavBar role="newcomer" active="My Journey" />}>
      <div className="space-y-1">
        <h2 className="text-xl font-bold">My Journey</h2>
        <p className="text-sm text-[#6B6B6B]">The three facets of your socialization — FIT · ACE · TIE.</p>
      </div>

      {dims.map(dim => {
        const info = DIMENSIONS[dim];
        const dimTasks = tasks.filter(t => t.dimension === dim);
        const done = dimTasks.filter(t => t.done).length;
        const total = dimTasks.length;
        const score = total > 0 ? Math.round((done / total) * 100) : 0;
        const tip = tips[dim];

        return (
          <Card key={dim}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-[#AEABA3] tracking-widest uppercase">{info.num}</span>
                <h3 className="text-lg font-bold mt-0.5">{info.label}</h3>
              </div>
              <ScoreRing score={score} size={64} />
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-[#F5F4F0] rounded-full overflow-hidden mb-4">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${score}%`, background: info.color }}
              />
            </div>

            {/* Phase breakdown */}
            <SectionLabel>Progress by phase</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {phases.map(phase => {
                const pt = dimTasks.filter(t => t.phase === phase);
                if (pt.length === 0) return null;
                const pd = pt.filter(t => t.done).length;
                const pp = Math.round((pd / pt.length) * 100);
                return (
                  <div key={phase} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 12, color: "#6B6B6B", width: 90, flexShrink: 0 }}>{PHASES[phase].label}</span>
                    <div style={{ flex: 1, height: 6, background: "#F5F4F0", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", background: info.color, borderRadius: 99, width: `${pp}%`, transition: "width 0.4s" }} />
                    </div>
                    <span style={{ fontSize: 11, color: "#AEABA3", width: 45, textAlign: "right", flexShrink: 0 }}>{pd}/{pt.length}</span>
                  </div>
                );
              })}
            </div>

            {/* Tip */}
            <div style={{ background: info.bg, borderRadius: 10, padding: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: info.color, marginBottom: 4 }}>{tip.title}</p>
              <p style={{ fontSize: 13, color: info.color }}>{tip.text}</p>
            </div>
          </Card>
        );
      })}

      {/* Link to activities */}
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <Link href="/newcomer/activities" style={{
          fontSize: 14, fontWeight: 600, color: "#1A1A2E", textDecoration: "none",
          padding: "10px 24px", borderRadius: 10, background: "#EEEEF5",
          display: "inline-block",
        }}>
          View all activities →
        </Link>
      </div>
    </PageShell>
  );
}
