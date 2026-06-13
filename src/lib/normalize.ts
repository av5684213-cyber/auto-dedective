// ─── Veri Normalizasyon & Dedup Modülü ───
// Marka/model/yıl/km/şehir alanlarını standart hale getirir.
// dedupKey üretir: aynı aracı farklı sitelerde eşlemek için.

const TR_MAP: Record<string, string> = {
  'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
  'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U',
}

/** Türkçe karakterleri Latin'e çevir, küçük harf, trim */
export function normalizeText(text: string | null | undefined): string {
  if (!text) return ''
  return text
    .replace(/[çğışöüÇĞİŞÖÜ]/g, m => TR_MAP[m] || m)
    .toLowerCase()
    .trim()
}

/** Marka adını standartlaştır */
export function normalizeBrand(brand: string | null | undefined): string {
  const b = normalizeText(brand)
  if (!b) return ''

  // Yaygın yazım farklarını düzelt
  const BRAND_ALIASES: Record<string, string> = {
    'vw': 'volkswagen',
    'mercedes benz': 'mercedes',
    'mercedes-benz': 'mercedes',
    'alfa romeo': 'alfa romeo',
    'land rover': 'land rover',
    'rangerover': 'range rover',
    'mini cooper': 'mini',
  }

  return BRAND_ALIASES[b] || b
}

/** Model adını standartlaştır */
export function normalizeModel(model: string | null | undefined): string {
  return normalizeText(model)
}

/** KM'yi km bucket'a dönüştür (0-50k, 50k-100k, 100k-150k, ...) */
export function kmBucket(km: number | null | undefined): string {
  if (!km || km <= 0) return 'unknown'
  if (km < 50000) return '0-50k'
  if (km < 100000) return '50k-100k'
  if (km < 150000) return '100k-150k'
  if (km < 200000) return '150k-200k'
  if (km < 300000) return '200k-300k'
  return '300k+'
}

/** Şehir adını standartlaştır */
export function normalizeCity(city: string | null | undefined): string {
  const c = normalizeText(city)
  if (!c) return ''

  // Yaygın kısaltmaları aç
  const CITY_ALIASES: Record<string, string> = {
    'ist': 'istanbul',
    'ank': 'ankara',
    'izm': 'izmir',
    'brs': 'bursa',
    'ant': 'antalya',
  }
  return CITY_ALIASES[c] || c
}

/** Vites türünü standartlaştır */
export function normalizeTransmission(trans: string | null | undefined): string {
  const t = normalizeText(trans)
  if (!t) return ''
  if (t.includes('otomatik') || t.includes('auto') || t === 'at') return 'otomatik'
  if (t.includes('manuel') || t.includes('düz') || t === 'mt') return 'manuel'
  if (t.includes('yari') || t.includes('yarı') || t.includes('cvt') || t.includes('dsg')) return 'yarı otomatik'
  return t
}

/** Yakıt türünü standartlaştır */
export function normalizeFuel(fuel: string | null | undefined): string {
  const f = normalizeText(fuel)
  if (!f) return ''
  if (f.includes('dizel') || f.includes('diesel')) return 'dizel'
  if (f.includes('benzin') || f.includes('gasoline') || f.includes('petrol')) return 'benzin'
  if (f.includes('lpg') || f.includes('otogaz')) return 'lpg'
  if (f.includes('hibrit') || f.includes('hybrid')) return 'hibrit'
  if (f.includes('elektrik') || f.includes('electric') || f.includes('ev')) return 'elektrik'
  return f
}

/**
 * dedupKey üretir: normalize(brand|model|year|kmBucket|city)
 * Aynı aracı farklı sitelerde eşlemek için kullanılır.
 */
export function generateDedupKey(params: {
  brand?: string | null
  model?: string | null
  year?: number | null
  km?: number | null
  city?: string | null
  title?: string | null
}): string {
  const brand = normalizeBrand(params.brand)
  const model = normalizeModel(params.model)
  const year = params.year ? String(params.year) : '0'
  const bucket = kmBucket(params.km)
  const city = normalizeCity(params.city)

  // Temel key: brand|model|year|kmBucket|city
  let key = [brand, model, year, bucket, city].filter(Boolean).join('|')

  // Başlıktan ayırt edici ipuçları ekle (ör: "1.5 TSI" gibi motor kodu)
  if (params.title) {
    const engineMatch = normalizeText(params.title).match(
      /(\d\.\d\s*(?:tsi|tdi|gdi|crdi|mpi|bluehdi|hdi|cdi|dci|tce|vtec|ecoboost))/
    )
    if (engineMatch) {
      key += '|' + engineMatch[1].replace(/\s+/g, '')
    }
  }

  return key || 'unknown'
}

/** İlan başlığından temel bilgileri çıkart */
export function extractInfoFromTitle(title: string): {
  brand?: string
  model?: string
  year?: number
} {
  const result: { brand?: string; model?: string; year?: number } = {}

  // Yıl çıkart
  const yearMatch = title.match(/\b(20[0-2]\d|19[9]\d)\b/)
  if (yearMatch) result.year = parseInt(yearMatch[1])

  return result
}

/** Fiyat metnini sayıya dönüştür */
export function parsePriceText(priceText: string | null | undefined): number | null {
  if (!priceText) return null

  // "1.250.000 TL" formatı
  const tlMatch = priceText.match(/([\d.,]+)\s*TL/i)
  if (tlMatch) {
    const numStr = tlMatch[1].replace(/\./g, '').replace(',', '.')
    const num = parseFloat(numStr)
    if (!isNaN(num)) return Math.round(num)
  }

  // "450 bin" formatı
  const binMatch = priceText.match(/([\d.,]+)\s*bin/i)
  if (binMatch) {
    const num = parseFloat(binMatch[1].replace(/\./g, '').replace(',', '.'))
    if (!isNaN(num)) return Math.round(num * 1000)
  }

  // "1.5 milyon" formatı
  const mMatch = priceText.match(/([\d.,]+)\s*milyon/i)
  if (mMatch) {
    const num = parseFloat(mMatch[1].replace(/\./g, '').replace(',', '.'))
    if (!isNaN(num)) return Math.round(num * 1000000)
  }

  return null
}
