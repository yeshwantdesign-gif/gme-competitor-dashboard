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
