'use client';

import { useT } from '@/lib/i18n';
import type { CompetitorSummary } from '@/types';

interface Props {
  competitors: CompetitorSummary[];
  selectedCompetitor: string;
  onCompetitorChange: (id: string) => void;
}

export function NewsFilters({ competitors, selectedCompetitor, onCompetitorChange }: Props) {
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
    </div>
  );
}
