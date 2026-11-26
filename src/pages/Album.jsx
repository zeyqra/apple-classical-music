import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../api.js'
import Menu from '../components/Menu.jsx'
import TracksGrouped from '../components/TracksGrouped.jsx'
import { useActions, useStatus } from '../hooks.js'
import { usePlayer } from '../PlayerContext.jsx'

const Album = () => {
  const { id: album_id } = useParams()

  const [album, setAlbum] = useState({})
  const { id, tracks = [], title = '', performers = [] } = album
  const { setQueuePlay } = usePlayer()
  const { isInLibrary } = useStatus()
  const { handleAddToLibrary } = useActions()

  const fetchAlbum = async () => {
    const result = await api.album({ id: album_id })
    setAlbum(result)
  }

  useEffect(() => {
    fetchAlbum()
  }, [])

  const handlePlayClick = ({ index }) => {
    setQueuePlay({ queue: album.tracks, index })
  }

  return (
    <div>
      {/* 专辑信息 */}
      <div className="flex">
        <div>
          <div>{title}</div>
          <div>{performers.map(p => p.name).join(' / ')}</div>
          <button onClick={() => handlePlayClick({ index: 0 })}>▶ </button>
          {!isInLibrary({ id, type: 'album' }) && (
            <button onClick={() => handleAddToLibrary({ id, type: 'album' })}>Add </button>
          )}
          <Menu
            actions={['LIBRARY', 'PLAYLIST', 'FAVOURITE']}
            target={{ ...album, type: 'album' }}
          />
        </div>
      </div>
      {/* 专辑曲目 */}
      <TracksGrouped tracks={tracks} hasToAlbum={false} onTrackPlay={handlePlayClick} />
    </div>
  )
}

export default Album
