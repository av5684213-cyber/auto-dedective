'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Radar, Search, Shield, TrendingDown, Bot, Star, Bell, Car,
  ChevronRight, Zap, Eye, CheckCircle2, AlertTriangle, ArrowDown,
  MessageSquare, Wrench, Calculator, Crown, Target, Sparkles,
  MapPin, Smartphone, BarChart3, Lock, Users, Globe, Play,
  X, SlidersHorizontal, RotateCcw, Loader2, Heart,
  Filter, ChevronUp, ChevronDown, ToggleLeft, ToggleRight, Send,
  ExternalLink, BadgeCheck, Clock, Flame, Tag, CarFront, Gauge,
  Fuel, Palette, Settings2, MapPinned, UserCircle, FileCheck,
  ShieldCheck, WrenchIcon, ImagePlus, CalendarDays, CircleDot,
  Phone, Mail, Building2, Copy, Check,
  BellRing, AlarmClock, Activity, Trash2, EyeOff,
  GitCompare, MessageCircle, AlertOctagon, Info, DollarSign,
  Siren, Sparkle, ThumbsUp, ArrowUpDown
} from 'lucide-react'
import DedektifPuani from '@/components/DedektifPuani'

/* ─── DATA ─── */
const BRANDS: Record<string, string[]> = {
  'Renault': ['Clio', 'Megane', 'Captur', 'Kadjar', 'Taliant', 'Koleos', 'Fluence', 'Symbol'],
  'Fiat': ['Egea', '500', 'Panda', 'Tipo', 'Ducato', '500X', 'Punto', 'Linea'],
  'Volkswagen': ['Golf', 'Passat', 'Tiguan', 'Polo', 'T-Roc', 'Touareg', 'Jetta', 'Caddy'],
  'Toyota': ['Corolla', 'Camry', 'RAV4', 'C-HR', 'Yaris', 'Hilux', 'Land Cruiser', 'Prius'],
  'Hyundai': ['Tucson', 'i20', 'i30', 'Kona', 'Bayon', 'Santa Fe', 'Accent', 'Elantra'],
  'BMW': ['3 Serisi', '5 Serisi', 'X1', 'X3', 'X5', '1 Serisi', '4 Serisi', 'X6'],
  'Mercedes': ['C Serisi', 'E Serisi', 'GLC', 'A Serisi', 'CLA', 'GLA', 'GLE', 'S Serisi'],
  'Citroen': ['C4', 'C3', 'C5 Aircross', 'C-Elysee', 'Berlingo', 'C4 Cactus', 'Jumpy'],
  'Peugeot': ['3008', '2008', '308', '508', '208', 'Rifter', 'Partner', '5008'],
  'Honda': ['Civic', 'CR-V', 'HR-V', 'City', 'Jazz', 'Accord'],
  'Ford': ['Focus', 'Kuga', 'Puma', 'Ranger', 'EcoSport', 'Fiesta', 'Mondeo', 'Transit'],
  'Kia': ['Sportage', 'Ceed', 'Stonic', 'Seltos', 'Sorento', 'Picanto', 'Rio', 'EV6'],
  'Skoda': ['Octavia', 'Superb', 'Kodiaq', 'Kamiq', 'Scala', 'Fabia', 'Karoq', 'Enyaq'],
  'Volvo': ['XC40', 'XC60', 'XC90', 'S60', 'V60', 'V90', 'S90', 'C40'],
  'Audi': ['A3', 'A4', 'A6', 'Q5', 'Q3', 'Q7', 'A5', 'Q2'],
  'Dacia': ['Duster', 'Sandero', 'Logan', 'Spring', 'Jogger', 'Lodgy'],
  'Seat': ['Leon', 'Ateca', 'Ibiza', 'Arona', 'Tarraco', 'Toledo'],
  'Opel': ['Astra', 'Corsa', 'Mokka', 'Crossland', 'Grandland', 'Insignia', 'Zafira'],
  'Nissan': ['Qashqai', 'Juke', 'X-Trail', 'Micra', 'Leaf', 'Navara'],
  'Mazda': ['CX-5', '3', 'CX-30', '6', 'MX-5', 'CX-60'],
  'Suzuki': ['Vitara', 'Swift', 'Jimny', 'S-Cross', 'Baleno'],
  'Subaru': ['Impreza', 'Forester', 'Outback', 'XV', 'WRX'],
  'Mini': ['Cooper', 'Countryman', 'Clubman', 'Paceman'],
  'Jeep': ['Compass', 'Renegade', 'Cherokee', 'Wrangler', 'Grand Cherokee'],
  'Land Rover': ['Range Rover', 'Discovery', 'Defender', 'Evoque'],
  'Porsche': ['Cayenne', 'Macan', '911', 'Boxster', 'Panamera'],
  'Tesla': ['Model 3', 'Model Y', 'Model S', 'Model X'],
  'Tofas': ['Sahin', 'Doguan', 'Kartal', 'Murat 131'],
  'Anadol': ['A1', 'A2', 'Bugalama', 'STC-16'],
}

const CITIES = [
  'Türkiye Geneli', 'Adana', 'Adıyaman', 'Afyon', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara',
  'Antalya', 'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt',
  'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı',
  'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum',
  'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır',
  'Isparta', 'İstanbul', 'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars',
  'Kastamonu', 'Kayseri', 'Kilis', 'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kocaeli',
  'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş',
  'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Şanlıurfa',
  'Siirt', 'Sinop', 'Sivas', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli',
  'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
]

const PLATE_CITIES = [
  '01 Adana', '06 Ankara', '07 Antalya', '16 Bursa', '34 İstanbul', '35 İzmir',
  '21 Diyarbakır', '25 Erzurum', '26 Eskişehir', '27 Gaziantep', '31 Hatay',
  '41 Kocaeli', '42 Konya', '44 Malatya', '33 Mersin', '48 Muğla', '54 Sakarya',
  '55 Samsun', '59 Tekirdağ', '61 Trabzon', '63 Şanlıurfa'
]

const COLORS = ['Beyaz', 'Siyah', 'Gri', 'Kırmızı', 'Mavi', 'Lacivert', 'Yeşil', 'Bordo', 'Turuncu', 'Bej', 'Gümüş', 'Kahverengi', 'Mor', 'Sarı', 'Bakır', 'Altın', 'Haki', 'Pembe', 'Açık Gri', 'Koyu Gri', 'Füme']

const MOCK_LISTINGS = [
  { id: 1, brand: 'Citroen', model: 'C4', year: 2022, km: 45000, fuel: 'Dizel', trans: 'Otomatik', price: 1020000, city: 'Ankara', color: 'Beyaz', body: 'Hatchback', hp: 130, engine: '1.5 BlueHDi', drive: 'Önden Çekiş', damage: 8500, damageDetail: 'Sol ön çamurluk boyalı, Arka tampon değişen', seller: 'Galeri', score: 88, accident: false },
  { id: 2, brand: 'Toyota', model: 'Corolla', year: 2021, km: 62000, fuel: 'Hibrit', trans: 'Otomatik', price: 980000, city: 'İstanbul', color: 'Gri', body: 'Sedan', hp: 140, engine: '1.8 Hybrid', drive: 'Önden Çekiş', damage: 0, damageDetail: 'Hasarsız', seller: 'Bireysel', score: 92, accident: false },
  { id: 3, brand: 'Volkswagen', model: 'Golf', year: 2023, km: 18000, fuel: 'Benzin', trans: 'Otomatik', price: 1150000, city: 'İzmir', color: 'Siyah', body: 'Hatchback', hp: 150, engine: '1.5 TSI', drive: 'Önden Çekiş', damage: 0, damageDetail: 'Hasarsız', seller: 'Galeri', score: 95, accident: false },
  { id: 4, brand: 'Hyundai', model: 'Tucson', year: 2022, km: 55000, fuel: 'Dizel', trans: 'Otomatik', price: 1050000, city: 'Bursa', color: 'Beyaz', body: 'SUV', hp: 136, engine: '1.6 CRDi', drive: '4WD', damage: 12000, damageDetail: 'Sağ arka kapı boyalı', seller: 'Galeri', score: 85, accident: false },
  { id: 5, brand: 'BMW', model: '3 Serisi', year: 2021, km: 72000, fuel: 'Dizel', trans: 'Otomatik', price: 1350000, city: 'İstanbul', color: 'Lacivert', body: 'Sedan', hp: 190, engine: '320d', drive: 'Arkadan İtiş', damage: 35000, damageDetail: 'Ön tampon değişen, sol kanat boyalı', seller: 'Galeri', score: 72, accident: true },
  { id: 6, brand: 'Renault', model: 'Megane', year: 2023, km: 15000, fuel: 'Benzin', trans: 'Otomatik', price: 780000, city: 'Ankara', color: 'Kırmızı', body: 'Hatchback', hp: 140, engine: '1.3 TCe', drive: 'Önden Çekiş', damage: 0, damageDetail: 'Hasarsız', seller: 'Bireysel', score: 90, accident: false },
  { id: 7, brand: 'Ford', model: 'Kuga', year: 2022, km: 48000, fuel: 'Dizel', trans: 'Otomatik', price: 950000, city: 'Kocaeli', color: 'Gri', body: 'SUV', hp: 150, engine: '2.0 TDCi', drive: 'AWD', damage: 5000, damageDetail: 'Arka çamurluk boyalı', seller: 'Galeri', score: 87, accident: false },
  { id: 8, brand: 'Mercedes', model: 'C Serisi', year: 2020, km: 95000, fuel: 'Dizel', trans: 'Otomatik', price: 1650000, city: 'İstanbul', color: 'Siyah', body: 'Sedan', hp: 200, engine: 'C200d', drive: 'Arkadan İtiş', damage: 45000, damageDetail: 'Ön tampon değişen, kaput boyalı, sağ ön kanat değişen', seller: 'Galeri', score: 65, accident: true },
  { id: 9, brand: 'Skoda', model: 'Octavia', year: 2022, km: 38000, fuel: 'Benzin', trans: 'Otomatik', price: 890000, city: 'Eskişehir', color: 'Gümüş', body: 'Sedan', hp: 150, engine: '1.5 TSI', drive: 'Önden Çekiş', damage: 0, damageDetail: 'Hasarsız', seller: 'Bireysel', score: 91, accident: false },
  { id: 10, brand: 'Peugeot', model: '3008', year: 2021, km: 68000, fuel: 'Dizel', trans: 'Otomatik', price: 920000, city: 'Antalya', color: 'Beyaz', body: 'SUV', hp: 130, engine: '1.5 BlueHDi', drive: 'Önden Çekiş', damage: 7000, damageDetail: 'Sol arka kapı boyalı', seller: 'Galeri', score: 84, accident: false },
  { id: 11, brand: 'Kia', model: 'Sportage', year: 2023, km: 22000, fuel: 'Benzin', trans: 'Otomatik', price: 1100000, city: 'Ankara', color: 'Mavi', body: 'SUV', hp: 150, engine: '1.6 T-GDi', drive: 'Önden Çekiş', damage: 0, damageDetail: 'Hasarsız', seller: 'Galeri', score: 93, accident: false },
  { id: 12, brand: 'Honda', model: 'Civic', year: 2022, km: 35000, fuel: 'Benzin', trans: 'Otomatik', price: 970000, city: 'İstanbul', color: 'Siyah', body: 'Sedan', hp: 182, engine: '1.5 VTEC Turbo', drive: 'Önden Çekiş', damage: 0, damageDetail: 'Hasarsız', seller: 'Bireysel', score: 94, accident: false },
  { id: 13, brand: 'Fiat', model: 'Egea', year: 2023, km: 12000, fuel: 'Dizel', trans: 'Otomatik', price: 620000, city: 'Konya', color: 'Beyaz', body: 'Sedan', hp: 95, engine: '1.3 MultiJet', drive: 'Önden Çekiş', damage: 0, damageDetail: 'Hasarsız', seller: 'Bireysel', score: 89, accident: false },
  { id: 14, brand: 'Audi', model: 'A4', year: 2021, km: 78000, fuel: 'Dizel', trans: 'Otomatik', price: 1480000, city: 'İzmir', color: 'Gri', body: 'Sedan', hp: 190, engine: '2.0 TDI', drive: 'Quattro', damage: 28000, damageDetail: 'Arka tampon değişen, bagaj altı boyalı', seller: 'Galeri', score: 70, accident: true },
  { id: 15, brand: 'Dacia', model: 'Duster', year: 2024, km: 5000, fuel: 'LPG', trans: 'Manuel', price: 680000, city: 'Sakarya', color: 'Turuncu', body: 'SUV', hp: 100, engine: '1.0 ECO-G', drive: 'Önden Çekiş', damage: 0, damageDetail: 'Hasarsız', seller: 'Bireysel', score: 86, accident: false },
  { id: 16, brand: 'Volvo', model: 'XC40', year: 2022, km: 42000, fuel: 'Benzin', trans: 'Otomatik', price: 1280000, city: 'İstanbul', color: 'Bordo', body: 'SUV', hp: 163, engine: 'B4 Mild Hybrid', drive: 'Önden Çekiş', damage: 3000, damageDetail: 'Arka çamurluk hafif boya', seller: 'Galeri', score: 88, accident: false },
  { id: 17, brand: 'Opel', model: 'Astra', year: 2023, km: 20000, fuel: 'Benzin', trans: 'Otomatik', price: 810000, city: 'Bursa', color: 'Beyaz', body: 'Hatchback', hp: 130, engine: '1.2 Turbo', drive: 'Önden Çekiş', damage: 0, damageDetail: 'Hasarsız', seller: 'Bireysel', score: 90, accident: false },
  { id: 18, brand: 'Seat', model: 'Leon', year: 2022, km: 53000, fuel: 'Dizel', trans: 'Otomatik', price: 830000, city: 'Muğla', color: 'Mavi', body: 'Hatchback', hp: 150, engine: '2.0 TDI', drive: 'Önden Çekiş', damage: 15000, damageDetail: 'Ön tampon boyalı, kaput boyalı', seller: 'Galeri', score: 74, accident: true },
  { id: 19, brand: 'Nissan', model: 'Qashqai', year: 2022, km: 58000, fuel: 'Benzin', trans: 'Otomatik', price: 940000, city: 'Mersin', color: 'Gri', body: 'SUV', hp: 158, engine: '1.3 DiG-T', drive: 'Önden Çekiş', damage: 8000, damageDetail: 'Sağ arka kapı boyalı', seller: 'Galeri', score: 83, accident: false },
  { id: 20, brand: 'Mazda', model: 'CX-5', year: 2021, km: 88000, fuel: 'Dizel', trans: 'Otomatik', price: 1050000, city: 'Ankara', color: 'Kırmızı', body: 'SUV', hp: 150, engine: '2.2 SkyActiv-D', drive: 'AWD', damage: 22000, damageDetail: 'Sağ taraf boyalı', seller: 'Bireysel', score: 68, accident: true },
]

