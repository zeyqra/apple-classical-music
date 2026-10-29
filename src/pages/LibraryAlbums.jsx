import { useQuery } from '../hooks.js'
import { libraryTracks } from '../api.js'
import useStore from '../store.js'

const LibraryAlbums = () => {
  const { result, refetch } = useQuery(libraryTracks)
  const play = useStore(state => state.play)

  const handlePlayClick = index => {
    play(tracks, index)
  }

  const tracks = result || []
  const tracksReverse = tracks.reverse()
  const albums = []
  for (let i = 0; i < tracksReverse.length; i++) {
    const { album_id, album_title } = tracksReverse[i]
    if (albums.find(al => album_id === al.id)) continue
    albums.push({ id: album_id, title: album_title })
  }
  return (
    <div>
      {albums.map(({ id, title }) => {
        return <div key={id}>{title}</div>
      })}
    </div>
  )
}

export default LibraryAlbums
