'use client'

import { useListingWizard, EQUIPMENT_GROUPS } from '@/store/wizard-store'

export function StepEquipment() {
  const { data, updateData } = useListingWizard()

  const toggleItem = (code: string) => {
    const current = data.equipment
    if (current.includes(code)) {
      updateData({ equipment: current.filter(e => e !== code) })
    } else {
      updateData({ equipment: [...current, code] })
    }
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-[#0f2a48] mb-1">Donanım</h2>
      <p className="text-xs text-slate-400 mb-5">Aracınızda bulunan donanımları işaretleyin. Opsiyonel.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Object.entries(EQUIPMENT_GROUPS).map(([groupKey, group]) => (
          <div key={groupKey} className="bg-white border border-slate-200 rounded-xl p-4">
            <h3 className="text-sm font-bold text-[#0f2a48] mb-3">{group.label}</h3>
            <div className="grid grid-cols-2 gap-1.5">
              {group.items.map(item => {
                const isSelected = data.equipment.includes(item)
                return (
                  <button
                    key={item}
                    onClick={() => toggleItem(item)}
                    className={`text-[11px] text-left px-2.5 py-1.5 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-[#fff8f0] border-[#e37224] text-[#e37224]'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {isSelected && <span className="mr-1">✓</span>}
                    {item}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-[10px] text-slate-400">
        Seçili donanım: <span className="text-slate-500 font-medium">{data.equipment.length} adet</span>
      </div>
    </div>
  )
}
