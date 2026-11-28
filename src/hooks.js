import { useEffect, useState, useCallback } from 'react'
import useStore from './store'
import api from './api'
import { useNavigate } from 'react-router-dom'
import { usePlayer } from './PlayerContext'

export const useQuery = ({ queryFn, params }) => {
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
  const libraryTrackIds = useStore(state => state.libraryTrackIds)
  const libraryAlbumIds = useStore(state => state.libraryAlbumIds)
  const favouriteTrackIds = useStore(state => state.favouriteTrackIds)
  const favouriteAlbumIds = useStore(state => state.favouriteAlbumIds)
  const favouritePlaylistIds = useStore(state => state.favouritePlaylistIds)
  const favouriteRecordingIds = useStore(state => state.favouriteRecordingIds)
  const favouriteWorkIds = useStore(state => state.favouriteWorkIds)
  const favouriteComposerIds = useStore(state => state.favouriteComposerIds)
  const favouritePerformerIds = useStore(state => state.favouritePerformerIds)

  const isInLibrary = ({ id, type }) => {
    if (type === 'album') return libraryAlbumIds.has(id)
    if (type === 'track') return libraryTrackIds.has(id)
  }

  const isFavourite = ({ id, type }) => {
    if (type === 'album') return favouriteAlbumIds.has(id)
    if (type === 'playlist') return favouritePlaylistIds.has(id)
    if (type === 'track') return favouriteTrackIds.has(id)
    if (type === 'recording') return favouriteRecordingIds.has(id)
    if (type === 'work') return favouriteWorkIds.has(id)
    if (type === 'composer') return favouriteComposerIds.has(id)
    if (type === 'performer') return favouritePerformerIds.has(id)
  }

  return { isInLibrary, isFavourite }
}

export const useActions = () => {
  const navigate = useNavigate()

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
  const favouriteWork = useStore(state => state.favouriteWork)
  const unfavouriteWork = useStore(state => state.unfavouriteWork)
  const favouriteComposer = useStore(state => state.favouriteComposer)
  const unfavouriteComposer = useStore(state => state.unfavouriteComposer)
  const favouritePerformer = useStore(state => state.favouritePerformer)
  const unfavouritePerformer = useStore(state => state.unfavouritePerformer)
  const createPlaylist = useStore(state => state.createPlaylist)
  const { setQueuePlay } = usePlayer()

  const handleFetchTracksPlay = async ({ id, type }) => {
    let fetchPlayTracks
    if (type === 'album') fetchPlayTracks = api.album
    if (type === 'playlist') fetchPlayTracks = api.playlist
    setQueuePlay({
      queue: (await fetchPlayTracks({ id })).tracks,
    })
  }

  const handleAddToLibrary = async ({ id, type }) => {
    let addToLibrary
    if (type === 'album') addToLibrary = addAlbumToLibrary
    if (type === 'track') addToLibrary = addTrackToLibrary

    await addToLibrary({ id })
  }
  const handleRemoveFromLibrary = async ({ id, type }) => {
    let removeFromLibrary
    if (type === 'album') removeFromLibrary = removeAlbumFromLibrary
    if (type === 'track') removeFromLibrary = removeTrackFromLibrary
    await removeFromLibrary({ id })
  }
  const handleCreatePlaylist = async ({ newPlaylistTitle }) => {
    await createPlaylist({ title: newPlaylistTitle })
  }
  const handleAddToPlaylist = async ({ playlistId, id, type }) => {
    let addToPlaylist
    if (type === 'album') addToPlaylist = api.addAlbumToPlaylist
    if (type === 'playlist') addToPlaylist = api.addPlaylistToPlaylist
    if (type === 'track') addToPlaylist = api.addTrackToPlaylist
    await addToPlaylist({ id, playlistId })
  }

  const handleNavigateTo = async ({ type, id }) => {
    navigate(`/${type}/${id}`)
  }

  const handleFavourite = async ({ id, type }) => {
    let favourite
    if (type === 'album') favourite = favouriteAlbum
    if (type === 'playlist') favourite = favouritePlaylist
    if (type === 'track') favourite = favouriteTrack
    if (type === 'recording') favourite = favouriteRecording
    if (type === 'work') favourite = favouriteWork
    if (type === 'composer') favourite = favouriteComposer
    if (type === 'performer') favourite = favouritePerformer
    await favourite({ id })
  }

  const handleUnfavourite = async ({ id, type }) => {
    let unfavourite
    if (type === 'album') unfavourite = unfavouriteAlbum
    if (type === 'playlist') unfavourite = unfavouritePlaylist
    if (type === 'track') unfavourite = unfavouriteTrack
    if (type === 'recording') unfavourite = unfavouriteRecording
    if (type === 'work') unfavourite = unfavouriteWork
    if (type === 'composer') unfavourite = unfavouriteComposer
    if (type === 'performer') unfavourite = unfavouritePerformer
    await unfavourite({ id })
  }
  return {
    handleFetchTracksPlay,
    handleAddToLibrary,
    handleRemoveFromLibrary,
    handleCreatePlaylist,
    handleAddToPlaylist,
    handleNavigateTo,
    handleFavourite,
    handleUnfavourite,
  }
}
