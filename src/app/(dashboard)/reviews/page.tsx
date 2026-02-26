'use client';

import { useState } from 'react';
import { useReviews } from '@/hooks/useReviews';
import { useCompetitors } from '@/hooks/useCompetitors';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { ReviewFilters } from '@/components/reviews/ReviewFilters';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageSkeleton } from '@/components/shared/PageSkeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useT } from '@/lib/i18n';

export default function ReviewsPage() {
  const [competitorId, setCompetitorId] = useState('');
  const [store, setStore] = useState('');
  const [score, setScore] = useState('');
  const [page, setPage] = useState(1);
  const { t } = useT();

  const { competitors } = useCompetitors();
  const { reviews, totalPages, isLoading } = useReviews({
    competitor_id: competitorId || undefined,
    store: store || undefined,
    min_score: score ? parseInt(score) : undefined,
    max_score: score ? parseInt(score) : undefined,
    page,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('page.reviews')}</h1>

      <ReviewFilters
        competitors={competitors}
        selectedCompetitor={competitorId}
        selectedStore={store}
        selectedScore={score}
        onCompetitorChange={(v) => { setCompetitorId(v); setPage(1); }}
        onStoreChange={(v) => { setStore(v); setPage(1); }}
        onScoreChange={(v) => { setScore(v); setPage(1); }}
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
