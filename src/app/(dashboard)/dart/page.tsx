'use client';

import { useState, useMemo } from 'react';
import { useDartFinancials, useDartCompanies, useDartRatios } from '@/hooks/useDart';
import { DartFilters } from '@/components/dart/DartFilters';
import { RevenueChart } from '@/components/dart/RevenueChart';
import { ProfitChart } from '@/components/dart/ProfitChart';
import { EmployeeChart } from '@/components/dart/EmployeeChart';
import { GrowthTable } from '@/components/dart/GrowthTable';
import { CompetitiveComparison } from '@/components/dart/CompetitiveComparison';
import { RatioCharts } from '@/components/dart/RatioCharts';
import { ActionPlanCards } from '@/components/dart/ActionPlanCards';
import { LifecyclePosition } from '@/components/dart/LifecyclePosition';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageSkeleton } from '@/components/shared/PageSkeleton';
import { RefreshButton } from '@/components/shared/RefreshButton';
import { useT } from '@/lib/i18n';
import { DART_COMPANIES } from '@/lib/dart/config';

export default function DartPage() {
  const [selectedCorpCodes, setSelectedCorpCodes] = useState<string[]>([]);
  const { t } = useT();

  const { companies } = useDartCompanies();
  const { financials, isLoading, mutate } = useDartFinancials({
    corp_codes: selectedCorpCodes.length > 0 ? selectedCorpCodes : undefined,
  });
  const { ratios, isLoading: ratiosLoading } = useDartRatios();

  // Filter to primary competitors only
  const primaryFinancials = useMemo(() => {
    return financials.filter((f) =>
      DART_COMPANIES.some(
        (d) => d.category === 'primary' &&
               (d.searchTerms.some((term) => f.corp_name.includes(term)) ||
                (d.stockCode && d.stockCode === f.stock_code))
      )
    );
  }, [financials]);

  function handleRefresh() {
    fetch('/api/dart/scrape', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || ''}` },
    }).then(() => mutate());
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('page.dart')}</h1>
        <RefreshButton onRefresh={handleRefresh} />
      </div>

      <DartFilters
        companies={companies}
        selectedCorpCodes={selectedCorpCodes}
        onCorpCodeChange={setSelectedCorpCodes}
      />

      {isLoading ? (
        <PageSkeleton />
      ) : financials.length === 0 ? (
        <EmptyState message={t('dart.noData')} />
      ) : (
        <div className="space-y-8">
          {/* Primary Competitors Section */}
          {primaryFinancials.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4">{t('dart.primaryCompetitors')}</h2>
              <div className="space-y-6">
                <RevenueChart financials={primaryFinancials} />
                <ProfitChart financials={primaryFinancials} />
                <GrowthTable financials={primaryFinancials} />
              </div>
            </section>
          )}

          {/* Employee Trends (primary competitors) */}
          <section>
            <h2 className="text-lg font-semibold mb-4">{t('dart.employeeTrends')}</h2>
            <EmployeeChart financials={primaryFinancials} />
          </section>

          {/* Action Plan & Strategic Analysis */}
          {!ratiosLoading && ratios.length > 0 && (
            <>
              <hr className="border-border" />
              <section>
                <h2 className="text-xl font-bold mb-6">{t('dart.actionPlan')}</h2>
                <div className="space-y-8">
                  {/* Section A: Competitive Comparison Table */}
                  <CompetitiveComparison ratios={ratios} financials={primaryFinancials} />

                  {/* Section B: Ratio Trend Charts */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">{t('dart.ratioTrends')}</h3>
                    <RatioCharts ratios={ratios} />
                  </div>

                  {/* Section C: GME Action Plan */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">{t('dart.gmeActionPlan')}</h3>
                    <ActionPlanCards />
                  </div>

                  {/* Section D: Company Lifecycle Position */}
                  <LifecyclePosition />
                </div>
              </section>
            </>
          )}
        </div>
      )}
    </div>
  );
}
