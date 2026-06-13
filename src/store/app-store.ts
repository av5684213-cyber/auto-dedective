// ─── Zustand Global Store ───
// Uygulama genelinde paylaşılan durum yönetimi.

import { create } from 'zustand'

export interface WebResult {
  id: string
  title: string
  price: string
  url: string
  source: string
  snippet: string
  date: string
  hostName: string
  favicon: string
}

export interface CompareVehicle {
  id: string
  title: string
  brand?: string
  model?: string
  year?: number
  km?: number
  price?: number
  fuel?: string
  transmission?: string
  city?: string
  score?: number
  url?: string
}

interface AppState {
  // Karşılaştırma listesi
  compareList: CompareVehicle[]
  addToCompare: (vehicle: CompareVehicle) => void
  removeFromCompare: (id: string) => void
  clearCompare: () => void

  // Favori URL'ler (hızlı erişim)
  favoriteUrls: Set<string>
  toggleFavoriteUrl: (url: string) => void

  // Aktif sekme
  activeResultTab: 'mock' | 'web'
  setActiveResultTab: (tab: 'mock' | 'web') => void

  // Arama sonrası scroll
  scrollToResults: boolean
  setScrollToResults: (v: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  compareList: [],
  addToCompare: (vehicle) =>
    set((state) => {
      if (state.compareList.length >= 4) return state
      if (state.compareList.find(v => v.id === vehicle.id)) return state
      return { compareList: [...state.compareList, vehicle] }
    }),
  removeFromCompare: (id) =>
    set((state) => ({
      compareList: state.compareList.filter(v => v.id !== id),
    })),
  clearCompare: () => set({ compareList: [] }),

  favoriteUrls: new Set<string>(),
  toggleFavoriteUrl: (url) =>
    set((state) => {
      const next = new Set(state.favoriteUrls)
      if (next.has(url)) next.delete(url)
      else next.add(url)
      return { favoriteUrls: next }
    }),

  activeResultTab: 'web',
  setActiveResultTab: (tab) => set({ activeResultTab: tab }),

  scrollToResults: false,
  setScrollToResults: (v) => set({ scrollToResults: v }),
}))
