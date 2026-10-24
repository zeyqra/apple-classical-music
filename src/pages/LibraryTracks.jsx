import { useQuery } from '../hooks.js'
import { libraryTracksList } from '../api.js'

const LibraryTracks = () => {
  const { result, isLoading, error } = useQuery(libraryTracksList)
  return <div>{JSON.stringify(result)}</div>
}

export default LibraryTracks
