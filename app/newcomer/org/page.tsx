"use client";
import { useEffect, useState } from "react";
import { NavBar, PageShell, Card, SectionLabel, Avatar } from "@/components/ui";

interface TeamMember {
  id: string;
  name: string;
  role: string | null;
  relation: string;
  avatar: string | null;
  email: string | null;
}

const RELATION_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  manager: { label: "Your manager", color: "#2D6A4F", bg: "#EAF4EF" },
  buddy: { label: "Your buddy", color: "#B7791F", bg: "#FEF3E2" },
  peer: { label: "Peer", color: "#6B6B6B", bg: "#F5F4F0" },
  key_contact: { label: "Key contact", color: "#1A1A2E", bg: "#EEEEF5" },
};

export default function OrgPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/newcomer/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.team_members) setTeam(data.team_members);
      })
      .finally(() => setLoading(false));
  }, []);

  function initials(name: string) {
    return name.split(" ").map(w => w[0]).join("");
  }

  const manager = team.find(t => t.relation === "manager");
  const buddy = team.find(t => t.relation === "buddy");
  const peers = team.filter(t => t.relation === "peer");
  const keyContacts = team.filter(t => t.relation === "key_contact");

  if (loading) {
    return (
      <PageShell nav={<NavBar role="newcomer" active="Org Chart" />}>
        <div style={{ textAlign: "center", padding: 60, color: "#6B6B6B" }}>Loading...</div>
      </PageShell>
    );
  }

  if (team.length === 0) {
    return (
      <PageShell nav={<NavBar role="newcomer" active="Org Chart" />}>
        <div style={{ textAlign: "center", padding: 60 }}>
          <p style={{ fontSize: 16, color: "#6B6B6B" }}>Org chart not available yet.</p>
          <p style={{ fontSize: 13, color: "#AEABA3" }}>Your team connections will appear here once set up.</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell nav={<NavBar role="newcomer" active="Org Chart" />}>
      <div className="space-y-1">
        <h2 className="text-xl font-bold">Your Network</h2>
        <p className="text-sm text-[#6B6B6B]">The people around you — your local org structure.</p>
      </div>

      {/* Visual org tree */}
      <Card style={{ background: "#0A0A0A", border: "none", overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "20px 0" }}>
          {/* Manager */}
          {manager && (
            <>
              <PersonNode name={manager.name} role={manager.role} avatar={manager.avatar || initials(manager.name)}
                tag="Your manager" tagColor="#2D6A4F" tagBg="#EAF4EF" />
              <div style={{ width: 2, height: 20, background: "#333" }} />
            </>
          )}

          {/* You */}
          <div style={{
            padding: "12px 20px", borderRadius: 12, background: "#1A1A2E",
            border: "2px solid #EEEEF5", textAlign: "center",
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 99, background: "#EEEEF5",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 8px", fontWeight: 700, fontSize: 14, color: "#1A1A2E",
            }}>
              You
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#EEEEF5", letterSpacing: "0.05em" }}>YOU</span>
          </div>

          {/* Branches */}
          {(peers.length > 0 || buddy || keyContacts.length > 0) && (
            <>
              <div style={{ width: 2, height: 20, background: "#333" }} />
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
                {buddy && (
                  <PersonNode name={buddy.name} role={buddy.role} avatar={buddy.avatar || initials(buddy.name)}
                    tag="Buddy" tagColor="#B7791F" tagBg="#FEF3E2" />
                )}
                {peers.map(p => (
                  <PersonNode key={p.id} name={p.name} role={p.role} avatar={p.avatar || initials(p.name)}
                    tag="Peer" tagColor="#6B6B6B" tagBg="#333" />
                ))}
                {keyContacts.map(p => (
                  <PersonNode key={p.id} name={p.name} role={p.role} avatar={p.avatar || initials(p.name)}
                    tag="Key contact" tagColor="#EEEEF5" tagBg="#1A1A2E" />
                ))}
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Detailed list */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Manager & Buddy */}
        <Card>
          <SectionLabel>Direct support</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {manager && <TeamRow member={manager} />}
            {buddy && <TeamRow member={buddy} />}
            {!manager && !buddy && <p style={{ fontSize: 12, color: "#AEABA3" }}>Not assigned yet</p>}
          </div>
        </Card>

        {/* Peers & Key contacts */}
        <Card>
          <SectionLabel>Team & key contacts</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[...peers, ...keyContacts].map(p => (
              <TeamRow key={p.id} member={p} />
            ))}
            {peers.length === 0 && keyContacts.length === 0 && (
              <p style={{ fontSize: 12, color: "#AEABA3" }}>No peers or contacts assigned yet</p>
            )}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}

function PersonNode({ name, role, avatar, tag, tagColor, tagBg }: {
  name: string; role: string | null; avatar: string; tag: string; tagColor: string; tagBg: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{
        width: 44, height: 44, borderRadius: 99, background: "#333",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: 13, color: "#FFFFFF",
      }}>
        {avatar}
      </div>
      <span style={{ fontSize: 11, color: "#FFFFFF", fontWeight: 600, textAlign: "center", maxWidth: 80 }}>
        {name.split(" ")[0]}
      </span>
      {role && <span style={{ fontSize: 9, color: "#6B6B6B", textAlign: "center", maxWidth: 80 }}>{role}</span>}
      <span style={{
        fontSize: 8, fontWeight: 700, padding: "2px 6px", borderRadius: 10,
        background: tagBg, color: tagColor,
      }}>
        {tag}
      </span>
    </div>
  );
}

function TeamRow({ member }: { member: TeamMember }) {
  const config = RELATION_CONFIG[member.relation] || RELATION_CONFIG.peer;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
      <Avatar initials={member.avatar || member.name.split(" ").map(w => w[0]).join("")} size={36} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A" }}>{member.name}</p>
        <p style={{ fontSize: 11, color: "#6B6B6B" }}>{member.role || "Team member"}</p>
      </div>
      <span style={{
        fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 10,
        background: config.bg, color: config.color,
      }}>
        {config.label}
      </span>
    </div>
  );
}
