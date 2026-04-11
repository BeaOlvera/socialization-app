"use client";
import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { NavBar, PageShell, Card, SectionLabel } from "@/components/ui";

interface Message {
  role: "assistant" | "user";
  content: string;
}

const DOC_OPTIONS = [
  { id: "culture_guide", title: "Company Values & Culture Guide", dim: "TIE", who: "HR", canUpload: true },
  { id: "team_rituals", title: "Team Rituals & Meetings", dim: "TIE", who: "Manager", canUpload: false },
  { id: "welcome_pack", title: "Welcome Pack", dim: "TIE", who: "HR", canUpload: true },
  { id: "unwritten_rules", title: "Unwritten Rules & Culture Tips", dim: "TIE", who: "Manager", canUpload: false },
  { id: "plan_30_60_90", title: "30-60-90 Day Plan", dim: "ACE", who: "Manager", canUpload: true },
  { id: "performance_guide", title: "Performance Appraisal Guide", dim: "ACE", who: "HR", canUpload: true },
  { id: "sops_summary", title: "Key Processes & SOPs", dim: "ACE", who: "Manager", canUpload: true },
  { id: "stakeholder_map", title: "Stakeholder Map", dim: "FIT", who: "Manager", canUpload: false },
  { id: "team_norms", title: "Team Communication Norms", dim: "TIE", who: "Manager", canUpload: false },
  { id: "job_description", title: "Job Description", dim: "FIT", who: "HR", canUpload: true },
];

