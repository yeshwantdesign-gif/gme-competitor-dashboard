import useSWR from 'swr';
import type { OverviewData } from '@/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useOverview() {
  const { data, error, isLoading, mutate } = useSWR<OverviewData>(
    '/api/overview',
    fetcher
  );

  return {
    data: data ?? null,
    competitors: data?.competitors ?? [],
    highlights: data?.highlights ?? { updates: [], news: [], reviews: [] },
    isLoading,
    isError: !!error,
    mutate,
  };
}
