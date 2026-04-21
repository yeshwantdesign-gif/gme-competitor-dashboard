/**
 * Consistent company colors used across all DART charts and components.
 * Keys are Korean corp names (as stored in DB) and English display names.
 */
export const DART_COMPANY_COLORS: Record<string, string> = {
  // English names
  'GME Remittance': '#EF4444',   // Red
  'GMoney Transfer': '#10B981',  // Green
  'SentBe': '#38BDF8',           // Light Blue
  'Hanpass': '#1E3A8A',          // Dark Royal Blue
  'E9Pay': '#F59E0B',            // Yellow
  // Short names (for ratio charts)
  'GME': '#EF4444',
  'GMoney': '#10B981',
  // Korean names (as stored in dart_financials)
  '글로벌머니익스프레스': '#EF4444',
  '지머니트랜스': '#10B981',
  '센트비': '#38BDF8',
  '한패스': '#1E3A8A',
  '이나인페이': '#F59E0B',
};

/** Get the chart color for a company name (Korean or English). Falls back to gray. */
export function dartCompanyColor(name: string): string {
  if (DART_COMPANY_COLORS[name]) return DART_COMPANY_COLORS[name];
  // Partial match for Korean names embedded in longer strings
  for (const [key, color] of Object.entries(DART_COMPANY_COLORS)) {
    if (name.includes(key)) return color;
  }
  return '#6B7280';
}

/**
 * Format number in millions KRW to a readable string
 * Input is already in millions (divided by 1_000_000)
 */
export function formatKrwBillions(valueInMillions: number): string {
  if (valueInMillions == null) return '-';
  const abs = Math.abs(valueInMillions);
  const sign = valueInMillions < 0 ? '-' : '';
  if (abs >= 1_000_000) {
    return `${sign}${(abs / 1_000_000).toFixed(1)}T`;
  }
  if (abs >= 1_000) {
    return `${sign}${(abs / 1_000).toFixed(1)}B`;
  }
  return `${sign}${abs.toFixed(0)}M`;
}

/**
 * Calculate year-over-year growth percentage
 */
export function calcYoY(current: number | null, previous: number | null): number | null {
  if (current == null || previous == null || previous === 0) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}
