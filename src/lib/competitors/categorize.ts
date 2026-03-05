import type { CompetitorSummary } from '@/types';

export const GME_SLUG = 'gme';

export const COMPETITOR_SLUGS = new Set([
  'hanpass', 'gmoney', 'e9pay', 'cross-remit', 'coinshot',
  'debunk', 'jrf', 'moin', 'sbi-cosmoney', 'sentbe', 'utransfer',
]);

export const BENCHMARK_SLUGS = new Set([
  'kakaopay', 'naverpay', 'toss', 'wirebarley', 'wise', 'gln',
]);

export function categorize(competitors: CompetitorSummary[]) {
  let gme: CompetitorSummary | null = null;
  const direct: CompetitorSummary[] = [];
  const benchmarks: CompetitorSummary[] = [];

  for (const c of competitors) {
    if (c.slug === GME_SLUG) {
      gme = c;
    } else if (COMPETITOR_SLUGS.has(c.slug)) {
      direct.push(c);
    } else if (BENCHMARK_SLUGS.has(c.slug)) {
      benchmarks.push(c);
    } else {
      benchmarks.push(c);
    }
  }

  return { gme, direct, benchmarks };
}

function getSection(slug: string): 'gme' | 'direct' | 'benchmarks' {
  if (slug === GME_SLUG) return 'gme';
  if (COMPETITOR_SLUGS.has(slug)) return 'direct';
  return 'benchmarks';
}

export function categorizeItems<T extends { competitors?: { slug: string } }>(
  items: T[]
): { gme: T[]; direct: T[]; benchmarks: T[] } {
  const gme: T[] = [];
  const direct: T[] = [];
  const benchmarks: T[] = [];

  for (const item of items) {
    const slug = item.competitors?.slug;
    if (!slug) {
      benchmarks.push(item);
      continue;
    }
    const section = getSection(slug);
    if (section === 'gme') gme.push(item);
    else if (section === 'direct') direct.push(item);
    else benchmarks.push(item);
  }

  return { gme, direct, benchmarks };
}
