import { useParams } from 'react-router-dom'
import api from '../api.js'
import useStore from '../store.js'
import { useEffect, useState } from 'react'
import Menu from '../components/Menu.jsx'
import TracksGrouped from '../components/TracksGrouped.jsx'

const Album = () => {
  const { id } = useParams()
  // const id = Number(rawId)

  const [album, setAlbum] = useState({})

  const fetchAlbum = async () => {
    const result = await api.album({ id })
    setAlbum(result)
  }

  useEffect(() => {
    fetchAlbum()
  }, [])

  const resetQueueAndPlay = useStore(state => state.resetQueueAndPlay)
  const handlePlayClick = ({ index }) => {
    resetQueueAndPlay({ tracks: album.tracks, index })
  }
  const handleAddToLibrary = async () => {
    await api.addAlbumToLibrary({ id: album.id })
    setAlbum({
      ...album,
      isInLibrary: true,
    })
  }
  const handleMenuSuccess = ({ action, target }) => {
    if (action === 'library') {
      setAlbum({
        ...album,
        isInLibrary: !album.isInLibrary,
      })
      //   setAlbum(pre =>
      //     pre.map(item => {
      //       if (item.type === target.type && target.id === item.id) {
      //         return {
      //           ...item,
      //           isInLibrary: !item.isInLibrary,
      //         }
      //       }
      //       return item
      //     })
      //   )
    } else if (action === 'favourite') {
      //   setAlbum(pre =>
      //     pre.map(item => {
      //       if (item.type === target.type && target.id === item.id) {
      //         return {
      //           ...item,
      //           isFavourite: !item.isFavourite,
      //         }
      //       }
      //       return item
      //     })
      //   )
    }
  }

  const { tracks = [], title = '', isInLibrary } = album
  return (
    <div>
      {/* 专辑信息 */}
      <div className="flex">
        <div>
          <div>{title}</div>
          <button onClick={() => handlePlayClick({ index: 0 })}>▶ </button>
          {!isInLibrary && <button onClick={handleAddToLibrary}>Add </button>}
          <Menu targetType="album" target={album} onSuccess={handleMenuSuccess} />
        </div>
      </div>
      {/* 专辑曲目 */}
      <TracksGrouped
        tracks={tracks}
        onTrackPlay={handlePlayClick}
        onMenuSuccess={handleMenuSuccess}
      />
    </div>
  )
}

export default Album
