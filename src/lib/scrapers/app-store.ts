import store from 'app-store-scraper';
import { supabaseAdmin } from '../supabase/server';

export async function scrapeAppStore(): Promise<{ processed: number; errors: string[] }> {
  const errors: string[] = [];
  let processed = 0;

  const { data: dbCompetitors, error: dbError } = await supabaseAdmin
    .from('competitors')
    .select('id, slug, name, app_store_id, icon_url');

  if (dbError || !dbCompetitors) {
    throw new Error(`Failed to fetch competitors from DB: ${dbError?.message}`);
  }

  for (const comp of dbCompetitors) {
    // Try numeric app_store_id first, then app_store_name
    let appId: number | null = null;
    if (comp.app_store_id) {
      appId = parseInt(comp.app_store_id, 10);
      if (isNaN(appId)) appId = null;
    }

    if (!appId) continue;

    try {
      console.log(`[App Store] Scraping ${comp.name}...`);

      let appData: any;
      if (appId) {
        appData = await store.app({ id: appId });
      } else if (comp.app_store_name) {
        appData = await store.app({ appId: comp.app_store_name });
      } else {
        continue;
      }

      const { error: snapshotError } = await supabaseAdmin
        .from('app_store_snapshots')
        .insert({
          competitor_id: comp.id,
          scraped_at: new Date().toISOString(),
          rating: appData.score ?? null,
          ratings_count: appData.ratings ?? null,
          reviews_count: appData.reviews ?? null,
          version: appData.version ?? null,
        });

      if (snapshotError) {
        errors.push(`${comp.slug}: snapshot insert failed - ${snapshotError.message}`);
      }

      // Update competitor icon_url if we got one and it's not already set
      if (appData.icon && !comp.icon_url) {
        await supabaseAdmin
          .from('competitors')
          .update({ icon_url: appData.icon })
          .eq('id', comp.id);
      }

      // Upsert app update record
      if (appData.version) {
        const { error: updateError } = await supabaseAdmin
          .from('app_updates')
          .upsert(
            {
              competitor_id: comp.id,
              store: 'ios',
              version: appData.version,
              release_date: appData.updated ? new Date(appData.updated).toISOString() : null,
              release_notes: appData.releaseNotes ?? null,
              scraped_at: new Date().toISOString(),
            },
            { onConflict: 'competitor_id,store,version', ignoreDuplicates: true }
          );
        if (updateError) {
          errors.push(`${comp.slug}: app_updates upsert failed - ${updateError.message}`);
        }
      }

      // Fetch reviews
      try {
        const opts: any = { page: 1, sort: store.sort.RECENT };
        if (appId) opts.id = appId;
        else if (comp.app_store_name) opts.appId = comp.app_store_name;

        const reviewsData = await store.reviews(opts);

        if (reviewsData && reviewsData.length > 0) {
          // Insert first 20 reviews (skip dedup for simplicity)
          for (const r of reviewsData.slice(0, 20)) {
            await supabaseAdmin.from('reviews').insert({
              competitor_id: comp.id,
              store: 'ios',
              score: r.score ?? null,
              text: r.text ?? null,
              review_date: r.updated ? new Date(r.updated).toISOString() : null,
              scraped_at: new Date().toISOString(),
            });
          }
        }
      } catch (reviewErr: any) {
        errors.push(`${comp.slug}: reviews fetch failed - ${reviewErr.message}`);
      }

      processed++;
      console.log(`[App Store] Done: ${comp.name} (rating: ${appData.score})`);
    } catch (err: any) {
      errors.push(`${comp.slug}: ${err.message}`);
      console.error(`[App Store] Error for ${comp.name}:`, err.message);
    }

    await new Promise((r) => setTimeout(r, 1500));
  }

  return { processed, errors };
}
