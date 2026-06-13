'use client'

import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Crown, Check, X, ArrowRight, Sparkles, Shield, Zap, BarChart3, Bot, Search, Bell } from 'lucide-react'

const FEATURES = [
  { name: 'AI İlan Analizi', free: 'Günde 3', premium: 'Sınırsız', icon: Bot },
  { name: 'Doğal Dil Arama', free: 'Günde 5', premium: 'Sınırsız', icon: Search },
  { name: 'Sohbetle Arama', free: 'Günde 5', premium: 'Sınırsız', icon: Zap },
  { name: 'Site Taraması', free: 'Günde 3', premium: 'Sınırsız', icon: Search },
  { name: 'Kayıtlı Arama', free: 'En fazla 3', premium: 'Sınırsız', icon: Bell },
  { name: 'Araç Karşılaştırma', free: '2 araç', premium: '4 araç', icon: Crown },
  { name: 'Piyasa Trendleri', free: false, premium: true, icon: BarChart3 },
  { name: 'Anlık Bildirimler', free: false, premium: true, icon: Bell },
  { name: 'Günlük Özet', free: true, premium: true, icon: Shield },
]

export default function PremiumPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const isPremium = session?.user?.plan === 'PREMIUM'

  const handleActivate = async () => {
    if (!session?.user) {
      router.push('/giris')
      return
    }
    try {
      const res = await fetch('/api/subscription/activate', { method: 'POST', credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        await update()
        router.refresh()
      } else {
        alert(data.error || 'Bir hata oluştu')
      }
    } catch {
      alert('Bağlantı hatası')
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0f2a48] via-[#153560] to-[#0f2a48] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#e37224] to-[#c85e1a] rounded-2xl flex items-center justify-center mb-6">
              <Crown size={32} className="text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              OtoDedektif <span className="text-[#e37224]">Premium</span>
            </h1>
            <p className="text-white/70 text-sm sm:text-base max-w-md mx-auto">
              Tüm araç takip ve analiz özelliklerini sınırsız kullanın. Akıllı asistanınız tam gücünde.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
          >
            <h2 className="text-lg font-bold text-[#0f2a48] mb-1">Ücretsiz</h2>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold text-[#0f2a48]">0</span>
              <span className="text-slate-500 text-sm">TL/ay</span>
            </div>
            <ul className="space-y-3 mb-6">
              {FEATURES.map((f) => (
                <li key={f.name} className="flex items-center gap-2 text-sm">
                  {f.free === false ? (
                    <X size={14} className="text-red-400 shrink-0" />
                  ) : (
                    <Check size={14} className="text-green-500 shrink-0" />
                  )}
                  <span className="text-slate-700">
                    {f.name}: <span className="font-medium">{f.free === false ? 'Yok' : String(f.free)}</span>
                  </span>
                </li>
              ))}
            </ul>
            <button
              disabled
              className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-400 text-sm font-medium cursor-not-allowed"
            >
              Mevcut Planınız
            </button>
          </motion.div>

          {/* Premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-2xl border-2 border-[#e37224] p-6 shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#e37224] text-white text-[10px] font-bold rounded-full">
                <Sparkles size={10} /> EN POPÜLER
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#0f2a48] mb-1">Premium</h2>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-bold text-[#e37224]">149</span>
              <span className="text-slate-500 text-sm">TL/ay</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Yıllık: 99 TL/ay (%33 tasarruf)</p>
            <ul className="space-y-3 mb-6">
              {FEATURES.map((f) => (
                <li key={f.name} className="flex items-center gap-2 text-sm">
                  {f.premium === true ? (
                    <Check size={14} className="text-green-500 shrink-0" />
                  ) : (
                    <Check size={14} className="text-[#e37224] shrink-0" />
                  )}
                  <span className="text-slate-700">
                    {f.name}: <span className="font-semibold text-[#0f2a48]">{f.premium === true ? 'Dahil' : String(f.premium)}</span>
                  </span>
                </li>
              ))}
            </ul>
            {isPremium ? (
              <div className="w-full py-2.5 rounded-xl bg-[#e37224]/10 text-[#e37224] text-sm font-bold text-center flex items-center justify-center gap-2">
                <Crown size={16} /> Aktif Premium Üye
              </div>
            ) : (
              <button
                onClick={handleActivate}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#e37224] to-[#c85e1a] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Premium&apos;a Geç
                <ArrowRight size={16} />
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
