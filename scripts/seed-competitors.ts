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
    const { error } = await supabase.from('competitors').upsert(
      {
        slug: c.slug,
        name: c.name,
        country: c.country,
        play_store_id: c.playStoreId,
        app_store_id: c.appStoreId,
        news_keywords: c.newsKeywords,
      },
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
