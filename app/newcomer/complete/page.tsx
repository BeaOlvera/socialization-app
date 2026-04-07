"use client";
import { NavBar, PageShell, Card, SectionLabel, ScoreRing } from "@/components/ui";
import Link from "next/link";

const finalScores = { fit: 88, ace: 84, tie: 85 };
const startScores = { fit: 30, ace: 20, tie: 15 };

const milestones = [
  { month: "Day 1",    label: "First day at Meridian Group", icon: "🏁" },
  { month: "Day 18",   label: "Completed all arrival-phase tasks", icon: "✓" },
  { month: "Day 45",   label: "Led first campaign brief", icon: "📋" },
  { month: "Month 3",  label: "Built cross-functional relationships", icon: "🤝" },
  { month: "Month 6",  label: "Delivered measurable campaign results", icon: "📈" },
  { month: "Month 9",  label: "Became go-to expert in brand strategy", icon: "⭐" },
  { month: "Month 12", label: "Fully embedded — strategic contributor", icon: "🎯" },
];

const bucketConfig = {
  fit: { label: "FIT · Role Clarity",       color: "#1A1A2E", bg: "#EEEEF5", num: "01" },
  ace: { label: "ACE · Task Mastery",        color: "#2D6A4F", bg: "#EAF4EF", num: "02" },
  tie: { label: "TIE · Social Acceptance",   color: "#9B2335", bg: "#FBEAEC", num: "03" },
};

export default function CompletePage() {
  const avg = Math.round((finalScores.fit + finalScores.ace + finalScores.tie) / 3);

  return (
    <PageShell nav={<NavBar role="newcomer" active="Home" />}>

      {/* Hero */}
      <Card style={{ background: "#0A0A0A", textAlign: "center", padding: "48px 32px" }}>
        <div style={{ width: 72, height: 72, borderRadius: 99, background: "#1A1A1A", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <span style={{ fontSize: 32 }}>🎯</span>
        </div>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#AEABA3", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>
          12-month journey complete
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.5px", marginBottom: 8, lineHeight: 1.2 }}>
          You are no longer new.<br />You are part of the fabric.
        </h1>
        <p style={{ fontSize: 14, color: "#888888", marginBottom: 28, lineHeight: 1.6 }}>
          Sofia Martínez · Meridian Group · March 2026 — February 2027
        </p>
        <div style={{ display: "inline-block", background: "#FFFFFF", borderRadius: 16, padding: "16px 32px" }}>
          <p style={{ fontSize: 40, fontWeight: 800, color: "#0A0A0A", letterSpacing: "-1px" }}>{avg}%</p>
          <p style={{ fontSize: 12, color: "#6B6B6B" }}>Overall socialization score</p>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Final scores */}
        <Card>
          <SectionLabel>Final scores — all three dimensions</SectionLabel>
          <div style={{ display: "flex", gap: 12, justifyContent: "space-around", marginBottom: 20 }}>
            {(Object.entries(finalScores) as [keyof typeof bucketConfig, number][]).map(([key, score]) => (
              <div key={key} style={{ textAlign: "center" }}>
                <ScoreRing score={score} size={80} />
                <p style={{ fontSize: 11, color: "#6B6B6B", marginTop: 6 }}>{bucketConfig[key].label}</p>
              </div>
            ))}
          </div>

          <SectionLabel>Growth from Day 1</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(Object.entries(finalScores) as [keyof typeof bucketConfig, number][]).map(([key, score]) => {
              const bc = bucketConfig[key];
              const start = startScores[key];
              const growth = score - start;
              return (
                <div key={key} style={{ background: "#F5F4F0", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 6, background: bc.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 8, fontWeight: 800, color: bc.color }}>{bc.num}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A" }}>{bc.label}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11, color: "#AEABA3" }}>{start}%</span>
                    <span style={{ fontSize: 11, color: "#AEABA3" }}>→</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: bc.color }}>{score}%</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#2D6A4F", background: "#EAF4EF", padding: "2px 8px", borderRadius: 99 }}>+{growth}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Certificate */}
          <Card style={{ border: "2px solid #0A0A0A", textAlign: "center", padding: "28px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "#1A1A2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#FFF", fontWeight: 800, fontSize: 10 }}>ob</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: 15, color: "#0A0A0A" }}>onboard</span>
            </div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#AEABA3", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>Certificate of embedding</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A", marginBottom: 4 }}>Sofia Martínez</p>
            <p style={{ fontSize: 12, color: "#6B6B6B", marginBottom: 16 }}>has successfully completed the 12-month<br />socialization journey at Meridian Group</p>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
              {["Fully embedded", "FIT · ACE · TIE ≥ 80%", "No flight risk", "Social network built"].map(tag => (
                <span key={tag} style={{ fontSize: 10, fontWeight: 600, background: "#EEEEF5", color: "#1A1A2E", padding: "3px 10px", borderRadius: 99 }}>
                  {tag}
                </span>
              ))}
            </div>
            <p style={{ fontSize: 10, color: "#AEABA3", marginTop: 16 }}>February 27, 2027</p>
          </Card>

          {/* Insight */}
          <Card style={{ background: "#ECECEA", border: "1px solid #DDDBD5" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#AEABA3", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Reflection</p>
            <p style={{ fontSize: 13, color: "#0A0A0A", lineHeight: 1.7 }}>
              Your <strong>TIE</strong> track showed the most growth (+70 pts). The social integration effort in months 2–4 paid off long-term. You are now someone others seek out.
            </p>
          </Card>

          <Link href="/newcomer" style={{ textDecoration: "none" }}>
            <div style={{ background: "#F5F4F0", border: "1px solid #E2E0DA", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#6B6B6B" }}>Back to dashboard</span>
              <span style={{ color: "#AEABA3", fontSize: 16 }}>›</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Milestones timeline */}
      <Card>
        <SectionLabel>12-month milestones</SectionLabel>
        <div style={{ display: "flex", gap: 0 }}>
          {milestones.map((m, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
              {/* connector line */}
              {i < milestones.length - 1 && (
                <div style={{ position: "absolute", top: 18, left: "50%", right: "-50%", height: 2, background: "#E2E0DA", zIndex: 0 }} />
              )}
              <div style={{ width: 36, height: 36, borderRadius: 99, background: i === milestones.length - 1 ? "#0A0A0A" : "#EEEEF5", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, marginBottom: 8 }}>
                <span style={{ fontSize: 14 }}>{m.icon}</span>
              </div>
              <p style={{ fontSize: 9, fontWeight: 700, color: "#AEABA3", marginBottom: 3, textAlign: "center" }}>{m.month}</p>
              <p style={{ fontSize: 10, color: "#0A0A0A", textAlign: "center", lineHeight: 1.4, padding: "0 4px" }}>{m.label}</p>
            </div>
          ))}
        </div>
      </Card>

    </PageShell>
  );
}
