'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useT } from '@/lib/i18n';
import type { PlayStoreSnapshot, AppStoreSnapshot } from '@/types';

interface Props {
  playHistory: PlayStoreSnapshot[];
  appHistory: AppStoreSnapshot[];
  brandColor?: string;
}

export function RatingHistoryChart({ playHistory, appHistory, brandColor }: Props) {
  const { t } = useT();

  // Merge data by date
  const dateMap = new Map<string, { date: string; play_rating?: number; app_rating?: number }>();

  playHistory.forEach((s) => {
    const key = s.scraped_at;
    const existing = dateMap.get(key) || { date: key };
    existing.play_rating = s.rating ? Number(s.rating) : undefined;
    dateMap.set(key, existing);
  });

  appHistory.forEach((s) => {
    const key = s.scraped_at;
    const existing = dateMap.get(key) || { date: key };
    existing.app_rating = s.rating ? Number(s.rating) : undefined;
    dateMap.set(key, existing);
  });

  const data = Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));

  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('company.noRatingHistory')}</p>;
  }

  const playColor = brandColor ?? 'hsl(160 60% 45%)';
  const appColor = brandColor ? `${brandColor}99` : 'hsl(220 70% 50%)';

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-medium mb-4">{t('company.ratingHistory')}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--card-foreground))',
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="play_rating" name="Play Store" stroke={playColor} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="app_rating" name="App Store" stroke={appColor} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
