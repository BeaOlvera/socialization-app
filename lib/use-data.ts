"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "./api";

/**
 * Generic data fetching hook for client components.
 * Falls back to provided default data if API fails (useful during dev without Supabase).
 */
export function useData<T>(path: string, fallback: T): { data: T; loading: boolean; error: string | null; refetch: () => void } {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    setError(null);
    apiFetch<T>(path)
      .then(d => { setData(d); setLoading(false); })
      .catch(e => {
        // In dev without Supabase, fall back to mock data silently
        console.warn(`API ${path} failed, using fallback:`, e.message);
        setLoading(false);
      });
  }

  useEffect(() => { load(); }, [path]);

  return { data, loading, error, refetch: load };
}
