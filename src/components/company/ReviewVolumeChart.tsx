'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useT } from '@/lib/i18n';
import type { Review } from '@/types';

interface Props {
  reviews: Review[];
  brandColor?: string;
}

export function ReviewVolumeChart({ reviews, brandColor }: Props) {
  const { t } = useT();

  // Group reviews by week
  const weekMap = new Map<string, { week: string; android: number; ios: number }>();

  reviews.forEach((r) => {
    if (!r.review_date) return;
    const d = new Date(r.review_date);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toISOString().split('T')[0];
    const existing = weekMap.get(key) || { week: key, android: 0, ios: 0 };
    if (r.store === 'android') existing.android++;
    else existing.ios++;
    weekMap.set(key, existing);
  });

  const data = Array.from(weekMap.values()).sort((a, b) => a.week.localeCompare(b.week));

  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('company.noReviewData')}</p>;
  }

  const androidColor = brandColor ?? 'hsl(160 60% 45%)';
  const iosColor = brandColor ? `${brandColor}99` : 'hsl(220 70% 50%)';

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-medium mb-4">{t('company.reviewVolume')}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--card-foreground))',
            }}
          />
          <Legend />
          <Bar dataKey="android" name="Android" fill={androidColor} radius={[4, 4, 0, 0]} />
          <Bar dataKey="ios" name="iOS" fill={iosColor} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
