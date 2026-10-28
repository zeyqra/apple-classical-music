import { useParams } from 'react-router-dom'
import { album, libraryAlbumTrackIds, libraryTracksAdd, libraryTracksRemove } from '../api.js'
import { useQuery } from '../hooks.js'
import useStore from '../store.js'
import { useEffect, useState } from 'react'

const Album = () => {
  const { id } = useParams()
  const { result } = useQuery(album, { id })
  const { tracks = [], title = '' } = result || {}
  const [libraryTrackIds, setLibraryTrackIds] = useState(new Set())

  const play = useStore(state => state.play)

  const handlePlayClick = index => {
    play(tracks, index)
  }

  const handleAddTracksToLibrary = async trackIds => {
    await libraryTracksAdd({ trackIds, albumId: id })
    setLibraryTrackIds(new Set([...libraryTrackIds, ...trackIds]))
  }
  const handleRemoveTrackFromLibrary = async trackIds => {
    await libraryTracksRemove({ trackIds, albumId: id })
    setLibraryTrackIds(state => {
      const _libraryTrackIds = new Set(libraryTrackIds)
      trackIds.forEach(id => _libraryTrackIds.delete(id))
      return _libraryTrackIds
    })
  }

  useEffect(() => {
    const fetchLibAlTkIds = async () => {
      setLibraryTrackIds(new Set(await libraryAlbumTrackIds({ id })))
    }
    fetchLibAlTkIds()
  }, [])

  const tracksGrouped = []
  const group = []
  for (let i = 0; i <= tracks.length; i++) {
    const { recording_id } = tracks[i] || {}
    if (i >= 1 && recording_id !== tracks[i - 1]?.recording_id) {
      const { recording_id, composer_id, composer_name, work_id, work_title, performers } =
        tracks[i - 1]
      tracksGrouped.push({
        recording: {
          id: recording_id,
          composer_id,
          composer_name,
          work_id,
          work_title,
          performers,
        },
        tracks: [...group],
      })
      group.length = 0
    }
    group.push(tracks[i])
  }
  return (
    <div>
      {/* 专辑信息 */}
      <div className="flex">
        {/* <Image src={result?.cover_url} className="w-30 h-30"></Image> */}
        <div>
          <div>{title}</div>
          <button onClick={() => handlePlayClick(0)}>▶</button>
          {libraryTrackIds.size === 0 && (
            <button onClick={() => handleAddTracksToLibrary(tracks.map(t => t.id))}>➕</button>
          )}
          {libraryTrackIds.size > 0 && (
            <button onClick={() => handleRemoveTrackFromLibrary(tracks.map(t => t.id))}>➖</button>
          )}
        </div>
      </div>
      {/* 专辑音轨 */}
      <div>
        {tracksGrouped.map(({ recording, tracks }) => {
          return (
            // 录音组
            <div key={recording.id}>
              {/* 录音标题 */}
              <div>
                <p>
                  {recording.composer_name} {recording.work_title}
                </p>
                <p>
                  {Object.entries(recording.performers)
                    .filter(([_, pfs]) => pfs.length >= 1)
                    .map(([role, pfs]) => pfs.map(pf => pf.name).join(' / '))
                    .join(' / ')}
                </p>
              </div>
              {/* 录音乐章 */}
              <div>
                {tracks.map(track => (
                  <div key={track.id}>
                    <span onClick={() => handlePlayClick(track.track_number - 1)}>▶</span>
                    <span>{track.title}</span>
                    {!libraryTrackIds.has(track.id) && (
                      <button onClick={() => handleAddTracksToLibrary([track.id])}>➕</button>
                    )}
                    {libraryTrackIds.has(track.id) && (
                      <button onClick={() => handleRemoveTrackFromLibrary([track.id])}>➖</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Album
