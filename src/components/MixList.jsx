import { useEffect, useState } from 'react'
import api from '../api'
import Menu from './Menu'
import { useActions } from '../hooks'

const MixList = () => {
  const [mixList, setMixList] = useState([])
  const { handleFetchTracksPlay, handleNavigateTo } = useActions()

  const fetchMixList = async () => {
    setMixList(await api.mixlist())
  }

  useEffect(() => {
    fetchMixList()
  }, [])

  // const addAlbumToLibrary = async ({ id }) => {
  //   await api.addAlbumToLibrary({ id })
  //   setMixList(pre =>
  //     pre.map(item => {
  //       if (item.type === 'album' && id === item.id) {
  //         return {
  //           ...item,
  //           isInLibrary: true,
  //         }
  //       }
  //       return item
  //     })
  //   )
  // }
  // const removeAlbumFromLibrary = async ({ id }) => {
  //   await api.removeAlbumFromLibrary({ id })
  //   setMixList(pre =>
  //     pre.map(item => {
  //       if (item.type === 'album' && id === item.id) {
  //         return {
  //           ...item,
  //           isInLibrary: false,
  //         }
  //       }
  //       return item
  //     })
  //   )
  // }
  // const addAlbumToPlaylist = async ({ id, playlistId }) => {
  //   await api.addAlbumToPlaylist({ id, playlistId })
  // }
  // const addPlaylistToPlaylist = async ({ id, playlistId }) => {
  //   await api.addPlaylistToPlaylist({ id, playlistId })
  // }
  // const favouriteAlbum = async ({ id }) => {
  //   await api.favouriteAlbum({ id })
  //   setMixList(pre =>
  //     pre.map(item => {
  //       if (item.type === 'album' && id === item.id) {
  //         return {
  //           ...item,
  //           isFavourite: true,
  //         }
  //       }
  //       return item
  //     })
  //   )
  // }
  // const unfavouriteAlbum = async ({ id }) => {
  //   await api.unfavouriteAlbum({ id })
  //   setMixList(pre =>
  //     pre.map(item => {
  //       if (item.type === 'album' && id === item.id) {
  //         return {
  //           ...item,
  //           isFavourite: false,
  //         }
  //       }
  //       return item
  //     })
  //   )
  // }
  // const favouritePlaylist = async ({ id }) => {
  //   await api.favouritePlaylist({ id })
  //   setMixList(pre =>
  //     pre.map(item => {
  //       if (item.type === 'playlist' && id === item.id) {
  //         return {
  //           ...item,
  //           isFavourite: true,
  //         }
  //       }
  //       return item
  //     })
  //   )
  // }
  // const unfavouritePlaylist = async ({ id }) => {
  //   await api.unfavouritePlaylist({ id })
  //   setMixList(pre =>
  //     pre.map(item => {
  //       if (item.type === 'playlist' && id === item.id) {
  //         return {
  //           ...item,
  //           isFavourite: false,
  //         }
  //       }
  //       return item
  //     })
  //   )
  // }

  // const handleMenuClick = ({ type, id, action, playlistId }) => {
  //   if (action === 'PLAY' && type === 'album') fetchAlbumPlay({ id })
  //   if (action === 'PLAY' && type === 'playlist') fetchPlaylistPlay({ id })
  //   if (action === 'ADD_TO_LIBRARY') addAlbumToLibrary({ id })
  //   if (action === 'REMOVE_FROM_LIBRARY') removeAlbumFromLibrary({ id })
  //   if (action === 'ADD_TO_PLAYLIST' && type === 'album') addAlbumToPlaylist({ id, playlistId })
  //   if (action === 'ADD_TO_PLAYLIST' && type === 'playlist')
  //     addPlaylistToPlaylist({ id, playlistId })
  //   if (action === 'FAVOURITE' && type === 'album') favouriteAlbum({ id })
  //   if (action === 'UNFAVOURITE' && type === 'album') unfavouriteAlbum({ id })
  //   if (action === 'FAVOURITE' && type === 'playlist') favouritePlaylist({ id })
  //   if (action === 'UNFAVOURITE' && type === 'playlist') unfavouritePlaylist({ id })
  // }

  return (
    <div>
      {mixList.map(({ id, type, title }) => (
        <div key={id + '-' + type}>
          <span onClick={() => handleNavigateTo({ type: type, id: id })}>{title} </span>
          <button onClick={() => handleFetchTracksPlay({ id, type })}>▶ </button>
          <Menu
            actions={['PLAY', ...(type === 'album' ? ['LIBRARY'] : []), 'PLAYLIST', 'FAVOURITE']}
            target={{ id, type }}
          />
        </div>
      ))}
    </div>
  )
}

export default MixList
