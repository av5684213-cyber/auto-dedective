'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Legend,
} from 'recharts'
import {
  TrendingUp, TrendingDown, BarChart3, MapPin, Car,
  ChevronDown, ArrowUpRight, ArrowDownRight, Activity,
} from 'lucide-react'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'

/* ─── MOCK DATA ─── */

const POPULAR_MODELS = [
  'Toyota Corolla',
  'VW Golf',
  'BMW 3 Serisi',
  'Hyundai Tucson',
  'Renault Megane',
  'Mercedes C Serisi',
  'Ford Kuga',
  'Fiat Egea',
]

const CITIES = [
  'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya',
  'Konya', 'Adana', 'Gaziantep', 'Kocaeli', 'Mersin',
]

const MONTHS = [
  'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
  'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara',
]

// Generate monthly price trend data per model
function generatePriceTrend(model: string) {
  const basePrices: Record<string, number> = {
    'Toyota Corolla': 950000,
    'VW Golf': 1050000,
    'BMW 3 Serisi': 1450000,
    'Hyundai Tucson': 1100000,
    'Renault Megane': 780000,
    'Mercedes C Serisi': 1750000,
    'Ford Kuga': 970000,
    'Fiat Egea': 620000,
  }
  const base = basePrices[model] || 900000
  const trendFactors: Record<string, number> = {
    'Toyota Corolla': 1.02,
    'VW Golf': 0.99,
    'BMW 3 Serisi': 0.97,
    'Hyundai Tucson': 1.03,
    'Renault Megane': 0.98,
    'Mercedes C Serisi': 0.96,
    'Ford Kuga': 1.01,
    'Fiat Egea': 1.04,
  }
  const factor = trendFactors[model] || 1.0
  const data: { month: string; price: number }[] = []
  for (let i = 0; i < 12; i++) {
    const monthTrend = Math.pow(factor, i / 11)
    const noise = (Math.sin(i * 2.5 + base * 0.001) * 0.02)
    const price = Math.round(base * monthTrend * (1 + noise))
    data.push({
      month: MONTHS[i],
      price,
    })
  }
  return data
}

// Generate regional price data per model
function generateRegionalPrices(model: string) {
  const basePrices: Record<string, number> = {
    'Toyota Corolla': 950000,
    'VW Golf': 1050000,
    'BMW 3 Serisi': 1450000,
    'Hyundai Tucson': 1100000,
    'Renault Megane': 780000,
    'Mercedes C Serisi': 1750000,
    'Ford Kuga': 970000,
    'Fiat Egea': 620000,
  }
  const base = basePrices[model] || 900000
  const cityMultipliers: Record<string, number> = {
    'İstanbul': 1.08,
    'Ankara': 1.02,
    'İzmir': 1.05,
    'Bursa': 0.98,
    'Antalya': 1.03,
    'Konya': 0.93,
    'Adana': 0.91,
    'Gaziantep': 0.89,
    'Kocaeli': 1.01,
    'Mersin': 0.92,
  }
  return CITIES.map(city => ({
    city,
    price: Math.round(base * (cityMultipliers[city] || 1) * (1 + (Math.random() - 0.5) * 0.03)),
  }))
}

// Value retaining / losing models
const VALUE_RETAINING = [
  { model: 'Toyota Corolla', depreciation: -2.1 },
  { model: 'Fiat Egea', depreciation: -3.4 },
  { model: 'Hyundai Tucson', depreciation: -4.2 },
  { model: 'Honda Civic', depreciation: -5.1 },
  { model: 'VW Polo', depreciation: -5.8 },
  { model: 'Skoda Octavia', depreciation: -6.3 },
  { model: 'Dacia Duster', depreciation: -6.9 },
  { model: 'Kia Sportage', depreciation: -7.5 },
]

const VALUE_LOSING = [
  { model: 'BMW 5 Serisi', depreciation: 18.2 },
  { model: 'Mercedes E Serisi', depreciation: 16.8 },
  { model: 'Audi A6', depreciation: 15.4 },
  { model: 'Volvo S90', depreciation: 14.1 },
  { model: 'BMW 3 Serisi', depreciation: 12.7 },
  { model: 'Mercedes C Serisi', depreciation: 11.3 },
  { model: 'VW Passat', depreciation: 10.8 },
  { model: 'Peugeot 508', depreciation: 10.2 },
]

