'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Crosshair, TrendingUp, GitCompare, Bot, User, Plus, Crown, LogOut, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Araç Av Modu', href: '/#avmodu', icon: Crosshair },
  { label: 'Trendler', href: '/trends', icon: TrendingUp },
  { label: 'Karşılaştır', href: '/compare', icon: GitCompare },
  { label: 'AI Asistan', href: '/#ai', icon: Bot },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()

  useEffect(() => {
    setMobileOpen(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  const handleMobileNavClick = (href: string) => {
    setMobileOpen(false)
    if (href.startsWith('/#') && pathname === '/') {
      const id = href.replace('/#', '')
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  const isPremium = session?.user?.plan === 'PREMIUM'

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#e37224] via-[#f09040]/60 to-white backdrop-blur-xl transition-all duration-300 ${
        scrolled
          ? 'shadow-lg shadow-black/10'
          : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/logo-v2.png"
            alt="OtoDedektif"
            width={200}
            height={112}
            className="h-12 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => handleMobileNavClick(item.href)}
                className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'text-[#c85e1a] bg-[#e37224]/10'
                    : 'text-[#0f2a48]/80 hover:text-[#0f2a48] hover:bg-[#e37224]/5'
                }`}
              >
                <Icon size={15} className={active ? 'text-[#e37224]' : 'text-[#0f2a48]/50'} />
                <span>{item.label}</span>
                {active && (
                  <motion.div
                    layoutId="navbar-active-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#e37224] rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* İlan Ver button - desktop */}
          <Link
            href="/ilan-ver"
            className="hidden md:flex items-center gap-1.5 bg-[#0f2a48] hover:bg-[#153560] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-md shadow-[#0f2a48]/20 hover:shadow-[#0f2a48]/40 transition-all"
          >
            <Plus size={14} />
            <span>İlan Ver</span>
          </Link>

          {/* Auth buttons */}
          {status === 'authenticated' && session?.user ? (
            <div className="hidden md:flex items-center gap-2">
              {isPremium && (
                <span className="flex items-center gap-1 px-2 py-1 bg-[#e37224]/10 text-[#e37224] text-[10px] font-bold rounded-full">
                  <Crown size={10} /> PREMIUM
                </span>
              )}
              <Link
                href="/hesap"
                className="flex items-center gap-1.5 text-[#0f2a48] hover:text-[#e37224] text-sm font-medium transition-colors"
              >
                <Settings size={15} />
                <span>Hesabım</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-1 text-slate-500 hover:text-red-500 text-sm transition-colors"
                title="Çıkış Yap"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/giris"
                className="text-[#0f2a48] hover:text-[#e37224] text-sm font-medium transition-colors"
              >
                Giriş
              </Link>
              <Link
                href="/kayit"
                className="bg-[#e37224] hover:bg-[#c85e1a] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
              >
                Kayıt Ol
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-[#0f2a48]/80 hover:text-[#0f2a48] hover:bg-[#0f2a48]/5 transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-[#e37224]/10 overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => handleMobileNavClick(item.href)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'text-[#e37224] bg-[#e37224]/10'
                        : 'text-[#0f2a48]/70 hover:text-[#0f2a48] hover:bg-[#e37224]/5'
                    }`}
                  >
                    <Icon size={16} className={active ? 'text-[#e37224]' : 'text-[#0f2a48]/40'} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <Link
                href="/ilan-ver"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-1.5 mt-2 bg-[#0f2a48] text-white text-sm font-bold px-4 py-2.5 rounded-lg shadow-md shadow-[#0f2a48]/20"
              >
                <Plus size={14} />
                İlan Ver
              </Link>

              {/* Mobile Auth */}
              <div className="border-t border-slate-200 mt-2 pt-2">
                {status === 'authenticated' && session?.user ? (
                  <>
                    {isPremium && (
                      <div className="flex items-center gap-1 px-3 py-2 text-[#e37224] text-xs font-bold">
                        <Crown size={12} /> Premium Üye
                      </div>
                    )}
                    <Link
                      href="/hesap"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#0f2a48]/70 hover:text-[#0f2a48]"
                    >
                      <Settings size={16} /> Hesabım
                    </Link>
                    <button
                      onClick={() => { setMobileOpen(false); signOut({ callbackUrl: '/' }) }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut size={16} /> Çıkış Yap
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 mt-1">
                    <Link
                      href="/giris"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center py-2.5 text-sm font-medium text-[#0f2a48] border border-slate-200 rounded-lg"
                    >
                      Giriş
                    </Link>
                    <Link
                      href="/kayit"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center py-2.5 text-sm font-bold text-white bg-[#e37224] rounded-lg"
                    >
                      Kayıt Ol
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
