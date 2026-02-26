import { PlatformBadge } from '@/components/shared/PlatformBadge';
import { StarRating } from '@/components/shared/StarRating';
import { CompetitorLogo } from '@/components/shared/CompetitorLogo';
import { formatDate } from '@/lib/utils';
import type { Review } from '@/types';

interface ReviewWithCompetitor extends Review {
  competitors?: { name: string; slug: string; icon_url?: string | null };
}

export function ReviewCard({ review }: { review: ReviewWithCompetitor }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {review.competitors && (
            <>
              <CompetitorLogo iconUrl={review.competitors.icon_url} name={review.competitors.name} size="sm" />
              <span className="text-sm font-medium">{review.competitors.name}</span>
            </>
          )}
          <PlatformBadge platform={review.store} />
        </div>
        <StarRating rating={review.score} size={14} />
      </div>
      {review.text && <p className="text-sm text-muted-foreground line-clamp-4">{review.text}</p>}
      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
        {review.review_date && <span>{formatDate(review.review_date)}</span>}
      </div>
    </div>
  );
}
