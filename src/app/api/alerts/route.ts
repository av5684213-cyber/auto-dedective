import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import ZAI from "z-ai-web-dev-sdk";
import { withTimeout } from "@/lib/ai";

export const dynamic = "force-dynamic";

/* ─── helpers ─── */

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
  const bodyTypes: string[] = (filters.bodyTypes as string[]) || [];
  const colors: string[] = (filters.colors as string[]) || [];
  const accident = (filters.accident as string) || "farketmez";
  const sellerType = (filters.sellerType as string) || "farketmez";
  const guarantee = (filters.guarantee as string) || "farketmez";

  const brandModel = [brand, model].filter(Boolean).join(" ");
  const carDesc = brandModel || "ikinci el araba";

  let baseQuery = `${carDesc} ikinci el satılık`;
  if (yearMin > 2010 || yearMax < 2026) baseQuery += ` ${yearMin}-${yearMax} model`;
  if (fuelTypes.length > 0) baseQuery += ` ${fuelTypes.join(" ")}`;
  if (transTypes.length > 0) baseQuery += ` ${transTypes.join(" ")}`;
  if (priceMax > 0) baseQuery += ` max ${priceMax} TL`;
  if (kmMax > 0 && kmMax < 500000) baseQuery += ` ${kmMax} km altı`;
  if (bodyTypes.length > 0) baseQuery += ` ${bodyTypes.join(" ")}`;
  if (colors.length > 0) baseQuery += ` ${colors.slice(0, 2).join(" ")} renk`;
  if (accident === "evet") baseQuery += ` kazasız hasarsız`;
  if (sellerType === "galeri") baseQuery += ` galeri`;
  else if (sellerType === "bireysel") baseQuery += ` bireysel satıcı`;
  if (guarantee === "evet") baseQuery += ` garantili`;

  queries.push(`${baseQuery} site:sahibinden.com`);
  queries.push(`${baseQuery} site:arabam.com`);
  queries.push(`${baseQuery} site:letgo.com`);
  queries.push(`${baseQuery} Türkiye ikinci el araç ilanları`);
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

/* ─── GET /api/alerts — list all alerts ─── */
export async function GET() {
  try {
    const alerts = await db.alertFilter.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { notifications: true } },
        notifications: {
          where: { isRead: false },
          orderBy: { foundAt: "desc" },
          take: 5,
        },
      },
    });
    return NextResponse.json({ success: true, alerts });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Hata";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

