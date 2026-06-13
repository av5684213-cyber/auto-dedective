// ─── Fiyat Zekası Modülü ───
// Piyasa medyanı, fiyat farkı ve Dedektif Puanı hesaplar.

import { db } from './db'
import { normalizeBrand, normalizeModel, kmBucket } from './normalize'

/**
 * Belirtilen kriterlere uyan ilanların medyan fiyatını döndürür.
 * Yeterli örnek yoksa null döner.
 */
export async function marketMedian(params: {
  brand: string
  model: string
  year?: number
  kmBucket?: string
}): Promise<number | null> {
  const brand = normalizeBrand(params.brand)
  const model = normalizeModel(params.model)

  if (!brand || !model) return null

  const where: any = {
    brand: { contains: brand, mode: 'insensitive' },
    model: { contains: model, mode: 'insensitive' },
    price: { gt: 0 },
    isActive: true,
  }

  if (params.year) {
    where.year = { gte: params.year - 1, lte: params.year + 1 }
  }

  try {
    const listings = await db.listing.findMany({
      where,
      select: { price: true },
      take: 100,
      orderBy: { price: 'asc' },
    })

    const prices = listings.map(l => l.price).filter((p): p is number => p !== null && p > 0)
    if (prices.length < 3) return null

    // Medyan hesapla
    const mid = Math.floor(prices.length / 2)
    return prices.length % 2 !== 0
      ? prices[mid]
      : Math.round((prices[mid - 1] + prices[mid]) / 2)
  } catch {
    return null
  }
}

/**
 * İlanın medyana göre yüzde farkını döndürür.
 * Negatif = piyasanın altında (fırsat), Pozitif = piyasanın üstünde (pahalı)
 */
export function priceDelta(listingPrice: number, median: number): number {
  if (!median || median === 0) return 0
  return Math.round(((listingPrice - median) / median) * 100)
}

/**
 * Dedektif Puanı hesaplar (0-100 arası).
 * Bileşenler:
 *   - fiyat/medyan ağırlığı: %40
 *   - km/yaş ağırlığı: %25
 *   - donanım ipuçları: %15 (eksik veri = notr)
 *   - hasar/temizlik: %20
 */
export function dealScore(params: {
  priceDelta: number          // fiyat/medyan yüzdesi (negatif = ucuz)
  kmPerYear: number | null    // yıllık km ortalaması
  hasDamage: boolean | null   // hasar bilgisi var mı
  damageAmount: number | null // hasar tutarı (0 = hasarsız)
  descriptionLength: number   // açıklama uzunluğu (donanım ipucu)
}): number {
  let score = 50 // başlangıç notr

  // 1. Fiyat/Medyan (%40)
  if (params.priceDelta !== undefined && params.priceDelta !== 0) {
    const delta = params.priceDelta
    let priceScore: number
    if (delta <= -30) priceScore = 100    // Çok ucuz = yüksek puan (ama şüpheli!)
    else if (delta <= -15) priceScore = 90
    else if (delta <= -5) priceScore = 80
    else if (delta <= 5) priceScore = 70  // Piyasa civarı
    else if (delta <= 15) priceScore = 50
    else if (delta <= 30) priceScore = 30
    else priceScore = 10                  // Çok pahalı

    score = score * 0.6 + priceScore * 0.4
  }

  // 2. KM/Yaş (%25)
  if (params.kmPerYear !== null) {
    let kmScore: number
    if (params.kmPerYear < 10000) kmScore = 95
    else if (params.kmPerYear < 15000) kmScore = 80
    else if (params.kmPerYear < 20000) kmScore = 65
    else if (params.kmPerYear < 30000) kmScore = 45
    else if (params.kmPerYear < 40000) kmScore = 30
    else kmScore = 15

    score = score * 0.75 + kmScore * 0.25
  }

  // 3. Donanım ipuçları (%15) - açıklama uzunluğu proxy
  if (params.descriptionLength > 0) {
    let equipScore: number
    if (params.descriptionLength > 500) equipScore = 85
    else if (params.descriptionLength > 200) equipScore = 70
    else if (params.descriptionLength > 50) equipScore = 50
    else equipScore = 30

    score = score * 0.85 + equipScore * 0.15
  }

  // 4. Hasar/Temizlik (%20)
  if (params.hasDamage !== null) {
    let damageScore: number
    if (!params.hasDamage) {
      damageScore = 95 // Hasarsız
    } else if (params.damageAmount !== null) {
      if (params.damageAmount === 0) damageScore = 95
      else if (params.damageAmount < 5000) damageScore = 75
      else if (params.damageAmount < 15000) damageScore = 55
      else if (params.damageAmount < 30000) damageScore = 35
      else damageScore = 15
    } else {
      damageScore = 40 // Hasar var ama tutar bilinmiyor
    }

    score = score * 0.8 + damageScore * 0.2
  }

  return Math.max(0, Math.min(100, Math.round(score)))
}

/**
 * Fiyat düşüşü tespit eder ve PriceSnapshot oluşturur.
 */
export async function trackPriceChange(listingId: string, newPrice: number): Promise<boolean> {
  try {
    const listing = await db.listing.findUnique({
      where: { id: listingId },
      include: { snapshots: { orderBy: { capturedAt: 'desc' }, take: 1 } },
    })

    if (!listing) return false

    const lastPrice = listing.snapshots[0]?.price ?? listing.price

    // Fiyat değişmişse snapshot ekle
    if (lastPrice && newPrice !== lastPrice) {
      await db.priceSnapshot.create({
        data: { listingId, price: newPrice },
      })

      // Fiyat düşmüşse bayrak koy
      if (newPrice < (lastPrice as number)) {
        await db.listing.update({
          where: { id: listingId },
          data: { priceDropped: true, price: newPrice },
        })
      }

      return true
    }

    return false
  } catch {
    return false
  }
}

/** Puan rozeti renk sınıfı */
export function scoreColorClass(score: number): string {
  if (score >= 70) return 'bg-green-500/20 text-green-300 border-green-500/30'
  if (score >= 40) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
  return 'bg-red-500/20 text-red-300 border-red-500/30'
}

/** Fiyat farkı etiketi */
export function priceDeltaLabel(delta: number): string {
  if (delta === 0) return 'Piyasa civarı'
  if (delta < 0) return `Piyasanın %${Math.abs(delta)} altında`
  return `Piyasanın %${delta} üstünde`
}
