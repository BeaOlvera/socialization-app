"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const roleRedirects: Record<string, string> = {
  admin: "/admin",
  newcomer: "/newcomer",
  manager: "/manager",
  hr_admin: "/hr",
};

export default function ConsentPage() {
  const router = useRouter();
  const [checks, setChecks] = useState({ data: false, research: false });
  const [submitting, setSubmitting] = useState(false);

  async function handleAccept() {
    setSubmitting(true);
    const res = await fetch("/api/auth/consent", { method: "POST" });
    if (res.ok) {
      // Get role from session to redirect
      const session = await fetch("/api/auth/me").then(r => r.ok ? r.json() : null);
      const role = session?.role || "newcomer";
      router.push(roleRedirects[role] || "/");
    }
    setSubmitting(false);
  }

  const allChecked = checks.data && checks.research;

  return (
    <div style={{ minHeight: "100vh", background: "#F5F4F0", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <div style={{ width: "100%", maxWidth: 520 }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "#1A1A2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#FFFFFF", fontWeight: 800, fontSize: 13 }}>ob</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 19, color: "#0A0A0A", letterSpacing: "-0.5px" }}>onboard</span>
        </div>

        {/* Consent card */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E0DA", padding: "36px 32px" }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0A0A0A", marginBottom: 6 }}>Before we start</h1>
          <p style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 28, lineHeight: 1.6 }}>
            Please review and accept the following to use the platform.
          </p>

          {/* Data Protection */}
          <div style={{ background: "#F5F4F0", borderRadius: 12, padding: "16px 20px", marginBottom: 12 }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
              <input type="checkbox" checked={checks.data}
                onChange={e => setChecks(p => ({ ...p, data: e.target.checked }))}
                style={{ width: 18, height: 18, marginTop: 3, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#0A0A0A", marginBottom: 6 }}>Data Protection</p>
                <p style={{ fontSize: 12, color: "#6B6B6B", lineHeight: 1.7 }}>
                  I understand that my data will be stored securely and processed in accordance with GDPR.
                  This includes any responses I provide through surveys, interviews, check-ins, and notes.
                  I can request access to, correction of, or deletion of my personal data at any time
                  by contacting the platform administrator.
                </p>
              </div>
            </label>
          </div>

          {/* Research */}
          <div style={{ background: "#EEEEF5", borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
              <input type="checkbox" checked={checks.research}
                onChange={e => setChecks(p => ({ ...p, research: e.target.checked }))}
                style={{ width: 18, height: 18, marginTop: 3, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E", marginBottom: 6 }}>Research Participation</p>
                <p style={{ fontSize: 12, color: "#6B6B6B", lineHeight: 1.7 }}>
                  I understand that anonymized data from this platform may be used for academic research
                  on newcomer socialization and organizational psychology. All identifying information
                  (name, company, specific role) will be removed before any research use. No individual
                  will be identifiable in any published research. My participation is voluntary and I may
                  withdraw at any time without affecting my onboarding experience or employment.
                </p>
              </div>
            </label>
          </div>

          <button
            onClick={handleAccept}
            disabled={!allChecked || submitting}
            style={{
              width: "100%", padding: "12px", borderRadius: 12, border: "none",
              cursor: allChecked && !submitting ? "pointer" : "not-allowed",
              background: allChecked && !submitting ? "#0A0A0A" : "#E2E0DA",
              color: allChecked && !submitting ? "#FFFFFF" : "#AEABA3",
              fontSize: 14, fontWeight: 700, transition: "all 0.15s",
            }}
          >
            {submitting ? "Recording..." : "I agree — enter platform"}
          </button>
        </div>

        <p style={{ fontSize: 11, color: "#AEABA3", textAlign: "center", marginTop: 20, lineHeight: 1.6 }}>
          Your consent is recorded with a timestamp for compliance purposes.<br />
          Contact the platform administrator to withdraw consent at any time.
        </p>
      </div>
    </div>
  );
}
