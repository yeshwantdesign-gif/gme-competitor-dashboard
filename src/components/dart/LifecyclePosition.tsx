'use client';

import { useT } from '@/lib/i18n';

const PHASES = [
  {
    name: 'E9Pay',
    descKey: 'dart.lifecycle.e9pay',
    phase: 4,
    hex: '#F59E0B',
    phaseLabel: 'Maturity',
  },
  {
    name: 'GMoney',
    descKey: 'dart.lifecycle.gmoney',
    phase: 3.5,
    hex: '#10B981',
    phaseLabel: 'Deceleration',
  },
  {
    name: 'Hanpass',
    descKey: 'dart.lifecycle.hanpass',
    phase: 2.5,
    hex: '#1E3A8A',
    phaseLabel: 'Rapid Growth',
  },
  {
    name: 'GME',
    descKey: 'dart.lifecycle.gme',
    phase: 2.5,
    hex: '#EF4444',
    phaseLabel: 'Rapid Growth',
  },
  {
    name: 'SentBe',
    descKey: 'dart.lifecycle.sentbe',
    phase: 1.5,
    hex: '#38BDF8',
    phaseLabel: 'Restructuring',
  },
];

const LIFECYCLE_STAGES = ['Startup', 'Growth', 'Rapid Growth', 'Deceleration', 'Maturity'];

export function LifecyclePosition() {
  const { t } = useT();

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="mb-5 text-base font-semibold">{t('dart.lifecyclePosition')}</h3>

      {/* Stage bar */}
      <div className="mb-6">
        <div className="flex mb-1">
          {LIFECYCLE_STAGES.map((stage) => (
            <div key={stage} className="flex-1 text-center text-[10px] text-muted-foreground">
              {stage}
            </div>
          ))}
        </div>
        <div className="relative h-3 rounded-full bg-gradient-to-r from-red-500/30 via-yellow-500/30 to-green-500/30">
          {PHASES.map((company) => {
            const pct = ((company.phase - 0.5) / 4.5) * 100;
            return (
              <div
                key={company.name}
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-card"
                style={{ left: `${pct}%`, transform: 'translate(-50%, -50%)', backgroundColor: company.hex }}
                title={company.name}
              />
            );
          })}
        </div>
      </div>

      {/* Company cards */}
      <div className="space-y-3">
        {PHASES.map((company) => (
          <div key={company.name} className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: company.hex }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{company.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  {company.phaseLabel}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{t(company.descKey)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
