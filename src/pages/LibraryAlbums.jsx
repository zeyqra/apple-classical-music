import { useEffect } from 'react'
import { useAlbumSublist } from '../services/music'
import {  useNavigate } from 'react-router-dom'

const LibraryAlbums = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useAlbumSublist()
  // console.log('console: list', list)
  const albums = data?.pages.flatMap(page => page.data) ?? []
  
  console.log('console: albums', albums)
  const navigate = useNavigate()
  const handleAlbumClick = id => {
    navigate(`/album/${id}`)
  }


  return (
    // <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2">
    <div>
      {albums.length > 0 &&
        albums.map(({ picUrl, name, id, artists }) => (
          <div onClick={() => handleAlbumClick(id)} key={id}>
            {/* <img src={picUrl} alt={name} /> */}
            <div className="max-h-10 overflow-hidden text-ellipsis">{name}</div>
            {/* <div className="max-h-10 overflow-hidden text-ellipsis">{artists.map(a => a.name).join('/')}</div> */}
          </div>
        ))}
    </div>
  )
}

export default LibraryAlbums
