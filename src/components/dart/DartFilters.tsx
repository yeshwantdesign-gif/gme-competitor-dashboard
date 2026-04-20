'use client';

import { useT } from '@/lib/i18n';
import type { DartCorpCode } from '@/types';
import { DART_COMPANIES } from '@/lib/dart/config';

interface Props {
  companies: DartCorpCode[];
  selectedCorpCodes: string[];
  onCorpCodeChange: (codes: string[]) => void;
}

export function DartFilters({ companies, selectedCorpCodes, onCorpCodeChange }: Props) {
  const { t } = useT();
  const allSelected = selectedCorpCodes.length === 0;

  function toggle(corpCode: string) {
    if (selectedCorpCodes.includes(corpCode)) {
      onCorpCodeChange(selectedCorpCodes.filter((c) => c !== corpCode));
    } else {
      onCorpCodeChange([...selectedCorpCodes, corpCode]);
    }
  }

  // Map corp codes to display names from config
  function getDisplayName(company: DartCorpCode): string {
    const config = DART_COMPANIES.find(
      (d) => d.searchTerms.some((term) => company.corp_name.includes(term)) ||
             (d.stockCode && d.stockCode === company.stock_code)
    );
    return config ? config.name : company.corp_name;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCorpCodeChange([])}
        className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
          allSelected
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        }`}
      >
        {t('filter.allCompanies')}
      </button>
      {companies.map((c) => {
        const active = selectedCorpCodes.includes(c.corp_code);
        return (
          <button
            key={c.corp_code}
            onClick={() => toggle(c.corp_code)}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              active
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {getDisplayName(c)}
          </button>
        );
      })}
    </div>
  );
}
