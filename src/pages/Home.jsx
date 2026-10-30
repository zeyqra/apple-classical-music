import { useNavigate } from 'react-router-dom'
import { useQuery } from '../hooks.js'
import { album, albums } from '../api.js'
import useStore from '../store.js'
import DropMenu from '../components/DropMenu.jsx'

const Home = () => {
  const { result = [], isLoading, error } = useQuery(albums)
  const play = useStore(state => state.play)

  const navigate = useNavigate()
  const handleAlbumClick = id => navigate(`/album/${id}`)

  const handlePlayClick = async id => {
    const { tracks } = await album({ id })
    play(tracks, 0)
  }

  if (isLoading) return 'Loading...'
  if (error) return 'Error'
  return (
    <div>
      {result?.map(album => (
        <div key={album.id}>
          <div onClick={() => handleAlbumClick(album.id)}>{album.title}</div>
          <button onClick={() => handlePlayClick(album.id)}>▶</button>
          <DropMenu type="album" albumId={album.id} playFn={() => handlePlayClick(album.id)} />
        </div>
      ))}
    </div>
  )
}

export default Home