/* ─── Types ─── */
interface Filters {
  brand: string; model: string; yearMin: number; yearMax: number;
  kmMin: number; kmMax: number; priceMin: number; priceMax: number;
  fuelTypes: string[]; transTypes: string[]; bodyTypes: string[];
  colors: string[]; cities: string[]; damageLimit: number;
  accident: string; tradeOk: string; authorizedService: string;
  hpMin: number; hpMax: number; engineMin: number; engineMax: number;
  driveTypes: string[]; sellerType: string; hasEkspertiz: string;
  minPhotoCount: number; guarantee: string; plateCity: string;
  colorGroup: string; trimming: string[]; safetyFeatures: string[];
  ageLimit: string; ownershipMax: string; citySearch: string;
}

/* ─── Sahiplik Maliyeti Hesaplayıcı Bileşeni ─── */
function OwnershipCalc() {
  const [year, setYear] = useState(2022)
  const [engineCc, setEngineCc] = useState(1400)
  const [fuelType, setFuelType] = useState('Benzin')
  const [avgFuel, setAvgFuel] = useState(7)
  const [yearlyKm, setYearlyKm] = useState(15000)
  const [price, setPrice] = useState(1000000)

  const currentYear = new Date().getFullYear()
  const age = currentYear - year

  // MTV hesaplama
  const engineBand = engineCc <= 1300 ? '0-1300' : engineCc <= 1600 ? '1301-1600' : engineCc <= 1800 ? '1601-1800' : engineCc <= 2000 ? '1801-2000' : engineCc <= 2500 ? '2001-2500' : '2501+'
  const ageBand = age <= 3 ? '1' : age <= 5 ? '2' : '3'
  const mtvTable: Record<string, number> = {
    '0-1300_1': 1313, '1301-1600_1': 2280, '1601-1800_1': 4560, '1801-2000_1': 7297, '2001-2500_1': 14595, '2501+_1': 25542,
    '0-1300_2': 985, '1301-1600_2': 1710, '1601-1800_2': 3420, '1801-2000_2': 5473, '2001-2500_2': 10946, '2501+_2': 19156,
    '0-1300_3': 656, '1301-1600_3': 1140, '1601-1800_3': 2280, '1801-2000_3': 3648, '2001-2500_3': 7297, '2501+_3': 12771,
  }
  const mtv = mtvTable[`${engineBand}_${ageBand}`] || 1500
  const kasko = Math.round(price * (age <= 2 ? 0.055 : age <= 5 ? 0.04 : 0.03))
  const fuelPrices: Record<string, number> = { 'Benzin': 42.5, 'Dizel': 40.0, 'LPG': 22.0, 'Hibrit': 42.5, 'Elektrik': 0 }
  const yearlyFuel = fuelType === 'Elektrik' ? Math.round(15 * 2.5 * yearlyKm / 100) : Math.round(avgFuel * (fuelPrices[fuelType] || 42.5) * yearlyKm / 100)
  const yearlyMaintenance = age <= 3 ? 5000 : age <= 7 ? 8000 : 12000
  const yearlyTotal = mtv + kasko + yearlyFuel + yearlyMaintenance
  const monthlyTotal = Math.round(yearlyTotal / 12)

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Model Yılı</label>
          <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} min={2000} max={2026} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#e37224]" />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Motor Hacmi (cc)</label>
          <input type="number" value={engineCc} onChange={e => setEngineCc(Number(e.target.value))} min={800} max={5000} step={100} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#e37224]" />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Yakıt Tipi</label>
          <select value={fuelType} onChange={e => setFuelType(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#e37224] appearance-none">
            {['Benzin', 'Dizel', 'LPG', 'Hibrit', 'Elektrik'].map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Ort. Yakıt (lt/100km)</label>
          <input type="number" value={avgFuel} onChange={e => setAvgFuel(Number(e.target.value))} min={1} max={25} step={0.5} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#e37224]" />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Yıllık KM</label>
          <input type="number" value={yearlyKm} onChange={e => setYearlyKm(Number(e.target.value))} min={1000} max={100000} step={1000} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#e37224]" />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Araç Fiyatı (TL)</label>
          <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} min={100000} max={50000000} step={50000} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#e37224]" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'MTV', amount: mtv },
          { label: 'Kasko (tahmini)', amount: kasko },
          { label: 'Yakıt', amount: yearlyFuel },
          { label: 'Bakım + Lastik', amount: yearlyMaintenance },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-lg border border-slate-200 p-2.5 text-center">
            <span className="text-[9px] text-slate-500 block">{item.label}</span>
            <span className="text-sm font-bold text-slate-800">{item.amount.toLocaleString('tr-TR')} TL</span>
          </div>
        ))}
      </div>
      <div className="mt-4 bg-gradient-to-r from-[#e37224]/10 to-[#c85e1a]/10 border border-[#f09040]/30 rounded-xl p-4 text-center">
        <span className="text-xs text-slate-500 block">Yıllık Toplam Maliyet</span>
        <span className="text-2xl font-extrabold text-[#c85e1a]">{yearlyTotal.toLocaleString('tr-TR')} TL</span>
        <span className="text-xs text-slate-500 block mt-1">Aylık: <span className="font-bold text-slate-700">{monthlyTotal.toLocaleString('tr-TR')} TL</span></span>
      </div>
    </div>
  )
}

const defaultFilters: Filters = {
  brand: '', model: '', yearMin: 2010, yearMax: 2026,
  kmMin: 0, kmMax: 500000, priceMin: 0, priceMax: 5000000,
  fuelTypes: [], transTypes: [], bodyTypes: [], colors: [], cities: [],
  damageLimit: 50000, accident: 'farketmez', tradeOk: 'farketmez',
  authorizedService: 'farketmez', hpMin: 0, hpMax: 500,
  engineMin: 0, engineMax: 5000, driveTypes: [], sellerType: 'farketmez',
  hasEkspertiz: 'farketmez', minPhotoCount: 0,
  guarantee: 'farketmez', plateCity: '', colorGroup: '',
  trimming: [], safetyFeatures: [], ageLimit: 'farketmez',
  ownershipMax: 'farketmez', citySearch: '',
}

const FUEL_TYPES = ['Benzin', 'Dizel', 'LPG', 'Hibrit', 'Elektrik', 'Benzin + LPG', 'Dizel + LPG']
const TRANS_TYPES = ['Manuel', 'Otomatik', 'Yarı Otomatik', 'CVT', 'DSG', 'e-CVT']
const BODY_TYPES = ['Sedan', 'Hatchback', 'SUV', 'Station Wagon', 'Cabrio', 'Pickup', 'MPV', 'Coupe', 'Van', 'Kamyonet', 'Minibüs', 'Crossover']
const DRIVE_TYPES = ['Önden Çekiş', 'Arkadan İtiş', '4WD', 'AWD', 'Quattro', 'xDrive', '4MATIC']
const TRIMMING = ['Full', 'Highline', 'Comfortline', 'Trendline', 'Elegance', 'Avantgarde', 'Sport', 'Style', 'Life', 'Adventure']
const SAFETY = ['ABS', 'ESP', 'Airbag', 'Yokuş Kalkış Desteği', 'Şerit Takip', 'Çarpışma Önleme', 'Geri Görüş Kamerası', 'Park Sensörü', 'Adaptif Cruise', 'Ölü Nokta Uyarı']

/* ─── Web Search Result Type ─── */
interface WebResult {
  id: string; title: string; price: string; url: string;
  source: string; snippet: string; date: string;
  hostName: string; favicon: string;
}

/* ─── Contact Info Type ─── */
interface ContactInfo {
  phone: string[];
  address: string;
  sellerName: string;
  sellerType: string;
  email: string;
  website: string;
  location: string;
  workingHours: string;
}

interface ContactState {
  loading: boolean;
  data: ContactInfo | null;
  hasContact: boolean;
  show: boolean;
}

/* ─── Helper ─── */
function formatPrice(n: number) { return n.toLocaleString('tr-TR') + ' TL' }
function formatKm(n: number) { return n.toLocaleString('tr-TR') + ' km' }

function getSourceColor(source: string) {
  if (source.includes('sahibinden')) return 'bg-blue-50 text-blue-600 border-blue-200'
  if (source.includes('arabam')) return 'bg-green-50 text-green-600 border-green-200'
  if (source.includes('letgo')) return 'bg-purple-50 text-purple-600 border-purple-200'
  return 'bg-slate-100 text-slate-600 border-slate-200'
}

/* ─── Sıralanabilir Başlık Bileşeni ─── */
const SORT_COLUMNS: { key: any; label: string; width: string }[] = [
  { key: 'model', label: 'Model', width: 'w-[110px] min-w-[90px]' },
  { key: 'title', label: 'İlan Başlığı', width: 'flex-1 min-w-[160px]' },
  { key: 'year', label: 'Yıl', width: 'w-[60px] min-w-[50px]' },
  { key: 'km', label: 'KM', width: 'w-[85px] min-w-[70px]' },
  { key: 'color', label: 'Renk', width: 'w-[75px] min-w-[60px]' },
  { key: 'price', label: 'Fiyat', width: 'w-[130px] min-w-[100px]' },
  { key: 'date', label: 'İlan Tarihi', width: 'w-[100px] min-w-[85px]' },
  { key: 'city', label: 'İl / İlçe', width: 'w-[110px] min-w-[90px]' },
]

function SortableHeader({ sortField, sortDir, onSort }: { sortField: any; sortDir: any; onSort: (f: any) => void }) {
  return (
    <div className="flex items-stretch bg-slate-50 border border-slate-200 rounded-t-xl text-[10px] font-bold text-slate-500 uppercase tracking-wider select-none">
      {SORT_COLUMNS.map(col => (
        <button
          key={col.key}
          onClick={() => onSort(col.key)}
          className={`${col.width} px-2.5 py-2.5 text-left flex items-center gap-1 hover:text-[#c85e1a] transition-colors border-r border-slate-100 last:border-r-0`}
        >
          <span className="truncate">{col.label}</span>
          {sortField === col.key ? (
            sortDir === 'asc' ? <ChevronUp size={10} className="text-[#e37224] shrink-0" /> : <ChevronDown size={10} className="text-[#e37224] shrink-0" />
          ) : (
            <ArrowUpDown size={9} className="text-slate-400 shrink-0 opacity-40" />
          )}
        </button>
      ))}
    </div>
  )
}

