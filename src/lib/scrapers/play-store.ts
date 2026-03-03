import { chromium, type Browser, type Page } from 'playwright';
import gplay from 'google-play-scraper';
import { supabaseAdmin } from '../supabase/server';

interface PlayStoreData {
  rating: number | null;
  ratingsCount: number | null;
  reviewsCount: number | null;
  downloads: string | null;
  version: string | null;
  releaseNotes: string | null;
  releaseDate: string | null;
  iconUrl: string | null;
}

/**
 * Parse Korean number format:
 *   "5.07천개" → 5070, "171만개" → 1710000, "1,000만+" → 10000000
 * Also handles plain numbers: "8,340" → 8340, "329" → 329
 * And English suffixes: "5K" → 5000, "1.71M" → 1710000
 */
function parseKoreanCount(text: string): number | null {
  if (!text) return null;
  const cleaned = text.replace(/[개+]/g, '').trim();

  // Korean: X천 (천 = 1,000)
  const cheonMatch = cleaned.match(/([\d,.]+)\s*천/);
  if (cheonMatch) {
    const num = parseFloat(cheonMatch[1].replace(/,/g, ''));
    return Math.round(num * 1_000);
  }

  // Korean: X만 (만 = 10,000)
  const manMatch = cleaned.match(/([\d,.]+)\s*만/);
  if (manMatch) {
    const num = parseFloat(manMatch[1].replace(/,/g, ''));
    return Math.round(num * 10_000);
  }

  // Korean: X억 (억 = 100,000,000)
  const eokMatch = cleaned.match(/([\d,.]+)\s*억/);
  if (eokMatch) {
    const num = parseFloat(eokMatch[1].replace(/,/g, ''));
    return Math.round(num * 100_000_000);
  }

  // English: X K/M/B
  const engMatch = cleaned.replace(/,/g, '').match(/^([\d.]+)\s*([KMB])?$/i);
  if (engMatch) {
    const num = parseFloat(engMatch[1]);
    const suffix = (engMatch[2] || '').toUpperCase();
    if (suffix === 'K') return Math.round(num * 1_000);
    if (suffix === 'M') return Math.round(num * 1_000_000);
    if (suffix === 'B') return Math.round(num * 1_000_000_000);
    return Math.round(num);
  }

  // Plain number with commas
  const plain = cleaned.replace(/,/g, '');
  const num = parseFloat(plain);
  return isNaN(num) ? null : Math.round(num);
}

