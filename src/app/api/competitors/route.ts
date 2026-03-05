import { NextResponse } from 'next/server';
import { supabaseAnon } from '@/lib/supabase/server';

export async function GET() {
  // Get all competitors
  const { data: competitors, error: compError } = await supabaseAnon
    .from('competitors')
    .select('*')
    .order('name');

  if (compError) {
    return NextResponse.json({ error: compError.message }, { status: 500 });
  }

  // For each competitor, get latest snapshots and recent counts
  const summaries = await Promise.all(
    (competitors || []).map(async (comp) => {
      // Latest Play Store snapshot
      const { data: playSnap } = await supabaseAnon
        .from('play_store_snapshots')
        .select('rating, ratings_count, downloads')
        .eq('competitor_id', comp.id)
        .order('scraped_at', { ascending: false })
        .limit(1)
        .single();

      // Latest App Store snapshot
      const { data: appSnap } = await supabaseAnon
        .from('app_store_snapshots')
        .select('rating, ratings_count')
        .eq('competitor_id', comp.id)
        .order('scraped_at', { ascending: false })
        .limit(1)
        .single();

      // All-time reviews count
      const { count: recentReviews } = await supabaseAnon
        .from('reviews')
        .select('id', { count: 'exact', head: true })
        .eq('competitor_id', comp.id);

      // Recent news count (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const { count: recentNews } = await supabaseAnon
        .from('news_articles')
        .select('id', { count: 'exact', head: true })
        .eq('competitor_id', comp.id)
        .gte('published_at', thirtyDaysAgo.toISOString());

      return {
        id: comp.id,
        slug: comp.slug,
        name: comp.name,
        type: comp.type,
        icon_url: comp.icon_url ?? null,
        play_store_rating: playSnap?.rating ?? null,
        play_store_ratings_count: playSnap?.ratings_count ?? null,
        play_store_downloads: playSnap?.downloads ?? null,
        app_store_rating: appSnap?.rating ?? null,
        app_store_ratings_count: appSnap?.ratings_count ?? null,
        recent_reviews_count: recentReviews ?? 0,
        recent_news_count: recentNews ?? 0,
      };
    })
  );

  return NextResponse.json(summaries);
}
