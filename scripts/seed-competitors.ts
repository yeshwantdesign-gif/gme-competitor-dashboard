import { config } from 'dotenv';
config({ path: '.env.local' });

async function main() {
  const { createClient } = await import('@supabase/supabase-js');
  const { competitors } = await import('../src/lib/competitors/config');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  console.log(`Seeding ${competitors.length} competitors...`);

  for (const c of competitors) {
    const row: Record<string, unknown> = {
      slug: c.slug,
      name: c.name,
      play_store_id: c.playStoreId,
      app_store_id: c.appStoreId,
      news_keywords: c.newsKeywords,
    };
    // Only include country if the table has that column
    if ('country' in c) row.country = c.country;

    const { error } = await supabase.from('competitors').upsert(
      row,
      { onConflict: 'slug' }
    );

    if (error) {
      console.error(`Error seeding ${c.name}:`, error.message);
    } else {
      console.log(`  ✓ ${c.name}`);
    }
  }

  console.log('Done!');
}

main().catch(console.error);
