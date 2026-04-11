"use client";
import { NavBar, PageShell, Card, StatusDot, Avatar, SectionLabel, TwoCol, BucketTag } from "@/components/ui";
import { useEffect, useState } from "react";
import Link from "next/link";

interface NewcomerRow {
  id: string;
  department: string;
  position: string;
  start_date: string;
  status: string;
  current_phase: string;
  user: { name: string; email: string };
}

interface MyTask {
  id: string;
  activity: string;
  due_date: string | null;
  done: boolean;
  newcomer_name: string;
  dimension: string;
  type: string;
}

export default function ManagerHome() {
  const [newcomers, setNewcomers] = useState<NewcomerRow[]>([]);
  const [myTasks, setMyTasks] = useState<MyTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/manager/newcomers").then(r => r.json()),
      fetch("/api/manager/my-tasks").then(r => r.ok ? r.json() : []),
    ]).then(([nData, tData]) => {
      if (Array.isArray(nData)) setNewcomers(nData);
      if (Array.isArray(tData)) setMyTasks(tData);
    }).finally(() => setLoading(false));
  }, []);

  function daysSince(startDate: string) {
    const diff = Date.now() - new Date(startDate).getTime();
    return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }

  const pendingTasks = myTasks.filter(t => !t.done);

  const left = <>
    <div className="space-y-1">
      <h2 className="text-xl font-bold">My Team</h2>
      <p className="text-sm text-[#6B6B6B]">{newcomers.length} active newcomer{newcomers.length !== 1 ? "s" : ""}</p>
    </div>

    {/* Pending tasks for me */}
    {pendingTasks.length > 0 && (
      <div>
        <SectionLabel>Your upcoming check-ins</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {pendingTasks.slice(0, 5).map(t => (
            <Link key={t.id} href={`/manager/checkin/${t.id}`} style={{ textDecoration: "none" }}>
              <Card className="hover:border-[#2D6A4F] transition-colors cursor-pointer" style={{ borderLeft: "4px solid #2D6A4F" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A" }}>{t.activity}</p>
                    <p style={{ fontSize: 12, color: "#6B6B6B" }}>
                      {t.newcomer_name} {t.due_date ? `· Due: ${t.due_date}` : ""}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <BucketTag bucket={t.dimension} />
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 6, background: "#2D6A4F", color: "#FFF" }}>Open</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    )}
  </>;

  const right = <>
    <div>
      <SectionLabel>Active newcomers ({newcomers.length})</SectionLabel>
      {loading ? (
        <p style={{ fontSize: 13, color: "#6B6B6B" }}>Loading...</p>
      ) : newcomers.length === 0 ? (
        <Card><p style={{ fontSize: 13, color: "#6B6B6B" }}>No newcomers assigned to you.</p></Card>
      ) : (
        <div className="space-y-2">
          {newcomers.map(n => (
            <Link key={n.id} href={`/manager/newcomer/${n.id}`} style={{ textDecoration: "none" }}>
              <Card className="hover:border-[#0A0A0A] transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <Avatar initials={n.user?.name?.split(" ").map((w: string) => w[0]).join("") || "?"} size={40} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm">{n.user?.name || "Unknown"}</p>
                      <StatusDot status={n.status as "green" | "yellow" | "red"} />
                    </div>
                    <p className="text-xs text-[#6B6B6B]">
                      {n.position || "No position"} · {n.department || "No dept"} · Day {daysSince(n.start_date)}
                    </p>
                    <p className="text-xs text-[#AEABA3] mt-1">Phase: {n.current_phase}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  </>;

  return (
    <PageShell nav={<NavBar role="manager" active="My Team" />}>
      <TwoCol left={left} right={right} />
    </PageShell>
  );
}
