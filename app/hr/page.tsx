"use client";
import { NavBar, PageShell, Card, StatusDot, SectionLabel, TwoCol, ThreeCol } from "@/components/ui";
import { hrOverview, hrNewcomers } from "@/lib/mock";
import Link from "next/link";

export default function HRHome() {
  const total = hrOverview.total;

  const left = <>
    <div className="space-y-1">
      <h2 className="text-xl font-bold">Organization Overview</h2>
      <p className="text-sm text-[#6B6B6B]">Meridian Group · {total} active newcomers</p>
    </div>

    {/* Health summary */}
    <ThreeCol>
      {[
        { label: "On track", value: hrOverview.green, color: "#2D6A4F" },
        { label: "Attention", value: hrOverview.yellow, color: "#B7791F" },
        { label: "At risk", value: hrOverview.red, color: "#9B2335" },
      ].map(s => (
        <Card key={s.label} className="text-center py-4" style={{ borderColor: s.color + "33" }}>
          <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
          <p className="text-xs text-[#6B6B6B] mt-1">{s.label}</p>
        </Card>
      ))}
    </ThreeCol>

    {/* Avg scores */}
    <Card>
      <SectionLabel>Average bucket scores</SectionLabel>
      <div className="space-y-3">
        {[
          { label: "My Job", score: hrOverview.avgScores.job },
          { label: "My Organization", score: hrOverview.avgScores.org },
          { label: "My People", score: hrOverview.avgScores.people },
        ].map(s => (
          <div key={s.label}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{s.label}</span>
              <span className="text-sm text-[#6B6B6B]">{s.score}%</span>
            </div>
            <div className="h-2.5 bg-[#F5F4F0] rounded-full overflow-hidden">
              <div className="h-full rounded-full"
                style={{
                  width: `${s.score}%`,
                  background: s.score >= 70 ? "#2D6A4F" : s.score >= 50 ? "#B7791F" : "#9B2335"
                }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 bg-[#FEF3E2] rounded-lg p-3">
        <p className="text-xs font-semibold text-[#B7791F] mb-1">Organization insight</p>
        <p className="text-sm text-[#B7791F]">
          &quot;My People&quot; is the weakest bucket (52%). Social integration is the main gap — consider strengthening the buddy program.
        </p>
      </div>
    </Card>

    {/* Flight risk */}
    <Card style={{ background: "#FBEAEC", border: "1px solid #9B2335" }}>
      <p className="text-xs font-semibold text-[#9B2335] uppercase tracking-widest mb-2">Flight risk</p>
      <p className="text-3xl font-bold text-[#9B2335]">{hrOverview.flightRisk}</p>
      <p className="text-sm text-[#9B2335] mt-1">newcomers with declining scores for 2+ consecutive check-ins</p>
      <Link href="/hr/newcomers">
        <button className="mt-3 text-xs font-semibold text-[#9B2335] underline underline-offset-2">
          View all newcomers →
        </button>
      </Link>
    </Card>
  </>;

  const right = <>
    {/* Phase distribution */}
    <Card>
      <SectionLabel>Newcomers by phase</SectionLabel>
      <div className="space-y-2">
        {[
          { phase: "Arrival (Days 1–30)", count: hrOverview.phases.arrival, pct: hrOverview.phases.arrival / total },
          { phase: "Integration (Days 31–90)", count: hrOverview.phases.integration, pct: hrOverview.phases.integration / total },
          { phase: "Adjustment (Months 4–6)", count: hrOverview.phases.adjustment, pct: hrOverview.phases.adjustment / total },
          { phase: "Stabilization (Months 7–9)", count: hrOverview.phases.stabilization, pct: hrOverview.phases.stabilization / total },
          { phase: "Embedding (Months 10–12)", count: hrOverview.phases.embedding, pct: hrOverview.phases.embedding / total },
        ].map(p => (
          <div key={p.phase} className="flex items-center gap-3">
            <span className="text-xs text-[#6B6B6B] w-44 flex-shrink-0">{p.phase}</span>
            <div className="flex-1 h-2 bg-[#F5F4F0] rounded-full overflow-hidden">
              <div className="h-full bg-[#0A0A0A] rounded-full" style={{ width: `${p.pct * 100}%` }} />
            </div>
            <span className="text-xs font-semibold w-4 text-right">{p.count}</span>
          </div>
        ))}
      </div>
    </Card>

    {/* Manager effectiveness */}
    <Card>
      <SectionLabel>Manager effectiveness</SectionLabel>
      <div className="space-y-2">
        {[
          { name: "Ravi Sharma", newcomers: 2, avgScore: 75, trend: "↑" },
          { name: "Claire Bennett", newcomers: 2, avgScore: 49, trend: "↓" },
          { name: "Lee Park", newcomers: 1, avgScore: 72, trend: "→" },
        ].map(m => (
          <div key={m.name} className="flex items-center justify-between py-2 border-b border-[#F5F4F0] last:border-0">
            <div>
              <p className="text-sm font-medium">{m.name}</p>
              <p className="text-xs text-[#6B6B6B]">{m.newcomers} newcomer{m.newcomers > 1 ? "s" : ""}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{m.avgScore}%</p>
              <p className={`text-xs ${m.trend === "↑" ? "text-[#2D6A4F]" : m.trend === "↓" ? "text-[#9B2335]" : "text-[#6B6B6B]"}`}>
                {m.trend} avg adjustment
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>

    {/* All newcomers shortcut */}
    <Card>
      <SectionLabel>Quick view — all newcomers</SectionLabel>
      <div className="space-y-2">
        {hrNewcomers.slice(0, 4).map((n, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#F5F4F0] last:border-0">
            <div>
              <p className="text-sm font-medium">{n.name}</p>
              <p className="text-xs text-[#6B6B6B]">{n.dept} · Day {n.day}</p>
            </div>
            <StatusDot status={n.status as "green" | "yellow" | "red"} />
          </div>
        ))}
      </div>
      <Link href="/hr/newcomers">
        <button className="mt-3 text-xs font-semibold text-[#0A0A0A] underline underline-offset-2">
          View all {hrNewcomers.length} →
        </button>
      </Link>
    </Card>
  </>;

  return (
    <PageShell nav={<NavBar role="hr" active="Overview" />}>
      <TwoCol left={left} right={right} />
    </PageShell>
  );
}
