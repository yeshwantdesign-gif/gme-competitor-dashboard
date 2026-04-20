// DART company configuration
// Maps competitor slugs to DART corp names and known stock codes

export interface DartCompany {
  slug: string;
  name: string;
  nameKo: string;
  stockCode?: string;       // 6-digit stock code (listed companies)
  searchTerms: string[];    // Terms to search in corp code XML
  category: 'primary' | 'secondary';
}

export const DART_COMPANIES: DartCompany[] = [
  // GME Remittance (parent company)
  { slug: 'gme', name: 'GME Remittance', nameKo: '글로벌머니익스프레스', searchTerms: ['글로벌머니익스프레스'], category: 'primary' },

  // Primary Competitors
  { slug: 'hanpass', name: 'Hanpass', nameKo: '한패스', stockCode: '408470', searchTerms: ['한패스'], category: 'primary' },
  { slug: 'gmoney', name: 'GMoney Transfer', nameKo: '지머니트랜스', searchTerms: ['지머니트랜스'], category: 'primary' },
  { slug: 'e9pay', name: 'E9Pay', nameKo: '이나인페이', searchTerms: ['이나인페이'], category: 'primary' },
  { slug: 'sentbe', name: 'SentBe', nameKo: '센트비', searchTerms: ['센트비'], category: 'primary' },
  // Coinshot, Cross Remit — not registered in DART

  // Secondary Companies
  { slug: 'kakaopay', name: 'Kakao Pay', nameKo: '카카오페이', stockCode: '377300', searchTerms: ['카카오페이'], category: 'secondary' },
  { slug: 'toss', name: 'Toss', nameKo: '비바리퍼블리카', searchTerms: ['비바리퍼블리카'], category: 'secondary' },
  { slug: 'naverpay', name: 'Naver Pay', nameKo: '네이버파이낸셜', searchTerms: ['네이버파이낸셜'], category: 'secondary' },
  { slug: 'naverpay', name: 'Naver', nameKo: '네이버', stockCode: '035420', searchTerms: ['NAVER'], category: 'secondary' },
  { slug: 'gln', name: 'GLN', nameKo: '지엘엔인터내셔널', searchTerms: ['지엘엔인터내셔널'], category: 'secondary' },
  // MOIN, UTransfer, Debunk — not registered in DART (or name mismatch)
];

// DART report type codes
export const REPRT_CODES = {
  ANNUAL: '11011',
  HALF: '11012',
  Q1: '11013',
  Q3: '11014',
} as const;

// Financial account names to extract (Korean labels from DART API)
export const ACCOUNT_NAMES = {
  revenue: ['매출액', '수익(매출액)', '영업수익'],
  operatingProfit: ['영업이익', '영업이익(손실)'],
  netIncome: ['당기순이익', '당기순이익(손실)', '당기순이익(손실)의 귀속'],
  totalAssets: ['자산총계'],
  totalLiabilities: ['부채총계'],
  totalEquity: ['자본총계'],
} as const;
