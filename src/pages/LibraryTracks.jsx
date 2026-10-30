import { useQuery } from '../hooks.js'
import { libraryTracks } from '../api.js'
import useStore from '../store.js'

const LibraryTracks = () => {
  const { result, refetch } = useQuery(libraryTracks)
  const play = useStore(state => state.play)
  const removeTracksFromLibrary = useStore(state => state.removeTracksFromLibrary)

  const handlePlayClick = index => {
    play(tracks, index)
  }

  const handleRemoveTrackFromLibrary = async data => {
    await removeTracksFromLibrary(data)
    refetch()
  }

  const tracks = result || []
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
      {tracksGrouped.map(({ recording, tracks }) => {
        return (
          // 录音组
          <div key={tracks[0].id}>
            {/* 录音标题 */}
            <div>
              <p>
                {recording.composer_name} {recording.work_title}
              </p>
              {/* <p>
                {Object.entries(recording.performers)
                  .filter(([_, pfs]) => pfs.length >= 1)
                  .map(([role, pfs]) => pfs.map(pf => pf.name).join(' / '))
                  .join(' / ')}
              </p> */}
            </div>
            {/* 录音乐章 */}
            <div>
              {tracks.map(track => (
                <div key={track.id}>
                  <span onClick={() => handlePlayClick(track.track_number - 1)}>▶</span>
                  <span>{track.title}</span>
                  <button
                    onClick={() =>
                      handleRemoveTrackFromLibrary({
                        trackIds: [track.id],
                        albumId: track.album_id,
                      })
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
  )
}

export default LibraryTracks
