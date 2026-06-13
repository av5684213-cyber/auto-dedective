'use client'

import { useListingWizard, PANEL_LABELS, PANEL_CONDITION_LABELS, PANEL_CONDITION_COLORS, EQUIPMENT_GROUPS, type PanelCondition } from '@/store/wizard-store'
import { Star, MapPin, Phone, Shield, Paintbrush, Check, X } from 'lucide-react'

export function StepPreview() {
  const { data } = useListingWizard()

  const conditionLabel = (c: string) => c === 'SIFIR' ? 'Sıfır' : c === 'IKINCI_EL' ? 'İkinci El' : '-'
  const sellerLabel = (s: string) => s === 'SAHIBI' ? 'Sahibinden' : s === 'GALERI' ? 'Galeriden' : '-'

  // Damage summary
  const damageEntries = Object.entries(data.damageMap).filter(([_, v]) => v !== 'ORIJINAL') as [string, PanelCondition][]

  return (
    <div>
      <h2 className="text-lg font-bold text-[#0f2a48] mb-1">Önizleme</h2>
      <p className="text-xs text-slate-400 mb-5">İlanınızın nasıl görüneceğini kontrol edin.</p>

      {/* Preview Card */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Photos */}
        {data.photos.length > 0 && (
          <div className="relative h-56 bg-slate-100">
            <img src={data.photos[data.coverPhotoIndex] || data.photos[0]} alt="Kapak" className="w-full h-full object-cover" />
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
              {data.photos.length} fotoğraf
            </div>
          </div>
        )}

        <div className="p-5">
          {/* Title & Price */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="text-base font-bold text-[#0f2a48]">{data.title || `${data.year || ''} ${data.brand || ''} ${data.model || ''}`}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{data.brand} {data.series} {data.model} {data.variant && `· ${data.variant}`}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xl font-extrabold text-[#e37224]">{data.price ? data.price.toLocaleString('tr-TR') + ' TL' : '-'}</span>
              {data.negotiable && <p className="text-[9px] text-green-500">Pazarlık payı var</p>}
            </div>
          </div>

          {/* Key specs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {data.year && <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">{data.year}</span>}
            {data.km !== null && <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">{data.km?.toLocaleString('tr-TR')} km</span>}
            {data.fuel && <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">{data.fuel}</span>}
            {data.transmission && <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">{data.transmission}</span>}
            {data.bodyType && <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">{data.bodyType}</span>}
            {data.color && <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">{data.color}</span>}
            {data.condition && <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">{conditionLabel(data.condition)}</span>}
          </div>

          {/* Technical details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-[10px]">
            {data.enginePower && <div className="bg-slate-50 rounded-lg p-2"><span className="text-slate-400 block">Motor Gücü</span><span className="text-slate-900 font-medium">{data.enginePower} HP</span></div>}
            {data.engineCc && <div className="bg-slate-50 rounded-lg p-2"><span className="text-slate-400 block">Motor Hacmi</span><span className="text-slate-900 font-medium">{data.engineCc} cc</span></div>}
            {data.drivetrain && <div className="bg-slate-50 rounded-lg p-2"><span className="text-slate-400 block">Çekiş</span><span className="text-slate-900 font-medium">{data.drivetrain}</span></div>}
            <div className="bg-slate-50 rounded-lg p-2"><span className="text-slate-400 block">Kimden</span><span className="text-slate-900 font-medium">{sellerLabel(data.sellerType)}</span></div>
            {data.warranty && <div className="bg-slate-50 rounded-lg p-2"><span className="text-slate-400 block">Garanti</span><span className="text-green-500 font-medium">Var</span></div>}
            {data.exchange && <div className="bg-slate-50 rounded-lg p-2"><span className="text-slate-400 block">Takas</span><span className="text-[#e37224] font-medium">Açık</span></div>}
            {data.plateOrigin && <div className="bg-slate-50 rounded-lg p-2"><span className="text-slate-400 block">Plaka</span><span className="text-slate-900 font-medium">{data.plateOrigin}</span></div>}
            {data.heavyDamageRecord && <div className="bg-slate-50 rounded-lg p-2"><span className="text-slate-400 block">Ağır Hasar</span><span className="text-red-500 font-medium">Kayıt Var</span></div>}
          </div>

          {/* Description */}
          {data.description && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-[#0f2a48] mb-1">Açıklama</h4>
              <p className="text-[11px] text-slate-500 whitespace-pre-wrap leading-relaxed">{data.description}</p>
            </div>
          )}

          {/* Equipment */}
          {data.equipment.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-[#0f2a48] mb-2 flex items-center gap-1"><Shield size={12} className="text-blue-500" />Donanım</h4>
              <div className="flex flex-wrap gap-1">
                {data.equipment.map(eq => (
                  <span key={eq} className="text-[9px] bg-blue-50 border border-blue-200 text-blue-600 px-2 py-0.5 rounded-full">{eq}</span>
                ))}
              </div>
            </div>
          )}

          {/* Damage Summary */}
          {damageEntries.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-[#0f2a48] mb-2 flex items-center gap-1"><Paintbrush size={12} className="text-[#e37224]" />Hasar & Boya</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {damageEntries.map(([key, cond]) => (
                  <div key={key} className="flex items-center gap-1.5 text-[10px] bg-slate-50 rounded-lg px-2 py-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PANEL_CONDITION_COLORS[cond] }} />
                    <span className="text-slate-500">{PANEL_LABELS[key]}</span>
                    <span className="text-slate-600 ml-auto">{PANEL_CONDITION_LABELS[cond]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {damageEntries.length === 0 && (
            <div className="mb-4 flex items-center gap-2 text-[10px] text-green-500 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <Check size={12} /> Tüm paneller orijinal
            </div>
          )}

          {/* Contact */}
          <div className="border-t border-slate-200 pt-3 mt-3">
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1 text-slate-600"><MapPin size={12} className="text-[#e37224]" />{data.city}{data.district ? ` / ${data.district}` : ''}</span>
              <span className="flex items-center gap-1 text-slate-600"><Phone size={12} className="text-green-500" />0 {data.contactPhone}</span>
              <span className="text-slate-500">{data.contactName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
