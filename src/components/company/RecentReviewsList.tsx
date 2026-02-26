import { PlatformBadge } from '@/components/shared/PlatformBadge';
import { StarRating } from '@/components/shared/StarRating';
import { formatDate } from '@/lib/utils';
import type { Review } from '@/types';

export function RecentReviewsList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-muted-foreground">No reviews yet.</p>;
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-medium mb-4">Recent Reviews</h3>
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-border pb-3 last:border-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <PlatformBadge platform={review.store} />
                <StarRating rating={review.score} size={12} />
              </div>
              {review.review_date && (
                <span className="text-xs text-muted-foreground">
                  {formatDate(review.review_date)}
                </span>
              )}
            </div>
            {review.text && (
              <p className="text-sm text-muted-foreground line-clamp-3">{review.text}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
