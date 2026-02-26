import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const secret = request.headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { runAllScrapers } = await import('@/lib/scrapers/index');
  const result = await runAllScrapers();

  return NextResponse.json(result);
}
