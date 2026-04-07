"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { NavBar, PageShell, Card, SectionLabel } from "@/components/ui";

const buckets = [
  {
    id: "fit", label: "FIT · Role Clarity", num: "01", color: "#1A1A2E", bg: "#EEEEF5",
    questions: [
      "Sofia clearly understands her role, responsibilities and reporting line",
      "She knows where her role fits in the org structure",
      "She understands her KPIs and how success is measured",
      "She is clear on decision rights and RACI boundaries",
      "She sees how her work connects to the company strategy",
    ],
  },
  {
    id: "ace", label: "ACE · Task Mastery", num: "02", color: "#2D6A4F", bg: "#EAF4EF",
    questions: [
      "She is following her onboarding plan and hitting milestones",
      "She navigates the tools and systems she needs with confidence",
      "She knows where to find SOPs and follows documented processes",
      "She understands how her performance will be appraised",
      "She is actively closing her skill gaps",
    ],
  },
  {
    id: "tie", label: "TIE · Social Acceptance", num: "03", color: "#9B2335", bg: "#FBEAEC",
    questions: [
      "She has a good relationship with her buddy/mentor",
      "She participates in team rituals and informal gatherings",
      "She is aligning with the company values in her behaviour",
      "She is connecting with people beyond her immediate team",
      "She seems to feel a sense of belonging",
    ],
  },
];

const sofiaScores = { fit: 62, ace: 48, tie: 35 };

