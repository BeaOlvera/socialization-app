"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { NavBar, PageShell, Card, SectionLabel } from "@/components/ui";
import { EVAL_QUESTIONS } from "@/lib/framework";

const LIKERT_LABELS = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];

interface Task {
  id: string;
  activity: string;
  dimension: string;
  phase: string;
  assigned_to: string;
  format: string | null;
  duration: string | null;
  output: string | null;
  builds_on: string | null;
  who: string | null;
  done: boolean;
}

// Determine check-in form type from activity name
function detectFormType(activity: string, assignedTo: string): "self-likert" | "self-likert-interview" | "manager-likert" | "manager-notes" | "buddy-log" | "hr-review" | "event" {
  const a = activity.toLowerCase();
  if (a.includes("formal check-in (self)") || a.includes("formal check-in (self")) return "self-likert-interview";
  if (a.includes("formal check-in (manager)")) return "manager-likert";
  if (a.includes("self check-in") || a.includes("self check")) return "self-likert";
  if (a.includes("buddy")) return "buddy-log";
  if (a.includes("hr ") && a.includes("review")) return "hr-review";
  if (a.includes("1:1") || a.includes("1-1")) return "manager-notes";
  if (a.includes("welcome") || a.includes("intro") || a.includes("celebration")) return "event";
  if (assignedTo === "manager") return "manager-notes";
  if (assignedTo === "buddy") return "buddy-log";
  if (assignedTo === "hr") return "hr-review";
  return "self-likert";
}

const formLabels: Record<string, { title: string; color: string; bg: string }> = {
  "self-likert": { title: "Self-Assessment Survey", color: "#1A1A2E", bg: "#EEEEF5" },
  "self-likert-interview": { title: "Self-Assessment + AI Interview", color: "#1A1A2E", bg: "#EEEEF5" },
  "manager-likert": { title: "Manager Assessment", color: "#2D6A4F", bg: "#EAF4EF" },
  "manager-notes": { title: "Manager 1:1 Check-in", color: "#2D6A4F", bg: "#EAF4EF" },
  "buddy-log": { title: "Buddy Check-in", color: "#B7791F", bg: "#FEF3E2" },
  "hr-review": { title: "HR Formal Review", color: "#9B2335", bg: "#FBEAEC" },
  "event": { title: "Onboarding Event", color: "#0A0A0A", bg: "#F5F4F0" },
};

