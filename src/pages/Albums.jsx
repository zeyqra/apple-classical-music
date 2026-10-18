import { useNavigate } from 'react-router-dom'
import { useQuery } from '../hooks/useQuery'
import { albums } from '../services/music'

const Albums = () => {
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
        </div>
      ))}
    </div>
  )
}

export default Albums
