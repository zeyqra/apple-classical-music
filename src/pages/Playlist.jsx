import { useNavigate, useParams } from 'react-router-dom'
import api from '../api.js'
import useStore from '../store.js'
import { useEffect, useState } from 'react'
import Menu from '../components/Menu.jsx'
import TracksGrouped from '../components/TracksGrouped.jsx'
import { useMenuActions, useStatus } from '../hooks.js'

const Playlist = () => {
  const { id: playlist_id } = useParams()

  const [playlist, setPlaylist] = useState({})
  const resetQueueAndPlay = useStore(state => state.resetQueueAndPlay)
  const { id, tracks = [], title = '' } = playlist
  const { isFavourite } = useStatus({ targetId: id, targetType: 'playlist' })
  const { handleFavourite, handleUnfavourite } = useMenuActions({
    targetId: id,
    targetType: 'playlist',
  })

  const fetchPlaylist = async () => {
    const result = await api.playlist({ id: playlist_id })
    setPlaylist(result)
  }

  useEffect(() => {
    fetchPlaylist()
  }, [])

  const handlePlayClick = ({ index }) => {
    resetQueueAndPlay({ tracks: playlist.tracks, index })
  }

  // const addTrackToLibrary = async ({ id }) => {
  //   await api.addTrackToLibrary({ id })
  //   setPlaylist({
  //     ...playlist,
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
  //   setPlaylist({
  //     ...playlist,
  //     tracks: tracks.map(t => {
  //       if (t.id === id) {
  //         return {
  //           ...t,
  //           isInLibrary: false,
  //         }
  //       }
  //       return t
  //     }),
  //   })
  // }

  // const addPlaylistToPlaylist = async ({ id, playlistId }) => {
  //   await api.addPlaylistToPlaylist({ id, playlistId })
  // }

  // const addTrackToPlaylist = async ({ id, playlistId }) => {
  //   await api.addTrackToPlaylist({ id, playlistId })
  // }

  // const navigateToAlbum = () => {
  //   navigate(`/album/${id}`)
  // }

  // const navigateToRecording = () => {
  //   navigate(`/recording/${id}`)
  // }

  // const favouritePlaylist = async ({ id }) => {
  //   await api.favouritePlaylist({ id })
  //   setPlaylist({
  //     ...playlist,
  //     isFavourite: true,
  //   })
  // }

  // const unfavouritePlaylist = async ({ id }) => {
  //   await api.unfavouritePlaylist({ id })
  //   setPlaylist({
  //     ...playlist,
  //     isFavourite: false,
  //   })
  // }

  // const favouriteTrack = async ({ id }) => {
  //   await api.favouriteTrack({ id })
  //   setPlaylist({
  //     ...playlist,
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
  //   setPlaylist({
  //     ...playlist,
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
  //   setPlaylist({
  //     ...playlist,
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
  //   setPlaylist({
  //     ...playlist,
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
  //   if (action === 'ADD_TO_LIBRARY' && type === 'track') addTrackToLibrary({ id })
  //   if (action === 'REMOVE_FROM_LIBRARY' && type === 'track') removeTrackFromLibrary({ id })
  //   if (action === 'ADD_TO_PLAYLIST' && type === 'playlist')
  //     addPlaylistToPlaylist({ id, playlistId })
  //   if (action === 'ADD_TO_PLAYLIST' && type === 'track') addTrackToPlaylist({ id, playlistId })
  //   if (action === 'TO_ALBUM') navigateToAlbum({ id })
  //   if (action === 'TO_RECORDING') navigateToRecording({ id })
  //   if (action === 'FAVOURITE' && type === 'playlist') favouritePlaylist({ id })
  //   if (action === 'UNFAVOURITE' && type === 'playlist') unfavouritePlaylist({ id })
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
          <button onClick={() => handlePlayClick({ index: 0 })}>▶ </button>
          {!isFavourite() && <button onClick={handleFavourite}>Favourite </button>}
          {!!isFavourite() && <button onClick={handleUnfavourite}>Unfavourite </button>}
          <Menu actions={['PLAYLIST', 'FAVOURITE']} targetId={id} targetType="playlist" />
        </div>
      </div>
      {/* 专辑曲目 */}
      <TracksGrouped tracks={tracks} onTrackPlay={handlePlayClick} />
    </div>
  )
}

export default Playlist
