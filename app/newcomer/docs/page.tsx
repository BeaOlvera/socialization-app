"use client";
import { useState } from "react";

const docs = [
  {
    id: "welcome-letter",
    category: "Personal",
    icon: "✉",
    title: "Welcome letter from Claire",
    subtitle: "From your manager · 2 min read",
    tag: "New",
    content: {
      type: "letter",
      from: "Claire Bennett, VP Marketing",
      date: "February 28, 2026",
      body: [
        "Dear Sofia,",
        "I am genuinely thrilled to welcome you to the Meridian Group Marketing team. We searched for a long time for the right person for this role, and when we met you, we knew immediately.",
        "Your background in brand strategy and your track record of building campaigns that actually move the needle is exactly what we need right now. We are at an exciting inflection point — we have just launched a new product line and we need someone like you to help us tell that story.",
        "A few things I want you to know before you start:",
        "First — take your time. The first 30 days are for learning, not for proving yourself. Ask every question you have. There are no silly ones.",
        "Second — I am here for you. We will meet every week, and my door (or Slack) is always open. If something is unclear, feels off, or you simply need to think out loud, come to me.",
        "Third — the team is wonderful. You will love James, Priya, and Tom. They are excited to meet you.",
        "See you on March 3. We are ready for you.",
        "Warmly,\nClaire"
      ]
    }
  },
  {
    id: "your-role",
    category: "FIT",
    icon: "01",
    title: "Your role & 90-day plan",
    subtitle: "What success looks like · 5 min read",
    tag: null,
    content: {
      type: "role",
      sections: [
        {
          heading: "Your role in one sentence",
          body: "Lead the development and execution of integrated marketing campaigns that drive brand awareness and pipeline growth for Meridian Group's new product line."
        },
        {
          heading: "Who you report to",
          body: "Claire Bennett, VP Marketing. You will have a weekly 1:1 every Monday at 10am. Claire's leadership style is direct, collaborative, and data-informed."
        },
        {
          heading: "Day 30 — Learn",
          items: [
            "Understand the company's current brand positioning and messaging",
            "Complete all tool onboarding (Slack, Notion, HubSpot, Asana)",
            "Meet every member of your direct team and key cross-functional contacts",
            "Review the last 3 campaign reports and understand what worked and what didn't",
          ]
        },
        {
          heading: "Day 60 — Contribute",
          items: [
            "Lead your first campaign brief from scratch",
            "Present a 90-day marketing calendar to Claire",
            "Own at least one active project end-to-end",
            "Build a working relationship with the Product and Sales teams",
          ]
        },
        {
          heading: "Day 90 — Own",
          items: [
            "Deliver first campaign results with measurable impact",
            "Have a clear view of the Q2 marketing roadmap",
            "Be the go-to person for brand decisions on your product line",
            "Identify one process improvement opportunity",
          ]
        },
        {
          heading: "How your performance will be measured",
          items: [
            "Campaign delivery — on time and on brief",
            "Pipeline contribution from marketing activities",
            "Cross-functional collaboration quality (peer feedback)",
            "Brand consistency across all touchpoints",
          ]
        }
      ]
    }
  },
  {
    id: "culture-guide",
    category: "ACE",
    icon: "02",
    title: "Culture guide",
    subtitle: "How we work at Meridian · 6 min read",
    tag: null,
    content: {
      type: "culture",
      sections: [
        {
          heading: "Who we are",
          body: "Meridian Group was founded in 2008 with a simple idea: financial services don't have to be complicated. We have grown to 450 people across 3 offices and we still believe that. Our clients stay with us because we are straightforward, reliable, and genuinely good at what we do."
        },
        {
          heading: "Our values",
          items: [
            { title: "Integrity first", desc: "We do what we say. Always. Even when it's inconvenient." },
            { title: "Curiosity over certainty", desc: "We ask questions. We test assumptions. We change our minds when the evidence calls for it." },
            { title: "Collaboration without ego", desc: "The best idea wins, regardless of who had it or what their title is." },
            { title: "Clarity is kindness", desc: "We communicate directly and honestly. Vague feedback and unclear expectations cost everyone time." },
          ]
        },
        {
          heading: "How decisions get made",
          body: "We are not a top-down company, but we are not a consensus-by-committee company either. Most decisions are made by the person closest to the problem, with input from stakeholders. Big decisions (budget, strategy, people) go to leadership. When in doubt, ask your manager: 'Is this mine to decide?'"
        },
        {
          heading: "The unwritten rules",
          items: [
            { title: "Meetings start on time", desc: "We respect each other's calendars. Join 1 minute early." },
            { title: "Slack over email", desc: "Email is for external communication. Internally, we use Slack. Keep channels organized." },
            { title: "Docs before meetings", desc: "If you are calling a meeting, share a doc first. We read before we talk." },
            { title: "Cameras on", desc: "For small meetings (under 8 people), cameras on is the norm." },
            { title: "Friday afternoons are sacred", desc: "No new big projects or requests land on Friday afternoons. It is for wrapping up and recharging." },
          ]
        },
        {
          heading: "Our rituals",
          items: [
            { title: "Monday All-Hands (9am)", desc: "Company-wide, 20 minutes. Priorities for the week, quick wins from last week." },
            { title: "Quarterly off-sites", desc: "Each team does a full-day off-site every quarter. Part strategy, part team building." },
            { title: "Birthday celebrations", desc: "We celebrate birthdays with a team lunch. Simple but it matters." },
            { title: "Friday wins channel", desc: "Every Friday people post wins — big and small — in #wins on Slack." },
          ]
        }
      ]
    }
  },
  {
    id: "org-structure",
    category: "FIT",
    icon: "01",
    title: "Org structure & key people",
    subtitle: "Who's who at Meridian · 4 min read",
    tag: null,
    content: {
      type: "org",
      sections: [
        {
          heading: "Leadership team",
          people: [
            { name: "Robert Yates", role: "CEO & Co-founder", note: "Hosts Monday All-Hands. Approachable, data-driven, direct." },
            { name: "Sandra Lim", role: "COO", note: "Runs operations and strategy. The person who makes things actually happen." },
            { name: "Marcus Webb", role: "CFO", note: "Controls budget approvals over $10K. Works closely with all department heads." },
          ]
        },
        {
          heading: "Your department — Marketing",
          people: [
            { name: "Claire Bennett", role: "VP Marketing", note: "Your manager. Strategic, supportive, very Slack-responsive." },
            { name: "James Okafor", role: "Marketing Strategist · Your buddy", note: "Your go-to for everything in the first months. Has been here 4 years." },
            { name: "Priya Nair", role: "Content Lead", note: "Owns all content and copywriting. Key collaborator for your campaigns." },
            { name: "Tom Reyes", role: "Brand Designer", note: "All visual assets go through Tom. Book him 2 weeks in advance for big projects." },
          ]
        },
        {
          heading: "Key cross-functional contacts",
          people: [
            { name: "Ana Lima", role: "Finance Business Partner", note: "Your contact for budget questions and approvals." },
            { name: "Carlos Mendez", role: "Head of Product", note: "Close partner — your campaigns need to align with Product roadmap." },
            { name: "Nina Johansson", role: "HR Business Partner", note: "Any people-related questions, career development, or concerns." },
            { name: "Leo Tran", role: "Head of Sales", note: "Marketing and Sales need to be in sync. Build this relationship early." },
          ]
        }
      ]
    }
  },
  {
    id: "first-week",
    category: "ACE",
    icon: "02",
    title: "Your first week schedule",
    subtitle: "Day by day · March 3–7, 2026",
    tag: "Starts Mar 3",
    content: {
      type: "schedule",
      days: [
        {
          day: "Monday, March 3",
          label: "Day 1",
          events: [
            { time: "9:00am", title: "Welcome breakfast with Claire & team", type: "social" },
            { time: "10:30am", title: "IT setup — laptop, tools, accounts", type: "task" },
            { time: "1:00pm", title: "Company All-Hands (your first one)", type: "company" },
            { time: "3:00pm", title: "1:1 with Claire — intro & expectations", type: "manager" },
            { time: "4:30pm", title: "Meet your buddy James for coffee", type: "social" },
          ]
        },
        {
          day: "Tuesday, March 4",
          label: "Day 2",
          events: [
            { time: "9:30am", title: "HR onboarding — policies & benefits", type: "task" },
            { time: "11:00am", title: "Meet Priya Nair (Content Lead)", type: "social" },
            { time: "2:00pm", title: "Meet Tom Reyes (Brand Designer)", type: "social" },
            { time: "3:30pm", title: "Review last 3 campaign reports", type: "task" },
          ]
        },
        {
          day: "Wednesday, March 5",
          label: "Day 3",
          events: [
            { time: "10:00am", title: "Meet Carlos Mendez — Head of Product", type: "social" },
            { time: "11:30am", title: "Watch company strategy video", type: "task" },
            { time: "2:00pm", title: "Tool deep-dive: HubSpot & Asana", type: "task" },
            { time: "4:00pm", title: "Check-in with buddy James", type: "social" },
          ]
        },
        {
          day: "Thursday, March 6",
          label: "Day 4",
          events: [
            { time: "9:00am", title: "Meet Ana Lima — Finance Business Partner", type: "social" },
            { time: "11:00am", title: "Read culture guide & org chart", type: "task" },
            { time: "2:00pm", title: "Shadow Priya on content review session", type: "learning" },
            { time: "4:00pm", title: "Write your Week 1 reflection in the app", type: "task" },
          ]
        },
        {
          day: "Friday, March 7",
          label: "Day 5",
          events: [
            { time: "10:00am", title: "Coffee with Leo Tran — Head of Sales", type: "social" },
            { time: "12:00pm", title: "Team Friday lunch", type: "social" },
            { time: "2:00pm", title: "1:1 with Claire — Week 1 debrief", type: "manager" },
            { time: "3:30pm", title: "Post your first win in #wins on Slack", type: "social" },
          ]
        },
      ]
    }
  },
];

