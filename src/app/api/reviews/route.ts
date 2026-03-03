import { NextRequest, NextResponse } from 'next/server';
import { supabaseAnon } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const competitorIds = searchParams.get('competitor_ids');
  const store = searchParams.get('store');
  const minScore = searchParams.get('min_score');
  const maxScore = searchParams.get('max_score');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');

  let query = supabaseAnon
    .from('reviews')
    .select('*, competitors!inner(name, slug, icon_url)', { count: 'exact' });

  if (competitorIds) {
    const ids = competitorIds.split(',').filter(Boolean);
    if (ids.length === 1) {
      query = query.eq('competitor_id', ids[0]);
    } else if (ids.length > 1) {
      query = query.in('competitor_id', ids);
    }
  }
  if (store) query = query.eq('store', store);
  if (minScore) query = query.gte('score', parseInt(minScore));
  if (maxScore) query = query.lte('score', parseInt(maxScore));

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await query
    .order('review_date', { ascending: false })
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
