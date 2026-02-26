'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { extractDominantColor, hashColor, colorCache } from '@/lib/colors';

interface CompetitorInput {
  id: string;
  name: string;
  icon_url?: string | null;
}

export function useCompetitorColors(competitors: CompetitorInput[]) {
  const [colorMap, setColorMap] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  // Derive a stable string key from the competitor list so the effect
  // only re-runs when the actual IDs change, not on every render.
  const key = useMemo(
    () => competitors.map((c) => c.id).sort().join(','),
    [competitors]
  );

  // Keep a ref to the latest competitors array so the async function
  // always reads the current data without needing it in the dep array.
  const competitorsRef = useRef(competitors);
  competitorsRef.current = competitors;

  useEffect(() => {
    if (competitorsRef.current.length === 0) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function resolve() {
      const comps = competitorsRef.current;

      // Load from localStorage cache
      let stored: Record<string, string> = {};
      try {
        const raw = localStorage.getItem('competitor-colors');
        if (raw) stored = JSON.parse(raw);
      } catch {}

      const result = new Map<string, string>();
      const toExtract: CompetitorInput[] = [];

      for (const comp of comps) {
        // Check memory cache first
        if (colorCache.has(comp.id)) {
          result.set(comp.id, colorCache.get(comp.id)!);
        } else if (stored[comp.id]) {
          result.set(comp.id, stored[comp.id]);
          colorCache.set(comp.id, stored[comp.id]);
        } else if (comp.icon_url) {
          toExtract.push(comp);
        } else {
          const fallback = hashColor(comp.name);
          result.set(comp.id, fallback);
          colorCache.set(comp.id, fallback);
        }
      }

      // Extract colors for those with icon URLs
      await Promise.all(
        toExtract.map(async (comp) => {
          const color = await extractDominantColor(comp.icon_url!);
          const final = color ?? hashColor(comp.name);
          result.set(comp.id, final);
          colorCache.set(comp.id, final);
          stored[comp.id] = final;
        })
      );

      if (cancelled) return;

      // Persist to localStorage
      try {
        localStorage.setItem('competitor-colors', JSON.stringify(stored));
      } catch {}

      setColorMap(result);
      setIsLoading(false);
    }

    resolve();
    return () => { cancelled = true; };
  }, [key]);

  return { colorMap, isLoading };
}
