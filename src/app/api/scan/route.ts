import { NextRequest, NextResponse } from "next/server";
import ZAI, { type SearchFunctionResultItem } from "z-ai-web-dev-sdk";
import { withTimeout, safeJson, ScanResultsArraySchema } from "@/lib/ai";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";
import { cacheSet, cacheGet, makeCacheKey } from "@/lib/cache";

export const dynamic = "force-dynamic";

interface ScanResult {
  id: string;
  title: string;
  price: string;
  url: string;
  source: string;
  snippet: string;
  date: string;
  hostName: string;
  favicon: string;
}

function buildSearchQuery(filters: Record<string, any>): string[] {
  const queries: string[] = [];

  const brand = filters.brand || "";
  const model = filters.model || "";
  const yearMin = filters.yearMin || 2010;
  const yearMax = filters.yearMax || 2026;
  const fuelTypes: string[] = filters.fuelTypes || [];
  const transTypes: string[] = filters.transTypes || [];
  const priceMin = filters.priceMin || 0;
  const priceMax = filters.priceMax || 0;
  const kmMax = filters.kmMax || 0;
  const cities: string[] = filters.cities || [];
  const bodyTypes: string[] = filters.bodyTypes || [];
  const colors: string[] = filters.colors || [];
  const accident = filters.accident || "farketmez";
  const sellerType = filters.sellerType || "farketmez";
  const guarantee = filters.guarantee || "farketmez";
  const plateCity = filters.plateCity || "";
  const driveTypes: string[] = filters.driveTypes || [];
  const hpMin = filters.hpMin || 0;

  const brandModel = [brand, model].filter(Boolean).join(" ");
  const carDesc = brandModel || "ikinci el araba";

  let baseQuery = `${carDesc} ikinci el satılık`;
  if (yearMin > 2010 || yearMax < 2026) {
    baseQuery += ` ${yearMin}-${yearMax} model`;
  }
  if (fuelTypes.length > 0) {
    baseQuery += ` ${fuelTypes.join(" ")}`;
  }
  if (transTypes.length > 0) {
    baseQuery += ` ${transTypes.join(" ")}`;
  }
  if (priceMax > 0) {
    baseQuery += ` max ${priceMax} TL`;
  }
  if (kmMax > 0 && kmMax < 500000) {
    baseQuery += ` ${kmMax} km altı`;
  }
  if (bodyTypes.length > 0) {
    baseQuery += ` ${bodyTypes.join(" ")}`;
  }
  if (colors.length > 0) {
    baseQuery += ` ${colors.slice(0, 2).join(" ")} renk`;
  }
  if (accident === "evet") {
    baseQuery += ` kazasız hasarsız`;
  }
  if (sellerType === "galeri") {
    baseQuery += ` galeri`;
  } else if (sellerType === "bireysel") {
    baseQuery += ` bireysel satıcı`;
  }
  if (guarantee === "evet") {
    baseQuery += ` garantili`;
  }
  if (plateCity) {
    baseQuery += ` ${plateCity} plaka`;
  }
  if (driveTypes.length > 0) {
    baseQuery += ` ${driveTypes.join(" ")}`;
  }
  if (hpMin > 0) {
    baseQuery += ` ${hpMin} HP üzeri`;
  }

  queries.push(`${baseQuery} site:sahibinden.com`);
  queries.push(`${baseQuery} site:arabam.com`);
  queries.push(`${baseQuery} site:letgo.com`);
  queries.push(`${baseQuery} Türkiye ikinci el araç ilanları`);

  if (cities.length > 0 && !cities.includes("Türkiye Geneli")) {
    const cityNames = cities.slice(0, 2).join(" ");
    queries.push(`${carDesc} ikinci el ${cityNames} satılık ilan`);
  }

  return queries;
}

function extractPriceFromSnippet(snippet: string): string {
  const tlMatch = snippet.match(/[\d.,]+\s*TL/i);
  if (tlMatch) return tlMatch[0];
  const numMatch = snippet.match(/[\d.,]+\s*(?:bin|milyon)/i);
  if (numMatch) return numMatch[0];
  return "";
}

function identifySource(hostname: string): string {
  if (hostname.includes("sahibinden")) return "sahibinden.com";
  if (hostname.includes("arabam")) return "arabam.com";
  if (hostname.includes("letgo")) return "letgo.com";
  return hostname;
}

const EMPTY_RESULTS: ScanResult[] = [];

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip = getClientIp(request);
    const rate = checkRateLimit(ip, 20);
    if (!rate.allowed) {
      return NextResponse.json({ success: false, error: "Çok fazla istek, lütfen bekleyin" }, { status: 429 });
    }

    const body = await request.json();
    const filters = body.filters || {};

    // Cache kontrol
    const cacheKey = makeCacheKey("scan", { filters });
    const cached = cacheGet<{ success: boolean; totalResults: number; results: ScanResult[]; scannedSites: string[]; query: string }>(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const zai = await ZAI.create();
    const searchQueries = buildSearchQuery(filters);

    const allResults: ScanResult[] = [];
    let resultId = 0;

    const searchPromises = searchQueries.map(async (query) => {
      try {
        const results = await withTimeout(
          zai.functions.invoke("web_search", { query, num: 15 }),
          14000,
          [] as SearchFunctionResultItem[]
        );

        if (Array.isArray(results)) {
          for (const item of results) {
            resultId++;
            const source = identifySource(item.host_name || "");
            const price = extractPriceFromSnippet(item.snippet || "");
            const url = item.url || "#";

            // URL doğrulama: http ile başlamalı
            if (!url.startsWith("http")) continue;

            allResults.push({
              id: `r-${resultId}-${Date.now()}`,
              title: item.name || "Araç İlanı",
              price: price,
              url: url,
              source: source,
              snippet: item.snippet || "",
              date: item.date || "",
              hostName: item.host_name || "",
              favicon: item.favicon || "",
            });
          }
        }
      } catch (err) {
        console.error("Search error:", err);
      }
    });

    await withTimeout(Promise.all(searchPromises), 30000, undefined);

    const seenUrls = new Set<string>();
    const uniqueResults = allResults.filter((r) => {
      if (seenUrls.has(r.url)) return false;
      seenUrls.add(r.url);
      return true;
    });

    const sitePriority: Record<string, number> = {
      "sahibinden.com": 1,
      "arabam.com": 2,
      "letgo.com": 3,
    };

    uniqueResults.sort((a, b) => {
      const priA = sitePriority[a.source] || 99;
      const priB = sitePriority[b.source] || 99;
      return priA - priB;
    });

    // Zod ile sonuçları doğrula, geçersizleri ele
    const validated = safeJson(JSON.stringify(uniqueResults.slice(0, 50)), ScanResultsArraySchema, EMPTY_RESULTS);

    const response = {
      success: true,
      totalResults: validated.length,
      results: validated,
      scannedSites: ["sahibinden.com", "arabam.com", "letgo.com", "oto.sahibinden.com"],
      query: searchQueries[0],
    };

    // Cache'e yaz (5 dakika)
    cacheSet(cacheKey, response, 300_000);

    return NextResponse.json(response);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Tarama hatası";
    console.error("Scan API error:", error);
    return NextResponse.json(
      { success: false, error: msg, results: [], totalResults: 0 },
      { status: 500 }
    );
  }
}
