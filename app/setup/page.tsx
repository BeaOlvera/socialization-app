"use client";
import { useState } from "react";

const steps = ["Company", "Culture", "Role", "People", "Launch"];

export default function SetupPage() {
  const [step, setStep] = useState(0);

  const next = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div style={{ minHeight: "100vh", background: "#F5F4F0", display: "flex" }}>

      {/* Sidebar */}
      <div style={{ width: 260, background: "#0A0A0A", padding: "36px 28px", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "#1A1A2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#FFF", fontWeight: 800, fontSize: 11 }}>ob</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#FFFFFF" }}>onboard</span>
        </div>

        <p style={{ fontSize: 10, fontWeight: 700, color: "#444", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
          Company setup
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {steps.map((s, i) => (
            <button key={s} onClick={() => setStep(i)} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 14px", borderRadius: 10, border: "none",
              background: i === step ? "#1A1A1A" : "transparent",
              cursor: "pointer", textAlign: "left"
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 99, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: i < step ? "#2D6A4F" : i === step ? "#FFFFFF" : "#222",
                fontSize: 10, fontWeight: 700,
                color: i < step ? "#FFFFFF" : i === step ? "#0A0A0A" : "#444"
              }}>
                {i < step ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 13, fontWeight: i === step ? 600 : 400, color: i === step ? "#FFFFFF" : "#6B6B6B" }}>
                {s}
              </span>
            </button>
          ))}
        </div>

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none", padding: "8px 14px", borderRadius: 8, border: "1px solid #222", color: "#6B6B6B", fontSize: 12, fontWeight: 500 }}>
            ← Back to home
          </a>
          <div style={{ padding: "16px 14px", background: "#111", borderRadius: 12 }}>
            <p style={{ fontSize: 11, color: "#444", marginBottom: 4 }}>Consultant</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#FFFFFF" }}>Your Name</p>
            <p style={{ fontSize: 11, color: "#6B6B6B" }}>Setting up Meridian Group</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "48px 56px", overflowY: "auto" }}>

        {/* ── Step 0: Company ── */}
        {step === 0 && (
          <div style={{ maxWidth: 640 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0A0A0A", marginBottom: 6, letterSpacing: "-0.3px" }}>Company information</h1>
            <p style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 36, lineHeight: 1.6 }}>Basic details about the organization. This will appear in every newcomer&apos;s dashboard.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { label: "Company name", placeholder: "Meridian Group", value: "Meridian Group" },
                { label: "Industry", placeholder: "e.g. Financial Services, Technology..." },
                { label: "Company size", placeholder: "e.g. 450 employees" },
                { label: "Headquarters", placeholder: "e.g. Chicago, IL" },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 8 }}>{f.label}</label>
                  <input defaultValue={f.value || ""} placeholder={f.placeholder} style={{
                    width: "100%", padding: "11px 14px", border: "1px solid #E2E0DA",
                    borderRadius: 10, fontSize: 13, color: "#0A0A0A", outline: "none",
                    fontFamily: "inherit", background: "#FFFFFF"
                  }} />
                </div>
              ))}

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 8 }}>Company mission / tagline</label>
                <textarea placeholder="What does this company exist to do?" rows={3} style={{
                  width: "100%", padding: "11px 14px", border: "1px solid #E2E0DA",
                  borderRadius: 10, fontSize: 13, color: "#0A0A0A", resize: "none",
                  outline: "none", fontFamily: "inherit", background: "#FFFFFF"
                }} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 8 }}>Company history (brief)</label>
                <textarea placeholder="Founded in... Key milestones..." rows={4} style={{
                  width: "100%", padding: "11px 14px", border: "1px solid #E2E0DA",
                  borderRadius: 10, fontSize: 13, color: "#0A0A0A", resize: "none",
                  outline: "none", fontFamily: "inherit", background: "#FFFFFF"
                }} />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 1: Culture ── */}
        {step === 1 && (
          <div style={{ maxWidth: 640 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0A0A0A", marginBottom: 6, letterSpacing: "-0.3px" }}>Culture & values</h1>
            <p style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 36, lineHeight: 1.6 }}>This becomes the newcomer&apos;s guide to how things work here — beyond the handbook.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 8 }}>Core values (one per line)</label>
                <textarea placeholder={"Integrity\nCollaboration\nCuriosity\n..."} rows={5} style={{
                  width: "100%", padding: "11px 14px", border: "1px solid #E2E0DA",
                  borderRadius: 10, fontSize: 13, color: "#0A0A0A", resize: "none",
                  outline: "none", fontFamily: "inherit", background: "#FFFFFF"
                }} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 8 }}>How decisions are made here</label>
                <textarea placeholder="Describe how decisions get made — top-down, consensus, data-driven..." rows={3} style={{
                  width: "100%", padding: "11px 14px", border: "1px solid #E2E0DA",
                  borderRadius: 10, fontSize: 13, color: "#0A0A0A", resize: "none",
                  outline: "none", fontFamily: "inherit", background: "#FFFFFF"
                }} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 8 }}>Unwritten rules (what every insider knows)</label>
                <textarea placeholder="e.g. Meetings start on time. Slack is preferred over email. Fridays are async..." rows={4} style={{
                  width: "100%", padding: "11px 14px", border: "1px solid #E2E0DA",
                  borderRadius: 10, fontSize: 13, color: "#0A0A0A", resize: "none",
                  outline: "none", fontFamily: "inherit", background: "#FFFFFF"
                }} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 8 }}>Rituals & traditions</label>
                <textarea placeholder="e.g. All-hands every Monday. Friday team lunches. Quarterly off-sites..." rows={3} style={{
                  width: "100%", padding: "11px 14px", border: "1px solid #E2E0DA",
                  borderRadius: 10, fontSize: 13, color: "#0A0A0A", resize: "none",
                  outline: "none", fontFamily: "inherit", background: "#FFFFFF"
                }} />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Role ── */}
        {step === 2 && (
          <div style={{ maxWidth: 640 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0A0A0A", marginBottom: 6, letterSpacing: "-0.3px" }}>Role setup</h1>
            <p style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 36, lineHeight: 1.6 }}>Define what success looks like for this specific newcomer — Sofia Martínez, Sr. Marketing Manager.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: "#EEEEF5", borderRadius: 12, padding: "14px 18px" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#1A1A2E", marginBottom: 2 }}>Newcomer</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#0A0A0A" }}>Sofia Martínez — Senior Marketing Manager</p>
                <p style={{ fontSize: 12, color: "#6B6B6B", marginTop: 2 }}>Start date: March 3, 2026 · Manager: Claire Bennett</p>
              </div>

              {[
                { label: "30-day goal", placeholder: "What should she accomplish in the first 30 days?" },
                { label: "60-day goal", placeholder: "What should she accomplish by day 60?" },
                { label: "90-day goal", placeholder: "What does success look like at 3 months?" },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 8 }}>{f.label}</label>
                  <textarea placeholder={f.placeholder} rows={2} style={{
                    width: "100%", padding: "11px 14px", border: "1px solid #E2E0DA",
                    borderRadius: 10, fontSize: 13, color: "#0A0A0A", resize: "none",
                    outline: "none", fontFamily: "inherit", background: "#FFFFFF"
                  }} />
                </div>
              ))}

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 8 }}>Key tools she needs access to</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Slack", "Notion", "Google Workspace", "Salesforce", "Asana", "Figma", "Jira", "HubSpot"].map(tool => (
                    <button key={tool} style={{
                      padding: "6px 14px", borderRadius: 99, fontSize: 12, cursor: "pointer",
                      border: "1px solid #E2E0DA", background: "#F5F4F0", color: "#6B6B6B", fontFamily: "inherit"
                    }}>
                      {tool}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 8 }}>Key stakeholders for her role</label>
                <textarea placeholder="e.g. Head of Product (for campaign alignment), CFO (for budget approvals)..." rows={3} style={{
                  width: "100%", padding: "11px 14px", border: "1px solid #E2E0DA",
                  borderRadius: 10, fontSize: 13, color: "#0A0A0A", resize: "none",
                  outline: "none", fontFamily: "inherit", background: "#FFFFFF"
                }} />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: People ── */}
        {step === 3 && (
          <div style={{ maxWidth: 640 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0A0A0A", marginBottom: 6, letterSpacing: "-0.3px" }}>People & network</h1>
            <p style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 36, lineHeight: 1.6 }}>Set up the human side of Sofia&apos;s onboarding — buddy, team, and key connections.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Buddy */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E2E0DA", borderRadius: 14, padding: "20px 22px" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#0A0A0A", marginBottom: 14 }}>Buddy assignment</p>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: "#6B6B6B", display: "block", marginBottom: 6 }}>Buddy name</label>
                    <input defaultValue="James Okafor" style={{
                      width: "100%", padding: "10px 12px", border: "1px solid #E2E0DA",
                      borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "inherit"
                    }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: "#6B6B6B", display: "block", marginBottom: 6 }}>Their role</label>
                    <input defaultValue="Marketing Strategist" style={{
                      width: "100%", padding: "10px 12px", border: "1px solid #E2E0DA",
                      borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "inherit"
                    }} />
                  </div>
                </div>
              </div>

              {/* Team */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E2E0DA", borderRadius: 14, padding: "20px 22px" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#0A0A0A", marginBottom: 14 }}>Direct team members</p>
                {[
                  { name: "Priya Nair", role: "Content Lead" },
                  { name: "Tom Reyes", role: "Brand Designer" },
                ].map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                    <input defaultValue={m.name} style={{
                      flex: 1, padding: "10px 12px", border: "1px solid #E2E0DA",
                      borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "inherit"
                    }} />
                    <input defaultValue={m.role} style={{
                      flex: 1, padding: "10px 12px", border: "1px solid #E2E0DA",
                      borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "inherit"
                    }} />
                  </div>
                ))}
                <button style={{
                  fontSize: 12, color: "#1A1A2E", fontWeight: 600, background: "none",
                  border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit"
                }}>
                  + Add team member
                </button>
              </div>

              {/* Key contacts */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E2E0DA", borderRadius: 14, padding: "20px 22px" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#0A0A0A", marginBottom: 4 }}>Key cross-functional contacts</p>
                <p style={{ fontSize: 12, color: "#6B6B6B", marginBottom: 14 }}>People outside her team she should know early</p>
                {[{ name: "Ana Lima", role: "Finance Business Partner", reason: "Budget approvals" }].map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <input defaultValue={c.name} style={{
                      flex: 1, padding: "10px 12px", border: "1px solid #E2E0DA",
                      borderRadius: 8, fontSize: 12, outline: "none", fontFamily: "inherit"
                    }} />
                    <input defaultValue={c.role} style={{
                      flex: 1, padding: "10px 12px", border: "1px solid #E2E0DA",
                      borderRadius: 8, fontSize: 12, outline: "none", fontFamily: "inherit"
                    }} />
                    <input defaultValue={c.reason} style={{
                      flex: 1, padding: "10px 12px", border: "1px solid #E2E0DA",
                      borderRadius: 8, fontSize: 12, outline: "none", fontFamily: "inherit"
                    }} />
                  </div>
                ))}
                <button style={{
                  fontSize: 12, color: "#1A1A2E", fontWeight: 600, background: "none",
                  border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit"
                }}>
                  + Add contact
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: Launch ── */}
        {step === 4 && (
          <div style={{ maxWidth: 640 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0A0A0A", marginBottom: 6, letterSpacing: "-0.3px" }}>Ready to launch</h1>
            <p style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 36, lineHeight: 1.6 }}>Everything is set up. Review and send Sofia her invite.</p>

            {/* Summary */}
            {[
              { label: "Company", items: ["Meridian Group", "Financial Services", "450 employees"] },
              { label: "Culture", items: ["4 core values entered", "Decision-making style defined", "3 rituals added"] },
              { label: "Role", items: ["30/60/90 day goals set", "6 tools assigned", "4 stakeholders mapped"] },
              { label: "People", items: ["Buddy: James Okafor", "2 team members", "3 key contacts"] },
            ].map(s => (
              <div key={s.label} style={{
                display: "flex", alignItems: "flex-start", gap: 16,
                padding: "16px 0", borderBottom: "1px solid #F5F4F0"
              }}>
                <div style={{ width: 22, height: 22, borderRadius: 99, background: "#EAF4EF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <span style={{ fontSize: 11, color: "#2D6A4F" }}>✓</span>
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", marginBottom: 4 }}>{s.label}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {s.items.map(item => (
                      <span key={item} style={{ fontSize: 11, color: "#6B6B6B", background: "#F5F4F0", padding: "3px 10px", borderRadius: 99 }}>{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <div style={{ marginTop: 32, background: "#F5F4F0", borderRadius: 14, padding: "20px 22px", marginBottom: 24 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", marginBottom: 10 }}>Send invite to newcomer</p>
              <div style={{ display: "flex", gap: 10 }}>
                <input defaultValue="sofia.martinez@meridiangroup.com" style={{
                  flex: 1, padding: "11px 14px", border: "1px solid #E2E0DA",
                  borderRadius: 10, fontSize: 13, outline: "none", fontFamily: "inherit", background: "#FFFFFF"
                }} />
                <button style={{
                  padding: "11px 20px", background: "#0A0A0A", color: "#FFFFFF",
                  borderRadius: 10, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer", whiteSpace: "nowrap"
                }}>
                  Send invite
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", gap: 10, marginTop: 40, maxWidth: 640 }}>
          {step > 0 && (
            <button onClick={back} style={{
              padding: "12px 24px", background: "#FFFFFF", color: "#6B6B6B",
              borderRadius: 10, fontWeight: 600, fontSize: 13, border: "1px solid #E2E0DA", cursor: "pointer"
            }}>
              Back
            </button>
          )}
          {step < steps.length - 1 && (
            <button onClick={next} style={{
              padding: "12px 28px", background: "#0A0A0A", color: "#FFFFFF",
              borderRadius: 10, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer"
            }}>
              Save & continue →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
