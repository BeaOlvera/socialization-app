"use client";
import { NavBar, PageShell, Card, ScoreRing, SectionLabel, Avatar, BucketTag, TwoCol } from "@/components/ui";
import { newcomer, buckets, todayActions } from "@/lib/mock";
import Link from "next/link";

export default function NewcomerHome() {
  const overall = Math.round(buckets.reduce((s, b) => s + b.score, 0) / buckets.length);

  const left = <>
    {/* Header */}
    <Card style={{ background: "#ECECEA", border: "1px solid #DDDBD5" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 10, color: "#AEABA3", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
            Day {newcomer.day} of 365
          </p>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A", marginBottom: 4 }}>Good morning, Sofia.</h2>
          <p style={{ fontSize: 13, color: "#6B6B6B" }}>{newcomer.role} · {newcomer.company}</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <ScoreRing score={overall} size={64} />
          <p style={{ fontSize: 10, color: "#AEABA3", marginTop: 4 }}>Overall</p>
        </div>
      </div>
      <div style={{ marginTop: 16, background: "#DDDBD5", borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A" }}>Phase: Arrival</span>
          <span style={{ fontSize: 11, color: "#6B6B6B" }}>Day 1–30</span>
        </div>
        <div style={{ height: 6, background: "#C8C6C0", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", background: "#0A0A0A", borderRadius: 99, width: `${(newcomer.day / 30) * 100}%` }} />
        </div>
      </div>
    </Card>

    {/* Today */}
    <div>
      <SectionLabel>Today&apos;s actions</SectionLabel>
      <div className="space-y-2">
        {todayActions.map((a, i) => (
          <Card key={i} className={`flex items-start gap-3 ${a.urgent ? "border-[#1A1A2E]" : ""}`}>
            <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${a.urgent ? "bg-[#1A1A2E]" : "bg-[#E2E0DA]"}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#0A0A0A]">{a.text}</p>
              <BucketTag bucket={a.bucket} />
            </div>
            {a.urgent && <span className="text-xs font-semibold text-[#1A1A2E] flex-shrink-0">Priority</span>}
          </Card>
        ))}
      </div>
    </div>
  </>;

  const right = <>
    {/* Three buckets */}
    <div>
      <SectionLabel>My three tracks</SectionLabel>
      <div className="space-y-2">
        {buckets.map(b => (
          <Link key={b.id} href="/newcomer/buckets">
            <Card className="flex items-center gap-4 hover:border-[#0A0A0A] transition-colors cursor-pointer">
              <div className="w-9 h-9 rounded-lg bg-[#F5F4F0] flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-[#6B6B6B]">{b.number}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[#0A0A0A]">{b.label}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-1.5 bg-[#F5F4F0] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{
                        width: `${b.score}%`,
                        background: b.score >= 70 ? "#2D6A4F" : b.score >= 50 ? "#B7791F" : "#9B2335"
                      }} />
                  </div>
                  <span className="text-xs text-[#6B6B6B] flex-shrink-0">{b.score}%</span>
                </div>
              </div>
              <span className="text-[#AEABA3] text-sm">›</span>
            </Card>
          </Link>
        ))}
      </div>
    </div>

    {/* Buddy */}
    <div>
      <SectionLabel>Your buddy</SectionLabel>
      <Card className="flex items-center gap-3">
        <Avatar initials="JO" size={44} />
        <div className="flex-1">
          <p className="font-semibold text-sm">{newcomer.buddy.name}</p>
          <p className="text-xs text-[#6B6B6B]">{newcomer.buddy.role}</p>
        </div>
        <button className="text-sm font-medium text-[#1A1A2E] bg-[#EEEEF5] px-3 py-1.5 rounded-lg hover:bg-[#DDD] transition-colors">
          Message
        </button>
      </Card>
    </div>
  </>;

  return (
    <PageShell nav={<NavBar role="newcomer" active="Home" />}>
      <TwoCol left={left} right={right} />
    </PageShell>
  );
}
