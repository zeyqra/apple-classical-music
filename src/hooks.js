import { useEffect, useState, useCallback } from 'react'
import useStore from './store'
import api from './api'
import { useNavigate } from 'react-router-dom'

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

  const refetch = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // const result = await queryFn(params, { signal: controller.signal })
      const result = await queryFn(params)

      setResult(result)
    } catch (error) {
      // !response.ok 时
      // if (error.name === 'AbortError') return
      setError(error)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // const controller = new AbortController()
    refetch()
    // return () => controller.abort()
  }, [queryFn, params])

  return { result, isLoading, error, refetch }
}

export const useStatus = (defaultTarget = {}) => {
  const resolveTarget = (target = {}) => ({
    targetId: target.targetId ?? defaultTarget.targetId,
    targetType: target.targetId ?? defaultTarget.targetType,
  })
  const libraryTrackIds = useStore(state => state.libraryTrackIds)
  const libraryAlbumIds = useStore(state => state.libraryAlbumIds)
  const favouriteTrackIds = useStore(state => state.favouriteTrackIds)
  const favouriteAlbumIds = useStore(state => state.favouriteAlbumIds)
  const favouritePlaylistIds = useStore(state => state.favouritePlaylistIds)
  const favouriteRecordingIds = useStore(state => state.favouriteRecordingIds)

  const isInLibrary = target => {
    const { targetId, targetType } = resolveTarget(target)
    if (targetType === 'album') return libraryAlbumIds.has(targetId)
    if (targetType === 'track') return libraryTrackIds.has(targetId)
  }

  const isFavourite = target => {
    const { targetId, targetType } = resolveTarget(target)
    if (targetType === 'album') return favouriteAlbumIds.has(targetId)
    if (targetType === 'playlist') return favouritePlaylistIds.has(targetId)
    if (targetType === 'track') return favouriteTrackIds.has(targetId)
    if (targetType === 'recording') return favouriteRecordingIds.has(targetId)
  }

  return { isInLibrary, isFavourite }
}