const typeColors: Record<string, { bg: string; color: string; label: string }> = {
  social:   { bg: "#EAF4EF", color: "#2D6A4F", label: "Social" },
  task:     { bg: "#EEEEF5", color: "#1A1A2E", label: "Task" },
  manager:  { bg: "#F5F4F0", color: "#0A0A0A", label: "Manager" },
  company:  { bg: "#FEF3E2", color: "#B7791F", label: "Company" },
  learning: { bg: "#FBEAEC", color: "#9B2335", label: "Learning" },
};

function DocContent({ doc }: { doc: typeof docs[0] }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = doc.content as any;

  if (c.type === "letter") {
    return (
      <div>
        <div style={{ borderBottom: "1px solid #F5F4F0", paddingBottom: 20, marginBottom: 24 }}>
          <p style={{ fontSize: 12, color: "#6B6B6B" }}>From: <strong style={{ color: "#0A0A0A" }}>{c.from}</strong></p>
          <p style={{ fontSize: 12, color: "#6B6B6B" }}>{c.date}</p>
        </div>
        {c.body!.map((para: string, i: number) => (
          <p key={i} style={{ fontSize: 14, color: i === 0 || i === c.body!.length - 1 ? "#0A0A0A" : "#444", lineHeight: 1.8, marginBottom: 16, fontWeight: i === 0 ? 600 : 400, whiteSpace: "pre-line" }}>
            {para}
          </p>
        ))}
      </div>
    );
  }

  if (c.type === "role") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {c.sections!.map((s: any, i: number) => (
          <div key={i}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A", marginBottom: 10, letterSpacing: "-0.2px" }}>{s.heading}</h3>
            {s.body && <p style={{ fontSize: 14, color: "#444", lineHeight: 1.8 }}>{s.body}</p>}
            {s.items && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {s.items.map((item: any, j: number) => (
                  <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 5, height: 5, borderRadius: 99, background: "#1A1A2E", marginTop: 7, flexShrink: 0 }} />
                    <p style={{ fontSize: 14, color: "#444", lineHeight: 1.7 }}>{item}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (c.type === "culture") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {c.sections!.map((s: any, i: number) => (
          <div key={i}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A", marginBottom: 10 }}>{s.heading}</h3>
            {s.body && <p style={{ fontSize: 14, color: "#444", lineHeight: 1.8 }}>{s.body}</p>}
            {s.items && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {s.items.map((item: any, j: number) => (
                  <div key={j} style={{ background: "#F5F4F0", borderRadius: 10, padding: "12px 16px" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", marginBottom: 4 }}>{item.title}</p>
                    <p style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (c.type === "org") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {c.sections!.map((s: any, i: number) => (
          <div key={i}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A", marginBottom: 12 }}>{s.heading}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {s.people.map((p: any, j: number) => (
                <div key={j} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 16px", background: "#F5F4F0", borderRadius: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 99, background: "#E2E0DA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 700, fontSize: 12, color: "#6B6B6B" }}>
                    {p.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", marginBottom: 2 }}>{p.name}</p>
                    <p style={{ fontSize: 12, color: "#1A1A2E", fontWeight: 500, marginBottom: 4 }}>{p.role}</p>
                    <p style={{ fontSize: 12, color: "#6B6B6B", lineHeight: 1.5 }}>{p.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (c.type === "schedule") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {c.days!.map((day: any, i: number) => (
          <div key={i}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A" }}>{day.day}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#AEABA3", background: "#F5F4F0", padding: "2px 8px", borderRadius: 99 }}>{day.label}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {day.events.map((ev: any, j: number) => {
                const tc = typeColors[ev.type];
                return (
                  <div key={j} style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "#AEABA3", width: 52, flexShrink: 0, textAlign: "right" }}>{ev.time}</span>
                    <div style={{ width: 3, height: 36, background: tc.bg, borderRadius: 99, flexShrink: 0 }} />
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                      <p style={{ fontSize: 13, color: "#0A0A0A", lineHeight: 1.4 }}>{ev.title}</p>
                      <span style={{ fontSize: 10, fontWeight: 600, color: tc.color, background: tc.bg, padding: "3px 8px", borderRadius: 99, flexShrink: 0 }}>{tc.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default function DocsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const activeDoc = docs.find(d => d.id === selected);

  const categoryColor: Record<string, string> = {
    "Personal": "#B7791F",
    "FIT": "#1A1A2E",
    "ACE": "#2D6A4F",
  };
  const categoryBg: Record<string, string> = {
    "Personal": "#FEF3E2",
    "FIT": "#EEEEF5",
    "ACE": "#EAF4EF",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F5F4F0", display: "flex", flexDirection: "column" }}>

      {/* Navbar */}
      <nav style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E0DA", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none", padding: "5px 10px 5px 8px", borderRadius: 8, border: "1px solid #E2E0DA", background: "#F5F4F0", color: "#6B6B6B", fontSize: 12, fontWeight: 500 }}>
              <span style={{ fontSize: 14 }}>←</span> Home
            </a>
            <div style={{ width: 1, height: 16, background: "#E2E0DA" }} />
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "#1A1A2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#FFF", fontWeight: 800, fontSize: 11 }}>ob</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#0A0A0A" }}>onboard</span>
            <div style={{ width: 1, height: 16, background: "#E2E0DA" }} />
            <span style={{ fontSize: 13, color: "#6B6B6B" }}>Pre-arrival documents</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 99, background: "#EEEEF5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#1A1A2E" }}>SM</div>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A" }}>Sofia Martínez</span>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 32px", display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, flex: 1, width: "100%" }}>

        {/* Sidebar — doc list */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#AEABA3", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
            Your documents
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {docs.map(doc => (
              <button key={doc.id} onClick={() => setSelected(doc.id)} style={{
                textAlign: "left", padding: "14px 16px", borderRadius: 14, border: "none", cursor: "pointer", fontFamily: "inherit",
                background: selected === doc.id ? "#0A0A0A" : "#FFFFFF",
                outline: selected === doc.id ? "none" : "1px solid #E2E0DA",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    background: selected === doc.id ? "#1A1A1A" : categoryBg[doc.category] || "#F5F4F0" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: selected === doc.id ? "#FFFFFF" : categoryColor[doc.category] || "#6B6B6B" }}>{doc.icon}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: selected === doc.id ? "#FFFFFF" : "#0A0A0A", lineHeight: 1.3 }}>{doc.title}</p>
                      {doc.tag && (
                        <span style={{ fontSize: 9, fontWeight: 700, color: selected === doc.id ? "#888" : "#B7791F", background: selected === doc.id ? "#222" : "#FEF3E2", padding: "2px 6px", borderRadius: 99, flexShrink: 0 }}>
                          {doc.tag}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 11, color: selected === doc.id ? "#888" : "#AEABA3" }}>{doc.subtitle}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main — doc viewer */}
        <div>
          {!activeDoc ? (
            <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E0DA", padding: "64px 48px", textAlign: "center" }}>
              <p style={{ fontSize: 32, marginBottom: 16 }}>📄</p>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0A0A0A", marginBottom: 8 }}>Select a document</h3>
              <p style={{ fontSize: 14, color: "#6B6B6B", lineHeight: 1.7 }}>
                You have {docs.length} documents ready to read before your first day.<br />
                Start with the welcome letter from Claire.
              </p>
              <button onClick={() => setSelected("welcome-letter")} style={{
                marginTop: 24, padding: "12px 24px", background: "#0A0A0A", color: "#FFFFFF",
                borderRadius: 10, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer"
              }}>
                Read welcome letter →
              </button>
            </div>
          ) : (
            <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E0DA", padding: "36px 44px" }}>
              {/* Doc header */}
              <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid #F5F4F0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: categoryColor[activeDoc.category] || "#6B6B6B", background: categoryBg[activeDoc.category] || "#F5F4F0", padding: "3px 10px", borderRadius: 99 }}>
                    {activeDoc.category}
                  </span>
                  {activeDoc.tag && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#B7791F", background: "#FEF3E2", padding: "3px 8px", borderRadius: 99 }}>
                      {activeDoc.tag}
                    </span>
                  )}
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0A0A0A", marginBottom: 4, letterSpacing: "-0.3px" }}>{activeDoc.title}</h2>
                <p style={{ fontSize: 13, color: "#AEABA3" }}>{activeDoc.subtitle}</p>
              </div>

              {/* Doc body */}
              <DocContent doc={activeDoc} />

              {/* Navigation between docs */}
              <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid #F5F4F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  onClick={() => {
                    const idx = docs.findIndex(d => d.id === selected);
                    if (idx > 0) setSelected(docs[idx - 1].id);
                  }}
                  style={{ fontSize: 13, color: "#6B6B6B", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                  ← Previous
                </button>
                <span style={{ fontSize: 12, color: "#AEABA3" }}>
                  {docs.findIndex(d => d.id === selected) + 1} of {docs.length}
                </span>
                {docs.findIndex(d => d.id === selected) < docs.length - 1 ? (
                  <button
                    onClick={() => {
                      const idx = docs.findIndex(d => d.id === selected);
                      setSelected(docs[idx + 1].id);
                    }}
                    style={{ fontSize: 13, color: "#0A0A0A", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                    Next →
                  </button>
                ) : (
                  <a href="/newcomer" style={{ fontSize: 13, color: "#0A0A0A", fontWeight: 600, textDecoration: "none" }}>
                    Go to dashboard →
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
