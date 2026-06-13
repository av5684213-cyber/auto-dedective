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

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { userId } = authResult

    const body = await request.json()
    const { listingId, data } = body as { listingId?: string; data: Record<string, unknown> }

    if (!data || typeof data !== 'object') {
      return NextResponse.json({ success: false, error: 'data alanı gerekli' }, { status: 400 })
    }

    const sanitizedCondition = sanitizeCondition(data.condition)
    const sanitizedSellerType = sanitizeSellerType(data.sellerType)

    const dbData: Record<string, unknown> = {
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
      condition: sanitizedCondition,
      sellerType: sanitizedSellerType,
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

    if (listingId) {
      // Sahiplik kontrolü
      const existing = await db.listing.findUnique({ where: { id: listingId } })
      if (existing?.userId) {
        const ownership = await requireOwnership(existing.userId)
        if (ownership instanceof Response) return ownership
      }

      try {
        const updated = await db.listing.update({
          where: { id: listingId },
          data: dbData,
        })
        return NextResponse.json({ success: true, listingId: updated.id })
      } catch (updateError: unknown) {
        const prismaError = updateError as { code?: string }
        if (prismaError.code === 'P2025') {
          const created = await db.listing.create({ data: dbData })
          return NextResponse.json({ success: true, listingId: created.id })
        }
        throw updateError
      }
    } else {
      const created = await db.listing.create({ data: dbData })
      return NextResponse.json({ success: true, listingId: created.id })
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Bilinmeyen hata'
    console.error('[draft] Save error:', error)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult

    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get('id')

    if (!listingId) {
      return NextResponse.json({ success: false, error: 'id gerekli' }, { status: 400 })
    }

    const listing = await db.listing.findUnique({ where: { id: listingId } })
    if (!listing) {
      return NextResponse.json({ success: false, error: 'İlan bulunamadı' }, { status: 404 })
    }

    // Sahiplik kontrolü
    if (listing.userId) {
      const ownership = await requireOwnership(listing.userId)
      if (ownership instanceof Response) return ownership
    }

    let equipment: unknown[] = []
    let damageMap: Record<string, unknown> = {}
    let photos: unknown[] = []
    try { equipment = JSON.parse(listing.equipment || '[]') } catch { /* keep default */ }
    try { damageMap = JSON.parse(listing.damageMap || '{}') } catch { /* keep default */ }
    try { photos = JSON.parse(listing.photos || '[]') } catch { /* keep default */ }

    return NextResponse.json({ success: true, listing: { ...listing, equipment, damageMap, photos } })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Hata"
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
