"use client";
import { useState } from "react";
import { NavBar, PageShell, Card, SectionLabel } from "@/components/ui";
import { evalQuestions } from "@/lib/mock";

const bucketKeys = ["job", "org", "people"] as const;
const bucketLabels = { job: "My Job", org: "My Organization", people: "My People" };

const labels = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];

export default function EvaluationPage() {
  const [scores, setScores] = useState<Record<string, number[]>>({
    job: [0, 0, 0, 0, 0],
    org: [0, 0, 0, 0, 0],
    people: [0, 0, 0, 0, 0],
  });
  const [qualitative, setQualitative] = useState({ surprise: "", unclear: "" });
  const [submitted, setSubmitted] = useState(false);
  const [activeBucket, setActiveBucket] = useState<"job" | "org" | "people">("job");

  const setScore = (bucket: string, idx: number, val: number) => {
    setScores(prev => ({
      ...prev,
      [bucket]: prev[bucket].map((s, i) => i === idx ? val : s),
    }));
  };

  const bucketComplete = (b: string) => scores[b].every(s => s > 0);
  const allComplete = bucketKeys.every(bucketComplete) && qualitative.surprise && qualitative.unclear;

  if (submitted) {
    return (
      <PageShell nav={<NavBar role="newcomer" active="Check-in" />}>
        <Card className="text-center py-10">
          <div className="text-4xl mb-4">✓</div>
          <h3 className="text-lg font-bold mb-2">Check-in complete</h3>
          <p className="text-sm text-[#6B6B6B] leading-relaxed max-w-xs mx-auto">
            Your responses have been recorded. Your manager will be notified of any areas that need attention.
          </p>
          <p className="text-xs text-[#AEABA3] mt-6">Next check-in: April 21, 2026</p>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell nav={<NavBar role="newcomer" active="Check-in" />}>
      <div className="space-y-1">
        <h2 className="text-xl font-bold">Monthly Check-in</h2>
        <p className="text-sm text-[#6B6B6B]">Takes about 5 minutes. Honest answers help you get better support.</p>
      </div>

      {/* Bucket tabs */}
      <div className="flex gap-2">
        {bucketKeys.map(b => (
          <button key={b} onClick={() => setActiveBucket(b)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeBucket === b ? "bg-[#0A0A0A] text-white" : "bg-white text-[#6B6B6B] border border-[#E2E0DA]"
            }`}>
            {bucketLabels[b]}
            {bucketComplete(b) && <span className="ml-1 text-[#2D6A4F]">✓</span>}
          </button>
        ))}
      </div>

      {/* Questions */}
      <Card>
        <SectionLabel>{bucketLabels[activeBucket]}</SectionLabel>
        <div className="space-y-5">
          {evalQuestions[activeBucket].map((q, i) => (
            <div key={i}>
              <p className="text-sm font-medium text-[#0A0A0A] mb-2.5 leading-relaxed">{q}</p>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map(val => (
                  <button key={val} onClick={() => setScore(activeBucket, i, val)}
                    className={`flex-1 h-9 rounded-lg text-sm font-semibold transition-colors ${
                      scores[activeBucket][i] === val
                        ? "bg-[#0A0A0A] text-white"
                        : "bg-[#F5F4F0] text-[#6B6B6B] hover:bg-[#E2E0DA]"
                    }`}>
                    {val}
                  </button>
                ))}
              </div>
              {scores[activeBucket][i] > 0 && (
                <p className="text-xs text-[#AEABA3] mt-1">{labels[scores[activeBucket][i] - 1]}</p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Open questions */}
      <Card>
        <SectionLabel>In your own words</SectionLabel>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#0A0A0A] block mb-2">
              What has surprised you most so far?
            </label>
            <textarea
              value={qualitative.surprise}
              onChange={e => setQualitative(p => ({ ...p, surprise: e.target.value }))}
              className="w-full border border-[#E2E0DA] rounded-lg p-3 text-sm text-[#0A0A0A] resize-none focus:outline-none focus:border-[#0A0A0A] transition-colors bg-white"
              rows={3} placeholder="Share anything that surprised you..."
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#0A0A0A] block mb-2">
              What feels most unclear right now?
            </label>
            <textarea
              value={qualitative.unclear}
              onChange={e => setQualitative(p => ({ ...p, unclear: e.target.value }))}
              className="w-full border border-[#E2E0DA] rounded-lg p-3 text-sm text-[#0A0A0A] resize-none focus:outline-none focus:border-[#0A0A0A] transition-colors bg-white"
              rows={3} placeholder="Be honest — this helps your manager support you better..."
            />
          </div>
        </div>
      </Card>

      <button
        onClick={() => allComplete && setSubmitted(true)}
        className={`w-full py-4 rounded-xl font-semibold text-sm transition-colors ${
          allComplete
            ? "bg-[#0A0A0A] text-white hover:bg-[#1A1A2E]"
            : "bg-[#E2E0DA] text-[#AEABA3] cursor-not-allowed"
        }`}>
        Submit check-in
      </button>
    </PageShell>
  );
}
