// ─── Doğal Dil Arama API ───
// Serbest cümleyi yapılandırılmış filtre JSON'una çevirir.

import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { withTimeout, safeJson, NlSearchFiltersSchema } from "@/lib/ai";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";
import { cacheSet, cacheGet, makeCacheKey } from "@/lib/cache";

export const dynamic = "force-dynamic";

const FALLBACK_FILTERS = {
  brand: "", model: "", yearMin: 2010, yearMax: 2026,
  priceMin: 0, priceMax: 5000000, kmMin: 0, kmMax: 500000,
  fuelTypes: [], transTypes: [], bodyTypes: [], colors: [], cities: [],
  sellerType: "farketmez", accident: "farketmez", guarantee: "farketmez",
  driveTypes: [], damageLimit: 50000,
};

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit(ip, 20);
    if (!rate.allowed) {
      return NextResponse.json({ success: false, error: "Çok fazla istek" }, { status: 429 });
    }

    const body = await request.json();
    const query = body.query as string;

    if (!query || query.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: "Lütfen en az 3 karakter girin" },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    const systemPrompt = `Sen bir ikinci el araç arama asistanısın. Kullanıcının serbest Türkçe cümlesini yapılandırılmış bir JSON filtresine dönüştür.

SADECE geçerli JSON döndür, başka hiçbir şey yazma. Markdown kod bloğu kullanma.

JSON formatı:
{
  "brand": "Marka adı veya boş string",
  "model": "Model adı veya boş string",
  "yearMin": 2010,
  "yearMax": 2026,
  "priceMin": 0,
  "priceMax": 5000000,
  "kmMin": 0,
  "kmMax": 500000,
  "fuelTypes": [],
  "transTypes": [],
  "bodyTypes": [],
  "colors": [],
  "cities": [],
  "sellerType": "farketmez",
  "accident": "farketmez",
  "guarantee": "farketmez",
  "driveTypes": [],
  "damageLimit": 50000
}

KURALLAR:
- "400 bin altı" = priceMax: 400000
- "1 milyonun altında" = priceMax: 1000000
- "otomatik" = transTypes: ["Otomatik"]
- "dizel" = fuelTypes: ["Dizel"]
- "kazasız" = accident: "evet"
- Sayıları TL cinsinden tam sayı olarak yazın.`;

    const completion = await withTimeout(
      zai.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query },
        ],
        temperature: 0.1,
      }),
      14000,
      null
    );

    if (!completion) {
      return NextResponse.json({
        success: false,
        error: "AI yanıt vermedi, lütfen tekrar deneyin",
      });
    }

    const content = completion.choices[0]?.message?.content || "";
    const filters = safeJson(content, NlSearchFiltersSchema, FALLBACK_FILTERS);

    const response = { success: true, filters, originalQuery: query };
    cacheSet(makeCacheKey("nlsearch", { query }), response, 300_000);
    return NextResponse.json(response);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Arama hatası";
    console.error("NLSearch API error:", error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