/* ─── Veri Çıkarma Yardımcıları ─── */
function extractYear(text: string): number {
  const m = text.match(/\b(19[9]\d|20[0-2]\d)\b/)
  return m ? parseInt(m[1]) : 0
}
function extractKm(text: string): number {
  const m = text.match(/([\d.,]+)\s*km/i)
  return m ? parseInt(m[1].replace(/\./g, '').replace(',', '')) : 0
}
function extractColor(text: string): string {
  const colors = ['Beyaz', 'Siyah', 'Gri', 'Kırmızı', 'Mavi', 'Lacivert', 'Yeşil', 'Bordo', 'Turuncu', 'Bej', 'Gümüş', 'Kahverengi', 'Mor', 'Sarı', 'Füme']
  for (const c of colors) { if (text.toLowerCase().includes(c.toLowerCase())) return c }
  return '-'
}
function extractCity(text: string): string {
  const cities = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep', 'Kocaeli', 'Mersin', 'Kayseri', 'Eskişehir', 'Sakarya', 'Muğla', 'Denizli', 'Malatya', 'Trabzon', 'Samsun', 'Diyarbakır', 'Tekirdağ']
  for (const c of cities) { if (text.includes(c)) return c }
  return '-'
}

/* ─── Section Wrapper ─── */
function Section({ children, className = '', id = '' }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.section id={id} ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className={className}>{children}</motion.section>
  )
}

/* ─── Multi Select Chip ─── */
function ChipSelect({ options, selected, onToggle, maxShow }: { options: string[]; selected: string[]; onToggle: (v: string) => void; maxShow?: number }) {
  const [showAll, setShowAll] = useState(false)
  const displayed = maxShow && !showAll ? options.slice(0, maxShow) : options
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {displayed.map(o => (
          <button key={o} onClick={() => onToggle(o)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-all ${selected.includes(o) ? 'bg-[#fff8f0] border-[#e37224] text-[#e37224]' : 'bg-slate-100 border-slate-200 text-slate-500 hover:border-slate-300'}`}>
            {o}
          </button>
        ))}
        {maxShow && options.length > maxShow && !showAll && (
          <button onClick={() => setShowAll(true)} className="text-[10px] px-2 py-1 text-[#e37224] hover:text-[#c85e1a]">+{options.length - maxShow} daha</button>
        )}
        {maxShow && showAll && (
          <button onClick={() => setShowAll(false)} className="text-[10px] px-2 py-1 text-[#e37224] hover:text-[#c85e1a]">Daralt</button>
        )}
      </div>
    </div>
  )
}

/* ─── Toggle Select ─── */
function TriToggle({ value, onChange, labels }: { value: string; onChange: (v: string) => void; labels: [string, string, string] }) {
  const opts: [string, string, string] = ['evet', 'hayir', 'farketmez']
  return (
    <div className="flex gap-1">
      {opts.map((o, i) => (
        <button key={o} onClick={() => onChange(o)}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${value === o ? 'bg-[#fff8f0] border-[#e37224] text-[#e37224]' : 'bg-slate-100 border-slate-200 text-slate-500 hover:border-slate-300'}`}>
          {labels[i]}
        </button>
      ))}
    </div>
  )
}

/* ─── Range Slider ─── */
function RangeRow({ label, min, max, minVal, maxVal, step, onChangeMin, onChangeMax, prefix = '', suffix = '', icon: Icon }: {
  label: string; min: number; max: number; minVal: number; maxVal: number; step: number;
  onChangeMin: (v: number) => void; onChangeMax: (v: number) => void; prefix?: string; suffix?: string;
  icon?: any
}) {
  return (
    <div>
      <label className="text-xs text-slate-500 mb-1.5 flex items-center gap-1">
        {Icon && <Icon size={10} className="text-slate-400" />}{label}
      </label>
      <div className="flex items-center gap-2">
        <input type="number" value={minVal} onChange={e => onChangeMin(Number(e.target.value))} min={min} max={max} step={step}
          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#e37224]" />
        <span className="text-slate-300 text-xs">—</span>
        <input type="number" value={maxVal} onChange={e => onChangeMax(Number(e.target.value))} min={min} max={max} step={step}
          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#e37224]" />
      </div>
      <div className="text-[10px] text-slate-400 mt-1 text-center">{prefix}{minVal.toLocaleString('tr-TR')}{suffix} — {prefix}{maxVal.toLocaleString('tr-TR')}{suffix}</div>
    </div>
  )
}

