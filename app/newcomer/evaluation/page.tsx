"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Old evaluation page — redirect to Activities where check-ins live now
export default function EvaluationRedirect() {
  const router = useRouter();
  useEffect(() => { router.push("/newcomer/activities"); }, [router]);
  return null;
}
