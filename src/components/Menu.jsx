import { useState } from 'react'
import useStore from '../store'
import { useActions, useStatus } from '../hooks'

const Menu = ({ actions, target }) => {
  const { id, type, album_id, recording_id } = target
  const [isOpen, setIsOpen] = useState(false)
  const [xy, setXy] = useState({ x: 0, y: 0 })
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('Playlist ' + new Date().getTime())
  const createdPlaylists = useStore(state => state.createdPlaylists)

  const handleTriggerClick = e => {
    setXy({ x: e.clientX, y: e.clientY })
    setIsOpen(prev => !prev)
  }

  const { isInLibrary, isFavourite } = useStatus()
  const {
    handleFetchTracksPlay,
    handleAddToLibrary,
    handleRemoveFromLibrary,
    handleCreatePlaylist,
    handleAddToPlaylist,
    handleNavigateTo,
    handleUnfavourite,
    handleFavourite,
  } = useActions()

  return (
    <div className="inline-block">
      <button onClick={handleTriggerClick}>menu</button>
      {isOpen && (
        <div className="fixed bg-white border-2" style={{ left: xy.x + 5, top: xy.y + 5 }}>
          {actions.map(action => {
            if (action === 'PLAY')
              return <div onClick={() => handleFetchTracksPlay({ id, type })}>Play</div>
            if (action === 'LIBRARY' && !isInLibrary({ id, type }))
              return <div onClick={() => handleAddToLibrary({ id, type })}>Add to Library</div>
            if (action === 'LIBRARY' && isInLibrary({ id, type }))
              return (
                <div onClick={() => handleRemoveFromLibrary({ id, type })}>Remove from Library</div>
              )
            if (action === 'PLAYLIST')
              return (
                <div>
                  <div>Add to Playlist:</div>
                  <div onClick={() => handleCreatePlaylist({ newPlaylistTitle })}>New Playlist</div>
                  {createdPlaylists.map(p => (
                    <div
                      onClick={() => handleAddToPlaylist({ playlistId: p.id, id, type })}
                      key={p.id}>
                      {p.title}
                    </div>
                  ))}
                </div>
              )
            if (action === 'TO_ALBUM')
              return (
                <div onClick={() => handleNavigateTo({ id: album_id, type: 'album' })}>
                  To Album
                </div>
              )
            if (action === 'TO_RECORDING')
              return (
                <div onClick={() => handleNavigateTo({ id: recording_id, type: 'recording' })}>
                  To Recording
                </div>
              )
            if (action === 'FAVOURITE' && !isFavourite({ id, type }))
              return <div onClick={() => handleFavourite({ id, type })}>Favourite</div>
            if (action === 'FAVOURITE' && isFavourite({ id, type }))
              return <div onClick={() => handleUnfavourite({ id, type })}>Unfavourite</div>
          })}
        </div>
      )}
    </div>
  )
}

export default Menu
