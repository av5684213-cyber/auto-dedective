import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import ListingDetailClient from './ListingDetailClient'

export const dynamic = 'force-dynamic'

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const listing = await db.listing.findUnique({ where: { id } })

  if (!listing || listing.status !== 'PUBLISHED') {
    notFound()
  }

  const parsed = {
    ...listing,
    equipment: JSON.parse(listing.equipment || '[]'),
    damageMap: JSON.parse(listing.damageMap || '{}'),
    photos: JSON.parse(listing.photos || '[]'),
  }

  return <ListingDetailClient listing={parsed} />
}
