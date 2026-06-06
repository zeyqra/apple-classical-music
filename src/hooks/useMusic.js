import { useQuery } from '@tanstack/react-query'
import request from '../utils/request'
export const getAlbumNew = ({ area = 'ALL', offset = 0, limit = 10 }) => {
  return request.get('/album/new', { params: { area, offset, limit } })
}
export const getAlbum = ({ id }) => {
  return request.get('/album', { params: { id } })
}
export const getSongUrlV1 = ({ id, level }) => {
  return request.get('/song/url/v1', { params: { id, level } })
}

// ===========================================

export const useAlbumNew = params =>
  useQuery({
    queryKey: ['albumNew', params],
    queryFn: () => getAlbumNew(params),
  })
export const useAlbum = params =>
  useQuery({
    queryKey: ['album', params],
    queryFn: () => getAlbum(params),
  })
export const useSongUrlV1 = params =>
  useQuery({
    queryKey: ['songUrlV1', params],
    queryFn: () => getSongUrlV1(params),
    enabled: !!params.id,
  })

import { useCallback } from 'react'
import useMusicStore from '../stores/useMusicStore'

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
