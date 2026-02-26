import useSWR from 'swr';
import type { AppUpdate, PaginatedResponse } from '@/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useUpdates(params: {
  competitor_id?: string;
  store?: string;
  page?: number;
  pageSize?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params.competitor_id) searchParams.set('competitor_id', params.competitor_id);
  if (params.store) searchParams.set('store', params.store);
  searchParams.set('page', String(params.page ?? 1));
  searchParams.set('pageSize', String(params.pageSize ?? 20));

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<AppUpdate>>(
    `/api/updates?${searchParams.toString()}`,
    fetcher
  );

  return {
    updates: data?.data ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    isLoading,
    isError: !!error,
    mutate,
  };
}
