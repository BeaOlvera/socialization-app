"use client";
import { NavBar, PageShell, Card, SectionLabel } from "@/components/ui";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Company {
  id: string;
  name: string;
  industry: string | null;
  size: string | null;
  newcomer_count: number;
  created_at: string;
}

export default function AdminDashboard() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", industry: "", size: "", mission: "", hr_email: "", hr_name: "", hr_password: "", has_buddies: true });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/admin/companies").then(r => r.json()).then(setCompanies).finally(() => setLoading(false));
  }, []);

  async function createCompany(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const res = await fetch("/api/admin/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const { company } = await res.json();
      setCompanies(prev => [{ ...company, newcomer_count: 0 }, ...prev]);
      setShowCreate(false);
      setForm({ name: "", industry: "", size: "", mission: "", hr_email: "", hr_name: "", hr_password: "", has_buddies: true });
    }
    setCreating(false);
  }

  return (
    <PageShell nav={<NavBar role={"hr" as any} active="Admin" />}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0A0A0A" }}>Admin Dashboard</h2>
          <p style={{ fontSize: 13, color: "#6B6B6B" }}>{companies.length} companies</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} style={{
          padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer",
          background: "#0A0A0A", color: "#FFFFFF", fontSize: 13, fontWeight: 600,
        }}>
          + New Company
        </button>
      </div>

      {showCreate && (
        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Create Company</h3>
          <form onSubmit={createCompany} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <InputField label="Company Name *" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
              <InputField label="Industry" value={form.industry} onChange={v => setForm(f => ({ ...f, industry: v }))} />
              <InputField label="HR Admin Email *" value={form.hr_email} onChange={v => setForm(f => ({ ...f, hr_email: v }))} type="email" />
              <InputField label="HR Admin Name *" value={form.hr_name} onChange={v => setForm(f => ({ ...f, hr_name: v }))} />
              <InputField label="HR Admin Password *" value={form.hr_password} onChange={v => setForm(f => ({ ...f, hr_password: v }))} type="password" />
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Buddies?</label>
                <label style={{ fontSize: 13, color: "#6B6B6B", display: "flex", alignItems: "center", gap: 6 }}>
                  <input type="checkbox" checked={form.has_buddies} onChange={e => setForm(f => ({ ...f, has_buddies: e.target.checked }))} />
                  Company uses buddy system
                </label>
              </div>
            </div>
            <button type="submit" disabled={creating} style={{
              padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer",
              background: creating ? "#E2E0DA" : "#0A0A0A", color: "#FFFFFF", fontSize: 13, fontWeight: 600,
              alignSelf: "flex-start",
            }}>
              {creating ? "Creating..." : "Create Company"}
            </button>
          </form>
        </Card>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#6B6B6B" }}>Loading...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {companies.map(c => (
            <Link key={c.id} href={`/admin/company/${c.id}`} style={{ textDecoration: "none" }}>
              <Card className="hover:border-[#0A0A0A] transition-colors cursor-pointer">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A" }}>{c.name}</h3>
                    <p style={{ fontSize: 12, color: "#6B6B6B" }}>
                      {c.industry || "No industry"} · {c.newcomer_count} newcomer{c.newcomer_count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <span style={{ color: "#AEABA3", fontSize: 14 }}>&#8250;</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}

function InputField({ label, value, onChange, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        required={label.includes("*")}
        style={{
          width: "100%", padding: "8px 12px", borderRadius: 8,
          border: "1px solid #E2E0DA", fontSize: 13, boxSizing: "border-box",
          background: "#FAFAF8",
        }}
      />
    </div>
  );
}
