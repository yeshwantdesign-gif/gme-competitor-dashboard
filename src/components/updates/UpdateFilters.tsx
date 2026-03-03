'use client';

import { useT } from '@/lib/i18n';
import type { CompetitorSummary } from '@/types';

interface Props {
  competitors: CompetitorSummary[];
  selectedCompetitors: string[];
  onCompetitorChange: (ids: string[]) => void;
}

export function UpdateFilters({
  competitors,
  selectedCompetitors,
  onCompetitorChange,
}: Props) {
  const { t } = useT();
  const allSelected = selectedCompetitors.length === 0;

  function toggle(id: string) {
    if (selectedCompetitors.includes(id)) {
      onCompetitorChange(selectedCompetitors.filter((c) => c !== id));
    } else {
      onCompetitorChange([...selectedCompetitors, id]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCompetitorChange([])}
        className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
          allSelected
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        }`}
      >
        {t('filter.allCompanies')}
      </button>
      {competitors.map((c) => {
        const active = selectedCompetitors.includes(c.id);
        return (
          <button
            key={c.id}
            onClick={() => toggle(c.id)}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              active
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
