'use client';

import { RefreshCw, Newspaper, TrendingUp } from 'lucide-react';
import { useT } from '@/lib/i18n';
import type { OverviewCompetitor } from '@/types';

export function QuickStatsBar({ competitors }: { competitors: OverviewCompetitor[] }) {
  const { t } = useT();

  const totalUpdates = competitors.reduce((sum, c) => sum + c.app_updates_this_week, 0);
  const totalNews = competitors.reduce((sum, c) => sum + c.news_this_week, 0);

  // Downloads trend: count how many competitors have increased downloads
  const trending = competitors.filter((c) => {
    if (!c.play_store_downloads || !c.prev_play_store_downloads) return false;
    return parseDownloads(c.play_store_downloads) > parseDownloads(c.prev_play_store_downloads);
  }).length;

  const stats = [
    { label: t('stats.updatesThisWeek'), value: totalUpdates, icon: RefreshCw },
    { label: t('stats.newsThisWeek'), value: totalNews, icon: Newspaper },
    { label: t('stats.downloadsTrending'), value: `${trending} / ${competitors.length}`, icon: TrendingUp },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <stat.icon size={16} />
            <span className="text-xs">{stat.label}</span>
          </div>
          <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
        </div>
      ))}
    </div>
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
