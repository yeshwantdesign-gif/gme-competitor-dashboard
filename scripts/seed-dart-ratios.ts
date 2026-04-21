/**
 * Create dart_financial_ratios table and seed ratio data for 5 primary competitors.
 */
import { config } from 'dotenv';
config({ path: '.env.local' });

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
});

interface RatioYear {
  year: number;
  operating_margin: number | null;
  net_margin: number | null;
  revenue_growth: number | null;
  debt_to_equity: number | null;
  asset_turnover: number | null;
  roe: number | null;
  roa: number | null;
}

interface CompanyRatios {
  name: string;
  years: RatioYear[];
}

const COMPANIES: CompanyRatios[] = [
  {
    name: 'E9Pay',
    years: [
      { year: 2020, operating_margin: 18.9, net_margin: 11.9, revenue_growth: 62.4, debt_to_equity: 173.7, asset_turnover: 1.12, roe: 36.4, roa: 13.3 },
      { year: 2021, operating_margin: 31.0, net_margin: 28.9, revenue_growth: 51.4, debt_to_equity: 121.2, asset_turnover: 0.90, roe: 57.4, roa: 25.9 },
      { year: 2022, operating_margin: 24.7, net_margin: 18.6, revenue_growth: 39.0, debt_to_equity: 75.6, asset_turnover: 1.04, roe: 33.9, roa: 19.3 },
      { year: 2023, operating_margin: 36.6, net_margin: 29.3, revenue_growth: 41.4, debt_to_equity: 62.5, asset_turnover: 0.90, roe: 43.0, roa: 26.5 },
      { year: 2024, operating_margin: 39.7, net_margin: 31.2, revenue_growth: 18.1, debt_to_equity: 13.2, asset_turnover: 0.98, roe: 34.6, roa: 30.6 },
      { year: 2025, operating_margin: 36.7, net_margin: 30.3, revenue_growth: 14.8, debt_to_equity: 8.9, asset_turnover: 0.74, roe: 24.5, roa: 22.5 },
    ],
  },
  {
    name: 'GMoney Transfer',
    years: [
      { year: 2022, operating_margin: 21.1, net_margin: 18.1, revenue_growth: null, debt_to_equity: 167.0, asset_turnover: 0.82, roe: 39.6, roa: 14.8 },
      { year: 2023, operating_margin: 34.0, net_margin: 32.5, revenue_growth: 112.0, debt_to_equity: 199.0, asset_turnover: 0.62, roe: 60.2, roa: 20.2 },
      { year: 2024, operating_margin: 29.0, net_margin: 23.8, revenue_growth: 36.0, debt_to_equity: 102.0, asset_turnover: 0.78, roe: 37.5, roa: 18.6 },
      { year: 2025, operating_margin: 20.4, net_margin: 17.3, revenue_growth: -5.5, debt_to_equity: 59.0, asset_turnover: 0.73, roe: 20.1, roa: 12.6 },
    ],
  },
  {
    name: 'Hanpass',
    years: [
      { year: 2021, operating_margin: -4.6, net_margin: -6.2, revenue_growth: null, debt_to_equity: 748.0, asset_turnover: 0.92, roe: -48.0, roa: -5.7 },
      { year: 2022, operating_margin: 5.4, net_margin: 4.2, revenue_growth: 22.9, debt_to_equity: 565.7, asset_turnover: 1.03, roe: 28.6, roa: 4.3 },
      { year: 2023, operating_margin: 7.2, net_margin: -31.4, revenue_growth: 21.1, debt_to_equity: 1171.4, asset_turnover: 0.65, roe: -260.0, roa: -20.4 },
      { year: 2024, operating_margin: 9.4, net_margin: 8.0, revenue_growth: 90.6, debt_to_equity: 271.2, asset_turnover: 0.69, roe: 20.5, roa: 5.5 },
      { year: 2025, operating_margin: 12.4, net_margin: 9.9, revenue_growth: 20.2, debt_to_equity: 332.5, asset_turnover: 0.54, roe: 23.3, roa: 5.4 },
    ],
  },
  {
    name: 'GME Remittance',
    years: [
      { year: 2021, operating_margin: 14.2, net_margin: 13.7, revenue_growth: null, debt_to_equity: 273.0, asset_turnover: 0.77, roe: 39.6, roa: 10.6 },
      { year: 2022, operating_margin: 15.5, net_margin: 13.1, revenue_growth: 31.8, debt_to_equity: 312.0, asset_turnover: 0.76, roe: 41.2, roa: 10.0 },
      { year: 2023, operating_margin: 19.6, net_margin: 16.9, revenue_growth: 22.2, debt_to_equity: 325.0, asset_turnover: 0.64, roe: 46.0, roa: 10.8 },
      { year: 2024, operating_margin: 12.5, net_margin: 12.6, revenue_growth: 23.7, debt_to_equity: 391.0, asset_turnover: 0.63, roe: 39.1, roa: 8.0 },
      { year: 2025, operating_margin: 11.9, net_margin: 13.3, revenue_growth: 26.0, debt_to_equity: 474.0, asset_turnover: 0.52, roe: 39.7, roa: 6.9 },
    ],
  },
  {
    name: 'SentBe',
    years: [
      { year: 2022, operating_margin: -48.5, net_margin: -48.1, revenue_growth: null, debt_to_equity: 160.0, asset_turnover: 0.67, roe: -83.9, roa: -32.2 },
      { year: 2023, operating_margin: -4.3, net_margin: -3.5, revenue_growth: 51.7, debt_to_equity: 234.0, asset_turnover: 0.87, roe: -10.3, roa: -3.1 },
      { year: 2024, operating_margin: -1.6, net_margin: -1.3, revenue_growth: -9.2, debt_to_equity: 84.0, asset_turnover: 1.46, roe: -3.6, roa: -1.9 },
      { year: 2025, operating_margin: -3.8, net_margin: -4.1, revenue_growth: 3.2, debt_to_equity: 78.0, asset_turnover: 1.01, roe: -7.4, roa: -4.1 },
    ],
  },
];

