'use client';

import { useState, useMemo } from 'react';
import { ArrowUp, ArrowDown, Star } from 'lucide-react';
import type { DartFinancial } from '@/types';
import { useT } from '@/lib/i18n';
import { formatKrwBillions, calcYoY } from './utils';
import { DART_COMPANIES } from '@/lib/dart/config';

interface Props {
  financials: DartFinancial[];
}

type SortField = 'revenue' | 'operatingProfit' | 'netIncome' | 'totalAssets' | 'totalLiabilities' | 'totalEquity';
type SortDir = 'asc' | 'desc';

function getDisplayName(corpName: string): string {
  const config = DART_COMPANIES.find(
    (d) => d.searchTerms.some((term) => corpName.includes(term)) ||
           d.nameKo === corpName
  );
  return config ? config.name : corpName;
}

function isGmeRow(corpName: string): boolean {
  return DART_COMPANIES.some(
    (d) => d.slug === 'gme' && d.searchTerms.some((term) => corpName.includes(term))
  );
}

export function GrowthTable({ financials }: Props) {
  const { t } = useT();

  const years = useMemo(
    () => [...new Set(financials.map((f) => f.bsns_year))].sort(),
    [financials]
  );

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const activeYear = selectedYear ?? years[years.length - 1];
  const prevYear = useMemo(() => {
    const idx = years.indexOf(activeYear);
    return idx > 0 ? years[idx - 1] : undefined;
  }, [years, activeYear]);

  const companies = useMemo(
    () => [...new Set(financials.map((f) => f.corp_name))],
    [financials]
  );

  const rows = useMemo(() => {
    const result = companies.map((corpName) => {
      const latest = financials.find((f) => f.corp_name === corpName && f.bsns_year === activeYear);
      const prev = prevYear
        ? financials.find((f) => f.corp_name === corpName && f.bsns_year === prevYear)
        : undefined;

      return {
        name: getDisplayName(corpName),
        corpName,
        isGme: isGmeRow(corpName),
        revenue: latest?.revenue ? Math.round(latest.revenue / 1_000_000) : null,
        revenueYoY: calcYoY(latest?.revenue ?? null, prev?.revenue ?? null),
        operatingProfit: latest?.operating_profit ? Math.round(latest.operating_profit / 1_000_000) : null,
        opYoY: calcYoY(latest?.operating_profit ?? null, prev?.operating_profit ?? null),
        netIncome: latest?.net_income ? Math.round(latest.net_income / 1_000_000) : null,
        niYoY: calcYoY(latest?.net_income ?? null, prev?.net_income ?? null),
        totalAssets: latest?.total_assets ? Math.round(latest.total_assets / 1_000_000) : null,
        totalLiabilities: latest?.total_liabilities ? Math.round(latest.total_liabilities / 1_000_000) : null,
        totalEquity: latest?.total_equity ? Math.round(latest.total_equity / 1_000_000) : null,
      };
    });

    if (sortField) {
      result.sort((a, b) => {
        const aVal = a[sortField] ?? (sortDir === 'asc' ? Infinity : -Infinity);
        const bVal = b[sortField] ?? (sortDir === 'asc' ? Infinity : -Infinity);
        return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
      });
    }

    return result;
  }, [companies, financials, activeYear, prevYear, sortField, sortDir]);

  if (!activeYear) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center text-muted-foreground">
        {t('shared.noData')}
      </div>
    );
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) {
      return <ArrowDown className="inline ml-1 h-3 w-3 opacity-30" />;
    }
    return sortDir === 'desc'
      ? <ArrowDown className="inline ml-1 h-3 w-3" />
      : <ArrowUp className="inline ml-1 h-3 w-3" />;
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 overflow-x-auto">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold">{t('dart.growthTable')} ({activeYear})</h3>
        <select
          value={activeYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
        >
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="pb-2 pr-4 font-medium">{t('dart.company')}</th>
            <th className="pb-2 pr-4 font-medium text-right cursor-pointer select-none" onClick={() => handleSort('revenue')}>
              {t('dart.revenue')}<SortIcon field="revenue" />
            </th>
            <th className="pb-2 pr-4 font-medium text-right">YoY</th>
            <th className="pb-2 pr-4 font-medium text-right cursor-pointer select-none" onClick={() => handleSort('operatingProfit')}>
              {t('dart.operatingProfit')}<SortIcon field="operatingProfit" />
            </th>
            <th className="pb-2 pr-4 font-medium text-right">YoY</th>
            <th className="pb-2 pr-4 font-medium text-right cursor-pointer select-none" onClick={() => handleSort('netIncome')}>
              {t('dart.netIncome')}<SortIcon field="netIncome" />
            </th>
            <th className="pb-2 pr-4 font-medium text-right cursor-pointer select-none" onClick={() => handleSort('totalAssets')}>
              {t('dart.totalAssets')}<SortIcon field="totalAssets" />
            </th>
            <th className="pb-2 pr-4 font-medium text-right cursor-pointer select-none" onClick={() => handleSort('totalLiabilities')}>
              {t('dart.totalLiabilities')}<SortIcon field="totalLiabilities" />
            </th>
            <th className="pb-2 font-medium text-right cursor-pointer select-none" onClick={() => handleSort('totalEquity')}>
              {t('dart.totalEquity')}<SortIcon field="totalEquity" />
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.corpName}
              className={`border-b border-border/50 ${row.isGme ? 'bg-red-500/10' : ''}`}
            >
              <td className={`py-2.5 pr-4 ${row.isGme ? 'font-bold' : 'font-medium'}`}>
                {row.isGme && <Star className="inline mr-1.5 h-4 w-4 text-yellow-500 fill-yellow-500 -mt-0.5" />}
                {row.name}
              </td>
              <td className={`py-2.5 pr-4 text-right tabular-nums ${row.isGme ? 'font-bold' : ''}`}>
                {row.revenue != null ? formatKrwBillions(row.revenue) : '-'}
              </td>
              <td className="py-2.5 pr-4 text-right tabular-nums">
                <YoYBadge value={row.revenueYoY} bold={row.isGme} />
              </td>
              <td className={`py-2.5 pr-4 text-right tabular-nums ${row.isGme ? 'font-bold' : ''}`}>
                {row.operatingProfit != null ? formatKrwBillions(row.operatingProfit) : '-'}
              </td>
              <td className="py-2.5 pr-4 text-right tabular-nums">
                <YoYBadge value={row.opYoY} bold={row.isGme} />
              </td>
              <td className={`py-2.5 pr-4 text-right tabular-nums ${row.isGme ? 'font-bold' : ''}`}>
                {row.netIncome != null ? formatKrwBillions(row.netIncome) : '-'}
              </td>
              <td className={`py-2.5 pr-4 text-right tabular-nums ${row.isGme ? 'font-bold' : ''}`}>
                {row.totalAssets != null ? formatKrwBillions(row.totalAssets) : '-'}
              </td>
              <td className={`py-2.5 pr-4 text-right tabular-nums ${row.isGme ? 'font-bold' : ''}`}>
                {row.totalLiabilities != null ? formatKrwBillions(row.totalLiabilities) : '-'}
              </td>
              <td className={`py-2.5 text-right tabular-nums ${row.isGme ? 'font-bold' : ''}`}>
                {row.totalEquity != null ? formatKrwBillions(row.totalEquity) : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function YoYBadge({ value, bold }: { value: number | null; bold?: boolean }) {
  if (value == null) return <span className="text-muted-foreground">-</span>;
  const isPositive = value >= 0;
  return (
    <span className={`${isPositive ? 'text-green-500' : 'text-red-500'} ${bold ? 'font-bold' : ''}`}>
      {isPositive ? '+' : ''}{value.toFixed(1)}%
    </span>
  );
}
