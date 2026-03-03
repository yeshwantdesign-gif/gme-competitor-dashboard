import { NextRequest, NextResponse } from 'next/server';
import { supabaseAnon } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const competitorIds = searchParams.get('competitor_ids');
  const dateFrom = searchParams.get('date_from');
  const dateTo = searchParams.get('date_to');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');

  let query = supabaseAnon
    .from('news_articles')
    .select('*, competitors!inner(name, slug, icon_url)', { count: 'exact' });

  if (competitorIds) {
    const ids = competitorIds.split(',').filter(Boolean);
    if (ids.length === 1) {
      query = query.eq('competitor_id', ids[0]);
    } else if (ids.length > 1) {
      query = query.in('competitor_id', ids);
    }
  }
  if (dateFrom) query = query.gte('published_at', dateFrom);
  if (dateTo) query = query.lte('published_at', dateTo);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await query
    .order('published_at', { ascending: false })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data: data ?? [],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  });
}
