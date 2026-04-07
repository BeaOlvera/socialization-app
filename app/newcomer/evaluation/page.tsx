"use client";
import { useState } from "react";
import { NavBar, PageShell, Card, SectionLabel } from "@/components/ui";
import { EVAL_QUESTIONS } from "@/lib/framework";
import { InterviewChat } from "@/components/InterviewChat";

const bucketKeys = ["fit", "ace", "tie"] as const;
const bucketLabels = { fit: "FIT · Role Clarity", ace: "ACE · Task Mastery", tie: "TIE · Social Acceptance" };

const labels = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];

export default function EvaluationPage() {
  const [scores, setScores] = useState<Record<string, number[]>>({
    fit: [0, 0, 0, 0, 0],
    ace: [0, 0, 0, 0, 0],
    tie: [0, 0, 0, 0, 0],
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeBucket, setActiveBucket] = useState<"fit" | "ace" | "tie">("fit");
  const [checkinId, setCheckinId] = useState<string | null>(null);
  const [interviewDone, setInterviewDone] = useState(false);

  const setScore = (bucket: string, idx: number, val: number) => {
    setScores(prev => ({
      ...prev,
      [bucket]: prev[bucket].map((s, i) => i === idx ? val : s),
    }));
  };

  const bucketComplete = (b: string) => scores[b].every(s => s > 0);
  const allLikertComplete = bucketKeys.every(bucketComplete);
  const allComplete = allLikertComplete;

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
          {EVAL_QUESTIONS[activeBucket].map((q, i) => (
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

      {/* Qualitative AI interview — appears after Likert scores are submitted */}
      {checkinId && (
        <div>
          <SectionLabel>Part 2 — Qualitative Interview</SectionLabel>
          <InterviewChat
            checkinId={checkinId}
            onComplete={() => setInterviewDone(true)}
          />
        </div>
      )}

      {!checkinId && allLikertComplete && (
        <Card style={{ background: "#EEEEF5", border: "1px solid #1A1A2E" }}>
          <p className="text-xs font-semibold text-[#1A1A2E] mb-1">Next: Qualitative interview</p>
          <p className="text-sm text-[#1A1A2E]">
            After submitting your ratings, an AI-guided interview will explore your experience in more depth.
          </p>
        </Card>
      )}

      <button
        onClick={async () => {
          if (!allComplete) return;
          if (checkinId) {
            // Likert already submitted — just mark done
            setSubmitted(true);
            return;
          }
          try {
            const res = await fetch("/api/newcomer/checkin", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                scores_fit: scores.fit,
                scores_ace: scores.ace,
                scores_tie: scores.tie,
                month_number: new Date().getMonth() + 1,
              }),
            });
            if (res.ok) {
              const data = await res.json();
              setCheckinId(data.id); // Triggers interview to appear
              return; // Don't mark submitted yet — interview first
            }
          } catch { /* API may not be available in dev */ }
          // Fallback: if API unavailable, just show submitted
          setSubmitted(true);
        }}
        className={`w-full py-4 rounded-xl font-semibold text-sm transition-colors ${
          allComplete
            ? "bg-[#0A0A0A] text-white hover:bg-[#1A1A2E]"
            : "bg-[#E2E0DA] text-[#AEABA3] cursor-not-allowed"
        }`}>
        {checkinId ? (interviewDone ? "Complete check-in" : "Interview in progress...") : "Submit ratings & start interview"}
      </button>
    </PageShell>
  );
}
