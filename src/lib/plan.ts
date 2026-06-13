// ─── Plan Mantığı + Kota Yardımcıları ───
// Mevcut özellikleri FREE/Premium olarak sınırlar.
// YENİ ürün özelliği EKLEMEZ; sadece mevcutlara sınır koyar.

import { db } from "./db";

// ─── Plan Limit Sabitleri ───

export const PLAN_LIMITS = {
  FREE: {
    aiInsightPerDay: 3,
    searchPerDay: 5,
    scanPerDay: 3,
    savedSearchMax: 3,
    compareSlots: 2,
    trends: false,
    instantAlerts: false,
  },
  PREMIUM: {
    aiInsightPerDay: Infinity,
    searchPerDay: Infinity,
    scanPerDay: Infinity,
    savedSearchMax: Infinity,
    compareSlots: 4,
    trends: true,
    instantAlerts: true,
  },
} as const;

export type PlanType = "FREE" | "PREMIUM";
export type PlanLimits = typeof PLAN_LIMITS[PlanType];

// ─── Yardımcı Fonksiyonlar ───

/**
 * Kullanıcının Premium olup olmadığını kontrol eder.
 * planRenewsAt süresi geçmişse FREE gibi davranır.
 */
export function isPremium(user: { plan: string; planRenewsAt?: Date | null }): boolean {
  if (user.plan !== "PREMIUM") return false;
  if (user.planRenewsAt && new Date(user.planRenewsAt) < new Date()) return false;
  return true;
}

/**
 * Kullanıcının planına göre limitleri döner.
 */
export function getLimits(user: { plan: string; planRenewsAt?: Date | null }): PlanLimits {
  return isPremium(user) ? PLAN_LIMITS.PREMIUM : PLAN_LIMITS.FREE;
}

/**
 * Günlük kullanım sayacını kontrol eder ve artırır.
 * Limit aşıldıysa false döner (artırmaz).
 * LimitInfinity ise her zaman true döner.
 */
export async function checkAndIncrementUsage(
  userId: string,
  key: string,
  limit: number
): Promise<boolean> {
  if (limit === Infinity) return true;

  const today = new Date().toISOString().slice(0, 10);

  const existing = await db.usageCounter.findUnique({
    where: { userId_key_day: { userId, key, day: today } },
  });

  if (existing && existing.count >= limit) {
    return false;
  }

  if (existing) {
    await db.usageCounter.update({
      where: { id: existing.id },
      data: { count: { increment: 1 } },
    });
  } else {
    await db.usageCounter.create({
      data: { userId, key, day: today, count: 1 },
    });
  }

  return true;
}

/**
 * Kullanıcının bugünkü kullanım sayacını döner.
 */
export async function getUsageCount(userId: string, key: string): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);
  const counter = await db.usageCounter.findUnique({
    where: { userId_key_day: { userId, key, day: today } },
  });
  return counter?.count ?? 0;
}

/**
 * Limit aşımı yanıtını oluşturur.
 */
export function limitExceededResponse(featureName: string): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: `Günlük ücretsiz ${featureName} hakkınız doldu. Premium'a geçerek sınırsız kullanabilirsiniz.`,
      code: "LIMIT_EXCEEDED",
    }),
    { status: 402, headers: { "Content-Type": "application/json" } }
  );
}

/**
 * Kullanıcının kayıtlı arama sayısını döner.
 */
export async function getSavedSearchCount(userId: string): Promise<number> {
  return db.savedSearch.count({ where: { userId } });
}
