// ─── Şüpheli İlan Uyarı Modülü (Kırmızı Bayraklar) ───
// Her ilan için risk faktörlerini kontrol eder.

export interface RedFlag {
  type: string
  severity: 'low' | 'medium' | 'high'
  label: string
  description: string
}

/**
 * İlan için kırmızı bayrakları kontrol eder.
 */
export function checkRedFlags(params: {
  priceDelta: number | null       // fiyat/medyan yüzdesi
  description: string | null      // ilan açıklaması
  otherDescriptions?: string[]    // diğer ilanların açıklamaları (kopyala-yapıştır kontrolü)
  photoHashes?: string[]          // bu ilanın fotoğraf hash'leri
  otherPhotoHashes?: string[][]   // diğer ilanların fotoğraf hash'leri
  suspectedDealer: boolean        // galerici sinyali
  sellerType: string | null       // satıcı türü
}): RedFlag[] {
  const flags: RedFlag[] = []

  // 1. Aşırı düşük fiyat
  if (params.priceDelta !== null && params.priceDelta <= -35) {
    flags.push({
      type: 'LOW_PRICE',
      severity: 'high',
      label: 'Fiyat Çok Düşük',
      description: `İlan fiyatı piyasa ortalamasının %${Math.abs(params.priceDelta)} altında. Dolandırıcılık riski taşıyabilir.`,
    })
  } else if (params.priceDelta !== null && params.priceDelta <= -20) {
    flags.push({
      type: 'BELOW_MARKET',
      severity: 'medium',
      label: 'Piyasanın Altında',
      description: `İlan fiyatı piyasa ortalamasının %${Math.abs(params.priceDelta)} altında.`,
    })
  }

  // 2. Kopyala-yapıştır açıklama
  if (params.description && params.otherDescriptions && params.otherDescriptions.length > 0) {
    const descNorm = normalizeForComparison(params.description)
    let similarCount = 0

    for (const other of params.otherDescriptions) {
      if (!other) continue
      const otherNorm = normalizeForComparison(other)
      const similarity = jaccardSimilarity(descNorm, otherNorm)
      if (similarity > 0.7) similarCount++
    }

    if (similarCount >= 3) {
      flags.push({
        type: 'COPY_PASTE',
        severity: 'high',
        label: 'Kopyala-Yapıştır Açıklama',
        description: `Bu açıklama ${similarCount} başka ilanda da benzer şekilde kullanılmış.`,
      })
    } else if (similarCount >= 1) {
      flags.push({
        type: 'SIMILAR_DESC',
        severity: 'low',
        label: 'Benzer Açıklama',
        description: `${similarCount} başka ilanda benzer açıklama tespit edildi.`,
      })
    }
  }

  // 3. Stok fotoğraf
  if (params.photoHashes && params.photoHashes.length > 0 && params.otherPhotoHashes) {
    let stockMatchCount = 0
    for (const otherHashes of params.otherPhotoHashes) {
      if (!otherHashes) continue
      const overlap = params.photoHashes.filter(h => otherHashes.includes(h)).length
      if (overlap > 0) stockMatchCount++
    }

    if (stockMatchCount >= 2) {
      flags.push({
        type: 'STOCK_PHOTO',
        severity: 'medium',
        label: 'Stok Fotoğraf Şüphesi',
        description: 'Bu fotoğraflar başka ilanlarda da kullanılmış olabilir.',
      })
    }
  }

  // 4. Galerici sinyali
  if (params.suspectedDealer) {
    flags.push({
      type: 'DEALER_SIGNAL',
      severity: 'medium',
      label: 'Muhtemelen Galeri/Toptan Satıcı',
      description: 'Bu telefon numarası birçok ilanda kullanılmış. Satıcı galeri olabilir.',
    })
  }

  // 5. Satıcı türü uyuşmazlığı
  if (params.sellerType === 'Bireysel' && params.suspectedDealer) {
    flags.push({
      type: 'SELLER_MISMATCH',
      severity: 'high',
      label: 'Satıcı Türü Uyuşmuyor',
      description: 'İlan bireysel olarak işaretlenmiş ama telefon numarası galerici sinyali veriyor.',
    })
  }

  return flags
}

/** Metni karşılaştırma için normalize eder */
function normalizeForComparison(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\sğüşıöçĞÜŞİÖÇ]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2) // kısa kelimeleri ele
}

/** Jaccard benzerlik katsayısı */
function jaccardSimilarity(setA: string[], setB: string[]): number {
  const a = new Set(setA)
  const b = new Set(setB)
  const intersection = new Set([...a].filter(x => b.has(x)))
  const union = new Set([...a, ...b])
  return union.size === 0 ? 0 : intersection.size / union.size
}
