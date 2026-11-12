import { useEffect, useState } from 'react'
import api from '../api'
import Menu from './Menu'

const AlbumPlaylistList = () => {
  const [mixList, setMixList] = useState([])

  const fetchMixList = async () => api.mixlist()

  useEffect(() => {
    fetchMixList()
  })
  return (
    <div>
      AlbumPlaylistList
      <Menu></Menu>
    </div>
  )
}

export default AlbumPlaylistList
