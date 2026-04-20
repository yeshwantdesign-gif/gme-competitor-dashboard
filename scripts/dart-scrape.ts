import { config } from 'dotenv';
config({ path: '.env.local' });

import { Pool } from 'pg';

const DART_API_BASE = 'https://opendart.fss.or.kr/api';
const API_KEY = process.env.OPENDART_API_KEY!;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
});

const DART_COMPANIES = [
  { name: 'Hanpass', nameKo: '한패스', stockCode: '408470', searchTerms: ['한패스'], category: 'primary' },
  { name: 'GMoney Transfer', nameKo: '지머니트랜스', searchTerms: ['지머니트랜스'], category: 'primary' },
  { name: 'E9Pay', nameKo: '이나인페이', searchTerms: ['이나인페이'], category: 'primary' },
  { name: 'SentBe', nameKo: '센트비', searchTerms: ['센트비'], category: 'primary' },
  { name: 'Kakao Pay', nameKo: '카카오페이', stockCode: '377300', searchTerms: ['카카오페이'], category: 'secondary' },
  { name: 'Toss', nameKo: '비바리퍼블리카', searchTerms: ['비바리퍼블리카'], category: 'secondary' },
  { name: 'Naver Pay', nameKo: '네이버파이낸셜', searchTerms: ['네이버파이낸셜'], category: 'secondary' },
  { name: 'Naver', nameKo: '네이버', stockCode: '035420', searchTerms: ['NAVER'], category: 'secondary' },
  { name: 'GLN', nameKo: '지엘엔인터내셔널', searchTerms: ['지엘엔인터내셔널'], category: 'secondary' },
];

const ACCOUNT_NAMES = {
  revenue: ['매출액', '수익(매출액)', '영업수익'],
  operatingProfit: ['영업이익', '영업이익(손실)'],
  netIncome: ['당기순이익', '당기순이익(손실)'],
  totalAssets: ['자산총계'],
  totalLiabilities: ['부채총계'],
  totalEquity: ['자본총계'],
};

interface CorpEntry { corp_code: string; corp_name: string; stock_code: string; }

async function fetchCorpCodes(): Promise<CorpEntry[]> {
  console.log('Downloading corp code ZIP from DART...');
  const res = await fetch(`${DART_API_BASE}/corpCode.xml?crtfc_key=${API_KEY}`);
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  const buffer = await res.arrayBuffer();
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(buffer);
  const xmlText = await zip.file('CORPCODE.xml')!.async('text');

  const entries: CorpEntry[] = [];
  const regex = /<list>\s*<corp_code>([^<]*)<\/corp_code>\s*<corp_name>([^<]*)<\/corp_name>\s*<corp_eng_name>[^<]*<\/corp_eng_name>\s*<stock_code>([^<]*)<\/stock_code>\s*<modify_date>[^<]*<\/modify_date>\s*<\/list>/g;
  let match;
  while ((match = regex.exec(xmlText)) !== null) {
    entries.push({ corp_code: match[1].trim(), corp_name: match[2].trim(), stock_code: match[3].trim() });
  }
  console.log(`Parsed ${entries.length} corp codes`);
  return entries;
}

function parseAmount(value: string | undefined | null): number | null {
  if (!value || value === '' || value === '-') return null;
  const num = parseInt(value.replace(/,/g, ''), 10);
  return isNaN(num) ? null : num;
}

function findAccount(rows: any[], names: readonly string[]): number | null {
  for (const name of names) {
    const row = rows.find((r: any) => r.account_nm === name);
    if (row) return parseAmount(row.thstrm_amount);
  }
  return null;
}

async function fetchFinancials(corpCode: string, year: number): Promise<any | null> {
  for (const fsDiv of ['OFS', 'CFS']) {
    const params = new URLSearchParams({
      crtfc_key: API_KEY, corp_code: corpCode,
      bsns_year: String(year), reprt_code: '11011', fs_div: fsDiv,
    });
    const res = await fetch(`${DART_API_BASE}/fnlttSinglAcnt.json?${params}`);
    if (!res.ok) continue;
    const json = await res.json();
    if (json.status !== '000' || !json.list) continue;

    return {
      fs_div: fsDiv,
      revenue: findAccount(json.list, ACCOUNT_NAMES.revenue),
      operating_profit: findAccount(json.list, ACCOUNT_NAMES.operatingProfit),
      net_income: findAccount(json.list, ACCOUNT_NAMES.netIncome),
      total_assets: findAccount(json.list, ACCOUNT_NAMES.totalAssets),
      total_liabilities: findAccount(json.list, ACCOUNT_NAMES.totalLiabilities),
      total_equity: findAccount(json.list, ACCOUNT_NAMES.totalEquity),
    };
  }
  return null;
}

async function main() {
  const client = await pool.connect();
  console.log('Connected to Postgres');

  try {
    const allCorps = await fetchCorpCodes();

    for (const company of DART_COMPANIES) {
      let corpCode: string | null = null;
      let corpName = '';
      let stockCode = '';

      // Match by stock code first
      if (company.stockCode) {
        const entry = allCorps.find(e => e.stock_code === company.stockCode);
        if (entry) { corpCode = entry.corp_code; corpName = entry.corp_name; stockCode = entry.stock_code; }
      }

      // Then by name
      if (!corpCode) {
        for (const term of company.searchTerms) {
          const exact = allCorps.find(e => e.corp_name === term);
          if (exact) { corpCode = exact.corp_code; corpName = exact.corp_name; stockCode = exact.stock_code; break; }
          const partial = allCorps.find(e => e.corp_name.includes(term));
          if (partial) { corpCode = partial.corp_code; corpName = partial.corp_name; stockCode = partial.stock_code; break; }
        }
      }

      if (!corpCode) {
        console.log(`  ✗ ${company.name}: not found in DART`);
        continue;
      }

      console.log(`  ✓ ${company.name} → ${corpName} (${corpCode})`);

      // Save corp code mapping
      await client.query(`
        INSERT INTO dart_corp_codes (corp_code, corp_name, stock_code)
        VALUES ($1, $2, $3)
        ON CONFLICT (corp_code) DO UPDATE SET corp_name = $2, stock_code = $3
      `, [corpCode, corpName, stockCode || null]);

      // Fetch 6 years of financials
      const currentYear = new Date().getFullYear();
      for (let year = currentYear - 5; year <= currentYear; year++) {
        const data = await fetchFinancials(corpCode, year);
        if (!data) { continue; }

        await client.query(`
          INSERT INTO dart_financials (corp_code, corp_name, stock_code, bsns_year, reprt_code, fs_div,
            revenue, operating_profit, net_income, total_assets, total_liabilities, total_equity)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (corp_code, bsns_year, reprt_code, fs_div) DO UPDATE SET
            revenue = $7, operating_profit = $8, net_income = $9,
            total_assets = $10, total_liabilities = $11, total_equity = $12,
            fetched_at = NOW()
        `, [corpCode, corpName, stockCode || null, year, '11011', data.fs_div,
            data.revenue, data.operating_profit, data.net_income,
            data.total_assets, data.total_liabilities, data.total_equity]);

        console.log(`    ${year}: revenue=${data.revenue}, op_profit=${data.operating_profit}, net_income=${data.net_income}`);

        // Rate limit
        await new Promise(r => setTimeout(r, 700));
      }
    }

    // Check totals
    const { rows } = await client.query('SELECT COUNT(*) as cnt FROM dart_financials');
    console.log(`\nDone! ${rows[0].cnt} financial records in database.`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