/* ════════════════════════════════════════════════ MAIN ════════════════════════════════════════════════ */
export default function Home() {
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<{ role: string; text: string }[]>([])
  const [filters, setFilters] = useState<Filters>({ ...defaultFilters })
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [results, setResults] = useState<typeof MOCK_LISTINGS>([])
  const [webResults, setWebResults] = useState<WebResult[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [notifications, setNotifications] = useState<{ id: number; icon: any; title: string; desc: string; color: string; time: string }[]>([])
  const [favIds, setFavIds] = useState<Set<number>>(new Set())
  const [favUrls, setFavUrls] = useState<Set<string>>(new Set())
  const [showNotifPanel, setShowNotifPanel] = useState(false)
  const [activeTab, setActiveTab] = useState<'mock' | 'web'>('web')
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    temel: true, detay: true, teknik: false, konum: false, satici: false, donanim: false, guvenlik: false, ekstra: false
  })
  const [scannedSources, setScannedSources] = useState<string[]>([])
  const [contactMap, setContactMap] = useState<Record<string, ContactState>>({})
  const [copiedPhone, setCopiedPhone] = useState<string>('')
  const notifIdRef = useRef(0)
  const [savedAlerts, setSavedAlerts] = useState<any[]>([])
  const [alertNotifs, setAlertNotifs] = useState<any[]>([])
  const [showAlertModal, setShowAlertModal] = useState(false)
  const [alertName, setAlertName] = useState('')
  const [scannerStatus, setScannerStatus] = useState<any>(null)
  const [notifTab, setNotifTab] = useState<'system' | 'alerts'>('system')

  // ─── YENİ ÖZELLİK STATE'LERİ ───
  const [nlQuery, setNlQuery] = useState('')
  const [isNlSearching, setIsNlSearching] = useState(false)
  const [selectedInsightUrl, setSelectedInsightUrl] = useState<string | null>(null)
  const [insightData, setInsightData] = useState<any>(null)
  const [isInsightLoading, setIsInsightLoading] = useState(false)
  const [showComparePanel, setShowComparePanel] = useState(false)
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set())
  const [showOwnershipCalc, setShowOwnershipCalc] = useState(false)

  // ─── SIRALAMA STATE ───
  type SortField = 'model' | 'title' | 'year' | 'km' | 'color' | 'price' | 'date' | 'city'
  type SortDir = 'asc' | 'desc' | null
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>(null)

  const toggleSort = useCallback((field: SortField) => {
    setSortField(prev => {
      if (prev === field) {
        setSortDir(d => d === 'asc' ? 'desc' : d === 'desc' ? null : 'asc')
        return field
      }
      setSortDir('asc')
      return field
    })
    if (sortField === field && sortDir === 'desc') {
      setSortField(null)
      setSortDir(null)
    }
  }, [sortField, sortDir])

  const updateFilter = useCallback(<K extends keyof Filters>(key: K, val: Filters[K]) => {
    setFilters(prev => ({ ...prev, [key]: val }))
  }, [])

  const toggleArrayFilter = useCallback((key: keyof Filters, val: string) => {
    setFilters(prev => {
      const arr = (prev[key] as string[]) || []
      return { ...prev, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] }
    })
  }, [])

  const addNotification = useCallback((icon: any, title: string, desc: string, color: string) => {
    notifIdRef.current += 1
    const n = { id: notifIdRef.current, icon, title, desc, color, time: 'Şimdi' }
    setNotifications(prev => [n, ...prev].slice(0, 20))
  }, [])

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedPhone(text)
      setTimeout(() => setCopiedPhone(''), 2000)
    })
  }, [])

  const fetchContact = useCallback(async (resultId: string, url: string) => {
    if (contactMap[resultId]?.loading) return

    setContactMap(prev => ({
      ...prev,
      [resultId]: { loading: true, data: null, hasContact: false, show: true }
    }))

    try {
      const response = await fetch('/api/listing-detail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await response.json()

      if (data.success && data.contact) {
        setContactMap(prev => ({
          ...prev,
          [resultId]: {
            loading: false,
            data: data.contact,
            hasContact: data.hasContact,
            show: true,
          }
        }))
        if (data.hasContact) {
          addNotification(Phone, 'İletişim Bilgisi Bulundu', `${data.contact.phone.length} telefon, ${data.contact.address ? 'adres' : ''} tespit edildi`, '#22c55e')
        }
      } else {
        setContactMap(prev => ({
          ...prev,
          [resultId]: { loading: false, data: null, hasContact: false, show: true }
        }))
      }
    } catch {
      setContactMap(prev => ({
        ...prev,
        [resultId]: { loading: false, data: null, hasContact: false, show: true }
      }))
    }
  }, [contactMap, addNotification])

  const doSearch = useCallback(async () => {
    setIsScanning(true)
    setScanProgress(0)
    setResults([])
    setWebResults([])
    setHasSearched(true)
    setScannedSources([])

    // Simulate progress while API is working
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 90) return prev
        return prev + Math.random() * 8 + 2
      })
    }, 200)

    // Notify scanning started
    addNotification(Search, 'Tarama Başladı', 'Türkiye genelindeki ilan siteleri taranıyor...', '#3b82f6')

    try {
      // Call our API to do real web search
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters }),
      })

      const data = await response.json()

      clearInterval(progressInterval)
      setScanProgress(100)

      if (data.success && data.results) {
        setWebResults(data.results)
        setScannedSources(data.scannedSites || [])

        // Also do local mock filtering
        const filtered = MOCK_LISTINGS.filter(v => {
          if (filters.brand && v.brand !== filters.brand) return false
          if (filters.model && v.model !== filters.model) return false
          if (v.year < filters.yearMin || v.year > filters.yearMax) return false
          if (v.km < filters.kmMin || v.km > filters.kmMax) return false
          if (v.price < filters.priceMin || v.price > filters.priceMax) return false
          if (filters.fuelTypes.length > 0 && !filters.fuelTypes.includes(v.fuel)) return false
          if (filters.transTypes.length > 0 && !filters.transTypes.includes(v.trans)) return false
          if (filters.bodyTypes.length > 0 && !filters.bodyTypes.includes(v.body)) return false
          if (filters.colors.length > 0 && !filters.colors.includes(v.color)) return false
          if (filters.cities.length > 0 && !filters.cities.includes(v.city) && !filters.cities.includes('Türkiye Geneli')) return false
          if (v.damage > filters.damageLimit) return false
          if (filters.accident === 'evet' && v.accident !== true) return false
          if (filters.accident === 'hayir' && v.accident !== false) return false
          if (filters.driveTypes.length > 0 && !filters.driveTypes.includes(v.drive)) return false
          if (filters.sellerType !== 'farketmez' && filters.sellerType === 'galeri' && v.seller !== 'Galeri') return false
          if (filters.sellerType !== 'farketmez' && filters.sellerType === 'bireysel' && v.seller !== 'Bireysel') return false
          return true
        })
        setResults(filtered)

        const totalFound = data.results.length + filtered.length
        if (data.results.length > 0) {
          addNotification(Globe, 'İnternet Taraması Tamamlandı', `${data.results.length} gerçek ilan bulundu`, '#22c55e')
        }
        if (filtered.length > 0) {
          addNotification(Car, 'Veritabanı Sonuçları', `${filtered.length} araç veritabanında bulundu`, '#3b82f6')
        }
        if (totalFound === 0) {
          addNotification(AlertTriangle, 'Sonuç Bulunamadı', 'Kriterlerinize uygun araç şu an yok', '#ef4444')
        }
      } else {
        // Fallback to mock only
        const filtered = MOCK_LISTINGS.filter(v => {
          if (filters.brand && v.brand !== filters.brand) return false
          if (filters.model && v.model !== filters.model) return false
          if (v.year < filters.yearMin || v.year > filters.yearMax) return false
          if (v.km < filters.kmMin || v.km > filters.kmMax) return false
          if (v.price < filters.priceMin || v.price > filters.priceMax) return false
          if (filters.fuelTypes.length > 0 && !filters.fuelTypes.includes(v.fuel)) return false
          if (filters.transTypes.length > 0 && !filters.transTypes.includes(v.trans)) return false
          if (filters.bodyTypes.length > 0 && !filters.bodyTypes.includes(v.body)) return false
          if (filters.colors.length > 0 && !filters.colors.includes(v.color)) return false
          if (filters.cities.length > 0 && !filters.cities.includes(v.city) && !filters.cities.includes('Türkiye Geneli')) return false
          if (v.damage > filters.damageLimit) return false
          if (filters.accident === 'evet' && v.accident !== true) return false
          if (filters.accident === 'hayir' && v.accident !== false) return false
          if (filters.driveTypes.length > 0 && !filters.driveTypes.includes(v.drive)) return false
          return true
        })
        setResults(filtered)
        addNotification(AlertTriangle, 'İnternet Taraması Kısmen Başarılı', 'Sadece veritabanı sonuçları gösteriliyor', '#eab308')
      }
    } catch (error) {
      clearInterval(progressInterval)
      // Fallback to mock
      const filtered = MOCK_LISTINGS.filter(v => {
        if (filters.brand && v.brand !== filters.brand) return false
        if (filters.model && v.model !== filters.model) return false
        if (v.year < filters.yearMin || v.year > filters.yearMax) return false
        if (v.km < filters.kmMin || v.km > filters.kmMax) return false
        if (v.price < filters.priceMin || v.price > filters.priceMax) return false
        if (filters.fuelTypes.length > 0 && !filters.fuelTypes.includes(v.fuel)) return false
        if (filters.transTypes.length > 0 && !filters.transTypes.includes(v.trans)) return false
        if (filters.bodyTypes.length > 0 && !filters.bodyTypes.includes(v.body)) return false
        if (filters.colors.length > 0 && !filters.colors.includes(v.color)) return false
        if (filters.cities.length > 0 && !filters.cities.includes(v.city) && !filters.cities.includes('Türkiye Geneli')) return false
        if (v.damage > filters.damageLimit) return false
        if (filters.accident === 'evet' && v.accident !== true) return false
        if (filters.accident === 'hayir' && v.accident !== false) return false
        return true
      })
      setResults(filtered)
      addNotification(AlertTriangle, 'Tarama Hatası', 'İnternet taraması başarısız, yerel sonuçlar gösteriliyor', '#ef4444')
    }

    setTimeout(() => setIsScanning(false), 300)
  }, [filters, addNotification])

  const resetFilters = () => { setFilters({ ...defaultFilters }) }

  // ─── DOĞAL DİL ARAMA ───
  const doNlSearch = useCallback(async () => {
    if (!nlQuery.trim() || isNlSearching) return
    setIsNlSearching(true)
    try {
      const res = await fetch('/api/nlsearch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: nlQuery.trim() }),
      })
      const data = await res.json()
      if (data.success && data.filters) {
        setFilters(prev => ({ ...prev, ...data.filters }))
        addNotification(Sparkles, 'AI Filtre Uygulandı', `"${nlQuery.trim()}" cümlesi filtrelere dönüştürüldü`, '#e37224')
        setNlQuery('')
      } else {
        addNotification(AlertTriangle, 'AI Arama Hatası', data.error || 'Filtre oluşturulamadı', '#ef4444')
      }
    } catch {
      addNotification(AlertTriangle, 'AI Arama Hatası', 'Bağlantı hatası', '#ef4444')
    }
    setIsNlSearching(false)
  }, [nlQuery, isNlSearching, addNotification])

  // ─── İLAN AI ANALİZİ ───
  const fetchInsight = useCallback(async (result: any) => {
    setSelectedInsightUrl(result.url)
    setIsInsightLoading(true)
    try {
      const res = await fetch('/api/listing-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: result.title,
          price: result.price,
          brand: result.brand || filters.brand,
          model: result.model || filters.model,
          year: filters.yearMin > 2010 ? filters.yearMin : undefined,
          city: filters.cities?.[0],
          description: result.snippet,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setInsightData(data)
      } else {
        setInsightData({ summary: ['AI analizi şu an mevcut değil'], questions: [], negotiation: { suggestion: '', maxPrice: 0, template: '' } })
      }
    } catch {
      setInsightData({ summary: ['API bağlantı hatası'], questions: [], negotiation: { suggestion: '', maxPrice: 0, template: '' } })
    }
    setIsInsightLoading(false)
  }, [filters])

  // ─── KARŞILAŞTIRMA ───
  const toggleCompare = useCallback((id: string) => {
    setCompareIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else if (next.size < 4) next.add(id)
      return next
    })
  }, [])

  /* ─── Alert / Notification API Functions ─── */
  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch('/api/alerts')
      const data = await res.json()
      if (data.success) setSavedAlerts(data.alerts || [])
    } catch { /* silent */ }
  }, [])

  const fetchAlertNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications')
      const data = await res.json()
      if (data.success) setAlertNotifs(data.notifications || [])
    } catch { /* silent */ }
  }, [])

  const fetchScannerStatus = useCallback(async () => {
    try {
      // Compute scanner status from alerts data instead of mini-service
      const activeCount = savedAlerts.filter((a: any) => a.isActive).length
      const unreadCount = alertNotifs.length
      setScannerStatus({
        status: activeCount > 0 ? 'running' : 'idle',
        activeAlerts: activeCount,
        unreadNotifications: unreadCount,
        intervalMinutes: 10,
        isScanning: false,
      })
    } catch { /* silent */ }
  }, [savedAlerts, alertNotifs])

  const saveAlert = useCallback(async () => {
    if (!alertName.trim()) return
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: alertName.trim(), filters, intervalMinutes: 10 }),
      })
      const data = await res.json()
      if (data.success) {
        setAlertName('')
        setShowAlertModal(false)
        addNotification(BellRing, 'Bildirim Oluşturuldu', `"${alertName.trim()}" filtresi arka planda takibe alındı`, '#e37224')
        fetchAlerts()
      }
    } catch { /* silent */ }
  }, [alertName, filters, addNotification, fetchAlerts])

  const deleteAlert = useCallback(async (id: string) => {
    try {
      await fetch(`/api/alerts?id=${id}`, { method: 'DELETE' })
      addNotification(Trash2, 'Bildirim Silindi', 'Filtre takibi kaldırıldı', '#ef4444')
      fetchAlerts()
      fetchAlertNotifications()
    } catch { /* silent */ }
  }, [addNotification, fetchAlerts, fetchAlertNotifications])

  const toggleAlert = useCallback(async (id: string) => {
    try {
      await fetch('/api/alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId: id, action: 'toggle' }),
      })
      fetchAlerts()
    } catch { /* silent */ }
  }, [fetchAlerts])

  const triggerScan = useCallback(async () => {
    try {
      addNotification(AlarmClock, 'Tarama Başlatıldı', 'Tüm aktif filtreler taranıyor...', '#3b82f6')
      const res = await fetch('/api/alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'scan-all' }),
      })
      const data = await res.json()
      if (data.success) {
        addNotification(CheckCircle2, 'Tarama Tamamlandı', `${data.totalNew} yeni ilan bulundu (${data.scannedAlerts} filtre tarandı)`, '#22c55e')
        fetchAlerts()
        fetchAlertNotifications()
      } else {
        addNotification(AlertTriangle, 'Tarama Hatası', data.error || 'Tarama başarısız', '#ef4444')
      }
    } catch {
      addNotification(AlertTriangle, 'Tarama Hatası', 'Bağlantı hatası', '#ef4444')
    }
  }, [addNotification, fetchAlerts, fetchAlertNotifications])

  const markNotifRead = useCallback(async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id }),
      })
      fetchAlertNotifications()
    } catch { /* silent */ }
  }, [fetchAlertNotifications])

  const markAllRead = useCallback(async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      })
      fetchAlertNotifications()
    } catch { /* silent */ }
  }, [fetchAlertNotifications])

  const sendChat = () => {
    if (!chatInput.trim()) return
    const userMsg = chatInput.trim()
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setChatInput('')
    setTimeout(() => {
      const isBudget = userMsg.includes("bütçe") || userMsg.includes("milyon")
      const aiText = isBudget
        ? "Harika soru! 1 milyon TL bütçeye göre size en uygun aile araçlarını analiz ediyorum: 2022 Skoda Octavia 1.5 TSI (950K-1.05M TL), 2021 Toyota Corolla Hybrid (920K-1.08M TL) ve 2022 Hyundai Tucson 1.6 CRDi (980K-1.1M TL) öneriyorum. Şehir içi kullanım için Corolla Hybrid en ekonomik, uzun yol için Tucson ideal."
        : "Araç tercihlerinize göre detaylı analiz hazırlıyorum. Size en uygun modelleri, kronik sorunları ve yıllık maliyet tahminlerini sunacağım."
      setChatMessages(prev => [...prev, { role: "ai", text: aiText }])
    }, 1200)
  }

  const toggleSection = (key: string) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }))

  /* ─── Alert polling + auto-scan useEffect ─── */
  useEffect(() => {
    let mounted = true
    const loadAll = async () => {
      if (!mounted) return
      try {
        const [alertsRes, notifsRes] = await Promise.all([
          fetch('/api/alerts'),
          fetch('/api/notifications'),
        ])
        if (!mounted) return
        const [alertsData, notifsData] = await Promise.all([
          alertsRes.json(),
          notifsRes.json(),
        ])
        if (!mounted) return
        if (alertsData.success) setSavedAlerts(alertsData.alerts || [])
        if (notifsData.success) setAlertNotifs(notifsData.notifications || [])
      } catch { /* silent */ }
    }
    loadAll()
    // Poll alerts & notifications every 30s
    const pollInterval = setInterval(loadAll, 30000)

    // Auto-scan all active alerts every 10 minutes (600000ms)
    const autoScan = async () => {
      if (!mounted) return
      try {
        await fetch('/api/alerts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'scan-all' }),
        })
        loadAll() // refresh notifications after scan
      } catch { /* silent */ }
    }
    // First auto-scan after 60 seconds, then every 10 minutes
    const initialScanTimeout = setTimeout(() => {
      autoScan()
      const scanInterval = setInterval(autoScan, 600000)
      // Store for cleanup
      return () => clearInterval(scanInterval)
    }, 60000)

    return () => {
      mounted = false
      clearInterval(pollInterval)
      clearTimeout(initialScanTimeout)
    }
  }, [])

  /* ─── Auto-suggest alert name ─── */
  const suggestedAlertName = filters.brand
    ? `${filters.brand}${filters.model ? ' ' + filters.model : ''} Takibi`
    : ''

  const activeFilterCount = [
    filters.brand, filters.fuelTypes.length, filters.transTypes.length, filters.bodyTypes.length,
    filters.colors.length, filters.cities.length, filters.driveTypes.length,
    filters.accident !== 'farketmez', filters.tradeOk !== 'farketmez', filters.authorizedService !== 'farketmez',
    filters.sellerType !== 'farketmez', filters.hasEkspertiz !== 'farketmez',
    filters.damageLimit < 50000, filters.minPhotoCount > 0,
    filters.guarantee !== 'farketmez', filters.plateCity,
    filters.trimming.length, filters.safetyFeatures.length,
    filters.ageLimit !== 'farketmez', filters.ownershipMax !== 'farketmez',
  ].filter(Boolean).length

  const totalResults = webResults.length + results.length

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* ═══ FLOATING NOTIFICATION BELL ═══ */}
      <div className="fixed top-16 right-4 z-40 flex items-center gap-2">
        {savedAlerts.filter(a => a.isActive).length > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-2 py-1 cursor-pointer" onClick={() => setShowNotifPanel(true)} title={scannerStatus?.isScanning ? 'Taranıyor...' : scannerStatus?.lastScanTime ? `Son tarama: ${new Date(scannerStatus.lastScanTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}` : 'Arka plan tarayıcısı aktif'}>
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-semibold text-green-600">{savedAlerts.filter(a => a.isActive).length}</span>
          </div>
        )}
        <button onClick={() => setShowNotifPanel(!showNotifPanel)} className="relative p-2 text-slate-500 hover:text-[#c85e1a] bg-white/80 backdrop-blur rounded-lg border border-slate-100 transition-colors">
          {alertNotifs.length > 0 ? <BellRing size={18} className="text-[#e37224]" /> : <Bell size={18} />}
          {(notifications.length > 0 || alertNotifs.length > 0) && <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#e37224] rounded-full animate-pulse" />}
          {alertNotifs.length > 0 && <span className="absolute -top-0.5 -right-0.5 bg-[#e37224] text-white text-[7px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">{alertNotifs.length > 9 ? '9+' : alertNotifs.length}</span>}
        </button>
      </div>

      {/* ═══ NOTIFICATION PANEL ═══ */}
      <AnimatePresence>
        {showNotifPanel && (
          <motion.div initial={{ opacity: 0, x: 300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 300 }}
            className="fixed top-14 right-0 w-80 max-h-[70vh] bg-white border-l border-slate-200 z-50 overflow-y-auto shadow-2xl">
            {/* Tabs */}
            <div className="p-3 border-b border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex bg-slate-100 rounded-lg border border-slate-200 p-0.5 w-full">
                  <button onClick={() => setNotifTab('system')}
                    className={`flex-1 text-[10px] px-2 py-1.5 rounded-md font-semibold transition-all flex items-center justify-center gap-1 ${notifTab === 'system' ? 'bg-[#e37224] text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                    <Bell size={10} /> Sistem {notifications.length > 0 && <span className="text-[8px] bg-white/20 px-1 rounded-full">{notifications.length}</span>}
                  </button>
                  <button onClick={() => setNotifTab('alerts')}
                    className={`flex-1 text-[10px] px-2 py-1.5 rounded-md font-semibold transition-all flex items-center justify-center gap-1 ${notifTab === 'alerts' ? 'bg-[#e37224] text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                    <BellRing size={10} /> Bildirim Uyarıları {alertNotifs.length > 0 && <span className="text-[8px] bg-white/20 px-1 rounded-full">{alertNotifs.length}</span>}
                  </button>
                </div>
              </div>
              {notifTab === 'alerts' && alertNotifs.length > 0 && (
                <button onClick={markAllRead} className="text-[9px] text-slate-500 hover:text-[#c85e1a] flex items-center gap-1">
                  <EyeOff size={9} /> Tümünü Okundu İşaretle
                </button>
              )}
            </div>
            {/* System notifications tab */}
            {notifTab === 'system' && (
              <div className="p-2 space-y-1.5">
                {notifications.length === 0 ? (
                  <p className="text-center text-xs text-slate-500 py-8">Henüz bildirim yok</p>
                ) : notifications.map(n => (
                  <div key={n.id} className="flex items-center gap-2.5 bg-white rounded-lg p-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: n.color + '20' }}><n.icon size={14} style={{ color: n.color }} /></div>
                    <div className="min-w-0 flex-1"><p className="text-xs font-semibold text-slate-800 truncate">{n.title}</p><p className="text-[10px] text-slate-500 truncate">{n.desc}</p></div>
                    <span className="text-[9px] text-slate-400 shrink-0">{n.time}</span>
                  </div>
                ))}
              </div>
            )}
            {/* Alert notifications tab */}
            {notifTab === 'alerts' && (
              <div className="p-2 space-y-1.5">
                {alertNotifs.length === 0 ? (
                  <div className="text-center py-8">
                    <BellRing size={24} className="text-slate-700 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Henüz bildirim uyarısı yok</p>
                    <p className="text-[9px] text-slate-400 mt-1">Filtrelerinizi kaydederek arka planda takip edin</p>
                  </div>
                ) : alertNotifs.map(n => (
                  <div key={n.id} className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 hover:border-[#f09040]/30 transition-colors">
                    <div className="flex items-start gap-2">
                      <div className="w-7 h-7 bg-[#fff8f0] rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <span className={`text-[7px] font-bold px-1 py-0.5 rounded ${getSourceColor(n.source)}`}>{n.source?.charAt(0)?.toUpperCase() || '?'}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`text-[8px] px-1.5 py-0.5 rounded-full border font-semibold ${getSourceColor(n.source || '')}`}>
                            {n.source}
                          </span>
                          {n.price && <span className="text-[9px] font-bold text-[#e37224]">{n.price}</span>}
                        </div>
                        <p className="text-[11px] font-semibold text-slate-800 line-clamp-2 leading-tight">{n.title}</p>
                        <p className="text-[9px] text-slate-500 line-clamp-2 mt-0.5">{n.snippet}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          {n.alert?.name && <span className="text-[8px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{n.alert.name}</span>}
                          <span className="text-[8px] text-slate-400">{new Date(n.foundAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                          <a href={n.url} target="_blank" rel="noopener noreferrer" className="text-[8px] text-[#e37224] hover:text-[#c85e1a] ml-auto">İlana Git →</a>
                        </div>
                      </div>
                      <button onClick={() => markNotifRead(n.id)} className="p-1 text-slate-400 hover:text-green-600 transition-colors shrink-0" title="Okundu">
                        <Check size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ HERO ═══ */}
      <section className="relative pt-20 pb-8 sm:pt-28 sm:pb-12 px-4 overflow-hidden bg-white">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none">
          <div className="absolute inset-0 rounded-full bg-[#e37224]/5 blur-3xl" />
          <div className="absolute inset-16 rounded-full border border-[#e37224]/10" />
          <div className="absolute inset-[120px] rounded-full bg-[#e37224]/3 animate-radar-ping" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex justify-center mb-6">
              <Image
                src="/logo-v2.png"
                alt="OtoDedektif"
                width={380}
                height={213}
                className="h-24 sm:h-28 w-auto drop-shadow-lg"
                priority
              />
            </div>
            <div className="inline-flex items-center gap-2 bg-[#fff8f0] border border-[#e37224]/20 rounded-full px-3 py-1 mb-4">
              <Sparkles size={12} className="text-[#e37224]" /><span className="text-[10px] font-medium text-[#c85e1a]">Yapay Zeka Destekli</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4 text-[#0f2a48]">
              İlanları siz aramayın,<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f09040] to-[#e37224]">size gelsin.</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto mb-6">Türkiye&apos;nin her yerinden araç ilanlarını 7/24 tarayan, filtreleyen ve size bildiren akıllı asistanınız.</p>
            <a href="#avmodu" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#e37224] to-[#c85e1a] hover:from-[#c85e1a] hover:to-[#a84f14] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-[#e37224]/25">
              <Target size={18} /> Araç Av Moduna Geç
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ ARAÇ AV MODU ═══════════════ */}
      <Section id="avmodu" className="py-8 sm:py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#fff8f0] rounded-xl flex items-center justify-center"><Target size={22} className="text-[#e37224]" /></div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f2a48]">Araç Av Modu</h2>
              <p className="text-xs text-slate-500">Aklınıza gelen her kriteri seçin, sistem tüm Türkiye&apos;yi tarasın</p>
            </div>
          </div>

          {/* ─── NL ARAMA ÇUBUĞU ─── */}
          <div className="mb-5">
            <div className="bg-white border border-slate-200 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#e37224] shrink-0" />
                <input
                  type="text"
                  value={nlQuery}
                  onChange={e => setNlQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && doNlSearch()}
                  placeholder={'Doğal dilde arayın... ör: "İstanbul\'da 400 bin altı otomatik dizel SUV"'}
                  className="flex-1 bg-transparent border-none text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
                <button
                  onClick={doNlSearch}
                  disabled={isNlSearching || !nlQuery.trim()}
                  className="bg-gradient-to-r from-[#e37224] to-[#c85e1a] hover:from-[#c85e1a] hover:to-[#a84f14] text-white font-bold px-4 py-1.5 rounded-lg text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  {isNlSearching ? <Loader2 size={12} className="animate-spin" /> : <Sparkle size={12} />}
                  AI ile Ara
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* ─── FILTER PANEL ─── */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-3">
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={14} className="text-[#e37224]" />
                    <span className="text-sm font-semibold text-slate-900">Filtreler</span>
                    {activeFilterCount > 0 && <span className="bg-[#fff8f0] text-[#c85e1a] text-[10px] font-bold px-1.5 py-0.5 rounded-full">{activeFilterCount} aktif</span>}
                  </div>
                  <button onClick={resetFilters} className="text-[10px] text-slate-500 hover:text-[#c85e1a] flex items-center gap-1"><RotateCcw size={10} /> Sıfırla</button>
                </div>

                <div className="p-3 space-y-3 max-h-[70vh] overflow-y-auto">
                  {/* TEMEL BİLGİLER */}
                  <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                    <button onClick={() => toggleSection('temel')} className="w-full flex items-center justify-between p-3 text-xs font-semibold text-slate-700 hover:text-[#c85e1a] transition-colors">
                      <span className="flex items-center gap-1.5"><CarFront size={12} className="text-[#e37224]" /> Temel Bilgiler</span>{expandedSections.temel ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <AnimatePresence>
                      {expandedSections.temel && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="px-3 pb-3 space-y-3">
                            <div>
                              <label className="text-xs text-slate-500 mb-1 block">Marka</label>
                              <select value={filters.brand} onChange={e => { updateFilter('brand', e.target.value); updateFilter('model', '') }}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#e37224] appearance-none">
                                <option value="">Tüm Markalar</option>
                                {Object.keys(BRANDS).sort().map(b => <option key={b} value={b}>{b}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-slate-500 mb-1 block">Model</label>
                              <select value={filters.model} onChange={e => updateFilter('model', e.target.value)} disabled={!filters.brand}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#e37224] appearance-none disabled:opacity-50">
                                <option value="">Tüm Modeller</option>
                                {filters.brand && BRANDS[filters.brand]?.map(m => <option key={m} value={m}>{m}</option>)}
                              </select>
                            </div>
                            <RangeRow label="Yıl Aralığı" icon={CalendarDays} min={2000} max={2026} minVal={filters.yearMin} maxVal={filters.yearMax} step={1} onChangeMin={v => updateFilter('yearMin', v)} onChangeMax={v => updateFilter('yearMax', v)} />
                            <RangeRow label="Fiyat Aralığı (TL)" icon={Tag} min={0} max={5000000} minVal={filters.priceMin} maxVal={filters.priceMax} step={50000} onChangeMin={v => updateFilter('priceMin', v)} onChangeMax={v => updateFilter('priceMax', v)} />
                            <RangeRow label="Kilometre" icon={Gauge} min={0} max={500000} minVal={filters.kmMin} maxVal={filters.kmMax} step={5000} onChangeMin={v => updateFilter('kmMin', v)} onChangeMax={v => updateFilter('kmMax', v)} suffix=" km" />
                            <div><label className="text-xs text-slate-500 mb-1.5 flex items-center gap-1"><Fuel size={10} className="text-slate-400" /> Yakıt Tipi</label><ChipSelect options={FUEL_TYPES} selected={filters.fuelTypes} onToggle={v => toggleArrayFilter('fuelTypes', v)} maxShow={4} /></div>
                            <div><label className="text-xs text-slate-500 mb-1.5 flex items-center gap-1"><Settings2 size={10} className="text-slate-400" /> Vites Tipi</label><ChipSelect options={TRANS_TYPES} selected={filters.transTypes} onToggle={v => toggleArrayFilter('transTypes', v)} maxShow={4} /></div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* DETAYLI KRİTERLER */}
                  <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                    <button onClick={() => toggleSection('detay')} className="w-full flex items-center justify-between p-3 text-xs font-semibold text-slate-700 hover:text-[#c85e1a] transition-colors">
                      <span className="flex items-center gap-1.5"><FileCheck size={12} className="text-[#e37224]" /> Detaylı Kriterler</span>{expandedSections.detay ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <AnimatePresence>
                      {expandedSections.detay && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="px-3 pb-3 space-y-3">
                            <div><label className="text-xs text-slate-500 mb-1.5 flex items-center gap-1"><CarFront size={10} className="text-slate-400" /> Kasa Tipi</label><ChipSelect options={BODY_TYPES} selected={filters.bodyTypes} onToggle={v => toggleArrayFilter('bodyTypes', v)} maxShow={5} /></div>
                            <div><label className="text-xs text-slate-500 mb-1.5 flex items-center gap-1"><Palette size={10} className="text-slate-400" /> Renk</label><ChipSelect options={COLORS} selected={filters.colors} onToggle={v => toggleArrayFilter('colors', v)} maxShow={6} /></div>
                            <RangeRow label="Maks. Hasar Tutarı (TL)" icon={AlertTriangle} min={0} max={200000} minVal={0} maxVal={filters.damageLimit} step={5000} onChangeMin={() => {}} onChangeMax={v => updateFilter('damageLimit', v)} />
                            <div><label className="text-xs text-slate-500 mb-1.5 flex items-center gap-1"><ShieldCheck size={10} className="text-slate-400" /> Hasar / Kaza Durumu</label>
                              <TriToggle value={filters.accident} onChange={v => updateFilter('accident', v)} labels={['Kazasız', 'Kazalı Olabilir', 'Farketmez']} />
                            </div>
                            <div><label className="text-xs text-slate-500 mb-1.5 block">Takas Durumu</label>
                              <TriToggle value={filters.tradeOk} onChange={v => updateFilter('tradeOk', v)} labels={['Kabul Eden', 'Kabul Etmeyen', 'Farketmez']} />
                            </div>
                            <div><label className="text-xs text-slate-500 mb-1.5 flex items-center gap-1"><WrenchIcon size={10} className="text-slate-400" /> Yetkili Servis Bakımlı</label>
                              <TriToggle value={filters.authorizedService} onChange={v => updateFilter('authorizedService', v)} labels={['Evet', 'Hayır', 'Farketmez']} />
                            </div>
                            <div><label className="text-xs text-slate-500 mb-1.5 flex items-center gap-1"><BadgeCheck size={10} className="text-slate-400" /> Ekspertiz Raporu</label>
                              <TriToggle value={filters.hasEkspertiz} onChange={v => updateFilter('hasEkspertiz', v)} labels={['Var', 'Yok', 'Farketmez']} />
                            </div>
                            <div><label className="text-xs text-slate-500 mb-1.5 flex items-center gap-1"><Shield size={10} className="text-slate-400" /> Garanti Durumu</label>
                              <TriToggle value={filters.guarantee} onChange={v => updateFilter('guarantee', v)} labels={['Garantili', 'Garantisiz', 'Farketmez']} />
                            </div>
                            <div>
                              <label className="text-xs text-slate-500 mb-1 flex items-center gap-1"><ImagePlus size={10} className="text-slate-400" /> Min. Fotoğraf Sayısı</label>
                              <input type="number" value={filters.minPhotoCount} onChange={e => updateFilter('minPhotoCount', Number(e.target.value))} min={0} max={50}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#e37224]" />
                            </div>
                            <div><label className="text-xs text-slate-500 mb-1.5 block">Araç Yaşı</label>
                              <TriToggle value={filters.ageLimit} onChange={v => updateFilter('ageLimit', v)} labels={['0-3 Yıl', '3-7 Yıl', 'Farketmez']} />
                            </div>
                            <div><label className="text-xs text-slate-500 mb-1.5 block">Max Sahip Sayısı</label>
                              <TriToggle value={filters.ownershipMax} onChange={v => updateFilter('ownershipMax', v)} labels={['1-2 Sahip', '3+ Sahip', 'Farketmez']} />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* TEKNİK BİLGİLER */}
                  <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                    <button onClick={() => toggleSection('teknik')} className="w-full flex items-center justify-between p-3 text-xs font-semibold text-slate-700 hover:text-[#c85e1a] transition-colors">
                      <span className="flex items-center gap-1.5"><Settings2 size={12} className="text-[#e37224]" /> Teknik Bilgiler</span>{expandedSections.teknik ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <AnimatePresence>
                      {expandedSections.teknik && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="px-3 pb-3 space-y-3">
                            <RangeRow label="Motor Gücü (HP)" icon={Gauge} min={0} max={500} minVal={filters.hpMin} maxVal={filters.hpMax} step={10} onChangeMin={v => updateFilter('hpMin', v)} onChangeMax={v => updateFilter('hpMax', v)} suffix=" HP" />
                            <RangeRow label="Motor Hacmi (cc)" min={0} max={5000} minVal={filters.engineMin} maxVal={filters.engineMax} step={100} onChangeMin={v => updateFilter('engineMin', v)} onChangeMax={v => updateFilter('engineMax', v)} suffix=" cc" />
                            <div><label className="text-xs text-slate-500 mb-1.5 block">Çekiş Sistemi</label><ChipSelect options={DRIVE_TYPES} selected={filters.driveTypes} onToggle={v => toggleArrayFilter('driveTypes', v)} maxShow={4} /></div>
                            <div><label className="text-xs text-slate-500 mb-1.5 block">Donatım Paketi</label><ChipSelect options={TRIMMING} selected={filters.trimming} onToggle={v => toggleArrayFilter('trimming', v)} maxShow={4} /></div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* KONUM & SATICI */}
                  <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                    <button onClick={() => toggleSection('konum')} className="w-full flex items-center justify-between p-3 text-xs font-semibold text-slate-700 hover:text-[#c85e1a] transition-colors">
                      <span className="flex items-center gap-1.5"><MapPinned size={12} className="text-[#e37224]" /> Konum & Satıcı</span>{expandedSections.konum ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <AnimatePresence>
                      {expandedSections.konum && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="px-3 pb-3 space-y-3">
                            <div><label className="text-xs text-slate-500 mb-1.5 block">İl</label><ChipSelect options={CITIES} selected={filters.cities} onToggle={v => toggleArrayFilter('cities', v)} maxShow={8} /></div>
                            <div>
                              <label className="text-xs text-slate-500 mb-1 flex items-center gap-1"><CircleDot size={10} className="text-slate-400" /> Plaka İli</label>
                              <select value={filters.plateCity} onChange={e => updateFilter('plateCity', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#e37224] appearance-none">
                                <option value="">Farketmez</option>
                                {PLATE_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>
                            <div><label className="text-xs text-slate-500 mb-1.5 flex items-center gap-1"><UserCircle size={10} className="text-slate-400" /> Satıcı Tipi</label>
                              <TriToggle value={filters.sellerType} onChange={v => updateFilter('sellerType', v)} labels={['Galeri', 'Bireysel', 'Farketmez']} />
                            </div>
                            <div>
                              <label className="text-xs text-slate-500 mb-1 block">Şehir Ara (Serbest Metin)</label>
                              <input type="text" value={filters.citySearch} onChange={e => updateFilter('citySearch', e.target.value)} placeholder="ör: Kadıköy, Beşiktaş..."
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#e37224]" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* GÜVENLİK & DONANIM */}
                  <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                    <button onClick={() => toggleSection('guvenlik')} className="w-full flex items-center justify-between p-3 text-xs font-semibold text-slate-700 hover:text-[#c85e1a] transition-colors">
                      <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-[#e37224]" /> Güvenlik & Donanım</span>{expandedSections.guvenlik ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <AnimatePresence>
                      {expandedSections.guvenlik && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="px-3 pb-3 space-y-3">
                            <div><label className="text-xs text-slate-500 mb-1.5 block">Güvenlik Özellikleri</label><ChipSelect options={SAFETY} selected={filters.safetyFeatures} onToggle={v => toggleArrayFilter('safetyFeatures', v)} maxShow={5} /></div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* ─── BİLDİRİM AYARLA (Alert Setup) ─── */}
                <div className="p-3 border-t border-slate-100">
                  <div className="bg-slate-50 rounded-xl border-2 border-[#f09040]/40 overflow-hidden">
                    {/* Header */}
                    <button onClick={() => setShowAlertModal(!showAlertModal)}
                      className="w-full flex items-center justify-between p-3 hover:bg-[#fff8f0] transition-colors">
                      <span className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-[#fff8f0] rounded-lg flex items-center justify-center">
                          <BellRing size={14} className="text-[#e37224]" />
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-bold text-[#c85e1a] block leading-tight">BİLDİRİM AYARLA</span>
                          <span className="text-[9px] text-slate-500">Filtrelerinizi arka planda takip edin</span>
                        </div>
                      </span>
                      <div className="flex items-center gap-2">
                        {savedAlerts.filter(a => a.isActive).length > 0 && (
                          <span className="flex items-center gap-1 text-[9px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            {savedAlerts.filter(a => a.isActive).length} aktif
                          </span>
                        )}
                        {showAlertModal ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                      </div>
                    </button>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {showAlertModal && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="px-3 pb-3 space-y-3">
                            {/* Alert name input */}
                            <div>
                              <label className="text-[10px] text-slate-500 mb-1 block flex items-center gap-1">
                                <AlarmClock size={9} className="text-[#e37224]" /> Bildirim Adı
                              </label>
                              <input type="text" value={alertName} onChange={e => setAlertName(e.target.value)}
                                placeholder={suggestedAlertName || 'ör: BMW 3 Serisi Takibi'}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#e37224]" />
                            </div>

                            {/* Scan interval info */}
                            <div className="flex items-center justify-between bg-white rounded-lg px-2.5 py-2 border border-slate-100">
                              <div className="flex items-center gap-1.5">
                                <Clock size={11} className="text-slate-400" />
                                <span className="text-[10px] text-slate-500">Tarama aralığı</span>
                              </div>
                              <span className="text-[10px] font-semibold text-[#c85e1a]">10 dk</span>
                            </div>

                            {/* Scanner status */}
                            {scannerStatus && (
                              <div className="flex items-center justify-between bg-white rounded-lg px-2.5 py-2 border border-slate-100">
                                <div className="flex items-center gap-1.5">
                                  <Activity size={11} className={scannerStatus.isScanning ? 'text-green-600 animate-pulse' : 'text-slate-400'} />
                                  <span className="text-[10px] text-slate-500">Tarayıcı durumu</span>
                                </div>
                                <span className={`text-[10px] font-semibold ${scannerStatus.isScanning ? 'text-green-600' : 'text-slate-400'}`}>
                                  {scannerStatus.isScanning ? 'Taranıyor...' : scannerStatus.lastScanTime ? 'Beklemede' : 'Hazır'}
                                </span>
                              </div>
                            )}

                            {/* Create alert button */}
                            <button onClick={saveAlert} disabled={!alertName.trim()}
                              className="w-full bg-gradient-to-r from-[#e37224] to-[#c85e1a] hover:from-[#c85e1a] hover:to-[#a84f14] text-white font-bold py-2 rounded-lg transition-all text-xs flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[#e37224]/15">
                              <Bell size={13} /> Bildirim Oluştur
                            </button>

                            {/* Manual scan trigger */}
                            <button onClick={triggerScan}
                              className="w-full bg-slate-100 hover:bg-slate-100 border border-slate-200 text-slate-600 font-semibold py-2 rounded-lg transition-all text-xs flex items-center justify-center gap-1.5">
                              <Radar size={13} className="text-[#e37224]" /> Şimdi Tara
                            </button>

                            {/* Saved alerts list */}
                            {savedAlerts.length > 0 && (
                              <div className="space-y-2 mt-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] text-slate-400 font-semibold">Kayıtlı Bildirimler</span>
                                  <span className="text-[9px] text-slate-400">{savedAlerts.length} filtre</span>
                                </div>
                                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                                  {savedAlerts.map(alert => {
                                    const unreadCount = alert.notifications?.length || 0
                                    return (
                                      <div key={alert.id} className="bg-slate-50 rounded-lg border border-slate-200 p-2.5">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2 min-w-0 flex-1">
                                            <span className={`w-2 h-2 rounded-full shrink-0 ${alert.isActive ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`} />
                                            <span className="text-[11px] font-semibold text-slate-800 truncate">{alert.name}</span>
                                            {unreadCount > 0 && (
                                              <span className="bg-[#e37224] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0">{unreadCount}</span>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-1 shrink-0 ml-1">
                                            <button onClick={() => toggleAlert(alert.id)} className="p-1 text-slate-400 hover:text-[#c85e1a] transition-colors" title={alert.isActive ? 'Durdur' : 'Başlat'}>
                                              {alert.isActive ? <ToggleRight size={14} className="text-green-600" /> : <ToggleLeft size={14} />}
                                            </button>
                                            <button onClick={() => deleteAlert(alert.id)} className="p-1 text-slate-400 hover:text-red-600 transition-colors" title="Sil">
                                              <Trash2 size={12} />
                                            </button>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1.5 text-[9px] text-slate-400">
                                          {alert.lastScannedAt && (
                                            <span className="flex items-center gap-0.5">
                                              <Clock size={8} /> {new Date(alert.lastScannedAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                          )}
                                          <span className="flex items-center gap-0.5">
                                            <Radar size={8} /> {alert.lastResultCount || 0} sonuç
                                          </span>
                                          <span className="flex items-center gap-0.5">
                                            <Activity size={8} /> {alert.totalScans || 0} tarama
                                          </span>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* SEARCH BUTTON */}
                <div className="p-3 border-t border-slate-100">
                  <button onClick={doSearch} disabled={isScanning}
                    className="w-full bg-gradient-to-r from-[#e37224] to-[#c85e1a] hover:from-[#c85e1a] hover:to-[#a84f14] text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-[#e37224]/15 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                    {isScanning ? <><Loader2 size={16} className="animate-spin" /> İnternet Taranıyor... %{Math.round(scanProgress)}</>
                      : <><Globe size={16} /> Tüm Siteleri Tara & Listele</>}
                  </button>
                  <p className="text-[9px] text-slate-400 text-center mt-2">sahibinden.com, arabam.com, letgo.com ve daha fazlası taranır</p>
                </div>
              </div>
            </div>

            {/* ─── RESULTS ─── */}
            <div className="lg:col-span-7 xl:col-span-8">
              {/* Scanning animation */}
              {isScanning && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-slate-200 rounded-2xl p-6 mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#fff8f0] rounded-xl flex items-center justify-center"><Radar size={20} className="text-[#e37224] animate-pulse" /></div>
                    <div>
                      <p className="text-sm font-semibold">Türkiye taranıyor...</p>
                      <p className="text-xs text-slate-500">sahibinden.com, arabam.com, letgo.com taranıyor</p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-[#e37224] to-[#f09040] rounded-full" style={{ width: `${scanProgress}%` }} transition={{ duration: 0.3 }} />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-slate-400">İlanlar filtreleniyor ve güven skorlanıyor...</p>
                    <span className="text-xs font-bold text-[#c85e1a]">%{Math.round(scanProgress)}</span>
                  </div>
                  {/* Source scanning status */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['sahibinden.com', 'arabam.com', 'letgo.com', 'oto.sahibinden.com'].map((s, i) => (
                      <div key={s} className={`flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full border ${scanProgress > (i + 1) * 20 ? 'bg-green-50 border-green-200 text-green-600' : 'bg-slate-100 border-slate-100 text-slate-400'}`}>
                        {scanProgress > (i + 1) * 20 ? <CheckCircle2 size={10} /> : <Loader2 size={10} className={scanProgress > i * 20 ? 'animate-spin' : ''} />}
                        {s}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Empty state */}
              {!isScanning && !hasSearched && (
                <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
                  <Globe size={48} className="text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-600 text-sm font-semibold mb-2">Filtrelerinizi belirleyin ve tüm Türkiye&apos;yi tarayın</p>
                  <p className="text-slate-400 text-xs mb-4">Marka, model, yıl, fiyat, kilometre, kaza durumu, garanti ve daha fazlası...</p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {['sahibinden.com', 'arabam.com', 'letgo.com', 'oto.sahibinden.com'].map(s => (
                      <span key={s} className="text-[9px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* No results */}
              {!isScanning && hasSearched && totalResults === 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
                  <AlertTriangle size={48} className="text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 text-sm font-semibold mb-2">Kriterlerinize uygun araç bulunamadı</p>
                  <p className="text-slate-400 text-xs">Filtreleri genişletmeyi veya kriterleri değiştirmeyi deneyin</p>
                </div>
              )}

              {/* Results */}
              {!isScanning && hasSearched && totalResults > 0 && (
                <div>
                  {/* Result tabs */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex bg-slate-100 rounded-xl border border-slate-200 p-0.5">
                      <button onClick={() => setActiveTab('web')} className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${activeTab === 'web' ? 'bg-[#e37224] text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                        <Globe size={12} /> İnternet Sonuçları {webResults.length > 0 && <span className="text-[9px] bg-white/20 px-1.5 rounded-full">{webResults.length}</span>}
                      </button>
                      <button onClick={() => setActiveTab('mock')} className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${activeTab === 'mock' ? 'bg-[#e37224] text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                        <Car size={12} /> Veritabanı {results.length > 0 && <span className="text-[9px] bg-white/20 px-1.5 rounded-full">{results.length}</span>}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 ml-auto">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Güvenli</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Orta</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Riskli</span>
                    </div>
                  </div>

                  {/* Scanned sources info */}
                  {scannedSources.length > 0 && activeTab === 'web' && (
                    <div className="mb-3 flex items-center gap-2 text-[10px] text-slate-400">
                      <Radar size={10} className="text-[#e37224]" />
                      <span>Taranan siteler:</span>
                      {scannedSources.map(s => (
                        <span key={s} className="bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">{s}</span>
                      ))}
                    </div>
                  )}

                  {/* ─── SIRALANABİLİR BAŞLIK ─── */}
                  <SortableHeader sortField={sortField} sortDir={sortDir} onSort={toggleSort} />

                  {/* Web Results */}
                  {activeTab === 'web' && (() => {
                    // ─── SIRALAMA MANTIĞI ───
                    const sorted = [...webResults].sort((a, b) => {
                      if (!sortField || !sortDir) return 0
                      const dir = sortDir === 'asc' ? 1 : -1
                      const aText = `${a.title} ${a.snippet}`
                      const bText = `${b.title} ${b.snippet}`
                      switch (sortField) {
                        case 'model': return dir * a.title.localeCompare(b.title, 'tr')
                        case 'title': return dir * a.title.localeCompare(b.title, 'tr')
                        case 'year': return dir * (extractYear(aText) - extractYear(bText))
                        case 'km': return dir * (extractKm(aText) - extractKm(bText))
                        case 'color': return dir * extractColor(aText).localeCompare(extractColor(bText), 'tr')
                        case 'price': {
                          const pa = parseInt((a.price || '0').replace(/[^0-9]/g, ''))
                          const pb = parseInt((b.price || '0').replace(/[^0-9]/g, ''))
                          return dir * (pa - pb)
                        }
                        case 'date': return dir * (a.date || '').localeCompare(b.date || '')
                        case 'city': return dir * extractCity(aText).localeCompare(extractCity(bText), 'tr')
                        default: return 0
                      }
                    })

                    return (
                      <div className="max-h-[65vh] overflow-y-auto pr-1 border border-t-0 border-slate-200 rounded-b-xl">
                        {sorted.map((v, i) => {
                          const cState = contactMap[v.id]
                          const combined = `${v.title} ${v.snippet}`
                          const vModel = v.title.split(' ').slice(0, 2).join(' ')
                          const vYear = extractYear(combined)
                          const vKm = extractKm(combined)
                          const vColor = extractColor(combined)
                          const vCity = extractCity(combined)
                          return (
                            <div key={v.id}>
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.03 }}
                                className="flex items-center hover:hover:bg-[#fff8f0] transition-colors group border-b border-slate-100 last:border-b-0"
                              >
                                {/* Model */}
                                <div className="w-[110px] min-w-[90px] px-2.5 py-2.5">
                                  <span className="text-[11px] font-semibold text-slate-900 truncate block">{vModel}</span>
                                  <span className={`text-[8px] px-1.5 py-0.5 rounded-full border font-semibold inline-block mt-0.5 ${getSourceColor(v.source)}`}>{v.source}</span>
                                </div>
                                {/* İlan Başlığı */}
                                <div className="flex-1 min-w-[160px] px-2.5 py-2.5">
                                  <p className="text-[11px] text-slate-700 line-clamp-2 leading-snug group-hover:text-[#c85e1a] transition-colors">{v.title}</p>
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <button onClick={() => fetchInsight(v)}
                                      className={`p-1 rounded transition-all ${selectedInsightUrl === v.url ? 'bg-purple-50 text-purple-600' : 'text-slate-300 hover:text-purple-600'}`}
                                      title="AI Analizi"><Sparkle size={11} /></button>
                                    <button onClick={() => toggleCompare(v.id)}
                                      className={`p-1 rounded transition-all ${compareIds.has(v.id) ? 'bg-blue-50 text-blue-600' : 'text-slate-300 hover:text-blue-600'}`}
                                      title="Karşılaştır"><GitCompare size={11} /></button>
                                    <button onClick={() => fetchContact(v.id, v.url)}
                                      className={`p-1 rounded transition-all ${cState?.show ? 'bg-green-50 text-green-600' : 'text-slate-500 hover:text-[#c85e1a]'}`}
                                      title="İletişim">{cState?.loading ? <Loader2 size={11} className="animate-spin" /> : <Phone size={11} />}</button>
                                    <button onClick={() => { setFavUrls(prev => { const n = new Set(prev); n.has(v.url) ? n.delete(v.url) : n.add(v.url); return n }) }}
                                      className="p-1"><Heart size={11} className={favUrls.has(v.url) ? 'text-red-500 fill-red-500' : 'text-slate-400 hover:text-red-500'} /></button>
                                    <a href={v.url} target="_blank" rel="noopener noreferrer" className="p-1 text-slate-500 hover:text-[#c85e1a]"><ExternalLink size={11} /></a>
                                  </div>
                                </div>
                                {/* Yıl */}
                                <div className="w-[60px] min-w-[50px] px-2.5 py-2.5 text-center">
                                  <span className="text-[11px] text-slate-600">{vYear || '-'}</span>
                                </div>
                                {/* KM */}
                                <div className="w-[85px] min-w-[70px] px-2.5 py-2.5 text-right">
                                  <span className="text-[11px] text-slate-600">{vKm ? formatKm(vKm) : '-'}</span>
                                </div>
                                {/* Renk */}
                                <div className="w-[75px] min-w-[60px] px-2.5 py-2.5">
                                  <span className="text-[11px] text-slate-600">{vColor}</span>
                                </div>
                                {/* Fiyat */}
                                <div className="w-[130px] min-w-[100px] px-2.5 py-2.5 text-right">
                                  <span className="text-[12px] font-bold text-[#c85e1a]">{v.price || '-'}</span>
                                </div>
                                {/* İlan Tarihi */}
                                <div className="w-[100px] min-w-[85px] px-2.5 py-2.5">
                                  <span className="text-[10px] text-slate-500 flex items-center gap-0.5"><Clock size={9} className="text-slate-400 shrink-0" />{v.date || '-'}</span>
                                </div>
                                {/* İl / İlçe */}
                                <div className="w-[110px] min-w-[90px] px-2.5 py-2.5">
                                  <span className="text-[11px] text-slate-600 flex items-center gap-1"><MapPin size={9} className="text-slate-400 shrink-0" />{vCity}</span>
                                </div>
                              </motion.div>

                              {/* ─── GENİŞLETİLMİŞ PANEL: AI Analizi ─── */}
                              <AnimatePresence>
                                {selectedInsightUrl === v.url && insightData && (
                                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                    <div className="bg-white border border-purple-200 rounded-lg mx-3 mb-2 p-3">
                                      <div className="flex items-center gap-1.5 mb-2">
                                        <Sparkle size={10} className="text-purple-600" />
                                        <span className="text-[10px] font-semibold text-purple-600">AI Analizi</span>
                                        <button onClick={() => setSelectedInsightUrl(null)} className="ml-auto text-slate-400 hover:text-slate-700"><X size={10} /></button>
                                      </div>
                                      {isInsightLoading ? (
                                        <div className="flex items-center gap-2 text-xs text-slate-500"><Loader2 size={12} className="animate-spin" /> Analiz ediliyor...</div>
                                      ) : (
                                        <div className="space-y-2">
                                          {insightData.summary?.length > 0 && (
                                            <div>
                                              <span className="text-[9px] text-slate-400 block mb-1">Özet</span>
                                              {insightData.summary.map((s: string, idx: number) => (
                                                <p key={idx} className="text-[10px] text-slate-600 flex items-start gap-1"><span className="text-[#e37224] shrink-0">•</span>{s}</p>
                                              ))}
                                            </div>
                                          )}
                                          {insightData.questions?.length > 0 && (
                                            <div>
                                              <span className="text-[9px] text-slate-400 block mb-1">Satıcıya Sorulacaklar</span>
                                              {insightData.questions.slice(0, 3).map((q: string, idx: number) => (
                                                <p key={idx} className="text-[10px] text-slate-600 flex items-start gap-1"><MessageCircle size={8} className="text-blue-600 shrink-0 mt-0.5" />{q}</p>
                                              ))}
                                            </div>
                                          )}
                                          {insightData.negotiation?.suggestion && (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                                              <span className="text-[9px] text-green-600 font-semibold block mb-0.5">Pazarlık Önerisi</span>
                                              <p className="text-[10px] text-slate-600">{insightData.negotiation.suggestion}</p>
                                              {insightData.negotiation.maxPrice > 0 && (
                                                <p className="text-[10px] text-green-600 font-bold mt-1">Önerilen max: {insightData.negotiation.maxPrice.toLocaleString('tr-TR')} TL</p>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* ─── GENİŞLETİLMİŞ PANEL: İletişim ─── */}
                              <AnimatePresence>
                                {cState?.show && !cState.loading && (
                                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                    <div className="bg-white border border-slate-100 rounded-lg mx-3 mb-2 p-2.5">
                                      <div className="flex items-center gap-1.5 mb-2">
                                        <Phone size={10} className="text-[#e37224]" />
                                        <span className="text-[10px] font-semibold text-[#e37224]">İletişim Bilgileri</span>
                                      </div>
                                      {cState.hasContact && cState.data ? (
                                        <div className="space-y-2">
                                          {cState.data.phone.length > 0 && (
                                            <div className="flex items-start gap-2">
                                              <Phone size={11} className="text-green-600 shrink-0 mt-0.5" />
                                              <div className="flex-1">
                                                <span className="text-[9px] text-slate-400 block">Telefon</span>
                                                <div className="space-y-0.5">
                                                  {cState.data.phone.map((ph: string, pi: number) => (
                                                    <div key={pi} className="flex items-center gap-1.5">
                                                      <a href={`tel:${ph.replace(/\s/g, '')}`} className="text-xs font-bold text-slate-800 hover:text-[#c85e1a]">{ph}</a>
                                                      <button onClick={() => copyToClipboard(ph)} className="p-0.5 text-slate-400 hover:text-[#c85e1a]">
                                                        {copiedPhone === ph ? <Check size={9} className="text-green-600" /> : <Copy size={9} />}
                                                      </button>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                          {cState.data.sellerName && (
                                            <div className="flex items-start gap-2">
                                              <Building2 size={11} className="text-blue-600 shrink-0 mt-0.5" />
                                              <div>
                                                <span className="text-[9px] text-slate-400 block">Satıcı</span>
                                                <span className="text-xs text-slate-900">{cState.data.sellerName}</span>
                                                <span className="text-[9px] text-slate-400 ml-1.5">({cState.data.sellerType})</span>
                                              </div>
                                            </div>
                                          )}
                                          {cState.data.address && (
                                            <div className="flex items-start gap-2">
                                              <MapPin size={11} className="text-yellow-600 shrink-0 mt-0.5" />
                                              <div>
                                                <span className="text-[9px] text-slate-400 block">Adres</span>
                                                <span className="text-xs text-slate-900">{cState.data.address}</span>
                                              </div>
                                            </div>
                                          )}
                                          <div className="flex items-start gap-2">
                                            <Globe size={11} className="text-slate-500 shrink-0 mt-0.5" />
                                            <div>
                                              <span className="text-[9px] text-slate-400 block">İlan Bağlantısı</span>
                                              <a href={v.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 hover:text-[#e37224] truncate block max-w-[250px]">{v.url}</a>
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-2 py-1">
                                          <AlertTriangle size={11} className="text-yellow-500" />
                                          <span className="text-[10px] text-slate-500">İletişim bilgisi bulunamadı.</span>
                                          <a href={v.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#e37224] font-semibold hover:underline ml-auto shrink-0">Sayfaya Git →</a>
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {cState?.loading && (
                                <div className="mx-3 mb-2 bg-slate-50 rounded-lg border border-slate-200 p-2.5 flex items-center gap-2">
                                  <Loader2 size={12} className="animate-spin text-[#e37224]" />
                                  <span className="text-[10px] text-slate-500">İletişim bilgileri aranıyor...</span>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })()}

                  {/* Mock/DB Results */}
                  {activeTab === 'mock' && (() => {
                    const sorted = [...results].sort((a, b) => {
                      if (!sortField || !sortDir) return 0
                      const dir = sortDir === 'asc' ? 1 : -1
                      switch (sortField) {
                        case 'model': return dir * `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`, 'tr')
                        case 'title': return dir * `${a.year} ${a.brand} ${a.model} ${a.engine}`.localeCompare(`${b.year} ${b.brand} ${b.model} ${b.engine}`, 'tr')
                        case 'year': return dir * (a.year - b.year)
                        case 'km': return dir * (a.km - b.km)
                        case 'color': return dir * a.color.localeCompare(b.color, 'tr')
                        case 'price': return dir * (a.price - b.price)
                        case 'date': return dir * (a.id - b.id)
                        case 'city': return dir * a.city.localeCompare(b.city, 'tr')
                        default: return 0
                      }
                    })

                    return (
                      <div className="max-h-[65vh] overflow-y-auto pr-1 border border-t-0 border-slate-200 rounded-b-xl">
                        {sorted.map((v, i) => (
                          <div key={v.id}>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: i * 0.04 }}
                              className="flex items-center hover:hover:bg-[#fff8f0] transition-colors group border-b border-slate-100 last:border-b-0"
                            >
                              {/* Model */}
                              <div className="w-[110px] min-w-[90px] px-2.5 py-2.5">
                                <span className="text-[11px] font-semibold text-slate-900 truncate block">{v.brand} {v.model}</span>
                                <div className="flex gap-1 mt-0.5">
                                  {v.accident && <span className="text-[7px] bg-red-50 text-red-600 px-1 py-0.5 rounded font-bold">KAZALI</span>}
                                  {!v.accident && v.damage === 0 && <span className="text-[7px] bg-green-50 text-green-600 px-1 py-0.5 rounded font-bold">HASARSIZ</span>}
                                  {v.score >= 85 && <span className="text-[7px] bg-[#fff8f0] text-[#c85e1a] px-1 py-0.5 rounded font-bold">FIRSAT</span>}
                                </div>
                              </div>
                              {/* İlan Başlığı */}
                              <div className="flex-1 min-w-[160px] px-2.5 py-2.5">
                                <p className="text-[11px] text-slate-700 leading-snug group-hover:text-[#c85e1a] transition-colors">{v.engine} - {v.hp} HP - {v.drive}</p>
                                <p className="text-[9px] text-slate-400 mt-0.5">{v.fuel} · {v.trans} · {v.body}{v.damage > 0 ? ` · Hasar: ${formatPrice(v.damage)}` : ''}</p>
                                <p className="text-[8px] text-slate-300 mt-0.5">{v.damageDetail}</p>
                                <div className="flex items-center gap-1.5 mt-1 flex-nowrap whitespace-nowrap">
                                  <button onClick={() => { setFavIds(prev => { const n = new Set(prev); n.has(v.id) ? n.delete(v.id) : n.add(v.id); return n }) }}
                                    className="p-0.5"><Heart size={11} className={favIds.has(v.id) ? 'text-red-500 fill-red-500' : 'text-slate-400 hover:text-red-500'} /></button>
                                  <span className="flex items-center gap-0.5 text-[9px] text-slate-400 shrink-0"><Phone size={8} className="text-green-600" />0 532 {100 + (v.id * 37) % 900} {10 + (v.id * 13) % 90} {10 + (v.id * 7) % 90}</span>
                                  <span className="flex items-center gap-0.5 text-[9px] text-slate-400 shrink-0"><Building2 size={8} className="text-blue-600" />{v.seller}</span>
                                  <DedektifPuani score={v.score} size="default" />
                                </div>
                              </div>
                              {/* Yıl */}
                              <div className="w-[60px] min-w-[50px] px-2.5 py-2.5 text-center">
                                <span className="text-[11px] text-slate-600 font-medium">{v.year}</span>
                              </div>
                              {/* KM */}
                              <div className="w-[85px] min-w-[70px] px-2.5 py-2.5 text-right">
                                <span className="text-[11px] text-slate-600">{formatKm(v.km)}</span>
                              </div>
                              {/* Renk */}
                              <div className="w-[75px] min-w-[60px] px-2.5 py-2.5">
                                <span className="text-[11px] text-slate-600">{v.color}</span>
                              </div>
                              {/* Fiyat */}
                              <div className="w-[130px] min-w-[100px] px-2.5 py-2.5 text-right">
                                <span className="text-[12px] font-bold text-[#c85e1a]">{formatPrice(v.price)}</span>
                                {v.score >= 85 && <span className="block text-[8px] text-green-600">Piyasaya göre uygun</span>}
                              </div>
                              {/* İlan Tarihi */}
                              <div className="w-[100px] min-w-[85px] px-2.5 py-2.5">
                                <span className="text-[10px] text-slate-500 flex items-center gap-0.5"><CalendarDays size={9} className="text-slate-400 shrink-0" />{new Date(2025, 0, 20 - v.id).toLocaleDateString('tr-TR')}</span>
                              </div>
                              {/* İl / İlçe */}
                              <div className="w-[110px] min-w-[90px] px-2.5 py-2.5">
                                <span className="text-[11px] text-slate-600 flex items-center gap-1"><MapPin size={9} className="text-slate-400 shrink-0" />{v.city}</span>
                              </div>
                            </motion.div>
                          </div>
                        ))}
                      </div>
                    )
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ AI CHAT ═══ */}
      <Section id="ai" className="py-12 px-4 bg-slate-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold mb-2 text-[#0f2a48]">AI <span className="text-[#e37224]">Araç Asistanınız</span></h2>
            <p className="text-xs text-slate-500">Sadece yazın, yapay zeka analiz etsin</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center gap-2">
              <div className="w-7 h-7 bg-[#0f2a48] rounded-lg flex items-center justify-center"><Bot size={14} className="text-[#e37224]" /></div>
              <div><p className="text-xs font-semibold text-[#0f2a48]">OtoDedektif AI</p><p className="text-[9px] text-green-600 flex items-center gap-1"><span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />Çevrimiçi</p></div>
            </div>
            <div className="p-3 space-y-3 min-h-[200px] max-h-[300px] overflow-y-auto">
              {chatMessages.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-slate-400 text-xs mb-3">Bir soru sorun veya hazır sorulardan seçin</p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {['1 milyon bütçem var, aile arabası istiyorum', 'En az yakan SUV öner', 'Dizel mi hibrit mi?'].map((q, i) => (
                      <button key={i} onClick={() => setChatInput(q)} className="text-[10px] bg-[#fff8f0] border border-[#f09040]/30 text-[#c85e1a] px-2.5 py-1 rounded-full hover:bg-[#fff8f0] transition-colors">{q}</button>
                    ))}
                  </div>
                </div>
              )}
              <AnimatePresence>{chatMessages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${msg.role === 'user' ? 'bg-[#e37224] text-white rounded-br-sm' : 'bg-slate-100 text-slate-700 border border-slate-200 rounded-bl-sm'}`}>{msg.text}</div>
                </motion.div>
              ))}</AnimatePresence>
            </div>
            <div className="p-2.5 border-t border-slate-200 flex gap-2">
              <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} placeholder="Araç hakkında soru sorun..."
                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#e37224]" />
              <button onClick={sendChat} className="bg-[#e37224] hover:bg-[#c85e1a] text-white px-3 py-2 rounded-lg transition-colors"><Send size={14} /></button>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ PREMIUM ═══ */}
      <Section id="uyelik" className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6"><h2 className="text-xl sm:text-2xl font-extrabold mb-2 text-[#0f2a48]">Planınızı <span className="text-[#e37224]">seçin</span></h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="text-base font-bold text-[#0f2a48] mb-1">Ücretsiz</h3>
              <div className="text-2xl font-extrabold text-[#0f2a48] mb-4">0 TL<span className="text-xs font-normal text-slate-400">/ay</span></div>
              <ul className="space-y-2 mb-5">{['3 araç takibi', 'Günlük bildirim', '3 AI soru/gün'].map((f, i) => (
                <li key={i} className="flex items-center gap-1.5 text-xs text-slate-600"><CheckCircle2 size={12} className="text-slate-400 shrink-0" />{f}</li>
              ))}</ul>
              <button className="w-full border border-slate-300 hover:border-[#e37224] text-slate-700 text-sm font-semibold py-2.5 rounded-xl transition-all hover:bg-[#fff8f0]">Başla</button>
            </div>
            <div className="relative bg-gradient-to-b from-white to-slate-50 border-2 border-[#f09040]/40 rounded-2xl p-5 shadow-xl shadow-[#e37224]/10">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#e37224] to-[#c85e1a] text-white text-[9px] font-bold px-3 py-0.5 rounded-full">EN POPÜLER</div>
              <h3 className="text-base font-bold text-[#0f2a48] mb-1">Premium</h3>
              <div className="flex items-end gap-1 mb-1"><span className="text-2xl font-extrabold text-[#c85e1a]">149 TL</span><span className="text-xs text-slate-400 mb-0.5">/ay</span></div>
              <p className="text-[9px] text-slate-500 mb-4">Yıllık: 99 TL/ay (%33 tasarruf)</p>
              <ul className="space-y-2 mb-5">{['Sınırsız araç takibi', 'Anında bildirim', 'Fırsat analizi', 'Sınırsız AI', 'Pazarlık yardımcısı', 'Sahte ilan analizi'].map((f, i) => (
                <li key={i} className="flex items-center gap-1.5 text-xs text-slate-600"><CheckCircle2 size={12} className="text-[#e37224] shrink-0" />{f}</li>
              ))}</ul>
              <button className="w-full bg-gradient-to-r from-[#e37224] to-[#c85e1a] hover:from-[#c85e1a] hover:to-[#a84f14] text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-md shadow-[#e37224]/15">7 Gün Ücretsiz Dene</button>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ KARŞILAŞTIRMA HAVUZU ═══ */}
      {compareIds.size >= 2 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-blue-200 shadow-lg px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GitCompare size={18} className="text-blue-600" />
              <span className="text-sm font-bold text-[#0f2a48]">{compareIds.size} araç seçili</span>
              <span className="text-[10px] text-slate-500">Karşılaştırmak için en az 2 araç gerekli</span>
            </div>
            <div className="flex items-center gap-2">
              <a href="/compare" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all flex items-center gap-1.5">
                <GitCompare size={14} /> Karşılaştır
              </a>
              <button onClick={() => setCompareIds(new Set())} className="text-xs text-slate-400 hover:text-red-600">Temizle</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ SAHİPLİK MALİYETİ HESAPLAYICI ═══ */}
      <Section id="maliyet" className="py-8 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#fff8f0] rounded-xl flex items-center justify-center"><Calculator size={22} className="text-[#e37224]" /></div>
            <div>
              <h2 className="text-xl font-extrabold text-[#0f2a48]">Sahiplik Maliyeti Hesaplayıcı</h2>
              <p className="text-xs text-slate-500">Araç fiyatının ötesinde yıllık gerçek maliyetinizi hesaplayın</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <OwnershipCalc />
          </div>
        </div>
      </Section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-[#0f2a48] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Image src="/logo-v2.png" alt="OtoDedektif" width={140} height={78} className="h-9 w-auto" />
          </div>
          <p className="text-[10px] text-white/50">&copy; 2026 OtoDedektif. Tüm hakları saklıdır.</p>
          <div className="flex gap-3 text-[10px] text-white/50">
            <a href="#" className="hover:text-[#e37224]">Gizlilik</a>
            <a href="#" className="hover:text-[#e37224]">KVKK</a>
            <a href="#" className="hover:text-[#e37224]">İletişim</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
