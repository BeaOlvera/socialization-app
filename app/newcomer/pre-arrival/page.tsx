"use client";
import { useState, useRef, useEffect } from "react";
import { NavBar, PageShell, Card } from "@/components/ui";

interface Message {
  role: "assistant" | "user";
  content: string;
}

const RESEARCH_CONSENT_TEXT = "I understand that my anonymized responses may be used for academic research purposes. All identifying information (name, company, specific role) will be removed before any research use. No individual will be identifiable in any published research. My participation is voluntary and I may withdraw at any time without affecting my onboarding experience.";

export default function PreArrivalInterview() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [started, setStarted] = useState(false);
  const [consented, setConsented] = useState(false);
  const [consentChecks, setConsentChecks] = useState({ data: false, research: false });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage(userMessage: string | null) {
    setLoading(true);
    if (userMessage) {
      setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    }

    try {
      const res = await fetch("/api/newcomer/pre-arrival-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) {
        const err = await res.json();
        if (err.isComplete) { setComplete(true); return; }
        throw new Error(err.error || "Failed");
      }

      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.message }]);

      if (data.isComplete) setComplete(true);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I'm having trouble connecting. Please try again in a moment.",
      }]);
    }
    setLoading(false);
  }

  function handleStart() {
    setStarted(true);
    sendMessage(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading || complete) return;
    sendMessage(input.trim());
    setInput("");
  }

  async function handleConsent() {
    // Record consent via API
    await fetch("/api/newcomer/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        consent_type: "research_participation",
        consent_text: RESEARCH_CONSENT_TEXT,
        accepted: true,
      }),
    });
    setConsented(true);
  }

  if (!started) {
    return (
      <PageShell nav={<NavBar role="newcomer" active="Activities" />}>
        <Card style={{ padding: "40px 24px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>&#128172;</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A", marginBottom: 8 }}>Pre-Arrival Interview</h2>
            <p style={{ fontSize: 14, color: "#6B6B6B", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 8px" }}>
              Before your first day, we'd like to get to know you better. This is a relaxed conversation about
              your expectations, what matters to you at work, and how you like to settle into new environments.
            </p>
            <p style={{ fontSize: 13, color: "#AEABA3", marginBottom: 24 }}>
              Takes about 10–15 minutes. There are no right or wrong answers.
            </p>
          </div>

          {!consented ? (
            <div style={{ maxWidth: 560, margin: "0 auto" }}>
              {/* Data protection consent */}
              <div style={{ background: "#F5F4F0", borderRadius: 12, padding: "16px 20px", marginBottom: 12 }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                  <input type="checkbox" checked={consentChecks.data}
                    onChange={e => setConsentChecks(p => ({ ...p, data: e.target.checked }))}
                    style={{ width: 18, height: 18, marginTop: 3, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", marginBottom: 4 }}>Data Protection</p>
                    <p style={{ fontSize: 12, color: "#6B6B6B", lineHeight: 1.6 }}>
                      I understand that my responses will be stored securely and processed in accordance with GDPR.
                      My data will be used to support my onboarding experience. I can request access to, correction of,
                      or deletion of my personal data at any time by contacting HR or the platform administrator.
                    </p>
                  </div>
                </label>
              </div>

              {/* Research consent */}
              <div style={{ background: "#EEEEF5", borderRadius: 12, padding: "16px 20px", marginBottom: 20 }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                  <input type="checkbox" checked={consentChecks.research}
                    onChange={e => setConsentChecks(p => ({ ...p, research: e.target.checked }))}
                    style={{ width: 18, height: 18, marginTop: 3, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#1A1A2E", marginBottom: 4 }}>Research Participation</p>
                    <p style={{ fontSize: 12, color: "#6B6B6B", lineHeight: 1.6 }}>
                      I understand that my anonymized responses may be used for academic research purposes.
                      All identifying information (name, company, specific role) will be removed before any
                      research use. No individual will be identifiable in any published research.
                      My participation is voluntary and I may withdraw at any time without affecting my
                      onboarding experience. The research aims to improve newcomer socialization practices
                      and contribute to academic knowledge in organizational psychology.
                    </p>
                  </div>
                </label>
              </div>

              <div style={{ textAlign: "center" }}>
                <button
                  onClick={handleConsent}
                  disabled={!consentChecks.data || !consentChecks.research}
                  style={{
                    padding: "12px 32px", borderRadius: 12, border: "none", cursor: consentChecks.data && consentChecks.research ? "pointer" : "not-allowed",
                    background: consentChecks.data && consentChecks.research ? "#0A0A0A" : "#E2E0DA",
                    color: consentChecks.data && consentChecks.research ? "#FFFFFF" : "#AEABA3",
                    fontSize: 15, fontWeight: 700, transition: "all 0.15s",
                  }}
                >
                  I agree — continue
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{ background: "#EAF4EF", borderRadius: 10, padding: "10px 16px", display: "inline-block", marginBottom: 20 }}>
                <p style={{ fontSize: 12, color: "#2D6A4F", fontWeight: 600 }}>Consent recorded. Thank you.</p>
              </div>
              <br />
              <button onClick={handleStart} style={{
                padding: "12px 32px", borderRadius: 12, border: "none", cursor: "pointer",
                background: "#0A0A0A", color: "#FFFFFF", fontSize: 15, fontWeight: 700,
              }}>
                Start conversation
              </button>
            </div>
          )}
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell nav={<NavBar role="newcomer" active="Activities" />}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ background: "#F5F4F0", borderRadius: 16, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ background: "#0A0A0A", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 99, background: "#1A1A2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#FFF", fontWeight: 800, fontSize: 11 }}>ob</span>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#FFFFFF" }}>Pre-Arrival Interview</p>
              <p style={{ fontSize: 10, color: "#888" }}>
                {complete ? "Interview complete — thank you!" : loading ? "Thinking..." : "Getting to know you before day one"}
              </p>
            </div>
            {complete && (
              <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, background: "#2D6A4F", color: "#FFF", padding: "3px 12px", borderRadius: 99 }}>
                Complete
              </span>
            )}
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{ padding: "18px 20px", maxHeight: 500, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "82%", padding: "12px 16px", borderRadius: 16,
                  background: m.role === "user" ? "#0A0A0A" : "#FFFFFF",
                  color: m.role === "user" ? "#FFFFFF" : "#0A0A0A",
                  fontSize: 14, lineHeight: 1.7,
                  border: m.role === "assistant" ? "1px solid #E2E0DA" : "none",
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 5, padding: "8px 0" }}>
                <div style={{ width: 7, height: 7, borderRadius: 99, background: "#AEABA3", animation: "pulse 1s infinite" }} />
                <div style={{ width: 7, height: 7, borderRadius: 99, background: "#AEABA3", animation: "pulse 1s infinite 0.2s" }} />
                <div style={{ width: 7, height: 7, borderRadius: 99, background: "#AEABA3", animation: "pulse 1s infinite 0.4s" }} />
              </div>
            )}
          </div>

          {/* Input */}
          {!complete ? (
            <form onSubmit={handleSubmit} style={{ padding: "14px 20px", borderTop: "1px solid #E2E0DA", display: "flex", gap: 10 }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
                placeholder={loading ? "Waiting..." : "Type your answer..."}
                style={{
                  flex: 1, padding: "12px 16px", borderRadius: 12,
                  border: "1px solid #E2E0DA", fontSize: 14, color: "#0A0A0A",
                  outline: "none", background: "#FFFFFF", boxSizing: "border-box",
                }}
              />
              <button type="submit" disabled={loading || !input.trim()} style={{
                padding: "12px 20px", borderRadius: 12, border: "none",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                background: loading || !input.trim() ? "#E2E0DA" : "#0A0A0A",
                color: loading || !input.trim() ? "#AEABA3" : "#FFFFFF",
                fontSize: 14, fontWeight: 600,
              }}>
                Send
              </button>
            </form>
          ) : (
            <div style={{ padding: "16px 20px", borderTop: "1px solid #E2E0DA", textAlign: "center" }}>
              <p style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 12 }}>Your responses have been saved. Once analyzed, you'll be able to see your onboarding profile.</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <a href="/newcomer/pre-arrival-report" style={{
                  padding: "10px 24px", borderRadius: 10, background: "#EEEEF5", color: "#1A1A2E",
                  fontSize: 13, fontWeight: 600, textDecoration: "none", display: "inline-block",
                }}>
                  View my profile
                </a>
                <a href="/newcomer/activities" style={{
                  padding: "10px 24px", borderRadius: 10, background: "#0A0A0A", color: "#FFF",
                  fontSize: 13, fontWeight: 600, textDecoration: "none", display: "inline-block",
                }}>
                  Back to activities
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
