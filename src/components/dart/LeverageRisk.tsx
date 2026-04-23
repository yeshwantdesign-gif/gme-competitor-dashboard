'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';
import type { DartFinancial } from '@/types';
import { useT } from '@/lib/i18n';
import { dartCompanyColor, calcYoY } from './utils';
import { DART_COMPANIES } from '@/lib/dart/config';

interface Props {
  financials: DartFinancial[];
}

function getDisplayName(corpName: string): string {
  const config = DART_COMPANIES.find(
    (d) => d.searchTerms.some((term) => corpName.includes(term)) || d.nameKo === corpName
  );
  return config ? config.name : corpName;
}

export function LeverageRisk({ financials }: Props) {
  const { t } = useT();

  const years = [...new Set(financials.map((f) => f.bsns_year))].sort();
  const latestYear = years[years.length - 1];
  const prevYear = years[years.length - 2];

  if (!latestYear || !prevYear) return null;

  const companies = [...new Set(financials.map((f) => f.corp_name))];

  const data = companies.map((corpName) => {
    const latest = financials.find((f) => f.corp_name === corpName && f.bsns_year === latestYear);
    const prev = financials.find((f) => f.corp_name === corpName && f.bsns_year === prevYear);

    const revGrowth = calcYoY(latest?.revenue ?? null, prev?.revenue ?? null);
    const liabGrowth = calcYoY(latest?.total_liabilities ?? null, prev?.total_liabilities ?? null);
    const name = getDisplayName(corpName);
    const shortName = name.replace(' Remittance', '').replace(' Transfer', '');

    return {
      name: shortName,
      fullName: name,
      corpName,
      revGrowth: revGrowth != null ? Math.round(revGrowth * 10) / 10 : null,
      liabGrowth: liabGrowth != null ? Math.round(liabGrowth * 10) / 10 : null,
      isWarning: revGrowth != null && liabGrowth != null && liabGrowth > revGrowth,
    };
  }).filter((d) => d.revGrowth != null || d.liabGrowth != null);

  if (data.length === 0) return null;

  // Find GME data for insight
  const gme = data.find((d) => d.fullName === 'GME Remittance');

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-2 text-base font-semibold">{t('dart.leverage.title')}</h3>

      {/* Custom legend */}
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 mb-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-[#6B7280]" />
          {t('dart.leverage.revGrowth')}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-[#6B7280] opacity-40" />
          {t('dart.leverage.liabGrowth')}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            formatter={(value, name) => [
              `${Number(value).toFixed(1)}%`,
              name === 'revGrowth' ? t('dart.leverage.revGrowth') : t('dart.leverage.liabGrowth'),
            ]}
          />
          <ReferenceLine y={0} stroke="var(--muted-foreground)" strokeOpacity={0.3} />

          <Bar dataKey="revGrowth" name={t('dart.leverage.revGrowth')} radius={[4, 4, 0, 0]} legendType="none">
            {data.map((d, i) => (
              <Cell key={i} fill={dartCompanyColor(d.corpName)} />
            ))}
          </Bar>
          <Bar dataKey="liabGrowth" name={t('dart.leverage.liabGrowth')} radius={[4, 4, 0, 0]} legendType="none">
            {data.map((d, i) => (
              <Cell key={i} fill={dartCompanyColor(d.corpName)} fillOpacity={0.4} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {gme && gme.revGrowth != null && gme.liabGrowth != null && gme.liabGrowth > gme.revGrowth && (
        <div className="mt-3 rounded-md bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
          {t('dart.leverage.gmeInsight')}
        </div>
      )}
    </div>
  );
}
