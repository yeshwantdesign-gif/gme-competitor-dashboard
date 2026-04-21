-- DART Financial Ratios table (manually sourced competitor ratio data)
CREATE TABLE IF NOT EXISTS dart_financial_ratios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competitor_name TEXT NOT NULL,
  year INTEGER NOT NULL,
  operating_margin DOUBLE PRECISION,
  net_margin DOUBLE PRECISION,
  revenue_growth DOUBLE PRECISION,
  debt_to_equity DOUBLE PRECISION,
  asset_turnover DOUBLE PRECISION,
  roe DOUBLE PRECISION,
  roa DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(competitor_name, year)
);

CREATE INDEX IF NOT EXISTS idx_dart_ratios_company ON dart_financial_ratios(competitor_name, year DESC);

ALTER TABLE dart_financial_ratios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon read" ON dart_financial_ratios FOR SELECT USING (true);
