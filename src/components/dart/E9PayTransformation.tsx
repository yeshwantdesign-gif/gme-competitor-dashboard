'use client';

import { useT } from '@/lib/i18n';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';

export function E9PayTransformation() {
  const { t } = useT();

  return (
    <div className="rounded-lg border-2 border-emerald-500/30 bg-emerald-500/5 p-5">
      <h3 className="text-base font-semibold mb-4 text-emerald-500">
        {t('dart.e9pay.title')}
      </h3>

      {/* Timeline */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center">
          <div className="text-xs text-muted-foreground mb-1">2019</div>
          <div className="text-sm font-bold text-red-400">{t('dart.e9pay.2019loss')}</div>
          <div className="text-xs text-muted-foreground mt-1">{t('dart.e9pay.2019debt')}</div>
        </div>

        <div className="flex flex-col items-center gap-1 text-muted-foreground">
          <div className="w-8 border-t-2 border-dashed border-emerald-500/50" />
          <span className="text-[10px]">6 {t('dart.e9pay.years')}</span>
          <div className="w-8 border-t-2 border-dashed border-emerald-500/50" />
        </div>

        <div className="flex-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-center">
          <div className="text-xs text-muted-foreground mb-1">2025</div>
          <div className="text-sm font-bold text-emerald-400">{t('dart.e9pay.2025profit')}</div>
          <div className="text-xs text-muted-foreground mt-1">{t('dart.e9pay.2025debt')}</div>
        </div>
      </div>

      {/* Three takeaway boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-lg bg-card border border-border p-3">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-semibold">{t('dart.e9pay.takeaway1.title')}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t('dart.e9pay.takeaway1.body')}
          </p>
        </div>

        <div className="rounded-lg bg-card border border-border p-3">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-semibold">{t('dart.e9pay.takeaway2.title')}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t('dart.e9pay.takeaway2.body')}
          </p>
        </div>

        <div className="rounded-lg bg-card border border-border p-3">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-semibold">{t('dart.e9pay.takeaway3.title')}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t('dart.e9pay.takeaway3.body')}
          </p>
        </div>
      </div>
    </div>
  );
}
