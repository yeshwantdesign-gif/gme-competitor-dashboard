-- Competitors table
CREATE TABLE IF NOT EXISTS competitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'KR',
  play_store_id TEXT,
  app_store_id TEXT,
  news_keywords TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Play Store snapshots
CREATE TABLE IF NOT EXISTS play_store_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competitor_id UUID NOT NULL REFERENCES competitors(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  rating NUMERIC(3,2),
  ratings_count INTEGER,
  reviews_count INTEGER,
  installs TEXT,
  version TEXT,
  updated TEXT,
  genre TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(competitor_id, snapshot_date)
);

-- App Store snapshots
CREATE TABLE IF NOT EXISTS app_store_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competitor_id UUID NOT NULL REFERENCES competitors(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  rating NUMERIC(3,2),
  ratings_count INTEGER,
  reviews_count INTEGER,
  version TEXT,
  updated TEXT,
  genre TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(competitor_id, snapshot_date)
);

-- Reviews (both platforms)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competitor_id UUID NOT NULL REFERENCES competitors(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('android', 'ios')),
  platform_review_id TEXT NOT NULL,
  author TEXT,
  score INTEGER,
  title TEXT,
  text TEXT,
  review_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(platform, platform_review_id)
);

-- News articles
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competitor_id UUID NOT NULL REFERENCES competitors(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  url_hash TEXT UNIQUE NOT NULL,
  source TEXT,
  published_at TIMESTAMPTZ,
  snippet TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scrape runs
CREATE TABLE IF NOT EXISTS scrape_runs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scraper_type TEXT NOT NULL CHECK (scraper_type IN ('play_store', 'app_store', 'news', 'all')),
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  competitors_processed INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]'
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_play_store_snapshots_competitor ON play_store_snapshots(competitor_id, snapshot_date DESC);
CREATE INDEX IF NOT EXISTS idx_app_store_snapshots_competitor ON app_store_snapshots(competitor_id, snapshot_date DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_competitor ON reviews(competitor_id, review_date DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_platform ON reviews(platform);
CREATE INDEX IF NOT EXISTS idx_news_articles_competitor ON news_articles(competitor_id, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_url_hash ON news_articles(url_hash);
CREATE INDEX IF NOT EXISTS idx_scrape_runs_type ON scrape_runs(scraper_type, started_at DESC);

-- RLS policies (enable read for anon, write for service_role)
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE play_store_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_store_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scrape_runs ENABLE ROW LEVEL SECURITY;

-- Anon read policies
CREATE POLICY "Allow anon read" ON competitors FOR SELECT USING (true);
CREATE POLICY "Allow anon read" ON play_store_snapshots FOR SELECT USING (true);
CREATE POLICY "Allow anon read" ON app_store_snapshots FOR SELECT USING (true);
CREATE POLICY "Allow anon read" ON reviews FOR SELECT USING (true);
CREATE POLICY "Allow anon read" ON news_articles FOR SELECT USING (true);
CREATE POLICY "Allow anon read" ON scrape_runs FOR SELECT USING (true);

-- Service role full access (service_role bypasses RLS by default)
