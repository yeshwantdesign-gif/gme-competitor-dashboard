'use client';

import { useState } from 'react';
import { hashColor } from '@/lib/colors';

interface Props {
  iconUrl: string | null | undefined;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 20,
  md: 28,
  lg: 40,
};

export function CompetitorLogo({ iconUrl, name, size = 'md' }: Props) {
  const [error, setError] = useState(false);
  const px = sizes[size];
  const textSize = size === 'lg' ? 'text-base' : size === 'md' ? 'text-xs' : 'text-[10px]';

  if (!iconUrl || error) {
    const bg = hashColor(name);
    return (
      <div
        className={`flex-shrink-0 rounded-full flex items-center justify-center font-semibold text-white ${textSize}`}
        style={{ width: px, height: px, backgroundColor: bg }}
      >
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={iconUrl}
      alt={`${name} logo`}
      className="flex-shrink-0 rounded-full object-cover"
      style={{ width: px, height: px }}
      onError={() => setError(true)}
    />
  );
}
