import { NextResponse } from 'next/server';
import { supabaseAnon } from '@/lib/supabase/server';

export async function GET() {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekStr = weekAgo.toISOString();

  const { data: competitors, error: compError } = await supabaseAnon
    .from('competitors')
    .select('*')
    .order('name');

  if (compError) {
    return NextResponse.json({ error: compError.message }, { status: 500 });
  }

  const summaries = await Promise.all(
    (competitors || []).map(async (comp) => {
      // Latest Play Store snapshot (for downloads)
      const { data: playSnap } = await supabaseAnon
        .from('play_store_snapshots')
        .select('rating, ratings_count, downloads, scraped_at')
        .eq('competitor_id', comp.id)
        .order('scraped_at', { ascending: false })
        .limit(1)
        .single();

      // Previous Play Store snapshot (for downloads trend)
      const { data: prevPlaySnap } = await supabaseAnon
        .from('play_store_snapshots')
        .select('downloads')
        .eq('competitor_id', comp.id)
        .order('scraped_at', { ascending: false })
        .range(1, 1)
        .single();

      // Latest App Store snapshot
      const { data: appSnap } = await supabaseAnon
        .from('app_store_snapshots')
        .select('rating, ratings_count')
        .eq('competitor_id', comp.id)
        .order('scraped_at', { ascending: false })
        .limit(1)
        .single();

      // App updates this week
      const { count: updatesThisWeek } = await supabaseAnon
        .from('app_updates')
        .select('id', { count: 'exact', head: true })
        .eq('competitor_id', comp.id)
        .gte('release_date', weekStr);

      // News this week
      const { count: newsThisWeek } = await supabaseAnon
        .from('news_articles')
        .select('id', { count: 'exact', head: true })
        .eq('competitor_id', comp.id)
        .gte('published_at', weekStr);

      return {
        id: comp.id,
        slug: comp.slug,
        name: comp.name,
        type: comp.type,
        icon_url: comp.icon_url ?? null,
        play_store_rating: playSnap?.rating ?? null,
        play_store_ratings_count: playSnap?.ratings_count ?? null,
        play_store_downloads: playSnap?.downloads ?? null,
        prev_play_store_downloads: prevPlaySnap?.downloads ?? null,
        app_store_rating: appSnap?.rating ?? null,
        app_store_ratings_count: appSnap?.ratings_count ?? null,
        app_updates_this_week: updatesThisWeek ?? 0,
        news_this_week: newsThisWeek ?? 0,
      };
    })
  );

  // Weekly summary highlights
  const { data: recentUpdates } = await supabaseAnon
    .from('app_updates')
    .select('*, competitors!inner(name, slug, icon_url)')
    .gte('release_date', weekStr)
    .order('release_date', { ascending: false })
    .limit(5);

  // Fetch extra news to allow for deduplication
  const { data: rawNews } = await supabaseAnon
    .from('news_articles')
    .select('*, competitors!inner(name, slug, icon_url)')
    .gte('published_at', weekStr)
    .order('published_at', { ascending: false })
    .limit(20);

  // Deduplicate news by normalized title
  const recentNews = deduplicateNews(rawNews ?? []).slice(0, 5);

  const { data: notableReviews } = await supabaseAnon
    .from('reviews')
    .select('*, competitors!inner(name, slug, icon_url)')
    .gte('review_date', weekStr)
    .order('review_date', { ascending: false })
    .limit(5);

  return NextResponse.json({
    competitors: summaries,
    highlights: {
      updates: recentUpdates ?? [],
      news: recentNews,
      reviews: notableReviews ?? [],
    },
  });
}

function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9가-힣]/g, '');
}

function similarity(a: string, b: string): number {
  if (a === b) return 1;
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  if (longer.length === 0) return 1;
  if (longer.includes(shorter)) return shorter.length / longer.length;
  return 0;
}

function deduplicateNews<T extends { title: string }>(articles: T[]): T[] {
  const seen: string[] = [];
  return articles.filter((article) => {
    const norm = normalizeTitle(article.title);
    for (const prev of seen) {
      if (similarity(norm, prev) > 0.6) return false;
    }
    seen.push(norm);
    return true;
  });
}
