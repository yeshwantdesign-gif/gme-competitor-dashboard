import { NextResponse } from 'next/server';
import { supabaseAnon } from '@/lib/supabase/server';

export async function GET() {
  const { data, error } = await supabaseAnon
    .from('dart_financial_ratios')
    .select('*')
    .order('year', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [] });
}
