'use client';

import { useT } from '@/lib/i18n';
import type { AppUpdate } from '@/types';

const GME_NAME = 'GME Remittance';

interface LatestUpdate {
  name: string;
  store: 'android' | 'ios';
  daysSince: number;
  version: string;
}

export function DaysSinceUpdateCards({ updates }: { updates: AppUpdate[] }) {
  const { t } = useT();

  // Find the latest update per competitor+store
  const latestMap = new Map<string, AppUpdate>();
  updates.forEach((u) => {
    const key = `${u.competitor_id}-${u.store}`;
    const existing = latestMap.get(key);
    const uDate = u.release_date || u.scraped_at;
    const eDate = existing ? (existing.release_date || existing.scraped_at) : null;
    if (!existing || (uDate && eDate && uDate > eDate)) {
      latestMap.set(key, u);
    }
  });

  const now = Date.now();
  const entries: LatestUpdate[] = Array.from(latestMap.values())
    .map((u) => {
      const dateStr = u.release_date || u.scraped_at;
      const daysSince = dateStr
        ? Math.floor((now - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24))
        : 999;
      return {
        name: u.competitors?.name ?? 'Unknown',
        store: u.store,
        daysSince,
        version: u.version,
      };
    })
    .sort((a, b) => {
      // GME Remittance always first
      if (a.name === GME_NAME && b.name !== GME_NAME) return -1;
      if (b.name === GME_NAME && a.name !== GME_NAME) return 1;
      return a.daysSince - b.daysSince;
    });

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {entries.map((entry) => {
        const isGme = entry.name === GME_NAME;
        return (
          <div
            key={`${entry.name}-${entry.store}`}
            className={`rounded-lg border p-3 text-center ${
              isGme
                ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                : 'border-border bg-card'
            }`}
          >
            <div className="flex items-center justify-center gap-1">
              <p className={`text-xs truncate ${isGme ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
                {entry.name}
              </p>
              {isGme && (
                <span className="shrink-0 text-[10px] font-semibold bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                  GME
                </span>
              )}
            </div>
            <p className={`text-2xl font-bold mt-1 ${isGme ? 'text-primary' : ''}`}>{entry.daysSince}</p>
            <p className="text-xs text-muted-foreground">{t('updates.daysAgo')}</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <span className="text-xs font-mono text-muted-foreground">v{entry.version}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded ${
                  entry.store === 'ios'
                    ? 'bg-primary/20 text-primary'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {entry.store === 'ios' ? 'iOS' : 'Android'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
