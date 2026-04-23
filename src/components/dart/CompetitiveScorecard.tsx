'use client';

import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend, Tooltip,
} from 'recharts';
import type { DartFinancialRatio, DartFinancial } from '@/types';
import { useT } from '@/lib/i18n';
import { dartCompanyColor } from './utils';
import { DART_COMPANIES } from '@/lib/dart/config';

interface Props {
  ratios: DartFinancialRatio[];
  financials: DartFinancial[];
}

const COMPANY_ORDER = ['GME Remittance', 'E9Pay', 'GMoney Transfer', 'Hanpass', 'SentBe'];

const SHORT: Record<string, string> = {
  'E9Pay': 'E9Pay',
  'GMoney Transfer': 'GMoney',
  'Hanpass': 'Hanpass',
  'GME Remittance': 'GME',
  'SentBe': 'SentBe',
};

function getDisplayName(corpName: string): string {
  const config = DART_COMPANIES.find(
    (d) => d.searchTerms.some((term) => corpName.includes(term)) || d.nameKo === corpName
  );
  return config ? config.name : corpName;
}

/** Normalize a value to 0-100 given min/max bounds */
function normalize(value: number, min: number, max: number): number {
  if (max === min) return 50;
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
}

export function CompetitiveScorecard({ ratios, financials }: Props) {
  const { t } = useT();

  const year2025 = ratios.filter((r) => r.year === 2025);
  const companies = COMPANY_ORDER.filter((name) => year2025.some((r) => r.competitor_name === name));

  if (companies.length === 0) return null;

  // Gather raw values
  const rawData = companies.map((name) => {
    const ratio = year2025.find((r) => r.competitor_name === name);
    const fin = financials.find((f) => getDisplayName(f.corp_name) === name && f.bsns_year === 2025);

    return {
      name,
      growth: ratio?.revenue_growth ?? 0,
      profitability: ratio?.operating_margin ?? 0,
      debtEquity: ratio?.debt_to_equity ?? 0,
      assetTurnover: ratio?.asset_turnover ?? 0,
      revenue: fin?.revenue ?? 0,
    };
  });

  // Compute ranges for normalization
  const growths = rawData.map((d) => d.growth);
  const profits = rawData.map((d) => d.profitability);
  const des = rawData.map((d) => d.debtEquity);
  const ats = rawData.map((d) => d.assetTurnover);
  const revs = rawData.map((d) => d.revenue);

  // Build radar axes data
  const axes = [
    t('dart.scorecard.growth'),
    t('dart.scorecard.profitability'),
    t('dart.scorecard.leverage'),
    t('dart.scorecard.efficiency'),
    t('dart.scorecard.scale'),
  ];

  const radarData = axes.map((axis, i) => {
    const row: Record<string, string | number> = { axis };

    for (const rd of rawData) {
      const short = SHORT[rd.name] || rd.name;
      switch (i) {
        case 0: // Growth
          row[short] = Math.round(normalize(rd.growth, Math.min(...growths), Math.max(...growths)));
          break;
        case 1: // Profitability
          row[short] = Math.round(normalize(rd.profitability, Math.min(...profits), Math.max(...profits)));
          break;
        case 2: // Leverage Health (inverse — lower debt = better)
          row[short] = Math.round(normalize(-rd.debtEquity, -Math.max(...des), -Math.min(...des)));
          break;
        case 3: // Efficiency
          row[short] = Math.round(normalize(rd.assetTurnover, Math.min(...ats), Math.max(...ats)));
          break;
        case 4: // Scale
          row[short] = Math.round(normalize(rd.revenue, Math.min(...revs), Math.max(...revs)));
          break;
      }
    }

    return row;
  });

  const shortKeys = companies.map((c) => SHORT[c] || c);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-4 text-base font-semibold">{t('dart.scorecard.title')}</h3>

      <ResponsiveContainer width="100%" height={420}>
        <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid className="opacity-30" />
          <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis tick={{ fontSize: 9 }} domain={[0, 100]} />
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          />
          {shortKeys.map((key, i) => (
            <Radar
              key={key}
              name={key}
              dataKey={key}
              stroke={dartCompanyColor(companies[i])}
              fill={dartCompanyColor(companies[i])}
              fillOpacity={key === 'GME' ? 0.2 : 0.05}
              strokeWidth={key === 'GME' ? 3 : 1.5}
            />
          ))}
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
