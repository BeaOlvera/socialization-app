"use client";
import { NavBar, PageShell, Card, SectionLabel, BucketTag } from "@/components/ui";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Template {
  id: string;
  phase: string;
  dimension: string;
  activity: string;
  type: string;
  assigned_to: string;
  active: boolean;
}

interface Newcomer {
  id: string;
  user_id: string;
  department: string;
  position: string;
  start_date: string;
  status: string;
  users?: { name: string; email: string };
}

interface Config {
  has_buddies: boolean;
  checkin_frequency: string;
}

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<any>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [newcomers, setNewcomers] = useState<Newcomer[]>([]);
  const [config, setConfig] = useState<Config>({ has_buddies: true, checkin_frequency: "monthly" });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"templates" | "checkins" | "newcomers" | "config">("templates");
  const [uploading, setUploading] = useState(false);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/companies`).then(r => r.json()),
      fetch(`/api/admin/companies/${id}/templates`).then(r => r.json()),
      fetch(`/api/admin/companies/${id}/config`).then(r => r.json()),
      fetchNewcomers(),
    ]).then(([companies, tmpl, cfg]) => {
      setCompany(companies.find((c: any) => c.id === id));
      setTemplates(Array.isArray(tmpl) ? tmpl : []);
      setConfig(cfg);
    }).finally(() => setLoading(false));
  }, [id]);

  async function fetchNewcomers() {
    const res = await fetch(`/api/admin/companies/${id}/newcomers`);
    if (res.ok) {
      const data = await res.json();
      setNewcomers(Array.isArray(data) ? data : []);
    }
  }

  async function handleUploadActivities(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "activity");

    const res = await fetch(`/api/admin/companies/${id}/upload`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setMessage(`Uploaded ${data.count} activities`);
      // Refresh templates
      const tmpl = await fetch(`/api/admin/companies/${id}/templates`).then(r => r.json());
      setTemplates(Array.isArray(tmpl) ? tmpl : []);
    } else {
      const err = await res.json();
      setMessage(`Error: ${err.error}`);
    }
    setUploading(false);
    e.target.value = "";
  }

  async function handleUploadCheckins(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "checkin");

    const res = await fetch(`/api/admin/companies/${id}/upload`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setMessage(`Uploaded ${data.count} check-ins`);
      const tmpl = await fetch(`/api/admin/companies/${id}/templates`).then(r => r.json());
      setTemplates(Array.isArray(tmpl) ? tmpl : []);
    } else {
      const err = await res.json();
      setMessage(`Error: ${err.error}`);
    }
    setUploading(false);
    e.target.value = "";
  }

  async function assignToNewcomer(newcomerId: string) {
    setAssigning(newcomerId);
    setMessage("");
    const res = await fetch(`/api/admin/companies/${id}/newcomers/${newcomerId}/assign`, {
      method: "POST",
    });
    if (res.ok) {
      const data = await res.json();
      setMessage(`Assigned ${data.assigned} items (${data.activities} activities, ${data.checkins} check-ins)`);
    } else {
      const err = await res.json();
      setMessage(`Error: ${err.error}`);
    }
    setAssigning(null);
  }

  async function updateConfig(updates: Partial<Config>) {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    await fetch(`/api/admin/companies/${id}/config`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
  }

  const activities = templates.filter(t => (t.type || "activity") === "activity");
  const checkins = templates.filter(t => t.type === "checkin");

  if (loading) {
    return (
      <PageShell nav={<NavBar role={"hr" as any} active="Admin" />}>
        <div style={{ textAlign: "center", padding: 60, color: "#6B6B6B" }}>Loading...</div>
      </PageShell>
    );
  }

  return (
    <PageShell nav={<NavBar role={"hr" as any} active="Admin" />}>
      {/* Header */}
      <Card style={{ background: "#ECECEA", border: "1px solid #DDDBD5" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 10, color: "#AEABA3", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Company Setup</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0A0A0A" }}>{company?.name}</h2>
            <p style={{ fontSize: 13, color: "#6B6B6B" }}>
              {activities.length} activities · {checkins.length} check-ins · {newcomers.length} newcomers
            </p>
          </div>
          <a href="/admin" style={{ fontSize: 13, color: "#6B6B6B", textDecoration: "none" }}>← All companies</a>
        </div>
      </Card>

      {message && (
        <div style={{
          padding: "10px 16px", borderRadius: 10,
          background: message.startsWith("Error") ? "#FBEAEC" : "#EAF4EF",
          color: message.startsWith("Error") ? "#9B2335" : "#2D6A4F",
          fontSize: 13, fontWeight: 600,
        }}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6 }}>
        {(["templates", "checkins", "newcomers", "config"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 18px", borderRadius: 10, border: tab === t ? "2px solid #0A0A0A" : "1px solid #E2E0DA",
            background: tab === t ? "#0A0A0A" : "#FFFFFF", color: tab === t ? "#FFFFFF" : "#6B6B6B",
            fontSize: 13, fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
          }}>
            {t === "templates" ? `Activities (${activities.length})` :
             t === "checkins" ? `Check-ins (${checkins.length})` :
             t === "newcomers" ? `Newcomers (${newcomers.length})` : "Config"}
          </button>
        ))}
      </div>

      {/* Activities tab */}
      {tab === "templates" && (
        <>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <SectionLabel>Activity Templates</SectionLabel>
              <label style={{
                padding: "8px 16px", borderRadius: 8, background: "#0A0A0A", color: "#FFFFFF",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>
                {uploading ? "Uploading..." : "Upload Excel"}
                <input type="file" accept=".xlsx,.xls" onChange={handleUploadActivities} hidden />
              </label>
            </div>
            {activities.length === 0 ? (
              <p style={{ color: "#6B6B6B", fontSize: 13 }}>No activities uploaded yet. Upload an Excel file to get started.</p>
            ) : (
              <div style={{ maxHeight: 400, overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #E2E0DA" }}>
                      <th style={{ textAlign: "left", padding: "6px 8px", color: "#AEABA3", fontWeight: 600 }}>Phase</th>
                      <th style={{ textAlign: "left", padding: "6px 8px", color: "#AEABA3", fontWeight: 600 }}>Dim</th>
                      <th style={{ textAlign: "left", padding: "6px 8px", color: "#AEABA3", fontWeight: 600 }}>Activity</th>
                      <th style={{ textAlign: "left", padding: "6px 8px", color: "#AEABA3", fontWeight: 600 }}>Who</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((t, i) => (
                      <tr key={t.id || i} style={{ borderBottom: "1px solid #F5F4F0" }}>
                        <td style={{ padding: "6px 8px", color: "#6B6B6B" }}>{t.phase}</td>
                        <td style={{ padding: "6px 8px" }}><BucketTag bucket={t.dimension} /></td>
                        <td style={{ padding: "6px 8px", color: "#0A0A0A" }}>{t.activity}</td>
                        <td style={{ padding: "6px 8px", color: "#6B6B6B" }}>{(t as any).who || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}

      {/* Check-ins tab */}
      {tab === "checkins" && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <SectionLabel>Check-in Templates</SectionLabel>
            <label style={{
              padding: "8px 16px", borderRadius: 8, background: "#0A0A0A", color: "#FFFFFF",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>
              {uploading ? "Uploading..." : "Upload Excel"}
              <input type="file" accept=".xlsx,.xls" onChange={handleUploadCheckins} hidden />
            </label>
          </div>
          {checkins.length === 0 ? (
            <p style={{ color: "#6B6B6B", fontSize: 13 }}>No check-ins uploaded yet. Upload the check-in schedule Excel.</p>
          ) : (
            <div style={{ maxHeight: 400, overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #E2E0DA" }}>
                    <th style={{ textAlign: "left", padding: "6px 8px", color: "#AEABA3", fontWeight: 600 }}>Phase</th>
                    <th style={{ textAlign: "left", padding: "6px 8px", color: "#AEABA3", fontWeight: 600 }}>Day(s)</th>
                    <th style={{ textAlign: "left", padding: "6px 8px", color: "#AEABA3", fontWeight: 600 }}>Check-in</th>
                    <th style={{ textAlign: "left", padding: "6px 8px", color: "#AEABA3", fontWeight: 600 }}>Who</th>
                    <th style={{ textAlign: "left", padding: "6px 8px", color: "#AEABA3", fontWeight: 600 }}>Assigned to</th>
                  </tr>
                </thead>
                <tbody>
                  {checkins.map((t, i) => (
                    <tr key={t.id || i} style={{ borderBottom: "1px solid #F5F4F0" }}>
                      <td style={{ padding: "6px 8px", color: "#6B6B6B" }}>{t.phase}</td>
                      <td style={{ padding: "6px 8px", color: "#6B6B6B" }}>{(t as any).days || "-"}</td>
                      <td style={{ padding: "6px 8px", color: "#0A0A0A" }}>{t.activity}</td>
                      <td style={{ padding: "6px 8px", color: "#6B6B6B" }}>{(t as any).who || "-"}</td>
                      <td style={{ padding: "6px 8px" }}>
                        <span style={{
                          fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                          background: t.assigned_to === "newcomer" ? "#EEEEF5" : t.assigned_to === "manager" ? "#EAF4EF" : t.assigned_to === "buddy" ? "#FEF3E2" : "#FBEAEC",
                          color: t.assigned_to === "newcomer" ? "#1A1A2E" : t.assigned_to === "manager" ? "#2D6A4F" : t.assigned_to === "buddy" ? "#B7791F" : "#9B2335",
                        }}>
                          {t.assigned_to}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Newcomers tab */}
      {tab === "newcomers" && (
        <Card>
          <SectionLabel>Newcomers</SectionLabel>
          {newcomers.length === 0 ? (
            <p style={{ color: "#6B6B6B", fontSize: 13 }}>No newcomers yet. HR will add them.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {newcomers.map(n => (
                <div key={n.id} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 16px", background: "#F5F4F0", borderRadius: 10,
                }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A" }}>
                      {(n as any).user_name || (n as any).users?.name || "Unknown"}
                    </p>
                    <p style={{ fontSize: 12, color: "#6B6B6B" }}>
                      {n.position || "No position"} · {n.department || "No dept"} · Start: {n.start_date}
                    </p>
                  </div>
                  <button
                    onClick={() => assignToNewcomer(n.id)}
                    disabled={assigning === n.id}
                    style={{
                      padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                      background: assigning === n.id ? "#E2E0DA" : "#1A1A2E", color: "#FFFFFF",
                      fontSize: 12, fontWeight: 600,
                    }}
                  >
                    {assigning === n.id ? "Assigning..." : "Assign All"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Config tab */}
      {tab === "config" && (
        <Card>
          <SectionLabel>Company Configuration</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
              <input type="checkbox" checked={config.has_buddies}
                onChange={e => updateConfig({ has_buddies: e.target.checked })}
                style={{ width: 18, height: 18 }}
              />
              <div>
                <p style={{ fontWeight: 600, color: "#0A0A0A" }}>Buddy System</p>
                <p style={{ fontSize: 12, color: "#6B6B6B" }}>When disabled, buddy check-ins are excluded from assignments</p>
              </div>
            </label>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Check-in Frequency</label>
              <select value={config.checkin_frequency}
                onChange={e => updateConfig({ checkin_frequency: e.target.value })}
                style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #E2E0DA", fontSize: 13 }}
              >
                <option value="biweekly">Biweekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
          </div>
        </Card>
      )}
    </PageShell>
  );
}