export default function DocBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [mode, setMode] = useState<"select" | "interview" | "upload" | "result">("select");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ title: string; content: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  async function sendMessage(userMessage: string | null) {
    setLoading(true);
    const newHistory = userMessage
      ? [...messages, { role: "user" as const, content: userMessage }]
      : messages;
    if (userMessage) setMessages(newHistory);

    try {
      const res = await fetch(`/api/admin/companies/${id}/documents/interview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, docId: selectedDoc, history: newHistory }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
      }
      if (data.isComplete) setComplete(true);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please try again." }]);
    }
    setLoading(false);
  }

  async function generateDoc() {
    setGenerating(true);
    const transcript = messages.map(m =>
      `${m.role === "assistant" ? "INTERVIEWER" : "INTERVIEWEE"}: ${m.content}`
    ).join("\n\n");

    const res = await fetch(`/api/admin/companies/${id}/documents/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ docId: selectedDoc, transcript }),
    });

    if (res.ok) {
      const data = await res.json();
      setResult(data);
      setMode("result");
    }
    setGenerating(false);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("docId", selectedDoc || "");
    formData.append("title", DOC_OPTIONS.find(d => d.id === selectedDoc)?.title || file.name);

    const res = await fetch(`/api/admin/companies/${id}/documents/upload-file`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setResult(data);
      setMode("result");
    }
    setUploading(false);
    e.target.value = "";
  }

  // SELECT MODE
  if (mode === "select") {
    const doc = DOC_OPTIONS.find(d => d.id === selectedDoc);
    return (
      <PageShell nav={<NavBar role="admin" active="Admin" />}>
        <Card style={{ background: "#ECECEA", border: "1px solid #DDDBD5" }}>
          <a href={`/admin/company/${id}`} style={{ fontSize: 12, color: "#6B6B6B", textDecoration: "none" }}>← Back to company</a>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0A0A0A", marginTop: 8 }}>Document Builder</h2>
          <p style={{ fontSize: 13, color: "#6B6B6B" }}>Generate onboarding documents through AI interviews or file upload</p>
        </Card>

        <Card>
          <SectionLabel>Choose a document to create</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {DOC_OPTIONS.map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedDoc(d.id)}
                style={{
                  padding: "12px 16px", borderRadius: 10, border: selectedDoc === d.id ? "2px solid #0A0A0A" : "1px solid #E2E0DA",
                  background: selectedDoc === d.id ? "#F5F4F0" : "#FFFFFF",
                  cursor: "pointer", textAlign: "left",
                }}
              >
                <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A" }}>{d.title}</p>
                <p style={{ fontSize: 11, color: "#AEABA3", marginTop: 2 }}>{d.dim} · Interview {d.who}</p>
              </button>
            ))}
          </div>
        </Card>

        {selectedDoc && doc && (
          <Card>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{doc.title}</h3>
            <p style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 8 }}>
              {doc.canUpload
                ? "Upload an existing file to keep its format, or use the AI interview to generate a new document in FACET standard format."
                : `Interview the ${doc.who} to generate this document — no existing file needed.`}
            </p>
            <p style={{ fontSize: 11, color: "#AEABA3", marginBottom: 16 }}>
              {doc.canUpload
                ? "Upload = keeps your format. AI Interview = generates FACET standard template."
                : "The AI will ask 6-8 questions and create a polished document from your answers."}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setMode("interview"); sendMessage(null); }} style={{
                padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer",
                background: "#0A0A0A", color: "#FFFFFF", fontSize: 13, fontWeight: 600,
              }}>
                AI Interview
              </button>
              {doc.canUpload && (
                <label style={{
                  padding: "10px 24px", borderRadius: 10, cursor: "pointer",
                  background: "#F5F4F0", color: "#0A0A0A", fontSize: 13, fontWeight: 600,
                  border: "1px solid #E2E0DA", display: "inline-block",
                }}>
                  Upload File (keep format)
                  <input type="file" accept=".txt,.pdf,.doc,.docx,.md" onChange={handleFileUpload} hidden />
                </label>
              )}
            </div>
          </Card>
        )}
      </PageShell>
    );
  }

  // RESULT MODE
  if (mode === "result" && result) {
    return (
      <PageShell nav={<NavBar role="admin" active="Admin" />}>
        <Card style={{ background: "#EAF4EF", border: "1px solid #2D6A4F33" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#2D6A4F", marginBottom: 4 }}>Document generated and saved</p>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A" }}>{result.title}</h2>
        </Card>

        <Card>
          <div style={{ whiteSpace: "pre-wrap", fontSize: 14, color: "#0A0A0A", lineHeight: 1.8 }}>
            {result.content}
          </div>
        </Card>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => {
            setMode("select");
            setSelectedDoc(null);
            setMessages([]);
            setComplete(false);
            setResult(null);
          }} style={{
            padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer",
            background: "#0A0A0A", color: "#FFFFFF", fontSize: 13, fontWeight: 600,
          }}>
            Build another document
          </button>
          <a href={`/admin/company/${id}`} style={{
            padding: "10px 24px", borderRadius: 10, background: "#F5F4F0", color: "#6B6B6B",
            fontSize: 13, fontWeight: 600, textDecoration: "none", border: "1px solid #E2E0DA",
          }}>
            Back to company
          </a>
        </div>
      </PageShell>
    );
  }

  // INTERVIEW MODE
  return (
    <PageShell nav={<NavBar role="admin" active="Admin" />}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ background: "#F5F4F0", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ background: "#0A0A0A", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#FFFFFF" }}>
                {DOC_OPTIONS.find(d => d.id === selectedDoc)?.title || "Document Interview"}
              </p>
              <p style={{ fontSize: 10, color: "#888" }}>
                {generating ? "Generating document..." : loading ? "Thinking..." : "AI-guided document builder"}
              </p>
            </div>
          </div>

          <div ref={scrollRef} style={{ padding: "18px 20px", maxHeight: 450, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
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

          {/* Input — always visible unless generating */}
          {!generating && (
            <form onSubmit={e => {
              e.preventDefault();
              if (!input.trim() || loading) return;
              sendMessage(input.trim());
              setInput("");
            }} style={{ padding: "14px 20px", borderTop: "1px solid #E2E0DA", display: "flex", gap: 10 }}>
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
          )}

          {/* Completion — show after interview finishes */}
          {complete && (
            <div style={{ padding: "16px 20px", borderTop: "1px solid #E2E0DA", textAlign: "center", background: "#EAF4EF" }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#2D6A4F", marginBottom: 12 }}>
                Thank you! The interview is complete.
              </p>
              {!generating ? (
                <button onClick={generateDoc} style={{
                  padding: "12px 28px", borderRadius: 10, border: "none", cursor: "pointer",
                  background: "#2D6A4F", color: "#FFFFFF", fontSize: 14, fontWeight: 700,
                }}>
                  Generate Document
                </button>
              ) : (
                <p style={{ fontSize: 13, color: "#6B6B6B" }}>Generating your document...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
