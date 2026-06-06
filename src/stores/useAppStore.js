import { create } from 'zustand'

const useAppStore = create(set => ({
  isSbOpen: false,
  setIsSbOpen: isSbOpen => set({ isSbOpen }),
  sbType: 'queue', // 'queue' | 'lyric'
  setSbType: sbType => set({ sbType }),
  // count: 0,
  // increment: () => set((state) => ({ count: state.count + 1 })),
  // decrement: () => set((state) => ({ count: state.count - 1 })),
}))

export default useAppStore
