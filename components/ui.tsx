"use client";
import Link from "next/link";
import React, { ReactNode, useState, useEffect } from "react";
import { useCompanyConfig } from "@/lib/use-config";

export function FacetLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{ display: "block" }}>
      <polygon points="60,5 95,40 60,50 25,40" fill="#FFFFFF"/>
      <polygon points="25,40 60,50 60,115" fill="#CCCCCC"/>
      <polygon points="95,40 60,50 60,115" fill="#888888"/>
    </svg>
  );
}

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
  const { visible_pages } = useCompanyConfig();

  // Map page keys to nav links
  const allNewcomerLinks = [
    { href: "/newcomer", label: "Home", key: "home" },
    { href: "/newcomer/docs", label: "Documents", key: "docs" },
    { href: "/newcomer/activities", label: "Activities", key: "activities" },
    { href: "/newcomer/timeline", label: "Timeline", key: "timeline" },
    { href: "/newcomer/progress", label: "Progress", key: "progress" },
    { href: "/newcomer/buckets", label: "My Journey", key: "buckets" },
    { href: "/newcomer/org", label: "Org Chart", key: "org" },
    { href: "/newcomer/people", label: "My People", key: "people" },
  ];

  const links = {
    admin: [
      { href: "/admin", label: "Companies" },
    ],
    newcomer: allNewcomerLinks.filter(l => visible_pages.includes(l.key)),
    manager: [
      { href: "/manager", label: "My Team" },
    ],
    hr: [
      { href: "/hr", label: "Overview" },
      { href: "/hr/newcomers", label: "All Newcomers" },
    ],
  };

  const roleLabel = { admin: "Admin", newcomer: "Newcomer", manager: "Manager", hr: "HR Admin" };
  const roleColors = { admin: "#0A0A0A", newcomer: "#1A1A2E", manager: "#2D6A4F", hr: "#9B2335" };
  const homeHref = { admin: "/", newcomer: "/newcomer", manager: "/manager", hr: "/hr" }[role];

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "#FFFFFF", borderBottom: "1px solid #E2E0DA" }}>
      <div className="nav-inner" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo + back */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href={homeHref} style={{
            display: "flex", alignItems: "center", gap: 6, textDecoration: "none",
            padding: "5px 10px 5px 8px", borderRadius: 8, border: "1px solid #E2E0DA",
            background: "#F5F4F0", color: "#6B6B6B", fontSize: 12, fontWeight: 500,
          }}>
            <span style={{ fontSize: 14 }}>←</span> Home
          </Link>
          <div style={{ width: 1, height: 16, background: "#E2E0DA" }} />
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FacetLogo size={20} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#0A0A0A", letterSpacing: "-0.3px" }}>FACET</span>
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

export function PreArrivalBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    // Only check on newcomer pages
    if (!window.location.pathname.startsWith("/newcomer")) return;
    // Don't show on pre-arrival page itself
    if (window.location.pathname.includes("/pre-arrival")) return;
    fetch("/api/newcomer/tasks")
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (!Array.isArray(data)) return;
        const interview = data.find((t: any) => t.activity?.toLowerCase().includes("pre-arrival interview") && !t.done);
        if (interview) setShow(true);
      });
  }, []);

  if (!show) return null;
  return (
    <div style={{ background: "#EEEEF5", borderBottom: "1px solid #1A1A2E33", padding: "8px 32px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
      <span style={{ fontSize: 13, color: "#1A1A2E", fontWeight: 600 }}>Your pre-arrival interview is waiting</span>
      <a href="/newcomer/pre-arrival" style={{
        fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 6,
        background: "#1A1A2E", color: "#FFF", textDecoration: "none",
      }}>Start now</a>
    </div>
  );
}

export function PageShell({ children, nav }: { children: ReactNode; nav: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#F5F4F0" }}>
      {nav}
      <PreArrivalBanner />
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
