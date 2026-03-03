import useSWR from 'swr';
import type { Review, PaginatedResponse } from '@/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useReviews(params: {
  competitor_ids?: string[];
  store?: string;
  min_score?: number;
  max_score?: number;
  page?: number;
  pageSize?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params.competitor_ids && params.competitor_ids.length > 0) {
    searchParams.set('competitor_ids', params.competitor_ids.join(','));
  }
  if (params.store) searchParams.set('store', params.store);
  if (params.min_score) searchParams.set('min_score', String(params.min_score));
  if (params.max_score) searchParams.set('max_score', String(params.max_score));
  searchParams.set('page', String(params.page ?? 1));
  searchParams.set('pageSize', String(params.pageSize ?? 20));

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Review>>(
    `/api/reviews?${searchParams.toString()}`,
    fetcher
  );

  return {
    reviews: data?.data ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    isLoading,
    isError: !!error,
    mutate,
  };
}
