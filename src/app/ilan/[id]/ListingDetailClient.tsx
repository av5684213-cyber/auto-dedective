'use client'

import {
  MapPin, Phone, Car, Shield, Paintbrush, Check, Star, ArrowLeft, Calendar, Gauge, Fuel, Settings2, Palette
} from 'lucide-react'
import { PANEL_LABELS, PANEL_CONDITION_LABELS, PANEL_CONDITION_COLORS, EQUIPMENT_GROUPS, type PanelCondition } from '@/store/wizard-store'

interface ListingDetailProps {
  listing: Record<string, any>
}

export default function ListingDetailClient({ listing }: ListingDetailProps) {
  const l = listing
  const conditionLabel = (c: string) => c === 'SIFIR' ? 'Sıfır' : c === 'IKINCI_EL' ? 'İkinci El' : '-'
  const sellerLabel = (s: string) => s === 'SAHIBI' ? 'Sahibinden' : s === 'GALERI' ? 'Galeriden' : '-'
  const damageEntries = Object.entries(l.damageMap || {}).filter(([_, v]: [string, any]) => v !== 'ORIJINAL') as [string, PanelCondition][]

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Sub-header breadcrumb */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-lg sticky top-14 z-30">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <a href="/" className="flex items-center gap-2 text-slate-500 hover:text-[#e37224] transition-colors">
            <ArrowLeft size={16} />
            <span className="text-xs">Ana Sayfa</span>
          </a>
          <span className="text-slate-300">/</span>
          <span className="text-xs text-slate-700 truncate">{l.title || 'İlan Detayı'}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Photos */}
        {l.photos && l.photos.length > 0 && (
          <div className="relative h-64 sm:h-80 bg-slate-200 rounded-2xl overflow-hidden mb-6">
            <img src={l.photos[l.coverPhotoIndex] || l.photos[0]} alt="Kapak" className="w-full h-full object-cover" />
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2.5 py-1 rounded-full">
              {l.photos.length} fotoğraf
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <h1 className="text-xl font-extrabold text-[#0f2a48] mb-1">{l.title || `${l.year} ${l.brand} ${l.model}`}</h1>
              <p className="text-sm text-slate-500">{l.brand} {l.series} {l.model} {l.variant && `· ${l.variant}`}</p>
            </div>

            {/* Key specs */}
            <div className="flex flex-wrap gap-2">
              {l.year && <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1"><Calendar size={11} />{l.year}</span>}
              {l.km !== null && <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1"><Gauge size={11} />{l.km?.toLocaleString('tr-TR')} km</span>}
              {l.fuel && <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1"><Fuel size={11} />{l.fuel}</span>}
              {l.transmission && <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1"><Settings2 size={11} />{l.transmission}</span>}
              {l.bodyType && <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg">{l.bodyType}</span>}
              {l.color && <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1"><Palette size={11} />{l.color}</span>}
              {l.condition && <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg">{conditionLabel(l.condition)}</span>}
            </div>

            {/* Technical */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {l.enginePower && <div className="bg-white rounded-xl p-3 border border-slate-200"><span className="text-[10px] text-slate-400 block">Motor Gücü</span><span className="text-sm font-bold text-[#0f2a48]">{l.enginePower} HP</span></div>}
              {l.engineCc && <div className="bg-white rounded-xl p-3 border border-slate-200"><span className="text-[10px] text-slate-400 block">Motor Hacmi</span><span className="text-sm font-bold text-[#0f2a48]">{l.engineCc} cc</span></div>}
              {l.drivetrain && <div className="bg-white rounded-xl p-3 border border-slate-200"><span className="text-[10px] text-slate-400 block">Çekiş</span><span className="text-sm font-bold text-[#0f2a48]">{l.drivetrain}</span></div>}
              <div className="bg-white rounded-xl p-3 border border-slate-200"><span className="text-[10px] text-slate-400 block">Kimden</span><span className="text-sm font-bold text-[#0f2a48]">{sellerLabel(l.sellerType)}</span></div>
            </div>

            {/* Description */}
            {l.description && (
              <div>
                <h3 className="text-sm font-bold text-[#0f2a48] mb-2">Açıklama</h3>
                <p className="text-xs text-slate-500 whitespace-pre-wrap leading-relaxed">{l.description}</p>
              </div>
            )}

            {/* Equipment */}
            {l.equipment && l.equipment.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-[#0f2a48] mb-2 flex items-center gap-1.5"><Shield size={14} className="text-blue-600" />Donanım</h3>
                <div className="flex flex-wrap gap-1.5">
                  {l.equipment.map((eq: string) => (
                    <span key={eq} className="text-[10px] bg-blue-50 border border-blue-200 text-blue-600 px-2.5 py-1 rounded-full">{eq}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Damage */}
            <div>
              <h3 className="text-sm font-bold text-[#0f2a48] mb-2 flex items-center gap-1.5"><Paintbrush size={14} className="text-[#e37224]" />Hasar & Boya</h3>
              {damageEntries.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {damageEntries.map(([key, cond]) => (
                    <div key={key} className="flex items-center gap-2 text-[11px] bg-white rounded-lg px-3 py-2 border border-slate-200">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: PANEL_CONDITION_COLORS[cond] }} />
                      <span className="text-slate-500">{PANEL_LABELS[key]}</span>
                      <span className="text-slate-700 ml-auto font-medium">{PANEL_CONDITION_LABELS[cond]}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                  <Check size={14} /> Tüm paneller orijinal
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Price Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <span className="text-2xl font-extrabold text-[#e37224]">{l.price ? l.price.toLocaleString('tr-TR') + ' TL' : 'Fiyat belirtilmemiş'}</span>
              {l.negotiable && <p className="text-[10px] text-green-600 mt-1">Pazarlık payı var</p>}
              {l.exchange && <p className="text-[10px] text-[#c85e1a] mt-1">Takas açık</p>}
              {l.warranty && <p className="text-[10px] text-blue-600 mt-1">Garanti var</p>}
            </div>

            {/* Contact Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-[#0f2a48] mb-3">İletişim</h3>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <Phone size={14} className="text-green-600 shrink-0" />
                  <a href={`tel:0${l.contactPhone}`} className="hover:text-[#e37224]">{l.contactPhone}</a>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <MapPin size={14} className="text-[#e37224] shrink-0" />
                  <span>{l.city}{l.district ? ` / ${l.district}` : ''}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Car size={14} className="text-blue-600 shrink-0" />
                  <span>{l.contactName}</span>
                </div>
              </div>
            </div>

            {/* Date */}
            {l.publishedAt && (
              <div className="text-[10px] text-slate-400 text-center">
                Yayınlanma: {new Date(l.publishedAt).toLocaleDateString('tr-TR')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
