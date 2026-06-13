import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, requireOwnership } from '@/lib/session'

export const dynamic = 'force-dynamic'

const VALID_CONDITIONS = ['SIFIR', 'IKINCI_EL'] as const
const VALID_SELLER_TYPES = ['SAHIBI', 'GALERI', 'BILINMIYOR'] as const

function toAsciiLower(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
}

const CONDITION_MAP: Record<string, string> = {
  'sifir': 'SIFIR',
  'ikinci_el': 'IKINCI_EL',
}

const SELLER_MAP: Record<string, string> = {
  'sahibinden': 'SAHIBI',
  'galeriden': 'GALERI',
  'sahis': 'BILINMIYOR',
  'bilinmiyor': 'BILINMIYOR',
}

function sanitizeCondition(value: unknown): string | null {
  if (!value) return null
  if ((VALID_CONDITIONS as readonly string[]).includes(value as string)) return value as string
  const key = toAsciiLower(String(value))
  if (CONDITION_MAP[key]) return CONDITION_MAP[key]
  return null
}

function sanitizeSellerType(value: unknown): string {
  if (!value) return 'BILINMIYOR'
  if ((VALID_SELLER_TYPES as readonly string[]).includes(value as string)) return value as string
  const key = toAsciiLower(String(value))
  if (SELLER_MAP[key]) return SELLER_MAP[key]
  return 'BILINMIYOR'
}

function buildDbData(data: Record<string, unknown>, userId: string): Record<string, unknown> {
  return {
    source: 'OTODEDEKTIF',
    status: 'DRAFT',
    userId,
    brand: data.brand || null,
    series: data.series || null,
    model: data.model || null,
    year: data.year || null,
    variant: data.variant || null,
    bodyType: data.bodyType || null,
    transmission: data.transmission || null,
    fuel: data.fuel || null,
    color: data.color || null,
    enginePower: data.enginePower || null,
    engineCc: data.engineCc || null,
    drivetrain: data.drivetrain || null,
    km: data.km || null,
    condition: sanitizeCondition(data.condition),
    sellerType: sanitizeSellerType(data.sellerType),
    warranty: !!data.warranty,
    heavyDamageRecord: !!data.heavyDamageRecord,
    plateOrigin: data.plateOrigin || null,
    exchange: !!data.exchange,
    price: data.price || null,
    negotiable: !!data.negotiable,
    title: data.title || null,
    description: data.description || null,
    equipment: JSON.stringify(Array.isArray(data.equipment) ? data.equipment : []),
    damageMap: JSON.stringify(data.damageMap && typeof data.damageMap === 'object' ? data.damageMap : {}),
    photos: JSON.stringify(Array.isArray(data.photos) ? data.photos : []),
    coverPhotoIndex: data.coverPhotoIndex || 0,
    city: data.city || null,
    district: data.district || null,
    contactName: data.contactName || null,
    contactPhone: data.contactPhone || null,
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { userId } = authResult

    const body = await request.json()
    const { listingId, data } = body as { listingId?: string | null; data?: Record<string, unknown> }

    let resolvedId = listingId || null

    if (!resolvedId && data) {
      const dbData = buildDbData(data, userId)
      const created = await db.listing.create({ data: dbData })
      resolvedId = created.id
    }

    if (!resolvedId) {
      return NextResponse.json(
        { success: false, error: 'İlan verisi veya listingId gerekli' },
        { status: 400 }
      )
    }

    const listing = await db.listing.findUnique({ where: { id: resolvedId } })
    if (!listing) {
      return NextResponse.json({ success: false, error: 'İlan bulunamadı' }, { status: 404 })
    }

    // Sahiplik kontrolü
    if (listing.userId) {
      const ownership = await requireOwnership(listing.userId)
      if (ownership instanceof Response) return ownership
    }

    if (listingId && data) {
      const updateData = buildDbData(data, userId)
      delete updateData.source
      delete updateData.status
      await db.listing.update({ where: { id: resolvedId }, data: updateData })
    }

    const autoTitle = listing.title || `${listing.year || ''} ${listing.brand || ''} ${listing.model || ''}`.trim()

    const updated = await db.listing.update({
      where: { id: resolvedId },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        title: autoTitle,
        url: `/ilan/${resolvedId}`,
        isActive: true,
        userId,
      },
    })

    return NextResponse.json({ success: true, listingId: updated.id, slug: updated.id })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Bilinmeyen hata'
    console.error('[publish] Error:', error)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
