"use client";
import { useState } from "react";
import { NavBar, PageShell, Card, SectionLabel } from "@/components/ui";

type Person = {
  id: string; name: string; role: string; dept: string; avatar: string;
  tag?: string; tagColor?: string; tagBg?: string; children?: Person[];
};

const org: Person = {
  id: "ceo", name: "Sarah Chen", role: "CEO", dept: "Executive", avatar: "SC",
  children: [
    {
      id: "claire", name: "Claire Bennett", role: "VP Marketing", dept: "Marketing", avatar: "CB",
      tag: "Your manager", tagColor: "#2D6A4F", tagBg: "#EAF4EF",
      children: [
        { id: "sofia", name: "Sofia Martínez", role: "Mkt. Specialist", dept: "Marketing", avatar: "SM", tag: "You", tagColor: "#1A1A2E", tagBg: "#EEEEF5" },
        { id: "james", name: "James Okafor", role: "Sr. Mkt. Manager", dept: "Marketing", avatar: "JO", tag: "Buddy", tagColor: "#B7791F", tagBg: "#FEF3E2" },
        { id: "maya", name: "Maya Torres", role: "Content Lead", dept: "Marketing", avatar: "MT" },
        { id: "raj", name: "Raj Patel", role: "Brand Designer", dept: "Marketing", avatar: "RP" },
      ],
    },
    {
      id: "jp", name: "James Park", role: "VP Product", dept: "Product", avatar: "JP",
      children: [
        { id: "lc", name: "Lisa Chen", role: "Product Manager", dept: "Product", avatar: "LC" },
        { id: "ar", name: "Alex Rivera", role: "UX Lead", dept: "Product", avatar: "AR" },
      ],
    },
    {
      id: "al", name: "Ana Lima", role: "VP Sales", dept: "Sales", avatar: "AL",
      children: [
        { id: "bm", name: "Ben Morris", role: "Account Exec", dept: "Sales", avatar: "BM" },
        { id: "ps", name: "Priya Shah", role: "Sales Manager", dept: "Sales", avatar: "PS" },
        { id: "tn", name: "Tom Nielsen", role: "Account Exec", dept: "Sales", avatar: "TN" },
      ],
    },
    {
      id: "dr", name: "David Ross", role: "CFO", dept: "Finance", avatar: "DR",
      children: [
        { id: "km", name: "Kate Murphy", role: "Finance Mgr", dept: "Finance", avatar: "KM" },
      ],
    },
  ],
};

const deptColors: Record<string, { color: string; bg: string }> = {
  Executive: { color: "#1A1A2E", bg: "#EEEEF5" },
  Marketing: { color: "#9B2335", bg: "#FBEAEC" },
  Product:   { color: "#2D6A4F", bg: "#EAF4EF" },
  Sales:     { color: "#B7791F", bg: "#FEF3E2" },
  Finance:   { color: "#6B6B6B", bg: "#F5F4F0" },
};

const CW = 80;  // card width
const GAP = 4;   // gap between cards
const COL_GAP = 10; // gap between VP columns
const CH = 82;  // card height (fixed for alignment)

function NodeCard({ person, selected, onSelect }: { person: Person; selected: string | null; onSelect: (p: Person) => void }) {
  const dc = deptColors[person.dept] || deptColors.Finance;
  const isSelected = selected === person.id;
  const isMe = person.id === "sofia";
  return (
    <button onClick={() => onSelect(person)} style={{
      background: isMe ? "#0A0A0A" : "#FFFFFF",
      border: isSelected ? `2px solid ${dc.color}` : isMe ? "2px solid #0A0A0A" : "1px solid #E2E0DA",
      borderRadius: 10, padding: "6px 4px", cursor: "pointer", textAlign: "center",
      width: CW, minWidth: CW, height: CH, flexShrink: 0, transition: "all 0.15s",
      boxShadow: isSelected ? `0 0 0 3px ${dc.bg}` : "none",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      position: "relative",
    }}>
      {/* Tag dot indicator */}
      {person.tag && (
        <div style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, borderRadius: 99, background: isMe ? "#FFF" : person.tagColor, border: isMe ? "none" : `2px solid ${person.tagBg}` }} />
      )}
      <div style={{ width: 24, height: 24, borderRadius: 99, marginBottom: 3, background: isMe ? "#FFFFFF22" : dc.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ fontSize: 8, fontWeight: 800, color: isMe ? "#FFF" : dc.color }}>{person.avatar}</span>
      </div>
      <p style={{ fontSize: 9, fontWeight: 700, color: isMe ? "#FFF" : "#0A0A0A", lineHeight: 1.15, marginBottom: 1, overflow: "hidden", textOverflow: "ellipsis", width: "100%", padding: "0 2px" }}>{person.name}</p>
      <p style={{ fontSize: 7, color: isMe ? "#AAA" : "#6B6B6B", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", width: "100%", padding: "0 2px" }}>{person.role}</p>
    </button>
  );
}

/** Width of a VP column = max(VP card, sum of children cards + gaps) */
function colWidth(vp: Person): number {
  const childCount = vp.children?.length || 0;
  const childrenWidth = childCount * CW + Math.max(0, childCount - 1) * GAP;
  return Math.max(CW, childrenWidth);
}

