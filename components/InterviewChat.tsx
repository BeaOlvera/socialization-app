"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "assistant" | "user";
  content: string;
}

export function InterviewChat({ checkinId, onComplete }: { checkinId: string; onComplete?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [started, setStarted] = useState(false);
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
      const res = await fetch(`/api/newcomer/interview/${checkinId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.message }]);

      if (data.isComplete) {
        setComplete(true);
        onComplete?.();
      }
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
    sendMessage(null); // Get opening question
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading || complete) return;
    const msg = input.trim();
    setInput("");
    sendMessage(msg);
  }

  if (!started) {
    return (
      <div style={{ background: "#F5F4F0", borderRadius: 16, padding: "28px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 24, marginBottom: 12 }}>💬</p>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A", marginBottom: 8 }}>Qualitative Interview</h3>
        <p style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.6, marginBottom: 20, maxWidth: 360, margin: "0 auto 20px" }}>
          An AI-guided conversation to explore your socialization experience in depth.
          Takes about 5–8 minutes. Your responses complement the Likert ratings above.
        </p>
        <button
          onClick={handleStart}
          style={{
            padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer",
            background: "#0A0A0A", color: "#FFFFFF", fontSize: 14, fontWeight: 600,
          }}
        >
          Start interview
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "#F5F4F0", borderRadius: 16, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: "#0A0A0A", padding: "12px 18px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 99, background: "#1A1A2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#FFF", fontWeight: 800, fontSize: 10 }}>ob</span>
        </div>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#FFFFFF" }}>Socialization Check-in</p>
          <p style={{ fontSize: 10, color: "#888" }}>
            {complete ? "Interview complete" : loading ? "Thinking..." : "AI-guided qualitative interview"}
          </p>
        </div>
        {complete && (
          <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, background: "#2D6A4F", color: "#FFF", padding: "3px 10px", borderRadius: 99 }}>
            Done
          </span>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ padding: "16px 18px", maxHeight: 400, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "80%", padding: "10px 14px", borderRadius: 14,
              background: m.role === "user" ? "#0A0A0A" : "#FFFFFF",
              color: m.role === "user" ? "#FFFFFF" : "#0A0A0A",
              fontSize: 13, lineHeight: 1.6,
              border: m.role === "assistant" ? "1px solid #E2E0DA" : "none",
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 4, padding: "8px 0" }}>
            <div style={{ width: 6, height: 6, borderRadius: 99, background: "#AEABA3", animation: "pulse 1s infinite" }} />
            <div style={{ width: 6, height: 6, borderRadius: 99, background: "#AEABA3", animation: "pulse 1s infinite 0.2s" }} />
            <div style={{ width: 6, height: 6, borderRadius: 99, background: "#AEABA3", animation: "pulse 1s infinite 0.4s" }} />
          </div>
        )}
      </div>

      {/* Input */}
      {!complete && (
        <form onSubmit={handleSubmit} style={{ padding: "12px 18px", borderTop: "1px solid #E2E0DA", display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            placeholder={loading ? "Waiting for response..." : "Type your answer..."}
            style={{
              flex: 1, padding: "10px 14px", borderRadius: 10,
              border: "1px solid #E2E0DA", fontSize: 13, color: "#0A0A0A",
              outline: "none", background: "#FFFFFF", boxSizing: "border-box",
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              padding: "10px 18px", borderRadius: 10, border: "none",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              background: loading || !input.trim() ? "#E2E0DA" : "#0A0A0A",
              color: loading || !input.trim() ? "#AEABA3" : "#FFFFFF",
              fontSize: 13, fontWeight: 600,
            }}
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
}
