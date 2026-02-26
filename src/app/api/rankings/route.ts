import { NextRequest, NextResponse } from 'next/server';
import { supabaseAnon } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sortBy = searchParams.get('sort_by') || 'combined_rating';

  // Get all competitors
  const { data: competitors } = await supabaseAnon
    .from('competitors')
    .select('*')
    .order('name');

  if (!competitors) {
    return NextResponse.json([]);
  }

  const rankings = await Promise.all(
    competitors.map(async (comp) => {
      const { data: playSnap } = await supabaseAnon
        .from('play_store_snapshots')
        .select('rating, ratings_count, downloads')
        .eq('competitor_id', comp.id)
        .order('scraped_at', { ascending: false })
        .limit(1)
        .single();

      const { data: appSnap } = await supabaseAnon
        .from('app_store_snapshots')
        .select('rating, ratings_count')
        .eq('competitor_id', comp.id)
        .order('scraped_at', { ascending: false })
        .limit(1)
        .single();

      const playRating = playSnap?.rating ? parseFloat(String(playSnap.rating)) : null;
      const appRating = appSnap?.rating ? parseFloat(String(appSnap.rating)) : null;

      let combinedRating: number | null = null;
      if (playRating && appRating) combinedRating = (playRating + appRating) / 2;
      else if (playRating) combinedRating = playRating;
      else if (appRating) combinedRating = appRating;

      const totalRatings =
        (playSnap?.ratings_count || 0) + (appSnap?.ratings_count || 0) || null;

      return {
        competitor: comp,
        play_store_rating: playRating,
        app_store_rating: appRating,
        combined_rating: combinedRating,
        total_ratings: totalRatings,
        play_store_downloads: playSnap?.downloads ?? null,
      };
    })
  );

  // Sort
  rankings.sort((a, b) => {
    const key = sortBy as keyof typeof a;
    const aVal = a[key];
    const bVal = b[key];
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    if (typeof aVal === 'number' && typeof bVal === 'number') return bVal - aVal;
    return String(bVal).localeCompare(String(aVal));
  });

  // Add rank
  const ranked = rankings.map((entry, i) => ({
    rank: i + 1,
    ...entry,
  }));

  return NextResponse.json(ranked);
}
