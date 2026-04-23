'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceArea, ReferenceLine, Label,
} from 'recharts';
import type { DartFinancialRatio } from '@/types';
import { useT } from '@/lib/i18n';
import { AlertTriangle } from 'lucide-react';

interface Props {
  ratios: DartFinancialRatio[];
}

export function MarginErosionAlert({ ratios }: Props) {
  const { t } = useT();

  const gmeRatios = ratios
    .filter((r) => r.competitor_name === 'GME Remittance' && r.operating_margin != null)
    .sort((a, b) => a.year - b.year);

  if (gmeRatios.length < 2) return null;

  // Build actual data
  const data: { year: string; margin: number | null; projected: number | null }[] = gmeRatios.map((r) => ({
    year: String(r.year),
    margin: r.operating_margin,
    projected: null,
  }));

  // Calculate linear trend and project
  const xs = gmeRatios.map((r) => r.year);
  const ys = gmeRatios.map((r) => r.operating_margin!);
  const n = xs.length;
  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((a, x, i) => a + x * ys[i], 0);
  const sumX2 = xs.reduce((a, x) => a + x * x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const lastYear = gmeRatios[gmeRatios.length - 1].year;
  // Add last actual year as start of projection
  const lastActual = data[data.length - 1];
  if (lastActual) {
    lastActual.projected = lastActual.margin;
  }

  for (let y = lastYear + 1; y <= 2027; y++) {
    const projected = slope * y + intercept;
    data.push({
      year: String(y),
      margin: null,
      projected: Math.round(projected * 10) / 10,
    });
  }

  return (
    <div className="rounded-lg border-2 border-red-500/30 bg-red-500/5 p-4">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-5 w-5 text-red-500" />
        <h3 className="text-base font-semibold text-red-500">{t('dart.marginAlert.title')}</h3>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">{t('dart.marginAlert.note')}</p>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} domain={[0, 'auto']} />
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            formatter={(value) => [`${Number(value).toFixed(1)}%`, '']}
          />

          {/* Danger zone below 10% */}
          <ReferenceArea y1={0} y2={10} fill="#EF4444" fillOpacity={0.08} />
          <ReferenceLine y={10} stroke="#EF4444" strokeDasharray="3 3" strokeOpacity={0.6}>
            <Label value="10%" position="right" style={{ fontSize: 11, fill: '#EF4444' }} />
          </ReferenceLine>

          <Line
            type="monotone"
            dataKey="margin"
            stroke="#EF4444"
            strokeWidth={3}
            dot={{ r: 4, fill: '#EF4444' }}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="projected"
            stroke="#EF4444"
            strokeWidth={2}
            strokeDasharray="6 4"
            dot={{ r: 3, fill: '#EF4444', strokeDasharray: '' }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
