import { config } from 'dotenv';
config({ path: '.env.local' });

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  const client = await pool.connect();
  console.log('Connected to Postgres');

  try {
    // Check existing tables
    const { rows: existing } = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
    );
    console.log('Existing tables:', existing.map(r => r.table_name).join(', '));

    // Create DART tables (the ones that are missing)
    console.log('\n=== Creating dart_corp_codes ===');
    await client.query(`
      CREATE TABLE IF NOT EXISTS dart_corp_codes (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        corp_code TEXT UNIQUE NOT NULL,
        corp_name TEXT NOT NULL,
        corp_name_eng TEXT,
        stock_code TEXT,
        competitor_id UUID REFERENCES competitors(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_dart_corp_codes_stock ON dart_corp_codes(stock_code);
      CREATE INDEX IF NOT EXISTS idx_dart_corp_codes_competitor ON dart_corp_codes(competitor_id);
    `);
    console.log('Done.');

    console.log('\n=== Creating dart_financials ===');
    await client.query(`
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
      CREATE INDEX IF NOT EXISTS idx_dart_financials_corp ON dart_financials(corp_code, bsns_year DESC);
      CREATE INDEX IF NOT EXISTS idx_dart_financials_year ON dart_financials(bsns_year);
    `);
    console.log('Done.');

    // RLS + policies
    console.log('\n=== Setting up RLS and policies ===');
    for (const table of ['dart_financials', 'dart_corp_codes']) {
      await client.query(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY`);
      await client.query(`DROP POLICY IF EXISTS "Allow anon read" ON ${table}`);
      await client.query(`DROP POLICY IF EXISTS "Allow all read" ON ${table}`);
      await client.query(`DROP POLICY IF EXISTS "Allow service write" ON ${table}`);
      await client.query(`CREATE POLICY "Allow all read" ON ${table} FOR SELECT TO anon, authenticated, service_role USING (true)`);
      await client.query(`CREATE POLICY "Allow service write" ON ${table} FOR ALL TO service_role USING (true) WITH CHECK (true)`);
      await client.query(`GRANT ALL ON ${table} TO anon, authenticated, service_role, authenticator`);
    }
    console.log('Done.');

    await client.query(`NOTIFY pgrst, 'reload schema'`);

    // Final check
    const { rows: finalTables } = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
    );
    console.log('\nFinal tables:', finalTables.map(r => r.table_name).join(', '));

    // Verify dart tables
    const { rows: dartCheck } = await client.query('SELECT COUNT(*) as cnt FROM dart_financials');
    console.log('dart_financials rows:', dartCheck[0].cnt);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
