'use client';

import Link from 'next/link';
import { StarRating } from '@/components/shared/StarRating';
import { CompetitorLogo } from '@/components/shared/CompetitorLogo';
import { useT } from '@/lib/i18n';
import type { CompetitorSummary } from '@/types';

interface Props {
  competitor: CompetitorSummary;
  featured?: boolean;
}

export function CompetitorCard({ competitor, featured }: Props) {
  const { t } = useT();

  if (featured) {
    return (
      <Link href={`/company/${competitor.slug}`}>
        <div className="rounded-lg border border-primary/40 bg-card p-6 hover:border-primary/70 transition-colors cursor-pointer">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <CompetitorLogo iconUrl={competitor.icon_url} name={competitor.name} size="lg" />
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-card-foreground">{competitor.name}</h3>
              <span className="text-sm text-muted-foreground">{competitor.type}</span>
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              {competitor.play_store_rating != null && (
                <div>
                  <span className="text-xs text-muted-foreground block mb-0.5">{t('card.playStore')}</span>
                  <StarRating rating={competitor.play_store_rating} size={14} />
                </div>
              )}
              {competitor.app_store_rating != null && (
                <div>
                  <span className="text-xs text-muted-foreground block mb-0.5">{t('card.appStore')}</span>
                  <StarRating rating={competitor.app_store_rating} size={14} />
                </div>
              )}
              <div>
                <span className="text-xs text-muted-foreground block mb-0.5">{t('card.playStore')}</span>
                <span className="text-sm font-medium">{competitor.play_store_downloads ?? 'N/A'}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block mb-0.5">{t('card.reviews')}</span>
                <span className="text-sm font-medium">{competitor.recent_reviews_count}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block mb-0.5">{t('card.news')}</span>
                <span className="text-sm font-medium">{competitor.recent_news_count}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

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
