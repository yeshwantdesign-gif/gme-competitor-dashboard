import { ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { CompetitorLogo } from '@/components/shared/CompetitorLogo';
import type { NewsArticle } from '@/types';

interface NewsWithCompetitor extends NewsArticle {
  competitors?: { name: string; slug: string; icon_url?: string | null };
}

export function NewsCard({ article }: { article: NewsWithCompetitor }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="font-medium text-sm line-clamp-2">{article.title}</p>
          {article.snippet && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{article.snippet}</p>
          )}
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            {article.competitors && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5">
                <CompetitorLogo iconUrl={article.competitors.icon_url} name={article.competitors.name} size="sm" />
                {article.competitors.name}
              </span>
            )}
            {article.source && <span>{article.source}</span>}
            {article.published_at && <span>{formatDate(article.published_at)}</span>}
          </div>
        </div>
        <ExternalLink size={14} className="shrink-0 text-muted-foreground mt-1" />
      </div>
    </a>
  );
}
