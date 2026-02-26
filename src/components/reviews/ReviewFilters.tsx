'use client';

import { useT } from '@/lib/i18n';
import type { CompetitorSummary } from '@/types';

interface Props {
  competitors: CompetitorSummary[];
  selectedCompetitor: string;
  selectedStore: string;
  selectedScore: string;
  onCompetitorChange: (id: string) => void;
  onStoreChange: (store: string) => void;
  onScoreChange: (score: string) => void;
}

export function ReviewFilters({
  competitors,
  selectedCompetitor,
  selectedStore,
  selectedScore,
  onCompetitorChange,
  onStoreChange,
  onScoreChange,
}: Props) {
  const { t } = useT();

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={selectedCompetitor}
        onChange={(e) => onCompetitorChange(e.target.value)}
        className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
      >
        <option value="">{t('filter.allCompanies')}</option>
        {competitors.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        value={selectedStore}
        onChange={(e) => onStoreChange(e.target.value)}
        className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
      >
        <option value="">{t('filter.allStores')}</option>
        <option value="android">{t('filter.android')}</option>
        <option value="ios">{t('filter.ios')}</option>
      </select>

      <select
        value={selectedScore}
        onChange={(e) => onScoreChange(e.target.value)}
        className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
      >
        <option value="">{t('filter.allRatings')}</option>
        <option value="5">{t('filter.stars', { n: 5 })}</option>
        <option value="4">{t('filter.stars', { n: 4 })}</option>
        <option value="3">{t('filter.stars', { n: 3 })}</option>
        <option value="2">{t('filter.stars', { n: 2 })}</option>
        <option value="1">{t('filter.star', { n: 1 })}</option>
      </select>
    </div>
  );
}
