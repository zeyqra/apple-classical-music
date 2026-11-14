import { useEffect, useState } from 'react'
import useStore from '../store'
import api from '../api'

const Menu = ({ items: { play, library, playlist, favourite }, type, id, onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('New Playlist ' + new Date().getTime())

  const createdPlaylists = useStore(state => state.createdPlaylists)
  const setCreatedPlaylist = useStore(state => state.setCreatedPlaylist)
  const createPlaylist = useStore(state => state.createPlaylist)
  const playAlbumOrPlaylist = useStore(state => state.playAlbumOrPlaylist)
  const fetchAlbum = async () => api.album()
  const fetchPlaylist = async () => api.playlist()
  const addAlbumToLibrary = async () => api.addAlbumToLibrary()
  const removeAlbumFromLibrary = async () => api.removeAlbumFromLibrary()
  const addAlbumToPlaylist = async () => await api.addAlbumToPlaylist()
  const addPlaylistToPlaylist = async () => await api.addPlaylistToPlaylist()
  const favouriteAlbum = async () => api.favouriteAlbum()
  const unfavouriteAlbum = async () => api.unfavouriteAlbum()
  const favouritePlaylist = async () => api.favouritePlaylist()
  const unfavouritePlaylist = async () => api.unfavouritePlaylist()

  const fetchPlayTracks = type === 'album' ? fetchAlbum : type === 'playlist' ? fetchPlaylist : null
  const addToLibrary = type === 'album' ? addAlbumToLibrary : null
  const removeFromLibrary = type === 'album' ? removeAlbumFromLibrary : null
  const addToPlaylist =
    type === 'album' ? addAlbumToPlaylist : type === 'playlist' ? addPlaylistToPlaylist : null
  const favorite =
    type === 'album' ? favouriteAlbum : type === 'playlist' ? favouritePlaylist : null
  const unfavourite =
    type === 'album' ? unfavouriteAlbum : type === 'playlist' ? unfavouritePlaylist : null

  useEffect(() => {
    if (createdPlaylists.length === 0) setCreatedPlaylist()
  })

  const handlePlay = async () => {
    playAlbumOrPlaylist({ queue: (await fetchPlayTracks).tracks })
  }
  const handleAddToLibrary = async () => {
    await addToLibrary({ id })
    onSuccess()
  }
  const handleRemoveFromLibrary = async () => {
    await removeFromLibrary(id)
  }
  const handleCreatePlaylist = async () => {
    await createPlaylist({ title: newPlaylistTitle })
  }
  const handleAddToPlaylist = async playlistId => {
    await addToPlaylist({ id, playlistId })
  }
  const handleUnfavourite = async () => {
    await unfavourite(id)
  }
  const handleFavourite = async () => {
    await favorite(id)
  }
  return (
    <div>
      <button onClick={() => setIsOpen(prev => !prev)}>Menu</button>
      {isOpen && (
        <div>
          {play && <div onClick={handlePlay}>Play</div>}
          {library && library.value && <div onClick={handleAddToLibrary}>Add to Library</div>}
          {library && !library.value && (
            <div onClick={handleRemoveFromLibrary}>Remove from Library</div>
          )}
          {playlist && (
            <div>
              <div>Add to Playlist:</div>
              <div onClick={handleCreatePlaylist}>New Playlist</div>
              {createdPlaylists.map(p => (
                <div onClick={() => handleAddToPlaylist(p.id)} key={p.id}>
                  {p.title}
                </div>
              ))}
            </div>
          )}
          {favourite && favourite.value && <div onClick={handleUnfavourite}>Unfavourite</div>}
          {favourite && !favourite.value && <div onClick={handleFavourite}>Favourite</div>}
        </div>
      )}
    </div>
  )
}

export default Menu
