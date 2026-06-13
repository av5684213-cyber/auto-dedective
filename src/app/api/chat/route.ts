// ─── Sohbet Modu API ───
// Çok adımlı konuşarak filtreleme.

import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { withTimeout, safeJson, ChatResultSchema } from "@/lib/ai";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";

const FALLBACK_CHAT = { question: "Üzgünüm, şu an yanıt veremiyorum. Lütfen tekrar deneyin.", ready: false };

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit(ip, 20);
    if (!rate.allowed) {
      return NextResponse.json({ success: false, error: "Çok fazla istek" }, { status: 429 });
    }

    type ChatRole = "user" | "system" | "assistant";

    const body = await request.json();
    const messages = body.messages as { role: ChatRole; content: string }[];

    if (!messages || messages.length === 0) {
      return NextResponse.json({ success: false, error: "Mesaj gereklidir" }, { status: 400 });
    }

    const zai = await ZAI.create();

    const systemPrompt = `Sen OtoDedektif'in AI arama asistanısın. Kullanıcıyla Türkçe konuşarak ikinci el araç arama kriterlerini anlamaya çalış.

Her mesajında şunları yap:
1. Kullanıcının ihtiyacını anla ve sorular sor (bütçe, marka tercihi, yakıt tipi, şehir, vb.)
2. Eğer yeterli bilgi topladıysan, JSON formatında filtre öner:
{"filters": {...}, "ready": true}
3. Henüz bilgi eksikse soru sor:
{"question": "...", "ready": false}

SADECE JSON döndür. Markdown kod bloğu kullanma.

Araç kriterleri: marka, model, yıl aralığı, fiyat aralığı, yakıt tipi, vites, km, şehir, kasa tipi, kazasızlık, garanti, satıcı türü.`;

    const allMessages: { role: ChatRole; content: string }[] = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    const completion = await withTimeout(
      zai.chat.completions.create({
        messages: allMessages,
        temperature: 0.3,
      }),
      14000,
      null
    );

    if (!completion) {
      return NextResponse.json({ success: true, ...FALLBACK_CHAT });
    }

    const content = completion.choices[0]?.message?.content || "";
    const result = safeJson(content, ChatResultSchema, FALLBACK_CHAT);

    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Sohbet hatası";
    console.error("Chat API error:", error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