async function main() {
  const client = await pool.connect();
  console.log('Connected to Postgres\n');

  try {
    // Create table
    console.log('Creating dart_financial_ratios table...');
    await client.query(`
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
    `);

    // RLS
    await client.query(`ALTER TABLE dart_financial_ratios ENABLE ROW LEVEL SECURITY`);
    await client.query(`DROP POLICY IF EXISTS "Allow anon read" ON dart_financial_ratios`);
    await client.query(`DROP POLICY IF EXISTS "Allow all read" ON dart_financial_ratios`);
    await client.query(`DROP POLICY IF EXISTS "Allow service write" ON dart_financial_ratios`);
    await client.query(`CREATE POLICY "Allow all read" ON dart_financial_ratios FOR SELECT TO anon, authenticated, service_role USING (true)`);
    await client.query(`CREATE POLICY "Allow service write" ON dart_financial_ratios FOR ALL TO service_role USING (true) WITH CHECK (true)`);
    await client.query(`GRANT ALL ON dart_financial_ratios TO anon, authenticated, service_role, authenticator`);
    console.log('Table created with RLS.\n');

    // Seed data
    let total = 0;
    for (const company of COMPANIES) {
      console.log(`  Seeding ${company.name}...`);
      for (const y of company.years) {
        await client.query(`
          INSERT INTO dart_financial_ratios (competitor_name, year, operating_margin, net_margin, revenue_growth, debt_to_equity, asset_turnover, roe, roa)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (competitor_name, year) DO UPDATE SET
            operating_margin = $3, net_margin = $4, revenue_growth = $5,
            debt_to_equity = $6, asset_turnover = $7, roe = $8, roa = $9
        `, [company.name, y.year, y.operating_margin, y.net_margin, y.revenue_growth, y.debt_to_equity, y.asset_turnover, y.roe, y.roa]);
        total++;
      }
      console.log(`    ${company.years.length} years seeded`);
    }

    await client.query(`NOTIFY pgrst, 'reload schema'`);

    const { rows } = await client.query('SELECT COUNT(*) as cnt FROM dart_financial_ratios');
    console.log(`\nDone! Seeded ${total} records. Total in table: ${rows[0].cnt}`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
