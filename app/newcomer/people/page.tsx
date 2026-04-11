"use client";
import { NavBar, PageShell, Card, Avatar, SectionLabel } from "@/components/ui";
import { MessageCircle, Coffee } from "lucide-react";
import { useEffect, useState } from "react";

interface TeamMember {
  id: string;
  name: string;
  role: string | null;
  relation: string;
  avatar: string | null;
}

export default function PeoplePage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/newcomer/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.teamMembers) setTeam(data.teamMembers);
        else if (data?.team_members) setTeam(data.team_members);
      })
      .finally(() => setLoading(false));
  }, []);

  function initials(name: string) {
    return name.split(" ").map(w => w[0]).join("");
  }

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
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#1A1A2E] flex items-center justify-center text-white font-bold text-sm border-2 border-white">
              You
            </div>
            <span className="text-xs text-white mt-1 font-medium">You</span>
          </div>
          <div className="flex gap-6 items-start">
            {team.slice(0, 4).map((p, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-0.5 h-4 bg-[#333]" />
                <Avatar initials={p.avatar || initials(p.name)} size={36} />
                <span className="text-[10px] text-[#6B6B6B] text-center w-14 leading-tight">{p.name.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* My team */}
      <div>
        <SectionLabel>My team</SectionLabel>
        {loading ? (
          <p style={{ fontSize: 13, color: "#6B6B6B" }}>Loading...</p>
        ) : team.length === 0 ? (
          <Card><p style={{ fontSize: 13, color: "#6B6B6B" }}>No team members assigned yet.</p></Card>
        ) : (
          <div className="space-y-2">
            {team.map(p => (
              <Card key={p.id} className="flex items-center gap-3">
                <Avatar initials={p.avatar || initials(p.name)} size={40} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{p.name}</p>
                  <p className="text-xs text-[#6B6B6B]">{p.role || "Team member"}</p>
                  <span className="text-[10px] font-medium text-[#1A1A2E] bg-[#EEEEF5] px-1.5 py-0.5 rounded mt-0.5 inline-block">
                    {p.relation.replace("_", " ")}
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
        )}
      </div>
    </PageShell>
  );
}
