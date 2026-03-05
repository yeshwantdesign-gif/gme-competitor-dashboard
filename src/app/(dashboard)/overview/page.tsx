'use client';

import { useMemo } from 'react';
import { useCompetitors } from '@/hooks/useCompetitors';
import { CompetitorCard } from '@/components/overview/CompetitorCard';
import { QuickStatsBar } from '@/components/overview/QuickStatsBar';
import { RefreshButton } from '@/components/shared/RefreshButton';
import { PageSkeleton } from '@/components/shared/PageSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { useT } from '@/lib/i18n';
import { categorize } from '@/lib/competitors/categorize';

export default function OverviewPage() {
  const { competitors, isLoading, mutate } = useCompetitors();
  const { t } = useT();

  const { gme, direct, benchmarks } = useMemo(
    () => categorize(competitors),
    [competitors]
  );

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('page.overview')}</h1>
        <RefreshButton onRefresh={() => mutate()} />
      </div>

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

          {/* Section 2: Competitors */}
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
