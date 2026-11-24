import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useStore from '../store.js'
import api from '../api.js'
import Menu from '../components/Menu.jsx'
import TracksGrouped from '../components/TracksGrouped.jsx'
import { useMenuActions, useStatus } from '../hooks.js'

const Album = () => {
  const { id: album_id } = useParams()

  const [album, setAlbum] = useState({})
  const resetQueueAndPlay = useStore(state => state.resetQueueAndPlay)
  const { id, tracks = [], title = '', performers = [] } = album
  const navigate = useNavigate()
  const { isInLibrary } = useStatus({ targetId: id, targetType: 'album' })
  const { handleAddToLibrary } = useMenuActions({
    targetId: id,
    targetType: 'album',
  })

  const fetchAlbum = async () => {
    const result = await api.album({ id: album_id })
    setAlbum(result)
  }

  useEffect(() => {
    fetchAlbum()
  }, [])

  const handlePlayClick = ({ index }) => {
    resetQueueAndPlay({ tracks: album.tracks, index })
  }
  // const addAlbumToLibrary = async ({ id }) => {
  //   await api.addAlbumToLibrary({ id })
  //   setAlbum({
  //     ...album,
  //     isInLibrary: true,
  //     tracks: tracks.map(t => ({ ...t, isInLibrary: true })),
  //   })
  // }

  // const removeAlbumFromLibrary = async ({ id }) => {
  //   await api.removeAlbumFromLibrary({ id })
  //   setAlbum({
  //     ...album,
  //     isInLibrary: false,
  //     tracks: tracks.map(t => ({ ...t, isInLibrary: false })),
  //   })
  // }

  // const addTrackToLibrary = async ({ id }) => {
  //   await api.addTrackToLibrary({ id })
  //   setAlbum({
  //     ...album,
  //     isInLibrary: true,
  //     tracks: tracks.map(t => {
  //       if (t.id === id) {
  //         return {
  //           ...t,
  //           isInLibrary: true,
  //         }
  //       }
  //       return t
  //     }),
  //   })
  // }

  // const removeTrackFromLibrary = async ({ id }) => {
  //   await api.removeTrackFromLibrary({ id })
  //   setAlbum(pre => {
  //     const newTracks = tracks.map(t => {
  //       if (t.id === id) {
  //         return {
  //           ...t,
  //           isInLibrary: false,
  //         }
  //       }
  //       return t
  //     })
  //     return {
  //       ...album,
  //       isInLibrary: !!newTracks.find(t => t.isInLibrary),
  //       tracks: newTracks,
  //     }
  //   })
  // }

  // const addAlbumToPlaylist = async ({ id, playlistId }) => {
  //   await api.addAlbumToPlaylist({ id, playlistId })
  // }

  // const addTrackToPlaylist = async ({ id, playlistId }) => {
  //   await api.addTrackToPlaylist({ id, playlistId })
  // }

  // const navigateToRecording = () => {
  //   navigate(`/recording/${id}`)
  // }

  // const favouriteAlbum = async ({ id }) => {
  //   await api.favouriteAlbum({ id })
  //   setAlbum({
  //     ...album,
  //     isFavourite: true,
  //   })
  // }

  // const unfavouriteAlbum = async ({ id }) => {
  //   await api.unfavouriteAlbum({ id })
  //   setAlbum({
  //     ...album,
  //     isFavourite: false,
  //   })
  // }

  // const favouriteTrack = async ({ id }) => {
  //   await api.favouriteTrack({ id })
  //   setAlbum({
  //     ...album,
  //     tracks: tracks.map(t => {
  //       if (t.id === id) {
  //         return {
  //           ...t,
  //           isFavourite: true,
  //         }
  //       }
  //       return t
  //     }),
  //   })
  // }

  // const unfavouriteTrack = async ({ id }) => {
  //   await api.unfavouriteTrack({ id })
  //   setAlbum({
  //     ...album,
  //     tracks: tracks.map(t => {
  //       if (t.id === id) {
  //         return {
  //           ...t,
  //           isFavourite: false,
  //         }
  //       }
  //       return t
  //     }),
  //   })
  // }

  // const favouriteRecording = async ({ id }) => {
  //   await api.favouriteRecording({ id })
  //   setAlbum({
  //     ...album,
  //     tracks: tracks.map(t => {
  //       if (t.recording_id === id) {
  //         return {
  //           ...t,
  //           isRecordingFavourite: true,
  //         }
  //       }
  //       return t
  //     }),
  //   })
  // }

  // const unfavouriteRecording = async ({ id }) => {
  //   await api.unfavouriteRecording({ id })
  //   setAlbum({
  //     ...album,
  //     tracks: tracks.map(t => {
  //       if (t.recording_id === id) {
  //         return {
  //           ...t,
  //           isRecordingFavourite: false,
  //         }
  //       }
  //       return t
  //     }),
  //   })
  // }

  // const handleMenuClick = ({ id, type, action, playlistId }) => {
  //   if (action === 'ADD_TO_LIBRARY' && type === 'album') addAlbumToLibrary({ id })
  //   if (action === 'REMOVE_FROM_LIBRARY' && type === 'album') removeAlbumFromLibrary({ id })
  //   if (action === 'ADD_TO_LIBRARY' && type === 'track') addTrackToLibrary({ id })
  //   if (action === 'REMOVE_FROM_LIBRARY' && type === 'track') removeTrackFromLibrary({ id })
  //   if (action === 'ADD_TO_PLAYLIST' && type === 'album') addAlbumToPlaylist({ id, playlistId })
  //   if (action === 'ADD_TO_PLAYLIST' && type === 'track') addTrackToPlaylist({ id, playlistId })
  //   if (action === 'TO_RECORDING') navigateToRecording({ id })
  //   if (action === 'FAVOURITE' && type === 'album') favouriteAlbum({ id })
  //   if (action === 'UNFAVOURITE' && type === 'album') unfavouriteAlbum({ id })
  //   if (action === 'FAVOURITE' && type === 'track') favouriteTrack({ id })
  //   if (action === 'UNFAVOURITE' && type === 'track') unfavouriteTrack({ id })
  //   if (action === 'FAVOURITE' && type === 'recording') favouriteRecording({ id })
  //   if (action === 'UNFAVOURITE' && type === 'recording') unfavouriteRecording({ id })
  // }

  return (
    <div>
      {/* 专辑信息 */}
      <div className="flex">
        <div>
          <div>{title}</div>
          <div>{performers.map(p => p.name).join(' / ')}</div>
          <button onClick={() => handlePlayClick({ index: 0 })}>▶ </button>
          {!isInLibrary() && <button onClick={handleAddToLibrary}>Add </button>}
          <Menu actions={['LIBRARY', 'PLAYLIST', 'FAVOURITE']} targetId={id} targetType="album" />
        </div>
      </div>
      {/* 专辑曲目 */}
      <TracksGrouped tracks={tracks} toAlbum={false} onTrackPlay={handlePlayClick} />
    </div>
  )
}

export default Album
