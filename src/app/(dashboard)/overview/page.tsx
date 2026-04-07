'use client';

import { useOverview } from '@/hooks/useOverview';
import { WeeklySummary } from '@/components/overview/WeeklySummary';
import { RefreshButton } from '@/components/shared/RefreshButton';
import { PageSkeleton } from '@/components/shared/PageSkeleton';
import { useT } from '@/lib/i18n';

export default function OverviewPage() {
  const { highlights, isLoading, mutate } = useOverview();
  const { t } = useT();

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('page.overview')}</h1>
        <RefreshButton onRefresh={() => mutate()} />
      </div>

      <WeeklySummary highlights={highlights} />
    </div>
  );
}
