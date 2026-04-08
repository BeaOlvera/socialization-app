"use client";
import { NavBar, PageShell, Card, StatusDot } from "@/components/ui";
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
  manager: { name: string } | null;
}

export default function HRNewcomersPage() {
  const [newcomers, setNewcomers] = useState<NewcomerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/hr/newcomers")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setNewcomers(data); })
      .finally(() => setLoading(false));
  }, []);

  function daysSince(startDate: string) {
    const diff = Date.now() - new Date(startDate).getTime();
    return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }

  const sorted = [...newcomers].sort((a, b) => {
    const order = { red: 0, yellow: 1, green: 2 };
    return (order[a.status as keyof typeof order] ?? 2) - (order[b.status as keyof typeof order] ?? 2);
  });

  return (
    <PageShell nav={<NavBar role="hr" active="All Newcomers" />}>
      <div className="space-y-1">
        <h2 className="text-xl font-bold">All Newcomers</h2>
        <p className="text-sm text-[#6B6B6B]">{newcomers.length} active · sorted by risk level</p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#6B6B6B" }}>Loading...</div>
      ) : newcomers.length === 0 ? (
        <Card><p style={{ fontSize: 13, color: "#6B6B6B" }}>No newcomers yet.</p></Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sorted.map(n => (
            <Link key={n.id} href={`/hr/newcomers/${n.id}`} style={{ textDecoration: "none" }}>
              <Card className="hover:border-[#0A0A0A] transition-colors cursor-pointer">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A" }}>{n.user?.name || "Unknown"}</p>
                    <p style={{ fontSize: 12, color: "#6B6B6B" }}>
                      {n.department || "No dept"} · {n.position || "No position"} · Day {daysSince(n.start_date)}
                    </p>
                    <p style={{ fontSize: 11, color: "#AEABA3", marginTop: 2 }}>
                      Manager: {n.manager?.name || "Unassigned"} · Phase: {n.current_phase}
                    </p>
                  </div>
                  <StatusDot status={n.status as "green" | "yellow" | "red"} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