async function scrapeAppPage(page: Page, packageId: string): Promise<PlayStoreData | null> {
  const url = `https://play.google.com/store/apps/details?id=${packageId}&hl=ko&gl=kr`;

  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

  if (!response || response.status() === 404) {
    return null;
  }

  // Check for "not found" page
  const bodyText = (await page.textContent('body')) || '';
  if (
    bodyText.includes("We're sorry, the requested URL was not found") ||
    (bodyText.includes('not found') && bodyText.length < 500)
  ) {
    return null;
  }

  // Wait for content to load
  await page.waitForTimeout(2000);

  // Extract data using page.evaluate for reliability
  const extracted = await page.evaluate(() => {
    const result: Record<string, string> = {};
    const body = document.body.innerText;

    // Icon URL
    const iconImg = document.querySelector('img[itemprop="image"]');
    if (iconImg) {
      result.iconUrl = iconImg.getAttribute('src') || '';
    }
    if (!result.iconUrl) {
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) result.iconUrl = ogImage.getAttribute('content') || '';
    }

    // Rating: "4.8\nstar" - "star" is still in English even on Korean pages
    const ratingMatch = body.match(/([\d.]+)\s*\n?\s*star/i);
    if (ratingMatch) result.rating = ratingMatch[1];

    // Reviews (Korean): "리뷰 5.07천개" or "리뷰 171만개" or "리뷰 329개"
    const reviewsKoMatch = body.match(/리뷰\s+([\d,.]+(?:천|만)?)\s*개/);
    if (reviewsKoMatch) {
      result.reviews = reviewsKoMatch[1] + '개';
    }
    // Reviews (English fallback): "1.71M reviews"
    if (!result.reviews) {
      const reviewsEnMatch = body.match(/([\d,.]+[KMB]?)\s*reviews/i);
      if (reviewsEnMatch) result.reviews = reviewsEnMatch[1];
    }

    // Downloads (Korean): "50만+\n다운로드" or "1,000만+\n다운로드" or "100+\n다운로드"
    const downloadsKoMatch = body.match(/([\d,.]+(?:천|만)?\+?)\s*\n?\s*다운로드/);
    if (downloadsKoMatch) {
      result.downloads = downloadsKoMatch[1];
    }
    // Downloads (English fallback): "10M+ Downloads"
    if (!result.downloads) {
      const downloadsEnMatch = body.match(/([\d,.]+[KMB]?\+?)\s*Downloads/i);
      if (downloadsEnMatch) result.downloads = downloadsEnMatch[1];
    }

    // Version: from "앱 정보" (About this app) section or version pattern
    const versionMatch = body.match(/버전\s*\n?\s*([\d.]+)/i);
    if (versionMatch) result.version = versionMatch[1];
    if (!result.version) {
      const altVersion = body.match(/Version\s*\n?\s*([\d.]+)/i);
      if (altVersion) result.version = altVersion[1];
    }
    if (!result.version) {
      const numVersion = body.match(/(\d+\.\d+\.\d+[\d.]*)/);
      if (numVersion) result.version = numVersion[1];
    }

    // What's New (Korean: "새로운 기능", English: "What's new")
    const whatsNewSection = document.querySelector('[data-g-id="description"]');
    if (whatsNewSection) {
      const text = whatsNewSection.textContent?.trim();
      if (text) result.releaseNotes = text;
    }
    if (!result.releaseNotes) {
      const whatsNewMatch = body.match(/새로운\s*기능\s*\n([\s\S]*?)(?=\n\n|\n[^\s])/);
      if (whatsNewMatch) result.releaseNotes = whatsNewMatch[1].trim();
    }
    if (!result.releaseNotes) {
      const whatsNewEn = body.match(/What's new\s*\n([\s\S]*?)(?=\n\n|\n[^\s])/i);
      if (whatsNewEn) result.releaseNotes = whatsNewEn[1].trim();
    }

    // Updated on date (Korean: "업데이트 날짜", English: "Updated on")
    const dateKoMatch = body.match(/업데이트\s*날짜\s*\n?\s*(\d{4}[.\-/]\s*\d{1,2}[.\-/]\s*\d{1,2})/);
    if (dateKoMatch) result.releaseDate = dateKoMatch[1].replace(/\s/g, '');
    if (!result.releaseDate) {
      const dateEnMatch = body.match(/Updated on\s*\n?\s*(\w+ \d{1,2},?\s*\d{4})/i);
      if (dateEnMatch) result.releaseDate = dateEnMatch[1];
    }

    return result;
  });

  const data: PlayStoreData = {
    rating: null,
    ratingsCount: null,
    reviewsCount: null,
    downloads: null,
    version: null,
    releaseNotes: null,
    releaseDate: null,
    iconUrl: extracted.iconUrl || null,
  };

  if (extracted.rating) {
    const parsed = parseFloat(extracted.rating);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 5) {
      data.rating = parsed;
    }
  }

  if (extracted.reviews) {
    data.reviewsCount = parseKoreanCount(extracted.reviews);
    data.ratingsCount = data.reviewsCount;
  }

  // Store downloads as the raw display string (e.g., "1,000만+", "50만+")
  data.downloads = extracted.downloads || null;
  data.version = extracted.version || null;
  data.releaseNotes = extracted.releaseNotes || null;

  // Parse release date
  if (extracted.releaseDate) {
    const parsed = new Date(extracted.releaseDate);
    data.releaseDate = isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }

  return data;
}

