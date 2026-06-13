// ─── İlan Özeti + Sorular + Pazarlık Asistanı API ───

import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { withTimeout, safeJson, ListingInsightSchema } from "@/lib/ai";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";

const FALLBACK_SUMMARY = "Bu ilan için AI analizi şu an mevcut değil. Lütfen daha sonra tekrar deneyin.";
const FALLBACK_QUESTIONS = [
  "Aracın son servis tarihi ne zaman?",
  "Hasar/tramer kaydı var mı?",
  "Araç hangi şehirde görülebilir?",
  "Test sürüşü yapılabilir mi?",
  "İkinci el garantisi var mı?",
];
const FALLBACK_NEGOTIATION = {
  suggestion: "Piyasa araştırması yaparak benzer ilanların fiyatlarını kontrol edin.",
  maxPrice: 0,
  template: "Merhaba, ilanınızla ilgileniyorum. Pazarlık imkanı var mı?",
};

const FALLBACK_INSIGHT = {
  summary: [FALLBACK_SUMMARY],
  questions: FALLBACK_QUESTIONS,
  negotiation: FALLBACK_NEGOTIATION,
};

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit(ip, 20);
    if (!rate.allowed) {
      return NextResponse.json({ success: false, error: "Çok fazla istek" }, { status: 429 });
    }

    const body = await request.json();
    const { title, price, brand, model, year, km, fuel, city, description, medianPrice } = body;

    if (!title) {
      return NextResponse.json({ success: false, error: "İlan bilgisi gereklidir" }, { status: 400 });
    }

    const zai = await ZAI.create();

    const systemPrompt = `Sen bir ikinci el araç analiz uzmanısın. Verilen ilan için 3 bölüm hazırla:

1. ÖZET: Aracın 3 maddelik kısa özeti
2. SORULAR: Satıcıya sorulacak 5 akılcı soru listesi
3. PAZARLIK: Pazarlık önerisi (medyan fiyata dayalı)

SADECE geçerli JSON döndür:
{
  "summary": ["madde1", "madde2", "madde3"],
  "questions": ["soru1", "soru2", "soru3", "soru4", "soru5"],
  "negotiation": {
    "suggestion": "pazarlık stratejisi",
    "maxPrice": önerilen_maks_fiyat_sayi,
    "template": "satıcıya gönderilecek kısa mesaj taslağı"
  }
}`;

    const userPrompt = `İlan: ${title}
Fiyat: ${price || 'belirtilmemiş'} TL
Marka/Model: ${brand || ''} ${model || ''}
Yıl: ${year || ''}, KM: ${km || ''}, Yakıt: ${fuel || ''}, Şehir: ${city || ''}
Açıklama: ${(description || '').slice(0, 500)}
Piyasa Medyan: ${medianPrice || 'bilinmiyor'} TL`;

    const completion = await withTimeout(
      zai.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
      14000,
      null
    );

    if (!completion) {
      return NextResponse.json({
        success: true,
        ...FALLBACK_INSIGHT,
      });
    }

    const content = completion.choices[0]?.message?.content || "";
    const result = safeJson(content, ListingInsightSchema, FALLBACK_INSIGHT);

    return NextResponse.json({
      success: true,
      summary: result.summary.length > 0 ? result.summary : [FALLBACK_SUMMARY],
      questions: result.questions.length > 0 ? result.questions : FALLBACK_QUESTIONS,
      negotiation: result.negotiation.suggestion ? result.negotiation : FALLBACK_NEGOTIATION,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Analiz hatası";
    console.error("Listing insight API error:", error);
    return NextResponse.json({
      success: false,
      ...FALLBACK_INSIGHT,
      error: msg,
    }, { status: 500 });
  }
}
