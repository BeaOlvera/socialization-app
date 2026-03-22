"use client";
import { NavBar, PageShell, Card, StatusDot, Avatar, SectionLabel, TwoCol } from "@/components/ui";
import { managerNewcomers } from "@/lib/mock";
import Link from "next/link";

export default function ManagerHome() {
  const left = <>
    <div className="space-y-1">
      <h2 className="text-xl font-bold">My Team</h2>
      <p className="text-sm text-[#6B6B6B]">Claire Bennett · VP Marketing</p>
    </div>

    <Card style={{ background: "#FBEAEC", border: "1px solid #9B2335" }}>
      <p className="text-xs font-semibold text-[#9B2335] uppercase tracking-widest mb-1">Action needed</p>
      <p className="text-sm text-[#9B2335]">Yuki Tanaka shows signs of social isolation — low Bucket 3 score for 3 consecutive weeks.</p>
    </Card>

    <div>
      <SectionLabel>Pending from you</SectionLabel>
      <Card className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-sm">Monthly evaluation — Sofia Martínez</p>
          <p className="text-xs text-[#6B6B6B] mt-0.5">Due March 25 · Takes 3 minutes</p>
        </div>
        <button className="text-sm font-medium text-white bg-[#0A0A0A] px-3 py-1.5 rounded-lg hover:bg-[#1A1A2E] transition-colors">
          Start
        </button>
      </Card>
    </div>
  </>;

  const right = <>
    <div>
      <SectionLabel>Active newcomers ({managerNewcomers.length})</SectionLabel>
      <div className="space-y-2">
        {managerNewcomers.map((n, i) => (
          <Link key={i} href={i === 0 ? "/manager/newcomer/sofia" : "#"}>
            <Card className="hover:border-[#0A0A0A] transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <Avatar initials={n.name.split(" ").map(w => w[0]).join("")} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-sm">{n.name}</p>
                    <StatusDot status={n.status as "green" | "yellow" | "red"} />
                  </div>
                  <p className="text-xs text-[#6B6B6B]">{n.role} · Day {n.day}</p>
                  <div className="mt-2.5 space-y-1.5">
                    {(["job", "org", "people"] as const).map(b => (
                      <div key={b} className="flex items-center gap-2">
                        <span className="text-[10px] text-[#AEABA3] w-12 flex-shrink-0 capitalize">{b}</span>
                        <div className="flex-1 h-1.5 bg-[#F5F4F0] rounded-full overflow-hidden">
                          <div className="h-full rounded-full"
                            style={{
                              width: `${n.scores[b]}%`,
                              background: n.scores[b] >= 70 ? "#2D6A4F" : n.scores[b] >= 50 ? "#B7791F" : "#9B2335"
                            }} />
                        </div>
                        <span className="text-[10px] text-[#AEABA3] w-7 text-right">{n.scores[b]}%</span>
                      </div>
                    ))}
                  </div>
                  {n.flag && (
                    <p className="text-xs text-[#B7791F] mt-2 bg-[#FEF3E2] px-2 py-1 rounded">
                      ⚠ {n.flag}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  </>;

  return (
    <PageShell nav={<NavBar role="manager" active="My Team" />}>
      <TwoCol left={left} right={right} />
    </PageShell>
  );
}
