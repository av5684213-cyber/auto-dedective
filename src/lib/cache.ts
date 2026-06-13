// ─── Bellek İçi Kısa Ömürlü Cache ───
// Aynı sorgu için sonucu 5 dakika önbelleğe alır.

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

// Her 5 dakika süresi dolan girdileri temizle
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (now > entry.expiresAt) {
      cache.delete(key);
    }
  }
}, 300_000);

/**
 * Cache'e yazar.
 */
export function cacheSet<T>(key: string, data: T, ttlMs: number = 300_000): void {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

/**
 * Cache'den okur. Bulunamazsa veya süresi dolmuşsa null döner.
 */
export function cacheGet<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

/**
 * Cache anahtarı oluşturur (route + parametrelerin hash'i).
 */
export function makeCacheKey(route: string, params: Record<string, unknown>): string {
  const sorted = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
    .join("&");
  return `${route}?${sorted}`;
}
