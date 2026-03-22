"use client";
import { useState } from "react";
import { NavBar, PageShell, Card, SectionLabel } from "@/components/ui";

type Person = {
  id: string;
  name: string;
  role: string;
  dept: string;
  avatar: string;
  tag?: string;
  tagColor?: string;
  tagBg?: string;
  children?: Person[];
};

const org: Person = {
  id: "ceo",
  name: "Sarah Chen",
  role: "Chief Executive Officer",
  dept: "Executive",
  avatar: "SC",
  children: [
    {
      id: "claire",
      name: "Claire Bennett",
      role: "VP Marketing",
      dept: "Marketing",
      avatar: "CB",
      tag: "Your manager",
      tagColor: "#2D6A4F",
      tagBg: "#EAF4EF",
      children: [
        {
          id: "sofia",
          name: "Sofia Martínez",
          role: "Marketing Specialist",
          dept: "Marketing",
          avatar: "SM",
          tag: "You · Day 18",
          tagColor: "#1A1A2E",
          tagBg: "#EEEEF5",
        },
        {
          id: "james",
          name: "James Okafor",
          role: "Senior Marketing Manager",
          dept: "Marketing",
          avatar: "JO",
          tag: "Your buddy",
          tagColor: "#B7791F",
          tagBg: "#FEF3E2",
        },
        {
          id: "maya",
          name: "Maya Torres",
          role: "Content Lead",
          dept: "Marketing",
          avatar: "MT",
        },
        {
          id: "raj",
          name: "Raj Patel",
          role: "Brand Designer",
          dept: "Marketing",
          avatar: "RP",
        },
      ],
    },
    {
      id: "jp",
      name: "James Park",
      role: "VP Product",
      dept: "Product",
      avatar: "JP",
      children: [
        { id: "lc", name: "Lisa Chen", role: "Product Manager", dept: "Product", avatar: "LC" },
        { id: "ar", name: "Alex Rivera", role: "UX Lead", dept: "Product", avatar: "AR" },
      ],
    },
    {
      id: "al",
      name: "Ana Lima",
      role: "VP Sales",
      dept: "Sales",
      avatar: "AL",
      children: [
        { id: "bm", name: "Ben Morris", role: "Account Executive", dept: "Sales", avatar: "BM" },
        { id: "ps", name: "Priya Shah", role: "Sales Manager", dept: "Sales", avatar: "PS" },
        { id: "tn", name: "Tom Nielsen", role: "Account Executive", dept: "Sales", avatar: "TN" },
      ],
    },
    {
      id: "dr",
      name: "David Ross",
      role: "CFO",
      dept: "Finance",
      avatar: "DR",
      children: [
        { id: "km", name: "Kate Murphy", role: "Finance Manager", dept: "Finance", avatar: "KM" },
      ],
    },
  ],
};

const deptColors: Record<string, { color: string; bg: string }> = {
  Executive: { color: "#1A1A2E", bg: "#EEEEF5" },
  Marketing:  { color: "#9B2335", bg: "#FBEAEC" },
  Product:    { color: "#2D6A4F", bg: "#EAF4EF" },
  Sales:      { color: "#B7791F", bg: "#FEF3E2" },
  Finance:    { color: "#6B6B6B", bg: "#F5F4F0" },
};

function NodeCard({ person, selected, onSelect }: { person: Person; selected: string | null; onSelect: (p: Person) => void }) {
  const dc = deptColors[person.dept] || deptColors.Finance;
  const isSelected = selected === person.id;
  const isMe = person.id === "sofia";

  return (
    <button
      onClick={() => onSelect(person)}
      style={{
        background: isMe ? "#0A0A0A" : "#FFFFFF",
        border: isSelected ? `2px solid ${dc.color}` : isMe ? "2px solid #0A0A0A" : "1px solid #E2E0DA",
        borderRadius: 12,
        padding: "10px 12px",
        cursor: "pointer",
        textAlign: "left",
        width: 148,
        flexShrink: 0,
        transition: "all 0.15s",
        boxShadow: isSelected ? `0 0 0 3px ${dc.bg}` : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 99,
          background: isMe ? "#FFFFFF22" : dc.bg,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <span style={{ fontSize: 9, fontWeight: 800, color: isMe ? "#FFFFFF" : dc.color }}>{person.avatar}</span>
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: isMe ? "#FFFFFF" : "#0A0A0A", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {person.name}
          </p>
          <p style={{ fontSize: 9, color: isMe ? "#AAAAAA" : "#AEABA3", lineHeight: 1.3 }}>{person.dept}</p>
        </div>
      </div>
      <p style={{ fontSize: 10, color: isMe ? "#CCCCCC" : "#6B6B6B", lineHeight: 1.3, marginBottom: person.tag ? 6 : 0 }}>
        {person.role}
      </p>
      {person.tag && (
        <span style={{
          fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 99,
          background: isMe ? "#FFFFFF22" : person.tagBg,
          color: isMe ? "#FFFFFF" : person.tagColor,
        }}>
          {person.tag}
        </span>
      )}
    </button>
  );
}

// Draws a connector line between parent and children
function Connector({ count }: { count: number }) {
  if (count === 0) return null;
  const childWidth = 148;
  const gap = 12;
  const totalWidth = count * childWidth + (count - 1) * gap;
  const segW = childWidth + gap;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: totalWidth }}>
      {/* vertical stem down from parent */}
      <div style={{ width: 2, height: 16, background: "#E2E0DA" }} />
      {count > 1 ? (
        <>
          {/* horizontal bar */}
          <div style={{ position: "relative", width: "100%", height: 2, background: "#E2E0DA" }} />
          {/* vertical drops to each child */}
          <div style={{ display: "flex", gap: `${gap}px`, width: "100%" }}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} style={{ width: childWidth, display: "flex", justifyContent: "center" }}>
                <div style={{ width: 2, height: 16, background: "#E2E0DA" }} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ width: 2, height: 16, background: "#E2E0DA" }} />
      )}
    </div>
  );
}

