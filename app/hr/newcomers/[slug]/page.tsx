"use client";
import { NavBar, PageShell, Card, SectionLabel, StatusDot, Avatar, ScoreRing } from "@/components/ui";
import { notFound } from "next/navigation";

const profiles: Record<string, {
  name: string; role: string; dept: string; day: number; phase: string;
  status: "green" | "yellow" | "red"; manager: string; avatar: string;
  scores: { fit: number; ace: number; tie: number };
  selfScore: number; managerScore: number;
  alerts: string[]; strengths: string[];
  checkins: { date: string; fit: number; ace: number; tie: number }[];
}> = {
  sofia: {
    name: "Sofia Martínez", role: "Marketing Specialist", dept: "Marketing",
    day: 18, phase: "Arrival", status: "yellow",
    manager: "Claire Bennett", avatar: "SM",
    scores: { fit: 62, ace: 48, tie: 35 },
    selfScore: 48, managerScore: 65,
    alerts: ["Self vs manager divergence — 17 pts gap", "TIE score below 40 — social integration at risk"],
    strengths: ["Fast learner in role tasks", "Proactive communication with manager"],
    checkins: [
      { date: "Mar W1", fit: 30, ace: 20, tie: 15 },
      { date: "Mar W3", fit: 62, ace: 48, tie: 35 },
    ],
  },
  daniel: {
    name: "Daniel Cruz", role: "Data Analyst", dept: "Analytics",
    day: 54, phase: "Integration", status: "green",
    manager: "Ravi Sharma", avatar: "DC",
    scores: { fit: 78, ace: 72, tie: 68 },
    selfScore: 72, managerScore: 74,
    alerts: [],
    strengths: ["Strong cross-functional relationships", "Exceeds expectations in role clarity"],
    checkins: [
      { date: "Feb W1", fit: 40, ace: 30, tie: 22 },
      { date: "Feb W3", fit: 60, ace: 52, tie: 48 },
      { date: "Mar W3", fit: 78, ace: 72, tie: 68 },
    ],
  },
  yuki: {
    name: "Yuki Tanaka", role: "Product Designer", dept: "Product",
    day: 91, phase: "Adjustment", status: "red",
    manager: "Claire Bennett", avatar: "YT",
    scores: { fit: 55, ace: 40, tie: 28 },
    selfScore: 38, managerScore: 60,
    alerts: ["Social isolation — TIE critically low (28%)", "Large divergence gap — 22 pts", "No informal connections reported in 3 weeks"],
    strengths: ["Strong design output quality"],
    checkins: [
      { date: "Jan", fit: 35, ace: 25, tie: 20 },
      { date: "Feb", fit: 48, ace: 35, tie: 24 },
      { date: "Mar", fit: 55, ace: 40, tie: 28 },
    ],
  },
  marcus: {
    name: "Marcus Webb", role: "Account Executive", dept: "Sales",
    day: 134, phase: "Stabilization", status: "green",
    manager: "Lee Park", avatar: "MW",
    scores: { fit: 82, ace: 75, tie: 79 },
    selfScore: 78, managerScore: 80,
    alerts: [],
    strengths: ["Excellent relationship building", "Leading informal team rituals"],
    checkins: [
      { date: "Nov", fit: 55, ace: 48, tie: 50 },
      { date: "Dec", fit: 68, ace: 60, tie: 65 },
      { date: "Jan", fit: 75, ace: 68, tie: 72 },
      { date: "Mar", fit: 82, ace: 75, tie: 79 },
    ],
  },
  fatima: {
    name: "Fatima Al-Hassan", role: "Legal Counsel", dept: "Legal",
    day: 201, phase: "Embedding", status: "green",
    manager: "Susan Cole", avatar: "FA",
    scores: { fit: 88, ace: 84, tie: 86 },
    selfScore: 85, managerScore: 87,
    alerts: [],
    strengths: ["Fully embedded", "Acts as informal mentor to newer hires", "Strong influence across departments"],
    checkins: [
      { date: "Sep", fit: 72, ace: 65, tie: 68 },
      { date: "Nov", fit: 80, ace: 76, tie: 78 },
      { date: "Mar", fit: 88, ace: 84, tie: 86 },
    ],
  },
  ben: {
    name: "Ben Kowalski", role: "Software Engineer", dept: "Engineering",
    day: 12, phase: "Arrival", status: "green",
    manager: "Ravi Sharma", avatar: "BK",
    scores: { fit: 42, ace: 28, tie: 22 },
    selfScore: 35, managerScore: 40,
    alerts: ["Very early stage — monitoring only"],
    strengths: ["Strong technical onboarding progress"],
    checkins: [
      { date: "Mar W1", fit: 25, ace: 18, tie: 12 },
      { date: "Mar W3", fit: 42, ace: 28, tie: 22 },
    ],
  },
};

