'use client'

import { useState, useRef, useMemo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Cell,
} from 'recharts'
import {
  GitCompare, Plus, X, Trophy, Car, Trash2,
  CheckCircle2, AlertTriangle, ArrowRight, Sparkles,
  ShieldCheck, Info,
} from 'lucide-react'
import DedektifPuani from '@/components/DedektifPuani'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'

/* ─── MOCK DATA ─── */
interface Vehicle {
  id: string
  brand: string
  model: string
  year: number
  km: number
  price: number
  fuel: string
  trans: string
  city: string
  body: string
  color: string
  damage: number
  score: number
}

const VEHICLES: Vehicle[] = [
  { id: '1', brand: 'Toyota', model: 'Corolla', year: 2021, km: 62000, price: 980000, fuel: 'Hibrit', trans: 'Otomatik', city: 'İstanbul', body: 'Sedan', color: 'Gri', damage: 0, score: 92 },
  { id: '2', brand: 'Volkswagen', model: 'Golf', year: 2023, km: 18000, price: 1150000, fuel: 'Benzin', trans: 'Otomatik', city: 'İzmir', body: 'Hatchback', color: 'Siyah', damage: 0, score: 95 },
  { id: '3', brand: 'BMW', model: '3 Serisi', year: 2021, km: 72000, price: 1350000, fuel: 'Dizel', trans: 'Otomatik', city: 'İstanbul', body: 'Sedan', color: 'Lacivert', damage: 35000, score: 72 },
  { id: '4', brand: 'Hyundai', model: 'Tucson', year: 2022, km: 55000, price: 1050000, fuel: 'Dizel', trans: 'Otomatik', city: 'Bursa', body: 'SUV', color: 'Beyaz', damage: 12000, score: 85 },
  { id: '5', brand: 'Renault', model: 'Megane', year: 2023, km: 15000, price: 780000, fuel: 'Benzin', trans: 'Otomatik', city: 'Ankara', body: 'Hatchback', color: 'Kırmızı', damage: 0, score: 90 },
  { id: '6', brand: 'Mercedes', model: 'C Serisi', year: 2020, km: 95000, price: 1650000, fuel: 'Dizel', trans: 'Otomatik', city: 'İstanbul', body: 'Sedan', color: 'Siyah', damage: 45000, score: 65 },
  { id: '7', brand: 'Skoda', model: 'Octavia', year: 2022, km: 38000, price: 890000, fuel: 'Benzin', trans: 'Otomatik', city: 'Eskişehir', body: 'Sedan', color: 'Gümüş', damage: 0, score: 91 },
  { id: '8', brand: 'Ford', model: 'Kuga', year: 2022, km: 48000, price: 950000, fuel: 'Dizel', trans: 'Otomatik', city: 'Kocaeli', body: 'SUV', color: 'Gri', damage: 5000, score: 87 },
]

/* ─── HELPERS ─── */
function formatPrice(n: number) {
  return n.toLocaleString('tr-TR') + ' TL'
}

function formatKm(n: number) {
  return n.toLocaleString('tr-TR') + ' km'
}

function formatDamage(n: number) {
  return n === 0 ? 'Hasarsız' : n.toLocaleString('tr-TR') + ' TL'
}

function getScoreColor(score: number) {
  if (score > 70) return '#22c55e'
  if (score >= 40) return '#eab308'
  return '#ef4444'
}

function getScoreBgClass(score: number) {
  if (score > 70) return 'text-green-600'
  if (score >= 40) return 'text-yellow-600'
  return 'text-red-500'
}

function getVehicleLabel(v: Vehicle) {
  return `${v.brand} ${v.model}`
}

/* ─── COMPARISON ROW DEFINITION ─── */
interface CompRow {
  key: string
  label: string
  icon: React.ReactNode
  getValue: (v: Vehicle) => string | number
  compare: 'low' | 'high' // which direction is "best"
  format?: (val: string | number) => string
}

