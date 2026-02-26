'use client';

import Link from 'next/link';
import { StarRating } from '@/components/shared/StarRating';
import { CompetitorLogo } from '@/components/shared/CompetitorLogo';
import { useT } from '@/lib/i18n';
import type { CompetitorSummary } from '@/types';

export function CompetitorCard({ competitor }: { competitor: CompetitorSummary }) {
  const { t } = useT();

  return (
    <Link href={`/company/${competitor.slug}`}>
      <div className="rounded-lg border border-border bg-card p-5 hover:border-primary/50 transition-colors cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <CompetitorLogo iconUrl={competitor.icon_url} name={competitor.name} size="md" />
            <div>
              <h3 className="font-semibold text-card-foreground">{competitor.name}</h3>
              <span className="text-xs text-muted-foreground">{competitor.type}</span>
            </div>
          </div>
          <div className="flex gap-1">
            {competitor.play_store_rating != null && (
              <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
                Android
              </span>
            )}
            {competitor.app_store_rating != null && (
              <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400">
                iOS
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {competitor.play_store_rating != null && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{t('card.playStore')}</span>
              <StarRating rating={competitor.play_store_rating} size={12} />
            </div>
          )}
          {competitor.app_store_rating != null && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{t('card.appStore')}</span>
              <StarRating rating={competitor.app_store_rating} size={12} />
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-border space-y-1 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>{t('card.playStore')}: {competitor.play_store_downloads ?? 'N/A'}</span>
            <span>{t('card.appStore')}: N/A</span>
          </div>
          <div className="flex justify-between">
            <span>{competitor.recent_reviews_count} {t('card.reviews')}</span>
            <span>{competitor.recent_news_count} {t('card.news')}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
