'use client';

import { useT } from '@/lib/i18n';
import type { CompetitorSummary } from '@/types';

export type TimePeriod = '7d' | '30d' | '90d' | 'all';

interface Props {
  competitors: CompetitorSummary[];
  selectedCompetitors: string[];
  onCompetitorChange: (ids: string[]) => void;
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

const TIME_OPTIONS: { value: TimePeriod; labelKey: string }[] = [
  { value: '7d', labelKey: 'filter.last7d' },
  { value: '30d', labelKey: 'filter.last30d' },
  { value: '90d', labelKey: 'filter.last90d' },
  { value: 'all', labelKey: 'filter.allTime' },
];

export function UpdateFilters({
  competitors,
  selectedCompetitors,
  onCompetitorChange,
  selectedPeriod,
  onPeriodChange,
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
    <div className="space-y-3">
      {/* Time period chips */}
      <div className="flex flex-wrap gap-2">
        {TIME_OPTIONS.map((opt) => {
          const active = selectedPeriod === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onPeriodChange(opt.value)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {t(opt.labelKey)}
            </button>
          );
        })}
      </div>

      {/* Company chips */}
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
    </div>
  );
}
