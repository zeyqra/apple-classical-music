import { useEffect, useState, useCallback } from 'react'
import useStore from './store'

export function usePlayNextPrev() {
  const queue = useStore(state => state.queue)
  const index = useStore(state => state.index)
  const mode = useStore(state => state.mode)
  const setIndex = useStore(state => state.setIndex)

  return useCallback(
    delta => {
      if (!queue.length) return

      const total = queue.length
      const newIndex = index + delta

      console.log('console:usePlayNextPrev mode', mode)
      // 单曲循环：index 不变
      if (mode === 'singleLoop') {
        console.log('console: usePlayNextPrev return restart')
        return 'restart'
      }

      // 顺序播放
      if (mode === 'list') {
        if (newIndex < 0 || newIndex >= total) {
          return 'boundary' // 播放器 effect 会处理 audio.pause()
        }
        setIndex(newIndex)
        return
      }

      // 列表循环
      if (mode === 'listLoop') {
        if (total === 1) return 'restart'

        const nextIndex = (newIndex + total) % total
        setIndex(nextIndex)
      }
    },
    [queue, index, mode, setIndex]
  )
}

export const useQuery = (queryFn, params) => {
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await queryFn(params, { signal: controller.signal })

        setResult(result)
      } catch (error) {
        // !response.ok 时
        if (error.name === 'AbortError') return
        setError(error)
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    return () => controller.abort()
  }, [queryFn, params])

  return { result, isLoading, error }
}
