import { useNavigate } from 'react-router-dom'
import { useQuery } from '../hooks.js'
import { album, albums, playlist, playlistOffical } from '../api.js'
import useStore from '../store.js'
import ActionsMenu from '../components/ActionsMenu.jsx'
import ScrollList from '../components/ScrollList.jsx'
import Image from '../components/Image.jsx'

const Home = () => {
  const { result = [] } = useQuery(albums)
  const { result: playlists = [] } = useQuery(playlistOffical)
  const play = useStore(state => state.play)

  const navigate = useNavigate()
  const handleAlbumClick = id => navigate(`/album/${id}`)
  const handlePlaylistClick = id => navigate(`/playlist/${id}`)

  const handleAlbumPlayClick = async id => {
    const { tracks } = await album({ id })
    play(tracks, 0)
  }
  const handlePlaylistPlayClick = async id => {
    const { tracks } = await playlist({ id })
    play(tracks, 0)
  }
  const albumList = [
    {
      id: 1,
      name: 'a',
      artist: 'a',
    },
    {
      id: 1,
      name: 'a',
      artist: 'a',
    },
    {
      id: 1,
      name: 'a',
      artist: 'a',
    },
    {
      id: 1,
      name: 'a',
      artist: 'a',
    },
    {
      id: 1,
      name: 'a',
      artist: 'a',
    },
    {
      id: 1,
      name: 'a',
      artist: 'a',
    },
    {
      id: 1,
      name: 'a',
      artist: 'a',
    },
    {
      id: 1,
      name: 'a',
      artist: 'a',
    },
  ]

  return (
    <div>
      专辑
      {result?.map(album => (
        <div key={album.id}>
          <span onClick={() => handleAlbumClick(album.id)}>{album.title}</span>
          <button onClick={() => handleAlbumPlayClick(album.id)}>▶</button>
          <ActionsMenu
            type="album"
            albumId={album.id}
            playFn={() => handleAlbumPlayClick(album.id)}
          />
        </div>
      ))}
      播放列表
      {playlists?.map(playlist => (
        <div key={playlist.id}>
          <span onClick={() => handlePlaylistClick(playlist.id)}>{playlist.title}</span>
          <button onClick={() => handlePlaylistPlayClick(playlist.id)}>▶</button>
          <ActionsMenu
            type="playlist"
            playlist={playlist}
            playFn={() => handlePlaylistPlayClick(playlist.id)}
          />
        </div>
      ))}
      <ScrollList
        title="专辑列表"
        titlePath={'/albums-list'}
        list={albumList}
        renderItem={(album, style) => (
          <div
            // style={style}
            // className="shrink-0 mx-0.5"
            key={album.id}
            onClick={() => navigate(`/album/${album.id}`)}>
            <div>
              <Image
                className="w-full aspect-square object-cover"
                src={`${album.blurPicUrl}?param=300y300`}
                alt={album.name}
              />
            </div>
            <div className="text-sm mt-1">
              <div className="line-clamp-2 wrap-break-word">{album.name}</div>
              <div className="line-clamp-2 wrap-break-word">{album.artist}</div>
            </div>
          </div>
        )}
      />
    </div>
  )
}

export default Home
