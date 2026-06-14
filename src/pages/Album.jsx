import { useParams } from 'react-router-dom'
import { useAlbum } from '../services/music'
import { msToHms } from '../utils'
import useMusicStore from '../stores/music'

const Album = () => {
  const { id } = useParams()
  const { data, isLoading, error } = useAlbum({ id })
  const playAlbum = useMusicStore(state => state.playAlbum)
  const handlePlayClick = () => {
    const playlist = data?.songs.map(song => ({
      id: song.id,
      name: song.name,
      dt: song.dt,
      alPicUrl: song.al.picUrl,
      artists: song.ar.map(artist => artist.name).join('/'),
    }))
    playAlbum(playlist)
  }

  if (isLoading) return 'Loading...'
  if (error) return 'Error!'

  const { album, songs } = data
  return (
    <div>
      <div className="flex">
        <img className="w-65" src={album.picUrl} alt={album.name} />
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2>{album.name}</h2>
            <div>{album.artist.name}</div>
            <div>{`${album.type} · ${album.publishTime}`}</div>
          </div>
          <div className="flex gap-1">
            <button onClick={handlePlayClick}>Play</button>
            <button>+</button>
          </div>
        </div>
      </div>
      <ul>
        {songs.map((song, index) => (
          <li key={song.id} className="flex justify-between items-center">
            <div>
              <span>{index + 1}</span>
              <span>{song.name}</span>
            </div>
            <div>
              <span>{msToHms(song.dt)}</span>
              <span>...</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Album
