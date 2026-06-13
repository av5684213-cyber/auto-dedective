'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Info, X, ShieldCheck, TrendingDown, Wrench, FileText } from 'lucide-react'

const KRITERLER = [
  {
    icon: <TrendingDown size={14} className="text-[#e37224]" />,
    baslik: 'Fiyat Analizi',
    agirlik: '%40',
    aciklama:
      'Araç fiyatı, aynı modelin piyasasındaki medyan fiyatla karşılaştırılır. Piyasanın altındaki araçlar daha yüksek puan alır.',
  },
  {
    icon: <ShieldCheck size={14} className="text-green-600" />,
    baslik: 'Hasar Durumu',
    agirlik: '%20',
    aciklama:
      'Araçta kayıtlı hasar olup olmadığı ve hasar tutarı kontrol edilir. Hasarsız araçlar en yüksek puanı alır.',
  },
  {
    icon: <Wrench size={14} className="text-blue-600" />,
    baslik: 'Kullanım Yoğunluğu',
    agirlik: '%25',
    aciklama:
      'Araç yaşına göre yıllık ortalama kilometre hesaplanır. Düşük kilometreli araçlar daha yüksek puan alır.',
  },
  {
    icon: <FileText size={14} className="text-purple-600" />,
    baslik: 'Donanım Zenginliği',
    agirlik: '%15',
    aciklama:
      'İlan açıklamasının detay düzeyi, donanım listesinin zenginliği değerlendirilir. Detaylı ilanlar güvenilirliği artırır.',
  },
]

const ARALIKLAR = [
  { aralik: '70-100', etiket: 'Mükemmel Fırsat', bg: '#f0fdf4', border: '#bbf7d0', numColor: '#15803d', txtColor: '#16a34a' },
  { aralik: '40-69', etiket: 'Orta', bg: '#fefce8', border: '#fef08a', numColor: '#a16207', txtColor: '#ca8a04' },
  { aralik: '0-39', etiket: 'Düşük', bg: '#fef2f2', border: '#fecaca', numColor: '#dc2626', txtColor: '#ef4444' },
]

export default function DedektifPuani({
  score,
  size = 'default',
  showInfo = true,
}: {
  score: number
  size?: 'small' | 'default' | 'large'
  showInfo?: boolean
}) {
  const [infoOpen, setInfoOpen] = useState(false)

  const scoreColorClass =
    score >= 70 ? 'text-green-600' : score >= 40 ? 'text-yellow-600' : 'text-red-600'

  const labelSize = size === 'small' ? 'text-[9px]' : size === 'large' ? 'text-sm' : 'text-[11px]'
  const scoreSize = size === 'small' ? 'text-[10px]' : size === 'large' ? 'text-xl' : 'text-[10px]'
  const infoSize = size === 'small' ? 10 : size === 'large' ? 15 : 12

  return (
    <>
      <div className="inline-flex flex-col items-start gap-1">
        <div className={`flex items-center gap-1 ${labelSize} text-slate-500`}>
          <span>Dedektif Puanı</span>
          {showInfo && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setInfoOpen(true)
              }}
              className="hover:opacity-70 transition-opacity"
              aria-label="Dedektif Puanı hakkında"
            >
              <Info size={infoSize} className="text-slate-400 shrink-0" />
            </button>
          )}
        </div>
        <span className={`font-bold ${scoreSize} ${scoreColorClass}`}>{score}/100</span>
      </div>

      {/* Bilgilendirme Popup */}
      {infoOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setInfoOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '1rem',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              width: 'calc(100% - 2rem)',
              maxWidth: '28rem',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header (sabit) */}
            <div
              style={{
                background: 'linear-gradient(to right, #0f2a48, #1a3a5c)',
                padding: '0.75rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                <ShieldCheck size={18} style={{ color: '#e37224', flexShrink: 0 }} />
                <h3
                  style={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    minWidth: 0,
                    overflowWrap: 'anywhere',
                  }}
                >
                  Dedektif Puanı Nedir?
                </h3>
              </div>
              <button
                onClick={() => setInfoOpen(false)}
                style={{ color: 'rgba(255,255,255,0.6)', flexShrink: 0, cursor: 'pointer', lineHeight: 0 }}
                aria-label="Kapat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body (içerik uzarsa SADECE burada dikey kayar) */}
            <div style={{ padding: '1rem 1.25rem', overflowY: 'auto', minHeight: 0, flex: 1 }}>
              <p
                style={{
                  color: '#475569',
                  fontSize: '0.75rem',
                  lineHeight: 1.625,
                  marginBottom: '1rem',
                  overflowWrap: 'anywhere',
                }}
              >
                Dedektif Puanı, ilan verilerini analiz ederek aracın piyasadaki fırsat düzeyini 0-100 arasında
                ölçen bir puanlama sistemidir. Puan ne kadar yüksekse, aracın o kadar iyi bir fırsat olduğunu
                gösterir.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Değerlendirme Kriterleri
                </p>
                {KRITERLER.map((k, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.625rem',
                      background: '#f8fafc',
                      borderRadius: '0.5rem',
                      padding: '0.625rem 0.75rem',
                    }}
                  >
                    <div style={{ marginTop: '0.125rem', flexShrink: 0 }}>{k.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#1e293b',
                            minWidth: 0,
                            overflowWrap: 'anywhere',
                          }}
                        >
                          {k.baslik}
                        </span>
                        <span
                          style={{
                            fontSize: '0.625rem',
                            fontWeight: 700,
                            color: '#e37224',
                            background: '#fff8f0',
                            padding: '0.125rem 0.375rem',
                            borderRadius: '9999px',
                            flexShrink: 0,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {k.agirlik}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: '0.6875rem',
                          color: '#64748b',
                          marginTop: '0.125rem',
                          lineHeight: 1.625,
                          overflowWrap: 'anywhere',
                        }}
                      >
                        {k.aciklama}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Puan aralıkları */}
              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                <p
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem',
                  }}
                >
                  Puan Aralıkları
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.5rem' }}>
                  {ARALIKLAR.map((a, i) => (
                    <div
                      key={i}
                      style={{
                        background: a.bg,
                        border: `1px solid ${a.border}`,
                        borderRadius: '0.5rem',
                        padding: '0.5rem',
                        textAlign: 'center',
                        minWidth: 0,
                      }}
                    >
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: a.numColor }}>{a.aralik}</span>
                      <p style={{ fontSize: '0.625rem', color: a.txtColor, marginTop: '0.125rem', overflowWrap: 'anywhere' }}>
                        {a.etiket}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
