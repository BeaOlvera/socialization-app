"use client";
import { NavBar, PageShell, Card, SectionLabel, TwoCol } from "@/components/ui";
import dynamic from "next/dynamic";

const BucketLineChart = dynamic(() => import("@/components/Charts").then(m => ({ default: m.BucketLineChart })), { ssr: false });
const ProjectedAreaChart = dynamic(() => import("@/components/Charts").then(m => ({ default: m.ProjectedAreaChart })), { ssr: false });
const DivergenceChart = dynamic(() => import("@/components/Charts").then(m => ({ default: m.DivergenceChart })), { ssr: false });

import { currentData, monthlyData } from "@/components/Charts";

export default function ProgressPage() {
  const latest = currentData[currentData.length - 1];
  const first = currentData[0];
  const fitGrowth = latest.fit - first.fit;
  const aceGrowth = latest.ace - first.ace;
  const tieGrowth = latest.tie - first.tie;

  const left = <>
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A", marginBottom: 4 }}>Progress over time</h2>
      <p style={{ fontSize: 13, color: "#6B6B6B" }}>Sofia Martínez · Day 18 · Arrival phase</p>
    </div>

    {/* Three dimension trend */}
    <Card>
      <SectionLabel>FIT · ACE · TIE scores — Month 1</SectionLabel>
      <BucketLineChart />
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        {[
          { label: "FIT", growth: fitGrowth, color: "#1A1A2E", bg: "#EEEEF5" },
          { label: "ACE", growth: aceGrowth, color: "#2D6A4F", bg: "#EAF4EF" },
          { label: "TIE", growth: tieGrowth, color: "#9B2335", bg: "#FBEAEC" },
        ].map(b => (
          <div key={b.label} style={{ flex: 1, background: b.bg, borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: b.color }}>+{b.growth}%</p>
            <p style={{ fontSize: 10, color: "#6B6B6B", marginTop: 2 }}>{b.label}</p>
          </div>
        ))}
      </div>
    </Card>

    {/* Projected 12-month */}
    <Card>
      <SectionLabel>Projected trajectory — 12 months</SectionLabel>
      <p style={{ fontSize: 11, color: "#AEABA3", marginBottom: 12 }}>Based on current rate of progress</p>
      <ProjectedAreaChart />
      <p style={{ fontSize: 11, color: "#AEABA3", marginTop: 8, textAlign: "center" }}>
        Solid lines = actual · area after &quot;Today&quot; = projected
      </p>
    </Card>
  </>;

  const right = <>
    {/* Self vs manager divergence */}
    <Card>
      <SectionLabel>Self vs. manager — divergence</SectionLabel>
      <p style={{ fontSize: 11, color: "#AEABA3", marginBottom: 12 }}>Gap between how you see yourself and how your manager sees you</p>
      <DivergenceChart />
      <div style={{ marginTop: 14, background: "#FEF3E2", borderRadius: 10, padding: "12px 14px" }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#B7791F", marginBottom: 4 }}>
          Current gap: {latest.manager - latest.self} points
        </p>
        <p style={{ fontSize: 12, color: "#B7791F", lineHeight: 1.5 }}>
          Your manager rates you higher than you rate yourself. This is common in early phases — your confidence will catch up as you settle in.
        </p>
      </div>
    </Card>

    {/* Weekly snapshot */}
    <Card>
      <SectionLabel>This week vs. last week</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          { label: "FIT · Role Clarity", current: latest.fit, prev: currentData[currentData.length - 2]?.fit || 0, color: "#1A1A2E", bg: "#EEEEF5" },
          { label: "ACE · Task Mastery", current: latest.ace, prev: currentData[currentData.length - 2]?.ace || 0, color: "#2D6A4F", bg: "#EAF4EF" },
          { label: "TIE · Social Acceptance", current: latest.tie, prev: currentData[currentData.length - 2]?.tie || 0, color: "#9B2335", bg: "#FBEAEC" },
        ].map(b => {
          const delta = b.current - b.prev;
          return (
            <div key={b.label}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A" }}>{b.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: delta >= 0 ? "#2D6A4F" : "#9B2335", background: delta >= 0 ? "#EAF4EF" : "#FBEAEC", padding: "2px 8px", borderRadius: 99 }}>
                    {delta >= 0 ? "+" : ""}{delta}%
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A" }}>{b.current}%</span>
                </div>
              </div>
              <div style={{ height: 8, background: "#F5F4F0", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 99, background: b.color, width: `${b.current}%`, transition: "width 0.5s ease" }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>

    {/* Insight */}
    <Card style={{ background: "#ECECEA", border: "1px solid #DDDBD5" }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#AEABA3", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Insight</p>
      <p style={{ fontSize: 14, color: "#0A0A0A", lineHeight: 1.7 }}>
        Your <strong>FIT</strong> track is progressing fastest. Focus energy on <strong>TIE</strong> — social integration at this stage has a strong long-term effect on overall adjustment.
      </p>
    </Card>
  </>;

  return (
    <PageShell nav={<NavBar role="newcomer" active="Progress" />}>
      <TwoCol left={left} right={right} />
    </PageShell>
  );
}
