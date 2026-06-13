'use client'

import { useListingWizard } from '@/store/wizard-store'

const CITIES = [
  'Adana','Adıyaman','Afyon','Ağrı','Aksaray','Amasya','Ankara','Antalya','Ardahan','Artvin',
  'Aydın','Balıkesir','Bartın','Batman','Bayburt','Bilecik','Bingöl','Bitlis','Bolu','Burdur',
  'Bursa','Çanakkale','Çankırı','Çorum','Denizli','Diyarbakır','Düzce','Edirne','Elazığ','Erzincan',
  'Erzurum','Eskişehir','Gaziantep','Giresun','Gümüşhane','Hakkari','Hatay','Iğdır','Isparta',
  'İstanbul','İzmir','Kahramanmaraş','Karabük','Karaman','Kars','Kastamonu','Kayseri','Kilis',
  'Kırıkkale','Kırklareli','Kırşehir','Kocaeli','Konya','Kütahya','Malatya','Manisa','Mardin',
  'Mersin','Muğla','Muş','Nevşehir','Niğde','Ordu','Osmaniye','Rize','Sakarya','Samsun',
  'Şanlıurfa','Siirt','Sinop','Sivas','Şırnak','Tekirdağ','Tokat','Trabzon','Tunceli',
  'Uşak','Van','Yalova','Yozgat','Zonguldak',
]

export function StepContact() {
  const { data, updateData } = useListingWizard()

  const inputClass = 'w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#e37224]'
  const labelClass = 'text-xs text-slate-500 mb-1.5 block font-medium'

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 4) return digits
    if (digits.length <= 7) return `${digits.slice(0,4)} ${digits.slice(4)}`
    return `${digits.slice(0,4)} ${digits.slice(4,7)} ${digits.slice(7)}`
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-[#0f2a48] mb-1">İletişim & Konum</h2>
      <p className="text-xs text-slate-400 mb-5">İlanınızda görünecek iletişim bilgilerinizi girin.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Ad Soyad *</label>
          <input
            type="text"
            value={data.contactName}
            onChange={e => updateData({ contactName: e.target.value })}
            placeholder="Adınız Soyadınız"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Telefon *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">0</span>
            <input
              type="text"
              value={data.contactPhone}
              onChange={e => updateData({ contactPhone: formatPhone(e.target.value) })}
              placeholder="5XX XXX XX XX"
              className={`${inputClass} pl-7`}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>İl *</label>
          <select value={data.city} onChange={e => updateData({ city: e.target.value, district: '' })} className={`${inputClass} appearance-none cursor-pointer`}>
            <option value="">İl seçin</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>İlçe</label>
          <input
            type="text"
            value={data.district}
            onChange={e => updateData({ district: e.target.value })}
            placeholder="İlçe adı"
            className={inputClass}
          />
        </div>
      </div>
    </div>
  )
}
