"use client";
import Link from "next/link";
import { useState } from "react";

const roles = [
  {
    label: "Newcomer",
    sub: "Sofia Martínez · Day 18",
    accent: "#1A1A2E",
    accentBg: "#EEEEF5",
    icon: "NW",
    children: [
      { href: "/welcome", label: "Welcome flow", sub: "Before Day 1 — onboarding steps" },
      { href: "/newcomer/docs", label: "Pre-arrival documents", sub: "Letter, role, culture, first week" },
      { href: "/newcomer", label: "Dashboard", sub: "Day 18 · Arrival phase" },
      { href: "/newcomer/timeline", label: "12-month timeline", sub: "All phases, all buckets" },
      { href: "/newcomer/progress", label: "Progress charts", sub: "Scores over time · divergence" },
      { href: "/newcomer/buckets", label: "My Journey", sub: "Three-bucket progress" },
      { href: "/newcomer/org", label: "Org Chart", sub: "Company structure & your connections" },
      { href: "/newcomer/people", label: "My People", sub: "Relationships & network" },
      { href: "/newcomer/evaluation", label: "Monthly check-in", sub: "Self-evaluation form" },
      { href: "/newcomer/complete", label: "Journey complete", sub: "12-month completion screen" },
      { href: "/notifications", label: "Notifications", sub: "Alerts, reminders, updates" },
    ],
  },
  {
    label: "Manager",
    sub: "Claire Bennett · VP Marketing",
    accent: "#2D6A4F",
    accentBg: "#EAF4EF",
    icon: "MG",
    children: [
      { href: "/manager", label: "Team overview", sub: "3 active newcomers" },
      { href: "/manager/newcomer/sofia", label: "Sofia Martínez", sub: "Individual view · divergence alert" },
      { href: "/manager/checkin/sofia", label: "Manager check-in", sub: "Rate Sofia's three buckets" },
      { href: "/notifications", label: "Notifications", sub: "Alerts & reminders" },
    ],
  },
  {
    label: "HR Admin",
    sub: "Meridian Group · 14 newcomers",
    accent: "#9B2335",
    accentBg: "#FBEAEC",
    icon: "HR",
    children: [
      { href: "/hr", label: "Organization overview", sub: "Health, scores, flight risk" },
      { href: "/hr/newcomers", label: "All newcomers", sub: "Sorted by adjustment risk" },
      { href: "/notifications", label: "Notifications", sub: "Alerts & flight risk" },
    ],
  },
  {
    label: "Company Setup",
    sub: "Consultant view",
    accent: "#6B6B6B",
    accentBg: "#F5F4F0",
    icon: "CS",
    children: [
      { href: "/setup", label: "Onboarding setup", sub: "Company, culture, role, people, launch" },
    ],
  },
];

export default function Home() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "#F5F4F0", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px" }}>
      <div style={{ width: "100%", maxWidth: 500 }}>

        {/* Logo block */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E0DA", borderRadius: 20, padding: "36px 40px 32px", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "#1A1A2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#FFFFFF", fontWeight: 800, fontSize: 13 }}>ob</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: 19, color: "#0A0A0A", letterSpacing: "-0.5px" }}>onboard</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.5px", lineHeight: 1.25, marginBottom: 8 }}>
            Accelerating newcomer<br />socialization
          </h1>
          <p style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.7 }}>
            Three parallel tracks. Twelve months. Built on Allen&apos;s socialization framework.
          </p>
        </div>

        {/* Role accordion */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E0DA", borderRadius: 20, padding: "20px 20px 16px", marginBottom: 12 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#AEABA3", textTransform: "uppercase", marginBottom: 14 }}>
            Demo — select a role
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {roles.map((role, ri) => {
              const isOpen = open === role.label;
              return (
                <div key={role.label}>
                  {/* Role row — clickable header */}
                  <button
                    onClick={() => setOpen(isOpen ? null : role.label)}
                    style={{
                      width: "100%", textAlign: "left", cursor: "pointer", border: "none", fontFamily: "inherit",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 14px", borderRadius: 12,
                      background: isOpen ? "#0A0A0A" : "#F5F4F0",
                      transition: "background 0.15s",
                    }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: isOpen ? "#1A1A1A" : role.accentBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 9, fontWeight: 800, color: isOpen ? role.accentBg : role.accent }}>{role.icon}</span>
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: isOpen ? "#FFFFFF" : "#0A0A0A" }}>{role.label}</p>
                        <p style={{ fontSize: 11, color: isOpen ? "#888" : "#AEABA3" }}>{role.sub}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: 13, color: isOpen ? "#888" : "#AEABA3", transition: "transform 0.2s", display: "inline-block", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
                  </button>

                  {/* Subfolders */}
                  {isOpen && (
                    <div style={{ paddingLeft: 14, paddingTop: 6, paddingBottom: 4, display: "flex", flexDirection: "column", gap: 3 }}>
                      {role.children.map(child => (
                        <Link key={child.href} href={child.href} style={{ textDecoration: "none" }}>
                          <div style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "9px 14px", borderRadius: 10,
                            background: "#F5F4F0", border: "1px solid #ECEAE4",
                            cursor: "pointer",
                          }}>
                            <div>
                              <p style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", marginBottom: 1 }}>{child.label}</p>
                              <p style={{ fontSize: 11, color: "#AEABA3" }}>{child.sub}</p>
                            </div>
                            <span style={{ color: "#AEABA3", fontSize: 14, marginLeft: 8 }}>›</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {ri < roles.length - 1 && !isOpen && (
                    <div style={{ height: 1, background: "#F5F4F0", margin: "2px 0" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <p style={{ fontSize: 11, color: "#AEABA3", textAlign: "center", marginTop: 12 }}>
          Prototype · v0.1 · Allen Socialization Framework
        </p>
      </div>
    </div>
  );
}