export default function OrgPage() {
  const [selected, setSelected] = useState<Person | null>(null);

  const vpList = org.children || [];
  const marketingTeam = vpList.find(v => v.id === "claire")?.children || [];

  function handleSelect(p: Person) {
    setSelected(prev => prev?.id === p.id ? null : p);
  }

  return (
    <PageShell nav={<NavBar role="newcomer" active="Org" />}>

      {/* Header */}
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A", marginBottom: 4 }}>Org Chart</h2>
        <p style={{ fontSize: 13, color: "#6B6B6B" }}>Meridian Group · Click any person to see their details</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, alignItems: "start" }}>

        {/* Chart area */}
        <Card style={{ overflowX: "auto", padding: "28px 24px" }}>

          {/* Level 0 — CEO */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 0 }}>
            <NodeCard person={org} selected={selected?.id || null} onSelect={handleSelect} />

            {/* connector to VPs */}
            <Connector count={vpList.length} />

            {/* Level 1 — VPs */}
            <div style={{ display: "flex", gap: 12 }}>
              {vpList.map(vp => (
                <div key={vp.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <NodeCard person={vp} selected={selected?.id || null} onSelect={handleSelect} />

                  {/* connector to children */}
                  {vp.children && vp.children.length > 0 && (
                    <>
                      <Connector count={vp.children.length} />
                      {/* Level 2 — team members */}
                      <div style={{ display: "flex", gap: 12 }}>
                        {vp.children.map(member => (
                          <NodeCard key={member.id} person={member} selected={selected?.id || null} onSelect={handleSelect} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Detail panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {selected ? (
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 99,
                  background: deptColors[selected.dept]?.bg || "#F5F4F0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: deptColors[selected.dept]?.color || "#6B6B6B" }}>
                    {selected.avatar}
                  </span>
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#0A0A0A" }}>{selected.name}</p>
                  <p style={{ fontSize: 12, color: "#6B6B6B" }}>{selected.role}</p>
                </div>
              </div>
              {selected.tag && (
                <span style={{
                  display: "inline-block", fontSize: 11, fontWeight: 600,
                  padding: "3px 10px", borderRadius: 99,
                  background: selected.tagBg, color: selected.tagColor,
                  marginBottom: 14,
                }}>
                  {selected.tag}
                </span>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "#AEABA3" }}>Department</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A" }}>{selected.dept}</span>
                </div>
                {selected.children && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: "#AEABA3" }}>Direct reports</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A" }}>{selected.children.length}</span>
                  </div>
                )}
                {selected.id === "sofia" && (
                  <div style={{ marginTop: 8, background: "#EEEEF5", borderRadius: 10, padding: "10px 12px" }}>
                    <p style={{ fontSize: 11, color: "#6B6B6B", lineHeight: 1.6 }}>
                      Day 18 · Arrival phase · On track across all three buckets.
                    </p>
                  </div>
                )}
                {selected.id === "claire" && (
                  <div style={{ marginTop: 8, background: "#EAF4EF", borderRadius: 10, padding: "10px 12px" }}>
                    <p style={{ fontSize: 11, color: "#2D6A4F", lineHeight: 1.6 }}>
                      Sofia's direct manager. Monthly check-ins scheduled. Divergence alert active.
                    </p>
                  </div>
                )}
                {selected.id === "james" && (
                  <div style={{ marginTop: 8, background: "#FEF3E2", borderRadius: 10, padding: "10px 12px" }}>
                    <p style={{ fontSize: 11, color: "#B7791F", lineHeight: 1.6 }}>
                      Sofia's assigned buddy. First meeting completed on Day 3.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card style={{ background: "#F5F4F0", border: "1px solid #E2E0DA" }}>
              <p style={{ fontSize: 12, color: "#AEABA3", textAlign: "center", padding: "16px 0" }}>
                Click any person to see their details
              </p>
            </Card>
          )}

          {/* Legend */}
          <Card>
            <SectionLabel>Departments</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {Object.entries(deptColors).map(([dept, c]) => (
                <div key={dept} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: c.bg, border: `1.5px solid ${c.color}22` }} />
                  <span style={{ fontSize: 12, color: "#6B6B6B" }}>{dept}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* My connections */}
          <Card>
            <SectionLabel>Your key connections</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { name: "Claire Bennett", role: "Manager", color: "#2D6A4F", bg: "#EAF4EF", avatar: "CB" },
                { name: "James Okafor", role: "Buddy", color: "#B7791F", bg: "#FEF3E2", avatar: "JO" },
                { name: "Maya Torres", role: "Colleague", color: "#9B2335", bg: "#FBEAEC", avatar: "MT" },
              ].map(p => (
                <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 99, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 9, fontWeight: 800, color: p.color }}>{p.avatar}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A" }}>{p.name}</p>
                    <p style={{ fontSize: 10, color: "#AEABA3" }}>{p.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

    </PageShell>
  );
}