/* ─── POST /api/alerts — create a new alert filter ─── */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, filters, intervalMinutes } = body;

    if (!name || !filters) {
      return NextResponse.json({ success: false, error: "İsim ve filtre gereklidir" }, { status: 400 });
    }

    const alert = await db.alertFilter.create({
      data: {
        name,
        filtersJson: JSON.stringify(filters),
        intervalMinutes: intervalMinutes || 10,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, alert });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Hata";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

/* ─── PUT /api/alerts — run scan for a specific alert ─── */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { alertId, action } = body;

    if (action === "scan" && alertId) {
      const alert = await db.alertFilter.findUnique({ where: { id: alertId } });
      if (!alert) {
        return NextResponse.json({ success: false, error: "Bildirim bulunamadı" }, { status: 404 });
      }

      const filters = JSON.parse(alert.filtersJson);
      const zai = await ZAI.create();
      const searchQueries = buildSearchQuery(filters);

      const allResults: { title: string; url: string; source: string; snippet: string; price: string }[] = [];

      for (const query of searchQueries) {
        try {
          const results = await withTimeout(
            zai.functions.invoke("web_search", { query, num: 10 }),
            14000,
            null
          );
          if (Array.isArray(results)) {
            for (const item of results) {
              if (!item.url || !item.url.startsWith("http")) continue;
              const source = identifySource(item.host_name || "");
              const price = extractPriceFromSnippet(item.snippet || "");
              allResults.push({
                title: item.name || "Araç İlanı",
                url: item.url,
                source,
                snippet: item.snippet || "",
                price,
              });
            }
          }
        } catch (err) {
          console.error("Alert scan search error:", err);
        }
      }

      const seenUrls = new Set<string>();
      const uniqueResults = allResults.filter((r) => {
        if (seenUrls.has(r.url)) return false;
        seenUrls.add(r.url);
        return true;
      });

      const existingNotifs = await db.alertNotification.findMany({
        where: { alertId },
        select: { url: true },
      });
      const existingUrls = new Set(existingNotifs.map((n) => n.url));

      const newResults = uniqueResults.filter((r) => !existingUrls.has(r.url));

      let createdCount = 0;
      for (const result of newResults.slice(0, 20)) {
        try {
          await db.alertNotification.create({
            data: {
              alertId,
              title: result.title,
              snippet: result.snippet,
              url: result.url,
              source: result.source,
              price: result.price,
            },
          });
          createdCount++;
        } catch (err) {
          console.error("Notification create error:", err);
        }
      }

      await db.alertFilter.update({
        where: { id: alertId },
        data: {
          lastScannedAt: new Date(),
          lastResultCount: uniqueResults.length,
          totalScans: { increment: 1 },
        },
      });

      return NextResponse.json({
        success: true,
        totalFound: uniqueResults.length,
        newNotifications: createdCount,
        alertId,
      });
    }

    if (action === "scan-all") {
      const alerts = await db.alertFilter.findMany({ where: { isActive: true } });
      let totalNew = 0;

      for (const alert of alerts) {
        try {
          const filters = JSON.parse(alert.filtersJson);
          const zai = await ZAI.create();
          const searchQueries = buildSearchQuery(filters);

          const allResults: { title: string; url: string; source: string; snippet: string; price: string }[] = [];

          for (const query of searchQueries) {
            try {
              const results = await withTimeout(
                zai.functions.invoke("web_search", { query, num: 10 }),
                14000,
                null
              );
              if (Array.isArray(results)) {
                for (const item of results) {
                  if (!item.url || !item.url.startsWith("http")) continue;
                  const source = identifySource(item.host_name || "");
                  const price = extractPriceFromSnippet(item.snippet || "");
                  allResults.push({ title: item.name || "Araç İlanı", url: item.url, source, snippet: item.snippet || "", price });
                }
              }
            } catch (err) { console.error("Alert scan-all search error:", err); }
          }

          const seenUrls = new Set<string>();
          const uniqueResults = allResults.filter((r) => { if (seenUrls.has(r.url)) return false; seenUrls.add(r.url); return true; });
          const existingNotifs = await db.alertNotification.findMany({ where: { alertId: alert.id }, select: { url: true } });
          const existingUrls = new Set(existingNotifs.map((n) => n.url));
          const newResults = uniqueResults.filter((r) => !existingUrls.has(r.url));

          for (const result of newResults.slice(0, 15)) {
            try {
              await db.alertNotification.create({ data: { alertId: alert.id, title: result.title, snippet: result.snippet, url: result.url, source: result.source, price: result.price } });
              totalNew++;
            } catch (err) { console.error("Notification create error:", err); }
          }

          await db.alertFilter.update({ where: { id: alert.id }, data: { lastScannedAt: new Date(), lastResultCount: uniqueResults.length, totalScans: { increment: 1 } } });
        } catch (err) { console.error(`Alert scan-all error for ${alert.id}:`, err); }
      }

      return NextResponse.json({ success: true, totalNew, scannedAlerts: alerts.length });
    }

    if (action === "toggle" && alertId) {
      const alert = await db.alertFilter.findUnique({ where: { id: alertId } });
      if (!alert) {
        return NextResponse.json({ success: false, error: "Bildirim bulunamadı" }, { status: 404 });
      }
      const updated = await db.alertFilter.update({
        where: { id: alertId },
        data: { isActive: !alert.isActive },
      });
      return NextResponse.json({ success: true, alert: updated });
    }

    return NextResponse.json({ success: false, error: "Geçersiz işlem" }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Hata";
    console.error("Alert PUT error:", error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

/* ─── DELETE /api/alerts — delete an alert ─── */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const alertId = searchParams.get("id");

    if (!alertId) {
      return NextResponse.json({ success: false, error: "ID gereklidir" }, { status: 400 });
    }

    await db.alertNotification.deleteMany({ where: { alertId } });
    await db.alertFilter.delete({ where: { id: alertId } });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Hata";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
