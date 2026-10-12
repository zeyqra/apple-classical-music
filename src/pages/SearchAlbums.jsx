import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSearch } from '../services/music'
import InfiniteAlbums from '../components/InfiniteAlbums'
import Loading from '../libs/Loading'
import ImgLazy from '../components/ImgLazy'

const SearchAlbums = () => {
  const [searchParams] = useSearchParams()
  const keywords = searchParams.get('keywords')
  const {
    data: searchResult,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useSearch({ keywords, type: 10, limit: 10, offset: 0 })
  const albums = searchResult?.pages?.flatMap(p => p?.result.albums) || []

  const navigate = useNavigate()
  const handleAlbumClick = id => navigate(`/album/${id}`)

  if (isLoading) return <Loading />

  return (
    <InfiniteAlbums
      list={albums}
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
          <div className="text-sm mt-1">
            <div className="line-clamp-2 wrap-break-word">{name}</div>
            <div className="line-clamp-2 wrap-break-word">{artists.map(a => a.name).join('/')}</div>
          </div>
        </div>
      )}
    />
  )
}

export default SearchAlbums
