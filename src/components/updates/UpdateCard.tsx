import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { CompetitorLogo } from '@/components/shared/CompetitorLogo';
import type { AppUpdate } from '@/types';

export function UpdateCard({ update }: { update: AppUpdate }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {update.competitors && (
              <>
                <CompetitorLogo iconUrl={update.competitors.icon_url} name={update.competitors.name} size="sm" />
                <span className="font-medium text-sm">{update.competitors.name}</span>
              </>
            )}
            <Badge variant={update.store === 'ios' ? 'default' : 'secondary'}>
              {update.store === 'ios' ? 'iOS' : 'Android'}
            </Badge>
          </div>

          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span className="font-mono">v{update.version}</span>
            {update.release_date && (
              <>
                <span>&middot;</span>
                <span>{formatDate(update.release_date)}</span>
              </>
            )}
          </div>

          {update.release_notes && (
            <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line line-clamp-4">
              {update.release_notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
