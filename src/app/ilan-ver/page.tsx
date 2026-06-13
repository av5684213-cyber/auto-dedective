'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, Check, Car, Settings2, Shield,
  Paintbrush, Camera, FileText, MapPin, Eye, Save, Loader2,
  RotateCcw, Send, AlertCircle
} from 'lucide-react'
import {
  useListingWizard, validateStep, PANEL_LABELS,
  PANEL_CONDITION_COLORS, PANEL_CONDITION_LABELS,
  EQUIPMENT_GROUPS,
  type PanelCondition, type WizardData,
} from '@/store/wizard-store'
import { StepVehicleInfo } from '@/components/wizard/StepVehicleInfo'
import { StepTechnical } from '@/components/wizard/StepTechnical'
import { StepEquipment } from '@/components/wizard/StepEquipment'
import { StepDamage } from '@/components/wizard/StepDamage'
import { StepPhotos } from '@/components/wizard/StepPhotos'
import { StepListingText } from '@/components/wizard/StepListingText'
import { StepContact } from '@/components/wizard/StepContact'
import { StepPreview } from '@/components/wizard/StepPreview'

const STEPS = [
  { id: 1, label: 'Araç Tanımı', icon: Car },
  { id: 2, label: 'Teknik & Durum', icon: Settings2 },
  { id: 3, label: 'Donanım', icon: Shield },
  { id: 4, label: 'Hasar & Boya', icon: Paintbrush },
  { id: 5, label: 'Fotoğraflar', icon: Camera },
  { id: 6, label: 'İlan Metni', icon: FileText },
  { id: 7, label: 'İletişim', icon: MapPin },
  { id: 8, label: 'Önizleme', icon: Eye },
]

