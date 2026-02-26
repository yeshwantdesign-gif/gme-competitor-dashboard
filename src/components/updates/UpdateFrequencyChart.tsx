'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useT } from '@/lib/i18n';
import type { AppUpdate } from '@/types';

export function UpdateFrequencyChart({ updates }: { updates: AppUpdate[] }) {
  const { t } = useT();

  // Group updates by month
  const monthMap = new Map<string, { month: string; android: number; ios: number }>();

  updates.forEach((u) => {
    const dateStr = u.release_date || u.scraped_at;
    if (!dateStr) return;
    const d = new Date(dateStr);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const existing = monthMap.get(key) || { month: key, android: 0, ios: 0 };
    if (u.store === 'android') existing.android++;
    else existing.ios++;
    monthMap.set(key, existing);
  });

  const data = Array.from(monthMap.values()).sort((a, b) => a.month.localeCompare(b.month));

  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('updates.noChartData')}</p>;
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-medium mb-4">{t('updates.frequency')}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--card-foreground))',
            }}
          />
          <Legend />
          <Bar dataKey="android" name="Android" fill="hsl(160 60% 45%)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="ios" name="iOS" fill="hsl(220 70% 50%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
