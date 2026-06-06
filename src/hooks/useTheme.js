import { useEffect } from 'react'

export const useTheme = () => {
  const mql = window.matchMedia('(prefers-color-scheme: dark)')

  const handleMqlChange = e => {
    if (e.matches) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  useEffect(() => {
    // Sync once on mount so the initial route matches system theme.
    handleMqlChange(mql)

    mql.addEventListener('change', handleMqlChange)
    return () => {
      mql.removeEventListener('change', handleMqlChange)
    }
  }, [])
}
