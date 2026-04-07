'use client';

import { useMemo } from 'react';
import { useOverview } from '@/hooks/useOverview';
import { CompetitorCard } from '@/components/overview/CompetitorCard';
import { QuickStatsBar } from '@/components/overview/QuickStatsBar';
import { WeeklySummary } from '@/components/overview/WeeklySummary';
import { RefreshButton } from '@/components/shared/RefreshButton';
import { PageSkeleton } from '@/components/shared/PageSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { useT } from '@/lib/i18n';
import { GME_SLUG, COMPETITOR_SLUGS, BENCHMARK_SLUGS } from '@/lib/competitors/categorize';
import type { OverviewCompetitor } from '@/types';

function categorizeOverview(competitors: OverviewCompetitor[]) {
  let gme: OverviewCompetitor | null = null;
  const direct: OverviewCompetitor[] = [];
  const benchmarks: OverviewCompetitor[] = [];

  for (const c of competitors) {
    if (c.slug === GME_SLUG) {
      gme = c;
    } else if (COMPETITOR_SLUGS.has(c.slug)) {
      direct.push(c);
    } else {
      benchmarks.push(c);
    }
  }

  return { gme, direct, benchmarks };
}

export default function OverviewPage() {
  const { competitors, highlights, isLoading, mutate } = useOverview();
  const { t } = useT();

  const { gme, direct, benchmarks } = useMemo(
    () => categorizeOverview(competitors),
    [competitors]
  );

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('page.overview')}</h1>
        <RefreshButton onRefresh={() => mutate()} />
      </div>

      <WeeklySummary highlights={highlights} />

      <QuickStatsBar competitors={competitors} />

      {competitors.length === 0 ? (
        <EmptyState message={t('empty.competitors')} />
      ) : (
        <>
          {/* Section 1: GME Remittance — pinned full-width */}
          {gme && (
            <section>
              <div className="grid grid-cols-1">
                <CompetitorCard competitor={gme} featured />
              </div>
            </section>
          )}

          {/* Section 2: Remittance Competitors */}
          {direct.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4">{t('overview.competitors')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {direct.map((comp) => (
                  <CompetitorCard key={comp.id} competitor={comp} />
                ))}
              </div>
            </section>
          )}

          {/* Section 3: Other Competitors & Benchmarks */}
          {benchmarks.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4">{t('overview.benchmarks')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {benchmarks.map((comp) => (
                  <CompetitorCard key={comp.id} competitor={comp} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
