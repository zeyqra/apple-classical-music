import { create } from 'zustand'

const useAppStore = create(set => ({
  isSbOpen: false,
  setIsSbOpen: isSbOpen => set({ isSbOpen }),
  sbType: 'queue', // 'queue' | 'lyric'
  setSbType: sbType => set({ sbType }),
  searchKeywords: '',
  setSearchKeywords: searchKeywords => set({ searchKeywords }),
  showFullPlayer: false,
  setShowFullPlayer: showFullPlayer => set({ showFullPlayer }),
}))

export default useAppStore
