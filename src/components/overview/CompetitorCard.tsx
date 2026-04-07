'use client';

import Link from 'next/link';
import { RefreshCw, Newspaper, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { CompetitorLogo } from '@/components/shared/CompetitorLogo';
import { useT } from '@/lib/i18n';
import type { OverviewCompetitor } from '@/types';

interface Props {
  competitor: OverviewCompetitor;
  featured?: boolean;
}

function DownloadsTrend({ current, previous }: { current: string | null; previous: string | null }) {
  if (!current) return <span className="text-sm text-muted-foreground">N/A</span>;

  const label = current;

  if (!previous) {
    return <span className="text-sm font-medium">{label}</span>;
  }

  const curr = parseDownloads(current);
  const prev = parseDownloads(previous);

  if (curr > prev) {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-green-500">
        <TrendingUp size={14} />
        {label}
      </span>
    );
  }
  if (curr < prev) {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-red-500">
        <TrendingDown size={14} />
        {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground">
      <Minus size={14} />
      {label}
    </span>
  );
}

function parseDownloads(s: string): number {
  const cleaned = s.replace(/[^0-9.+,kmb만천억]/gi, '').toLowerCase();
  const num = parseFloat(cleaned.replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return 0;
  if (/b|억/.test(cleaned)) return num * 1_000_000_000;
  if (/m|만/.test(cleaned)) return num * 1_000_000;
  if (/k|천/.test(cleaned)) return num * 1_000;
  return num;
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
              <div>
                <span className="text-xs text-muted-foreground block mb-0.5">{t('stats.updatesThisWeek')}</span>
                <span className="inline-flex items-center gap-1 text-sm font-medium">
                  <RefreshCw size={14} className="text-muted-foreground" />
                  {competitor.app_updates_this_week}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block mb-0.5">{t('stats.newsThisWeek')}</span>
                <span className="inline-flex items-center gap-1 text-sm font-medium">
                  <Newspaper size={14} className="text-muted-foreground" />
                  {competitor.news_this_week}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block mb-0.5">{t('stats.downloadsTrend')}</span>
                <DownloadsTrend
                  current={competitor.play_store_downloads}
                  previous={competitor.prev_play_store_downloads}
                />
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/company/${competitor.slug}`}>
      <div className="rounded-lg border border-border bg-card p-5 hover:border-primary/50 transition-colors cursor-pointer h-full">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <CompetitorLogo iconUrl={competitor.icon_url} name={competitor.name} size="md" />
            <div>
              <h3 className="font-semibold text-card-foreground">{competitor.name}</h3>
              <span className="text-xs text-muted-foreground">{competitor.type}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <RefreshCw size={12} />
              {t('stats.updatesThisWeek')}
            </span>
            <span className="font-medium">{competitor.app_updates_this_week}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Newspaper size={12} />
              {t('stats.newsThisWeek')}
            </span>
            <span className="font-medium">{competitor.news_this_week}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground block mb-0.5">{t('stats.downloadsTrend')}</span>
          <DownloadsTrend
            current={competitor.play_store_downloads}
            previous={competitor.prev_play_store_downloads}
          />
        </div>
      </div>
    </Link>
  );
}
