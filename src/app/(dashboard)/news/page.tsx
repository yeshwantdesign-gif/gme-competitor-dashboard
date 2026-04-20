'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useNews } from '@/hooks/useNews';
import { useCompetitors } from '@/hooks/useCompetitors';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsFilters, type TimePeriod } from '@/components/news/NewsFilters';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageSkeleton } from '@/components/shared/PageSkeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { categorizeItems } from '@/lib/competitors/categorize';

function periodToDateFrom(period: TimePeriod): string | undefined {
  if (period === 'all' || period === 'custom') return undefined;
  const now = new Date();
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  now.setDate(now.getDate() - days);
  return now.toISOString().split('T')[0];
}

export default function NewsPage() {
  const [competitorIds, setCompetitorIds] = useState<string[]>([]);
  const [period, setPeriod] = useState<TimePeriod>('7d');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [page, setPage] = useState(1);
  const initialized = useRef(false);
  const { t } = useT();

  const { competitors } = useCompetitors();

  // Compute effective date range
  const dateFrom = period === 'custom' ? (customFrom || undefined) : periodToDateFrom(period);
  const dateTo = period === 'custom' ? (customTo || undefined) : undefined;

  const { articles, totalPages, isLoading } = useNews({
    competitor_ids: competitorIds.length > 0 ? competitorIds : undefined,
    date_from: dateFrom,
    date_to: dateTo,
    page,
  });

  // Default-select "GME Remittance" once competitors load
  useEffect(() => {
    if (initialized.current || competitors.length === 0) return;
    const gme = competitors.find((c) => c.name === 'GME Remittance');
    if (gme) {
      setCompetitorIds([gme.id]);
      initialized.current = true;
    }
  }, [competitors]);

  const sections = useMemo(() => categorizeItems(articles), [articles]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('page.news')}</h1>

      <NewsFilters
        competitors={competitors}
        selectedCompetitors={competitorIds}
        onCompetitorChange={(ids) => { setCompetitorIds(ids); setPage(1); }}
        selectedPeriod={period}
        onPeriodChange={(p) => { setPeriod(p); setPage(1); }}
        customDateFrom={customFrom}
        customDateTo={customTo}
        onCustomDateChange={(from, to) => { setCustomFrom(from); setCustomTo(to); setPage(1); }}
      />

      {isLoading ? (
        <PageSkeleton />
      ) : articles.length === 0 ? (
        <EmptyState message={t('news.noMatch')} />
      ) : (
        <>
          {/* Section 1: GME Remittance */}
          {sections.gme.length > 0 && (
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.gme.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            </section>
          )}

          {/* Section 2: Remittance Competitors */}
          {sections.direct.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4">{t('overview.competitors')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.direct.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            </section>
          )}

          {/* Section 3: Other Competitors & Benchmarks */}
          {sections.benchmarks.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4">{t('overview.benchmarks')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.benchmarks.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            </section>
          )}

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
