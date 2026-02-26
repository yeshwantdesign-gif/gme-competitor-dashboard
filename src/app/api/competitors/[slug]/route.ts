import { NextRequest, NextResponse } from 'next/server';
import { supabaseAnon } from '@/lib/supabase/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Get competitor
  const { data: competitor, error } = await supabaseAnon
    .from('competitors')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !competitor) {
    return NextResponse.json({ error: 'Competitor not found' }, { status: 404 });
  }

  // Get Play Store history (last 90 days)
  const { data: playHistory } = await supabaseAnon
    .from('play_store_snapshots')
    .select('*')
    .eq('competitor_id', competitor.id)
    .order('scraped_at', { ascending: true })
    .limit(90);

  // Get App Store history (last 90 days)
  const { data: appHistory } = await supabaseAnon
    .from('app_store_snapshots')
    .select('*')
    .eq('competitor_id', competitor.id)
    .order('scraped_at', { ascending: true })
    .limit(90);

  // Latest snapshots
  const latestPlay = playHistory?.length ? playHistory[playHistory.length - 1] : null;
  const latestApp = appHistory?.length ? appHistory[appHistory.length - 1] : null;

  // Recent reviews (last 50)
  const { data: reviews } = await supabaseAnon
    .from('reviews')
    .select('*')
    .eq('competitor_id', competitor.id)
    .order('review_date', { ascending: false })
    .limit(50);

  // Recent news (last 20)
  const { data: news } = await supabaseAnon
    .from('news_articles')
    .select('*')
    .eq('competitor_id', competitor.id)
    .order('published_at', { ascending: false })
    .limit(20);

  // Recent counts
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { count: recentReviews } = await supabaseAnon
    .from('reviews')
    .select('id', { count: 'exact', head: true })
    .eq('competitor_id', competitor.id)
    .gte('review_date', thirtyDaysAgo.toISOString());

  const { count: recentNews } = await supabaseAnon
    .from('news_articles')
    .select('id', { count: 'exact', head: true })
    .eq('competitor_id', competitor.id)
    .gte('published_at', thirtyDaysAgo.toISOString());

  return NextResponse.json({
    id: competitor.id,
    slug: competitor.slug,
    name: competitor.name,
    type: competitor.type,
    icon_url: competitor.icon_url ?? null,
    play_store_rating: latestPlay?.rating ?? null,
    play_store_ratings_count: latestPlay?.ratings_count ?? null,
    play_store_downloads: latestPlay?.downloads ?? null,
    app_store_rating: latestApp?.rating ?? null,
    app_store_ratings_count: latestApp?.ratings_count ?? null,
    recent_reviews_count: recentReviews ?? 0,
    recent_news_count: recentNews ?? 0,
    play_store_history: playHistory ?? [],
    app_store_history: appHistory ?? [],
    recent_reviews: reviews ?? [],
    recent_news: news ?? [],
  });
}
