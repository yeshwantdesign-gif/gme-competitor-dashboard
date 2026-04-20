// Keywords to filter out irrelevant news (sports, etc.)
export const NEWS_BLACKLIST_KEYWORDS = [
  // Korean sports
  '축구', '야구', '농구', '배구', '스포츠', '경기결과', '선수',
  // Korean leagues
  'KBO', 'KBL', 'K리그',
  // International leagues/events
  'EPL', 'NBA', 'NFL', 'MLB', 'FIFA', '올림픽', 'Olympics',
  // English sports
  'sports', 'baseball', 'football', 'basketball', 'cricket',
  // Match terms
  'goal', 'match', 'tournament', 'league',
];

/**
 * Build a Supabase text-search filter string to exclude blacklisted keywords.
 * Uses .not().ilike() chaining for each keyword on title and snippet.
 */
export function applyBlacklistFilter(query: any) {
  for (const keyword of NEWS_BLACKLIST_KEYWORDS) {
    query = query.not('title', 'ilike', `%${keyword}%`);
  }
  return query;
}
