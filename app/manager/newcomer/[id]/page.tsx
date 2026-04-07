"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { NavBar, PageShell, Card, StatusDot, Avatar, SectionLabel, ScoreRing, TwoCol } from "@/components/ui";
import { managerNewcomers } from "@/lib/mock";
import { DIMENSIONS } from "@/lib/framework";

// Fallback mock data (used when API is unavailable)
const mockNudges = [
  { text: "Review 90-day goals together in your next 1:1 — they may need more clarity on KPIs." },
  { text: "Introduce them to 1–2 people outside their team this week — their TIE score is the lowest." },
];
const mockQualQuotes = [
  { q: "What has surprised you most?", a: "How fast-paced everything is. I'm learning a lot but sometimes feel I'm missing context." },
  { q: "What feels most unclear?", a: "I'm still not sure exactly how my work connects to the broader strategy." },
];
const mockHistory = [
  { month: "Month 1 (Feb)", self: 42, manager: 60 },
  { month: "Month 1 wk3 (now)", self: 48, manager: 65 },
];

export default function NewcomerDetailPage() {
  const params = useParams();
  const id = params.id as string;

  // Try API, fall back to mock (first newcomer)
  const fallback = managerNewcomers[0];
  const [data, setData] = useState(fallback);

  useEffect(() => {
    fetch(`/api/manager/newcomers/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.newcomer) {
          const n = d.newcomer;
          setData({
            name: n.user?.name || fallback.name,
            role: n.position || fallback.role,
            day: n.day || fallback.day,
            phase: n.current_phase || fallback.phase,
            status: n.status || fallback.status,
            scores: { fit: 0, ace: 0, tie: 0, ...d.newcomer },
            selfScore: fallback.selfScore,
            managerScore: fallback.managerScore,
            flag: fallback.flag,
          });
        }
      })
      .catch(() => {}); // fallback to mock
  }, [id]);

  const nudges = mockNudges;
  const qualQuotes = mockQualQuotes;
  const history = mockHistory;

  const left = <>
    <Card>
      <div className="flex items-start gap-3">
        <Avatar initials={data.name.split(" ").map(w => w[0]).join("")} size={48} />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-bold">{data.name}</h2>
            <StatusDot status={data.status as "green" | "yellow" | "red"} />
          </div>
          <p className="text-sm text-[#6B6B6B]">{data.role} · Day {data.day} · {data.phase} phase</p>
        </div>
      </div>
    </Card>

    <Card style={{ background: "#FEF3E2", border: "1px solid #B7791F" }}>
      <p className="text-xs font-semibold text-[#B7791F] uppercase tracking-widest mb-1">Divergence detected</p>
      <p className="text-sm text-[#B7791F] leading-relaxed">
        Self-rating at <strong>{data.selfScore}%</strong> — manager rating at <strong>{data.managerScore}%</strong>.
        This gap suggests they may be struggling in ways not yet visible. A direct conversation is recommended.
      </p>
    </Card>

    <Card>
      <SectionLabel>Score comparison</SectionLabel>
      <div className="flex justify-around mb-5">
        <div className="text-center">
          <ScoreRing score={data.selfScore} size={72} />
          <p className="text-xs text-[#6B6B6B] mt-2">Self-rating</p>
        </div>
        <div className="flex items-center text-[#E2E0DA] text-2xl font-light">vs</div>
        <div className="text-center">
          <ScoreRing score={data.managerScore} size={72} />
          <p className="text-xs text-[#6B6B6B] mt-2">Your rating</p>
        </div>
      </div>
      <div className="space-y-3">
        {(["fit", "ace", "tie"] as const).map(b => {
          const dim = DIMENSIONS[b];
          return (
            <div key={b}>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-medium">{dim.label}</span>
                <span className="text-xs text-[#6B6B6B]">{data.scores[b]}%</span>
              </div>
              <div className="h-2 bg-[#F5F4F0] rounded-full overflow-hidden">
                <div className="h-full rounded-full"
                  style={{
                    width: `${data.scores[b]}%`,
                    background: data.scores[b] >= 70 ? "#2D6A4F" : data.scores[b] >= 50 ? "#B7791F" : "#9B2335"
                  }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  </>;

  const right = <>
    <div>
      <SectionLabel>What they said</SectionLabel>
      <div className="space-y-2">
        {qualQuotes.map((q, i) => (
          <Card key={i}>
            <p className="text-xs font-semibold text-[#AEABA3] mb-1.5">{q.q}</p>
            <p className="text-sm text-[#0A0A0A] italic leading-relaxed">&quot;{q.a}&quot;</p>
          </Card>
        ))}
      </div>
    </div>

    <div>
      <SectionLabel>Suggested actions for you</SectionLabel>
      <div className="space-y-2">
        {nudges.map((n, i) => (
          <Card key={i} className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A2E] mt-2 flex-shrink-0" />
            <p className="text-sm text-[#0A0A0A] leading-relaxed">{n.text}</p>
          </Card>
        ))}
      </div>
    </div>

    <div>
      <SectionLabel>Trend</SectionLabel>
      <Card>
        <div className="space-y-3">
          {history.map((h, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-[#6B6B6B]">{h.month}</span>
                <span className="text-xs text-[#AEABA3]">self {h.self}% · you {h.manager}%</span>
              </div>
              <div className="flex gap-1.5">
                <div className="flex-1 h-2 bg-[#F5F4F0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#B7791F] rounded-full" style={{ width: `${h.self}%` }} />
                </div>
                <div className="flex-1 h-2 bg-[#F5F4F0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#1A1A2E] rounded-full" style={{ width: `${h.manager}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1.5 rounded bg-[#B7791F]" />
            <span className="text-xs text-[#6B6B6B]">Self</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1.5 rounded bg-[#1A1A2E]" />
            <span className="text-xs text-[#6B6B6B]">Manager</span>
          </div>
        </div>
      </Card>
    </div>
  </>;

  return (
    <PageShell nav={<NavBar role="manager" active="My Team" />}>
      <TwoCol left={left} right={right} />
    </PageShell>
  );
}
