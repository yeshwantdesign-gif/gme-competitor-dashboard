import useSWR from 'swr';
import type { NewsArticle, PaginatedResponse } from '@/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useNews(params: {
  competitor_ids?: string[];
  date_from?: string;
  date_to?: string;
  page?: number;
  pageSize?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params.competitor_ids && params.competitor_ids.length > 0) {
    searchParams.set('competitor_ids', params.competitor_ids.join(','));
  }
  if (params.date_from) searchParams.set('date_from', params.date_from);
  if (params.date_to) searchParams.set('date_to', params.date_to);
  searchParams.set('page', String(params.page ?? 1));
  searchParams.set('pageSize', String(params.pageSize ?? 20));

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<NewsArticle>>(
    `/api/news?${searchParams.toString()}`,
    fetcher
  );

  return {
    articles: data?.data ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    isLoading,
    isError: !!error,
    mutate,
  };
}