const COMP_ROWS: CompRow[] = [
  { key: 'brandModel', label: 'Marka / Model', icon: <Car size={14} />, getValue: v => `${v.brand} ${v.model}`, compare: 'high' },
  { key: 'year', label: 'Yıl', icon: <span className="text-[10px] font-bold">Yıl</span>, getValue: v => v.year, compare: 'high' },
  { key: 'km', label: 'KM', icon: <span className="text-[10px] font-bold">KM</span>, getValue: v => v.km, compare: 'low' },
  { key: 'price', label: 'Fiyat', icon: <span className="text-[10px] font-bold">₺</span>, getValue: v => v.price, compare: 'low', format: v => formatPrice(Number(v)) },
  { key: 'fuel', label: 'Yakıt', icon: <span className="text-[10px] font-bold">⛽</span>, getValue: v => v.fuel, compare: 'high' },
  { key: 'trans', label: 'Vites', icon: <span className="text-[10px] font-bold">⚙</span>, getValue: v => v.trans, compare: 'high' },
  { key: 'city', label: 'Şehir', icon: <span className="text-[10px] font-bold">📍</span>, getValue: v => v.city, compare: 'high' },
  { key: 'body', label: 'Kasa Tipi', icon: <span className="text-[10px] font-bold">🚗</span>, getValue: v => v.body, compare: 'high' },
  { key: 'color', label: 'Renk', icon: <span className="text-[10px] font-bold">🎨</span>, getValue: v => v.color, compare: 'high' },
  { key: 'damage', label: 'Hasar', icon: <span className="text-[10px] font-bold">⚠</span>, getValue: v => v.damage, compare: 'low', format: v => formatDamage(Number(v)) },
  { key: 'score', label: 'Dedektif Puanı', icon: <ShieldCheck size={14} className="text-[#e37224]" />, getValue: v => v.score, compare: 'high' },
]

/* ─── ANIMATION VARIANTS ─── */
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

const slotVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' as const } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
}

/* ─── SECTION WRAPPER ─── */
function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
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

/* ─── CUSTOM TOOLTIP ─── */
function ScoreTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const data = payload[0]?.payload
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-slate-500 text-xs mb-1">{data?.name}</p>
      <p className="font-bold text-sm" style={{ color: getScoreColor(data?.score) }}>
        {data?.score} / 100
      </p>
    </div>
  )
}

