'use client';

import { Building2, Star, MessageSquare, Newspaper } from 'lucide-react';
import { useT } from '@/lib/i18n';
import type { CompetitorSummary } from '@/types';

export function QuickStatsBar({ competitors }: { competitors: CompetitorSummary[] }) {
  const { t } = useT();

  const totalCompetitors = competitors.length;
  const avgPlayRating = average(competitors.map((c) => c.play_store_rating).filter(Boolean) as number[]);
  const totalReviews = competitors.reduce((sum, c) => sum + c.recent_reviews_count, 0);
  const totalNews = competitors.reduce((sum, c) => sum + c.recent_news_count, 0);

  const stats = [
    { label: t('stats.competitors'), value: totalCompetitors, icon: Building2 },
    { label: t('stats.avgRatingPlay'), value: avgPlayRating ? avgPlayRating.toFixed(2) : '—', icon: Star },
    { label: t('stats.reviews30d'), value: totalReviews, icon: MessageSquare },
    { label: t('stats.news30d'), value: totalNews, icon: Newspaper },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

function average(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}
