/**
 * Seed manually-sourced financial data for primary competitors into dart_financials.
 * Values provided in KRW billions — converted to raw KRW before insert.
 * Looks up corp_code from dart_corp_codes table by corp_name search.
 */
import { config } from 'dotenv';
config({ path: '.env.local' });

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
});

const B = 1_000_000_000; // 1 billion KRW

interface YearData {
  year: number;
  revenue: number;
  op_profit: number;
  net_income: number;
  assets: number;
  liabilities: number;
  equity: number;
}

interface CompanyData {
  name: string;
  searchTerm: string;
  stockCode?: string;
  years: YearData[];
}

const COMPANIES: CompanyData[] = [
  {
    name: 'SentBe',
    searchTerm: '센트비',
    years: [
      { year: 2022, revenue: 22.1, op_profit: -10.7, net_income: -10.6, assets: 33.0, liabilities: 20.3, equity: 12.7 },
      { year: 2023, revenue: 33.6, op_profit: -1.43, net_income: -1.18, assets: 38.5, liabilities: 27.0, equity: 11.5 },
      { year: 2024, revenue: 30.5, op_profit: -0.49, net_income: -0.40, assets: 20.8, liabilities: 9.5, equity: 11.3 },
      { year: 2025, revenue: 31.5, op_profit: -1.20, net_income: -1.29, assets: 31.2, liabilities: 13.7, equity: 17.5 },
    ],
  },
  {
    name: 'GMoney Transfer',
    searchTerm: '지머니트랜스',
    years: [
      { year: 2022, revenue: 18.26, op_profit: 3.85, net_income: 3.30, assets: 22.24, liabilities: 13.90, equity: 8.33 },
      { year: 2023, revenue: 38.71, op_profit: 13.17, net_income: 12.59, assets: 62.42, liabilities: 41.51, equity: 20.92 },
      { year: 2024, revenue: 52.66, op_profit: 15.28, net_income: 12.54, assets: 67.56, liabilities: 34.10, equity: 33.46 },
      { year: 2025, revenue: 49.79, op_profit: 10.18, net_income: 8.59, assets: 68.08, liabilities: 25.26, equity: 42.82 },
    ],
  },
  {
    name: 'E9Pay',
    searchTerm: '이나인페이',
    years: [
      { year: 2019, revenue: 9.88, op_profit: -1.42, net_income: -1.88, assets: 13.38, liabilities: 12.05, equity: 1.33 },
      { year: 2020, revenue: 16.05, op_profit: 3.02, net_income: 1.90, assets: 14.30, liabilities: 9.08, equity: 5.23 },
      { year: 2021, revenue: 24.29, op_profit: 7.54, net_income: 7.03, assets: 27.09, liabilities: 14.84, equity: 12.25 },
      { year: 2022, revenue: 33.76, op_profit: 8.36, net_income: 6.29, assets: 32.54, liabilities: 14.01, equity: 18.54 },
      { year: 2023, revenue: 47.71, op_profit: 17.47, net_income: 13.99, assets: 52.86, liabilities: 20.34, equity: 32.53 },
      { year: 2024, revenue: 56.35, op_profit: 22.35, net_income: 17.59, assets: 57.53, liabilities: 6.72, equity: 50.81 },
      { year: 2025, revenue: 64.71, op_profit: 23.73, net_income: 19.59, assets: 86.94, liabilities: 7.09, equity: 79.85 },
    ],
  },
  {
    name: 'Hanpass',
    searchTerm: '한패스',
    stockCode: '408470',
    years: [
      { year: 2021, revenue: 19.5, op_profit: -0.9, net_income: -1.2, assets: 21.2, liabilities: 18.7, equity: 2.5 },
      { year: 2022, revenue: 24.0, op_profit: 1.3, net_income: 1.0, assets: 23.3, liabilities: 19.8, equity: 3.5 },
      { year: 2023, revenue: 29.0, op_profit: 2.1, net_income: -9.1, assets: 44.5, liabilities: 41.0, equity: 3.5 },
      { year: 2024, revenue: 55.3, op_profit: 5.2, net_income: 4.4, assets: 79.9, liabilities: 58.3, equity: 21.5 },
      { year: 2025, revenue: 66.4, op_profit: 8.2, net_income: 6.6, assets: 122.3, liabilities: 94.1, equity: 28.3 },
    ],
  },
  {
    name: 'GME Remittance',
    searchTerm: '글로벌머니익스프레스',
    years: [
      { year: 2021, revenue: 15.02, op_profit: 2.14, net_income: 2.06, assets: 19.39, liabilities: 14.20, equity: 5.20 },
      { year: 2022, revenue: 19.80, op_profit: 3.07, net_income: 2.59, assets: 25.91, liabilities: 19.62, equity: 6.29 },
      { year: 2023, revenue: 24.19, op_profit: 4.75, net_income: 4.09, assets: 37.76, liabilities: 28.88, equity: 8.88 },
      { year: 2024, revenue: 29.93, op_profit: 3.74, net_income: 3.77, assets: 47.40, liabilities: 37.75, equity: 9.65 },
      { year: 2025, revenue: 37.73, op_profit: 4.48, net_income: 5.04, assets: 72.83, liabilities: 60.14, equity: 12.69 },
    ],
  },
];

async function main() {
  const client = await pool.connect();
  console.log('Connected to Postgres\n');

  try {
    let totalUpserted = 0;

    for (const company of COMPANIES) {
      // Look up corp_code from dart_corp_codes
      const { rows } = await client.query(
        `SELECT corp_code, corp_name, stock_code FROM dart_corp_codes
         WHERE corp_name LIKE $1 LIMIT 1`,
        [`%${company.searchTerm}%`]
      );

      if (rows.length === 0) {
        console.log(`  ✗ ${company.name}: not found in dart_corp_codes (search: ${company.searchTerm})`);
        continue;
      }

      const { corp_code, corp_name, stock_code } = rows[0];
      console.log(`  ✓ ${company.name} → ${corp_name} (${corp_code})`);

      for (const y of company.years) {
        await client.query(`
          INSERT INTO dart_financials (corp_code, corp_name, stock_code, bsns_year, reprt_code, fs_div,
            revenue, operating_profit, net_income, total_assets, total_liabilities, total_equity)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (corp_code, bsns_year, reprt_code, fs_div) DO UPDATE SET
            revenue = $7, operating_profit = $8, net_income = $9,
            total_assets = $10, total_liabilities = $11, total_equity = $12,
            fetched_at = NOW()
        `, [
          corp_code, corp_name, stock_code || null,
          y.year, '11011', 'OFS',
          Math.round(y.revenue * B),
          Math.round(y.op_profit * B),
          Math.round(y.net_income * B),
          Math.round(y.assets * B),
          Math.round(y.liabilities * B),
          Math.round(y.equity * B),
        ]);

        console.log(`    ${y.year}: revenue=${Math.round(y.revenue * B).toLocaleString()}, op_profit=${Math.round(y.op_profit * B).toLocaleString()}`);
        totalUpserted++;
      }
    }

    const { rows: countRows } = await client.query('SELECT COUNT(*) as cnt FROM dart_financials');
    console.log(`\nDone! Upserted ${totalUpserted} records. Total in table: ${countRows[0].cnt}`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
