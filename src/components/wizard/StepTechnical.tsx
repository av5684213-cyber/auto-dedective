'use client'

import { useListingWizard } from '@/store/wizard-store'

const FUEL_TYPES = ['Benzin', 'Dizel', 'LPG', 'Hibrit', 'Elektrik', 'Benzin + LPG']
const TRANS_TYPES = ['Manuel', 'Otomatik', 'Yarı Otomatik', 'CVT', 'DSG', 'e-CVT']
const BODY_TYPES = ['Sedan', 'Hatchback', 'SUV', 'Station Wagon', 'Cabrio', 'Coupe', 'MPV', 'Crossover', 'Pickup']
const DRIVE_TYPES = ['Önden Çekiş', 'Arkadan İtiş', '4WD', 'AWD']
const COLORS = ['Beyaz', 'Siyah', 'Gri', 'Kırmızı', 'Mavi', 'Lacivert', 'Yeşil', 'Bordo', 'Turuncu', 'Bej', 'Gümüş', 'Kahverengi', 'Mor', 'Sarı', 'Bakır', 'Altın', 'Füme', 'Açık Gri', 'Koyu Gri']
const CONDITIONS = ['Sıfır', 'İkinci El']
const SELLER_TYPES = ['Sahibinden', 'Galeriden']
const PLATE_ORIGINS = ['01 Adana', '06 Ankara', '07 Antalya', '16 Bursa', '34 İstanbul', '35 İzmir', '21 Diyarbakır', '25 Erzurum', '26 Eskişehir', '27 Gaziantep', '31 Hatay', '41 Kocaeli', '42 Konya', '44 Malatya', '33 Mersin', '48 Muğla', '54 Sakarya', '55 Samsun', '59 Tekirdağ', '61 Trabzon', '63 Şanlıurfa', 'Diğer İl', 'Yabancı Uyruk (MA/ZZ)']

export function StepTechnical() {
  const { data, updateData } = useListingWizard()

  const selectClass = 'w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#e37224] appearance-none cursor-pointer'
  const inputClass = 'w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#e37224]'
  const labelClass = 'text-xs text-slate-500 mb-1.5 block font-medium'
  const switchRow = 'flex items-center justify-between py-2.5 px-3 bg-white rounded-xl border border-slate-200'

  return (
    <div>
      <h2 className="text-lg font-bold text-[#0f2a48] mb-1">Teknik & Durum</h2>
      <p className="text-xs text-slate-400 mb-5">Aracınızın teknik özelliklerini ve durum bilgilerini girin.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label className={labelClass}>Yakıt Tipi *</label>
          <select value={data.fuel} onChange={e => updateData({ fuel: e.target.value })} className={selectClass}>
            <option value="">Seçin</option>
            {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Vites *</label>
          <select value={data.transmission} onChange={e => updateData({ transmission: e.target.value })} className={selectClass}>
            <option value="">Seçin</option>
            {TRANS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Kasa Tipi *</label>
          <select value={data.bodyType} onChange={e => updateData({ bodyType: e.target.value })} className={selectClass}>
            <option value="">Seçin</option>
            {BODY_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Motor Gücü (HP)</label>
          <input type="number" value={data.enginePower || ''} onChange={e => updateData({ enginePower: Number(e.target.value) || null })} placeholder="ör: 150" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Motor Hacmi (cc)</label>
          <input type="number" value={data.engineCc || ''} onChange={e => updateData({ engineCc: Number(e.target.value) || null })} placeholder="ör: 1600" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Çekiş</label>
          <select value={data.drivetrain} onChange={e => updateData({ drivetrain: e.target.value })} className={selectClass}>
            <option value="">Seçin</option>
            {DRIVE_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Renk</label>
          <select value={data.color} onChange={e => updateData({ color: e.target.value })} className={selectClass}>
            <option value="">Seçin</option>
            {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Kilometre *</label>
          <input type="number" value={data.km || ''} onChange={e => updateData({ km: Number(e.target.value) || null })} placeholder="ör: 45000" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Durum *</label>
          <select value={data.condition} onChange={e => updateData({ condition: e.target.value })} className={selectClass}>
            <option value="">Seçin</option>
            {CONDITIONS.map(c => <option key={c} value={c === 'Sıfır' ? 'SIFIR' : 'IKINCI_EL'}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Kimden *</label>
          <select value={data.sellerType} onChange={e => updateData({ sellerType: e.target.value })} className={selectClass}>
            <option value="">Seçin</option>
            {SELLER_TYPES.map(s => <option key={s} value={s === 'Sahibinden' ? 'SAHIBI' : 'GALERI'}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Plaka Uyruk</label>
          <select value={data.plateOrigin} onChange={e => updateData({ plateOrigin: e.target.value })} className={selectClass}>
            <option value="">Seçin</option>
            {PLATE_ORIGINS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* Switches */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className={switchRow}>
          <span className="text-xs text-slate-600">Garanti</span>
          <button onClick={() => updateData({ warranty: !data.warranty })} className={`w-10 h-5 rounded-full transition-all ${data.warranty ? 'bg-[#e37224]' : 'bg-slate-300'}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${data.warranty ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
          </button>
        </div>
        <div className={switchRow}>
          <span className="text-xs text-slate-600">Ağır Hasar Kaydı</span>
          <button onClick={() => updateData({ heavyDamageRecord: !data.heavyDamageRecord })} className={`w-10 h-5 rounded-full transition-all ${data.heavyDamageRecord ? 'bg-red-500' : 'bg-slate-300'}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${data.heavyDamageRecord ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
          </button>
        </div>
        <div className={switchRow}>
          <span className="text-xs text-slate-600">Takas</span>
          <button onClick={() => updateData({ exchange: !data.exchange })} className={`w-10 h-5 rounded-full transition-all ${data.exchange ? 'bg-[#e37224]' : 'bg-slate-300'}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${data.exchange ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>
    </div>
  )
}
