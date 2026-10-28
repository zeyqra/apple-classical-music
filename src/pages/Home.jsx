import { useNavigate } from 'react-router-dom'
import { useQuery } from '../hooks.js'
import { albums, libraryTracksAdd, libraryTracksRemove } from '../api.js'

const Home = () => {
  const { result = [], isLoading, error } = useQuery(albums)

  const navigate = useNavigate()
  const handleAlbumClick = id => navigate(`/album/${id}`)

  if (isLoading) return 'Loading...'
  if (error) return 'Error'
  return (
    <div>
      {result?.map(album => (
        <div key={album.id} onClick={() => handleAlbumClick(album.id)}>
          {album.title}
          <button onClick={() => libraryTracksAdd({ albumId: album.id })}>➕</button>
          <button onClick={() => libraryTracksRemove({ albumId: album.id })}>➖</button>
        </div>
      ))}
    </div>
  )
}

export default Home
