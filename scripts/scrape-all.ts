import { config } from 'dotenv';
config({ path: '.env.local' });

async function main() {
  const { runAllScrapers } = await import('../src/lib/scrapers/index');
  const result = await runAllScrapers();
  console.log('All scrapers done:', JSON.stringify(result, null, 2));
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
