"use client";
import { useState, useEffect } from "react";

const ALL_PAGES = ["home","activities","timeline","buckets","progress","org","people","docs","evaluation"];

let cachedConfig: { visible_pages: string[]; has_buddies: boolean } | null = null;

export function useCompanyConfig() {
  const [config, setConfig] = useState(cachedConfig || { visible_pages: ALL_PAGES, has_buddies: true });
  const [loaded, setLoaded] = useState(!!cachedConfig);

  useEffect(() => {
    if (cachedConfig) return;
    fetch("/api/newcomer/config")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          const cfg = {
            visible_pages: data.visible_pages || ALL_PAGES,
            has_buddies: data.has_buddies !== false,
          };
          cachedConfig = cfg;
          setConfig(cfg);
        }
      })
      .finally(() => setLoaded(true));
  }, []);

  return { ...config, loaded };
}
