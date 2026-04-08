"use client";
import Link from "next/link";
import React, { ReactNode } from "react";

export function Card({ children, className = "", style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`${className}`} style={{
      background: "#FFFFFF",
      borderRadius: 16,
      border: "1px solid #E2E0DA",
      padding: "20px 22px",
      ...style
    }}>
      {children}
    </div>
  );
}

export function ScoreRing({ score, size = 72 }: { score: number; size?: number }) {
  const r = (size / 2) - 6;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 70 ? "#2D6A4F" : score >= 50 ? "#B7791F" : "#9B2335";
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E2E0DA" strokeWidth={5} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={5}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text
        x={size/2} y={size/2 + 5}
        textAnchor="middle" fill="#0A0A0A"
        fontSize={size > 60 ? 15 : 11} fontWeight={600}
        style={{ transform: `rotate(90deg) translate(0px, -${size}px)`, transformOrigin: `${size/2}px ${size/2}px` }}
      >
        {score}%
      </text>
    </svg>
  );
}

export function StatusDot({ status }: { status: "green" | "yellow" | "red" }) {
  const colors = { green: "#2D6A4F", yellow: "#B7791F", red: "#9B2335" };
  const bgs = { green: "#EAF4EF", yellow: "#FEF3E2", red: "#FBEAEC" };
  const labels = { green: "On track", yellow: "Needs attention", red: "At risk" };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
      style={{ background: bgs[status], color: colors[status] }}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: colors[status] }} />
      {labels[status]}
    </span>
  );
}

export function Avatar({ initials, size = 36 }: { initials: string; size?: number }) {
  return (
    <div className="rounded-full bg-[#EEEEF5] flex items-center justify-center flex-shrink-0 font-semibold text-[#1A1A2E]"
      style={{ width: size, height: size, fontSize: size * 0.33 }}>
      {initials}
    </div>
  );
}

export function NavBar({ role, active }: { role: "newcomer" | "manager" | "hr" | "admin"; active: string }) {
  const links = {
    admin: [
      { href: "/admin", label: "Companies" },
    ],
    newcomer: [
      { href: "/newcomer", label: "Home" },
      { href: "/newcomer/docs", label: "Documents" },
      { href: "/newcomer/activities", label: "Activities" },
      { href: "/newcomer/timeline", label: "Timeline" },
      { href: "/newcomer/progress", label: "Progress" },
      { href: "/newcomer/buckets", label: "My Journey" },
      { href: "/newcomer/org", label: "Org Chart" },
      { href: "/newcomer/people", label: "My People" },
      { href: "/newcomer/evaluation", label: "Check-in" },
    ],
    manager: [
      { href: "/manager", label: "My Team" },
      { href: "/manager/newcomer/sofia", label: "Newcomer Detail" },
    ],
    hr: [
      { href: "/hr", label: "Overview" },
      { href: "/hr/newcomers", label: "All Newcomers" },
    ],
  };

  const roleLabel = { admin: "Admin", newcomer: "Newcomer", manager: "Manager", hr: "HR Admin" };
  const roleColors = { admin: "#0A0A0A", newcomer: "#1A1A2E", manager: "#2D6A4F", hr: "#9B2335" };

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "#FFFFFF", borderBottom: "1px solid #E2E0DA" }}>
      <div className="nav-inner" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo + back */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/" style={{
            display: "flex", alignItems: "center", gap: 6, textDecoration: "none",
            padding: "5px 10px 5px 8px", borderRadius: 8, border: "1px solid #E2E0DA",
            background: "#F5F4F0", color: "#6B6B6B", fontSize: 12, fontWeight: 500,
          }}>
            <span style={{ fontSize: 14 }}>←</span> Home
          </Link>
          <div style={{ width: 1, height: 16, background: "#E2E0DA" }} />
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "#1A1A2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#FFF", fontWeight: 800, fontSize: 11 }}>ob</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#0A0A0A", letterSpacing: "-0.3px" }}>onboard</span>
          <div style={{ width: 1, height: 16, background: "#E2E0DA" }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#FFFFFF", background: roleColors[role], padding: "2px 10px", borderRadius: 20 }}>
            {roleLabel[role]}
          </span>
        </div>
        {/* Nav links */}
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {links[role].map(l => (
            <Link key={l.href} href={l.href} style={{
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              textDecoration: "none",
              background: active === l.label ? "#0A0A0A" : "transparent",
              color: active === l.label ? "#FFFFFF" : "#6B6B6B",
              transition: "all 0.15s"
            }}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export function PageShell({ children, nav }: { children: ReactNode; nav: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#F5F4F0" }}>
      {nav}
      <main className="page-main" style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
        {children}
      </main>
    </div>
  );
}

export function TwoCol({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{left}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{right}</div>
    </div>
  );
}

export function ThreeCol({ children }: { children: ReactNode }) {
  return (
    <div className="three-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-widest text-[#AEABA3] uppercase mb-3">
      {children}
    </p>
  );
}

export function BucketTag({ bucket }: { bucket: string }) {
  const map: Record<string, string> = {
    fit: "FIT", ace: "ACE", tie: "TIE"
  };
  const colors: Record<string, string> = {
    fit: "#EEEEF5", ace: "#EAF4EF", tie: "#FBEAEC"
  };
  const textColors: Record<string, string> = {
    fit: "#1A1A2E", ace: "#2D6A4F", tie: "#9B2335"
  };
  return (
    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
      style={{ background: colors[bucket], color: textColors[bucket] }}>
      {map[bucket]}
    </span>
  );
}
