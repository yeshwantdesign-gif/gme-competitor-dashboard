'use client';

import Link from 'next/link';
import { StarRating } from '@/components/shared/StarRating';
import { CompetitorLogo } from '@/components/shared/CompetitorLogo';
import { formatNumber } from '@/lib/utils';
import { useT } from '@/lib/i18n';
import type { RankingEntry, RankingSortBy } from '@/types';

interface Props {
  rankings: RankingEntry[];
  sortBy: RankingSortBy;
  onSortChange: (sort: RankingSortBy) => void;
}

const columnKeys: { key: RankingSortBy; labelKey: string }[] = [
  { key: 'combined_rating', labelKey: 'ranking.combined' },
  { key: 'play_store_rating', labelKey: 'ranking.playStore' },
  { key: 'app_store_rating', labelKey: 'ranking.appStore' },
  { key: 'total_ratings', labelKey: 'ranking.totalRatings' },
  { key: 'play_store_downloads', labelKey: 'ranking.downloads' },
];

export function RankingTable({ rankings, sortBy, onSortChange }: Props) {
  const { t } = useT();

  return (
    <div className="rounded-lg border border-border bg-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">#</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{t('ranking.company')}</th>
            {columnKeys.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={() => onSortChange(col.key)}
              >
                {t(col.labelKey)} {sortBy === col.key && '↓'}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rankings.map((entry) => (
            <tr key={entry.competitor.id} className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors">
              <td className="px-4 py-3 font-medium">{entry.rank}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <CompetitorLogo iconUrl={entry.competitor.icon_url} name={entry.competitor.name} size="sm" />
                  <Link
                    href={`/company/${entry.competitor.slug}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {entry.competitor.name}
                  </Link>
                  <span className="text-xs text-muted-foreground">{entry.competitor.type}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                {entry.combined_rating != null ? (
                  <StarRating rating={entry.combined_rating} size={12} />
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                {entry.play_store_rating != null ? entry.play_store_rating.toFixed(1) : '—'}
              </td>
              <td className="px-4 py-3">
                {entry.app_store_rating != null ? entry.app_store_rating.toFixed(1) : '—'}
              </td>
              <td className="px-4 py-3">{formatNumber(entry.total_ratings)}</td>
              <td className="px-4 py-3">{entry.play_store_downloads ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
