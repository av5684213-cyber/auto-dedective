// ─── Cron: Kaydedilmiş aramaları kontrol et ───

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import ZAI from "z-ai-web-dev-sdk";
import { withTimeout } from "@/lib/ai";

export const dynamic = "force-dynamic";

function buildSearchQuery(filters: Record<string, unknown>): string[] {
  const queries: string[] = [];
  const brand = (filters.brand as string) || "";
  const model = (filters.model as string) || "";
  const yearMin = (filters.yearMin as number) || 2010;
  const yearMax = (filters.yearMax as number) || 2026;
  const fuelTypes: string[] = (filters.fuelTypes as string[]) || [];
  const transTypes: string[] = (filters.transTypes as string[]) || [];
  const priceMax = (filters.priceMax as number) || 0;
  const kmMax = (filters.kmMax as number) || 0;

  const brandModel = [brand, model].filter(Boolean).join(" ");
  const carDesc = brandModel || "ikinci el araba";
  let baseQuery = `${carDesc} ikinci el satılık`;
  if (yearMin > 2010 || yearMax < 2026) baseQuery += ` ${yearMin}-${yearMax} model`;
  if (fuelTypes.length > 0) baseQuery += ` ${fuelTypes.join(" ")}`;
  if (transTypes.length > 0) baseQuery += ` ${transTypes.join(" ")}`;
  if (priceMax > 0) baseQuery += ` max ${priceMax} TL`;
  if (kmMax > 0 && kmMax < 500000) baseQuery += ` ${kmMax} km altı`;

  queries.push(`${baseQuery} site:sahibinden.com`);
  queries.push(`${baseQuery} site:arabam.com`);
  queries.push(`${baseQuery} site:letgo.com`);
  return queries;
}

function identifySource(hostname: string): string {
  if (hostname.includes("sahibinden")) return "sahibinden.com";
  if (hostname.includes("arabam")) return "arabam.com";
  if (hostname.includes("letgo")) return "letgo.com";
  return hostname;
}

export async function GET() {
  try {
    const activeSearches = await db.savedSearch.findMany({ where: { isActive: true } });
    let totalNew = 0;

    for (const search of activeSearches) {
      try {
        const filters = JSON.parse(search.queryJson);
        const zai = await ZAI.create();
        const searchQueries = buildSearchQuery(filters);
        const allResults: { title: string; url: string; source: string; snippet: string; price: string }[] = [];

        for (const query of searchQueries) {
          try {
            const res = await withTimeout(
              zai.functions.invoke("web_search", { query, num: 10 }),
              14000,
              null
            );
            if (Array.isArray(res)) {
              for (const item of res) {
                if (!item.url || !item.url.startsWith("http")) continue;
                const source = identifySource(item.host_name || "");
                const priceMatch = (item.snippet || "").match(/[\d.,]+\s*TL/i);
                allResults.push({ title: item.name || "Araç İlanı", url: item.url, source, snippet: item.snippet || "", price: priceMatch ? priceMatch[0] : "" });
              }
            }
          } catch { /* skip */ }
        }

        const seenUrls = new Set<string>();
        const uniqueResults = allResults.filter(r => { if (seenUrls.has(r.url)) return false; seenUrls.add(r.url); return true; });
        const existingNotifs = await db.alertNotification.findMany({ where: { alertId: search.id }, select: { url: true } });
        const existingUrls = new Set(existingNotifs.map(n => n.url));
        const newResults = uniqueResults.filter(r => !existingUrls.has(r.url));

        for (const result of newResults.slice(0, 10)) {
          try { await db.alertNotification.create({ data: { alertId: search.id, title: result.title, snippet: result.snippet, url: result.url, source: result.source, price: result.price } }); totalNew++; } catch { /* skip */ }
        }
        await db.savedSearch.update({ where: { id: search.id }, data: { lastNotifiedAt: new Date() } });
      } catch (err) { console.error(`Cron error ${search.id}:`, err); }
    }

    return NextResponse.json({ success: true, totalNew, checkedSearches: activeSearches.length });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Cron hatası";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
