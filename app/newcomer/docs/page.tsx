"use client";
import { useEffect, useState } from "react";
import { NavBar, PageShell, Card, SectionLabel, BucketTag } from "@/components/ui";

interface Doc {
  id: string;
  dimension: string;
  title: string;
  description: string | null;
  url: string | null;
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
                <Card key={doc.id} style={{ borderLeft: `4px solid ${cfg.color}` }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 600, color: "#0A0A0A", marginBottom: 4 }}>{doc.title}</p>
                      {doc.description && (
                        <p style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.6 }}>{doc.description}</p>
                      )}
                    </div>
                    {doc.url && (
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{
                        fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 8,
                        background: cfg.bg, color: cfg.color, textDecoration: "none", flexShrink: 0,
                      }}>
                        Open
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </PageShell>
  );
}
