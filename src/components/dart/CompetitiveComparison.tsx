'use client';

import type { DartFinancialRatio } from '@/types';
import type { DartFinancial } from '@/types';
import { useT } from '@/lib/i18n';

interface Props {
  ratios: DartFinancialRatio[];
  financials: DartFinancial[];
}

const COMPANY_ORDER = ['E9Pay', 'GMoney Transfer', 'Hanpass', 'GME Remittance', 'SentBe'];

function cellColor(value: number | null, metric: string): string {
  if (value == null) return '';
  switch (metric) {
    case 'opMargin':
    case 'netMargin':
    case 'roe':
    case 'roa':
      if (value >= 20) return 'bg-green-500/20 text-green-400';
      if (value >= 10) return 'bg-green-500/10 text-green-300';
      if (value >= 0) return 'bg-yellow-500/10 text-yellow-300';
      return 'bg-red-500/20 text-red-400';
    case 'debtEquity':
      if (value <= 100) return 'bg-green-500/20 text-green-400';
      if (value <= 300) return 'bg-yellow-500/10 text-yellow-300';
      return 'bg-red-500/20 text-red-400';
    case 'assetTurnover':
      if (value >= 0.9) return 'bg-green-500/20 text-green-400';
      if (value >= 0.6) return 'bg-yellow-500/10 text-yellow-300';
      return 'bg-red-500/20 text-red-400';
    case 'revGrowth':
      if (value >= 20) return 'bg-green-500/20 text-green-400';
      if (value >= 0) return 'bg-yellow-500/10 text-yellow-300';
      return 'bg-red-500/20 text-red-400';
    case 'revenue':
      return '';
    default:
      return '';
  }
}

function formatRevenueBillions(valueRaw: number | null): string {
  if (valueRaw == null) return '-';
  const billions = valueRaw / 1_000_000_000;
  return `${billions.toFixed(1)}`;
}

export function CompetitiveComparison({ ratios, financials }: Props) {
  const { t } = useT();

  const year2025 = ratios.filter((r) => r.year === 2025);
  const companies = COMPANY_ORDER.filter((name) =>
    year2025.some((r) => r.competitor_name === name)
  );

  const metrics: { key: string; label: string; getValue: (name: string) => number | null; format?: (v: number) => string }[] = [
    {
      key: 'revenue',
      label: t('dart.ratio.revenue'),
      getValue: (name) => {
        const f = financials.find((f) => {
          const displayName = getDisplayName(f.corp_name);
          return displayName === name && f.bsns_year === 2025;
        });
        return f?.revenue ?? null;
      },
      format: (v) => formatRevenueBillions(v),
    },
    { key: 'opMargin', label: t('dart.ratio.opMargin'), getValue: (name) => year2025.find((r) => r.competitor_name === name)?.operating_margin ?? null },
    { key: 'netMargin', label: t('dart.ratio.netMargin'), getValue: (name) => year2025.find((r) => r.competitor_name === name)?.net_margin ?? null },
    { key: 'debtEquity', label: t('dart.ratio.debtEquity'), getValue: (name) => year2025.find((r) => r.competitor_name === name)?.debt_to_equity ?? null, format: (v) => (v / 100).toFixed(2) + 'x' },
    { key: 'roe', label: t('dart.ratio.roe'), getValue: (name) => year2025.find((r) => r.competitor_name === name)?.roe ?? null },
    { key: 'roa', label: t('dart.ratio.roa'), getValue: (name) => year2025.find((r) => r.competitor_name === name)?.roa ?? null },
    { key: 'assetTurnover', label: t('dart.ratio.assetTurnover'), getValue: (name) => year2025.find((r) => r.competitor_name === name)?.asset_turnover ?? null, format: (v) => v.toFixed(2) },
    { key: 'revGrowth', label: t('dart.ratio.revGrowth'), getValue: (name) => year2025.find((r) => r.competitor_name === name)?.revenue_growth ?? null },
  ];

  if (companies.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-4 overflow-x-auto">
      <h3 className="mb-4 text-base font-semibold">{t('dart.competitiveComparison')}</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="pb-2 pr-4 font-medium">{t('dart.metric')}</th>
            {companies.map((name) => (
              <th key={name} className={`pb-2 px-3 font-medium text-right ${name === 'GME Remittance' ? 'bg-blue-500/10 rounded-t' : ''}`}>
                {name.replace(' Remittance', '').replace(' Transfer', '')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metrics.map((m) => (
            <tr key={m.key} className="border-b border-border/50">
              <td className="py-2.5 pr-4 font-medium text-muted-foreground">{m.label}</td>
              {companies.map((name) => {
                const value = m.getValue(name);
                const color = cellColor(value, m.key);
                const formatted = value != null
                  ? (m.format ? m.format(value) : value.toFixed(1))
                  : '-';
                return (
                  <td key={name} className={`py-2.5 px-3 text-right tabular-nums rounded ${color} ${name === 'GME Remittance' ? 'bg-blue-500/10' : ''}`}>
                    {formatted}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getDisplayName(corpName: string): string {
  const map: Record<string, string> = {
    '이나인페이': 'E9Pay',
    '지머니트랜스': 'GMoney Transfer',
    '한패스': 'Hanpass',
    '글로벌머니익스프레스': 'GME Remittance',
    '센트비': 'SentBe',
  };
  for (const [ko, en] of Object.entries(map)) {
    if (corpName.includes(ko)) return en;
  }
  return corpName;
}
