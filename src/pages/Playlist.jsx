import { useParams } from 'react-router-dom'
import api from '../api.js'
import { useEffect, useState } from 'react'
import Menu from '../components/Menu.jsx'
import TracksGrouped from '../components/TracksGrouped.jsx'
import { useActions, useStatus } from '../hooks.js'
import { usePlayer } from '../PlayerContext.jsx'

const Playlist = () => {
  const { id: playlist_id } = useParams()

  const [playlist, setPlaylist] = useState({})
  const { setQueuePlay } = usePlayer()
  const { id, tracks = [], title = '' } = playlist
  const { isFavourite } = useStatus({ id, type: 'playlist' })
  const { handleFavourite, handleUnfavourite } = useActions({ ...playlist, type: 'playlist' })

  const fetchPlaylist = async () => {
    const result = await api.playlist({ id: playlist_id })
    setPlaylist(result)
  }

  useEffect(() => {
    fetchPlaylist()
  }, [])

  const handlePlayClick = ({ index }) => {
    setQueuePlay({ queue: playlist.tracks, index })
  }

  return (
    <div>
      {/* 专辑信息 */}
      <div className="flex">
        <div>
          <div>{title}</div>
          <button onClick={() => handlePlayClick({ index: 0 })}>▶ </button>
          {!isFavourite({ id, type: 'playlist' }) && (
            <button onClick={() => handleFavourite({ id, type: 'playlist' })}>Favourite</button>
          )}
          {!!isFavourite({ id, type: 'playlist' }) && (
            <button onClick={() => handleUnfavourite({ id, type: 'playlist' })}>Unfavourite</button>
          )}
          <Menu actions={['PLAYLIST', 'FAVOURITE']} target={{ ...playlist, type: 'playlist' }} />
        </div>
      </div>
      {/* 专辑曲目 */}
      <TracksGrouped tracks={tracks} onTrackPlay={handlePlayClick} />
    </div>
  )
}

export default Playlist
