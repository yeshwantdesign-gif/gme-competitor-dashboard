'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine, Label,
} from 'recharts';
import type { DartFinancial } from '@/types';
import { useT } from '@/lib/i18n';
import { dartCompanyColor } from './utils';
import { DART_COMPANIES } from '@/lib/dart/config';

interface Props {
  financials: DartFinancial[];
}

const TARGET_SLUGS = ['gme', 'gmoney', 'e9pay', 'hanpass'];

function getDisplayName(corpName: string): string {
  const config = DART_COMPANIES.find(
    (d) => d.searchTerms.some((term) => corpName.includes(term)) || d.nameKo === corpName
  );
  return config ? config.name : corpName;
}

function getSlug(corpName: string): string | null {
  const config = DART_COMPANIES.find(
    (d) => d.searchTerms.some((term) => corpName.includes(term)) || d.nameKo === corpName
  );
  return config?.slug ?? null;
}

export function RevenueConvergence({ financials }: Props) {
  const { t } = useT();

  // Filter to target companies
  const filtered = financials.filter((f) => {
    const slug = getSlug(f.corp_name);
    return slug && TARGET_SLUGS.includes(slug);
  });

  const companies = [...new Set(filtered.map((f) => f.corp_name))];
  const years = [...new Set(filtered.map((f) => f.bsns_year))].sort();

  if (companies.length === 0 || years.length < 2) return null;

  // Build actual data + growth rates per company
  const companyData: Record<string, { name: string; revenues: Record<number, number>; growthRate: number }> = {};

  for (const corpName of companies) {
    const name = getDisplayName(corpName);
    const revenues: Record<number, number> = {};
    const entries = filtered.filter((f) => f.corp_name === corpName).sort((a, b) => a.bsns_year - b.bsns_year);

    for (const e of entries) {
      if (e.revenue != null) revenues[e.bsns_year] = e.revenue / 1_000_000_000; // billions
    }

    // Calculate CAGR from last 2 available years
    const sortedYears = Object.keys(revenues).map(Number).sort();
    const last = sortedYears[sortedYears.length - 1];
    const prev = sortedYears[sortedYears.length - 2];
    let growthRate = 0;
    if (last && prev && revenues[prev] > 0) {
      growthRate = (revenues[last] - revenues[prev]) / Math.abs(revenues[prev]);
    }

    companyData[corpName] = { name, revenues, growthRate };
  }

  // Build chart data: actual years + projections to 2028
  const allYears = [];
  const minYear = Math.min(...years);
  for (let y = minYear; y <= 2028; y++) allYears.push(y);

  const chartData = allYears.map((year) => {
    const row: Record<string, number | string | null> = { year: String(year) };

    for (const corpName of companies) {
      const cd = companyData[corpName];
      const actualRevenue = cd.revenues[year];

      if (actualRevenue != null) {
        row[cd.name] = Math.round(actualRevenue * 10) / 10;
      } else {
        // Project from last known year
        const sortedYears = Object.keys(cd.revenues).map(Number).sort();
        const lastKnown = sortedYears[sortedYears.length - 1];
        if (lastKnown && year > lastKnown) {
          const baseRevenue = cd.revenues[lastKnown];
          const projected = baseRevenue * Math.pow(1 + cd.growthRate, year - lastKnown);
          row[cd.name] = Math.round(projected * 10) / 10;
        }
      }
    }

    return row;
  });

  // Find intersection year (GME overtakes GMoney)
  const gmeName = companies.find((c) => getSlug(c) === 'gme');
  const gmoneyName = companies.find((c) => getSlug(c) === 'gmoney');
  let intersectionYear: number | null = null;

  if (gmeName && gmoneyName) {
    const gmeDisplay = getDisplayName(gmeName);
    const gmoneyDisplay = getDisplayName(gmoneyName);
    for (const row of chartData) {
      const gmeVal = row[gmeDisplay] as number | null;
      const gmoneyVal = row[gmoneyDisplay] as number | null;
      if (gmeVal != null && gmoneyVal != null && gmeVal >= gmoneyVal) {
        intersectionYear = Number(row.year);
        break;
      }
    }
  }

  // Determine which years are actual vs projected
  const lastActualYear = Math.max(...years);
  const companyNames = companies.map((c) => getDisplayName(c));

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-2 text-base font-semibold">{t('dart.convergence.title')}</h3>
      <p className="mb-4 text-xs text-muted-foreground">{t('dart.convergence.note')}</p>

      <ResponsiveContainer width="100%" height={380}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}B`} />
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            formatter={(value) => [`₩${Number(value).toFixed(1)}B`, '']}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />

          {/* Divider between actual and projected */}
          <ReferenceLine x={String(lastActualYear)} stroke="var(--muted-foreground)" strokeDasharray="5 5" strokeOpacity={0.6} />

          {intersectionYear && (
            <ReferenceLine x={String(intersectionYear)} stroke="#FACC15" strokeWidth={2} strokeDasharray="3 3">
              <Label
                value={t('dart.convergence.overtake')}
                position="top"
                style={{ fontSize: 11, fill: '#FACC15', fontWeight: 600 }}
              />
            </ReferenceLine>
          )}

          {companyNames.map((name) => {
            const corpName = companies.find((c) => getDisplayName(c) === name)!;
            return (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                stroke={dartCompanyColor(corpName)}
                strokeWidth={name === 'GME Remittance' ? 3 : 2}
                dot={{ r: 3 }}
                strokeDasharray={undefined}
                connectNulls
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-block w-6 border-t-2 border-dashed border-muted-foreground" />
        {t('dart.convergence.projected')}
      </div>
    </div>
  );
}
