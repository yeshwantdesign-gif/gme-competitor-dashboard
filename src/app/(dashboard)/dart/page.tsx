'use client';

import { useState, useMemo } from 'react';
import { useDartFinancials, useDartCompanies } from '@/hooks/useDart';
import { DartFilters } from '@/components/dart/DartFilters';
import { RevenueChart } from '@/components/dart/RevenueChart';
import { ProfitChart } from '@/components/dart/ProfitChart';
import { EmployeeChart } from '@/components/dart/EmployeeChart';
import { GrowthTable } from '@/components/dart/GrowthTable';
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

  // Split financials into primary and secondary based on DART_COMPANIES config
  const { primaryFinancials, secondaryFinancials } = useMemo(() => {
    const primary: typeof financials = [];
    const secondary: typeof financials = [];

    for (const f of financials) {
      const isPrimary = DART_COMPANIES.some(
        (d) => d.category === 'primary' &&
               (d.searchTerms.some((term) => f.corp_name.includes(term)) ||
                (d.stockCode && d.stockCode === f.stock_code))
      );
      if (isPrimary) {
        primary.push(f);
      } else {
        secondary.push(f);
      }
    }

    return { primaryFinancials: primary, secondaryFinancials: secondary };
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

          {/* Secondary Companies Section */}
          {secondaryFinancials.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4">{t('dart.secondaryCompanies')}</h2>
              <div className="space-y-6">
                <RevenueChart financials={secondaryFinancials} />
                <ProfitChart financials={secondaryFinancials} />
                <GrowthTable financials={secondaryFinancials} />
              </div>
            </section>
          )}

          {/* Employee Trends (all companies) */}
          <section>
            <h2 className="text-lg font-semibold mb-4">{t('dart.employeeTrends')}</h2>
            <EmployeeChart financials={financials} />
          </section>
        </div>
      )}
    </div>
  );
}
