'use client';

import { useT } from '@/lib/i18n';

const CARDS = [
  {
    titleKey: 'dart.action.profitability.title',
    priorityKey: 'dart.action.profitability.priority',
    bodyKey: 'dart.action.profitability.body',
    color: 'border-red-500/50 bg-red-500/5',
    priorityColor: 'bg-red-500/20 text-red-400',
    icon: '!',
  },
  {
    titleKey: 'dart.action.leverage.title',
    priorityKey: 'dart.action.leverage.priority',
    bodyKey: 'dart.action.leverage.body',
    color: 'border-orange-500/50 bg-orange-500/5',
    priorityColor: 'bg-orange-500/20 text-orange-400',
    icon: '!',
  },
  {
    titleKey: 'dart.action.growth.title',
    priorityKey: 'dart.action.growth.priority',
    bodyKey: 'dart.action.growth.body',
    color: 'border-green-500/50 bg-green-500/5',
    priorityColor: 'bg-green-500/20 text-green-400',
    icon: '+',
  },
  {
    titleKey: 'dart.action.efficiency.title',
    priorityKey: 'dart.action.efficiency.priority',
    bodyKey: 'dart.action.efficiency.body',
    color: 'border-yellow-500/50 bg-yellow-500/5',
    priorityColor: 'bg-yellow-500/20 text-yellow-400',
    icon: '~',
  },
];

export function ActionPlanCards() {
  const { t } = useT();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {CARDS.map((card) => (
        <div key={card.titleKey} className={`rounded-lg border-2 p-5 ${card.color}`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-base">{t(card.titleKey)}</h4>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${card.priorityColor}`}>
              {t(card.priorityKey)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t(card.bodyKey)}
          </p>
        </div>
      ))}
    </div>
  );
}
