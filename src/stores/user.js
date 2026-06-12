import { create } from 'zustand'

const useUserStore = create(set => ({
  cookie: localStorage.getItem('cookie') || '',
  setCookie: cookie => {
    if (!cookie) {
      localStorage.removeItem('cookie')
    } else {
      localStorage.setItem('cookie', cookie)
    }
    set({ cookie })
  },
}))

export default useUserStore
