import { StarRating } from '@/components/shared/StarRating';
import { CompetitorLogo } from '@/components/shared/CompetitorLogo';
import { formatNumber } from '@/lib/utils';
import { useT } from '@/lib/i18n';
import type { CompetitorDetail } from '@/types';

export function AppInfoCard({ company }: { company: CompetitorDetail }) {
  const { t } = useT();

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-3 mb-1">
        <CompetitorLogo iconUrl={company.icon_url} name={company.name} size="lg" />
        <h3 className="font-semibold text-lg">{company.name}</h3>
      </div>
      <span className="text-xs text-muted-foreground">{company.type}</span>

      <div className="mt-4 space-y-4">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">{t('card.playStore')}</h4>
          <StarRating rating={company.play_store_rating} />
          <p className="text-xs text-muted-foreground mt-1">
            {formatNumber(company.play_store_ratings_count)} {t('company.ratings')}
            {company.play_store_downloads && ` · ${company.play_store_downloads} ${t('company.downloads')}`}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">{t('card.appStore')}</h4>
          <StarRating rating={company.app_store_rating} />
          <p className="text-xs text-muted-foreground mt-1">
            {formatNumber(company.app_store_ratings_count)} {t('company.ratings')}
          </p>
        </div>

        <div className="pt-3 border-t border-border text-sm text-muted-foreground">
          <p>{company.recent_reviews_count} {t('company.reviews30d')}</p>
          <p>{company.recent_news_count} {t('company.news30d')}</p>
        </div>
      </div>
    </div>
  );
}
