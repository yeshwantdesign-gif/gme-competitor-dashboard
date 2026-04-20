// OpenDART API client
import { ACCOUNT_NAMES } from './config';

const DART_API_BASE = 'https://opendart.fss.or.kr/api';

function getApiKey(): string {
  const key = process.env.OPENDART_API_KEY;
  if (!key) throw new Error('OPENDART_API_KEY is not configured');
  return key;
}

export interface CorpCodeEntry {
  corp_code: string;
  corp_name: string;
  corp_name_eng: string;
  stock_code: string;
}

export interface DartFinancialRow {
  rcept_no: string;
  reprt_code: string;
  bsns_year: string;
  corp_code: string;
  sj_div: string;
  sj_nm: string;
  account_id: string;
  account_nm: string;
  account_detail: string;
  thstrm_nm: string;
  thstrm_amount: string;
  frmtrm_nm: string;
  frmtrm_amount: string;
  bfefrmtrm_nm: string;
  bfefrmtrm_amount: string;
  ord: string;
  currency: string;
  fs_div: string;
  fs_nm: string;
}

export interface ParsedFinancials {
  corp_code: string;
  bsns_year: number;
  reprt_code: string;
  fs_div: string;
  revenue: number | null;
  operating_profit: number | null;
  net_income: number | null;
  total_assets: number | null;
  total_liabilities: number | null;
  total_equity: number | null;
}

/**
 * Fetch financial statements for a single company/year/report
 */
export async function fetchFinancialStatement(
  corpCode: string,
  bsnsYear: number,
  reprtCode: string
): Promise<ParsedFinancials | null> {
  const params = new URLSearchParams({
    crtfc_key: getApiKey(),
    corp_code: corpCode,
    bsns_year: String(bsnsYear),
    reprt_code: reprtCode,
    fs_div: 'OFS', // Individual financial statements
  });

  const res = await fetch(`${DART_API_BASE}/fnlttSinglAcnt.json?${params}`, {
    next: { revalidate: 86400 }, // Cache for 24 hours
  });

  if (!res.ok) return null;

  const json = await res.json();

  // status "000" means success; "013" means no data
  if (json.status !== '000' || !json.list) {
    // Try consolidated (CFS) if individual has no data
    params.set('fs_div', 'CFS');
    const res2 = await fetch(`${DART_API_BASE}/fnlttSinglAcnt.json?${params}`, {
      next: { revalidate: 86400 },
    });
    if (!res2.ok) return null;
    const json2 = await res2.json();
    if (json2.status !== '000' || !json2.list) return null;
    return parseFinancials(json2.list, corpCode, bsnsYear, reprtCode, 'CFS');
  }

  return parseFinancials(json.list, corpCode, bsnsYear, reprtCode, 'OFS');
}

function parseAmount(value: string | undefined | null): number | null {
  if (!value || value === '' || value === '-') return null;
  const cleaned = value.replace(/,/g, '');
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? null : num;
}

function findAccount(rows: DartFinancialRow[], names: readonly string[]): number | null {
  for (const name of names) {
    const row = rows.find((r) => r.account_nm === name);
    if (row) {
      return parseAmount(row.thstrm_amount);
    }
  }
  return null;
}

function parseFinancials(
  list: DartFinancialRow[],
  corpCode: string,
  bsnsYear: number,
  reprtCode: string,
  fsDiv: string
): ParsedFinancials {
  return {
    corp_code: corpCode,
    bsns_year: bsnsYear,
    reprt_code: reprtCode,
    fs_div: fsDiv,
    revenue: findAccount(list, ACCOUNT_NAMES.revenue),
    operating_profit: findAccount(list, ACCOUNT_NAMES.operatingProfit),
    net_income: findAccount(list, ACCOUNT_NAMES.netIncome),
    total_assets: findAccount(list, ACCOUNT_NAMES.totalAssets),
    total_liabilities: findAccount(list, ACCOUNT_NAMES.totalLiabilities),
    total_equity: findAccount(list, ACCOUNT_NAMES.totalEquity),
  };
}

/**
 * Download and parse the corp code ZIP from DART
 * Returns a map of corp_name -> corp_code entry
 */
export async function fetchCorpCodes(): Promise<CorpCodeEntry[]> {
  const res = await fetch(`${DART_API_BASE}/corpCode.xml?crtfc_key=${getApiKey()}`);
  if (!res.ok) throw new Error(`Failed to fetch corp codes: ${res.status}`);

  const buffer = await res.arrayBuffer();

  // The response is a ZIP file containing CORPCODE.xml
  // Use JSZip to decompress
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(buffer);
  const xmlFile = zip.file('CORPCODE.xml');
  if (!xmlFile) throw new Error('CORPCODE.xml not found in ZIP');

  const xmlText = await xmlFile.async('text');

  // Parse XML manually (simple regex parsing for known structure)
  const entries: CorpCodeEntry[] = [];
  const corpRegex = /<list>\s*<corp_code>([^<]*)<\/corp_code>\s*<corp_name>([^<]*)<\/corp_name>\s*<stock_code>([^<]*)<\/stock_code>\s*<modify_date>[^<]*<\/modify_date>\s*<\/list>/g;

  let match;
  while ((match = corpRegex.exec(xmlText)) !== null) {
    entries.push({
      corp_code: match[1].trim(),
      corp_name: match[2].trim(),
      corp_name_eng: '',
      stock_code: match[3].trim(),
    });
  }

  return entries;
}
