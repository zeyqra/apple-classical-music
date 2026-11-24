import { useState } from 'react'
import useStore from '../store'
import { useMenuActions, useStatus } from '../hooks'

const Menu = ({ actions, targetType, targetId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [xy, setXy] = useState({ x: 0, y: 0 })
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('Playlist ' + new Date().getTime())
  const createdPlaylists = useStore(state => state.createdPlaylists)

  const handleTriggerClick = e => {
    setXy({ x: e.clientX, y: e.clientY })
    setIsOpen(prev => !prev)
  }

  const { isInLibrary, isFavourite } = useStatus({ targetId, targetType })
  const {
    handlePlay,
    handleAddToLibrary,
    handleRemoveFromLibrary,
    handleCreatePlaylist,
    handleAddToPlaylist,
    handleToAlbum,
    handleToRecording,
    handleUnfavourite,
    handleFavourite,
  } = useMenuActions({ targetId, targetType })

  return (
    <div className="inline-block">
      <button onClick={handleTriggerClick}>menu</button>
      {isOpen && (
        <div className="fixed bg-white border-2" style={{ left: xy.x + 5, top: xy.y + 5 }}>
          {actions.map(action => {
            if (action === 'PLAY') return <div onClick={handlePlay}>Play</div>
            if (action === 'LIBRARY' && !isInLibrary())
              return <div onClick={handleAddToLibrary}>Add to Library</div>
            if (action === 'LIBRARY' && isInLibrary())
              return <div onClick={handleRemoveFromLibrary}>Remove from Library</div>
            if (action === 'PLAYLIST')
              return (
                <div>
                  <div>Add to Playlist:</div>
                  <div onClick={() => handleCreatePlaylist({ newPlaylistTitle })}>New Playlist</div>
                  {createdPlaylists.map(p => (
                    <div onClick={() => handleAddToPlaylist({ playlistId: p.id })} key={p.id}>
                      {p.title}
                    </div>
                  ))}
                </div>
              )
            if (action === 'TO_ALBUM') return <div onClick={handleToAlbum}>To Album</div>
            if (action === 'TO_RECORDING')
              return <div onClick={handleToRecording}>To Recording</div>
            if (action === 'FAVOURITE' && !isFavourite())
              return <div onClick={handleFavourite}>Favourite</div>
            if (action === 'FAVOURITE' && isFavourite())
              return <div onClick={handleUnfavourite}>Unfavourite</div>
          })}
        </div>
      )}
    </div>
  )
}

export default Menu
