'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useT } from '@/lib/i18n';
import { useCompetitorColors } from '@/hooks/useCompetitorColors';
import type { RankingEntry } from '@/types';

interface ChartProps {
  rankings: RankingEntry[];
  title?: string;
}

export function ComparisonChart({ rankings, title }: ChartProps) {
  const { t } = useT();

  const filtered = useMemo(
    () => rankings.filter((r) => r.combined_rating != null).slice(0, 15),
    [rankings]
  );

  const competitorInputs = useMemo(
    () => filtered.map((r) => ({
      id: r.competitor.id,
      name: r.competitor.name,
      icon_url: r.competitor.icon_url,
    })),
    [filtered]
  );

  const { colorMap } = useCompetitorColors(competitorInputs);

  const data = filtered.map((r) => ({
    name: r.competitor.name.length > 12 ? r.competitor.name.slice(0, 12) + '…' : r.competitor.name,
    fullName: r.competitor.name,
    id: r.competitor.id,
    play_store: r.play_store_rating,
    app_store: r.app_store_rating,
  }));

  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('ranking.noData')}</p>;
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-medium mb-4">{title ?? t('ranking.ratingComparison')}</h3>
      <ResponsiveContainer width="100%" height={Math.max(200, data.length * 36 + 60)}>
        <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={80} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--card-foreground))',
            }}
          />
          <Legend />
          <Bar dataKey="play_store" name="Play Store" radius={[0, 4, 4, 0]}>
            {data.map((entry) => (
              <Cell key={entry.id} fill={colorMap.get(entry.id) ?? 'hsl(160 60% 45%)'} />
            ))}
          </Bar>
          <Bar dataKey="app_store" name="App Store" radius={[0, 4, 4, 0]}>
            {data.map((entry) => {
              const color = colorMap.get(entry.id) ?? 'hsl(220 70% 50%)';
              return <Cell key={entry.id} fill={color} fillOpacity={0.6} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
