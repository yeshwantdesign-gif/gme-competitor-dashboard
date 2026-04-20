import useSWR from 'swr';
import type { DartFinancial, DartCorpCode } from '@/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useDartFinancials(params: {
  corp_codes?: string[];
  year_from?: number;
  year_to?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params.corp_codes && params.corp_codes.length > 0) {
    searchParams.set('corp_codes', params.corp_codes.join(','));
  }
  if (params.year_from) searchParams.set('year_from', String(params.year_from));
  if (params.year_to) searchParams.set('year_to', String(params.year_to));

  const { data, error, isLoading, mutate } = useSWR<{ data: DartFinancial[] }>(
    `/api/dart?${searchParams.toString()}`,
    fetcher
  );

  return {
    financials: data?.data ?? [],
    isLoading,
    isError: !!error,
    mutate,
  };
}

export function useDartCompanies() {
  const { data, error, isLoading } = useSWR<{ data: DartCorpCode[] }>(
    '/api/dart/companies',
    fetcher
  );

  return {
    companies: data?.data ?? [],
    isLoading,
    isError: !!error,
  };
}