/* ─── HELPER ─── */
function formatPrice(n: number) {
  return (n / 1000).toLocaleString('tr-TR') + 'K TL'
}

function formatFullPrice(n: number) {
  return n.toLocaleString('tr-TR') + ' TL'
}

/* ─── ANIMATION VARIANTS ─── */
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const staggerItem = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
}

/* ─── CUSTOM TOOLTIP ─── */
function PriceTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-slate-500 text-xs mb-1">{label}</p>
      <p className="text-[#e37224] font-bold text-sm">
        {formatFullPrice(payload[0].value)}
      </p>
    </div>
  )
}

function CityTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-slate-500 text-xs mb-1 flex items-center gap-1">
        <MapPin size={10} /> {label}
      </p>
      <p className="text-[#e37224] font-bold text-sm">
        {formatFullPrice(payload[0].value)}
      </p>
    </div>
  )
}

/* ─── SECTION WRAPPER ─── */
function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section
      ref={ref}
      variants={sectionVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.section>
  )
}

/* ════════════════════════════════════════════════ PAGE ════════════════════════════════════════════════ */
export default function TrendsPage() {
  const [selectedModel, setSelectedModel] = useState('Toyota Corolla')
  const [selectedRegionalModel, setSelectedRegionalModel] = useState('Toyota Corolla')

  const priceTrendData = generatePriceTrend(selectedModel)
  const regionalData = generateRegionalPrices(selectedRegionalModel)

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* ─── HEADER ─── */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#e37224] to-[#c85e1a] rounded-xl flex items-center justify-center">
              <BarChart3 size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0f2a48]">
                Piyasa <span className="text-[#e37224]">Trendleri</span>
              </h1>
              <p className="text-slate-500 text-sm">Türkiye ikinci el otomobil pazarı analizleri</p>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ═══ 1. FİYAT TRENDİ ═══ */}
        <AnimatedSection>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#fff8f0] rounded-lg flex items-center justify-center">
                  <Activity size={16} className="text-[#e37224]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0f2a48]">Fiyat Trendi</h2>
                  <p className="text-slate-500 text-xs">Aylık ortalama fiyat değişimi</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Car size={14} className="text-slate-400" />
                <Select
                  value={selectedModel}
                  onValueChange={setSelectedModel}
                >
                  <SelectTrigger className="w-[200px] bg-white border-slate-200 text-sm text-slate-900 focus:border-[#e37224] focus:ring-[#e37224]/20">
                    <SelectValue placeholder="Model seçin" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    {POPULAR_MODELS.map(model => (
                      <SelectItem key={model} value={model} className="text-slate-900 focus:bg-[#fff8f0] focus:text-[#e37224]">
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Chart */}
            <div className="h-[300px] sm:h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceTrendData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={formatPrice}
                    width={75}
                  />
                  <Tooltip content={<PriceTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#e37224"
                    strokeWidth={2.5}
                    dot={{ fill: '#e37224', r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#e37224', stroke: '#fff', strokeWidth: 2 }}
                    name="Fiyat"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-200">
              {(() => {
                const first = priceTrendData[0]?.price || 0
                const last = priceTrendData[priceTrendData.length - 1]?.price || 0
                const diff = last - first
                const pct = ((diff / first) * 100).toFixed(1)
                const isUp = diff >= 0
                return (
                  <>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Başlangıç</p>
                      <p className="text-sm font-semibold text-slate-900">{formatFullPrice(first)}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Son Durum</p>
                      <p className="text-sm font-semibold text-slate-900">{formatFullPrice(last)}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 col-span-2 sm:col-span-1">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Değişim</p>
                      <p className={`text-sm font-semibold flex items-center gap-1 ${isUp ? 'text-green-600' : 'text-red-500'}`}>
                        {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {isUp ? '+' : ''}{pct}%
                      </p>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        </AnimatedSection>

        {/* ═══ 2. BÖLGESEL FİYAT FARKLARI ═══ */}
        <AnimatedSection>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#fff8f0] rounded-lg flex items-center justify-center">
                  <MapPin size={16} className="text-[#e37224]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0f2a48]">Bölgesel Fiyat Farkları</h2>
                  <p className="text-slate-500 text-xs">Şehrlere göre ortalama fiyat dağılımı</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Car size={14} className="text-slate-400" />
                <Select
                  value={selectedRegionalModel}
                  onValueChange={setSelectedRegionalModel}
                >
                  <SelectTrigger className="w-[200px] bg-white border-slate-200 text-sm text-slate-900 focus:border-[#e37224] focus:ring-[#e37224]/20">
                    <SelectValue placeholder="Model seçin" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    {POPULAR_MODELS.map(model => (
                      <SelectItem key={model} value={model} className="text-slate-900 focus:bg-[#fff8f0] focus:text-[#e37224]">
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Chart */}
            <div className="h-[300px] sm:h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="city"
                    stroke="#94a3b8"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                    interval={0}
                    angle={-35}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={formatPrice}
                    width={75}
                  />
                  <Tooltip content={<CityTooltip />} />
                  <Bar
                    dataKey="price"
                    fill="#e37224"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={48}
                    name="Ortalama Fiyat"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Regional Insight */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200">
              {(() => {
                const sorted = [...regionalData].sort((a, b) => b.price - a.price)
                const highest = sorted[0]
                const lowest = sorted[sorted.length - 1]
                const diff = highest.price - lowest.price
                return (
                  <>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <MapPin size={10} /> En Yüksek
                      </p>
                      <p className="text-sm font-semibold text-slate-900">{highest.city}</p>
                      <p className="text-xs text-[#e37224]">{formatFullPrice(highest.price)}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <MapPin size={10} /> En Düşük
                      </p>
                      <p className="text-sm font-semibold text-slate-900">{lowest.city}</p>
                      <p className="text-xs text-green-600">{formatFullPrice(lowest.price)}</p>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        </AnimatedSection>

        {/* ═══ 3. EN ÇOK DEĞER KORUYAN / KAYBEDEN ═══ */}
        <AnimatedSection>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
            {/* Section Header */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#fff8f0] rounded-lg flex items-center justify-center">
                <TrendingUp size={16} className="text-[#e37224]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0f2a48]">En Çok Değer Koruyan / Kaybeden Modeller</h2>
                <p className="text-slate-500 text-xs">Yıllık değer kaybı oranlarına göre sıralama</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Value Retaining */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-green-50 rounded-md flex items-center justify-center">
                    <TrendingUp size={12} className="text-green-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-green-600">En Çok Değer Koruyan</h3>
                </div>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2"
                >
                  {VALUE_RETAINING.map((item, idx) => (
                    <motion.div
                      key={item.model}
                      variants={staggerItem}
                      className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 hover:border-green-500/30 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold
                          ${idx < 3 ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                          {idx + 1}
                        </span>
                        <span className="text-sm text-slate-900 group-hover:text-green-600 transition-colors">
                          {item.model}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowUpRight size={12} className="text-green-600" />
                        <span className="text-sm font-semibold text-green-600">
                          %{Math.abs(item.depreciation).toFixed(1)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Value Losing */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-red-50 rounded-md flex items-center justify-center">
                    <TrendingDown size={12} className="text-red-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-red-500">En Çok Değer Kaybeden</h3>
                </div>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2"
                >
                  {VALUE_LOSING.map((item, idx) => (
                    <motion.div
                      key={item.model}
                      variants={staggerItem}
                      className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 hover:border-red-500/30 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold
                          ${idx < 3 ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500'}`}>
                          {idx + 1}
                        </span>
                        <span className="text-sm text-slate-900 group-hover:text-red-500 transition-colors">
                          {item.model}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowDownRight size={12} className="text-red-500" />
                        <span className="text-sm font-semibold text-red-500">
                          %{item.depreciation.toFixed(1)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* ═══ EMPTY STATE (shown when data would be empty) ═══ */}
        {false && (
          <AnimatedSection>
            <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center">
              <div className="w-16 h-16 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <BarChart3 size={28} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                Henüz yeterli veri yok
              </h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Piyasa trendlerini gösterebilmemiz için yeterli fiyat verisi toplanıyor.
                Kısa süre içinde burada detaylı analizler yer alacak.
              </p>
            </div>
          </AnimatedSection>
        )}

      </main>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#0f2a48] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/50">
            Oto<span className="text-[#e37224]">Dedektif</span> &mdash; Veriler örnektir, yatırım tavsiyesi değildir.
          </p>
          <p className="text-xs text-white/50">
            Son güncelleme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </footer>
    </div>
  )
}
