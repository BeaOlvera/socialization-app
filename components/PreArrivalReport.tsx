"use client";
import { Card, SectionLabel } from "./ui";

interface Summary {
  available: boolean;
  expectations_profile: string | null;
  career_fit_assessment: string | null;
  embeddedness_baseline: string | null;
  psychological_contract: string | null;
  social_readiness: string | null;
  risk_factors: string[];
  protective_factors: string[];
  recommended_actions: string[];
  flight_risk?: string | null;
  flight_risk_justification?: string | null;
}

export function PreArrivalReport({ summary, showFlightRisk = false, newcomerName }: {
  summary: Summary;
  showFlightRisk?: boolean;
  newcomerName?: string;
}) {
  if (!summary.available) {
    return (
      <Card>
        <div style={{ textAlign: "center", padding: 24 }}>
          <p style={{ fontSize: 14, color: "#6B6B6B" }}>Pre-arrival report not available yet.</p>
          <p style={{ fontSize: 12, color: "#AEABA3", marginTop: 4 }}>
            The interview needs to be completed and analyzed first.
          </p>
        </div>
      </Card>
    );
  }

  const sections = [
    { title: "Expectations", content: summary.expectations_profile, color: "#1A1A2E", bg: "#EEEEF5" },
    { title: "Career Fit", content: summary.career_fit_assessment, color: "#2D6A4F", bg: "#EAF4EF" },
    { title: "Embeddedness Baseline", content: summary.embeddedness_baseline, color: "#1A1A2E", bg: "#EEEEF5" },
    { title: "Psychological Contract", content: summary.psychological_contract, color: "#B7791F", bg: "#FEF3E2" },
    { title: "Social Readiness", content: summary.social_readiness, color: "#9B2335", bg: "#FBEAEC" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <Card style={{ background: "#ECECEA", border: "1px solid #DDDBD5" }}>
        <p style={{ fontSize: 10, color: "#AEABA3", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
          Pre-Arrival Insights
        </p>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A" }}>
          {newcomerName ? `${newcomerName}'s Onboarding Profile` : "Your Onboarding Profile"}
        </h2>
        <p style={{ fontSize: 13, color: "#6B6B6B", marginTop: 4 }}>
          {newcomerName
            ? "Key insights from the pre-arrival interview to help support their onboarding."
            : "Based on your pre-arrival conversation, here's what we learned to help support your onboarding."}
        </p>
      </Card>

      {/* Profile sections */}
      {sections.map(s => s.content && (
        <Card key={s.title}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 4, height: 20, borderRadius: 2, background: s.color }} />
            <SectionLabel>{s.title}</SectionLabel>
          </div>
          <p style={{ fontSize: 14, color: "#0A0A0A", lineHeight: 1.7 }}>{s.content}</p>
        </Card>
      ))}

      {/* Two-column: protective factors + risk factors */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {summary.protective_factors.length > 0 && (
          <Card style={{ background: "#EAF4EF", border: "1px solid #2D6A4F33" }}>
            <SectionLabel>Strengths & Protective Factors</SectionLabel>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: "#2D6A4F", lineHeight: 1.8 }}>
              {summary.protective_factors.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </Card>
        )}
        {summary.risk_factors.length > 0 && (
          <Card style={{ background: "#FEF3E2", border: "1px solid #B7791F33" }}>
            <SectionLabel>Areas to Watch</SectionLabel>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: "#B7791F", lineHeight: 1.8 }}>
              {summary.risk_factors.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </Card>
        )}
      </div>

      {/* Recommended actions */}
      {summary.recommended_actions.length > 0 && (
        <Card style={{ background: "#0A0A0A" }}>
          <SectionLabel>Recommended Onboarding Actions</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {summary.recommended_actions.map((a, i) => (
              <div key={i} style={{ background: "#1A1A1A", borderRadius: 10, padding: "10px 14px" }}>
                <p style={{ fontSize: 13, color: "#FFFFFF", lineHeight: 1.5 }}>
                  <span style={{ color: "#AEABA3", marginRight: 8 }}>{i + 1}.</span>{a}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Flight risk — only for HR and manager */}
      {showFlightRisk && summary.flight_risk && (
        <Card style={{
          background: summary.flight_risk === "high" ? "#FBEAEC" : summary.flight_risk === "moderate" ? "#FEF3E2" : "#EAF4EF",
          border: `1px solid ${summary.flight_risk === "high" ? "#9B2335" : summary.flight_risk === "moderate" ? "#B7791F" : "#2D6A4F"}33`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <SectionLabel>Flight Risk Assessment</SectionLabel>
            <span style={{
              fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
              background: summary.flight_risk === "high" ? "#9B2335" : summary.flight_risk === "moderate" ? "#B7791F" : "#2D6A4F",
              color: "#FFFFFF", textTransform: "uppercase",
            }}>
              {summary.flight_risk}
            </span>
          </div>
          {summary.flight_risk_justification && (
            <p style={{ fontSize: 13, color: "#0A0A0A", lineHeight: 1.7 }}>{summary.flight_risk_justification}</p>
          )}
        </Card>
      )}
    </div>
  );
}
