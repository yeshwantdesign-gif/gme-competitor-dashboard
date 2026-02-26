import { cn } from '@/lib/utils';

export function PlatformBadge({ platform }: { platform: 'android' | 'ios' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        platform === 'android'
          ? 'bg-green-500/10 text-green-400'
          : 'bg-blue-500/10 text-blue-400'
      )}
    >
      {platform === 'android' ? 'Android' : 'iOS'}
    </span>
  );
}
