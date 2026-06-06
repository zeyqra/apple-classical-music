import { create } from 'zustand'

const useListsStore = create(set => ({
  currentListId: null,
  setCurrentListId: id => set({ currentListId: id }),
}))

export default useListsStore
