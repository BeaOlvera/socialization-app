"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const [status, setStatus] = useState<"loading" | "error" | "setting_password">("loading");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Validate token and check if user already has a password
    fetch(`/api/auth/invite/${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
          setStatus("error");
        } else if (data.hasPassword) {
          // Already set up — just log them in via token
          fetch("/api/auth/invite/" + token, { method: "POST" })
            .then(res => res.json())
            .then(d => {
              if (d.redirect) router.push(d.redirect);
              else { setError("Failed to sign in"); setStatus("error"); }
            });
        } else {
          setUserName(data.name);
          setStatus("setting_password");
        }
      })
      .catch(() => { setError("Invalid or expired invite link"); setStatus("error"); });
  }, [token, router]);

  async function handleSetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirmPassword) { setError("Passwords don't match"); return; }

    const res = await fetch(`/api/auth/invite/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (data.redirect) router.push(data.redirect);
    else setError(data.error || "Something went wrong");
  }

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", background: "#F5F4F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: 14, color: "#6B6B6B" }}>Validating your invite...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div style={{ minHeight: "100vh", background: "#F5F4F0", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E0DA", padding: "36px 32px", maxWidth: 400, textAlign: "center" }}>
          <p style={{ fontSize: 32, marginBottom: 16 }}>⚠</p>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0A0A0A", marginBottom: 8 }}>Invalid invite</h2>
          <p style={{ fontSize: 13, color: "#6B6B6B" }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F5F4F0", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 120 120" style={{display:"block"}}><polygon points="60,5 95,40 60,50 25,40" fill="#FFF"/><polygon points="25,40 60,50 60,115" fill="#CCC"/><polygon points="95,40 60,50 60,115" fill="#888"/></svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 19, color: "#0A0A0A" }}>onboard</span>
        </div>

        <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E0DA", padding: "36px 32px" }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0A0A0A", marginBottom: 6 }}>Welcome, {userName}!</h1>
          <p style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 28 }}>Set a password to access your socialization journey.</p>

          <form onSubmit={handleSetPassword} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 6 }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #E2E0DA", fontSize: 14, color: "#0A0A0A", outline: "none", background: "#FAFAF8", boxSizing: "border-box" }}
                placeholder="At least 6 characters" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", display: "block", marginBottom: 6 }}>Confirm password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #E2E0DA", fontSize: 14, color: "#0A0A0A", outline: "none", background: "#FAFAF8", boxSizing: "border-box" }}
                placeholder="Repeat your password" />
            </div>
            {error && (
              <div style={{ background: "#FBEAEC", borderRadius: 10, padding: "10px 14px" }}>
                <p style={{ fontSize: 12, color: "#9B2335" }}>{error}</p>
              </div>
            )}
            <button type="submit" style={{ width: "100%", padding: "12px", borderRadius: 12, border: "none", cursor: "pointer", background: "#0A0A0A", color: "#FFFFFF", fontSize: 14, fontWeight: 700 }}>
              Start my journey
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
