// ─── Açıklama Madenciliği Modülü (Hasar Özeti) ───
// İlan açıklamasında hasar/değişen/boyalı bilgilerini yakalar ve kategorize eder.

export interface DamageItem {
  category: 'degisen' | 'boyali' | 'hasar_kaydi' | 'tramer' | 'lokal_boya' | 'kaporta' | 'orijinal'
  raw: string
  part?: string
}

export interface DamageSummary {
  degisenCount: number
  boyaliCount: number
  hasarKaydi: boolean
  tramerTutari: number | null
  orijinalParcalar: string[]
  items: DamageItem[]
  summaryText: string  //ör: "2 değişen, 1 boyalı"
}

// Anahtar kelimeler ve kategorileri
const DAMAGE_PATTERNS: { pattern: RegExp; category: DamageItem['category']; extractPart?: boolean }[] = [
  // Değişen parçalar
  { pattern: /(\w+(?:\s+\w+)?)\s*değişen/gi, category: 'degisen', extractPart: true },
  { pattern: /değişen\s+(\w+(?:\s+\w+)?)/gi, category: 'degisen', extractPart: true },
  { pattern: /(\w+)\s*degisen/gi, category: 'degisen', extractPart: true },

  // Boyalı parçalar
  { pattern: /(\w+(?:\s+\w+)?)\s*boyalı/gi, category: 'boyali', extractPart: true },
  { pattern: /boyalı\s+(\w+(?:\s+\w+)?)/gi, category: 'boyali', extractPart: true },
  { pattern: /lokal\s*boya/gi, category: 'lokal_boya' },
  { pattern: /lokal\s*boyalı/gi, category: 'lokal_boya' },

  // Hasar kaydı
  { pattern: /hasar\s*kaydı/gi, category: 'hasar_kaydi' },
  { pattern: /hasar\s*kaydi/gi, category: 'hasar_kaydi' },
  { pattern: /ağır\s*hasar/gi, category: 'hasar_kaydi' },
  { pattern: /agir\s*hasar/gi, category: 'hasar_kaydi' },
  { pattern: /hasarlı/gi, category: 'hasar_kaydi' },

  // Tramer
  { pattern: /tramer[\s:]*([\d.,]+)\s*(?:tl|₺)?/gi, category: 'tramer' },
  { pattern: /tramer\s*kaydı/gi, category: 'tramer' },
  { pattern: /sigorta[\s:]*([\d.,]+)\s*(?:tl|₺)?/gi, category: 'tramer' },

  // Kaporta
  { pattern: /kaporta\s*(?:işliği|masrafı|onarım)/gi, category: 'kaporta' },
  { pattern: /kaporta\s*(?:isligi|masrafi|onarim)/gi, category: 'kaporta' },

  // Orijinal
  { pattern: /(\w+(?:\s+\w+)?)\s*orijinal/gi, category: 'orijinal', extractPart: true },
  { pattern: /orijinal\s+(\w+(?:\s+\w+)?)/gi, category: 'orijinal', extractPart: true },
  { pattern: /kazasız\s*hasarsız/gi, category: 'orijinal' },
  { pattern: /boyasız/gi, category: 'orijinal' },
]

// Parça isimleri filtresi - gürültüyü azalt
const PART_BLACKLIST = new Set([
  'arac', 'araç', 'fiyat', 'pazarlik', 'pazarlık', 'takas', 'degisen',
  'değişen', 'boyali', 'boyalı', 'bilgi', 'detay', 'ilgilenen', 'dahil',
])

/**
 * İlan açıklamasından hasar bilgisini madenciler.
 */
export function mineDamage(description: string | null | undefined): DamageSummary {
  const items: DamageItem[] = []
  const orijinalParcalar: string[] = []

  if (!description) {
    return {
      degisenCount: 0,
      boyaliCount: 0,
      hasarKaydi: false,
      tramerTutari: null,
      orijinalParcalar: [],
      items: [],
      summaryText: 'Açıklama yok',
    }
  }

  for (const { pattern, category, extractPart } of DAMAGE_PATTERNS) {
    // Reset lastIndex for global patterns
    pattern.lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = pattern.exec(description)) !== null) {
      const raw = match[0]
      let part: string | undefined

      if (extractPart && match[1]) {
        const candidate = match[1].trim().toLowerCase()
        if (!PART_BLACKLIST.has(candidate) && candidate.length > 1) {
          part = candidate
        }
      }

      items.push({ category, raw, part })

      // Orijinal parçaları ayrı topla
      if (category === 'orijinal' && part) {
        orijinalParcalar.push(part)
      }

      // Sonsuz döngü koruması
      if (!pattern.global) break
    }
  }

  // Sayıları hesapla
  const degisenItems = items.filter(i => i.category === 'degisen')
  const boyaliItems = items.filter(i => i.category === 'boyali' || i.category === 'lokal_boya')
  const hasarKaydi = items.some(i => i.category === 'hasar_kaydi')

  // Tramer tutarını çıkart
  let tramerTutari: number | null = null
  const tramerItem = items.find(i => i.category === 'tramer')
  if (tramerItem) {
    const numMatch = tramerItem.raw.match(/([\d.,]+)/)
    if (numMatch) {
      tramerTutari = parseFloat(numMatch[1].replace(/\./g, '').replace(',', '.'))
    }
  }

  // Özet metin oluştur
  const parts: string[] = []
  if (degisenItems.length > 0) parts.push(`${degisenItems.length} değişen`)
  if (boyaliItems.length > 0) parts.push(`${boyaliItems.length} boyalı`)
  if (hasarKaydi) parts.push('hasar kaydı')
  if (tramerTutari !== null) parts.push(`tramer: ${tramerTutari.toLocaleString('tr-TR')} TL`)

  // Eğer hiç hasar bilgisi yoksa ve "kazasız hasarsız" varsa
  const kazasizMatch = description.match(/kazasız\s*hasarsız|boyasız|hasarsız/gi)
  if (parts.length === 0 && kazasizMatch) {
    parts.push('Hasarsız')
  }

  const summaryText = parts.length > 0 ? parts.join(', ') : 'Hasar bilgisi belirtilmemiş'

  return {
    degisenCount: degisenItems.length,
    boyaliCount: boyaliItems.length,
    hasarKaydi,
    tramerTutari,
    orijinalParcalar,
    items,
    summaryText,
  }
}
