import { NextRequest, NextResponse } from 'next/server';
import { supabaseAnon } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const corpCodes = searchParams.get('corp_codes');
  const yearFrom = parseInt(searchParams.get('year_from') || '2019');
  const yearTo = parseInt(searchParams.get('year_to') || String(new Date().getFullYear()));

  let query = supabaseAnon
    .from('dart_financials')
    .select('*')
    .gte('bsns_year', yearFrom)
    .lte('bsns_year', yearTo)
    .eq('reprt_code', '11011') // Annual reports
    .order('bsns_year', { ascending: true });

  if (corpCodes) {
    const codes = corpCodes.split(',').filter(Boolean);
    if (codes.length === 1) {
      query = query.eq('corp_code', codes[0]);
    } else if (codes.length > 1) {
      query = query.in('corp_code', codes);
    }
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [] });
}
