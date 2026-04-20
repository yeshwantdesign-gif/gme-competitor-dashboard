import { scrapePlayStore } from './play-store';
import { scrapeAppStore } from './app-store';
import { supabaseAdmin } from '../supabase/server';

interface ScraperResult {
  processed: number;
  errors: string[];
  scrapeRunId: string;
}

async function createScrapeRun(type: 'play_store' | 'app_store' | 'news' | 'all'): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from('scrape_runs')
    .insert({
      scraper_type: type,
      status: 'running',
      started_at: new Date().toISOString(),
      competitors_processed: 0,
      errors: null,
    })
    .select('id')
    .single();

  if (error || !data) {
    throw new Error(`Failed to create scrape run: ${error?.message}`);
  }

  return data.id;
}

async function completeScrapeRun(
  runId: string,
  processed: number,
  errors: string[]
): Promise<void> {
  const status = errors.length > 0 && processed === 0 ? 'failed' : 'completed';

  const { error } = await supabaseAdmin
    .from('scrape_runs')
    .update({
      status,
      finished_at: new Date().toISOString(),
      competitors_processed: processed,
      errors: errors.length > 0 ? errors : null,
    })
    .eq('id', runId);

  if (error) {
    console.error(`Failed to update scrape run ${runId}:`, error.message);
  }
}

async function failScrapeRun(runId: string, errorMessage: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('scrape_runs')
    .update({
      status: 'failed',
      finished_at: new Date().toISOString(),
      competitors_processed: 0,
      errors: [errorMessage],
    })
    .eq('id', runId);

  if (error) {
    console.error(`Failed to update scrape run ${runId}:`, error.message);
  }
}

export async function runPlayStoreScraper(): Promise<ScraperResult> {
  const runId = await createScrapeRun('play_store');
  console.log(`[Scraper] Play Store run started: ${runId}`);

  try {
    const result = await scrapePlayStore();
    await completeScrapeRun(runId, result.processed, result.errors);
    console.log(`[Scraper] Play Store run completed: ${result.processed} processed, ${result.errors.length} errors`);
    return { ...result, scrapeRunId: runId };
  } catch (err: any) {
    await failScrapeRun(runId, err.message);
    console.error(`[Scraper] Play Store run failed:`, err.message);
    return { processed: 0, errors: [err.message], scrapeRunId: runId };
  }
}

export async function runAppStoreScraper(): Promise<ScraperResult> {
  const runId = await createScrapeRun('app_store');
  console.log(`[Scraper] App Store run started: ${runId}`);

  try {
    const result = await scrapeAppStore();
    await completeScrapeRun(runId, result.processed, result.errors);
    console.log(`[Scraper] App Store run completed: ${result.processed} processed, ${result.errors.length} errors`);
    return { ...result, scrapeRunId: runId };
  } catch (err: any) {
    await failScrapeRun(runId, err.message);
    console.error(`[Scraper] App Store run failed:`, err.message);
    return { processed: 0, errors: [err.message], scrapeRunId: runId };
  }
}

export async function runAllScrapers(): Promise<{
  playStore: ScraperResult;
  appStore: ScraperResult;
  scrapeRunId: string;
}> {
  const runId = await createScrapeRun('all');
  console.log(`[Scraper] Full scrape run started: ${runId}`);

  let totalProcessed = 0;
  const allErrors: string[] = [];

  // Run sequentially to avoid overwhelming APIs
  console.log('\n=== Play Store Scraping ===');
  const playStore = await runPlayStoreScraper();
  totalProcessed += playStore.processed;
  allErrors.push(...playStore.errors.map((e) => `[play_store] ${e}`));

  console.log('\n=== App Store Scraping ===');
  const appStore = await runAppStoreScraper();
  totalProcessed += appStore.processed;
  allErrors.push(...appStore.errors.map((e) => `[app_store] ${e}`));

  // News scraping is handled by AWS Lambda writing directly to Supabase

  await completeScrapeRun(runId, totalProcessed, allErrors);
  console.log(`\n[Scraper] Full run completed: ${totalProcessed} total processed, ${allErrors.length} total errors`);

  return { playStore, appStore, scrapeRunId: runId };
}
