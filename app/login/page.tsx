"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const roleRedirects: Record<string, string> = {
  admin: "/admin",
  newcomer: "/newcomer",
  manager: "/manager",
  hr_admin: "/hr",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      const { user } = await res.json();

      // Admin skips consent check
      if (user.role === "admin") {
        router.push("/admin");
        return;
      }

      // Check if user has accepted platform consent
      const consentRes = await fetch("/api/auth/consent");
      const { consented } = await consentRes.json();

      if (consented) {
        router.push(roleRedirects[user.role] || "/");
      } else {
        router.push("/consent");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F5F4F0", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "#1A1A2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 120 120" style={{display:"block"}}><polygon points="60,5 95,40 60,50 25,40" fill="#FFF"/><polygon points="25,40 60,50 60,115" fill="#CCC"/><polygon points="95,40 60,50 60,115" fill="#888"/></svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 19, color: "#0A0A0A", letterSpacing: "-0.5px" }}>FACET</span>
        </div>

        {/* Login card */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E0DA", padding: "36px 32px" }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0A0A0A", marginBottom: 6 }}>Sign in</h1>
          <p style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 28 }}>Enter your credentials to continue.</p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 6 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10,
                  border: "1px solid #E2E0DA", fontSize: 14, color: "#0A0A0A",
                  outline: "none", background: "#FAFAF8", boxSizing: "border-box",
                }}
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 6 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10,
                  border: "1px solid #E2E0DA", fontSize: 14, color: "#0A0A0A",
                  outline: "none", background: "#FAFAF8", boxSizing: "border-box",
                }}
                placeholder="Your password"
              />
            </div>

            {error && (
              <div style={{ background: "#FBEAEC", borderRadius: 10, padding: "10px 14px" }}>
                <p style={{ fontSize: 12, color: "#9B2335" }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "12px", borderRadius: 12, border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                background: loading ? "#E2E0DA" : "#0A0A0A",
                color: loading ? "#AEABA3" : "#FFFFFF",
                fontSize: 14, fontWeight: 700,
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p style={{ fontSize: 11, color: "#AEABA3", textAlign: "center", marginTop: 20 }}>
          Newcomers: use the invite link sent to your email.
        </p>
      </div>
    </div>
  );
}
