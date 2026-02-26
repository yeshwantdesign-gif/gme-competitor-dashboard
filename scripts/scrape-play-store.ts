import { config } from 'dotenv';
config({ path: '.env.local' });

async function main() {
  const { runPlayStoreScraper } = await import('../src/lib/scrapers/index');
  const result = await runPlayStoreScraper();
  console.log('Play Store scrape done:', JSON.stringify(result, null, 2));
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
