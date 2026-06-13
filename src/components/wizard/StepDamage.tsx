'use client'

import { useState } from 'react'
import { useListingWizard, PANEL_LABELS, PANEL_CONDITION_COLORS, PANEL_CONDITION_LABELS, type PanelCondition } from '@/store/wizard-store'

const PANEL_KEYS = Object.keys(PANEL_LABELS)
const CONDITIONS: PanelCondition[] = ['ORIJINAL', 'LOKAL_BOYA', 'BOYALI', 'DEGISMIS']

export function StepDamage() {
  const { data, updateData } = useListingWizard()
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null)

  const damageMap = data.damageMap

  const setPanelCondition = (panel: string, condition: PanelCondition) => {
    updateData({ damageMap: { ...damageMap, [panel]: condition } })
  }

  // Stats
  const stats = { ORIJINAL: 0, LOKAL_BOYA: 0, BOYALI: 0, DEGISMIS: 0, total: PANEL_KEYS.length }
  PANEL_KEYS.forEach(key => {
    const c = damageMap[key] || 'ORIJINAL'
    stats[c]++
  })

  return (
    <div>
      <h2 className="text-lg font-bold text-[#0f2a48] mb-1">Hasar & Boya</h2>
      <p className="text-xs text-slate-400 mb-5">Aracınızın panel durumunu belirtin. İşaretlenmeyen paneller &quot;Orijinal&quot; kabul edilir.</p>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {CONDITIONS.map(c => (
          <div key={c} className="bg-white rounded-xl border border-slate-200 p-2.5 text-center">
            <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: PANEL_CONDITION_COLORS[c] }} />
            <span className="text-lg font-bold text-[#0f2a48] block">{stats[c]}</span>
            <span className="text-[9px] text-slate-400">{PANEL_CONDITION_LABELS[c]}</span>
          </div>
        ))}
      </div>

      {/* Vehicle Diagram - Top View */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4">
        <div className="max-w-lg mx-auto">
          <svg viewBox="0 0 400 520" className="w-full" style={{ maxHeight: '450px' }}>
            {/* Vehicle outline - simplified top view */}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Tavan (roof) - center */}
            <PanelRect
              x={130} y={180} w={140} h={130}
              panelKey="tavan" label="Tavan"
              condition={damageMap.tavan || 'ORIJINAL'}
              isSelected={selectedPanel === 'tavan'}
              onClick={() => setSelectedPanel(selectedPanel === 'tavan' ? null : 'tavan')}
            />

            {/* Ön Tampon */}
            <PanelRect
              x={110} y={10} w={180} h={55}
              panelKey="on_tampon" label="Ön Tm."
              condition={damageMap.on_tampon || 'ORIJINAL'}
              isSelected={selectedPanel === 'on_tampon'}
              onClick={() => setSelectedPanel(selectedPanel === 'on_tampon' ? null : 'on_tampon')}
            />

            {/* Kaput */}
            <PanelRect
              x={120} y={70} w={160} h={100}
              panelKey="kaput" label="Kaput"
              condition={damageMap.kaput || 'ORIJINAL'}
              isSelected={selectedPanel === 'kaput'}
              onClick={() => setSelectedPanel(selectedPanel === 'kaput' ? null : 'kaput')}
            />

            {/* Sağ Ön Çamurluk */}
            <PanelRect
              x={285} y={70} w={55} h={55}
              panelKey="sag_on_camurluk" label="Sağ Ön Çmr."
              condition={damageMap.sag_on_camurluk || 'ORIJINAL'}
              isSelected={selectedPanel === 'sag_on_camurluk'}
              onClick={() => setSelectedPanel(selectedPanel === 'sag_on_camurluk' ? null : 'sag_on_camurluk')}
            />

            {/* Sol Ön Çamurluk */}
            <PanelRect
              x={60} y={70} w={55} h={55}
              panelKey="sol_on_camurluk" label="Sol Ön Çmr."
              condition={damageMap.sol_on_camurluk || 'ORIJINAL'}
              isSelected={selectedPanel === 'sol_on_camurluk'}
              onClick={() => setSelectedPanel(selectedPanel === 'sol_on_camurluk' ? null : 'sol_on_camurluk')}
            />

            {/* Sağ Ön Kapı */}
            <PanelRect
              x={275} y={130} w={65} h={80}
              panelKey="sag_on_kapi" label="Sağ Ön Kp."
              condition={damageMap.sag_on_kapi || 'ORIJINAL'}
              isSelected={selectedPanel === 'sag_on_kapi'}
              onClick={() => setSelectedPanel(selectedPanel === 'sag_on_kapi' ? null : 'sag_on_kapi')}
            />

            {/* Sol Ön Kapı */}
            <PanelRect
              x={60} y={130} w={65} h={80}
              panelKey="sol_on_kapi" label="Sol Ön Kp."
              condition={damageMap.sol_on_kapi || 'ORIJINAL'}
              isSelected={selectedPanel === 'sol_on_kapi'}
              onClick={() => setSelectedPanel(selectedPanel === 'sol_on_kapi' ? null : 'sol_on_kapi')}
            />

            {/* Sağ Arka Kapı */}
            <PanelRect
              x={275} y={215} w={65} h={80}
              panelKey="sag_arka_kapi" label="Sağ Arka Kp."
              condition={damageMap.sag_arka_kapi || 'ORIJINAL'}
              isSelected={selectedPanel === 'sag_arka_kapi'}
              onClick={() => setSelectedPanel(selectedPanel === 'sag_arka_kapi' ? null : 'sag_arka_kapi')}
            />

            {/* Sol Arka Kapı */}
            <PanelRect
              x={60} y={215} w={65} h={80}
              panelKey="sol_arka_kapi" label="Sol Arka Kp."
              condition={damageMap.sol_arka_kapi || 'ORIJINAL'}
              isSelected={selectedPanel === 'sol_arka_kapi'}
              onClick={() => setSelectedPanel(selectedPanel === 'sol_arka_kapi' ? null : 'sol_arka_kapi')}
            />

            {/* Sağ Arka Çamurluk */}
            <PanelRect
              x={285} y={300} w={55} h={55}
              panelKey="sag_arka_camurluk" label="Sağ Ark Çmr."
              condition={damageMap.sag_arka_camurluk || 'ORIJINAL'}
              isSelected={selectedPanel === 'sag_arka_camurluk'}
              onClick={() => setSelectedPanel(selectedPanel === 'sag_arka_camurluk' ? null : 'sag_arka_camurluk')}
            />

            {/* Sol Arka Çamurluk */}
            <PanelRect
              x={60} y={300} w={55} h={55}
              panelKey="sol_arka_camurluk" label="Sol Ark Çmr."
              condition={damageMap.sol_arka_camurluk || 'ORIJINAL'}
              isSelected={selectedPanel === 'sol_arka_camurluk'}
              onClick={() => setSelectedPanel(selectedPanel === 'sol_arka_camurluk' ? null : 'sol_arka_camurluk')}
            />

            {/* Bagaj Kapağı */}
            <PanelRect
              x={120} y={320} w={160} h={80}
              panelKey="bagaj_kapagi" label="Bagaj"
              condition={damageMap.bagaj_kapagi || 'ORIJINAL'}
              isSelected={selectedPanel === 'bagaj_kapagi'}
              onClick={() => setSelectedPanel(selectedPanel === 'bagaj_kapagi' ? null : 'bagaj_kapagi')}
            />

            {/* Arka Tampon */}
            <PanelRect
              x={110} y={405} w={180} h={55}
              panelKey="arka_tampon" label="Arka Tm."
              condition={damageMap.arka_tampon || 'ORIJINAL'}
              isSelected={selectedPanel === 'arka_tampon'}
              onClick={() => setSelectedPanel(selectedPanel === 'arka_tampon' ? null : 'arka_tampon')}
            />

            {/* Direction labels */}
            <text x={200} y={500} textAnchor="middle" fill="#64748b" fontSize="9">Ön ← → Arka  |  Sol ← → Sağ</text>
          </svg>
        </div>
      </div>

      {/* Selected Panel Condition Picker */}
      {selectedPanel && (
        <div className="bg-white border border-[#f09040]/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#0f2a48]">{PANEL_LABELS[selectedPanel]}</h3>
            <button onClick={() => setSelectedPanel(null)} className="text-slate-400 hover:text-slate-900 text-xs">Kapat</button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {CONDITIONS.map(c => (
              <button
                key={c}
                onClick={() => { setPanelCondition(selectedPanel, c); setSelectedPanel(null) }}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                  damageMap[selectedPanel] === c
                    ? 'border-[#e37224] bg-[#fff8f0]'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: PANEL_CONDITION_COLORS[c] }} />
                <span className="text-[10px] text-slate-600">{PANEL_CONDITION_LABELS[c]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 text-[9px] text-slate-400">
        {CONDITIONS.map(c => (
          <span key={c} className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: PANEL_CONDITION_COLORS[c] }} />
            {PANEL_CONDITION_LABELS[c]}
          </span>
        ))}
      </div>
    </div>
  )
}

/* SVG Panel Rect Component */
function PanelRect({ x, y, w, h, panelKey, label, condition, isSelected, onClick }: {
  x: number; y: number; w: number; h: number; panelKey: string; label: string;
  condition: PanelCondition; isSelected: boolean; onClick: () => void
}) {
  const color = PANEL_CONDITION_COLORS[condition]
  const opacity = condition === 'ORIJINAL' ? 0.25 : 0.5

  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      <rect
        x={x} y={y} width={w} height={h}
        rx={6} ry={6}
        fill={color}
        fillOpacity={opacity}
        stroke={isSelected ? '#e37224' : color}
        strokeWidth={isSelected ? 2.5 : 1}
        style={{ transition: 'all 0.2s' }}
      />
      <text
        x={x + w / 2} y={y + h / 2}
        textAnchor="middle" dominantBaseline="middle"
        fill="#334155" fontSize="8" fontWeight="600"
        style={{ pointerEvents: 'none' }}
      >
        {label}
      </text>
    </g>
  )
}
