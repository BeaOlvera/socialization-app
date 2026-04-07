"use client";
import { useState } from "react";
import { PageShell, Card, SectionLabel } from "@/components/ui";
import Link from "next/link";
import { NavBar } from "@/components/ui";

type Role = "newcomer" | "manager" | "hr";

const notifications: Record<Role, {
  id: string; type: "alert" | "reminder" | "info"; title: string; body: string;
  time: string; href?: string; read: boolean;
}[]> = {
  newcomer: [
    { id: "n1", type: "reminder", title: "Monthly check-in due", body: "Your March self-evaluation is due in 3 days. It takes about 5 minutes.", time: "Today", href: "/newcomer/evaluation", read: false },
    { id: "n2", type: "alert", title: "TIE score needs attention", body: "Your social integration score (35%) is below the target. Consider reaching out to 2 new colleagues this week.", time: "2 days ago", href: "/newcomer/buckets", read: false },
    { id: "n3", type: "info", title: "Manager check-in scheduled", body: "Claire Bennett has scheduled a 1:1 for Thursday March 26 at 10:00 AM.", time: "3 days ago", read: false },
    { id: "n4", type: "reminder", title: "Task pending: Complete HubSpot module", body: "You have an uncompleted task in ACE · Task Mastery. It's quick — 5 minutes.", time: "5 days ago", href: "/newcomer/timeline", read: true },
    { id: "n5", type: "info", title: "Welcome to Arrival phase", body: "You're on Day 18 of 30 in your Arrival phase. Keep going!", time: "18 days ago", read: true },
  ],
  manager: [
    { id: "m1", type: "alert", title: "Yuki Tanaka — flight risk", body: "Yuki's TIE score dropped to 28%. Social isolation detected. Immediate check-in recommended.", time: "Today", href: "/manager/newcomer/sofia", read: false },
    { id: "m2", type: "alert", title: "Divergence alert — Sofia Martínez", body: "17-point gap between manager and self scores. Schedule a check-in to align perceptions.", time: "Yesterday", href: "/manager/checkin/sofia", read: false },
    { id: "m3", type: "reminder", title: "March evaluations pending", body: "2 of your 3 newcomers are awaiting your monthly evaluation. Due by March 31.", time: "2 days ago", href: "/manager/checkin/sofia", read: false },
    { id: "m4", type: "info", title: "Daniel Cruz — Integration phase", body: "Daniel moved into Integration phase today (Day 31). New milestones are now active.", time: "5 days ago", read: true },
    { id: "m5", type: "info", title: "Sofia completed Welcome flow", body: "Sofia Martínez completed her pre-arrival documents and welcome steps on Day 1.", time: "18 days ago", read: true },
  ],
  hr: [
    { id: "h1", type: "alert", title: "2 newcomers at high risk", body: "Yuki Tanaka and one other show critical adjustment risk. Review immediately.", time: "Today", href: "/hr/newcomers/yuki", read: false },
    { id: "h2", type: "reminder", title: "March check-ins: 4 overdue", body: "4 newcomers have not completed their March self-evaluation. Send reminders.", time: "Yesterday", href: "/hr/newcomers", read: false },
    { id: "h3", type: "alert", title: "Average TIE score declining", body: "Company-wide social acceptance average dropped 3 pts this month. Review cohort strategy.", time: "3 days ago", href: "/hr", read: false },
    { id: "h4", type: "info", title: "Ben Kowalski joined the program", body: "New newcomer added: Ben Kowalski (Engineering, Day 12). Assigned to Ravi Sharma.", time: "12 days ago", read: true },
    { id: "h5", type: "info", title: "Marcus Webb — Stabilization phase", body: "Marcus advanced to Stabilization phase (Day 134). On track across FIT · ACE · TIE.", time: "4 days ago", read: true },
  ],
};

const typeConfig = {
  alert:    { color: "#9B2335", bg: "#FBEAEC", dot: "#9B2335",  label: "Alert" },
  reminder: { color: "#B7791F", bg: "#FEF3E2", dot: "#B7791F",  label: "Reminder" },
  info:     { color: "#2D6A4F", bg: "#EAF4EF", dot: "#2D6A4F",  label: "Info" },
};