export default function CheckinPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [scores, setScores] = useState<Record<string, number[]>>({ fit: [0,0,0,0,0], ace: [0,0,0,0,0], tie: [0,0,0,0,0] });
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetch("/api/newcomer/tasks")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const found = data.find((t: Task) => t.id === taskId);
          if (found) setTask(found);
        }
      })
      .finally(() => setLoading(false));
  }, [taskId]);

  async function handleComplete() {
    setSubmitting(true);

    // Mark task as done
    await fetch("/api/newcomer/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, done: true }),
    });

    // If it's a Likert form, submit scores to checkin API
    if (formType === "self-likert" || formType === "self-likert-interview") {
      await fetch("/api/newcomer/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkin_type: "self",
          scores_fit: scores.fit,
          scores_ace: scores.ace,
          scores_tie: scores.tie,
        }),
      });
    }

    setSubmitted(true);
    setSubmitting(false);
  }

  if (loading) {
    return (
      <PageShell nav={<NavBar role="newcomer" active="Activities" />}>
        <div style={{ textAlign: "center", padding: 60, color: "#6B6B6B" }}>Loading...</div>
      </PageShell>
    );
  }

  if (!task) {
    return (
      <PageShell nav={<NavBar role="newcomer" active="Activities" />}>
        <div style={{ textAlign: "center", padding: 60 }}>
          <p style={{ fontSize: 16, color: "#6B6B6B" }}>Check-in not found.</p>
          <a href="/newcomer/activities" style={{ fontSize: 13, color: "#1A1A2E" }}>← Back to activities</a>
        </div>
      </PageShell>
    );
  }

  const formType = detectFormType(task.activity, task.assigned_to);
  const formInfo = formLabels[formType];

  if (submitted) {
    return (
      <PageShell nav={<NavBar role="newcomer" active="Activities" />}>
        <Card className="text-center py-10">
          <div style={{ fontSize: 40, marginBottom: 16 }}>&#10003;</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Check-in complete</h3>
          <p style={{ fontSize: 13, color: "#6B6B6B", maxWidth: 300, margin: "0 auto" }}>
            Your responses have been recorded.
          </p>
          <button onClick={() => router.push("/newcomer/activities")} style={{
            marginTop: 20, padding: "10px 24px", borderRadius: 10, border: "none",
            background: "#0A0A0A", color: "#FFF", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            Back to activities
          </button>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell nav={<NavBar role="newcomer" active="Activities" />}>
      {/* Header */}
      <Card style={{ background: formInfo.bg, border: `1px solid ${formInfo.color}33` }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: formInfo.color, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {formInfo.title}
        </span>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A", marginTop: 4 }}>{task.activity}</h2>
        {task.builds_on && (
          <p style={{ fontSize: 13, color: "#6B6B6B", marginTop: 6, lineHeight: 1.5 }}>{task.builds_on}</p>
        )}
        <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 12, color: "#AEABA3" }}>
          {task.duration && <span>Duration: {task.duration}</span>}
          {task.who && <span>With: {task.who}</span>}
          {task.format && <span>Format: {task.format}</span>}
        </div>
      </Card>

      {/* SELF LIKERT FORM */}
      {(formType === "self-likert" || formType === "self-likert-interview") && (
        <Card>
          <SectionLabel>Rate yourself on each statement (1-5)</SectionLabel>
          {(["fit", "ace", "tie"] as const).map(dim => (
            <div key={dim} style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
                {dim === "fit" ? "FIT · Role Clarity" : dim === "ace" ? "ACE · Task Mastery" : "TIE · Social Acceptance"}
              </p>
              {EVAL_QUESTIONS[dim].map((q, qi) => (
                <div key={qi} style={{ marginBottom: 12, padding: "10px 12px", background: "#F5F4F0", borderRadius: 8 }}>
                  <p style={{ fontSize: 12, color: "#0A0A0A", marginBottom: 8 }}>{q}</p>
                  <div style={{ display: "flex", gap: 6 }}>
                    {LIKERT_LABELS.map((label, li) => (
                      <button
                        key={li}
                        onClick={() => setScores(prev => ({
                          ...prev,
                          [dim]: prev[dim].map((s, i) => i === qi ? li + 1 : s)
                        }))}
                        style={{
                          flex: 1, padding: "6px 4px", borderRadius: 6, border: "none", cursor: "pointer",
                          fontSize: 10, fontWeight: 600,
                          background: scores[dim][qi] === li + 1 ? "#0A0A0A" : "#FFFFFF",
                          color: scores[dim][qi] === li + 1 ? "#FFFFFF" : "#6B6B6B",
                          transition: "all 0.15s",
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}

          <button
            onClick={handleComplete}
            disabled={submitting || !["fit", "ace", "tie"].every(d => scores[d].every(s => s > 0))}
            style={{
              padding: "12px 24px", borderRadius: 10, border: "none", cursor: "pointer",
              background: submitting ? "#E2E0DA" : "#0A0A0A", color: "#FFFFFF",
              fontSize: 14, fontWeight: 700, width: "100%",
            }}
          >
            {submitting ? "Submitting..." : "Submit Check-in"}
          </button>
        </Card>
      )}

      {/* MANAGER NOTES / 1:1 FORM */}
      {formType === "manager-notes" && (
        <Card>
          <SectionLabel>1:1 Check-in Notes</SectionLabel>
          <p style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 12 }}>
            Use this space to capture key discussion points, actions, and observations from your 1:1.
          </p>
          {task.builds_on && (
            <div style={{ background: "#EAF4EF", borderRadius: 8, padding: 12, marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#2D6A4F", marginBottom: 4 }}>Key focus areas</p>
              <p style={{ fontSize: 12, color: "#2D6A4F", lineHeight: 1.5 }}>{task.builds_on}</p>
            </div>
          )}
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="What did you discuss? Key takeaways, action items, concerns..."
            rows={8}
            style={{
              width: "100%", padding: 12, borderRadius: 10, border: "1px solid #E2E0DA",
              fontSize: 13, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit",
            }}
          />
          <button onClick={handleComplete} disabled={submitting} style={{
            marginTop: 12, padding: "12px 24px", borderRadius: 10, border: "none", cursor: "pointer",
            background: "#0A0A0A", color: "#FFF", fontSize: 14, fontWeight: 700, width: "100%",
          }}>
            {submitting ? "Saving..." : "Complete Check-in"}
          </button>
        </Card>
      )}

      {/* MANAGER LIKERT FORM */}
      {formType === "manager-likert" && (
        <Card>
          <SectionLabel>Rate the newcomer on each statement (1-5)</SectionLabel>
          {(["fit", "ace", "tie"] as const).map(dim => (
            <div key={dim} style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
                {dim === "fit" ? "FIT · Role Clarity" : dim === "ace" ? "ACE · Task Mastery" : "TIE · Social Acceptance"}
              </p>
              {EVAL_QUESTIONS[dim].map((q, qi) => (
                <div key={qi} style={{ marginBottom: 12, padding: "10px 12px", background: "#F5F4F0", borderRadius: 8 }}>
                  <p style={{ fontSize: 12, color: "#0A0A0A", marginBottom: 8 }}>{q}</p>
                  <div style={{ display: "flex", gap: 6 }}>
                    {LIKERT_LABELS.map((label, li) => (
                      <button
                        key={li}
                        onClick={() => setScores(prev => ({
                          ...prev,
                          [dim]: prev[dim].map((s, i) => i === qi ? li + 1 : s)
                        }))}
                        style={{
                          flex: 1, padding: "6px 4px", borderRadius: 6, border: "none", cursor: "pointer",
                          fontSize: 10, fontWeight: 600,
                          background: scores[dim][qi] === li + 1 ? "#0A0A0A" : "#FFFFFF",
                          color: scores[dim][qi] === li + 1 ? "#FFFFFF" : "#6B6B6B",
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
          <button
            onClick={handleComplete}
            disabled={submitting || !["fit", "ace", "tie"].every(d => scores[d].every(s => s > 0))}
            style={{
              padding: "12px 24px", borderRadius: 10, border: "none", cursor: "pointer",
              background: "#0A0A0A", color: "#FFF", fontSize: 14, fontWeight: 700, width: "100%",
            }}
          >
            {submitting ? "Submitting..." : "Submit Assessment"}
          </button>
        </Card>
      )}

      {/* BUDDY LOG */}
      {formType === "buddy-log" && (
        <Card>
          <SectionLabel>Buddy Check-in Log</SectionLabel>
          <p style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 12 }}>
            Quick summary of your informal check-in. How is the newcomer doing?
          </p>
          {task.builds_on && (
            <div style={{ background: "#FEF3E2", borderRadius: 8, padding: 12, marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#B7791F", marginBottom: 4 }}>Topics to cover</p>
              <p style={{ fontSize: 12, color: "#B7791F", lineHeight: 1.5 }}>{task.builds_on}</p>
            </div>
          )}
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="How did it go? Any concerns? Is the newcomer settling in socially?"
            rows={6}
            style={{
              width: "100%", padding: 12, borderRadius: 10, border: "1px solid #E2E0DA",
              fontSize: 13, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit",
            }}
          />
          <button onClick={handleComplete} disabled={submitting} style={{
            marginTop: 12, padding: "12px 24px", borderRadius: 10, border: "none", cursor: "pointer",
            background: "#B7791F", color: "#FFF", fontSize: 14, fontWeight: 700, width: "100%",
          }}>
            {submitting ? "Saving..." : "Log Check-in"}
          </button>
        </Card>
      )}

      {/* HR REVIEW */}
      {formType === "hr-review" && (
        <Card>
          <SectionLabel>HR Formal Review</SectionLabel>
          <p style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 12 }}>
            Structured review of the newcomer's socialization progress.
          </p>
          {task.builds_on && (
            <div style={{ background: "#FBEAEC", borderRadius: 8, padding: 12, marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#9B2335", marginBottom: 4 }}>Review agenda</p>
              <p style={{ fontSize: 12, color: "#9B2335", lineHeight: 1.5 }}>{task.builds_on}</p>
            </div>
          )}
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Review summary: progress, blockers, development plan, risk flags, action items..."
            rows={10}
            style={{
              width: "100%", padding: 12, borderRadius: 10, border: "1px solid #E2E0DA",
              fontSize: 13, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit",
            }}
          />
          {task.output && (
            <p style={{ fontSize: 11, color: "#AEABA3", marginTop: 8 }}>Expected output: {task.output}</p>
          )}
          <button onClick={handleComplete} disabled={submitting} style={{
            marginTop: 12, padding: "12px 24px", borderRadius: 10, border: "none", cursor: "pointer",
            background: "#9B2335", color: "#FFF", fontSize: 14, fontWeight: 700, width: "100%",
          }}>
            {submitting ? "Saving..." : "Complete Review"}
          </button>
        </Card>
      )}

      {/* EVENT (just mark complete) */}
      {formType === "event" && (
        <Card>
          <SectionLabel>Onboarding Event</SectionLabel>
          <p style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 12 }}>{task.activity}</p>
          {task.builds_on && (
            <div style={{ background: "#F5F4F0", borderRadius: 8, padding: 12, marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: "#0A0A0A", lineHeight: 1.5 }}>{task.builds_on}</p>
            </div>
          )}
          {task.output && (
            <p style={{ fontSize: 12, color: "#6B6B6B", marginBottom: 12 }}>Expected outcome: {task.output}</p>
          )}
          <button onClick={handleComplete} disabled={submitting} style={{
            padding: "12px 24px", borderRadius: 10, border: "none", cursor: "pointer",
            background: "#0A0A0A", color: "#FFF", fontSize: 14, fontWeight: 700, width: "100%",
          }}>
            {submitting ? "Marking..." : "Mark as Completed"}
          </button>
        </Card>
      )}
    </PageShell>
  );
}
