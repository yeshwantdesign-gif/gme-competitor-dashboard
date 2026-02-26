'use client';

import { Star } from 'lucide-react';

export function StarRating({ rating, size = 16 }: { rating: number | null; size?: number }) {
  if (rating == null) return <span className="text-muted-foreground text-sm">N/A</span>;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.round(rating)
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-muted-foreground'
          }
        />
      ))}
      <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}
