import { ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { NewsArticle } from '@/types';

export function CompanyNewsList({ articles }: { articles: NewsArticle[] }) {
  if (articles.length === 0) {
    return <p className="text-sm text-muted-foreground">No news articles yet.</p>;
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-medium mb-4">Recent News</h3>
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {articles.map((article) => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block border-b border-border pb-3 last:border-0 hover:bg-accent/50 rounded px-2 py-1 -mx-2 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium line-clamp-2">{article.title}</p>
              <ExternalLink size={14} className="shrink-0 text-muted-foreground mt-0.5" />
            </div>
            <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
              {article.source && <span>{article.source}</span>}
              {article.published_at && <span>{formatDate(article.published_at)}</span>}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
