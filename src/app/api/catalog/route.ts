import { NextRequest, NextResponse } from 'next/server'
import { getBrands, getSeries, getModels, getYears, getVariants } from '@/data/cars'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const brand = searchParams.get('brand')
  const series = searchParams.get('series')
  const model = searchParams.get('model')

  try {
    if (model && series && brand) {
      // Versiyonlar + yıllar
      const variants = getVariants(brand, series, model)
      const years = getYears(brand, series, model)
      return NextResponse.json({ success: true, variants, years })
    }
    if (series && brand) {
      const models = getModels(brand, series)
      return NextResponse.json({ success: true, models })
    }
    if (brand) {
      const seriesList = getSeries(brand)
      return NextResponse.json({ success: true, series: seriesList })
    }
    // Tüm markalar
    const brands = getBrands()
    return NextResponse.json({ success: true, brands })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
