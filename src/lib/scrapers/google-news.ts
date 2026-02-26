import { XMLParser } from 'fast-xml-parser';
import { supabaseAdmin } from '../supabase/server';
import { newsKeywordsByName } from '../competitors/config';

interface RssItem {
  title?: string;
  link?: string;
  pubDate?: string;
  source?: string | { '#text'?: string; '@_url'?: string };
}

export async function scrapeGoogleNews(): Promise<{ processed: number; errors: string[] }> {
  const errors: string[] = [];
  let processed = 0;

  const { data: dbCompetitors, error: dbError } = await supabaseAdmin
    .from('competitors')
    .select('id, slug, name');

  if (dbError || !dbCompetitors) {
    throw new Error(`Failed to fetch competitors from DB: ${dbError?.message}`);
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  });

  for (const comp of dbCompetitors) {
    const keywords = newsKeywordsByName[comp.name];
    if (!keywords || keywords.length === 0) continue;

    try {
      console.log(`[News] Scraping news for ${comp.name}...`);

      const articles: {
        competitor_id: string;
        title: string;
        url: string;
        source: string | null;
        published_at: string | null;
        snippet: string | null;
      }[] = [];

      for (const keyword of keywords) {
        try {
          const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(keyword)}&hl=en`;
          const response = await fetch(rssUrl);

          if (!response.ok) {
            errors.push(`${comp.slug}: RSS fetch failed for "${keyword}" (${response.status})`);
            continue;
          }

          const xml = await response.text();
          const parsed = parser.parse(xml);
          const channel = parsed?.rss?.channel;
          if (!channel) continue;

          let items: RssItem[] = channel.item || [];
          if (!Array.isArray(items)) items = [items];

          for (const item of items) {
            const title = item.title || '';
            const link = item.link || '';
            if (!link) continue;

            let sourceName: string | null = null;
            if (typeof item.source === 'string') {
              sourceName = item.source;
            } else if (item.source && typeof item.source === 'object') {
              sourceName = item.source['#text'] || null;
            }

            let publishedAt: string | null = null;
            if (item.pubDate) {
              try {
                publishedAt = new Date(item.pubDate).toISOString();
              } catch {
                publishedAt = null;
              }
            }

            articles.push({
              competitor_id: comp.id,
              title,
              url: link,
              source: sourceName,
              published_at: publishedAt,
              snippet: null,
            });
          }

          await new Promise((r) => setTimeout(r, 500));
        } catch (keywordErr: any) {
          errors.push(`${comp.slug}: keyword "${keyword}" failed - ${keywordErr.message}`);
        }
      }

      // Deduplicate by URL
      const seen = new Set<string>();
      const uniqueArticles = articles.filter((a) => {
        if (seen.has(a.url)) return false;
        seen.add(a.url);
        return true;
      });

      // Check existing URLs to avoid duplicates
      if (uniqueArticles.length > 0) {
        const { data: existing } = await supabaseAdmin
          .from('news_articles')
          .select('url')
          .eq('competitor_id', comp.id);

        const existingUrls = new Set((existing || []).map((e: any) => e.url));
        const newArticles = uniqueArticles.filter((a) => !existingUrls.has(a.url));

        if (newArticles.length > 0) {
          const batchSize = 50;
          for (let i = 0; i < newArticles.length; i += batchSize) {
            const batch = newArticles.slice(i, i + batchSize);
            const { error: insertError } = await supabaseAdmin
              .from('news_articles')
              .insert(batch);

            if (insertError) {
              errors.push(`${comp.slug}: news insert failed - ${insertError.message}`);
            }
          }
        }
      }

      processed++;
      console.log(`[News] Done: ${comp.name} (${uniqueArticles.length} articles)`);
    } catch (err: any) {
      errors.push(`${comp.slug}: ${err.message}`);
      console.error(`[News] Error for ${comp.name}:`, err.message);
    }

    await new Promise((r) => setTimeout(r, 1500));
  }

  return { processed, errors };
}