export const useMenuActions = (defaultTarget = {}) => {
  const navigate = useNavigate()

  const resolveTarget = (target = {}) => ({
    targetId: target.targetId ?? defaultTarget.targetId,
    targetType: target.targetId ?? defaultTarget.targetType,
  })

  const addAlbumToLibrary = useStore(state => state.addAlbumToLibrary)
  const removeAlbumFromLibrary = useStore(state => state.removeAlbumFromLibrary)
  const addTrackToLibrary = useStore(state => state.addTrackToLibrary)
  const removeTrackFromLibrary = useStore(state => state.removeTrackFromLibrary)
  const favouriteAlbum = useStore(state => state.favouriteAlbum)
  const unfavouriteAlbum = useStore(state => state.unfavouriteAlbum)
  const favouritePlaylist = useStore(state => state.favouritePlaylist)
  const unfavouritePlaylist = useStore(state => state.unfavouritePlaylist)
  const favouriteTrack = useStore(state => state.favouriteTrack)
  const unfavouriteTrack = useStore(state => state.unfavouriteTrack)
  const favouriteRecording = useStore(state => state.favouriteRecording)
  const unfavouriteRecording = useStore(state => state.unfavouriteRecording)
  const createPlaylist = useStore(state => state.createPlaylist)
  const resetQueueAndPlay = useStore(state => state.resetQueueAndPlay)

  // let fetchPlayTracks, addToLibrary, removeFromLibrary, addToPlaylist, favourite, unfavourite
  // switch (targetType) {
  //   case 'album':
  //     fetchPlayTracks = api.album
  //     addToLibrary = addAlbumToLibrary
  //     removeFromLibrary = removeAlbumFromLibrary
  //     addToPlaylist = api.addAlbumToPlaylist
  //     favourite = favouriteAlbum
  //     unfavourite = unfavouriteAlbum
  //     break
  //   case 'playlist':
  //     fetchPlayTracks = api.playlist
  //     addToPlaylist = api.addPlaylistToPlaylist
  //     favourite = favouritePlaylist
  //     unfavourite = unfavouritePlaylist
  //     break
  //   case 'track':
  //     addToLibrary = addTrackToLibrary
  //     addToPlaylist = removeTrackFromLibrary
  //     favourite = favouriteTrack
  //     unfavourite = unfavouriteTrack
  //     break
  //   case 'recording':
  //     favourite = favouriteRecording
  //     unfavourite = unfavouriteRecording
  //     break
  //   default:
  //     break
  // }

  const getActions = ({ targetType, action }) => {
    let _action
    if (action === 'PLAY') {
      if (targetType === 'album') _action = api.album
      if (targetType === 'playlist') _action = api.playlist
    } else if (action === 'ADD_TO_LIBRARY') {
      if (targetType === 'album') _action = addAlbumToLibrary
      if (targetType === 'track') _action = addTrackToLibrary
    } else if (action === 'REMOVE_FROM_LIBRARY') {
      if (targetType === 'album') _action = removeAlbumFromLibrary
      if (targetType === 'track') _action = removeTrackFromLibrary
    } else if (action === 'ADD_TO_PLAYLIST') {
      if (targetType === 'album') _action = api.addAlbumToPlaylist
      if (targetType === 'playlist') _action = api.addPlaylistToPlaylist
      if (targetType === 'track') _action = api.addTrackToPlaylist
    } else if (action === 'FAVOURITE') {
      if (targetType === 'album') _action = favouriteAlbum
      if (targetType === 'playlist') _action = favouritePlaylist
      if (targetType === 'track') _action = favouriteTrack
      if (targetType === 'recording') _action = favouriteRecording
    } else if (action === 'UNFAVOURITE') {
      if (targetType === 'album') _action = unfavouriteAlbum
      if (targetType === 'playlist') _action = unfavouritePlaylist
      if (targetType === 'track') _action = unfavouriteTrack
      if (targetType === 'recording') _action = unfavouriteRecording
    }

    return _action
  }

  const handlePlay = async target => {
    const { targetId, targetType } = resolveTarget(target)
    const fetchPlayTracks = getActions({ action: 'PLAY', targetType })
    resetQueueAndPlay({
      queue: (await fetchPlayTracks({ id: targetId })).tracks,
    })
  }

  const handleAddToLibrary = async target => {
    const { targetId, targetType } = resolveTarget(target)
    const addToLibrary = getActions({ action: 'ADD_TO_LIBRARY', targetType })
    await addToLibrary({ id: targetId })
  }
  const handleRemoveFromLibrary = async target => {
    const { targetId, targetType } = resolveTarget(target)
    const removeFromLibrary = getActions({ action: 'REMOVE_FROM_LIBRARY', targetType })
    await removeFromLibrary({ id: targetId })
  }
  const handleCreatePlaylist = async ({ newPlaylistTitle }) => {
    await createPlaylist({ title: newPlaylistTitle })
  }
  const handleAddToPlaylist = async ({ playlistId, targetId, targetType }) => {
    const { targetId: id, targetType: type } = resolveTarget({ targetId, targetType })
    const addToPlaylist = getActions({ action: 'ADD_TO_PLAYLIST', targetType: type })
    await addToPlaylist({ id, playlistId })
  }

  const handleToAlbum = async target => {
    const { targetId } = resolveTarget(target)
    navigate(`/album/${targetId}`)
  }

  const handleToRecording = async target => {
    const { targetId } = resolveTarget(target)
    navigate(`/recording/${targetId}`)
  }

  const handleFavourite = async target => {
    const { targetId, targetType } = resolveTarget(target)
    const favourite = getActions({ action: 'FAVOURITE', targetType })
    await favourite({ id: targetId })
  }

  const handleUnfavourite = async target => {
    const { targetId, targetType } = resolveTarget(target)
    const unfavourite = getActions({ action: 'UNFAVOURITE', targetType })
    await unfavourite({ id: targetId })
  }
  return {
    handlePlay,
    handleAddToLibrary,
    handleRemoveFromLibrary,
    handleCreatePlaylist,
    handleAddToPlaylist,
    handleToAlbum,
    handleToRecording,
    handleFavourite,
    handleUnfavourite,
  }
}
