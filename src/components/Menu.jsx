import { useEffect } from 'react'
import useStore from '../store'
import api from '../api'

const Menu = () => {
  const createdPlaylists = useStore(state => state.createdPlaylists)
  const setCreatedPlaylist = useStore(state => state.setCreatedPlaylist)
  const fetchAlbum = async () => api.album()
  const fetchPlaylist = async () => api.playlist()
  const addAlbumToLibrary = async () => api.addAlbumToLibrary()
  const removeAlbumFromLibrary = async () => api.removeAlbumFromLibrary()
  const createPlaylist = async () => await api.createPlaylist()
  const addAlbumToPlaylist = async () => await api.addAlbumToPlaylist()
  const addPlaylistToPlaylist = async () => await api.addPlaylistToPlaylist()
  const favouriteAlbum = async () => api.favouriteAlbum()
  const unfavouriteAlbum = async () => api.unfavouriteAlbum()
  const favouritePlaylist = async () => api.favouritePlaylist()
  const unfavouritePlaylist = async () => api.unfavouritePlaylist()

  useEffect(() => {
    if (createdPlaylists.length === 0) setCreatedPlaylist()
  })
  return <div>Menu</div>
}

export default Menu
