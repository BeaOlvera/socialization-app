"use client";
import { useState } from "react";
import Link from "next/link";

const steps = [
  {
    id: "invite",
    label: null,
  },
  {
    id: "profile",
    label: "Tell us about you",
  },
  {
    id: "expectations",
    label: "Your mindset",
  },
  {
    id: "preview",
    label: "Your first week",
  },
  {
    id: "ready",
    label: null,
  },
];

export default function WelcomePage() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({ name: "Sofia", role: "Senior Marketing Manager", excitement: "", nervous: "", workStyle: [] as string[] });
  const [expectations, setExpectations] = useState({ focus: "", strength: "" });

  const next = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div style={{ minHeight: "100vh", background: "#F5F4F0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>

      {/* Back to home */}
      <a href="/" style={{ position: "fixed", top: 20, left: 24, display: "flex", alignItems: "center", gap: 6, textDecoration: "none", padding: "6px 12px 6px 10px", borderRadius: 8, border: "1px solid #E2E0DA", background: "#FFFFFF", color: "#6B6B6B", fontSize: 12, fontWeight: 500, zIndex: 50 }}>
        ← Home
      </a>

      {/* Progress dots */}
      {step > 0 && step < steps.length - 1 && (
        <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
          {steps.slice(1, -1).map((_, i) => (
            <div key={i} style={{
              width: i === step - 1 ? 24 : 6,
              height: 6,
              borderRadius: 99,
              background: i === step - 1 ? "#0A0A0A" : "#DDDBD5",
              transition: "all 0.3s"
            }} />
          ))}
        </div>
      )}

      <div style={{ width: "100%", maxWidth: 520 }}>

        {/* ── Step 0: Invite ── */}
        {step === 0 && (
          <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E0DA", padding: "48px 40px", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "#1A1A2E", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
              <span style={{ color: "#FFFFFF", fontWeight: 800, fontSize: 18 }}>ob</span>
            </div>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", color: "#AEABA3", textTransform: "uppercase", marginBottom: 12 }}>
              Meridian Group
            </p>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.5px", marginBottom: 12, lineHeight: 1.25 }}>
              Welcome, Sofia.
            </h1>
            <p style={{ fontSize: 14, color: "#6B6B6B", lineHeight: 1.7, marginBottom: 32 }}>
              We&apos;re so glad you&apos;re joining us.<br />
              This app will guide your first 12 months — your role, your organization, and your people.
            </p>
            <div style={{ background: "#F5F4F0", borderRadius: 12, padding: "16px 20px", marginBottom: 32, textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "#6B6B6B" }}>Your role</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A" }}>Senior Marketing Manager</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "#6B6B6B" }}>Start date</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A" }}>March 3, 2026</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "#6B6B6B" }}>Your manager</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A" }}>Claire Bennett</span>
              </div>
            </div>
            <button onClick={next} style={{
              width: "100%", padding: "14px", background: "#0A0A0A", color: "#FFFFFF",
              borderRadius: 12, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer"
            }}>
              Get started →
            </button>
            <p style={{ fontSize: 11, color: "#AEABA3", marginTop: 16 }}>Takes about 3 minutes</p>
          </div>
        )}

        {/* ── Step 1: Profile ── */}
        {step === 1 && (
          <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E0DA", padding: "36px 40px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#AEABA3", textTransform: "uppercase", marginBottom: 8 }}>Step 1 of 3</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0A0A0A", marginBottom: 6, letterSpacing: "-0.3px" }}>Tell us about you</h2>
            <p style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 28, lineHeight: 1.6 }}>This helps your buddy and manager understand who you are before Day 1.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 8 }}>
                  What are you most excited about?
                </label>
                <textarea
                  value={profile.excitement}
                  onChange={e => setProfile(p => ({ ...p, excitement: e.target.value }))}
                  placeholder="Meeting the team, diving into new challenges..."
                  rows={3}
                  style={{
                    width: "100%", padding: "12px 14px", border: "1px solid #E2E0DA",
                    borderRadius: 10, fontSize: 13, color: "#0A0A0A", resize: "none",
                    outline: "none", fontFamily: "inherit", background: "#FAFAF9"
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 8 }}>
                  What makes you a little nervous?
                </label>
                <textarea
                  value={profile.nervous}
                  onChange={e => setProfile(p => ({ ...p, nervous: e.target.value }))}
                  placeholder="Learning all the new processes, finding my footing..."
                  rows={3}
                  style={{
                    width: "100%", padding: "12px 14px", border: "1px solid #E2E0DA",
                    borderRadius: 10, fontSize: 13, color: "#0A0A0A", resize: "none",
                    outline: "none", fontFamily: "inherit", background: "#FAFAF9"
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 10 }}>
                  How do you prefer to work?
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Independently", "Collaboratively", "Structured", "Flexible", "Deep focus", "Fast-paced"].map(tag => {
                    const selected = profile.workStyle.includes(tag);
                    return (
                      <button key={tag}
                        onClick={() => setProfile(p => ({
                          ...p,
                          workStyle: selected ? p.workStyle.filter(t => t !== tag) : [...p.workStyle, tag]
                        }))}
                        style={{
                          padding: "6px 14px", borderRadius: 99, cursor: "pointer", fontFamily: "inherit",
                          border: selected ? "2px solid #0A0A0A" : "1px solid #E2E0DA",
                          background: selected ? "#0A0A0A" : "#F5F4F0",
                          color: selected ? "#FFFFFF" : "#6B6B6B",
                          fontSize: 12, fontWeight: selected ? 600 : 400
                        }}>
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
              <button onClick={back} style={{
                flex: 1, padding: "13px", background: "#F5F4F0", color: "#6B6B6B",
                borderRadius: 12, fontWeight: 600, fontSize: 13, border: "1px solid #E2E0DA", cursor: "pointer"
              }}>
                Back
              </button>
              <button onClick={next} style={{
                flex: 2, padding: "13px", background: "#0A0A0A", color: "#FFFFFF",
                borderRadius: 12, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer"
              }}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Expectations ── */}
        {step === 2 && (
          <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E0DA", padding: "36px 40px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#AEABA3", textTransform: "uppercase", marginBottom: 8 }}>Step 2 of 3</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0A0A0A", marginBottom: 6, letterSpacing: "-0.3px" }}>Your mindset</h2>
            <p style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 28, lineHeight: 1.6 }}>No right or wrong answers — this helps us personalize your journey.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 12 }}>
                  In your first months, your priority is:
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { id: "learn", label: "Learn as much as possible before acting", icon: "📖" },
                    { id: "deliver", label: "Deliver results fast to show my value", icon: "⚡" },
                    { id: "connect", label: "Build relationships before anything else", icon: "🤝" },
                  ].map(opt => (
                    <button key={opt.id} onClick={() => setExpectations(p => ({ ...p, focus: opt.id }))}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "14px 16px", borderRadius: 12, cursor: "pointer",
                        border: expectations.focus === opt.id ? "2px solid #0A0A0A" : "1px solid #E2E0DA",
                        background: expectations.focus === opt.id ? "#F5F4F0" : "#FFFFFF",
                        fontFamily: "inherit", textAlign: "left"
                      }}>
                      <span style={{ fontSize: 20 }}>{opt.icon}</span>
                      <span style={{ fontSize: 13, color: "#0A0A0A", fontWeight: expectations.focus === opt.id ? 600 : 400 }}>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 12 }}>
                  Your biggest strength coming in:
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Strategic thinking", "Execution", "Communication", "Analytics", "Leadership", "Creativity", "Relationship building"].map(s => (
                    <button key={s} onClick={() => setExpectations(p => ({ ...p, strength: s }))}
                      style={{
                        padding: "7px 14px", borderRadius: 99, cursor: "pointer", fontFamily: "inherit",
                        border: expectations.strength === s ? "2px solid #0A0A0A" : "1px solid #E2E0DA",
                        background: expectations.strength === s ? "#0A0A0A" : "#F5F4F0",
                        color: expectations.strength === s ? "#FFFFFF" : "#6B6B6B",
                        fontSize: 12, fontWeight: expectations.strength === s ? 600 : 400
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
              <button onClick={back} style={{
                flex: 1, padding: "13px", background: "#F5F4F0", color: "#6B6B6B",
                borderRadius: 12, fontWeight: 600, fontSize: 13, border: "1px solid #E2E0DA", cursor: "pointer"
              }}>
                Back
              </button>
              <button onClick={next} style={{
                flex: 2, padding: "13px", background: "#0A0A0A", color: "#FFFFFF",
                borderRadius: 12, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer"
              }}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Preview ── */}
        {step === 3 && (
          <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E0DA", padding: "36px 40px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#AEABA3", textTransform: "uppercase", marginBottom: 8 }}>Step 3 of 3</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0A0A0A", marginBottom: 6, letterSpacing: "-0.3px" }}>Your first week</h2>
            <p style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 24, lineHeight: 1.6 }}>Here&apos;s what we&apos;ve prepared for you across your three tracks.</p>

            {[
              {
                number: "01", label: "My Job", color: "#1A1A2E", bg: "#EEEEF5",
                items: ["Review your job description and 90-day goals", "Get access to all your tools", "Understand how performance is measured"]
              },
              {
                number: "02", label: "My Organization", color: "#2D6A4F", bg: "#EAF4EF",
                items: ["Watch the 5-min company strategy video", "Browse the org chart", "Read the culture guide"]
              },
              {
                number: "03", label: "My People", color: "#9B2335", bg: "#FBEAEC",
                items: ["Meet your buddy James Okafor", "Intro call with your team", "Coffee chat with your manager Claire"]
              },
            ].map(b => (
              <div key={b.number} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: b.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: b.color }}>{b.number}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A" }}>{b.label}</span>
                </div>
                <div style={{ paddingLeft: 38, display: "flex", flexDirection: "column", gap: 6 }}>
                  {b.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <div style={{ width: 4, height: 4, borderRadius: 99, background: "#DDDBD5", marginTop: 6, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: "#6B6B6B", lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
              <button onClick={back} style={{
                flex: 1, padding: "13px", background: "#F5F4F0", color: "#6B6B6B",
                borderRadius: 12, fontWeight: 600, fontSize: 13, border: "1px solid #E2E0DA", cursor: "pointer"
              }}>
                Back
              </button>
              <button onClick={next} style={{
                flex: 2, padding: "13px", background: "#0A0A0A", color: "#FFFFFF",
                borderRadius: 12, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer"
              }}>
                I&apos;m ready →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: Ready ── */}
        {step === 4 && (
          <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E0DA", padding: "48px 40px", textAlign: "center" }}>
            <div style={{
              width: 56, height: 56, borderRadius: 99, background: "#EAF4EF",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px"
            }}>
              <span style={{ fontSize: 24 }}>✓</span>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0A0A0A", marginBottom: 10, letterSpacing: "-0.3px" }}>
              You&apos;re all set, Sofia.
            </h2>
            <p style={{ fontSize: 14, color: "#6B6B6B", lineHeight: 1.7, marginBottom: 32 }}>
              Your journey starts on <strong>March 3</strong>.<br />
              Your buddy James will reach out before then.
            </p>

            <div style={{ background: "#F5F4F0", borderRadius: 12, padding: "16px 20px", marginBottom: 28, textAlign: "left" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#AEABA3", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Your profile summary</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "#6B6B6B" }}>Excited about</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#0A0A0A", maxWidth: "55%", textAlign: "right" }}>
                    {profile.excitement || "Meeting the team"}
                  </span>
                </div>
                <div style={{ height: 1, background: "#E2E0DA" }} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "#6B6B6B" }}>Main strength</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#0A0A0A" }}>{expectations.strength || "Strategic thinking"}</span>
                </div>
                <div style={{ height: 1, background: "#E2E0DA" }} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "#6B6B6B" }}>First priority</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#0A0A0A" }}>
                    {expectations.focus === "learn" ? "Learn first" : expectations.focus === "deliver" ? "Deliver fast" : expectations.focus === "connect" ? "Build relationships" : "Connect with team"}
                  </span>
                </div>
              </div>
            </div>

            <Link href="/newcomer" style={{ display: "block", textDecoration: "none" }}>
              <button style={{
                width: "100%", padding: "14px", background: "#0A0A0A", color: "#FFFFFF",
                borderRadius: 12, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer"
              }}>
                Go to my dashboard →
              </button>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
