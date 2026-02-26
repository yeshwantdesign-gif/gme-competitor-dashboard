'use client';

import { useState } from 'react';
import { useRankings } from '@/hooks/useRankings';
import { RankingTable } from '@/components/rankings/RankingTable';
import { ComparisonChart } from '@/components/rankings/ComparisonChart';
import { RefreshButton } from '@/components/shared/RefreshButton';
import { TableSkeleton } from '@/components/shared/PageSkeleton';
import { useT } from '@/lib/i18n';
import type { RankingSortBy } from '@/types';

export default function RankingsPage() {
  const [sortBy, setSortBy] = useState<RankingSortBy>('combined_rating');
  const { rankings, isLoading, mutate } = useRankings(sortBy);
  const { t } = useT();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('page.rankings')}</h1>
        <RefreshButton onRefresh={() => mutate()} />
      </div>

      {isLoading ? (
        <TableSkeleton rows={10} />
      ) : (
        <>
          <RankingTable rankings={rankings} sortBy={sortBy} onSortChange={setSortBy} />
          <ComparisonChart rankings={rankings} />
        </>
      )}
    </div>
  );
}
