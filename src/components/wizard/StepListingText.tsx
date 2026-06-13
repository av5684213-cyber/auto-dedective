'use client'

import { useListingWizard } from '@/store/wizard-store'

export function StepListingText() {
  const { data, updateData } = useListingWizard()

  const inputClass = 'w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#e37224]'
  const labelClass = 'text-xs text-slate-500 mb-1.5 block font-medium'

  return (
    <div>
      <h2 className="text-lg font-bold text-[#0f2a48] mb-1">İlan Metni</h2>
      <p className="text-xs text-slate-400 mb-5">İlan başlığı, açıklama ve fiyat bilgilerini girin.</p>

      <div className="space-y-4">
        {/* Başlık */}
        <div>
          <label className={labelClass}>İlan Başlığı * <span className="text-slate-400">({data.title.length}/100)</span></label>
          <input
            type="text"
            value={data.title}
            onChange={e => updateData({ title: e.target.value.slice(0, 100) })}
            placeholder="ör: 2022 Toyota Corolla 1.8 Hybrid Flame"
            className={inputClass}
            maxLength={100}
          />
        </div>

        {/* Açıklama */}
        <div>
          <label className={labelClass}>Açıklama</label>
          <textarea
            value={data.description}
            onChange={e => updateData({ description: e.target.value })}
            placeholder="Aracınızın detaylı açıklamasını yazın... Hasar durumu, bakım geçmişi, ekstra donanım vb."
            rows={6}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Fiyat */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Fiyat (TL) *</label>
            <div className="relative">
              <input
                type="number"
                value={data.price || ''}
                onChange={e => updateData({ price: Number(e.target.value) || null })}
                placeholder="ör: 980000"
                className={inputClass}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">TL</span>
            </div>
            {data.price && (
              <p className="text-[10px] text-slate-400 mt-1">{data.price.toLocaleString('tr-TR')} TL</p>
            )}
          </div>

          <div className="flex items-end">
            <div className="flex items-center justify-between w-full py-2.5 px-3 bg-white rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">Pazarlık Payı</span>
              <button
                onClick={() => updateData({ negotiable: !data.negotiable })}
                className={`w-10 h-5 rounded-full transition-all ${data.negotiable ? 'bg-[#e37224]' : 'bg-slate-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${data.negotiable ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
