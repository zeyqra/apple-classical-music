import { useEffect, useState, useCallback } from 'react'
import useStore from './store'
import api from './api'
import { useNavigate } from 'react-router-dom'
import { usePlayer } from './PlayerContext'

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

export const useStatus = () => {
  // const resolveTarget = (target = {}) => ({
  //   targetId: target.targetId ?? defaultTarget.targetId,
  //   targetType: target.targetType ?? defaultTarget.targetType,
  // })
  const libraryTrackIds = useStore(state => state.libraryTrackIds)
  const libraryAlbumIds = useStore(state => state.libraryAlbumIds)
  const favouriteTrackIds = useStore(state => state.favouriteTrackIds)
  const favouriteAlbumIds = useStore(state => state.favouriteAlbumIds)
  const favouritePlaylistIds = useStore(state => state.favouritePlaylistIds)
  const favouriteRecordingIds = useStore(state => state.favouriteRecordingIds)

  const isInLibrary = ({ id, type }) => {
    // const { targetId, targetType } = resolveTarget(target)
    if (type === 'album') return libraryAlbumIds.has(id)
    if (type === 'track') return libraryTrackIds.has(id)
  }

  const isFavourite = ({ id, type }) => {
    // const { id, type } = resolveTarget(target)
    if (type === 'album') return favouriteAlbumIds.has(id)
    if (type === 'playlist') return favouritePlaylistIds.has(id)
    if (type === 'track') return favouriteTrackIds.has(id)
    if (type === 'recording') return favouriteRecordingIds.has(id)
  }

  return { isInLibrary, isFavourite }
}

export const useActions = () => {
  const navigate = useNavigate()

  // const resolveTarget = (target = {}) => {
  //   console.log({
  //     ...defaultTarget,
  //     ...target,
  //   })
  //   return {
  //     ...defaultTarget,
  //   }
  // }

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
  const { setQueuePlay } = usePlayer()

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

  const handleFetchTracksPlay = async ({ id, type }) => {
    // const { id, type } = resolveTarget(target)
    let fetchPlayTracks
    if (type === 'album') fetchPlayTracks = api.album
    if (type === 'playlist') fetchPlayTracks = api.playlist
    setQueuePlay({
      queue: (await fetchPlayTracks({ id })).tracks,
    })
  }

  const handleAddToLibrary = async ({ id, type }) => {
    // const { id, type } = resolveTarget(target)
    let addToLibrary
    if (type === 'album') addToLibrary = addAlbumToLibrary
    if (type === 'track') addToLibrary = addTrackToLibrary

    await addToLibrary({ id })
  }
  const handleRemoveFromLibrary = async ({ id, type }) => {
    // const { id, type } = resolveTarget(target)
    let removeFromLibrary
    if (type === 'album') removeFromLibrary = removeAlbumFromLibrary
    if (type === 'track') removeFromLibrary = removeTrackFromLibrary
    await removeFromLibrary({ id })
  }
  const handleCreatePlaylist = async ({ newPlaylistTitle }) => {
    await createPlaylist({ title: newPlaylistTitle })
  }
  const handleAddToPlaylist = async ({ playlistId, id, type }) => {
    // const { id: _id, type: _type } = resolveTarget({ id, type })
    let addToPlaylist
    if (type === 'album') addToPlaylist = api.addAlbumToPlaylist
    if (type === 'playlist') addToPlaylist = api.addPlaylistToPlaylist
    if (type === 'track') addToPlaylist = api.addTrackToPlaylist
    await addToPlaylist({ id, playlistId })
  }

  const handleNavigateTo = async ({ type, id }) => {
    navigate(`/${type}/${id}`)
  }

  // const handleToAlbum = async ({ album_id, id, type }) => {
  //   // const { id } = resolveTarget(target)
  //   let albumId
  //   if (type === 'track') albumId = album_id
  //   if (type === 'album') albumId = id
  //   navigate(`/album/${albumId}`)
  // }

  // const handleToPlaylist = async ({ id, type }) => {
  //   // const { id } = resolveTarget(target)
  //   // let playlistId
  //   // if (type === 'playlist') playlistId = id
  //   navigate(`/playlist/${id}`)
  // }

  // const handleToRecording = async ({ recording_id, id, type }) => {
  //   // const { id, type, recording_id } = resolveTarget(target)
  //   let recordingId
  //   if (type === 'track') recordingId = recording_id
  //   if (type === 'recording') recordingId = id
  //   navigate(`/recording/${recordingId}`)
  // }

  const handleFavourite = async ({ id, type }) => {
    // const { id, type } = resolveTarget(target)
    let favourite
    if (type === 'album') favourite = favouriteAlbum
    if (type === 'playlist') favourite = favouritePlaylist
    if (type === 'track') favourite = favouriteTrack
    if (type === 'recording') favourite = favouriteRecording
    await favourite({ id })
  }

  const handleUnfavourite = async ({ id, type }) => {
    // const { id, type } = resolveTarget(target)
    let unfavourite
    if (type === 'album') unfavourite = unfavouriteAlbum
    if (type === 'playlist') unfavourite = unfavouritePlaylist
    if (type === 'track') unfavourite = unfavouriteTrack
    if (type === 'recording') unfavourite = unfavouriteRecording
    await unfavourite({ id })
  }
  return {
    handleFetchTracksPlay,
    handleAddToLibrary,
    handleRemoveFromLibrary,
    handleCreatePlaylist,
    handleAddToPlaylist,
    handleNavigateTo,
    // handleToAlbum,
    // handleToPlaylist,
    // handleToRecording,
    handleFavourite,
    handleUnfavourite,
  }
}
