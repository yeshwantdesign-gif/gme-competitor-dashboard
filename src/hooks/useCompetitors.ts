import useSWR from 'swr';
import type { CompetitorSummary } from '@/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useCompetitors() {
  const { data, error, isLoading, mutate } = useSWR<CompetitorSummary[]>(
    '/api/competitors',
    fetcher
  );

  return {
    competitors: data ?? [],
    isLoading,
    isError: !!error,
    mutate,
  };
}
