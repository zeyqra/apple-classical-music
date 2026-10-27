import { useParams } from 'react-router-dom'
import { album, libraryTracksAdd, libraryTracksRemove } from '../api.js'
import { useQuery } from '../hooks.js'
import useStore from '../store.js'

const Album = () => {
  const { id } = useParams()
  const { result } = useQuery(album, { id })
  const { tracks = [], title = '' } = result || {}
  const trackIds = useStore(state => state.trackIds)
  const addTracksToLibrary = useStore(state => state.addTracksToLibrary)
  const removeTracksFromLibrary = useStore(state => state.removeTracksFromLibrary)

  const play = useStore(state => state.play)

  const handlePlayClick = index => {
    play(tracks, index)
  }

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
          <button
            onClick={() => addTracksToLibrary({ trackIds: tracks.map(tk => tk.id), albumId: id })}>
            ➕
          </button>
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
                    <button
                      onClick={() => addTracksToLibrary({ trackIds: [track.id], albumId: id })}>
                      ➕
                    </button>
                    <button
                      onClick={() =>
                        removeTracksFromLibrary({ trackIds: [track.id], albumId: id })
                      }>
                      ➖
                    </button>
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
