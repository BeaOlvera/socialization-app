"use client";
import { NavBar, PageShell, Card, Avatar, SectionLabel } from "@/components/ui";
import { myTeam } from "@/lib/mock";
import { MessageCircle, Coffee } from "lucide-react";

const suggested = [
  { name: "Ana Lima", role: "Finance Business Partner", reason: "Key contact for budget approvals in Marketing", avatar: "AL" },
  { name: "Carlos Mendez", role: "Head of Product", reason: "Your campaigns will need close alignment with Product", avatar: "CM" },
  { name: "Nina Johansson", role: "HR Business Partner", reason: "Your go-to for any people-related questions", avatar: "NJ" },
];

export default function PeoplePage() {
  return (
    <PageShell nav={<NavBar role="newcomer" active="My People" />}>
      <div className="space-y-1">
        <h2 className="text-xl font-bold">My People</h2>
        <p className="text-sm text-[#6B6B6B]">Build your network — one conversation at a time.</p>
      </div>

      {/* Relationship map visual */}
      <Card style={{ background: "#0A0A0A", border: "1px solid #0A0A0A", overflow: "hidden" }}>
        <p className="text-xs font-semibold tracking-widest text-[#444] uppercase mb-4">Relationship map</p>
        <div className="flex flex-col items-center gap-3 py-2">
          {/* You */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#1A1A2E] flex items-center justify-center text-white font-bold text-sm border-2 border-white">
              SM
            </div>
            <span className="text-xs text-white mt-1 font-medium">You</span>
          </div>
          {/* Lines */}
          <div className="flex gap-6 items-start">
            {myTeam.slice(0, 4).map((p, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-0.5 h-4 bg-[#333]" />
                <Avatar initials={p.avatar} size={36} />
                <span className="text-[10px] text-[#6B6B6B] text-center w-14 leading-tight">{p.name.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* My team */}
      <div>
        <SectionLabel>My team</SectionLabel>
        <div className="space-y-2">
          {myTeam.map((p, i) => (
            <Card key={i} className="flex items-center gap-3">
              <Avatar initials={p.avatar} size={40} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{p.name}</p>
                <p className="text-xs text-[#6B6B6B]">{p.role}</p>
                <span className="text-[10px] font-medium text-[#1A1A2E] bg-[#EEEEF5] px-1.5 py-0.5 rounded mt-0.5 inline-block">
                  {p.relation}
                </span>
              </div>
              <div className="flex gap-1.5">
                <button className="p-2 rounded-lg bg-[#F5F4F0] hover:bg-[#E2E0DA] transition-colors">
                  <MessageCircle size={14} className="text-[#6B6B6B]" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Suggested */}
      <div>
        <SectionLabel>Suggested connections</SectionLabel>
        <div className="space-y-2">
          {suggested.map((p, i) => (
            <Card key={i} className="flex items-start gap-3 border-dashed">
              <Avatar initials={p.avatar} size={40} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{p.name}</p>
                <p className="text-xs text-[#6B6B6B]">{p.role}</p>
                <p className="text-xs text-[#AEABA3] mt-1 leading-relaxed">{p.reason}</p>
              </div>
              <button className="flex items-center gap-1 text-xs font-medium text-[#1A1A2E] bg-[#EEEEF5] px-2.5 py-1.5 rounded-lg hover:bg-[#DDD] transition-colors flex-shrink-0 mt-1">
                <Coffee size={11} />
                Chat
              </button>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
