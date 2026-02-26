'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useCompanyDetail } from '@/hooks/useCompanyDetail';
import { useCompetitorColors } from '@/hooks/useCompetitorColors';
import { RatingHistoryChart } from '@/components/company/RatingHistoryChart';
import { ReviewVolumeChart } from '@/components/company/ReviewVolumeChart';
import { AppInfoCard } from '@/components/company/AppInfoCard';
import { RecentReviewsList } from '@/components/company/RecentReviewsList';
import { CompanyNewsList } from '@/components/company/CompanyNewsList';
import { RefreshButton } from '@/components/shared/RefreshButton';
import { CompetitorLogo } from '@/components/shared/CompetitorLogo';
import { PageSkeleton } from '@/components/shared/PageSkeleton';
import { useT } from '@/lib/i18n';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CompanyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { company, isLoading, mutate } = useCompanyDetail(slug);
  const { t } = useT();

  const competitorInputs = useMemo(
    () => company ? [{ id: company.id, name: company.name, icon_url: company.icon_url }] : [],
    [company?.id, company?.name, company?.icon_url]
  );
  const { colorMap } = useCompetitorColors(competitorInputs);
  const brandColor = company ? colorMap.get(company.id) : undefined;

  if (isLoading) return <PageSkeleton />;
  if (!company) return <p className="text-muted-foreground">{t('company.notFound')}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/overview" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <CompetitorLogo iconUrl={company.icon_url} name={company.name} size="lg" />
          <h1 className="text-2xl font-bold">{company.name}</h1>
        </div>
        <RefreshButton onRefresh={() => mutate()} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AppInfoCard company={company} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <RatingHistoryChart
            playHistory={company.play_store_history}
            appHistory={company.app_store_history}
            brandColor={brandColor}
          />
          <ReviewVolumeChart reviews={company.recent_reviews} brandColor={brandColor} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentReviewsList reviews={company.recent_reviews} />
        <CompanyNewsList articles={company.recent_news} />
      </div>
    </div>
  );
}
