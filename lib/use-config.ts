"use client";
import { useState, useEffect } from "react";

const ALL_PAGES = ["home","activities","timeline","buckets","progress","org","people","docs"];

let cachedConfig: { visible_pages: string[]; has_buddies: boolean } | null = null;

export function useCompanyConfig() {
  const [config, setConfig] = useState(cachedConfig || { visible_pages: ALL_PAGES, has_buddies: true });
  const [loaded, setLoaded] = useState(!!cachedConfig);

  useEffect(() => {
    if (cachedConfig) return;
    Promise.all([
      fetch("/api/newcomer/config").then(r => r.ok ? r.json() : null),
      fetch("/api/newcomer/documents").then(r => r.ok ? r.json() : []),
    ]).then(([data, docs]) => {
      let pages = data?.visible_pages || ALL_PAGES;
      // Hide docs page if no documents have content
      if (!Array.isArray(docs) || docs.length === 0) {
        pages = pages.filter((p: string) => p !== "docs");
      }
      const cfg = {
        visible_pages: pages,
        has_buddies: data?.has_buddies !== false,
      };
      cachedConfig = cfg;
      setConfig(cfg);
    }).finally(() => setLoaded(true));
  }, []);

  return { ...config, loaded };
}
