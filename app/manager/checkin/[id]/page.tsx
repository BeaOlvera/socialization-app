"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { NavBar, PageShell, Card, SectionLabel, BucketTag } from "@/components/ui";
import { EVAL_QUESTIONS } from "@/lib/framework";

const LIKERT_LABELS = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];

interface Task {
  id: string;
  activity: string;
  newcomer_name: string;
  dimension: string;
  due_date: string | null;
  builds_on: string | null;
  output: string | null;
  who: string | null;
  format: string | null;
  duration: string | null;
  done: boolean;
}

export default function ManagerCheckinPage() {
  const { id: taskId } = useParams<{ id: string }>();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [notes, setNotes] = useState("");
  const [scores, setScores] = useState<Record<string, number[]>>({ fit: [0,0,0,0,0], ace: [0,0,0,0,0], tie: [0,0,0,0,0] });

  useEffect(() => {
    fetch("/api/manager/my-tasks")
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          const found = data.find((t: Task) => t.id === taskId);
          if (found) setTask(found);
        }
      })
      .finally(() => setLoading(false));
  }, [taskId]);

  const isLikert = task?.activity?.toLowerCase().includes("formal check-in");
  const is1on1 = task?.activity?.toLowerCase().includes("1:1") || task?.activity?.toLowerCase().includes("1-1");

  async function handleComplete() {
    setSubmitting(true);
    // Mark task as done via manager API
    await fetch("/api/manager/my-tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, done: true }),
    });
    setSubmitted(true);
    setSubmitting(false);
  }

  if (loading) {
    return (
      <PageShell nav={<NavBar role="manager" active="My Team" />}>
        <div style={{ textAlign: "center", padding: 60, color: "#6B6B6B" }}>Loading...</div>
      </PageShell>
    );
  }

  if (!task) {
    return (
      <PageShell nav={<NavBar role="manager" active="My Team" />}>
        <div style={{ textAlign: "center", padding: 60 }}>
          <p style={{ fontSize: 16, color: "#6B6B6B" }}>Check-in not found.</p>
          <a href="/manager" style={{ fontSize: 13, color: "#2D6A4F" }}>Back to My Team</a>
        </div>
      </PageShell>
    );
  }

  if (submitted) {
    return (
      <PageShell nav={<NavBar role="manager" active="My Team" />}>
        <Card className="text-center py-10">
          <div style={{ fontSize: 40, marginBottom: 16 }}>&#10003;</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Check-in complete</h3>
          <p style={{ fontSize: 13, color: "#6B6B6B" }}>Your responses have been recorded.</p>
          <button onClick={() => router.push("/manager")} style={{
            marginTop: 20, padding: "10px 24px", borderRadius: 10, border: "none",
            background: "#0A0A0A", color: "#FFF", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            Back to My Team
          </button>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell nav={<NavBar role="manager" active="My Team" />}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        {/* Header */}
        <Card style={{ background: "#EAF4EF", borderLeft: "4px solid #2D6A4F" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#2D6A4F", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Manager Check-in
          </span>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A", marginTop: 4 }}>{task.activity}</h2>
          <p style={{ fontSize: 13, color: "#6B6B6B", marginTop: 4 }}>{task.newcomer_name}</p>
          <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 12, color: "#AEABA3" }}>
            {task.due_date && <span>Due: {task.due_date}</span>}
            {task.duration && <span>Duration: {task.duration}</span>}
            {task.format && <span>Format: {task.format}</span>}
          </div>
        </Card>

        {/* Likert form for formal assessments */}
        {isLikert && (
          <Card>
            <SectionLabel>Rate the newcomer on each statement (1-5)</SectionLabel>
            {(["fit", "ace", "tie"] as const).map(dim => (
              <div key={dim} style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
                  {dim === "fit" ? "FIT - Role Clarity" : dim === "ace" ? "ACE - Task Mastery" : "TIE - Social Acceptance"}
                </p>
                {EVAL_QUESTIONS[dim].map((q, qi) => (
                  <div key={qi} style={{ marginBottom: 12, padding: "10px 12px", background: "#F5F4F0", borderRadius: 8 }}>
                    <p style={{ fontSize: 12, color: "#0A0A0A", marginBottom: 8 }}>{q}</p>
                    <div style={{ display: "flex", gap: 6 }}>
                      {LIKERT_LABELS.map((label, li) => (
                        <button key={li}
                          onClick={() => setScores(prev => ({ ...prev, [dim]: prev[dim].map((s, i) => i === qi ? li + 1 : s) }))}
                          style={{
                            flex: 1, padding: "6px 4px", borderRadius: 6, border: "none", cursor: "pointer",
                            fontSize: 10, fontWeight: 600,
                            background: scores[dim][qi] === li + 1 ? "#0A0A0A" : "#FFFFFF",
                            color: scores[dim][qi] === li + 1 ? "#FFFFFF" : "#6B6B6B",
                          }}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </Card>
        )}

        {/* Notes form for 1:1s and other check-ins */}
        <Card>
          {task.builds_on && (
            <div style={{ background: "#EAF4EF", borderRadius: 8, padding: 12, marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#2D6A4F", marginBottom: 4 }}>Key focus areas</p>
              <p style={{ fontSize: 12, color: "#2D6A4F", lineHeight: 1.6 }}>{task.builds_on}</p>
            </div>
          )}
          <SectionLabel>{isLikert ? "Additional notes (optional)" : "Check-in notes"}</SectionLabel>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Key discussion points, observations, action items..."
            rows={6}
            style={{
              width: "100%", padding: 12, borderRadius: 10, border: "1px solid #E2E0DA",
              fontSize: 13, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit",
            }}
          />
          {task.output && (
            <p style={{ fontSize: 11, color: "#AEABA3", marginTop: 8 }}>Expected output: {task.output}</p>
          )}
        </Card>

        <button onClick={handleComplete} disabled={submitting}
          style={{
            width: "100%", padding: "14px", borderRadius: 12, border: "none", cursor: "pointer",
            background: submitting ? "#E2E0DA" : "#2D6A4F", color: "#FFFFFF",
            fontSize: 14, fontWeight: 700,
          }}>
          {submitting ? "Saving..." : "Complete Check-in"}
        </button>

        <div style={{ textAlign: "center", marginTop: 12 }}>
          <a href="/manager" style={{ fontSize: 13, color: "#6B6B6B", textDecoration: "none" }}>Cancel</a>
        </div>
      </div>
    </PageShell>
  );
}
