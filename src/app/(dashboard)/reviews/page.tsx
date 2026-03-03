'use client';

import { useState, useEffect, useRef } from 'react';
import { useReviews } from '@/hooks/useReviews';
import { useCompetitors } from '@/hooks/useCompetitors';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { ReviewFilters } from '@/components/reviews/ReviewFilters';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageSkeleton } from '@/components/shared/PageSkeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useT } from '@/lib/i18n';

export default function ReviewsPage() {
  const [competitorIds, setCompetitorIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const initialized = useRef(false);
  const { t } = useT();

  const { competitors } = useCompetitors();
  const { reviews, totalPages, isLoading } = useReviews({
    competitor_ids: competitorIds.length > 0 ? competitorIds : undefined,
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('page.reviews')}</h1>

      <ReviewFilters
        competitors={competitors}
        selectedCompetitors={competitorIds}
        onCompetitorChange={(ids) => { setCompetitorIds(ids); setPage(1); }}
      />

      {isLoading ? (
        <PageSkeleton />
      ) : reviews.length === 0 ? (
        <EmptyState message={t('reviews.noMatch')} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
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
