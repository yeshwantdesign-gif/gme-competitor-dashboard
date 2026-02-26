'use client';

import { useCompetitors } from '@/hooks/useCompetitors';
import { CompetitorCard } from '@/components/overview/CompetitorCard';
import { QuickStatsBar } from '@/components/overview/QuickStatsBar';
import { RefreshButton } from '@/components/shared/RefreshButton';
import { PageSkeleton } from '@/components/shared/PageSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { useT } from '@/lib/i18n';

export default function OverviewPage() {
  const { competitors, isLoading, mutate } = useCompetitors();
  const { t } = useT();

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('page.overview')}</h1>
        <RefreshButton onRefresh={() => mutate()} />
      </div>

      <QuickStatsBar competitors={competitors} />

      {competitors.length === 0 ? (
        <EmptyState message={t('empty.competitors')} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {competitors.map((comp) => (
            <CompetitorCard key={comp.id} competitor={comp} />
          ))}
        </div>
      )}
    </div>
  );
}
