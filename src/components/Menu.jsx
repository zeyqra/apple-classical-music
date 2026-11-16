import { useEffect, useState } from 'react'
import useStore from '../store'
import api from '../api'

const Menu = ({ hasPlay, navigate, targetType, target, onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('New Playlist ' + new Date().getTime())

  const createdPlaylists = useStore(state => state.createdPlaylists)
  const setCreatedPlaylist = useStore(state => state.setCreatedPlaylist)
  const hasSetCreatedPlaylist = useStore(state => state.hasSetCreatedPlaylist)
  const createPlaylist = useStore(state => state.createPlaylist)
  const playAlbumOrPlaylist = useStore(state => state.playAlbumOrPlaylist)
  const fetchAlbum = api.album
  const fetchPlaylist = api.playlist
  const addAlbumToLibrary = api.addAlbumToLibrary
  const removeAlbumFromLibrary = api.removeAlbumFromLibrary
  const addAlbumToPlaylist = api.addAlbumToPlaylist
  const addPlaylistToPlaylist = api.addPlaylistToPlaylist
  const favouriteAlbum = api.favouriteAlbum
  const unfavouriteAlbum = api.unfavouriteAlbum
  const favouritePlaylist = api.favouritePlaylist
  const unfavouritePlaylist = api.unfavouritePlaylist

  const fetchPlayTracks =
    targetType === 'album' ? fetchAlbum : targetType === 'playlist' ? fetchPlaylist : null
  const addToLibrary = targetType === 'album' ? addAlbumToLibrary : null
  const removeFromLibrary = targetType === 'album' ? removeAlbumFromLibrary : null
  const addToPlaylist =
    targetType === 'album'
      ? addAlbumToPlaylist
      : targetType === 'playlist'
        ? addPlaylistToPlaylist
        : null
  const favorite =
    targetType === 'album' ? favouriteAlbum : targetType === 'playlist' ? favouritePlaylist : null
  const unfavourite =
    targetType === 'album'
      ? unfavouriteAlbum
      : targetType === 'playlist'
        ? unfavouritePlaylist
        : null

  useEffect(() => {
    if (!hasSetCreatedPlaylist) {
      useStore.setState({ hasSetCreatedPlaylist: true })
      setCreatedPlaylist()
    }
  }, [])

  const handlePlay = async () => {
    playAlbumOrPlaylist({ queue: (await fetchPlayTracks).tracks })
  }
  const handleAddToLibrary = async () => {
    await addToLibrary({ id: target.id })
    onSuccess({ action: 'library', target })
  }
  const handleRemoveFromLibrary = async () => {
    await removeFromLibrary({ id: target.id })
    onSuccess({ action: 'library', target })
  }
  const handleCreatePlaylist = async () => {
    await createPlaylist({ title: newPlaylistTitle })
  }
  const handleAddToPlaylist = async playlistId => {
    await addToPlaylist({ id: target.id, playlistId })
  }
  const handleUnfavourite = async () => {
    await unfavourite({ id: target.id })
    onSuccess({ action: 'favourite', target })
  }
  const handleFavourite = async () => {
    await favorite({ id: target.id })
    onSuccess({ action: 'favourite', target })
  }

  return (
    <div>
      <button onClick={() => setIsOpen(prev => !prev)}>Menu</button>
      {isOpen && (
        <div>
          {hasPlay && <div onClick={handlePlay}>Play</div>}
          {targetType === 'album' && !target.isInLibrary && (
            <div onClick={handleAddToLibrary}>Add to Library</div>
          )}
          {targetType === 'album' && target.isInLibrary && (
            <div onClick={handleRemoveFromLibrary}>Remove from Library</div>
          )}

          <div>
            <div>Add to Playlist:</div>
            <div onClick={handleCreatePlaylist}>New Playlist</div>
            {createdPlaylists.map(p => (
              <div onClick={() => handleAddToPlaylist(p.id)} key={p.id}>
                {p.title}
              </div>
            ))}
          </div>
          {target.isFavourite && <div onClick={handleUnfavourite}>Unfavourite</div>}
          {!target.isFavourite && <div onClick={handleFavourite}>Favourite</div>}
        </div>
      )}
    </div>
  )
}

export default Menu
