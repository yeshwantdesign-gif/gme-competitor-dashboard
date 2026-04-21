'use client';

import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import type { DartFinancialRatio } from '@/types';
import { useT } from '@/lib/i18n';

interface Props {
  ratios: DartFinancialRatio[];
}

const COMPANY_COLORS: Record<string, string> = {
  'E9Pay': '#10B981',
  'GMoney Transfer': '#F59E0B',
  'Hanpass': '#8B5CF6',
  'GME Remittance': '#3B82F6',
  'SentBe': '#EF4444',
};

const SHORT_NAMES: Record<string, string> = {
  'E9Pay': 'E9Pay',
  'GMoney Transfer': 'GMoney',
  'Hanpass': 'Hanpass',
  'GME Remittance': 'GME',
  'SentBe': 'SentBe',
};

function buildLineData(ratios: DartFinancialRatio[], field: keyof DartFinancialRatio) {
  const years = [...new Set(ratios.map((r) => r.year))].sort();
  const companies = [...new Set(ratios.map((r) => r.competitor_name))];
  return years.map((year) => {
    const row: Record<string, number | string | null> = { year: String(year) };
    for (const company of companies) {
      const entry = ratios.find((r) => r.year === year && r.competitor_name === company);
      row[SHORT_NAMES[company] || company] = entry ? (entry[field] as number | null) : null;
    }
    return row;
  });
}

function buildBarData(ratios: DartFinancialRatio[], field: keyof DartFinancialRatio) {
  const years = [...new Set(ratios.map((r) => r.year))].sort();
  const companies = [...new Set(ratios.map((r) => r.competitor_name))];
  return years.map((year) => {
    const row: Record<string, number | string | null> = { year: String(year) };
    for (const company of companies) {
      const entry = ratios.find((r) => r.year === year && r.competitor_name === company);
      row[SHORT_NAMES[company] || company] = entry ? (entry[field] as number | null) : null;
    }
    return row;
  });
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h4 className="mb-3 text-sm font-semibold">{title}</h4>
      {children}
    </div>
  );
}

export function RatioCharts({ ratios }: Props) {
  const { t } = useT();

  const companies = [...new Set(ratios.map((r) => r.competitor_name))];
  const shortKeys = companies.map((c) => SHORT_NAMES[c] || c);

  const opMarginData = buildLineData(ratios, 'operating_margin');
  const deData = buildLineData(ratios, 'debt_to_equity');
  const roeData = buildBarData(ratios, 'roe');
  const growthData = buildBarData(ratios, 'revenue_growth');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ChartCard title={t('dart.opMarginTrend')}>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={opMarginData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, '']}
              contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {shortKeys.map((key, i) => (
              <Line key={key} type="monotone" dataKey={key}
                stroke={COMPANY_COLORS[companies[i]] || '#888'} strokeWidth={2}
                dot={{ r: 3 }} connectNulls />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title={t('dart.debtEquityTrend')}>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={deData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, '']}
              contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {shortKeys.map((key, i) => (
              <Line key={key} type="monotone" dataKey={key}
                stroke={COMPANY_COLORS[companies[i]] || '#888'} strokeWidth={2}
                dot={{ r: 3 }} connectNulls />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title={t('dart.roeComparison')}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={roeData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, '']}
              contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {shortKeys.map((key, i) => (
              <Bar key={key} dataKey={key} fill={COMPANY_COLORS[companies[i]] || '#888'} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title={t('dart.revenueGrowthComparison')}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={growthData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, '']}
              contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {shortKeys.map((key, i) => (
              <Bar key={key} dataKey={key} fill={COMPANY_COLORS[companies[i]] || '#888'} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
