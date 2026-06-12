import { create } from 'zustand'

const useAppStore = create(set => ({
  isSbOpen: false,
  setIsSbOpen: isSbOpen => set({ isSbOpen }),
  sbType: 'queue', // 'queue' | 'lyric'
  setSbType: sbType => set({ sbType }),
}))

export default useAppStore