export default function NotificationsPage() {
  const [role, setRole] = useState<Role>("newcomer");
  const [items, setItems] = useState(notifications);

  const list = items[role];
  const unread = list.filter(n => !n.read).length;

  function markRead(id: string) {
    setItems(prev => ({
      ...prev,
      [role]: prev[role].map(n => n.id === id ? { ...n, read: true } : n),
    }));
  }

  function markAllRead() {
    setItems(prev => ({
      ...prev,
      [role]: prev[role].map(n => ({ ...n, read: true })),
    }));
  }

  const roleColors: Record<Role, string> = {
    newcomer: "#1A1A2E", manager: "#2D6A4F", hr: "#9B2335",
  };

  return (
    <PageShell nav={<NavBar role={role} active="Home" />}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A", marginBottom: 4 }}>Notifications</h2>
          <p style={{ fontSize: 13, color: "#6B6B6B" }}>{unread} unread</p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            style={{ fontSize: 12, fontWeight: 600, color: "#6B6B6B", background: "#F5F4F0", border: "1px solid #E2E0DA", borderRadius: 8, padding: "6px 14px", cursor: "pointer" }}
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Role switcher */}
      <Card style={{ padding: "12px 16px" }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#AEABA3", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>View as role</p>
        <div style={{ display: "flex", gap: 6 }}>
          {(["newcomer", "manager", "hr"] as Role[]).map(r => {
            const labels = { newcomer: "Newcomer", manager: "Manager", hr: "HR Admin" };
            const counts = notifications[r].filter(n => !items[r].find(x => x.id === n.id)?.read && !notifications[r].find(x => x.id === n.id)?.read).length;
            const unreadCount = items[r].filter(n => !n.read).length;
            return (
              <button
                key={r}
                onClick={() => setRole(r)}
                style={{
                  flex: 1, padding: "8px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                  background: role === r ? "#0A0A0A" : "#F5F4F0",
                  color: role === r ? "#FFFFFF" : "#6B6B6B",
                  fontSize: 12, fontWeight: 600, transition: "all 0.15s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
              >
                {labels[r]}
                {unreadCount > 0 && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, minWidth: 18, height: 18,
                    background: role === r ? "#FFFFFF22" : roleColors[r],
                    color: "#FFFFFF", borderRadius: 99, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px",
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Alerts first */}
      {list.some(n => n.type === "alert" && !n.read) && (
        <div>
          <SectionLabel>Alerts</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {list.filter(n => n.type === "alert" && !n.read).map(n => (
              <NotifCard key={n.id} n={n} onRead={markRead} />
            ))}
          </div>
        </div>
      )}

      {/* Reminders */}
      {list.some(n => n.type === "reminder" && !n.read) && (
        <div>
          <SectionLabel>Reminders</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {list.filter(n => n.type === "reminder" && !n.read).map(n => (
              <NotifCard key={n.id} n={n} onRead={markRead} />
            ))}
          </div>
        </div>
      )}

      {/* Info + read */}
      {list.some(n => (n.type === "info" && !n.read) || n.read) && (
        <div>
          <SectionLabel>Earlier</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {list.filter(n => n.type === "info" || n.read).map(n => (
              <NotifCard key={n.id} n={n} onRead={markRead} />
            ))}
          </div>
        </div>
      )}

    </PageShell>
  );
}

function NotifCard({ n, onRead }: {
  n: { id: string; type: "alert" | "reminder" | "info"; title: string; body: string; time: string; href?: string; read: boolean };
  onRead: (id: string) => void;
}) {
  const tc = typeConfig[n.type];

  const inner = (
    <Card
      style={{
        opacity: n.read ? 0.6 : 1,
        borderLeft: n.read ? "1px solid #E2E0DA" : `3px solid ${tc.dot}`,
        padding: "14px 16px",
        cursor: n.href ? "pointer" : "default",
        transition: "opacity 0.2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
            {!n.read && <div style={{ width: 7, height: 7, borderRadius: 99, background: tc.dot, flexShrink: 0 }} />}
            <span style={{ fontSize: 10, fontWeight: 700, color: tc.color, background: tc.bg, padding: "2px 7px", borderRadius: 99 }}>
              {tc.label}
            </span>
            <span style={{ fontSize: 10, color: "#AEABA3" }}>{n.time}</span>
          </div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A", marginBottom: 3 }}>{n.title}</p>
          <p style={{ fontSize: 12, color: "#6B6B6B", lineHeight: 1.5 }}>{n.body}</p>
        </div>
        {!n.read && (
          <button
            onClick={(e) => { e.preventDefault(); onRead(n.id); }}
            style={{ fontSize: 10, color: "#AEABA3", background: "none", border: "none", cursor: "pointer", flexShrink: 0, padding: "2px 6px" }}
          >
            ✕
          </button>
        )}
      </div>
    </Card>
  );

  return n.href ? <Link href={n.href} style={{ textDecoration: "none" }}>{inner}</Link> : inner;
}
