"use client";
import { NavBar, PageShell } from "@/components/ui";
import { PreArrivalReport } from "@/components/PreArrivalReport";
import { useEffect, useState } from "react";

export default function NewcomerPreArrivalReport() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/newcomer/pre-arrival-summary")
      .then(r => r.ok ? r.json() : { available: false })
      .then(setSummary)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PageShell nav={<NavBar role="newcomer" active="Activities" />}>
        <div style={{ textAlign: "center", padding: 60, color: "#6B6B6B" }}>Loading...</div>
      </PageShell>
    );
  }

  return (
    <PageShell nav={<NavBar role="newcomer" active="Activities" />}>
      <PreArrivalReport summary={summary} showFlightRisk={false} />
    </PageShell>
  );
}
