"use client";
import { useEffect, useState } from "react";
import { NavBar, PageShell, Card, SectionLabel, BucketTag } from "@/components/ui";

interface Doc {
  id: string;
  dimension: string;
  title: string;
  description: string | null;
  url: string | null;
  content: string | null;
}

const DIM_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  fit: { label: "FIT · Role Clarity", color: "#1A1A2E", bg: "#EEEEF5" },
  ace: { label: "ACE · Task Mastery", color: "#2D6A4F", bg: "#EAF4EF" },
  tie: { label: "TIE · Social Acceptance", color: "#9B2335", bg: "#FBEAEC" },
};

export default function DocsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/newcomer/documents")
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setDocs(data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PageShell nav={<NavBar role="newcomer" active="Documents" />}>
        <div style={{ textAlign: "center", padding: 60, color: "#6B6B6B" }}>Loading...</div>
      </PageShell>
    );
  }

  if (docs.length === 0) {
    return (
      <PageShell nav={<NavBar role="newcomer" active="Documents" />}>
        <div style={{ textAlign: "center", padding: 60 }}>
          <p style={{ fontSize: 16, color: "#6B6B6B" }}>No documents available yet.</p>
          <p style={{ fontSize: 13, color: "#AEABA3" }}>Your HR team will add documents here.</p>
        </div>
      </PageShell>
    );
  }

  const dims = ["fit", "ace", "tie"] as const;

  return (
    <PageShell nav={<NavBar role="newcomer" active="Documents" />}>
      <div className="space-y-1">
        <h2 className="text-xl font-bold">Documents</h2>
        <p className="text-sm text-[#6B6B6B]">Key resources for your onboarding, organized by the three FACET dimensions.</p>
      </div>

      {dims.map(dim => {
        const dimDocs = docs.filter(d => d.dimension === dim);
        if (dimDocs.length === 0) return null;
        const cfg = DIM_CONFIG[dim];

        return (
          <div key={dim}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <BucketTag bucket={dim} />
              <SectionLabel>{cfg.label}</SectionLabel>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {dimDocs.map(doc => (
                <DocCard key={doc.id} doc={doc} dimColor={cfg.color} dimBg={cfg.bg} />
              ))}
            </div>
          </div>
        );
      })}
    </PageShell>
  );
}

function DocCard({ doc, dimColor, dimBg }: { doc: Doc; dimColor: string; dimBg: string }) {
  const [expanded, setExpanded] = useState(false);

  // Format content: bold lines that end with colon or are ALL CAPS become headings
  function formatContent(text: string) {
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return <br key={i} />;
      // Lines that are short and end with colon, or ALL CAPS = title
      const isTitle = (trimmed.length < 80 && trimmed.endsWith(':')) ||
                      (trimmed.length < 60 && trimmed === trimmed.toUpperCase() && trimmed.length > 3);
      // Lines that start with - or * = bullet
      const isBullet = trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('\u2022');
      if (isTitle) {
        return <p key={i} style={{ fontSize: 15, fontWeight: 700, color: "#0A0A0A", marginTop: i > 0 ? 16 : 0, marginBottom: 4 }}>{trimmed.replace(/:$/, '')}</p>;
      }
      if (isBullet) {
        return <p key={i} style={{ fontSize: 14, color: "#0A0A0A", paddingLeft: 16, marginBottom: 4 }}>{trimmed}</p>;
      }
      return <p key={i} style={{ fontSize: 14, color: "#333", marginBottom: 6 }}>{trimmed}</p>;
    });
  }

  return (
    <Card style={{ borderLeft: `4px solid ${dimColor}` }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: "#0A0A0A", marginBottom: 4 }}>{doc.title}</p>
          {doc.description && (
            <p style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.6 }}>{doc.description}</p>
          )}
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          {doc.content && (
            <button onClick={() => setExpanded(!expanded)} style={{
              fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 8,
              background: expanded ? "#0A0A0A" : dimBg, color: expanded ? "#FFFFFF" : dimColor,
              border: "none", cursor: "pointer",
            }}>
              {expanded ? "Close" : "Read"}
            </button>
          )}
          {doc.url && (
            <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{
              fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 8,
              background: dimBg, color: dimColor, textDecoration: "none",
            }}>
              Open
            </a>
          )}
        </div>
      </div>
      {expanded && doc.content && (
        <div style={{ marginTop: 16 }}>
          {/* FACET branded document header */}
          <div style={{
            background: "#0A0A0A", borderRadius: "10px 10px 0 0", padding: "14px 20px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <svg width="16" height="16" viewBox="0 0 120 120"><polygon points="60,5 95,40 60,50 25,40" fill="#FFF"/><polygon points="25,40 60,50 60,115" fill="#CCC"/><polygon points="95,40 60,50 60,115" fill="#888"/></svg>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.05em" }}>FACET</span>
            <span style={{ fontSize: 10, color: "#888", marginLeft: "auto" }}>{doc.title}</span>
          </div>
          {/* Document content */}
          <div style={{
            padding: "24px 28px", background: "#FFFFFF", border: "1px solid #E2E0DA",
            borderTop: "none", borderRadius: "0 0 10px 10px",
            fontFamily: "'Inter', sans-serif", textAlign: "justify", lineHeight: 1.8,
          }}>
            {formatContent(doc.content)}
          </div>
        </div>
      )}
    </Card>
  );
}
