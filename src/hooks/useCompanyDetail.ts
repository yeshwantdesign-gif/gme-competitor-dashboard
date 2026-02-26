import useSWR from 'swr';
import type { CompetitorDetail } from '@/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useCompanyDetail(slug: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR<CompetitorDetail>(
    slug ? `/api/competitors/${slug}` : null,
    fetcher
  );

  return {
    company: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}
