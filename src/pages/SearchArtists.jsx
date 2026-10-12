import { useSearchParams } from 'react-router-dom'
import { useSearch } from '../services/music'

const SearchAlblums = () => {
  const [searchParams] = useSearchParams()
  const keywords = searchParams.get('keywords')
  const {
    data: searchResult,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearch({ keywords, type: 10, limit: 10, offset: 0 })
  const { album, artist, song, playlist, user } = searchResult?.result || {}
  const songs = song?.songs || []
  const _songs = []

  return <div>SearchAlblums</div>
}

export default SearchAlblums