export default function ManagerCheckinPage() {
  const params = useParams();
  const newcomerId = params.id as string;
  const [tab, setTab] = useState("fit");
  const [ratings, setRatings] = useState<Record<string, number[]>>({
    fit:  [0, 0, 0, 0, 0],
    ace:  [0, 0, 0, 0, 0],
    tie:  [0, 0, 0, 0, 0],
  });
  const [notes, setNotes] = useState<Record<string, string>>({ fit: "", ace: "", tie: "" });
  const [submitted, setSubmitted] = useState(false);

  const activeBucket = buckets.find(b => b.id === tab)!;

  function setRating(bucketId: string, idx: number, val: number) {
    setRatings(prev => ({
      ...prev,
      [bucketId]: prev[bucketId].map((v, i) => i === idx ? val : v),
    }));
  }

  function bucketScore(id: string) {
    const vals = ratings[id].filter(v => v > 0);
    if (!vals.length) return null;
    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 20);
  }

  const allFilled = buckets.every(b => ratings[b.id].every(v => v > 0));

  async function handleSubmit() {
    if (!allFilled) return;
    try {
      await fetch("/api/manager/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newcomer_id: newcomerId,
          scores_fit: ratings.fit,
          scores_ace: ratings.ace,
          scores_tie: ratings.tie,
          month_number: new Date().getMonth() + 1,
          notes: Object.values(notes).filter(Boolean).join("\n"),
        }),
      });
    } catch { /* API may not be available in dev */ }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <PageShell nav={<NavBar role="manager" active="My Team" />}>
        <Card style={{ textAlign: "center", padding: "48px 32px" }}>
          <div style={{ width: 56, height: 56, borderRadius: 99, background: "#EAF4EF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <span style={{ fontSize: 24 }}>✓</span>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A", marginBottom: 8 }}>Check-in submitted</h2>
          <p style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 24 }}>Sofia's evaluation for March 2026 has been recorded. She will be notified.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            {buckets.map(b => {
              const score = bucketScore(b.id);
              return (
                <div key={b.id} style={{ background: b.bg, borderRadius: 12, padding: "14px 20px", textAlign: "center" }}>
                  <p style={{ fontSize: 22, fontWeight: 700, color: b.color }}>{score ?? "—"}%</p>
                  <p style={{ fontSize: 11, color: "#6B6B6B", marginTop: 2 }}>{b.label}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell nav={<NavBar role="manager" active="My Team" />}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A", marginBottom: 4 }}>Manager check-in</h2>
        <p style={{ fontSize: 13, color: "#6B6B6B" }}>Sofia Martínez · March 2026 · Day 18</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Bucket tabs */}
          <div style={{ display: "flex", gap: 6 }}>
            {buckets.map(b => {
              const score = bucketScore(b.id);
              const filled = ratings[b.id].every(v => v > 0);
              return (
                <button
                  key={b.id}
                  onClick={() => setTab(b.id)}
                  style={{
                    flex: 1, padding: "10px 12px", borderRadius: 12, border: "none", cursor: "pointer",
                    background: tab === b.id ? b.color : "#F5F4F0",
                    textAlign: "left", transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 5, background: tab === b.id ? "#FFFFFF22" : b.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 8, fontWeight: 800, color: tab === b.id ? "#FFFFFF" : b.color }}>{b.num}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: tab === b.id ? "#FFFFFF" : "#0A0A0A" }}>{b.label}</span>
                  </div>
                  {filled && score !== null
                    ? <p style={{ fontSize: 11, color: tab === b.id ? "#FFFFFF99" : "#6B6B6B" }}>{score}% rated</p>
                    : <p style={{ fontSize: 11, color: tab === b.id ? "#FFFFFF66" : "#AEABA3" }}>Not rated yet</p>
                  }
                </button>
              );
            })}
          </div>

          {/* Questions */}
          <Card>
            <SectionLabel>{activeBucket.label} — Rate each statement (1–5)</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {activeBucket.questions.map((q, i) => (
                <div key={i}>
                  <p style={{ fontSize: 13, color: "#0A0A0A", marginBottom: 8, lineHeight: 1.5 }}>{q}</p>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[1, 2, 3, 4, 5].map(val => {
                      const selected = ratings[activeBucket.id][i] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => setRating(activeBucket.id, i, val)}
                          style={{
                            width: 44, height: 44, borderRadius: 10, border: "none", cursor: "pointer",
                            fontWeight: 700, fontSize: 14,
                            background: selected ? activeBucket.color : "#F5F4F0",
                            color: selected ? "#FFFFFF" : "#6B6B6B",
                            transition: "all 0.12s",
                          }}
                        >
                          {val}
                        </button>
                      );
                    })}
                    <div style={{ marginLeft: 8, display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 10, color: "#AEABA3" }}>1 = Not at all</span>
                      <span style={{ fontSize: 10, color: "#AEABA3" }}>5 = Fully</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", marginBottom: 6 }}>Additional notes (optional)</p>
              <textarea
                value={notes[activeBucket.id]}
                onChange={e => setNotes(prev => ({ ...prev, [activeBucket.id]: e.target.value }))}
                placeholder="Any observations about Sofia's progress in this area..."
                style={{
                  width: "100%", minHeight: 80, borderRadius: 10, border: "1px solid #E2E0DA",
                  padding: "10px 12px", fontSize: 12, color: "#0A0A0A", resize: "vertical",
                  fontFamily: "inherit", background: "#FAFAF8", outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </Card>

          <button
            onClick={handleSubmit}
            style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none", cursor: allFilled ? "pointer" : "not-allowed",
              background: allFilled ? "#0A0A0A" : "#E2E0DA",
              color: allFilled ? "#FFFFFF" : "#AEABA3",
              fontSize: 14, fontWeight: 700, transition: "all 0.15s",
            }}
          >
            {allFilled ? "Submit evaluation" : "Complete all sections to submit"}
          </button>
        </div>

        {/* Right — comparison */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Card>
            <SectionLabel>Your rating vs. Sofia's self-score</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {buckets.map(b => {
                const managerScore = bucketScore(b.id);
                const selfScore = sofiaScores[b.id as keyof typeof sofiaScores];
                const gap = managerScore !== null ? managerScore - selfScore : null;
                return (
                  <div key={b.id} style={{ background: "#F5F4F0", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                      <div style={{ width: 16, height: 16, borderRadius: 4, background: b.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 7, fontWeight: 800, color: b.color }}>{b.num}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#0A0A0A" }}>{b.label}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: "#6B6B6B" }}>Sofia's self</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#0A0A0A" }}>{selfScore}%</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: "#6B6B6B" }}>Your rating</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: b.color }}>{managerScore !== null ? `${managerScore}%` : "—"}</span>
                    </div>
                    {gap !== null && (
                      <div style={{
                        background: Math.abs(gap) > 15 ? "#FEF3E2" : "#EAF4EF",
                        borderRadius: 8, padding: "5px 8px", textAlign: "center",
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: Math.abs(gap) > 15 ? "#B7791F" : "#2D6A4F" }}>
                          {gap > 0 ? "+" : ""}{gap} pts divergence
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          <Card style={{ background: "#ECECEA", border: "1px solid #DDDBD5" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#AEABA3", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Tip</p>
            <p style={{ fontSize: 12, color: "#0A0A0A", lineHeight: 1.6 }}>
              A gap of more than 15 points between your rating and Sofia's self-score warrants a 1:1 conversation to align expectations.
            </p>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
