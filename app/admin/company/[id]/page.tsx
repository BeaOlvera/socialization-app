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

const ALL_PAGES = [
  { key: "home", label: "Home", description: "Dashboard with progress overview" },
  { key: "activities", label: "Activities", description: "Full activity checklist with check-ins" },
  { key: "timeline", label: "Timeline", description: "12-month journey overview by phase" },
  { key: "buckets", label: "My Journey", description: "FIT/ACE/TIE dimension breakdown" },
  { key: "progress", label: "Progress", description: "Completion stats and insights" },
  { key: "org", label: "Org Chart", description: "Newcomer's local org structure" },
  { key: "people", label: "My People", description: "Team members and connections" },
  { key: "docs", label: "Documents", description: "Onboarding documents and resources" },
];

interface Config {
  has_buddies: boolean;
  checkin_frequency: string;
  visible_pages: string[];
}

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<any>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [newcomers, setNewcomers] = useState<Newcomer[]>([]);
  const defaultVisiblePages = ALL_PAGES.map(p => p.key);
  const [config, setConfig] = useState<Config>({ has_buddies: true, checkin_frequency: "monthly", visible_pages: defaultVisiblePages });
  const [docs, setDocs] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [orgNodes, setOrgNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"templates" | "checkins" | "people" | "employees" | "orgchart" | "newcomers" | "docs" | "config">("templates");
  const [uploading, setUploading] = useState(false);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/companies`).then(r => r.json()),
      fetch(`/api/admin/companies/${id}/templates`).then(r => r.json()),
      fetch(`/api/admin/companies/${id}/config`).then(r => r.json()),
      fetch(`/api/admin/companies/${id}/documents`).then(r => r.json()),
      fetch(`/api/admin/companies/${id}/employees`).then(r => r.ok ? r.json() : []),
      fetch(`/api/admin/companies/${id}/orgchart`).then(r => r.ok ? r.json() : []),
      fetchNewcomers(),
    ]).then(([companies, tmpl, cfg, docsData, empData, orgData]) => {
      setCompany(companies.find((c: any) => c.id === id));
      setTemplates(Array.isArray(tmpl) ? tmpl : []);
      setConfig(cfg);
      setDocs(Array.isArray(docsData) ? docsData : []);
      setEmployees(Array.isArray(empData) ? empData : []);
      setOrgNodes(Array.isArray(orgData) ? orgData : []);
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

  async function handleImportPeople(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("autoAssign", "true");

    const res = await fetch(`/api/admin/companies/${id}/import-people`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      const parts = [];
      if (data.users_created) parts.push(`${data.users_created} users`);
      if (data.newcomers_created) parts.push(`${data.newcomers_created} newcomers`);
      if (data.org_links) parts.push(`${data.org_links} org links`);
      setMessage(`Imported: ${parts.join(", ")}${data.errors?.length ? ` (${data.errors.length} errors)` : ""}`);
      // Refresh newcomers
      fetchNewcomers();
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
      <PageShell nav={<NavBar role="admin" active="Admin" />}>
        <div style={{ textAlign: "center", padding: 60, color: "#6B6B6B" }}>Loading...</div>
      </PageShell>
    );
  }

  return (
    <PageShell nav={<NavBar role="admin" active="Admin" />}>
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
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <a href="/admin" style={{ fontSize: 13, color: "#6B6B6B", textDecoration: "none" }}>← All companies</a>
            <button onClick={async () => {
              if (!confirm(`Delete ${company?.name}? This removes ALL data including employees, newcomers, activities, and documents. This cannot be undone.`)) return;
              const res = await fetch("/api/admin/companies", {
                method: "DELETE", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ companyId: id }),
              });
              if (res.ok) window.location.href = "/admin";
            }} style={{ fontSize: 10, color: "#9B2335", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
              Delete company
            </button>
          </div>
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
        {(["templates", "checkins", "people", "employees", "orgchart", "newcomers", "docs", "config"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 18px", borderRadius: 10, border: tab === t ? "2px solid #0A0A0A" : "1px solid #E2E0DA",
            background: tab === t ? "#0A0A0A" : "#FFFFFF", color: tab === t ? "#FFFFFF" : "#6B6B6B",
            fontSize: 13, fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
          }}>
            {t === "templates" ? `Activities (${activities.length})` :
             t === "checkins" ? `Check-ins (${checkins.length})` :
             t === "people" ? "Import People" :
             t === "employees" ? `Employees (${employees.length})` :
             t === "orgchart" ? "Org Chart" :
             t === "newcomers" ? `Newcomers (${newcomers.length})` :
             t === "docs" ? `Documents (${docs.length})` : "Config"}
          </button>
        ))}
      </div>

      {/* Activities tab */}
      {tab === "templates" && (
        <>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <SectionLabel>Activity Templates</SectionLabel>
              <div style={{ display: "flex", gap: 8 }}>
                <a href="/api/admin/templates?type=activities" style={{
                  padding: "8px 16px", borderRadius: 8, background: "#F5F4F0", color: "#6B6B6B",
                  fontSize: 12, fontWeight: 600, textDecoration: "none", border: "1px solid #E2E0DA",
                }}>
                  Download Template
                </a>
                <label style={{
                  padding: "8px 16px", borderRadius: 8, background: "#0A0A0A", color: "#FFFFFF",
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                }}>
                  {uploading ? "Uploading..." : "Upload Excel"}
                  <input type="file" accept=".xlsx,.xls" onChange={handleUploadActivities} hidden />
                </label>
              </div>
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
            <div style={{ display: "flex", gap: 8 }}>
              <a href="/api/admin/templates?type=checkins" style={{
                padding: "8px 16px", borderRadius: 8, background: "#F5F4F0", color: "#6B6B6B",
                fontSize: 12, fontWeight: 600, textDecoration: "none", border: "1px solid #E2E0DA",
              }}>
                Download Template
              </a>
              <label style={{
                padding: "8px 16px", borderRadius: 8, background: "#0A0A0A", color: "#FFFFFF",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>
                {uploading ? "Uploading..." : "Upload Excel"}
                <input type="file" accept=".xlsx,.xls" onChange={handleUploadCheckins} hidden />
              </label>
            </div>
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

      {/* People import tab */}
      {tab === "people" && (
        <Card>
          <SectionLabel>Bulk Import Employees & Newcomers</SectionLabel>
          <p style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 16, lineHeight: 1.6 }}>
            Upload an Excel file with all employees. The system will create user accounts, newcomer records,
            org chart relationships, and auto-assign all activities + check-ins.
          </p>

          <div style={{ background: "#F5F4F0", borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Required Excel columns:</p>
            <table style={{ fontSize: 12, borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #E2E0DA" }}>
                  <th style={{ textAlign: "left", padding: "4px 8px", color: "#0A0A0A", fontWeight: 700 }}>Column</th>
                  <th style={{ textAlign: "left", padding: "4px 8px", color: "#0A0A0A", fontWeight: 700 }}>Required</th>
                  <th style={{ textAlign: "left", padding: "4px 8px", color: "#0A0A0A", fontWeight: 700 }}>Example</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Name", "Yes", "Sofia Martinez"],
                  ["Email", "Yes", "sofia@company.com"],
                  ["Role/Position", "No", "Sr. Marketing Manager"],
                  ["Department", "No", "Marketing"],
                  ["Reports To", "No", "claire@company.com"],
                  ["Is Newcomer", "Yes", "Yes / No"],
                  ["Start Date", "If newcomer", "2026-03-03"],
                  ["Buddy Email", "No", "james@company.com"],
                  ["Password", "No", "Defaults to welcome123"],
                ].map(([col, req, ex]) => (
                  <tr key={col} style={{ borderBottom: "1px solid #E2E0DA" }}>
                    <td style={{ padding: "4px 8px", fontWeight: 600 }}>{col}</td>
                    <td style={{ padding: "4px 8px", color: req === "Yes" ? "#9B2335" : "#6B6B6B" }}>{req}</td>
                    <td style={{ padding: "4px 8px", color: "#AEABA3" }}>{ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href="/api/admin/templates?type=people" style={{
              padding: "10px 20px", borderRadius: 10, background: "#F5F4F0", color: "#6B6B6B",
              fontSize: 13, fontWeight: 600, textDecoration: "none", border: "1px solid #E2E0DA",
            }}>
              Download Template
            </a>
            <label style={{
              padding: "10px 20px", borderRadius: 10, background: "#0A0A0A", color: "#FFFFFF",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>
              {uploading ? "Importing..." : "Upload People Excel"}
              <input type="file" accept=".xlsx,.xls" onChange={handleImportPeople} hidden />
            </label>
            <p style={{ fontSize: 11, color: "#AEABA3" }}>
              Activities & check-ins will be auto-assigned to newcomers
            </p>
          </div>
        </Card>
      )}

      {/* Employees tab */}
      {tab === "employees" && (
        <Card>
          <SectionLabel>All Employees</SectionLabel>
          {employees.length === 0 ? (
            <p style={{ color: "#6B6B6B", fontSize: 13 }}>No employees yet. Use Import People to add them.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {employees.map(emp => (
                <div key={emp.id} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                  background: emp.role === "newcomer" ? "#EEEEF5" : "#F5F4F0", borderRadius: 10,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A" }}>
                      {emp.name}
                      <span style={{ fontSize: 10, fontWeight: 600, marginLeft: 8, padding: "2px 8px", borderRadius: 20,
                        background: emp.role === "newcomer" ? "#1A1A2E" : emp.role === "hr_admin" ? "#9B2335" : "#2D6A4F",
                        color: "#FFF" }}>{emp.role}</span>
                    </p>
                    <p style={{ fontSize: 11, color: "#6B6B6B", marginTop: 2 }}>
                      {emp.email} {emp.department ? `· ${emp.department}` : ""} {emp.position ? `· ${emp.position}` : ""}
                      {emp.manager_name ? ` · Reports to: ${emp.manager_name}` : ""}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button onClick={async () => {
                      const name = prompt("Name:", emp.name);
                      if (!name || name === emp.name) return;
                      await fetch(`/api/admin/companies/${id}/employees`, {
                        method: "PATCH", headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId: emp.id, name }),
                      });
                      setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, name } : e));
                    }} style={{ fontSize: 10, color: "#1A1A2E", background: "#EEEEF5", border: "none", cursor: "pointer", fontWeight: 600, padding: "3px 8px", borderRadius: 4 }}>
                      Edit
                    </button>
                    <button onClick={async () => {
                      if (!confirm(`Delete ${emp.name}? This removes all their data.`)) return;
                      await fetch(`/api/admin/companies/${id}/employees`, {
                        method: "DELETE", headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId: emp.id }),
                      });
                      setEmployees(prev => prev.filter(e => e.id !== emp.id));
                      setMessage(`${emp.name} deleted`);
                    }} style={{ fontSize: 10, color: "#9B2335", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Org Chart tab */}
      {tab === "orgchart" && (
        <Card>
          <SectionLabel>Company Org Chart</SectionLabel>
          {orgNodes.length === 0 ? (
            <p style={{ color: "#6B6B6B", fontSize: 13 }}>No employees yet.</p>
          ) : (() => {
            const withManager = orgNodes.filter(n => n.manager_id);
            const topLevel = orgNodes.filter(n => !n.manager_id);
            const nameMap: Record<string, any> = {};
            orgNodes.forEach(n => { nameMap[n.id] = n; });

            return (
              <div>
                {/* Top level (no manager) */}
                {topLevel.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <p style={{ fontSize: 11, color: "#AEABA3", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>No manager assigned</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {topLevel.map(n => (
                        <div key={n.id} style={{
                          padding: "8px 14px", borderRadius: 8,
                          background: n.is_newcomer ? "#EEEEF5" : "#F5F4F0",
                          border: n.is_newcomer ? "2px solid #1A1A2E" : "1px solid #E2E0DA",
                        }}>
                          <p style={{ fontSize: 12, fontWeight: 600 }}>{n.name}</p>
                          <p style={{ fontSize: 10, color: "#6B6B6B" }}>{n.position} {n.department ? `· ${n.department}` : ""}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Group by manager */}
                {(() => {
                  const managers = [...new Set(withManager.map(n => n.manager_id))];
                  return managers.map(mgId => {
                    const mgr = nameMap[mgId];
                    const reports = withManager.filter(n => n.manager_id === mgId);
                    return (
                      <div key={mgId} style={{ marginBottom: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 99, background: "#2D6A4F", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontWeight: 700, fontSize: 11 }}>
                            {mgr?.name?.split(" ").map((w: string) => w[0]).join("") || "?"}
                          </div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 700 }}>{mgr?.name || "Unknown"}</p>
                            <p style={{ fontSize: 10, color: "#6B6B6B" }}>{mgr?.position}</p>
                          </div>
                        </div>
                        <div style={{ marginLeft: 16, borderLeft: "2px solid #E2E0DA", paddingLeft: 16, display: "flex", flexDirection: "column", gap: 6 }}>
                          {reports.map(r => (
                            <div key={r.id} style={{
                              padding: "6px 12px", borderRadius: 6,
                              background: r.is_newcomer ? "#EEEEF5" : "#F5F4F0",
                              border: r.is_newcomer ? "2px solid #1A1A2E" : "1px solid #E2E0DA",
                              display: "flex", alignItems: "center", gap: 8,
                            }}>
                              <p style={{ fontSize: 12, fontWeight: 600 }}>{r.name}</p>
                              <p style={{ fontSize: 10, color: "#6B6B6B" }}>{r.position}</p>
                              {r.is_newcomer && <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 10, background: "#1A1A2E", color: "#FFF" }}>Newcomer</span>}
                              {r.buddy_id && nameMap[r.buddy_id] && <span style={{ fontSize: 9, color: "#B7791F" }}>Buddy: {nameMap[r.buddy_id].name}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            );
          })()}
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
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <a href={`/api/admin/companies/${id}/newcomers/${n.id}/transcript?type=pre-arrival`}
                      style={{ padding: "6px 12px", borderRadius: 6, background: "#F5F4F0", color: "#6B6B6B", fontSize: 10, fontWeight: 600, textDecoration: "none", border: "1px solid #E2E0DA" }}>
                      Transcript
                    </a>
                    <CodeButton companyId={id} newcomerId={n.id} onResult={(msg: string) => setMessage(msg)} />
                    <button
                      onClick={() => assignToNewcomer(n.id)}
                      disabled={assigning === n.id}
                      style={{
                        padding: "6px 12px", borderRadius: 6, border: "none", cursor: "pointer",
                        background: assigning === n.id ? "#E2E0DA" : "#1A1A2E", color: "#FFFFFF",
                        fontSize: 10, fontWeight: 600,
                      }}
                    >
                      {assigning === n.id ? "..." : "Assign All"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Documents tab */}
      {tab === "docs" && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <SectionLabel>Company Documents</SectionLabel>
            <div style={{ display: "flex", gap: 8 }}>
            <a href={`/admin/company/${id}/doc-builder`} style={{
              padding: "8px 16px", borderRadius: 8, background: "#2D6A4F", color: "#FFFFFF",
              fontSize: 12, fontWeight: 600, textDecoration: "none",
            }}>
              AI Document Builder
            </a>
            <button onClick={async () => {
              const title = prompt("Document title:");
              if (!title) return;
              const dim = prompt("Dimension (fit / ace / tie):", "fit");
              if (!dim || !["fit","ace","tie"].includes(dim)) return;
              const desc = prompt("Description (optional):");
              const res = await fetch(`/api/admin/companies/${id}/documents`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, dimension: dim, description: desc || null }),
              });
              if (res.ok) {
                const newDoc = await res.json();
                setDocs(prev => [...prev, newDoc]);
              }
            }} style={{
              padding: "8px 16px", borderRadius: 8, background: "#0A0A0A", color: "#FFFFFF",
              fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
            }}>
              + Add Document
            </button>
            </div>
          </div>
          <p style={{ fontSize: 12, color: "#6B6B6B", marginBottom: 16 }}>
            Toggle visibility to control which documents newcomers can see. Default documents are pre-defined but can be hidden.
          </p>
          {["fit", "ace", "tie"].map(dim => {
            const dimDocs = docs.filter(d => d.dimension === dim);
            if (dimDocs.length === 0) return null;
            const dimLabel = dim === "fit" ? "FIT · Role Clarity" : dim === "ace" ? "ACE · Task Mastery" : "TIE · Social Acceptance";
            const dimColor = dim === "fit" ? "#1A1A2E" : dim === "ace" ? "#2D6A4F" : "#9B2335";
            const dimBg = dim === "fit" ? "#EEEEF5" : dim === "ace" ? "#EAF4EF" : "#FBEAEC";
            return (
              <div key={dim} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 4, height: 16, borderRadius: 2, background: dimColor }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: dimColor }}>{dimLabel}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {dimDocs.map(doc => (
                    <div key={doc.id} style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                      background: doc.visible ? dimBg : "#F5F4F0", borderRadius: 10,
                      opacity: doc.visible ? 1 : 0.5, transition: "all 0.15s",
                    }}>
                      <input type="checkbox" checked={doc.visible}
                        onChange={async () => {
                          const res = await fetch(`/api/admin/companies/${id}/documents`, {
                            method: "PATCH", headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ docId: doc.id, visible: !doc.visible }),
                          });
                          if (res.ok) {
                            setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, visible: !d.visible } : d));
                          }
                        }}
                        style={{ width: 16, height: 16, flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A" }}>
                          {doc.title}
                          {doc.is_default && <span style={{ fontSize: 9, color: "#AEABA3", marginLeft: 6 }}>(default)</span>}
                          {doc.source === "ai_interview" && <span style={{ fontSize: 9, color: "#2D6A4F", marginLeft: 6 }}>(AI generated)</span>}
                          {doc.source === "file_upload" && <span style={{ fontSize: 9, color: "#1A1A2E", marginLeft: 6 }}>(uploaded)</span>}
                        </p>
                        {doc.description && <p style={{ fontSize: 11, color: "#6B6B6B", marginTop: 2 }}>{doc.description}</p>}
                        {doc.content && (
                          <DocPreview content={doc.content} title={doc.title} />
                        )}
                      </div>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <label style={{
                          fontSize: 10, color: "#6B6B6B", background: "#F5F4F0", border: "1px solid #E2E0DA",
                          cursor: "pointer", fontWeight: 600, padding: "3px 8px", borderRadius: 4,
                        }}>
                          Upload
                          <input type="file" accept=".pdf,.txt,.doc,.docx,.md" hidden onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const formData = new FormData();
                            formData.append("file", file);
                            formData.append("docId", doc.id);
                            const res = await fetch(`/api/admin/companies/${id}/documents`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ docId: doc.id, url: file.name, source: "file_upload" }),
                            });
                            if (res.ok) {
                              setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, url: file.name, source: "file_upload" } : d));
                              setMessage(`"${doc.title}" — file linked`);
                            }
                            e.target.value = "";
                          }} />
                        </label>
                        {doc.content && (
                          <DocEditButton doc={doc} companyId={id} onSave={(newContent) => {
                            setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, content: newContent } : d));
                            setMessage("Document updated");
                          }} />
                        )}
                        {!doc.is_default && (
                          <button onClick={async () => {
                            if (!confirm("Delete this document?")) return;
                            await fetch(`/api/admin/companies/${id}/documents`, {
                              method: "DELETE", headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ docId: doc.id }),
                            });
                            setDocs(prev => prev.filter(d => d.id !== doc.id));
                          }} style={{
                            fontSize: 10, color: "#9B2335", background: "none", border: "none", cursor: "pointer", fontWeight: 600,
                          }}>
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
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

            <div style={{ borderTop: "1px solid #E2E0DA", paddingTop: 16 }}>
              <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Visible Pages</p>
              <p style={{ fontSize: 12, color: "#6B6B6B", marginBottom: 12 }}>Choose which pages newcomers can see. Hidden pages won't appear in the navigation.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {ALL_PAGES.map(page => {
                  const isOn = (config.visible_pages || defaultVisiblePages).includes(page.key);
                  const isRequired = page.key === "home" || page.key === "activities";
                  return (
                    <label key={page.key} style={{
                      display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px",
                      background: isOn ? "#F5F4F0" : "#FFFFFF", borderRadius: 10,
                      border: `1px solid ${isOn ? "#E2E0DA" : "#F5F4F0"}`,
                      cursor: isRequired ? "default" : "pointer", opacity: isRequired ? 0.7 : 1,
                    }}>
                      <input
                        type="checkbox"
                        checked={isOn}
                        disabled={isRequired}
                        onChange={() => {
                          if (isRequired) return;
                          const newPages = isOn
                            ? config.visible_pages.filter(p => p !== page.key)
                            : [...config.visible_pages, page.key];
                          updateConfig({ visible_pages: newPages });
                        }}
                        style={{ width: 16, height: 16, marginTop: 2 }}
                      />
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A" }}>
                          {page.label} {isRequired && <span style={{ fontSize: 10, color: "#AEABA3" }}>(required)</span>}
                        </p>
                        <p style={{ fontSize: 11, color: "#6B6B6B" }}>{page.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      )}
    </PageShell>
  );
}

function CodeButton({ companyId, newcomerId, onResult }: { companyId: string; newcomerId: string; onResult: (msg: string) => void }) {
  const [coding, setCoding] = useState(false);

  async function handleCode() {
    setCoding(true);
    onResult("");
    try {
      const res = await fetch(`/api/admin/companies/${companyId}/newcomers/${newcomerId}/code-interview`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        const coded = data.coded?.length || 0;
        const risk = data.summary?.flight_risk || "unknown";
        onResult(`Coded ${coded} passages. Flight risk: ${risk}`);
      } else {
        const err = await res.json();
        onResult(`Error: ${err.error}`);
      }
    } catch {
      onResult("Error: Failed to connect");
    }
    setCoding(false);
  }

  return (
    <button onClick={handleCode} disabled={coding} style={{
      padding: "6px 12px", borderRadius: 6, border: "none", cursor: "pointer",
      background: coding ? "#E2E0DA" : "#2D6A4F", color: "#FFFFFF",
      fontSize: 10, fontWeight: 600,
    }}>
      {coding ? "Coding..." : "Code Interview"}
    </button>
  );
}

function DocEditButton({ doc, companyId, onSave }: { doc: any; companyId: string; onSave: (content: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(doc.content || "");
  const [saving, setSaving] = useState(false);

  if (!editing) {
    return (
      <button onClick={() => setEditing(true)} style={{
        fontSize: 10, color: "#1A1A2E", background: "#EEEEF5", border: "none", cursor: "pointer", fontWeight: 600,
        padding: "3px 8px", borderRadius: 4,
      }}>
        Edit
      </button>
    );
  }

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}
      onClick={e => { if (e.target === e.currentTarget) setEditing(false); }}>
      <div style={{ background: "#FFF", borderRadius: 16, padding: 24, width: "100%", maxWidth: 700, maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Edit: {doc.title}</h3>
        <textarea value={content} onChange={e => setContent(e.target.value)}
          style={{
            flex: 1, minHeight: 300, padding: 14, borderRadius: 10, border: "1px solid #E2E0DA",
            fontSize: 13, lineHeight: 1.7, resize: "vertical", fontFamily: "inherit",
          }}
        />
        <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
          <button onClick={() => setEditing(false)} style={{
            padding: "8px 20px", borderRadius: 8, border: "1px solid #E2E0DA", background: "#FFF", color: "#6B6B6B", fontSize: 13, cursor: "pointer",
          }}>Cancel</button>
          <button disabled={saving} onClick={async () => {
            setSaving(true);
            const res = await fetch(`/api/admin/companies/${companyId}/documents`, {
              method: "PATCH", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ docId: doc.id, content }),
            });
            if (res.ok) { onSave(content); setEditing(false); }
            setSaving(false);
          }} style={{
            padding: "8px 20px", borderRadius: 8, border: "none", background: "#0A0A0A", color: "#FFF", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>{saving ? "Saving..." : "Save"}</button>
        </div>
      </div>
    </div>
  );
}

function DocPreview({ content, title }: { content: string; title: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(!open)} style={{
        fontSize: 10, color: "#2D6A4F", background: "none", border: "none", cursor: "pointer", fontWeight: 600, marginTop: 4,
      }}>
        {open ? "Hide preview" : "Preview"}
      </button>
      {open && (
        <div style={{
          marginTop: 8, padding: "16px 20px", background: "#FFFFFF", border: "1px solid #E2E0DA",
          borderRadius: 8, fontSize: 13, color: "#0A0A0A", lineHeight: 1.7, whiteSpace: "pre-wrap",
          maxHeight: 300, overflowY: "auto",
        }}>
          {content}
        </div>
      )}
    </>
  );
}
