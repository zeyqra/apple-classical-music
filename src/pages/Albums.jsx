import { useQuery } from '../hooks/useQuery'
import { albums } from '../services/music'

const Albums = () => {
  const { result, isLoading, error } = useQuery(albums)

  return <div>{JSON.stringify(result)}</div>
}

export default Albums
