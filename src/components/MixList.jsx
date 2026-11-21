import { useEffect, useState } from 'react'
import api from '../api'
import Menu from './Menu'
import { useNavigate } from 'react-router-dom'
import useStore from '../store'

const MixList = () => {
  const [mixList, setMixList] = useState([])
  const resetQueueAndPlay = useStore(state => state.resetQueueAndPlay)

  const fetchMixList = async () => {
    setMixList(await api.mixlist())
  }

  useEffect(() => {
    fetchMixList()
  }, [])

  const fetchAlbumPlay = async ({ id }) => {
    resetQueueAndPlay({ tracks: (await api.album({ id })).tracks })
  }
  const fetchPlaylistPlay = async ({ id }) => {
    resetQueueAndPlay({ tracks: (await api.playlist({ id })).tracks })
  }
  const addAlbumToLibrary = async ({ id }) => {
    await api.addAlbumToLibrary({ id })
    setMixList(pre =>
      pre.map(item => {
        if (item.type === 'album' && id === item.id) {
          return {
            ...item,
            isInLibrary: true,
          }
        }
        return item
      })
    )
  }
  const removeAlbumFromLibrary = async ({ id }) => {
    await api.removeAlbumFromLibrary({ id })
    setMixList(pre =>
      pre.map(item => {
        if (item.type === 'album' && id === item.id) {
          return {
            ...item,
            isInLibrary: false,
          }
        }
        return item
      })
    )
  }
  const addAlbumToPlaylist = async ({ id, playlistId }) => {
    await api.addAlbumToPlaylist({ id, playlistId })
  }
  const addPlaylistToPlaylist = async ({ id, playlistId }) => {
    await api.addPlaylistToPlaylist({ id, playlistId })
  }
  const favouriteAlbum = async ({ id }) => {
    await api.favouriteAlbum({ id })
    setMixList(pre =>
      pre.map(item => {
        if (item.type === 'album' && id === item.id) {
          return {
            ...item,
            isFavourite: true,
          }
        }
        return item
      })
    )
  }
  const unfavouriteAlbum = async ({ id }) => {
    await api.unfavouriteAlbum({ id })
    setMixList(pre =>
      pre.map(item => {
        if (item.type === 'album' && id === item.id) {
          return {
            ...item,
            isFavourite: false,
          }
        }
        return item
      })
    )
  }
  const favouritePlaylist = async ({ id }) => {
    await api.favouritePlaylist({ id })
    setMixList(pre =>
      pre.map(item => {
        if (item.type === 'playlist' && id === item.id) {
          return {
            ...item,
            isFavourite: true,
          }
        }
        return item
      })
    )
  }
  const unfavouritePlaylist = async ({ id }) => {
    await api.unfavouritePlaylist({ id })
    setMixList(pre =>
      pre.map(item => {
        if (item.type === 'playlist' && id === item.id) {
          return {
            ...item,
            isFavourite: false,
          }
        }
        return item
      })
    )
  }

  const handleMenuClick = ({ type, id, action, playlistId }) => {
    if (action === 'PLAY' && type === 'album') fetchAlbumPlay({ id })
    if (action === 'PLAY' && type === 'playlist') fetchPlaylistPlay({ id })
    if (action === 'ADD_TO_LIBRARY') addAlbumToLibrary({ id })
    if (action === 'REMOVE_FROM_LIBRARY') removeAlbumFromLibrary({ id })
    if (action === 'ADD_TO_PLAYLIST' && type === 'album') addAlbumToPlaylist({ id, playlistId })
    if (action === 'ADD_TO_PLAYLIST' && type === 'playlist')
      addPlaylistToPlaylist({ id, playlistId })
    if (action === 'FAVOURITE' && type === 'album') favouriteAlbum({ id })
    if (action === 'UNFAVOURITE' && type === 'album') unfavouriteAlbum({ id })
    if (action === 'FAVOURITE' && type === 'playlist') favouritePlaylist({ id })
    if (action === 'UNFAVOURITE' && type === 'playlist') unfavouritePlaylist({ id })
  }

  const navigate = useNavigate()
  const handleNavigateClick = ({ type, id }) => {
    navigate(`/${type}/${id}`)
  }
  return (
    <div>
      {mixList.map(item => (
        <div key={item.id + '-' + item.type}>
          <span onClick={() => handleNavigateClick(item)}>{item.title} </span>
          <Menu
            actions={[
              'PLAY',
              ...(item.type === 'album' ? ['LIBRARY'] : []),
              'PLAYLIST',
              'FAVOURITE',
            ]}
            isInLibrary={item.isInLibrary}
            isFavourite={item.isFavourite}
            onMenuClick={({ action, playlistId }) =>
              handleMenuClick({ id: item.id, type: item.type, action, playlistId })
            }
          />
        </div>
      ))}
    </div>
  )
}

export default MixList
