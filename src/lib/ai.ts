// ─── AI Güvenilirlik Katmanı ───
// withTimeout: AI çağrılarını süre aşımına karşı korur
// safeJson: AI çıktılarını temizler, parse eder, Zod ile doğrular

import { z } from "zod";

/**
 * Promise'e süre aşımı ekler. Süre dolursa fallback döner.
 */
export function withTimeout<T>(
  promise: Promise<T>,
  ms: number = 14000,
  fallback: T
): Promise<T> {
  const timeout = new Promise<T>((resolve) =>
    setTimeout(() => resolve(fallback), ms)
  );
  return Promise.race([promise, timeout]);
}

/**
 * Markdown kod bloğu ve fazladan metni temizleyip JSON parse eder,
 * Zod şemasıyla doğrular. Hata olursa fallback döner.
 */
export function safeJson<T>(
  raw: string,
  schema: z.ZodSchema<T>,
  fallback: T
): T {
  // Markdown kod bloklarını temizle
  let cleaned = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/gi, "")
    .trim();

  // JSON'u bul
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch {
        return fallback;
      }
    } else {
      return fallback;
    }
  }

  // Zod ile doğrula
  const result = schema.safeParse(parsed);
  if (result.success) {
    return result.data;
  }
  return fallback;
}

// ─── Yaygın Şemalar ───

export const ScanResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.string(),
  url: z.string().refine((u) => u.startsWith("http"), {
    message: "URL http ile başlamalı",
  }),
  source: z.string(),
  snippet: z.string(),
  date: z.string().default(""),
  hostName: z.string().default(""),
  favicon: z.string().default(""),
});

export const ScanResultsArraySchema = z.array(ScanResultSchema);

export const NlSearchFiltersSchema = z.object({
  brand: z.string().default(""),
  model: z.string().default(""),
  yearMin: z.number().default(2010),
  yearMax: z.number().default(2026),
  priceMin: z.number().default(0),
  priceMax: z.number().default(5000000),
  kmMin: z.number().default(0),
  kmMax: z.number().default(500000),
  fuelTypes: z.array(z.string()).default([]),
  transTypes: z.array(z.string()).default([]),
  bodyTypes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  cities: z.array(z.string()).default([]),
  sellerType: z.string().default("farketmez"),
  accident: z.string().default("farketmez"),
  guarantee: z.string().default("farketmez"),
  driveTypes: z.array(z.string()).default([]),
  damageLimit: z.number().default(50000),
});

export const ListingInsightSchema = z.object({
  summary: z.array(z.string()).default([]),
  questions: z.array(z.string()).default([]),
  negotiation: z.object({
    suggestion: z.string().default(""),
    maxPrice: z.number().default(0),
    template: z.string().default(""),
  }).default({ suggestion: "", maxPrice: 0, template: "" }),
});

export const ChatResultSchema = z.object({
  question: z.string().optional(),
  filters: NlSearchFiltersSchema.optional(),
  ready: z.boolean().default(false),
});
