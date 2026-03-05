'use client';

import { useMemo, useState } from 'react';
import { useRankings } from '@/hooks/useRankings';
import { RankingTable } from '@/components/rankings/RankingTable';
import { ComparisonChart } from '@/components/rankings/ComparisonChart';
import { RefreshButton } from '@/components/shared/RefreshButton';
import { CompetitorLogo } from '@/components/shared/CompetitorLogo';
import { StarRating } from '@/components/shared/StarRating';
import { TableSkeleton } from '@/components/shared/PageSkeleton';
import { useT } from '@/lib/i18n';
import Link from 'next/link';
import type { RankingEntry, RankingSortBy } from '@/types';
import { GME_SLUG, COMPETITOR_SLUGS, BENCHMARK_SLUGS } from '@/lib/competitors/categorize';

function categorize(rankings: RankingEntry[]) {
  let gme: RankingEntry | null = null;
  const competitors: RankingEntry[] = [];
  const benchmarks: RankingEntry[] = [];

  for (const entry of rankings) {
    const slug = entry.competitor.slug;
    if (slug === GME_SLUG) {
      gme = entry;
    } else if (COMPETITOR_SLUGS.has(slug)) {
      competitors.push(entry);
    } else if (BENCHMARK_SLUGS.has(slug)) {
      benchmarks.push(entry);
    } else {
      benchmarks.push(entry);
    }
  }

  // Re-rank within each group
  competitors.forEach((e, i) => { e.rank = i + 1; });
  benchmarks.forEach((e, i) => { e.rank = i + 1; });

  return { gme, competitors, benchmarks };
}

function GmeCard({ entry, t }: { entry: RankingEntry; t: (key: string) => string }) {
  return (
    <Link href={`/company/${entry.competitor.slug}`}>
      <div className="rounded-lg border border-primary/40 bg-card p-6 hover:border-primary/70 transition-colors cursor-pointer">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <CompetitorLogo iconUrl={entry.competitor.icon_url} name={entry.competitor.name} size="lg" />
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-card-foreground">{entry.competitor.name}</h3>
            <span className="text-sm text-muted-foreground">{entry.competitor.type}</span>
          </div>

          <div className="flex flex-wrap gap-6 text-sm">
            {entry.combined_rating != null && (
              <div>
                <span className="text-xs text-muted-foreground block mb-0.5">{t('ranking.combined')}</span>
                <StarRating rating={entry.combined_rating} size={14} />
              </div>
            )}
            {entry.play_store_rating != null && (
              <div>
                <span className="text-xs text-muted-foreground block mb-0.5">{t('ranking.playStore')}</span>
                <span className="font-medium">{entry.play_store_rating.toFixed(1)}</span>
              </div>
            )}
            {entry.app_store_rating != null && (
              <div>
                <span className="text-xs text-muted-foreground block mb-0.5">{t('ranking.appStore')}</span>
                <span className="font-medium">{entry.app_store_rating.toFixed(1)}</span>
              </div>
            )}
            <div>
              <span className="text-xs text-muted-foreground block mb-0.5">{t('ranking.downloads')}</span>
              <span className="font-medium">{entry.play_store_downloads ?? '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function RankingsPage() {
  const [sortBy, setSortBy] = useState<RankingSortBy>('combined_rating');
  const { rankings, isLoading, mutate } = useRankings(sortBy);
  const { t } = useT();

  const { gme, competitors, benchmarks } = useMemo(
    () => categorize(rankings),
    [rankings]
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('page.rankings')}</h1>
        <RefreshButton onRefresh={() => mutate()} />
      </div>

      {isLoading ? (
        <TableSkeleton rows={10} />
      ) : (
        <>
          {/* Section 1: GME Remittance — pinned */}
          {gme && (
            <section>
              <GmeCard entry={gme} t={t} />
            </section>
          )}

          {/* Section 2: Remittance Competitors */}
          {competitors.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">{t('rankings.remittanceCompetitors')}</h2>
              <RankingTable rankings={competitors} sortBy={sortBy} onSortChange={setSortBy} />
              <ComparisonChart rankings={competitors} title={t('rankings.remittanceCompetitors')} />
            </section>
          )}

          {/* Section 3: Other Competitors & Benchmarks */}
          {benchmarks.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">{t('rankings.benchmarks')}</h2>
              <RankingTable rankings={benchmarks} sortBy={sortBy} onSortChange={setSortBy} />
              <ComparisonChart rankings={benchmarks} title={t('rankings.benchmarks')} />
            </section>
          )}
        </>
      )}
    </div>
  );
}
