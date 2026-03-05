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