const bucketConfig = {
  fit: { label: "FIT",  color: "#1A1A2E", bg: "#EEEEF5", num: "01" },
  ace: { label: "ACE",  color: "#2D6A4F", bg: "#EAF4EF", num: "02" },
  tie: { label: "TIE",  color: "#9B2335", bg: "#FBEAEC", num: "03" },
};

export default function HRNewcomerDetail({ params }: { params: { slug: string } }) {
  const profile = profiles[params.slug];
  if (!profile) notFound();

  const avg = Math.round((profile.scores.fit + profile.scores.ace + profile.scores.tie) / 3);
  const gap = profile.managerScore - profile.selfScore;

  return (
    <PageShell nav={<NavBar role="hr" active="All Newcomers" />}>

      {/* Header */}
      <Card style={{ background: "#ECECEA", border: "1px solid #DDDBD5" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Avatar initials={profile.avatar} size={52} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A" }}>{profile.name}</h2>
                <StatusDot status={profile.status} />
              </div>
              <p style={{ fontSize: 13, color: "#6B6B6B" }}>{profile.role} · {profile.dept}</p>
              <p style={{ fontSize: 12, color: "#AEABA3", marginTop: 2 }}>Day {profile.day} · {profile.phase} phase · Manager: {profile.manager}</p>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 28, fontWeight: 700, color: "#0A0A0A" }}>{avg}%</p>
            <p style={{ fontSize: 11, color: "#AEABA3" }}>overall avg</p>
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Dimension scores */}
          <Card>
            <SectionLabel>FIT · ACE · TIE scores</SectionLabel>
            <div style={{ display: "flex", gap: 16, justifyContent: "space-around", marginBottom: 16 }}>
              {(Object.entries(profile.scores) as [keyof typeof bucketConfig, number][]).map(([key, score]) => {
                const bc = bucketConfig[key];
                return (
                  <div key={key} style={{ textAlign: "center" }}>
                    <ScoreRing score={score} size={80} />
                    <p style={{ fontSize: 11, color: "#6B6B6B", marginTop: 6 }}>{bc.label}</p>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(Object.entries(profile.scores) as [keyof typeof bucketConfig, number][]).map(([key, score]) => {
                const bc = bucketConfig[key];
                return (
                  <div key={key}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "#0A0A0A", fontWeight: 500 }}>{bc.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: bc.color }}>{score}%</span>
                    </div>
                    <div style={{ height: 6, background: "#F5F4F0", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", background: bc.color, borderRadius: 99, width: `${score}%`, transition: "width 0.5s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Check-in history */}
          <Card>
            <SectionLabel>Check-in history</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {profile.checkins.map((c, i) => (
                <div key={i} style={{ background: "#F5F4F0", borderRadius: 10, padding: "10px 12px" }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#6B6B6B", marginBottom: 6 }}>{c.date}</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    {(["fit", "ace", "tie"] as const).map(k => {
                      const bc = bucketConfig[k];
                      return (
                        <div key={k} style={{ flex: 1, background: bc.bg, borderRadius: 7, padding: "5px 8px", textAlign: "center" }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: bc.color }}>{c[k]}%</p>
                          <p style={{ fontSize: 9, color: "#6B6B6B" }}>{bc.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Alerts */}
          {profile.alerts.length > 0 && (
            <Card style={{ border: "1px solid #F5C6CC" }}>
              <SectionLabel>Active alerts</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {profile.alerts.map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "#FBEAEC", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ width: 8, height: 8, borderRadius: 99, background: "#9B2335", marginTop: 4, flexShrink: 0 }} />
                    <p style={{ fontSize: 12, color: "#9B2335", lineHeight: 1.5 }}>{a}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Strengths */}
          <Card>
            <SectionLabel>Strengths observed</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {profile.strengths.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "#EAF4EF", borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ width: 8, height: 8, borderRadius: 99, background: "#2D6A4F", marginTop: 4, flexShrink: 0 }} />
                  <p style={{ fontSize: 12, color: "#2D6A4F", lineHeight: 1.5 }}>{s}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Self vs manager */}
          <Card>
            <SectionLabel>Self vs. manager perception</SectionLabel>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 1, background: "#F5F4F0", borderRadius: 10, padding: "12px", textAlign: "center" }}>
                <p style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A" }}>{profile.selfScore}%</p>
                <p style={{ fontSize: 11, color: "#6B6B6B" }}>Self</p>
              </div>
              <div style={{ flex: 1, background: "#F5F4F0", borderRadius: 10, padding: "12px", textAlign: "center" }}>
                <p style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A" }}>{profile.managerScore}%</p>
                <p style={{ fontSize: 11, color: "#6B6B6B" }}>Manager</p>
              </div>
              <div style={{ flex: 1, background: Math.abs(gap) > 15 ? "#FEF3E2" : "#EAF4EF", borderRadius: 10, padding: "12px", textAlign: "center" }}>
                <p style={{ fontSize: 20, fontWeight: 700, color: Math.abs(gap) > 15 ? "#B7791F" : "#2D6A4F" }}>{gap > 0 ? "+" : ""}{gap}</p>
                <p style={{ fontSize: 11, color: "#6B6B6B" }}>Gap</p>
              </div>
            </div>
            {Math.abs(gap) > 15 && (
              <div style={{ background: "#FEF3E2", borderRadius: 10, padding: "10px 12px" }}>
                <p style={{ fontSize: 12, color: "#B7791F", lineHeight: 1.5 }}>
                  Gap exceeds 15 points. Recommend scheduling a check-in to align perceptions.
                </p>
              </div>
            )}
          </Card>

          {/* Recommended actions */}
          <Card style={{ background: "#0A0A0A" }}>
            <SectionLabel>Recommended HR actions</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {profile.status === "red" && (
                <>
                  <div style={{ background: "#1A1A1A", borderRadius: 10, padding: "10px 12px" }}>
                    <p style={{ fontSize: 12, color: "#FFFFFF", lineHeight: 1.5 }}>→ Flag for immediate manager follow-up</p>
                  </div>
                  <div style={{ background: "#1A1A1A", borderRadius: 10, padding: "10px 12px" }}>
                    <p style={{ fontSize: 12, color: "#FFFFFF", lineHeight: 1.5 }}>→ Schedule buddy session within 5 days</p>
                  </div>
                </>
              )}
              {profile.status === "yellow" && (
                <div style={{ background: "#1A1A1A", borderRadius: 10, padding: "10px 12px" }}>
                  <p style={{ fontSize: 12, color: "#FFFFFF", lineHeight: 1.5 }}>→ Prompt manager to run divergence check-in</p>
                </div>
              )}
              {profile.status === "green" && (
                <div style={{ background: "#1A1A1A", borderRadius: 10, padding: "10px 12px" }}>
                  <p style={{ fontSize: 12, color: "#FFFFFF", lineHeight: 1.5 }}>→ No action needed · Continue monitoring monthly</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
