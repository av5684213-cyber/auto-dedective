'use client'

import { useRef, useState } from 'react'
import { useListingWizard } from '@/store/wizard-store'
import { Upload, X, GripVertical, Star, Image as ImageIcon } from 'lucide-react'

export function StepPhotos() {
  const { data, updateData } = useListingWizard()
  const fileInput = useRef<HTMLInputElement>(null)
  const [dragIdx, setDragIdx] = useState<number | null>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files) return
    const newPhotos: string[] = []
    for (let i = 0; i < files.length && data.photos.length + newPhotos.length < 20; i++) {
      const file = files[i]
      if (!file.type.startsWith('image/')) continue
      if (file.size > 10 * 1024 * 1024) continue
      try {
        const reader = new FileReader()
        const dataUrl = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })
        newPhotos.push(dataUrl)
      } catch { /* skip */ }
    }
    updateData({ photos: [...data.photos, ...newPhotos] })
  }

  const removePhoto = (idx: number) => {
    const newPhotos = data.photos.filter((_, i) => i !== idx)
    const newCover = data.coverPhotoIndex === idx ? 0 : data.coverPhotoIndex > idx ? data.coverPhotoIndex - 1 : data.coverPhotoIndex
    updateData({ photos: newPhotos, coverPhotoIndex: newCover })
  }

  const setCover = (idx: number) => {
    updateData({ coverPhotoIndex: idx })
  }

  const movePhoto = (from: number, to: number) => {
    if (to < 0 || to >= data.photos.length) return
    const newPhotos = [...data.photos]
    const [moved] = newPhotos.splice(from, 1)
    newPhotos.splice(to, 0, moved)
    let newCover = data.coverPhotoIndex
    if (data.coverPhotoIndex === from) newCover = to
    else if (from < data.coverPhotoIndex && to >= data.coverPhotoIndex) newCover--
    else if (from > data.coverPhotoIndex && to <= data.coverPhotoIndex) newCover++
    updateData({ photos: newPhotos, coverPhotoIndex: newCover })
  }

  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault()
    if (dragIdx !== null && dragIdx !== targetIdx) {
      movePhoto(dragIdx, targetIdx)
    }
    setDragIdx(null)
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-[#0f2a48] mb-1">Fotoğraflar</h2>
      <p className="text-xs text-slate-400 mb-5">En az 1, en fazla 20 fotoğraf yükleyin. İlk fotoğraf kapak fotoğrafı olur.</p>

      {/* Upload area */}
      <div
        onClick={() => fileInput.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
        className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#e37224] transition-colors mb-4"
      >
        <Upload size={32} className="text-slate-400 mx-auto mb-2" />
        <p className="text-sm text-slate-500">Fotoğraf yüklemek için tıklayın veya sürükleyin</p>
        <p className="text-[10px] text-slate-400 mt-1">JPG, PNG · Maks 10MB/adet · {data.photos.length}/20</p>
        <input ref={fileInput} type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
      </div>

      {/* Photo grid */}
      {data.photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {data.photos.map((photo, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={() => setDragIdx(idx)}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, idx)}
              className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                idx === data.coverPhotoIndex ? 'border-[#e37224]' : 'border-slate-200'
              } ${dragIdx === idx ? 'opacity-50' : ''}`}
            >
              <img src={photo} alt={`Foto ${idx + 1}`} className="w-full h-24 object-cover" />
              {/* Cover badge */}
              {idx === data.coverPhotoIndex && (
                <span className="absolute top-1 left-1 bg-[#e37224] text-white text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <Star size={7} />Kapak
                </span>
              )}
              {/* Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                {idx !== data.coverPhotoIndex && (
                  <button onClick={() => setCover(idx)} className="p-1 bg-[#e37224] rounded text-white" title="Kapak yap">
                    <Star size={12} />
                  </button>
                )}
                <button onClick={() => removePhoto(idx)} className="p-1 bg-red-500 rounded text-white" title="Kaldır">
                  <X size={12} />
                </button>
              </div>
              {/* Drag handle */}
              <div className="absolute bottom-1 right-1 text-white/40">
                <GripVertical size={12} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
