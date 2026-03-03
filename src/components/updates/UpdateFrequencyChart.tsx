'use client';

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from 'recharts';
import { useT } from '@/lib/i18n';
import type { AppUpdate } from '@/types';

interface TimelinePoint {
  x: number; // timestamp
  y: number; // row index for competitor
  name: string;
  version: string;
  store: 'android' | 'ios';
  date: string;
}

function formatDate(ts: number) {
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0].payload as TimelinePoint;
  return (
    <div
      className="rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-md"
      style={{ color: 'hsl(var(--card-foreground))' }}
    >
      <p className="font-medium">{p.name}</p>
      <p className="text-muted-foreground">
        {p.store === 'ios' ? 'iOS' : 'Android'} v{p.version}
      </p>
      <p className="text-muted-foreground">{p.date}</p>
    </div>
  );
}

export function UpdateFrequencyChart({ updates }: { updates: AppUpdate[] }) {
  const { t } = useT();

  // Build competitor name list (ordered by first appearance)
  const competitorNames: string[] = [];
  const nameIndexMap = new Map<string, number>();

  updates.forEach((u) => {
    const name = u.competitors?.name ?? 'Unknown';
    if (!nameIndexMap.has(name)) {
      nameIndexMap.set(name, competitorNames.length);
      competitorNames.push(name);
    }
  });

  // Build scatter points split by store
  const androidPoints: TimelinePoint[] = [];
  const iosPoints: TimelinePoint[] = [];

  updates.forEach((u) => {
    const dateStr = u.release_date || u.scraped_at;
    if (!dateStr) return;
    const name = u.competitors?.name ?? 'Unknown';
    const idx = nameIndexMap.get(name) ?? 0;
    const ts = new Date(dateStr).getTime();
    const point: TimelinePoint = {
      x: ts,
      y: idx,
      name,
      version: u.version,
      store: u.store,
      date: new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    };
    if (u.store === 'android') androidPoints.push(point);
    else iosPoints.push(point);
  });

  if (androidPoints.length === 0 && iosPoints.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('updates.noChartData')}</p>;
  }

  // Compute X domain
  const allTs = [...androidPoints, ...iosPoints].map((p) => p.x);
  const minTs = Math.min(...allTs);
  const maxTs = Math.max(...allTs);
  const padding = Math.max((maxTs - minTs) * 0.05, 86400000); // at least 1 day padding

  const chartHeight = Math.max(300, competitorNames.length * 36 + 60);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">{t('updates.frequency')}</h3>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'hsl(160 60% 45%)' }} />
            Android
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'hsl(220 70% 50%)' }} />
            iOS
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            type="number"
            dataKey="x"
            domain={[minTs - padding, maxTs + padding]}
            tickFormatter={formatDate}
            tick={{ fontSize: 11 }}
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[-0.5, competitorNames.length - 0.5]}
            ticks={competitorNames.map((_, i) => i)}
            tickFormatter={(val: number) => competitorNames[val] ?? ''}
            tick={{ fontSize: 11 }}
            stroke="hsl(var(--muted-foreground))"
            width={120}
          />
          <ZAxis range={[60, 60]} />
          <Tooltip content={<CustomTooltip />} />
          {androidPoints.length > 0 && (
            <Scatter
              name="Android"
              data={androidPoints}
              fill="hsl(160 60% 45%)"
              shape="circle"
            />
          )}
          {iosPoints.length > 0 && (
            <Scatter
              name="iOS"
              data={iosPoints}
              fill="hsl(220 70% 50%)"
              shape="diamond"
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