export default function IlanVerPage() {
  const { currentStep, data, setStep, updateData, isSaving, lastSavedAt, setSaving, setLastSaved, setListingId, reset } = useListingWizard()
  const [publishing, setPublishing] = useState(false)
  const [publishedId, setPublishedId] = useState<string | null>(null)
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isValid = validateStep(currentStep, data)
  const maxStep = STEPS.length

  const saveDraft = useCallback(async () => {
    setSaving(true)
    try {
      const d = useListingWizard.getState().data
      // Check both store and sessionStorage for listingId (survives hot-reload)
      let lid = d.listingId || sessionStorage.getItem('wizard_listing_id') || null
      console.log('[saveDraft] Sending draft with listingId:', lid)
      const res = await fetch('/api/listing/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: lid || undefined, data: d }),
      })
      const result = await res.json()
      console.log('[saveDraft] Draft response:', result)
      if (result.success && result.listingId) {
        setListingId(result.listingId)
        sessionStorage.setItem('wizard_listing_id', result.listingId)
        setLastSaved(new Date())
      } else {
        console.error('[saveDraft] Draft save failed:', result)
      }
    } catch (err) {
      console.error('[saveDraft] Draft save error:', err)
    }
    setSaving(false)
  }, [setSaving, setListingId, setLastSaved])

  // Auto-save draft on data changes
  useEffect(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(() => {
      saveDraft()
    }, 2000)
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current) }
  }, [data, saveDraft])

  // Load existing draft on mount
  useEffect(() => {
    const savedId = sessionStorage.getItem('wizard_listing_id')
    if (savedId) {
      fetch(`/api/listing/draft?id=${savedId}`)
        .then(r => r.json())
        .then(res => {
          if (res.success && res.listing) {
            const l = res.listing
            useListingWizard.getState().loadDraft({
              brand: l.brand || '',
              series: l.series || '',
              model: l.model || '',
              year: l.year,
              variant: l.variant || '',
              fuel: l.fuel || '',
              transmission: l.transmission || '',
              bodyType: l.bodyType || '',
              enginePower: l.enginePower,
              engineCc: l.engineCc,
              drivetrain: l.drivetrain || '',
              color: l.color || '',
              km: l.km,
              condition: l.condition || '',
              sellerType: l.sellerType || '',
              warranty: l.warranty,
              heavyDamageRecord: l.heavyDamageRecord,
              plateOrigin: l.plateOrigin || '',
              exchange: l.exchange,
              equipment: l.equipment || [],
              damageMap: l.damageMap || {},
              photos: l.photos || [],
              coverPhotoIndex: l.coverPhotoIndex || 0,
              title: l.title || '',
              description: l.description || '',
              price: l.price,
              negotiable: l.negotiable,
              contactName: l.contactName || '',
              contactPhone: l.contactPhone || '',
              city: l.city || '',
              district: l.district || '',
            }, l.id)
          }
        })
        .catch(() => {})
    }
  }, [])

  const goNext = () => {
    if (isValid && currentStep < maxStep) setStep(currentStep + 1)
  }
  const goPrev = () => {
    if (currentStep > 1) setStep(currentStep - 1)
  }

  const handlePublish = async () => {
    setPublishing(true)
    try {
      // Always save draft first to guarantee we have a listingId
      const d = useListingWizard.getState().data
      // Check both store and sessionStorage for listingId (survives hot-reload)
      const currentListingId = d.listingId || sessionStorage.getItem('wizard_listing_id') || null
      console.log('[handlePublish] Current listingId:', currentListingId)

      const draftRes = await fetch('/api/listing/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: currentListingId || undefined, data: d }),
      })
      const draftResult = await draftRes.json()
      console.log('[handlePublish] Draft response:', draftResult)

      // Use the listingId from draft response (newly created or existing)
      const effectiveListingId = draftResult.success ? draftResult.listingId : currentListingId
      console.log('[handlePublish] effectiveListingId:', effectiveListingId)

      if (!effectiveListingId) {
        // If draft save also failed, send full data so publish can create the record
        console.warn('[handlePublish] No listingId available, sending data to publish for creation')
        const res = await fetch('/api/listing/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listingId: null, data: d }),
        })
        const result = await res.json()
        console.log('[handlePublish] Publish response (create mode):', result)
        if (result.success) {
          setPublishedId(result.listingId)
          sessionStorage.removeItem('wizard_listing_id')
        } else {
          console.error('[handlePublish] Publish failed:', result)
          alert('Yayınlama başarısız: ' + (result.error || 'Bilinmeyen hata'))
        }
      } else {
        // Normal publish with valid listingId — also send data so publish can update latest changes
        setListingId(effectiveListingId)
        const res = await fetch('/api/listing/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listingId: effectiveListingId, data: d }),
        })
        const result = await res.json()
        console.log('[handlePublish] Publish response (normal mode):', result)
        if (result.success) {
          setPublishedId(result.listingId)
          sessionStorage.removeItem('wizard_listing_id')
        } else {
          console.error('[handlePublish] Publish failed:', result)
          alert('Yayınlama başarısız: ' + (result.error || 'Bilinmeyen hata'))
        }
      }
    } catch (err) {
      console.error('[handlePublish] Publish error:', err)
      alert('Yayınlama sırasında hata oluştu')
    }
    setPublishing(false)
  }

  // Published success screen
  if (publishedId) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white border border-green-200 rounded-2xl p-8 max-w-md text-center shadow-lg shadow-slate-200/50">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-[#0f2a48] mb-2">İlanınız Yayınlandı!</h2>
          <p className="text-sm text-slate-500 mb-4">İlanınız başarıyla yayınlandı ve artık aramalarda görünecek.</p>
          <div className="flex gap-3 justify-center">
            <a href={`/ilan/${publishedId}`} className="bg-[#e37224] hover:bg-[#c85e1a] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all">İlanı Görüntüle</a>
            <button onClick={() => { reset(); setPublishedId(null) }} className="border border-slate-300 hover:border-[#e37224] text-slate-700 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all">Yeni İlan Ver</button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Sub-header breadcrumb */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-lg sticky top-14 z-30">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 font-medium">İlan Ver</span>
          </div>
          <div className="flex items-center gap-3">
            {isSaving && <span className="text-[10px] text-slate-400 flex items-center gap-1"><Loader2 size={10} className="animate-spin" />Kaydediliyor...</span>}
            {lastSavedAt && !isSaving && <span className="text-[10px] text-slate-400">Son kayıt: {lastSavedAt.toLocaleTimeString('tr-TR')}</span>}
            <button onClick={reset} className="text-[10px] text-slate-400 hover:text-red-500 flex items-center gap-1" title="Sıfırla"><RotateCcw size={10} />Sıfırla</button>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-2">
        <div className="flex items-center justify-between mb-6">
          {STEPS.map((step) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isDone = currentStep > step.id
            const stepValid = validateStep(step.id, data)
            return (
              <button
                key={step.id}
                onClick={() => { if (isDone || (step.id <= currentStep)) setStep(step.id) }}
                className={`flex flex-col items-center gap-1.5 transition-all ${isActive ? 'scale-105' : 'opacity-60 hover:opacity-80'}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                  isDone ? 'bg-green-50 border-green-500 text-green-500' :
                  isActive ? 'bg-[#fff8f0] border-[#e37224] text-[#e37224]' :
                  'bg-white border-slate-200 text-slate-400'
                }`}>
                  {isDone ? <Check size={14} /> : <Icon size={14} />}
                </div>
                <span className={`text-[9px] font-medium ${isActive ? 'text-[#c85e1a]' : isDone ? 'text-green-600' : 'text-slate-400'}`}>
                  {step.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-slate-200 rounded-full mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#e37224] to-[#f09040] rounded-full"
            animate={{ width: `${(currentStep / maxStep) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentStep === 1 && <StepVehicleInfo />}
            {currentStep === 2 && <StepTechnical />}
            {currentStep === 3 && <StepEquipment />}
            {currentStep === 4 && <StepDamage />}
            {currentStep === 5 && <StepPhotos />}
            {currentStep === 6 && <StepListingText />}
            {currentStep === 7 && <StepContact />}
            {currentStep === 8 && <StepPreview />}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-200">
          <button
            onClick={goPrev}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              currentStep === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ChevronLeft size={16} /> Geri
          </button>

          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            {!isValid && currentStep < 8 && (
              <span className="text-red-500 flex items-center gap-1"><AlertCircle size={10} />Zorunlu alanları doldurun</span>
            )}
          </div>

          {currentStep < 8 ? (
            <button
              onClick={goNext}
              disabled={!isValid}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                isValid
                  ? 'bg-[#e37224] hover:bg-[#c85e1a] text-white shadow-lg shadow-[#e37224]/25'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              İleri <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/25 transition-all"
            >
              {publishing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {publishing ? 'Yayınlanıyor...' : 'Yayınla'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
