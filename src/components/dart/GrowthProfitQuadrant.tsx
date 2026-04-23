'use client';

import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Label, Cell, ZAxis,
} from 'recharts';
import type { DartFinancialRatio } from '@/types';
import { useT } from '@/lib/i18n';
import { dartCompanyColor } from './utils';

interface Props {
  ratios: DartFinancialRatio[];
}

const SHORT: Record<string, string> = {
  'E9Pay': 'E9Pay',
  'GMoney Transfer': 'GMoney',
  'Hanpass': 'Hanpass',
  'GME Remittance': 'GME',
  'SentBe': 'SentBe',
};

export function GrowthProfitQuadrant({ ratios }: Props) {
  const { t } = useT();

  const year2025 = ratios.filter((r) => r.year === 2025);
  const points = year2025
    .filter((r) => r.revenue_growth != null && r.operating_margin != null)
    .map((r) => ({
      name: SHORT[r.competitor_name] || r.competitor_name,
      fullName: r.competitor_name,
      x: r.revenue_growth!,
      y: r.operating_margin!,
      isGme: r.competitor_name === 'GME Remittance',
    }));

  if (points.length === 0) return null;

  const medianX = [...points.map((p) => p.x)].sort((a, b) => a - b)[Math.floor(points.length / 2)];
  const medianY = [...points.map((p) => p.y)].sort((a, b) => a - b)[Math.floor(points.length / 2)];

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-4 text-base font-semibold">{t('dart.quadrant.title')}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            type="number"
            dataKey="x"
            name="Revenue Growth"
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => `${v}%`}
          >
            <Label value={t('dart.quadrant.xAxis')} offset={-10} position="insideBottom" style={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
          </XAxis>
          <YAxis
            type="number"
            dataKey="y"
            name="Operating Margin"
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => `${v}%`}
          >
            <Label value={t('dart.quadrant.yAxis')} angle={-90} position="insideLeft" style={{ fontSize: 12, fill: 'var(--muted-foreground)', textAnchor: 'middle' }} />
          </YAxis>
          <ZAxis range={[120, 300]} />
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            formatter={(value) => [`${Number(value).toFixed(1)}%`, '']}
            itemSorter={() => 0}
            labelFormatter={() => ''}
          />

          {/* Quadrant lines */}
          <ReferenceLine x={medianX} stroke="var(--muted-foreground)" strokeDasharray="3 3" strokeOpacity={0.5} />
          <ReferenceLine y={medianY} stroke="var(--muted-foreground)" strokeDasharray="3 3" strokeOpacity={0.5} />

          <Scatter data={points}>
            {points.map((p, i) => (
              <Cell
                key={i}
                fill={dartCompanyColor(p.fullName)}
                r={p.isGme ? 10 : 6}
                stroke={p.isGme ? '#FACC15' : 'none'}
                strokeWidth={p.isGme ? 3 : 0}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      {/* Labels */}
      <div className="flex flex-wrap justify-center gap-4 mt-2">
        {points.map((p) => (
          <div key={p.name} className="flex items-center gap-1.5 text-xs">
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: dartCompanyColor(p.fullName) }} />
            {p.isGme ? <span className="font-bold">{p.name} ⭐</span> : <span>{p.name}</span>}
          </div>
        ))}
      </div>

      {/* Quadrant labels */}
      <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-muted-foreground">
        <div className="text-right pr-2 border-r border-b border-border/50 pb-2">
          <span className="font-medium text-yellow-500">{t('dart.quadrant.cashCow')}</span>
          <br />{t('dart.quadrant.cashCowDesc')}
        </div>
        <div className="pl-2 border-b border-border/50 pb-2">
          <span className="font-medium text-green-500">{t('dart.quadrant.star')}</span>
          <br />{t('dart.quadrant.starDesc')}
        </div>
        <div className="text-right pr-2 border-r border-border/50 pt-2">
          <span className="font-medium text-red-500">{t('dart.quadrant.turnaround')}</span>
          <br />{t('dart.quadrant.turnaroundDesc')}
        </div>
        <div className="pl-2 pt-2">
          <span className="font-medium text-blue-500">{t('dart.quadrant.growthBet')}</span>
          <br />{t('dart.quadrant.growthBetDesc')}
        </div>
      </div>
    </div>
  );
}
