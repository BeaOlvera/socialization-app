"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { NavBar, PageShell, Card, BucketTag } from "@/components/ui";

interface Task {
  id: string;
  activity: string;
  label: string;
  phase: string;
  dimension: string;
  subdimension: string | null;
  estimated_time: string | null;
  who: string | null;
  days: string | null;
  output: string | null;
  builds_on: string | null;
  done: boolean;
  type: string;
}

const DIM_INFO: Record<string, { label: string; color: string; bg: string }> = {
  fit: { label: "FIT · Role Clarity", color: "#1A1A2E", bg: "#EEEEF5" },
  ace: { label: "ACE · Task Mastery", color: "#2D6A4F", bg: "#EAF4EF" },
  tie: { label: "TIE · Social Acceptance", color: "#9B2335", bg: "#FBEAEC" },
};

export default function ActivityDetail() {
  const { taskId } = useParams<{ taskId: string }>();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

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

  async function toggleDone() {
    if (!task) return;
    setMarking(true);
    const res = await fetch("/api/newcomer/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: task.id, done: !task.done }),
    });
    if (res.ok) {
      setTask(prev => prev ? { ...prev, done: !prev.done } : prev);
    }
    setMarking(false);
  }

  if (loading) {
    return (
      <PageShell nav={<NavBar role="newcomer" active="Home" />}>
        <div style={{ textAlign: "center", padding: 60, color: "#6B6B6B" }}>Loading...</div>
      </PageShell>
    );
  }

  if (!task) {
    return (
      <PageShell nav={<NavBar role="newcomer" active="Home" />}>
        <div style={{ textAlign: "center", padding: 60 }}>
          <p style={{ fontSize: 16, color: "#6B6B6B" }}>Activity not found.</p>
          <a href="/newcomer" style={{ fontSize: 13, color: "#1A1A2E" }}>← Back</a>
        </div>
      </PageShell>
    );
  }

  const dim = DIM_INFO[task.dimension] || DIM_INFO.fit;

  return (
    <PageShell nav={<NavBar role="newcomer" active="Home" />}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>

        {/* Header */}
        <Card style={{ background: dim.bg, borderLeft: `4px solid ${dim.color}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <BucketTag bucket={task.dimension} />
            {task.subdimension && (
              <span style={{ fontSize: 11, color: "#6B6B6B" }}>{task.subdimension}</span>
            )}
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A", lineHeight: 1.4, marginBottom: 8 }}>
            {task.activity}
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, fontSize: 13, color: "#6B6B6B" }}>
            {task.estimated_time && (
              <span><strong style={{ color: "#AEABA3" }}>Time:</strong> {task.estimated_time}</span>
            )}
            {task.who && (
              <span><strong style={{ color: "#AEABA3" }}>With:</strong> {task.who}</span>
            )}
            {task.days && (
              <span><strong style={{ color: "#AEABA3" }}>When:</strong> {task.days}</span>
            )}
          </div>
        </Card>

        {/* Details */}
        {task.output && (
          <Card>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#AEABA3", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
              Expected Output
            </p>
            <p style={{ fontSize: 14, color: "#0A0A0A", lineHeight: 1.7 }}>{task.output}</p>
          </Card>
        )}

        {task.builds_on && (
          <Card>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#AEABA3", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
              Builds On
            </p>
            <p style={{ fontSize: 14, color: "#0A0A0A", lineHeight: 1.7 }}>{task.builds_on}</p>
          </Card>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button
            onClick={toggleDone}
            disabled={marking}
            style={{
              flex: 1, padding: "14px", borderRadius: 12, border: "none", cursor: "pointer",
              background: task.done ? "#E2E0DA" : "#0A0A0A",
              color: task.done ? "#6B6B6B" : "#FFFFFF",
              fontSize: 14, fontWeight: 700,
            }}
          >
            {marking ? "..." : task.done ? "Undo — mark as not done" : "Mark as done"}
          </button>
        </div>

        {task.done && (
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <p style={{ fontSize: 13, color: "#2D6A4F", fontWeight: 600 }}>Completed</p>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <a href="/newcomer" style={{
            fontSize: 13, fontWeight: 600, color: "#6B6B6B", textDecoration: "none",
          }}>
            ← Back to pre-arrival
          </a>
        </div>
      </div>
    </PageShell>
  );
}
