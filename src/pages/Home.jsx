import { useNavigate } from 'react-router-dom'
import { useQuery } from '../hooks.js'
import { albums, libraryTracksAdd, libraryTracksRemove } from '../api.js'
import useStore from '../store.js'

const Home = () => {
  const { result = [], isLoading, error } = useQuery(albums)
  const libraryTrackIds = useStore(state => state.libraryTrackIds)
  const addTracksToLibrary = useStore(state => state.addTracksToLibrary)
  const removeTracksFromLibrary = useStore(state => state.removeTracksFromLibrary)

  const navigate = useNavigate()
  const handleAlbumClick = id => navigate(`/album/${id}`)

  if (isLoading) return 'Loading...'
  if (error) return 'Error'
  return (
    <div>
      {result?.map(album => (
        <div key={album.id} onClick={() => handleAlbumClick(album.id)}>
          {album.title}
          {!libraryTrackIds.get(album.id) && (
            <button onClick={() => addTracksToLibrary({ albumId: album.id })}>➕</button>
          )}
          {libraryTrackIds.get(album.id)?.size > 0 && (
            <button onClick={() => removeTracksFromLibrary({ albumId: album.id })}>➖</button>
          )}
        </div>
      ))}
    </div>
  )
}

export default Home
