'use client';

import { useT } from '@/lib/i18n';
import { TrendingDown, Zap } from 'lucide-react';

export function GMoneyOpportunity() {
  const { t } = useT();

  return (
    <div className="rounded-lg border-2 border-amber-500/30 bg-amber-500/5 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-amber-500" />
        <h3 className="text-base font-semibold text-amber-500">
          {t('dart.gmoney.title')}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Decline stat */}
        <div className="rounded-lg bg-card border border-border p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingDown className="h-4 w-4 text-red-500" />
            <span className="text-2xl font-bold text-red-500">-5.5%</span>
          </div>
          <div className="text-xs text-muted-foreground">{t('dart.gmoney.decline')}</div>
        </div>

        {/* Lost revenue */}
        <div className="rounded-lg bg-card border border-border p-4 text-center">
          <div className="text-2xl font-bold text-red-500 mb-1">~₩2.87B</div>
          <div className="text-xs text-muted-foreground">{t('dart.gmoney.lostRevenue')}</div>
        </div>

        {/* GME opportunity */}
        <div className="rounded-lg bg-card border border-emerald-500/30 p-4 text-center">
          <div className="text-2xl font-bold text-emerald-500 mb-1">+₩5B</div>
          <div className="text-xs text-muted-foreground">{t('dart.gmoney.opportunity')}</div>
        </div>
      </div>

      <div className="rounded-md bg-amber-500/10 border border-amber-500/20 p-3 text-sm">
        {t('dart.gmoney.insight')}
      </div>
    </div>
  );
}
