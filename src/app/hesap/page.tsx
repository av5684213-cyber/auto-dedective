'use client'

import React, { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { User, Crown, LogOut, Shield, Mail, ChevronRight, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function HesapPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [subscription, setSubscription] = useState<any>(null)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetch('/api/subscription/activate')
        .then(res => res.json())
        .then(data => {
          if (data.success) setSubscription(data)
        })
        .catch(() => {})
    }
  }, [session])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#e37224] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!session?.user) return null

  const isPremium = session.user.plan === 'PREMIUM'

  const handleCancel = async () => {
    if (!confirm('Premium aboneliğinizi sonlandırmak istediğinize emin misiniz?')) return
    setCancelLoading(true)
    try {
      const res = await fetch('/api/subscription/cancel', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setMessage('Premium abonelik sonlandırıldı')
        await update()
        router.refresh()
      } else {
        setMessage(data.error || 'Sonlandırma başarısız')
      }
    } catch {
      setMessage('Bağlantı hatası')
    } finally {
      setCancelLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#0f2a48] to-[#153560] rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              {session.user.name?.charAt(0)?.toUpperCase() || 'K'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0f2a48]">{session.user.name || 'Kullanıcı'}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Mail size={14} className="text-slate-400" />
                <span className="text-sm text-slate-500">{session.user.email}</span>
              </div>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`flex items-center gap-2 p-3 rounded-xl text-sm mb-4 ${
              message.includes('sonlandırıldı') ? 'bg-green-50 border border-green-200 text-green-600' : 'bg-red-50 border border-red-200 text-red-600'
            }`}>
              {message.includes('sonlandırıldı') ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {message}
            </div>
          )}

          {/* Plan Badge */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isPremium ? (
                  <div className="w-10 h-10 bg-gradient-to-br from-[#e37224] to-[#c85e1a] rounded-xl flex items-center justify-center">
                    <Crown size={20} className="text-white" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <User size={20} className="text-slate-500" />
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-500">Üyelik Planı</p>
                  <p className="font-bold text-[#0f2a48]">
                    {isPremium ? 'Premium' : 'Ücretsiz'}
                  </p>
                </div>
              </div>
              {isPremium && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#e37224]/10 text-[#e37224] text-xs font-bold rounded-full">
                  <Sparkles size={12} /> AKTİF
                </span>
              )}
            </div>

            {isPremium && subscription?.planRenewsAt && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Yenilenme tarihi: {new Date(subscription.planRenewsAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            )}

            {!isPremium ? (
              <Link
                href="/premium"
                className="mt-4 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#e37224] to-[#c85e1a] text-white text-sm font-bold py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <Crown size={16} />
                Premium&apos;a Geç
              </Link>
            ) : (
              <button
                onClick={handleCancel}
                disabled={cancelLoading}
                className="mt-4 w-full py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cancelLoading ? 'Sonlandırılıyor...' : 'Premium Aboneliğini Sonlandır'}
              </button>
            )}
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-4 shadow-sm">
            <h2 className="font-bold text-[#0f2a48] mb-4 flex items-center gap-2">
              <Shield size={16} className="text-[#e37224]" />
              Hesap Bilgileri
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500">Rol</span>
                <span className="text-sm font-medium text-[#0f2a48]">{session.user.role === 'ADMIN' ? 'Yönetici' : 'Kullanıcı'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500">Plan</span>
                <span className="text-sm font-medium text-[#0f2a48]">{isPremium ? 'Premium' : 'Ücretsiz'}</span>
              </div>
            </div>
          </div>

          {/* Premium Features Reminder */}
          {!isPremium && (
            <div className="bg-[#fff8f0] rounded-2xl border border-[#e37224]/20 p-5 mb-4">
              <h3 className="font-bold text-[#0f2a48] mb-3">Premium ile şunlara erişin:</h3>
              <ul className="space-y-2">
                {[
                  'Sınırsız AI ilan analizi',
                  'Sınırsız doğal dil arama',
                  'Sınırsız tarama',
                  '4 araca kadar karşılaştırma',
                  'Piyasa trendleri',
                  'Anlık bildirimler',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                    <ChevronRight size={14} className="text-[#e37224]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 text-sm font-bold py-2.5 rounded-xl hover:bg-red-50 transition-all"
          >
            <LogOut size={16} />
            Çıkış Yap
          </button>
        </motion.div>
      </div>
    </div>
  )
}
