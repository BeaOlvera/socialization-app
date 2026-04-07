"use client";
import { NavBar, PageShell, Card, ScoreRing, SectionLabel } from "@/components/ui";
import { buckets } from "@/lib/mock";
import { CheckCircle2, Circle } from "lucide-react";

export default function BucketsPage() {
  return (
    <PageShell nav={<NavBar role="newcomer" active="My Journey" />}>
      <div className="space-y-1">
        <h2 className="text-xl font-bold">My Journey</h2>
        <p className="text-sm text-[#6B6B6B]">Three dimensions running in parallel — FIT · ACE · TIE.</p>
      </div>

      {buckets.map((b, bi) => (
        <Card key={b.id}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-xs font-bold text-[#AEABA3] tracking-widest uppercase">{b.number}</span>
              <h3 className="text-lg font-bold mt-0.5">{b.label}</h3>
            </div>
            <ScoreRing score={b.score} size={64} />
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-[#F5F4F0] rounded-full overflow-hidden mb-4">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${b.score}%`,
                background: b.score >= 70 ? "#2D6A4F" : b.score >= 50 ? "#B7791F" : "#9B2335"
              }}
            />
          </div>

          {/* Checklist */}
          <SectionLabel>Progress checklist</SectionLabel>
          <div className="space-y-2.5">
            {b.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                {item.done
                  ? <CheckCircle2 size={16} className="text-[#2D6A4F] flex-shrink-0" />
                  : <Circle size={16} className="text-[#AEABA3] flex-shrink-0" />
                }
                <span className={`text-sm ${item.done ? "text-[#6B6B6B] line-through" : "text-[#0A0A0A]"}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Next step */}
          {bi === 0 && (
            <div className="mt-4 bg-[#EEEEF5] rounded-lg p-3">
              <p className="text-xs font-semibold text-[#1A1A2E] mb-1">Next step</p>
              <p className="text-sm text-[#1A1A2E]">Ask Claire to walk you through your KPIs and how success is measured in your next 1:1.</p>
            </div>
          )}
          {bi === 1 && (
            <div className="mt-4 bg-[#EAF4EF] rounded-lg p-3">
              <p className="text-xs font-semibold text-[#2D6A4F] mb-1">Tip</p>
              <p className="text-sm text-[#2D6A4F]">Find the SOPs and playbooks in Notion — completing one process end-to-end will unlock confidence fast.</p>
            </div>
          )}
          {bi === 2 && (
            <div className="mt-4 bg-[#FBEAEC] rounded-lg p-3">
              <p className="text-xs font-semibold text-[#9B2335] mb-1">Focus area</p>
              <p className="text-sm text-[#9B2335]">Building relationships takes time — but starting early matters most. Try one coffee chat this week.</p>
            </div>
          )}
        </Card>
      ))}
    </PageShell>
  );
}