/* ════════════════════════════════════════════════ PAGE ════════════════════════════════════════════════ */
export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<(string | null)[]>([null, null])

  const selectedVehicles = useMemo(
    () => selectedIds.map(id => (id ? VEHICLES.find(v => v.id === id) ?? null : null)),
    [selectedIds]
  )

  const activeVehicles = useMemo(
    () => selectedVehicles.filter((v): v is Vehicle => v !== null),
    [selectedVehicles]
  )

  const addSlot = () => {
    if (selectedIds.length >= 4) return
    setSelectedIds(prev => [...prev, null])
  }

  const removeSlot = (index: number) => {
    setSelectedIds(prev => prev.filter((_, i) => i !== index))
  }

  const updateSlot = (index: number, vehicleId: string) => {
    setSelectedIds(prev => {
      const next = [...prev]
      next[index] = vehicleId === '__none__' ? null : vehicleId
      return next
    })
  }

  const clearAll = () => {
    setSelectedIds([null, null])
  }

  /* Best value determination per row */
  const getBestIndices = (row: CompRow): Set<number> => {
    if (activeVehicles.length === 0) return new Set()
    const values = activeVehicles.map(v => row.getValue(v))
    const numericValues = values.map(v => Number(v))
    const allNumeric = numericValues.every(v => !isNaN(v))

    if (!allNumeric) return new Set()

    if (row.compare === 'low') {
      const min = Math.min(...numericValues)
      return new Set(numericValues.map((v, i) => (v === min ? i : -1)).filter(i => i !== -1))
    } else {
      const max = Math.max(...numericValues)
      return new Set(numericValues.map((v, i) => (v === max ? i : -1)).filter(i => i !== -1))
    }
  }

  /* Chart data */
  const chartData = useMemo(
    () =>
      activeVehicles.map(v => ({
        name: getVehicleLabel(v),
        score: v.score,
        fullName: `${v.brand} ${v.model} (${v.year})`,
      })),
    [activeVehicles]
  )

  const availableVehiclesForSlot = (slotIndex: number) => {
    const usedIds = selectedIds.filter((id, i) => id !== null && i !== slotIndex)
    return VEHICLES.filter(v => !usedIds.includes(v.id))
  }

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
              <GitCompare size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0f2a48]">
                Araç <span className="text-[#e37224]">Karşılaştırma</span>
              </h1>
              <p className="text-slate-500 text-sm">İkinci el araçları yan yana karşılaştırın</p>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ═══ 1. VEHICLE SELECTION ═══ */}
        <AnimatedSection>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#fff8f0] rounded-lg flex items-center justify-center">
                  <Car size={16} className="text-[#e37224]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0f2a48]">Araç Seçimi</h2>
                  <p className="text-slate-500 text-xs">2 ile 4 araç arası karşılaştırabilirsiniz</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedIds.length < 4 && (
                  <button
                    onClick={addSlot}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#fff8f0] border border-[#e37224] rounded-xl text-[#c85e1a] text-sm font-medium hover:bg-[#fff8f0] hover:border-[#e37224] transition-all"
                  >
                    <Plus size={16} />
                    Karşılaştırmaya Ekle
                  </button>
                )}
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm font-medium hover:bg-slate-100 hover:text-slate-900 transition-all"
                >
                  <Trash2 size={14} />
                  Temizle
                </button>
              </div>
            </div>

            {/* Slots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {selectedIds.map((selectedId, index) => {
                  const vehicle = selectedId ? VEHICLES.find(v => v.id === selectedId) : null
                  return (
                    <motion.div
                      key={index}
                      variants={slotVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className="relative bg-slate-50 rounded-xl border border-slate-200 p-4 group hover:border-[#e37224]/30 transition-colors"
                    >
                      {/* Remove button */}
                      {selectedIds.length > 2 && (
                        <button
                          onClick={() => removeSlot(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors z-10"
                        >
                          <X size={12} className="text-white" />
                        </button>
                      )}

                      {/* Slot number */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-6 h-6 bg-[#fff8f0] rounded-md flex items-center justify-center text-[10px] font-bold text-[#c85e1a]">
                          {index + 1}
                        </span>
                        <span className="text-xs text-slate-400">Araç {index + 1}</span>
                      </div>

                      {/* Select dropdown */}
                      <Select
                        value={selectedId ?? '__none__'}
                        onValueChange={val => updateSlot(index, val)}
                      >
                        <SelectTrigger className="w-full bg-white border-slate-200 text-sm text-slate-900 focus:border-[#e37224] focus:ring-[#e37224]/20 h-10">
                          <SelectValue placeholder="Araç seçin..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 max-h-[250px]">
                          <SelectItem value="__none__" className="text-slate-400 focus:bg-slate-50 focus:text-slate-500">
                            Araç seçin...
                          </SelectItem>
                          {availableVehiclesForSlot(index).map(v => (
                            <SelectItem
                              key={v.id}
                              value={v.id}
                              className="text-slate-900 focus:bg-[#fff8f0] focus:text-[#e37224]"
                            >
                              {v.brand} {v.model} ({v.year})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Mini preview if vehicle selected */}
                      <AnimatePresence>
                        {vehicle && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-3 pt-3 border-t border-slate-200 space-y-1.5 overflow-hidden"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-400">Fiyat</span>
                              <span className="text-xs font-semibold text-slate-900">{formatPrice(vehicle.price)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-400">KM</span>
                              <span className="text-xs font-semibold text-slate-900">{formatKm(vehicle.km)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-400">Dedektif Puanı</span>
                              <DedektifPuani score={vehicle.score} size="small" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Quick select hint */}
            {activeVehicles.length < 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 flex items-center gap-2 text-xs text-slate-400"
              >
                <Sparkles size={12} className="text-[#f09040]/50" />
                <span>Karşılaştırma için en az 2 araç seçin</span>
              </motion.div>
            )}
          </div>
        </AnimatedSection>

        {/* ═══ 2. COMPARISON TABLE ═══ */}
        {activeVehicles.length >= 2 && (
          <AnimatedSection>
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
              {/* Section Header */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-[#fff8f0] rounded-lg flex items-center justify-center">
                  <GitCompare size={16} className="text-[#e37224]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0f2a48]">Detaylı Karşılaştırma</h2>
                  <p className="text-slate-500 text-xs">Yeşil ile işaretli değer en iyi sonucu gösterir</p>
                </div>
              </div>

              {/* Table - horizontal scroll on mobile */}
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="min-w-[600px] px-4 sm:px-0">
                  <table className="w-full border-collapse">
                    {/* Header row with vehicle names */}
                    <thead>
                      <tr>
                        <th className="text-left p-3 w-36 sm:w-44 text-xs text-slate-400 font-medium">
                          Özellik
                        </th>
                        {activeVehicles.map((v, i) => (
                          <th key={v.id} className="p-3 text-center">
                            <div className="bg-gradient-to-r from-[#fff8f0] to-[#e37224]/5 border border-[#f09040]/30 rounded-xl px-3 py-2.5">
                              <p className="text-sm font-bold text-[#c85e1a]">{v.brand} {v.model}</p>
                              <p className="text-[10px] text-[#e37224]/70 mt-0.5">{v.year} &middot; {v.city}</p>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {COMP_ROWS.map((row, rowIdx) => {
                        const bestIndices = getBestIndices(row)
                        return (
                          <motion.tr
                            key={row.key}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: rowIdx * 0.04 }}
                            className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                          >
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <span className="text-slate-400">{row.icon}</span>
                                <span className="text-xs font-medium text-slate-500">{row.label}</span>
                              </div>
                            </td>
                            {activeVehicles.map((v, vIdx) => {
                              const rawValue = row.getValue(v)
                              const isBest = bestIndices.has(vIdx) && activeVehicles.length > 1
                              const displayValue = row.format ? row.format(rawValue) : String(rawValue)

                              return (
                                <td key={v.id} className="p-3 text-center">
                                  <motion.div
                                    initial={false}
                                    animate={isBest ? { scale: [1, 1.04, 1] } : {}}
                                    transition={{ duration: 0.4, delay: rowIdx * 0.04 }}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                      isBest
                                        ? 'bg-green-50 border border-green-200 text-green-600'
                                        : row.key === 'damage' && Number(rawValue) > 0
                                          ? 'bg-red-50 border border-red-200 text-red-500'
                                          : 'text-slate-700'
                                    }`}
                                  >
                                    {isBest && (
                                      <CheckCircle2 size={12} className="text-green-600 shrink-0" />
                                    )}
                                    {row.key === 'score' ? (
                                      <span className={isBest ? '' : getScoreBgClass(Number(rawValue))}>
                                        {displayValue}
                                      </span>
                                    ) : (
                                      <span>{displayValue}</span>
                                    )}
                                  </motion.div>
                                </td>
                              )
                            })}
                          </motion.tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-green-600" />
                  <span className="text-[10px] text-slate-400">En iyi değer</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <AlertTriangle size={12} className="text-red-500" />
                  <span className="text-[10px] text-slate-400">Hasar kaydı</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-[#e37224]" />
                  <span className="text-[10px] text-slate-400">Dedektif Puanı</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* ═══ 3. SCORE COMPARISON CHART ═══ */}
        {activeVehicles.length >= 2 && (
          <AnimatedSection>
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
              {/* Section Header */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-[#fff8f0] rounded-lg flex items-center justify-center">
                  <ShieldCheck size={16} className="text-[#e37224]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0f2a48]">Dedektif Puanı Karşılaştırması</h2>
                  <p className="text-slate-500 text-xs">Araçların fırsat düzeyi yan yana karşılaştırma</p>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="h-[280px] sm:h-[340px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
                    barCategoryGap="20%"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickLine={false}
                      interval={0}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 100]}
                      ticks={[0, 20, 40, 60, 80, 100]}
                    />
                    <Tooltip content={<ScoreTooltip />} />
                    <Bar
                      dataKey="score"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={64}
                      name="Dedektif Puanı"
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getScoreColor(entry.score)}
                          fillOpacity={0.85}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Score Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-200">
                {activeVehicles.map(v => (
                  <motion.div
                    key={v.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center"
                  >
                    <p className="text-xs text-slate-400 mb-1">{v.brand} {v.model}</p>
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle
                          cx="18" cy="18" r="15.5"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="3"
                        />
                        <circle
                          cx="18" cy="18" r="15.5"
                          fill="none"
                          stroke={getScoreColor(v.score)}
                          strokeWidth="3"
                          strokeDasharray={`${v.score} ${100 - v.score}`}
                          strokeLinecap="round"
                          className="transition-all duration-700"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-sm font-bold ${getScoreBgClass(v.score)}`}>
                          {v.score}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      v.score > 70
                        ? 'bg-green-50 text-green-600'
                        : v.score >= 40
                          ? 'bg-yellow-50 text-yellow-600'
                          : 'bg-red-50 text-red-500'
                    }`}>
                      {v.score > 70 ? 'Mükemmel Fırsat' : v.score >= 40 ? 'Orta' : 'Düşük'}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Score legend */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-green-500" />
                  <span className="text-[10px] text-slate-400">70+ Mükemmel Fırsat</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-yellow-500" />
                  <span className="text-[10px] text-slate-400">40-69 Orta</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-red-500" />
                  <span className="text-[10px] text-slate-400">&lt;40 Düşük</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* ═══ EMPTY STATE ═══ */}
        {activeVehicles.length < 2 && (
          <AnimatedSection>
            <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center">
              <div className="w-16 h-16 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <GitCompare size={28} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                Karşılaştırma için araç seçin
              </h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-4">
                Yukarıdaki slotlardan en az 2 araç seçerek detaylı karşılaştırma tablosunu ve puan analizini görüntüleyin.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <ArrowRight size={12} />
                <span>2-4 araç arası karşılaştırma yapabilirsiniz</span>
              </div>
            </div>
          </AnimatedSection>
        )}

      </main>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#0f2a48] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/50">
            Veriler örnektir, yatırım tavsiyesi değildir.
          </p>
          <p className="text-xs text-white/50">
            Son güncelleme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </footer>
    </div>
  )
}
