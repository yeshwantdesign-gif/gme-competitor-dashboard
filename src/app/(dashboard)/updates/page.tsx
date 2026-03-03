'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useUpdates } from '@/hooks/useUpdates';
import { useCompetitors } from '@/hooks/useCompetitors';
import { UpdateCard } from '@/components/updates/UpdateCard';
import { UpdateFilters, type TimePeriod } from '@/components/updates/UpdateFilters';
import { UpdateFrequencyChart } from '@/components/updates/UpdateFrequencyChart';
import { DaysSinceUpdateCards } from '@/components/updates/DaysSinceUpdateCards';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageSkeleton } from '@/components/shared/PageSkeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useT } from '@/lib/i18n';

function periodToDateFrom(period: TimePeriod): string | undefined {
  if (period === 'all') return undefined;
  const now = new Date();
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  now.setDate(now.getDate() - days);
  return now.toISOString().split('T')[0];
}

export default function UpdatesPage() {
  const [competitorIds, setCompetitorIds] = useState<string[]>([]);
  const [period, setPeriod] = useState<TimePeriod>('7d');
  const [page, setPage] = useState(1);
  const initialized = useRef(false);
  const { t } = useT();

  const { competitors } = useCompetitors();

  // Default-select "GME Remittance" once competitors load
  useEffect(() => {
    if (initialized.current || competitors.length === 0) return;
    const gme = competitors.find((c) => c.name === 'GME Remittance');
    if (gme) {
      setCompetitorIds([gme.id]);
      initialized.current = true;
    }
  }, [competitors]);

  const dateFrom = useMemo(() => periodToDateFrom(period), [period]);

  // Fetch all updates for charts/KPI (no pagination)
  const { updates: allUpdates, isLoading: allLoading } = useUpdates({
    competitor_ids: competitorIds.length > 0 ? competitorIds : undefined,
    date_from: dateFrom,
    pageSize: 500,
  });

  // Fetch paginated updates for timeline feed
  const { updates, totalPages, isLoading } = useUpdates({
    competitor_ids: competitorIds.length > 0 ? competitorIds : undefined,
    date_from: dateFrom,
    page,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('page.updates')}</h1>

      {/* Filters */}
      <UpdateFilters
        competitors={competitors}
        selectedCompetitors={competitorIds}
        onCompetitorChange={(ids) => { setCompetitorIds(ids); setPage(1); }}
        selectedPeriod={period}
        onPeriodChange={(p) => { setPeriod(p); setPage(1); }}
      />

      {/* KPI: Days since last update */}
      {!allLoading && allUpdates.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">{t('updates.daysSinceTitle')}</h2>
          <DaysSinceUpdateCards updates={allUpdates} />
        </div>
      )}

      {/* Update timeline chart */}
      {!allLoading && allUpdates.length > 0 && (
        <UpdateFrequencyChart updates={allUpdates} />
      )}

      {/* Timeline feed */}
      {isLoading ? (
        <PageSkeleton />
      ) : updates.length === 0 ? (
        <EmptyState message={t('updates.noMatch')} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {updates.map((update) => (
              <UpdateCard key={update.id} update={update} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 rounded-md bg-secondary px-3 py-2 text-sm disabled:opacity-50"
              >
                <ChevronLeft size={16} /> {t('shared.prev')}
              </button>
              <span className="text-sm text-muted-foreground">
                {t('shared.page', { page, total: totalPages })}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="inline-flex items-center gap-1 rounded-md bg-secondary px-3 py-2 text-sm disabled:opacity-50"
              >
                {t('shared.next')} <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