export default function OrgPage() {
  const [selected, setSelected] = useState<Person | null>(null);
  const vps = org.children || [];

  function handleSelect(p: Person) {
    setSelected(prev => prev?.id === p.id ? null : p);
  }

  const totalWidth = vps.reduce((s, vp) => s + colWidth(vp), 0) + (vps.length - 1) * COL_GAP;

  return (
    <PageShell nav={<NavBar role="newcomer" active="Org" />}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A", marginBottom: 4 }}>Org Chart</h2>
        <p style={{ fontSize: 13, color: "#6B6B6B" }}>Meridian Group · Click any person to see their details</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, alignItems: "start" }}>
        <Card style={{ overflowX: "auto", padding: "24px 16px" }}>
          <div style={{ width: totalWidth, margin: "0 auto" }}>

            {/* ROW 0: CEO */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 0 }}>
              <NodeCard person={org} selected={selected?.id || null} onSelect={handleSelect} />
            </div>

            {/* Vertical line from CEO */}
            <div style={{ width: 2, height: 16, background: "#E2E0DA", margin: "0 auto" }} />

            {/* ROW 1: VP horizontal bar — single continuous line from first center to last center */}
            <div style={{ display: "flex", height: 2 }}>
              {vps.map((vp, i) => {
                const w = colWidth(vp) + (i < vps.length - 1 ? COL_GAP : 0);
                const isFirst = i === 0;
                const isLast = i === vps.length - 1;
                return (
                  <div key={vp.id + "-hbar"} style={{ width: w, display: "flex", height: 2 }}>
                    <div style={{ flex: 1, background: isFirst ? "transparent" : "#E2E0DA" }} />
                    <div style={{ flex: 1, background: isLast ? "transparent" : "#E2E0DA" }} />
                  </div>
                );
              })}
            </div>

            {/* ROW 2: VP vertical drops + cards */}
            <div style={{ display: "flex", gap: COL_GAP }}>
              {vps.map(vp => {
                const w = colWidth(vp);
                return (
                  <div key={vp.id} style={{ width: w, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 2, height: 16, background: "#E2E0DA" }} />
                    <NodeCard person={vp} selected={selected?.id || null} onSelect={handleSelect} />
                  </div>
                );
              })}
            </div>

            {/* ROW 3: VP→children vertical lines + connector bars */}
            <div style={{ display: "flex", gap: COL_GAP }}>
              {vps.map(vp => {
                const w = colWidth(vp);
                const kids = vp.children || [];
                return (
                  <div key={vp.id + "-conn"} style={{ width: w }}>
                    {kids.length > 0 && (
                      <>
                        <div style={{ width: 2, height: 16, background: "#E2E0DA", margin: "0 auto" }} />
                        {kids.length > 1 && (
                          <div style={{ display: "flex", height: 2 }}>
                            {kids.map((_, ci) => {
                              const isFirst = ci === 0;
                              const isLast = ci === kids.length - 1;
                              return (
                                <div key={ci} style={{ flex: 1, display: "flex", height: 2 }}>
                                  <div style={{ flex: 1, background: isFirst ? "transparent" : "#E2E0DA" }} />
                                  <div style={{ flex: 1, background: isLast ? "transparent" : "#E2E0DA" }} />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ROW 4: Team member cards (all at same level) */}
            <div style={{ display: "flex", gap: COL_GAP }}>
              {vps.map(vp => {
                const w = colWidth(vp);
                const kids = vp.children || [];
                return (
                  <div key={vp.id + "-kids"} style={{ width: w, display: "flex", gap: GAP, justifyContent: "center" }}>
                    {kids.map(kid => (
                      <div key={kid.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        {kids.length > 1 && <div style={{ width: 2, height: 16, background: "#E2E0DA" }} />}
                        <NodeCard person={kid} selected={selected?.id || null} onSelect={handleSelect} />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

          </div>
        </Card>

        {/* Detail panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {selected ? (
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 99, background: deptColors[selected.dept]?.bg || "#F5F4F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: deptColors[selected.dept]?.color || "#6B6B6B" }}>{selected.avatar}</span>
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#0A0A0A" }}>{selected.name}</p>
                  <p style={{ fontSize: 12, color: "#6B6B6B" }}>{selected.role}</p>
                </div>
              </div>
              {selected.tag && <span style={{ display: "inline-block", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99, background: selected.tagBg, color: selected.tagColor, marginBottom: 14 }}>{selected.tag}</span>}
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
                {selected.id === "sofia" && <div style={{ marginTop: 8, background: "#EEEEF5", borderRadius: 10, padding: "10px 12px" }}><p style={{ fontSize: 11, color: "#6B6B6B", lineHeight: 1.6 }}>Day 18 · Arrival phase · On track across FIT · ACE · TIE.</p></div>}
                {selected.id === "claire" && <div style={{ marginTop: 8, background: "#EAF4EF", borderRadius: 10, padding: "10px 12px" }}><p style={{ fontSize: 11, color: "#2D6A4F", lineHeight: 1.6 }}>Sofia's direct manager. Monthly check-ins scheduled.</p></div>}
                {selected.id === "james" && <div style={{ marginTop: 8, background: "#FEF3E2", borderRadius: 10, padding: "10px 12px" }}><p style={{ fontSize: 11, color: "#B7791F", lineHeight: 1.6 }}>Sofia's assigned buddy. First meeting completed on Day 3.</p></div>}
              </div>
            </Card>
          ) : (
            <Card style={{ background: "#F5F4F0", border: "1px solid #E2E0DA" }}>
              <p style={{ fontSize: 12, color: "#AEABA3", textAlign: "center", padding: "16px 0" }}>Click any person to see their details</p>
            </Card>
          )}
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
