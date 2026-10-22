import { useEffect, useRef } from 'react'
import { useAlbumSublist, useRecordRecentAlbum } from '../services/music'
import { useNavigate } from 'react-router-dom'
import InfiniteAlbums from '../components/InfiniteAlbums'
import Loading from '../libs/Loading'
import Image from '../components/Image'

const RecentAlbums = () => {
  const { data, fetchNextPage, isFetchingNextPage, isLoading } = useRecordRecentAlbum({
    limit: 10,
    infinite: true,
  })
  const albums = (data?.pages.at(-1)?.data?.list || []).map(r => r.data)

  const hasMore = albums.length <= 40

  const navigate = useNavigate()
  const handleAlbumClick = id => navigate(`/album/${id}`)

  if (isLoading) return <Loading />

  return (
    <InfiniteAlbums
      list={albums}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasMore}
      isFetchingNextPage={isFetchingNextPage}
      renderItem={({ picUrl, name, id, artists }) => (
        <div onClick={() => handleAlbumClick(id)} key={id}>
          <Image
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
