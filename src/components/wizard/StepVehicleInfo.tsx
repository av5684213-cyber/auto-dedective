'use client'

import { useState, useCallback } from 'react'
import { useListingWizard } from '@/store/wizard-store'

export function StepVehicleInfo() {
  const { data, updateData } = useListingWizard()
  const [brands, setBrands] = useState<string[]>([])
  const [seriesList, setSeriesList] = useState<string[]>([])
  const [modelsList, setModelsList] = useState<string[]>([])
  const [yearsList, setYearsList] = useState<number[]>([])
  const [variantsList, setVariantsList] = useState<string[]>([])
  const [brandsLoaded, setBrandsLoaded] = useState(false)
  const [seriesLoaded, setSeriesLoaded] = useState(false)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [yearsLoaded, setYearsLoaded] = useState(false)

  // Load brands on first render
  if (!brandsLoaded) {
    setBrandsLoaded(true)
    fetch('/api/catalog').then(r => r.json()).then(res => {
      if (res.success) setBrands(res.brands)
    }).catch(() => {})
  }

  const handleBrandChange = useCallback((brand: string) => {
    updateData({ brand, series: '', model: '', year: null, variant: '' })
    setSeriesList([])
    setModelsList([])
    setYearsList([])
    setVariantsList([])
    if (!brand) return
    fetch(`/api/catalog?brand=${encodeURIComponent(brand)}`).then(r => r.json()).then(res => {
      if (res.success) setSeriesList(res.series)
    }).catch(() => {})
  }, [updateData])

  const handleSeriesChange = useCallback((series: string) => {
    updateData({ series, model: '', year: null, variant: '' })
    setModelsList([])
    setYearsList([])
    setVariantsList([])
    if (!data.brand || !series) return
    fetch(`/api/catalog?brand=${encodeURIComponent(data.brand)}&series=${encodeURIComponent(series)}`).then(r => r.json()).then(res => {
      if (res.success) setModelsList(res.models)
    }).catch(() => {})
  }, [data.brand, updateData])

  const handleModelChange = useCallback((model: string) => {
    updateData({ model, year: null, variant: '' })
    setYearsList([])
    setVariantsList([])
    if (!data.brand || !data.series || !model) return
    fetch(`/api/catalog?brand=${encodeURIComponent(data.brand)}&series=${encodeURIComponent(data.series)}&model=${encodeURIComponent(model)}`).then(r => r.json()).then(res => {
      if (res.success) {
        setYearsList(res.years || [])
        setVariantsList(res.variants || [])
      }
    }).catch(() => {})
  }, [data.brand, data.series, updateData])

  const selectClass = 'w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#e37224] appearance-none cursor-pointer'
  const labelClass = 'text-xs text-slate-500 mb-1.5 block font-medium'

  return (
    <div>
      <h2 className="text-lg font-bold text-[#0f2a48] mb-1">Araç Tanımı</h2>
      <p className="text-xs text-slate-400 mb-5">Marka, seri, model, yıl ve versiyon bilgilerini seçin.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Marka */}
        <div>
          <label className={labelClass}>Marka *</label>
          <select value={data.brand} onChange={e => handleBrandChange(e.target.value)} className={selectClass}>
            <option value="">Marka seçin</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {/* Seri */}
        <div>
          <label className={labelClass}>Seri *</label>
          <select value={data.series} onChange={e => handleSeriesChange(e.target.value)} className={selectClass} disabled={!data.brand}>
            <option value="">Seri seçin</option>
            {seriesList.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Model */}
        <div>
          <label className={labelClass}>Model *</label>
          <select value={data.model} onChange={e => handleModelChange(e.target.value)} className={selectClass} disabled={!data.series}>
            <option value="">Model seçin</option>
            {modelsList.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {/* Yıl */}
        <div>
          <label className={labelClass}>Yıl *</label>
          <select value={data.year || ''} onChange={e => updateData({ year: Number(e.target.value) || null })} className={selectClass} disabled={!data.model}>
            <option value="">Yıl seçin</option>
            {yearsList.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* Versiyon */}
        <div>
          <label className={labelClass}>Versiyon</label>
          <select value={data.variant} onChange={e => updateData({ variant: e.target.value })} className={selectClass} disabled={!data.model}>
            <option value="">Versiyon seçin</option>
            {variantsList.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>
    </div>
  )
}
