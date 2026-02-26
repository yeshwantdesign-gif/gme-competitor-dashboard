import { config } from 'dotenv';
config({ path: '.env.local' });

async function main() {
  const { runNewsScraper } = await import('../src/lib/scrapers/index');
  const result = await runNewsScraper();
  console.log('News scrape done:', JSON.stringify(result, null, 2));
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
