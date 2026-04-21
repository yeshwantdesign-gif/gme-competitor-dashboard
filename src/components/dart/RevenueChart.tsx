'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import type { DartFinancial } from '@/types';
import { useT } from '@/lib/i18n';
import { formatKrwBillions, dartCompanyColor } from './utils';

interface Props {
  financials: DartFinancial[];
}

export function RevenueChart({ financials }: Props) {
  const { t } = useT();

  // Group by year, with each company as a separate series
  const companies = [...new Set(financials.map((f) => f.corp_name))];
  const years = [...new Set(financials.map((f) => f.bsns_year))].sort();

  const chartData = years.map((year) => {
    const row: Record<string, number | string | null> = { year: String(year) };
    for (const company of companies) {
      const entry = financials.find((f) => f.bsns_year === year && f.corp_name === company);
      row[company] = entry?.revenue ? Math.round(entry.revenue / 1_000_000) : null;
    }
    return row;
  });

  if (chartData.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center text-muted-foreground">
        {t('shared.noData')}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-4 text-base font-semibold">{t('dart.revenueChart')}</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => formatKrwBillions(v)}
          />
          <Tooltip
            formatter={(value) => [`${formatKrwBillions(value as number)}`, '']}
            contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          />
          <Legend />
          {companies.map((company) => (
            <Line
              key={company}
              type="monotone"
              dataKey={company}
              stroke={dartCompanyColor(company)}
              strokeWidth={2}
              dot={{ r: 4 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
