// Competitor seed data — used by scripts/seed-competitors.ts
export const competitors = [
  { slug: 'gme', name: 'GME Remittance', country: 'KR', playStoreId: 'com.gmeremit.online.gmeremittance_native', appStoreId: '1439161261', newsKeywords: ['GME Remittance', 'GME 송금', 'GME리밋'] },
  { slug: 'hanpass', name: 'Hanpass', country: 'KR', playStoreId: 'com.hanpass.remittance', appStoreId: '1344407760', newsKeywords: ['Hanpass', '한패스', '한패스 해외송금'] },
  { slug: 'gmoney', name: 'GMoney Transfer', country: 'KR', playStoreId: 'com.gmoneytrans', appStoreId: '1218137289', newsKeywords: ['GMoney Transfer', 'G머니 송금', '지머니트랜스'] },
  { slug: 'e9pay', name: 'E9Pay', country: 'KR', playStoreId: 'com.e9pay.remittance2', appStoreId: '1321773016', newsKeywords: ['E9Pay', 'E9pay', '이나인페이', 'E9페이 해외송금'] },
  { slug: 'sentbe', name: 'SentBe', country: 'KR', playStoreId: 'com.sentbe', appStoreId: '1115554824', newsKeywords: ['SentBe', '센트비', '센트비 해외송금'] },
  { slug: 'moin', name: 'MOIN', country: 'KR', playStoreId: 'com.themoin.remit', appStoreId: '1228063143', newsKeywords: ['MOIN remittance', '모인 해외송금', '모인 송금'] },
  { slug: 'debunk', name: 'Debunk', country: 'KR', playStoreId: 'com.kr.icb.aos.zeplinremit', appStoreId: '1494660633', newsKeywords: ['Debunk remittance', '디벙크', '디벙크 해외송금'] },
  { slug: 'jrf', name: 'JRF Remittance', country: 'KR', playStoreId: 'com.inficare.jrf', appStoreId: '1504187834', newsKeywords: ['JRF Remittance', 'JRF 송금', 'Japan Remit Finance'] },
  { slug: 'coinshot', name: 'Coinshot', country: 'KR', playStoreId: 'com.finshot.coinshot', appStoreId: '1222455831', newsKeywords: ['Coinshot remittance', '코인샷', '코인샷 해외송금'] },
  { slug: 'utransfer', name: 'UTransfer', country: 'KR', playStoreId: 'com.utransfer.kr.app', appStoreId: '6740383492', newsKeywords: ['UTransfer', '유트랜스퍼', '유트랜스퍼 해외송금'] },
  { slug: 'gln', name: 'GLN', country: 'KR', playStoreId: 'com.glninternational.gapp', appStoreId: '1608440499', newsKeywords: ['GLN remittance', 'GLN 해외송금', 'GLN 송금'] },
  { slug: 'cross-remit', name: 'Cross Remit', country: 'KR', playStoreId: 'com.crossenf.cross', appStoreId: '1444989949', newsKeywords: ['Cross Remit', '크로스 리밋', '크로스리밋 해외송금'] },
  { slug: 'sbi-cosmoney', name: 'SBI Cosmoney', country: 'KR', playStoreId: 'com.sbicosmoney.remit', appStoreId: '1332603234', newsKeywords: ['SBI Cosmoney', 'SBI 코스머니', 'SBI코스머니 해외송금'] },
  { slug: 'kakaopay', name: 'Kakao', country: 'KR', playStoreId: 'com.kakaopay.app', appStoreId: '1464496236', newsKeywords: ['카카오페이 해외송금', 'Kakao Pay overseas transfer'] },
  { slug: 'toss', name: 'Toss', country: 'KR', playStoreId: 'viva.republica.toss', appStoreId: '839333328', newsKeywords: ['토스 해외송금', 'Toss overseas transfer'] },
  { slug: 'naverpay', name: 'Naver Pay', country: 'KR', playStoreId: 'com.naverfin.payapp', appStoreId: '1554807824', newsKeywords: ['네이버페이 해외송금', 'Naver Pay overseas transfer', '네이버페이 송금'] },
  { slug: 'wise', name: 'Wise', country: 'GB', playStoreId: 'com.transferwise.android', appStoreId: '612261027', newsKeywords: ['Wise money transfer', 'Wise 해외송금'] },
  { slug: 'wirebarley', name: 'WireBarley', country: 'KR', playStoreId: 'com.wirebarley.android', appStoreId: '1164356190', newsKeywords: ['WireBarley', '와이어바알리', '와이어바알리 해외송금'] },
];

// News keywords lookup by competitor name (used by news scraper)
// DB competitors are the source of truth for slugs/IDs
export const newsKeywordsByName: Record<string, string[]> = {
  'GME Remittance': ['GME Remittance', 'GME 송금', 'GME리밋'],
  'Hanpass': ['Hanpass', '한패스', '한패스 해외송금'],
  'GMoney Transfer': ['GMoney Transfer', 'G머니 송금', '지머니트랜스'],
  'E9Pay': ['E9Pay', 'E9pay', '이나인페이', 'E9페이 해외송금'],
  'SentBe': ['SentBe', '센트비', '센트비 해외송금'],
  'MOIN': ['MOIN remittance', '모인 해외송금', '모인 송금'],
  'Debunk': ['Debunk remittance', '디벙크', '디벙크 해외송금'],
  'JRF Remittance': ['JRF Remittance', 'JRF 송금', 'Japan Remit Finance'],
  'Coinshot': ['Coinshot remittance', '코인샷', '코인샷 해외송금'],
  'UTransfer': ['UTransfer', '유트랜스퍼', '유트랜스퍼 해외송금'],
  'GLN': ['GLN remittance', 'GLN 해외송금', 'GLN 송금'],
  'Kakao': ['카카오페이 해외송금', 'Kakao Pay overseas transfer'],
  'Toss': ['토스 해외송금', 'Toss overseas transfer'],
  'Naver Pay': ['네이버페이 해외송금', 'Naver Pay overseas transfer', '네이버페이 송금'],
  'Wise': ['Wise money transfer', 'Wise 해외송금'],
  'WireBarley': ['WireBarley', '와이어바알리', '와이어바알리 해외송금'],
  'SBI Cosmoney': ['SBI Cosmoney', 'SBI 코스머니', 'SBI코스머니 해외송금'],
  'Cross Remit': ['Cross Remit', '크로스 리밋', '크로스리밋 해외송금'],
};
