"use client";
import Link from "next/link";
import { NavBar, PageShell, Card, StatusDot, Avatar, SectionLabel } from "@/components/ui";
import { hrNewcomers } from "@/lib/mock";

const slugMap: Record<string, string> = {
  "Sofia Martínez": "sofia", "Daniel Cruz": "daniel", "Yuki Tanaka": "yuki",
  "Marcus Webb": "marcus", "Fatima Al-Hassan": "fatima", "Ben Kowalski": "ben",
};

export default function AllNewcomersPage() {
  return (
    <PageShell nav={<NavBar role="hr" active="All Newcomers" />}>
      <div className="space-y-1">
        <h2 className="text-xl font-bold">All Newcomers</h2>
        <p className="text-sm text-[#6B6B6B]">{hrNewcomers.length} active · sorted by risk</p>
      </div>

      <div>
        <SectionLabel>Needs attention first</SectionLabel>
        <div className="space-y-2">
          {[...hrNewcomers]
            .sort((a, b) => {
              const order = { red: 0, yellow: 1, green: 2 };
              return order[a.status as keyof typeof order] - order[b.status as keyof typeof order];
            })
            .map((n, i) => {
              const slug = slugMap[n.name];
              const inner = (
                <Card key={i} style={{ display: "flex", alignItems: "center", gap: 12, cursor: slug ? "pointer" : "default" }}>
                  <Avatar initials={n.name.split(" ").map((w: string) => w[0]).join("")} size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                      <p style={{ fontWeight: 600, fontSize: 13, color: "#0A0A0A" }}>{n.name}</p>
                      <StatusDot status={n.status as "green" | "yellow" | "red"} />
                    </div>
                    <p style={{ fontSize: 11, color: "#6B6B6B" }}>{n.dept} · Day {n.day} · {n.manager}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
                    <div>
                      <p style={{ fontSize: 10, color: "#AEABA3" }}>day</p>
                      <p style={{ fontSize: 17, fontWeight: 700, color: "#0A0A0A" }}>{n.day}</p>
                    </div>
                    {slug && <span style={{ color: "#AEABA3", fontSize: 16 }}>›</span>}
                  </div>
                </Card>
              );
              return slug
                ? <Link key={i} href={`/hr/newcomers/${slug}`} style={{ textDecoration: "none" }}>{inner}</Link>
                : inner;
            })}
        </div>
      </div>
    </PageShell>
  );
}
