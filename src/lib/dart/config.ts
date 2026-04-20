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
  // Primary Competitors
  { slug: 'hanpass', name: 'Hanpass', nameKo: '한패스', stockCode: '408470', searchTerms: ['한패스'], category: 'primary' },
  { slug: 'gmoney', name: 'GMoney Transfer', nameKo: '지머니트랜스', searchTerms: ['지머니트랜스', '지머니'], category: 'primary' },
  { slug: 'e9pay', name: 'E9Pay', nameKo: '이나인페이', searchTerms: ['이나인페이', 'E9Pay'], category: 'primary' },
  { slug: 'sentbe', name: 'SentBe', nameKo: '센트비', searchTerms: ['센트비'], category: 'primary' },
  { slug: 'coinshot', name: 'Coinshot', nameKo: '코인샷', searchTerms: ['코인샷'], category: 'primary' },
  { slug: 'cross-remit', name: 'Cross Remit', nameKo: '크로스리밋', searchTerms: ['크로스리밋', '크로스 리밋'], category: 'primary' },

  // Secondary Companies
  { slug: 'kakaopay', name: 'Kakao Pay', nameKo: '카카오페이', stockCode: '377300', searchTerms: ['카카오페이'], category: 'secondary' },
  { slug: 'toss', name: 'Toss', nameKo: '비바리퍼블리카', searchTerms: ['비바리퍼블리카'], category: 'secondary' },
  { slug: 'naverpay', name: 'Naver Pay', nameKo: '네이버파이낸셜', stockCode: '035420', searchTerms: ['네이버', 'NAVER'], category: 'secondary' },
  { slug: 'gln', name: 'GLN', nameKo: 'GLN', searchTerms: ['지엘엔인터내셔널', 'GLN'], category: 'secondary' },
  { slug: 'moin', name: 'MOIN', nameKo: '모인', searchTerms: ['모인', 'MOIN'], category: 'secondary' },
  { slug: 'utransfer', name: 'UTransfer', nameKo: '유트랜스퍼', searchTerms: ['유트랜스퍼'], category: 'secondary' },
  { slug: 'debunk', name: 'Debunk', nameKo: '디벙크', searchTerms: ['디벙크'], category: 'secondary' },
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
