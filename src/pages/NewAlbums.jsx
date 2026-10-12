import { useEffect, useRef } from 'react'
import { useAlbumNew, useAlbumSublist, useRecordRecentAlbum } from '../services/music'
import { useNavigate } from 'react-router-dom'
import InfiniteAlbums from '../components/InfiniteAlbums'
import Loading from '../libs/Loading'
import ImgLazy from '../components/ImgLazy'

const RecentAlbums = () => {
  const {
    data: albumNewData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useAlbumNew({ area: 'ALL', offset: 0, limit: 10, infinite: true })
  console.log('console: albumNewData', albumNewData)
  const albumsNew = albumNewData?.pages.flatMap(page => page.albums ?? []) ?? []

  const navigate = useNavigate()
  const handleAlbumClick = id => navigate(`/album/${id}`)

  if (isLoading) return <Loading />

  return (
    <InfiniteAlbums
      list={albumsNew}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      renderItem={({ picUrl, name, id, artists }) => (
        <div onClick={() => handleAlbumClick(id)} key={id}>
          <ImgLazy
            className="aspect-square w-full object-cover"
            src={`${picUrl}?param=300y300`}
            alt={name}
          />
          <div className="line-clamp-2 wrap-break-word">{name}</div>
          <div className="line-clamp-2 wrap-break-word">{artists.map(a => a.name).join('/')}</div>
        </div>
      )}
    />
  )
}

export default RecentAlbums
