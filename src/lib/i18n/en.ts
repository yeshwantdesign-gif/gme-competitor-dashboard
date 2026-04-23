const en: Record<string, string> = {
  // Nav labels
  'nav.overview': 'Overview',
  'nav.reviews': 'Reviews',
  'nav.news': 'News',
  'nav.updates': 'Updates',
  'nav.rankings': 'Rankings',
  'nav.dart': 'DART Financial',

  // Page titles
  'page.overview': 'Overview',
  'page.reviews': 'Reviews',
  'page.news': 'News',
  'page.updates': 'App Updates',
  'page.rankings': 'Rankings',
  'page.dart': 'DART Financial Analysis',
  'page.dashboard': 'Dashboard',

  // Quick stats
  'stats.competitors': 'Competitors',
  'stats.avgRatingPlay': 'Avg Rating (Play)',
  'stats.reviews30d': 'Reviews',
  'stats.news30d': 'News (30d)',
  'stats.updatesThisWeek': 'App Updates This Week',
  'stats.newsThisWeek': 'News This Week',
  'stats.downloadsTrend': 'Downloads Trend',

  // Filter labels
  'filter.allCompanies': 'All Companies',
  'filter.allStores': 'All Stores',
  'filter.allRatings': 'All Ratings',
  'filter.android': 'Android',
  'filter.ios': 'iOS',
  'filter.stars': '{n} Stars',
  'filter.star': '{n} Star',

  // Competitor card
  'card.downloads': 'Downloads',
  'card.reviews': 'reviews',
  'card.news': 'news',
  'card.playStore': 'Play Store',
  'card.appStore': 'App Store',

  // Rankings
  'ranking.combined': 'Combined',
  'ranking.playStore': 'Play Store',
  'ranking.appStore': 'App Store',
  'ranking.totalRatings': 'Total Ratings',
  'ranking.downloads': 'Downloads',
  'ranking.company': 'Company',
  'ranking.ratingComparison': 'Rating Comparison (Top 15)',
  'ranking.noData': 'No rating data available for comparison.',

  // Time filters
  'filter.last7d': 'Last 7 Days',
  'filter.last30d': 'Last 30 Days',
  'filter.last90d': 'Last 90 Days',
  'filter.allTime': 'All Time',
  'filter.customRange': 'Custom Range',

  // Updates
  'updates.daysSinceTitle': 'Days Since Last Update',
  'updates.daysAgo': 'days ago',
  'updates.frequency': 'Update Timeline',
  'updates.noChartData': 'No update data available for chart.',
  'updates.noMatch': 'No app updates match your filters.',

  // Reviews
  'reviews.noMatch': 'No reviews match your filters.',

  // News
  'news.noMatch': 'No news articles match your filters.',

  // Company detail
  'company.ratings': 'ratings',
  'company.downloads': 'downloads',
  'company.reviews30d': 'reviews',
  'company.news30d': 'news articles (30d)',
  'company.notFound': 'Company not found.',
  'company.ratingHistory': 'Rating History',
  'company.noRatingHistory': 'No rating history available.',
  'company.reviewVolume': 'Review Volume (by week)',
  'company.noReviewData': 'No review data available.',

  // Shared
  'shared.refresh': 'Refresh',
  'shared.noData': 'No data available',
  'shared.prev': 'Prev',
  'shared.next': 'Next',
  'shared.page': 'Page {page} of {total}',
  'shared.backToOverview': 'Back to overview',

  // Empty states
  'empty.competitors': 'No competitors found. Run the scrapers to populate data.',

  // Sidebar
  'sidebar.title': 'Competitors Analysis',
  'sidebar.footer': 'Competitors Analysis',

  // Overview sections
  'overview.competitors': 'Competitors',
  'overview.benchmarks': 'Other Competitors & Benchmarks',
  'overview.weeklySummary': 'Weekly Summary',
  'overview.noHighlights': 'No highlights this week.',
  'overview.newAppUpdates': 'New App Updates',
  'overview.topNews': 'Top News',
  'overview.notableReviews': 'Notable Reviews',

  // DART
  'dart.revenueChart': 'Revenue Trend (KRW)',
  'dart.profitChart': 'Operating Profit Comparison (KRW)',
  'dart.employeeChart': 'Employee Count Trends',
  'dart.growthTable': 'Financial Summary',
  'dart.company': 'Company',
  'dart.revenue': 'Revenue',
  'dart.operatingProfit': 'Op. Profit',
  'dart.netIncome': 'Net Income',
  'dart.totalAssets': 'Total Assets',
  'dart.totalLiabilities': 'Liabilities',
  'dart.totalEquity': 'Equity',
  'dart.primaryCompetitors': 'Primary Competitors',
  'dart.secondaryCompanies': 'Secondary Companies',
  'dart.employeeTrends': 'Employee Count Trends',
  'dart.noData': 'No DART financial data available. Click refresh to fetch data from OpenDART.',
  'dart.noEmployeeData': 'No employee count data available.',

  // Rankings sections
  'rankings.remittanceCompetitors': 'Remittance Competitors',
  'rankings.benchmarks': 'Other Competitors & Benchmarks',

  // DART Action Plan
  'dart.actionPlan': 'Action Plan & Strategic Analysis',
  'dart.competitiveComparison': 'Competitive Comparison (2025)',
  'dart.ratioTrends': 'Ratio Trends',
  'dart.opMarginTrend': 'Operating Margin Trend (%)',
  'dart.debtEquityTrend': 'Debt-to-Equity Trend',
  'dart.roeComparison': 'ROE Comparison (%)',
  'dart.revenueGrowthComparison': 'Revenue Growth Comparison (%)',
  'dart.gmeActionPlan': 'GME Action Plan',
  'dart.lifecyclePosition': 'Company Lifecycle Position',
  'dart.metric': 'Metric',

  // Comparison table metrics
  'dart.ratio.revenue': 'Revenue (B KRW)',
  'dart.ratio.opMargin': 'Op. Margin (%)',
  'dart.ratio.netMargin': 'Net Margin (%)',
  'dart.ratio.debtEquity': 'Debt/Equity',
  'dart.ratio.roe': 'ROE (%)',
  'dart.ratio.roa': 'ROA (%)',
  'dart.ratio.assetTurnover': 'Asset Turnover',
  'dart.ratio.revGrowth': 'Revenue Growth (%)',

  // Action plan cards
  'dart.action.profitability.title': 'Profitability Gap',
  'dart.action.profitability.priority': 'Priority #1',
  'dart.action.profitability.body': 'E9Pay earns 36.7% operating margin vs GME\'s 11.9%. Study E9Pay\'s cost structure to close the 3x efficiency gap.',
  'dart.action.leverage.title': 'Leverage Risk',
  'dart.action.leverage.priority': 'Priority #2',
  'dart.action.leverage.body': 'GME\'s debt-to-equity (4.74x) is the highest among all competitors. E9Pay (0.09x) and GMoney (0.59x) are nearly debt-free. Develop a deleveraging strategy.',
  'dart.action.growth.title': 'Growth Advantage',
  'dart.action.growth.priority': 'Opportunity',
  'dart.action.growth.body': 'GME has the fastest growth rate (26%). GMoney is shrinking (-5.5%), E9Pay is slowing (14.8%). Maintain momentum to overtake GMoney within 1-2 years.',
  'dart.action.efficiency.title': 'Efficiency Alert',
  'dart.action.efficiency.priority': 'Watch',
  'dart.action.efficiency.body': 'Asset turnover declining from 0.77 to 0.52 — assets growing faster than revenue. Improve capital deployment efficiency.',

  // Growth vs Profit Quadrant
  'dart.quadrant.title': 'Growth vs Profitability Matrix',
  'dart.quadrant.xAxis': 'Revenue Growth (%)',
  'dart.quadrant.yAxis': 'Operating Margin (%)',
  'dart.quadrant.star': 'Stars',
  'dart.quadrant.starDesc': 'High Growth + High Profit',
  'dart.quadrant.cashCow': 'Cash Cows',
  'dart.quadrant.cashCowDesc': 'Low Growth + High Profit',
  'dart.quadrant.growthBet': 'Growth Bets',
  'dart.quadrant.growthBetDesc': 'High Growth + Low Profit',
  'dart.quadrant.turnaround': 'Turnaround Needed',
  'dart.quadrant.turnaroundDesc': 'Low Growth + Low Profit',

  // Revenue Convergence
  'dart.convergence.title': 'Revenue Convergence Forecast',
  'dart.convergence.note': 'At current growth rates (GME +26%, GMoney -5.5%), GME overtakes GMoney by 2027',
  'dart.convergence.overtake': 'GME overtakes GMoney',
  'dart.convergence.projected': 'Projected (dotted line = actual/projected boundary)',

  // Margin Erosion Alert
  'dart.marginAlert.title': 'GME Margin Trend Alert',
  'dart.marginAlert.note': 'If current trend continues, margins reach single digits by 2027',

  // Leverage Risk
  'dart.leverage.title': 'Debt Growth vs Revenue Growth',
  'dart.leverage.revGrowth': 'Revenue Growth %',
  'dart.leverage.liabGrowth': 'Liability Growth %',
  'dart.leverage.gmeInsight': "GME's debt is growing 2.3x faster than revenue — unsustainable without correction",

  // Competitive Scorecard
  'dart.scorecard.title': 'Competitive Scorecard',
  'dart.scorecard.growth': 'Growth',
  'dart.scorecard.profitability': 'Profitability',
  'dart.scorecard.leverage': 'Leverage Health',
  'dart.scorecard.efficiency': 'Efficiency',
  'dart.scorecard.scale': 'Scale',

  // E9Pay Transformation
  'dart.e9pay.title': 'Learn from E9Pay: The Transformation Playbook',
  'dart.e9pay.2019loss': 'Op. Loss -1.4B',
  'dart.e9pay.2019debt': 'Debt/Equity 174%',
  'dart.e9pay.2025profit': 'Op. Profit +23.7B',
  'dart.e9pay.2025debt': 'Debt/Equity 9%',
  'dart.e9pay.years': 'years',
  'dart.e9pay.takeaway1.title': 'Cost Discipline',
  'dart.e9pay.takeaway1.body': 'E9Pay maintained 35%+ margins while growing 15%+ annually',
  'dart.e9pay.takeaway2.title': 'Aggressive Deleveraging',
  'dart.e9pay.takeaway2.body': 'Reduced debt ratio from 174% to 9% in 6 years',
  'dart.e9pay.takeaway3.title': 'Profit Before Scale',
  'dart.e9pay.takeaway3.body': 'Prioritized profitability over market share',

  // GMoney Opportunity
  'dart.gmoney.title': 'GMoney Market Opportunity',
  'dart.gmoney.decline': 'GMoney revenue decline (first ever)',
  'dart.gmoney.lostRevenue': 'GMoney lost revenue (~₩2.87B decline)',
  'dart.gmoney.opportunity': 'If GME captures 10% of displaced volume',
  'dart.gmoney.insight': "GMoney's customers may be looking for alternatives — window of opportunity for GME to capture displaced market share",

  // Strategic Analysis section
  'dart.strategicAnalysis': 'Strategic Analysis',

  // Lifecycle
  'dart.lifecycle.e9pay': 'Cash-rich mature fintech, entering capital deployment phase',
  'dart.lifecycle.gmoney': 'Post-peak slowdown, margin compression',
  'dart.lifecycle.hanpass': 'Aggressive growth + IPO, heavily leveraged',
  'dart.lifecycle.gme': 'Fast growth but rising leverage, efficiency declining',
  'dart.lifecycle.sentbe': 'Restructuring, still unprofitable',
};

export default en;
