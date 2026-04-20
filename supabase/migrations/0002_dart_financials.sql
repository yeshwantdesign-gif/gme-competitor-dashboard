-- DART Financial data table
CREATE TABLE IF NOT EXISTS dart_financials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  corp_code TEXT NOT NULL,
  corp_name TEXT NOT NULL,
  stock_code TEXT,
  bsns_year INTEGER NOT NULL,
  reprt_code TEXT NOT NULL,
  fs_div TEXT NOT NULL DEFAULT 'OFS',
  revenue BIGINT,
  operating_profit BIGINT,
  net_income BIGINT,
  total_assets BIGINT,
  total_liabilities BIGINT,
  total_equity BIGINT,
  employee_count INTEGER,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(corp_code, bsns_year, reprt_code, fs_div)
);

-- DART corp code mapping table
CREATE TABLE IF NOT EXISTS dart_corp_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  corp_code TEXT UNIQUE NOT NULL,
  corp_name TEXT NOT NULL,
  corp_name_eng TEXT,
  stock_code TEXT,
  competitor_id UUID REFERENCES competitors(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_dart_financials_corp ON dart_financials(corp_code, bsns_year DESC);
CREATE INDEX IF NOT EXISTS idx_dart_financials_year ON dart_financials(bsns_year);
CREATE INDEX IF NOT EXISTS idx_dart_corp_codes_stock ON dart_corp_codes(stock_code);
CREATE INDEX IF NOT EXISTS idx_dart_corp_codes_competitor ON dart_corp_codes(competitor_id);

-- RLS
ALTER TABLE dart_financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE dart_corp_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon read" ON dart_financials FOR SELECT USING (true);
CREATE POLICY "Allow anon read" ON dart_corp_codes FOR SELECT USING (true);
