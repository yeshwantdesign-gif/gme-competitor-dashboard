import useSWR from 'swr';
import type { RankingEntry, RankingSortBy } from '@/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useRankings(sortBy: RankingSortBy = 'combined_rating') {
  const { data, error, isLoading, mutate } = useSWR<RankingEntry[]>(
    `/api/rankings?sort_by=${sortBy}`,
    fetcher
  );

  return {
    rankings: data ?? [],
    isLoading,
    isError: !!error,
    mutate,
  };
}