export async function scrapePlayStore(): Promise<{ processed: number; errors: string[] }> {
  const errors: string[] = [];
  let processed = 0;

  const { data: dbCompetitors, error: dbError } = await supabaseAdmin
    .from('competitors')
    .select('id, slug, name, play_store_id, icon_url');

  if (dbError || !dbCompetitors) {
    throw new Error(`Failed to fetch competitors from DB: ${dbError?.message}`);
  }

  let browser: Browser | null = null;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      locale: 'ko-KR',
    });

    const page = await context.newPage();

    for (const comp of dbCompetitors) {
      if (!comp.play_store_id) continue;

      try {
        console.log(`[Play Store] Scraping ${comp.name} (${comp.play_store_id})...`);

        const appData = await scrapeAppPage(page, comp.play_store_id);

        if (!appData) {
          const msg = 'App not found (404)';
          errors.push(`${comp.slug}: ${msg}`);
          console.error(`[Play Store] Error for ${comp.name}: ${msg}`);
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }

        // Insert snapshot
        const { error: snapshotError } = await supabaseAdmin
          .from('play_store_snapshots')
          .insert({
            competitor_id: comp.id,
            scraped_at: new Date().toISOString(),
            rating: appData.rating,
            ratings_count: appData.ratingsCount,
            reviews_count: appData.reviewsCount,
            downloads: appData.downloads,
            version: appData.version,
          });

        if (snapshotError) {
          errors.push(`${comp.slug}: snapshot insert failed - ${snapshotError.message}`);
          console.error(`[Play Store] Insert error for ${comp.name}: ${snapshotError.message}`);
        } else {
          processed++;
          console.log(
            `[Play Store] Done: ${comp.name} (rating: ${appData.rating}, downloads: ${appData.downloads}, reviews: ${appData.reviewsCount})`
          );
        }

        // Update competitor icon_url if we got one and it's not already set
        if (appData.iconUrl && !comp.icon_url) {
          await supabaseAdmin
            .from('competitors')
            .update({ icon_url: appData.iconUrl })
            .eq('id', comp.id);
        }

        // Fetch structured app data via google-play-scraper for reliable version info
        let gplayVersion: string | null = null;
        let gplayReleaseDate: string | null = null;
        let gplayReleaseNotes: string | null = null;
        try {
          const gplayData = await gplay.app({
            appId: comp.play_store_id,
            lang: 'ko',
            country: 'kr',
          });
          gplayVersion = gplayData.version ?? null;
          gplayReleaseDate = gplayData.updated
            ? new Date(gplayData.updated).toISOString()
            : null;
          gplayReleaseNotes = gplayData.recentChanges ?? null;
        } catch (gplayErr: any) {
          console.warn(`[Play Store] gplay.app() failed for ${comp.name}: ${gplayErr.message}`);
        }

        // Use google-play-scraper data if available, fallback to Playwright data
        const finalVersion = gplayVersion || appData.version;
        const finalReleaseDate = gplayReleaseDate || appData.releaseDate;
        const finalReleaseNotes = gplayReleaseNotes || appData.releaseNotes;

        // Upsert app update record
        if (finalVersion) {
          const { error: updateError } = await supabaseAdmin
            .from('app_updates')
            .upsert(
              {
                competitor_id: comp.id,
                store: 'android',
                version: finalVersion,
                release_date: finalReleaseDate,
                release_notes: finalReleaseNotes,
                scraped_at: new Date().toISOString(),
              },
              { onConflict: 'competitor_id,store,version', ignoreDuplicates: true }
            );
          if (updateError) {
            errors.push(`${comp.slug}: app_updates upsert failed - ${updateError.message}`);
          } else {
            console.log(`[Play Store] App update: ${comp.name} v${finalVersion} (${finalReleaseDate ? new Date(finalReleaseDate).toLocaleDateString() : 'no date'})`);
          }
        }

        // Fetch Play Store reviews using google-play-scraper
        try {
          console.log(`[Play Store] Fetching reviews for ${comp.name}...`);
          const reviewsResult = await gplay.reviews({
            appId: comp.play_store_id,
            sort: gplay.sort.NEWEST,
            num: 20,
            lang: 'ko',
            country: 'kr',
          });

          const reviewsData = reviewsResult.data;
          if (reviewsData && reviewsData.length > 0) {
            for (const r of reviewsData) {
              await supabaseAdmin.from('reviews').insert({
                competitor_id: comp.id,
                store: 'android',
                score: r.score ?? null,
                text: r.text ?? null,
                review_date: r.date ? new Date(r.date).toISOString() : null,
                scraped_at: new Date().toISOString(),
              });
            }
            console.log(`[Play Store] Inserted ${reviewsData.length} reviews for ${comp.name}`);
          }
        } catch (reviewErr: any) {
          errors.push(`${comp.slug}: play store reviews fetch failed - ${reviewErr.message}`);
          console.error(`[Play Store] Reviews error for ${comp.name}:`, reviewErr.message);
        }
      } catch (err: any) {
        errors.push(`${comp.slug}: ${err.message}`);
        console.error(`[Play Store] Error for ${comp.name}:`, err.message);
      }

      // Rate limiting delay between requests
      await new Promise((r) => setTimeout(r, 2000));
    }

    await context.close();
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  return { processed, errors };
}
