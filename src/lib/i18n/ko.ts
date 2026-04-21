const ko: Record<string, string> = {
  // Nav labels
  'nav.overview': '개요',
  'nav.reviews': '리뷰',
  'nav.news': '뉴스',
  'nav.updates': '업데이트',
  'nav.rankings': '순위',
  'nav.dart': 'DART 재무정보',

  // Page titles
  'page.overview': '개요',
  'page.reviews': '리뷰',
  'page.news': '뉴스',
  'page.updates': '앱 업데이트',
  'page.rankings': '순위',
  'page.dart': 'DART 재무분석',
  'page.dashboard': '대시보드',

  // Quick stats
  'stats.competitors': '경쟁사',
  'stats.avgRatingPlay': '평균 평점 (Play)',
  'stats.reviews30d': '리뷰',
  'stats.news30d': '뉴스 (30일)',
  'stats.updatesThisWeek': '이번 주 앱 업데이트',
  'stats.newsThisWeek': '이번 주 뉴스',
  'stats.downloadsTrend': '다운로드 추이',

  // Filter labels
  'filter.allCompanies': '전체 회사',
  'filter.allStores': '전체 스토어',
  'filter.allRatings': '전체 평점',
  'filter.android': 'Android',
  'filter.ios': 'iOS',
  'filter.stars': '{n}점',
  'filter.star': '{n}점',

  // Competitor card
  'card.downloads': '다운로드',
  'card.reviews': '리뷰',
  'card.news': '뉴스',
  'card.playStore': 'Play Store',
  'card.appStore': 'App Store',

  // Rankings
  'ranking.combined': '통합',
  'ranking.playStore': 'Play Store',
  'ranking.appStore': 'App Store',
  'ranking.totalRatings': '총 평가 수',
  'ranking.downloads': '다운로드',
  'ranking.company': '회사',
  'ranking.ratingComparison': '평점 비교 (상위 15개)',
  'ranking.noData': '비교할 평점 데이터가 없습니다.',

  // Time filters
  'filter.last7d': '최근 7일',
  'filter.last30d': '최근 30일',
  'filter.last90d': '최근 90일',
  'filter.allTime': '전체 기간',
  'filter.customRange': '기간 설정',

  // Updates
  'updates.daysSinceTitle': '마지막 업데이트 이후 일수',
  'updates.daysAgo': '일 전',
  'updates.frequency': '업데이트 타임라인',
  'updates.noChartData': '차트에 표시할 업데이트 데이터가 없습니다.',
  'updates.noMatch': '필터와 일치하는 앱 업데이트가 없습니다.',

  // Reviews
  'reviews.noMatch': '필터와 일치하는 리뷰가 없습니다.',

  // News
  'news.noMatch': '필터와 일치하는 뉴스 기사가 없습니다.',

  // Company detail
  'company.ratings': '평가',
  'company.downloads': '다운로드',
  'company.reviews30d': '리뷰',
  'company.news30d': '뉴스 기사 (30일)',
  'company.notFound': '회사를 찾을 수 없습니다.',
  'company.ratingHistory': '평점 이력',
  'company.noRatingHistory': '평점 이력이 없습니다.',
  'company.reviewVolume': '리뷰 수 (주별)',
  'company.noReviewData': '리뷰 데이터가 없습니다.',

  // Shared
  'shared.refresh': '새로고침',
  'shared.noData': '데이터가 없습니다',
  'shared.prev': '이전',
  'shared.next': '다음',
  'shared.page': '{page} / {total} 페이지',
  'shared.backToOverview': '개요로 돌아가기',

  // Empty states
  'empty.competitors': '경쟁사를 찾을 수 없습니다. 스크래퍼를 실행하여 데이터를 채워주세요.',

  // Sidebar
  'sidebar.title': '경쟁사 분석',
  'sidebar.footer': '경쟁사 분석',

  // Overview sections
  'overview.competitors': '경쟁사',
  'overview.benchmarks': '기타 경쟁사 및 벤치마크',
  'overview.weeklySummary': '주간 요약',
  'overview.noHighlights': '이번 주 하이라이트가 없습니다.',
  'overview.newAppUpdates': '새로운 앱 업데이트',
  'overview.topNews': '주요 뉴스',
  'overview.notableReviews': '주요 리뷰',

  // DART
  'dart.revenueChart': '매출액 추이 (원)',
  'dart.profitChart': '영업이익 비교 (원)',
  'dart.employeeChart': '직원 수 추이',
  'dart.growthTable': '재무 요약',
  'dart.company': '회사',
  'dart.revenue': '매출액',
  'dart.operatingProfit': '영업이익',
  'dart.netIncome': '당기순이익',
  'dart.totalAssets': '자산총계',
  'dart.primaryCompetitors': '주요 경쟁사',
  'dart.secondaryCompanies': '기타 회사',
  'dart.employeeTrends': '직원 수 추이',
  'dart.noData': 'DART 재무 데이터가 없습니다. 새로고침을 클릭하여 OpenDART에서 데이터를 가져오세요.',
  'dart.noEmployeeData': '직원 수 데이터가 없습니다.',

  // Rankings sections
  'rankings.remittanceCompetitors': '송금 경쟁사',
  'rankings.benchmarks': '기타 경쟁사 및 벤치마크',

  // DART Action Plan
  'dart.actionPlan': '액션 플랜 & 전략 분석',
  'dart.competitiveComparison': '경쟁사 비교 (2025)',
  'dart.ratioTrends': '비율 추이',
  'dart.opMarginTrend': '영업이익률 추이 (%)',
  'dart.debtEquityTrend': '부채비율 추이',
  'dart.roeComparison': 'ROE 비교 (%)',
  'dart.revenueGrowthComparison': '매출 성장률 비교 (%)',
  'dart.gmeActionPlan': 'GME 액션 플랜',
  'dart.lifecyclePosition': '기업 라이프사이클 포지션',
  'dart.metric': '지표',

  // Comparison table metrics
  'dart.ratio.revenue': '매출액 (억원)',
  'dart.ratio.opMargin': '영업이익률 (%)',
  'dart.ratio.netMargin': '순이익률 (%)',
  'dart.ratio.debtEquity': '부채비율',
  'dart.ratio.roe': 'ROE (%)',
  'dart.ratio.roa': 'ROA (%)',
  'dart.ratio.assetTurnover': '자산회전율',
  'dart.ratio.revGrowth': '매출성장률 (%)',

  // Action plan cards
  'dart.action.profitability.title': '수익성 격차',
  'dart.action.profitability.priority': '우선순위 #1',
  'dart.action.profitability.body': 'E9Pay 영업이익률 36.7% vs GME 11.9%. E9Pay의 비용 구조를 분석하여 3배 효율성 격차를 줄여야 합니다.',
  'dart.action.leverage.title': '레버리지 리스크',
  'dart.action.leverage.priority': '우선순위 #2',
  'dart.action.leverage.body': 'GME 부채비율(4.74x)이 경쟁사 중 가장 높음. E9Pay(0.09x), GMoney(0.59x)는 거의 무차입. 부채 축소 전략이 필요합니다.',
  'dart.action.growth.title': '성장 우위',
  'dart.action.growth.priority': '기회',
  'dart.action.growth.body': 'GME 성장률(26%)이 경쟁사 중 가장 빠름. GMoney 역성장(-5.5%), E9Pay 둔화(14.8%). 현재 성장세 유지 시 1-2년 내 GMoney 매출 추월 가능.',
  'dart.action.efficiency.title': '효율성 경보',
  'dart.action.efficiency.priority': '주의',
  'dart.action.efficiency.body': '자산회전율 0.77→0.52 하락 중 — 자산 증가가 매출 증가보다 빠름. 자본 운용 효율성 개선 필요.',

  // Lifecycle
  'dart.lifecycle.e9pay': '현금 풍부한 성숙기 핀테크, 자본 배치 단계 진입',
  'dart.lifecycle.gmoney': '성장 정점 후 둔화, 마진 압축',
  'dart.lifecycle.hanpass': '공격적 성장 + IPO, 높은 레버리지',
  'dart.lifecycle.gme': '빠른 성장이나 레버리지 상승, 효율성 하락',
  'dart.lifecycle.sentbe': '구조조정 중, 여전히 적자',
};

export default ko;
