'use client';

import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useT } from '@/lib/i18n';

export function RefreshButton({ onRefresh }: { onRefresh: () => void }) {
  const [spinning, setSpinning] = useState(false);
  const { t } = useT();

  const handleClick = () => {
    setSpinning(true);
    onRefresh();
    setTimeout(() => setSpinning(false), 1000);
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-accent transition-colors"
    >
      <RefreshCw size={16} className={cn(spinning && 'animate-spin')} />
      {t('shared.refresh')}
    </button>
  );
}
