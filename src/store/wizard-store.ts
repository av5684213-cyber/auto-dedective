import { create } from 'zustand'

/* ─── Hasar Haritası Panel Durumları ─── */
export type PanelCondition = 'ORIJINAL' | 'LOKAL_BOYA' | 'BOYALI' | 'DEGISMIS'

export const PANEL_LABELS: Record<string, string> = {
  on_tampon: 'Ön Tampon',
  kaput: 'Kaput',
  sag_on_camurluk: 'Sağ Ön Çamurluk',
  sag_on_kapi: 'Sağ Ön Kapı',
  sag_arka_kapi: 'Sağ Arka Kapı',
  sag_arka_camurluk: 'Sağ Arka Çamurluk',
  arka_tampon: 'Arka Tampon',
  bagaj_kapagi: 'Bagaj Kapağı',
  tavan: 'Tavan',
  sol_on_camurluk: 'Sol Ön Çamurluk',
  sol_on_kapi: 'Sol Ön Kapı',
  sol_arka_kapi: 'Sol Arka Kapı',
  sol_arka_camurluk: 'Sol Arka Çamurluk',
}

export const PANEL_CONDITION_COLORS: Record<PanelCondition, string> = {
  ORIJINAL: '#22c55e',
  LOKAL_BOYA: '#eab308',
  BOYALI: '#e37224',
  DEGISMIS: '#ef4444',
}

export const PANEL_CONDITION_LABELS: Record<PanelCondition, string> = {
  ORIJINAL: 'Orijinal',
  LOKAL_BOYA: 'Lokal Boya',
  BOYALI: 'Boyali',
  DEGISMIS: 'Değişmiş',
}

/* ─── Donanım Grupları ─── */
export const EQUIPMENT_GROUPS = {
  GUVENLIK: {
    label: 'Güvenlik',
    items: ['ABS', 'ESP', 'Hava Yastığı (Sürücü)', 'Hava Yastığı (Yolcu)', 'Yan Hava Yastığı', 'Perde Hava Yastığı', 'Diz Hava Yastığı', 'Şerit Takip', 'Ölü Nokta Uyarı', 'Çarpışma Önleme', 'Yokuş Kalkış Desteği', 'Geri Görüş Kamerası', 'Park Sensörü (Ön)', 'Park Sensörü (Arka)', 'Adaptif Cruise', 'Lastik Basınç Sensörü', 'ISOFIX', 'Immobilizer'],
  },
  IC: {
    label: 'İç Donanım',
    items: ['Deri Koltuk', 'Kumaş Koltuk', 'Klima (Manuel)', 'Otomatik Klima', 'Çift Bölgeli Klima', 'Hız Sabitleyici', 'Deri Direksiyon', 'Çok Fonksiyonlu Direksiyon', 'Isıtmalı Koltuk', 'Elektrikli Koltuk', 'Hafızalı Koltuk', 'Güneşlik (Arka)', 'Deri Vites Topuzu', 'Ahşap Detay', 'Alüminyum Detay', 'Dijital Gösterge Paneli', 'Kablosuz Şarj', 'Start/Stop'],
  },
  DIS: {
    label: 'Dış Donanım',
    items: ['Sis Farı', 'LED Far', 'Xenon Far', 'Adaptif Far', 'Gündüz Farı', 'Alaşım Jant', 'Spor Jant', 'Sunroof', 'Panoramik Cam Tavan', 'Elektrikli Ayna', 'Isıtmalı Ayna', 'Katlanır Ayna', 'Far Yıkama', 'Spor Egzoz', 'Çatı Rafağı', 'Spor Paket', 'Bagaj Kapalı'],
  },
  MULTIMEDYA: {
    label: 'Multimedya',
    items: ['Bluetooth', 'USB', 'AUX', 'Navigasyon', 'Dokunmatik Ekran', 'Apple CarPlay', 'Android Auto', 'Ses Sistemi (Premium)', 'Radyo', 'CD Çalar', 'Arka Eğlence Paketi', 'Head-Up Display', 'Sesli Komut', 'Uzaktan Kontrol'],
  },
}

/* ─── Wizard Store ─── */
export interface WizardData {
  // Adım 1
  brand: string
  series: string
  model: string
  year: number | null
  variant: string
  // Adım 2
  fuel: string
  transmission: string
  bodyType: string
  enginePower: number | null
  engineCc: number | null
  drivetrain: string
  color: string
  km: number | null
  condition: string
  sellerType: string
  warranty: boolean
  heavyDamageRecord: boolean
  plateOrigin: string
  exchange: boolean
  // Adım 3
  equipment: string[]
  // Adım 4
  damageMap: Record<string, PanelCondition>
  // Adım 5
  photos: string[]
  coverPhotoIndex: number
  // Adım 6
  title: string
  description: string
  price: number | null
  negotiable: boolean
  // Adım 7
  contactName: string
  contactPhone: string
  city: string
  district: string
  // Meta
  listingId: string | null
}

const defaultData: WizardData = {
  brand: '', series: '', model: '', year: null, variant: '',
  fuel: '', transmission: '', bodyType: '', enginePower: null, engineCc: null,
  drivetrain: '', color: '', km: null, condition: '', sellerType: '',
  warranty: false, heavyDamageRecord: false, plateOrigin: '', exchange: false,
  equipment: [],
  damageMap: {},
  photos: [], coverPhotoIndex: 0,
  title: '', description: '', price: null, negotiable: false,
  contactName: '', contactPhone: '', city: '', district: '',
  listingId: null,
}

interface WizardStore {
  currentStep: number
  data: WizardData
  isSaving: boolean
  lastSavedAt: Date | null
  setStep: (step: number) => void
  updateData: (partial: Partial<WizardData>) => void
  reset: () => void
  setSaving: (v: boolean) => void
  setLastSaved: (d: Date) => void
  setListingId: (id: string) => void
  loadDraft: (data: Partial<WizardData>, listingId: string) => void
}

export const useListingWizard = create<WizardStore>((set) => ({
  currentStep: 1,
  data: { ...defaultData },
  isSaving: false,
  lastSavedAt: null,

  setStep: (step) => set({ currentStep: step }),
  updateData: (partial) => set((s) => ({ data: { ...s.data, ...partial } })),
  reset: () => set({ currentStep: 1, data: { ...defaultData }, isSaving: false, lastSavedAt: null }),
  setSaving: (v) => set({ isSaving: v }),
  setLastSaved: (d) => set({ lastSavedAt: d }),
  setListingId: (id) => set((s) => ({ data: { ...s.data, listingId: id } })),
  loadDraft: (data, listingId) => set({ data: { ...defaultData, ...data, listingId }, currentStep: 1 }),
}))

/* ─── Adım Doğrulama ─── */
export function validateStep(step: number, data: WizardData): boolean {
  switch (step) {
    case 1: return !!(data.brand && data.series && data.model && data.year)
    case 2: return !!(data.fuel && data.transmission && data.bodyType && data.km !== null && data.condition && data.sellerType)
    case 3: return true // donanım opsiyonel
    case 4: return true // hasar haritası opsiyonel
    case 5: return data.photos.length >= 1
    case 6: return !!(data.title && data.price !== null)
    case 7: return !!(data.contactName && data.contactPhone && data.city)
    case 8: return true // önizleme
    default: return false
  }
}
