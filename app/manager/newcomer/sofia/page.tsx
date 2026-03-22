"use client";
import { NavBar, PageShell, Card, StatusDot, Avatar, SectionLabel, ScoreRing, TwoCol } from "@/components/ui";
import { managerNewcomers } from "@/lib/mock";

const sofia = managerNewcomers[0];

const nudges = [
  { text: "Review 90-day goals together in your next 1:1 — she may need more clarity on KPIs." },
  { text: "Introduce Sofia to 1–2 people outside Marketing this week — her people score is the lowest." },
];

const qualQuotes = [
  { q: "What has surprised you most?", a: "How fast-paced everything is. I'm learning a lot but sometimes feel I'm missing context." },
  { q: "What feels most unclear?", a: "I'm still not sure exactly how my work connects to the broader strategy." },
];

const history = [
  { month: "Month 1 (Feb)", self: 42, manager: 60 },
  { month: "Month 1 wk3 (now)", self: 48, manager: 65 },
];

export default function SofiaPage() {
  const left = <>
    <Card>
      <div className="flex items-start gap-3">
        <Avatar initials="SM" size={48} />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-bold">{sofia.name}</h2>
            <StatusDot status="yellow" />
          </div>
          <p className="text-sm text-[#6B6B6B]">{sofia.role} · Day {sofia.day} · {sofia.phase} phase</p>
        </div>
      </div>
    </Card>

    <Card style={{ background: "#FEF3E2", border: "1px solid #B7791F" }}>
      <p className="text-xs font-semibold text-[#B7791F] uppercase tracking-widest mb-1">Divergence detected</p>
      <p className="text-sm text-[#B7791F] leading-relaxed">
        Sofia rates her own adjustment at <strong>{sofia.selfScore}%</strong> — you rated her at <strong>{sofia.managerScore}%</strong>.
        This gap suggests she may be struggling in ways not yet visible. A direct conversation is recommended.
      </p>
    </Card>

    {/* Score comparison */}
    <Card>
      <SectionLabel>Score comparison</SectionLabel>
      <div className="flex justify-around mb-5">
        <div className="text-center">
          <ScoreRing score={sofia.selfScore} size={72} />
          <p className="text-xs text-[#6B6B6B] mt-2">Self-rating</p>
        </div>
        <div className="flex items-center text-[#E2E0DA] text-2xl font-light">vs</div>
        <div className="text-center">
          <ScoreRing score={sofia.managerScore} size={72} />
          <p className="text-xs text-[#6B6B6B] mt-2">Your rating</p>
        </div>
      </div>
      <div className="space-y-3">
        {(["job", "org", "people"] as const).map(b => {
          const labels = { job: "My Job", org: "My Organization", people: "My People" };
          return (
            <div key={b}>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-medium">{labels[b]}</span>
                <span className="text-xs text-[#6B6B6B]">{sofia.scores[b]}%</span>
              </div>
              <div className="h-2 bg-[#F5F4F0] rounded-full overflow-hidden">
                <div className="h-full rounded-full"
                  style={{
                    width: `${sofia.scores[b]}%`,
                    background: sofia.scores[b] >= 70 ? "#2D6A4F" : sofia.scores[b] >= 50 ? "#B7791F" : "#9B2335"
                  }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  </>;

  const right = <>
    {/* What she said */}
    <div>
      <SectionLabel>What Sofia said</SectionLabel>
      <div className="space-y-2">
        {qualQuotes.map((q, i) => (
          <Card key={i}>
            <p className="text-xs font-semibold text-[#AEABA3] mb-1.5">{q.q}</p>
            <p className="text-sm text-[#0A0A0A] italic leading-relaxed">&quot;{q.a}&quot;</p>
          </Card>
        ))}
      </div>
    </div>

    {/* Nudges */}
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

    {/* Trend */}
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
    <PageShell nav={<NavBar role="manager" active="Sofia M." />}>
      <TwoCol left={left} right={right} />
    </PageShell>
  );
}
