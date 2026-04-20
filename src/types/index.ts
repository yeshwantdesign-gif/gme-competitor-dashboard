export interface Competitor {
  id: string;
  slug: string;
  name: string;
  type: string;
  play_store_id: string | null;
  app_store_id: string | null;
  app_store_name: string | null;
  website: string | null;
  logo_url: string | null;
  icon_url: string | null;
  created_at: string;
}

export interface PlayStoreSnapshot {
  id: string;
  competitor_id: string;
  scraped_at: string;
  rating: number | null;
  ratings_count: number | null;
  reviews_count: number | null;
  downloads: string | null;
  version: string | null;
}

export interface AppStoreSnapshot {
  id: string;
  competitor_id: string;
  scraped_at: string;
  rating: number | null;
  ratings_count: number | null;
  reviews_count: number | null;
  version: string | null;
}

export interface Review {
  id: string;
  competitor_id: string;
  store: 'android' | 'ios';
  score: number | null;
  text: string | null;
  review_date: string | null;
  scraped_at: string;
  competitors?: { name: string; slug: string; icon_url?: string | null };
}

export interface NewsArticle {
  id: string;
  competitor_id: string;
  title: string;
  url: string;
  source: string | null;
  published_at: string | null;
  snippet: string | null;
  competitors?: { name: string; slug: string; icon_url?: string | null };
}

export interface ScrapeRun {
  id: string;
  scraper_type: string;
  status: string;
  started_at: string;
  finished_at: string | null;
  competitors_processed: number;
  errors: string[] | null;
}

export interface CompetitorSummary {
  id: string;
  slug: string;
  name: string;
  type: string;
  icon_url?: string | null;
  play_store_rating: number | null;
  play_store_ratings_count: number | null;
  play_store_downloads: string | null;
  app_store_rating: number | null;
  app_store_ratings_count: number | null;
  recent_reviews_count: number;
  recent_news_count: number;
}

export interface CompetitorDetail extends CompetitorSummary {
  play_store_history: PlayStoreSnapshot[];
  app_store_history: AppStoreSnapshot[];
  recent_reviews: Review[];
  recent_news: NewsArticle[];
}

export interface RankingEntry {
  rank: number;
  competitor: Competitor;
  play_store_rating: number | null;
  app_store_rating: number | null;
  combined_rating: number | null;
  total_ratings: number | null;
  play_store_downloads: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ReviewFilters {
  competitor_ids?: string[];
  store?: 'android' | 'ios';
  min_score?: number;
  max_score?: number;
  page?: number;
  pageSize?: number;
}

export interface NewsFilters {
  competitor_ids?: string[];
  date_from?: string;
  date_to?: string;
  page?: number;
  pageSize?: number;
}

export interface AppUpdate {
  id: string;
  competitor_id: string;
  store: 'android' | 'ios';
  version: string;
  release_date: string | null;
  release_notes: string | null;
  scraped_at: string;
  competitors?: { name: string; slug: string; icon_url?: string | null };
}

export interface UpdateFilters {
  competitor_ids?: string[];
  page?: number;
  pageSize?: number;
}

export interface DartFinancial {
  id: string;
  corp_code: string;
  corp_name: string;
  stock_code: string | null;
  bsns_year: number;
  reprt_code: string;
  fs_div: string;
  revenue: number | null;
  operating_profit: number | null;
  net_income: number | null;
  total_assets: number | null;
  total_liabilities: number | null;
  total_equity: number | null;
  employee_count: number | null;
  fetched_at: string;
}

export interface DartCorpCode {
  id: string;
  corp_code: string;
  corp_name: string;
  corp_name_eng: string | null;
  stock_code: string | null;
  competitor_id: string | null;
  created_at: string;
}

export type RankingSortBy = 'play_store_rating' | 'app_store_rating' | 'combined_rating' | 'total_ratings' | 'play_store_downloads';

export interface OverviewCompetitor {
  id: string;
  slug: string;
  name: string;
  type: string;
  icon_url?: string | null;
  play_store_rating: number | null;
  play_store_ratings_count: number | null;
  play_store_downloads: string | null;
  prev_play_store_downloads: string | null;
  app_store_rating: number | null;
  app_store_ratings_count: number | null;
  app_updates_this_week: number;
  news_this_week: number;
}

export interface OverviewHighlights {
  updates: (AppUpdate & { competitors: { name: string; slug: string; icon_url?: string | null } })[];
  news: (NewsArticle & { competitors: { name: string; slug: string; icon_url?: string | null } })[];
  reviews: (Review & { competitors: { name: string; slug: string; icon_url?: string | null } })[];
}

export interface OverviewData {
  competitors: OverviewCompetitor[];
  highlights: OverviewHighlights;
}
