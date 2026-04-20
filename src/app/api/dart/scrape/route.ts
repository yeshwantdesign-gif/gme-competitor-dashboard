import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { fetchCorpCodes, fetchFinancialStatement } from '@/lib/dart/client';
import { DART_COMPANIES, REPRT_CODES } from '@/lib/dart/config';

export const maxDuration = 120; // Allow up to 2 minutes

export async function POST(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: { company: string; years: number; errors: string[] }[] = [];

  try {
    // Step 1: Find corp codes for our companies
    const allCorpCodes = await fetchCorpCodes();

    const matched: { company: typeof DART_COMPANIES[number]; corpCode: string; corpName: string; stockCode: string }[] = [];

    for (const company of DART_COMPANIES) {
      let found = false;

      // First try stock code if available
      if (company.stockCode) {
        const entry = allCorpCodes.find((e) => e.stock_code === company.stockCode);
        if (entry) {
          matched.push({ company, corpCode: entry.corp_code, corpName: entry.corp_name, stockCode: entry.stock_code });
          found = true;
        }
      }

      // Then try search terms
      if (!found) {
        for (const term of company.searchTerms) {
          const entry = allCorpCodes.find((e) =>
            e.corp_name.includes(term) || e.corp_name === term
          );
          if (entry) {
            matched.push({ company, corpCode: entry.corp_code, corpName: entry.corp_name, stockCode: entry.stock_code });
            found = true;
            break;
          }
        }
      }

      if (!found) {
        results.push({ company: company.name, years: 0, errors: ['Corp code not found in DART'] });
      }
    }

    // Step 2: Save corp code mappings
    for (const m of matched) {
      await supabaseAdmin.from('dart_corp_codes').upsert(
        {
          corp_code: m.corpCode,
          corp_name: m.corpName,
          stock_code: m.stockCode || null,
        },
        { onConflict: 'corp_code' }
      );
    }

    // Step 3: Fetch financials for each matched company (last 6 years, annual)
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 5;

    for (const m of matched) {
      const companyErrors: string[] = [];
      let yearsInserted = 0;

      for (let year = startYear; year <= currentYear; year++) {
        try {
          const data = await fetchFinancialStatement(m.corpCode, year, REPRT_CODES.ANNUAL);
          if (!data) {
            // Not an error — some years may not have data yet
            continue;
          }

          const { error } = await supabaseAdmin.from('dart_financials').upsert(
            {
              corp_code: m.corpCode,
              corp_name: m.corpName,
              stock_code: m.stockCode || null,
              bsns_year: data.bsns_year,
              reprt_code: data.reprt_code,
              fs_div: data.fs_div,
              revenue: data.revenue,
              operating_profit: data.operating_profit,
              net_income: data.net_income,
              total_assets: data.total_assets,
              total_liabilities: data.total_liabilities,
              total_equity: data.total_equity,
            },
            { onConflict: 'corp_code,bsns_year,reprt_code,fs_div' }
          );

          if (error) {
            companyErrors.push(`${year}: ${error.message}`);
          } else {
            yearsInserted++;
          }
        } catch (err) {
          companyErrors.push(`${year}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }

        // Rate limit: DART allows ~100 req/min
        await new Promise((r) => setTimeout(r, 700));
      }

      results.push({ company: m.company.name, years: yearsInserted, errors: companyErrors });
    }

    return NextResponse.json({
      success: true,
      matched: matched.length,
      total: DART_COMPANIES.length,
      results,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
