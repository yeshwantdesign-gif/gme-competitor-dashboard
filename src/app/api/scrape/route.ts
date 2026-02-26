import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { type } = await request.json().catch(() => ({ type: 'all' }));

  // Dynamically import to avoid loading scrapers at module level
  const { runAllScrapers, runPlayStoreScraper, runAppStoreScraper, runNewsScraper } =
    await import('@/lib/scrapers/index');

  let result;
  switch (type) {
    case 'play_store':
      result = await runPlayStoreScraper();
      break;
    case 'app_store':
      result = await runAppStoreScraper();
      break;
    case 'news':
      result = await runNewsScraper();
      break;
    default:
      result = await runAllScrapers();
  }

  return NextResponse.json(result);
}
