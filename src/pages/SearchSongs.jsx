import { useSearchParams } from 'react-router-dom'
import { useSearch } from '../services/music'
import InfiniteSongs from '../components/InfiniteSongs'

const SearchSongs = () => {
  const [searchParams] = useSearchParams()
  const keywords = searchParams.get('keywords')
  const {
    data: searchResult,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearch({ keywords, type: 1, limit: 10, offset: 0 })
  const songs = searchResult?.pages?.flatMap(p => p?.result.songs) || []
  console.log('console: sngs', songs)

  return (
    <InfiniteSongs
      list={songs}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
    />
  )
}

export default SearchSongs
