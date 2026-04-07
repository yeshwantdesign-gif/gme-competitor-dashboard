'use client';

import { RefreshCw, Newspaper, MessageSquare } from 'lucide-react';
import { useT } from '@/lib/i18n';
import type { OverviewHighlights } from '@/types';

interface Props {
  highlights: OverviewHighlights;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();
}

function truncate(text: string, max: number): string {
  const clean = stripHtml(text);
  if (clean.length <= max) return clean;
  return clean.slice(0, max) + '…';
}

export function WeeklySummary({ highlights }: Props) {
  const { t } = useT();
  const { updates, news, reviews } = highlights;
  const hasContent = updates.length > 0 || news.length > 0 || reviews.length > 0;

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h2 className="text-base font-semibold mb-3">{t('overview.weeklySummary')}</h2>

      {!hasContent ? (
        <p className="text-sm text-muted-foreground">{t('overview.noHighlights')}</p>
      ) : (
        <div className="space-y-4">
          {updates.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                <RefreshCw size={12} />
                {t('overview.newAppUpdates')}
              </div>
              <ul className="space-y-1.5">
                {updates.map((u) => (
                  <li key={u.id} className="text-sm flex items-start gap-2">
                    <span className="shrink-0 inline-block rounded bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] font-medium">
                      {u.store === 'android' ? 'Android' : 'iOS'}
                    </span>
                    <span>
                      <span className="font-medium">{u.competitors.name}</span>
                      {' — v'}
                      {u.version}
                      {u.release_notes && (
                        <span className="text-muted-foreground"> — {truncate(u.release_notes, 150)}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {news.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                <Newspaper size={12} />
                {t('overview.topNews')}
              </div>
              <ul className="space-y-1.5">
                {news.map((n) => (
                  <li key={n.id} className="text-sm">
                    <span className="font-medium">{n.competitors.name}</span>
                    {' — '}
                    <a
                      href={n.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
                    >
                      {n.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {reviews.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                <MessageSquare size={12} />
                {t('overview.notableReviews')}
              </div>
              <ul className="space-y-1.5">
                {reviews.map((r) => (
                  <li key={r.id} className="text-sm">
                    <span className="font-medium">{r.competitors?.name}</span>
                    {r.score != null && (
                      <span className="text-muted-foreground"> ({r.score}★)</span>
                    )}
                    {r.text && (
                      <span className="text-muted-foreground"> — {truncate(r.text, 150)}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
