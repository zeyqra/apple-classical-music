import { useCallback } from 'react'
import useMusicStore from '../stores/music'

export function usePlayNextPrev() {
  const queue = useMusicStore(state => state.queue)
  const index = useMusicStore(state => state.index)
  const mode = useMusicStore(state => state.mode)
  const setIndex = useMusicStore(state => state.setIndex)

  return useCallback(
    delta => {
      if (!queue.length) return

      const total = queue.length
      const newIndex = index + delta

      // 单曲循环：index 不变
      if (mode === 'singleLoop') return 'restart'

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
