'use client';

import { useT } from '@/lib/i18n';
import type { CompetitorSummary } from '@/types';

interface Props {
  competitors: CompetitorSummary[];
  selectedCompetitor: string;
  selectedStore: string;
  onCompetitorChange: (id: string) => void;
  onStoreChange: (store: string) => void;
}

export function UpdateFilters({
  competitors,
  selectedCompetitor,
  selectedStore,
  onCompetitorChange,
  onStoreChange,
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
    </div>
  );
}
