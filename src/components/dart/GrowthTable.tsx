'use client';

import type { DartFinancial } from '@/types';
import { useT } from '@/lib/i18n';
import { formatKrwBillions, calcYoY } from './utils';
import { DART_COMPANIES } from '@/lib/dart/config';

interface Props {
  financials: DartFinancial[];
}

function getDisplayName(corpName: string): string {
  const config = DART_COMPANIES.find(
    (d) => d.searchTerms.some((term) => corpName.includes(term)) ||
           d.nameKo === corpName
  );
  return config ? config.name : corpName;
}

export function GrowthTable({ financials }: Props) {
  const { t } = useT();

  const companies = [...new Set(financials.map((f) => f.corp_name))];
  const years = [...new Set(financials.map((f) => f.bsns_year))].sort();
  const latestYear = years[years.length - 1];
  const prevYear = years[years.length - 2];

  if (!latestYear) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center text-muted-foreground">
        {t('shared.noData')}
      </div>
    );
  }

  const rows = companies.map((corpName) => {
    const latest = financials.find((f) => f.corp_name === corpName && f.bsns_year === latestYear);
    const prev = financials.find((f) => f.corp_name === corpName && f.bsns_year === prevYear);

    return {
      name: getDisplayName(corpName),
      corpName,
      year: latestYear,
      revenue: latest?.revenue ? Math.round(latest.revenue / 1_000_000) : null,
      revenueYoY: calcYoY(latest?.revenue ?? null, prev?.revenue ?? null),
      operatingProfit: latest?.operating_profit ? Math.round(latest.operating_profit / 1_000_000) : null,
      opYoY: calcYoY(latest?.operating_profit ?? null, prev?.operating_profit ?? null),
      netIncome: latest?.net_income ? Math.round(latest.net_income / 1_000_000) : null,
      niYoY: calcYoY(latest?.net_income ?? null, prev?.net_income ?? null),
      totalAssets: latest?.total_assets ? Math.round(latest.total_assets / 1_000_000) : null,
    };
  });

  return (
    <div className="rounded-lg border border-border bg-card p-4 overflow-x-auto">
      <h3 className="mb-4 text-base font-semibold">{t('dart.growthTable')} ({latestYear})</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="pb-2 pr-4 font-medium">{t('dart.company')}</th>
            <th className="pb-2 pr-4 font-medium text-right">{t('dart.revenue')}</th>
            <th className="pb-2 pr-4 font-medium text-right">YoY</th>
            <th className="pb-2 pr-4 font-medium text-right">{t('dart.operatingProfit')}</th>
            <th className="pb-2 pr-4 font-medium text-right">YoY</th>
            <th className="pb-2 pr-4 font-medium text-right">{t('dart.netIncome')}</th>
            <th className="pb-2 font-medium text-right">{t('dart.totalAssets')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.corpName} className="border-b border-border/50">
              <td className="py-2.5 pr-4 font-medium">{row.name}</td>
              <td className="py-2.5 pr-4 text-right tabular-nums">
                {row.revenue != null ? formatKrwBillions(row.revenue) : '-'}
              </td>
              <td className="py-2.5 pr-4 text-right tabular-nums">
                <YoYBadge value={row.revenueYoY} />
              </td>
              <td className="py-2.5 pr-4 text-right tabular-nums">
                {row.operatingProfit != null ? formatKrwBillions(row.operatingProfit) : '-'}
              </td>
              <td className="py-2.5 pr-4 text-right tabular-nums">
                <YoYBadge value={row.opYoY} />
              </td>
              <td className="py-2.5 pr-4 text-right tabular-nums">
                {row.netIncome != null ? formatKrwBillions(row.netIncome) : '-'}
              </td>
              <td className="py-2.5 text-right tabular-nums">
                {row.totalAssets != null ? formatKrwBillions(row.totalAssets) : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function YoYBadge({ value }: { value: number | null }) {
  if (value == null) return <span className="text-muted-foreground">-</span>;
  const isPositive = value >= 0;
  return (
    <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
      {isPositive ? '+' : ''}{value.toFixed(1)}%
    </span>
  );
}
