import useMusicStore from '../stores/music'
import Image from './Image'

const Queue = () => {
  const queue = useMusicStore(state => state.queue) // 默认 []
  const setQueue = useMusicStore(state => state.setQueue)
  const index = useMusicStore(state => state.index) // 默认 0

  const handleRemove = track => {
    setQueue(queue.filter(q => q.track_number !== track.track_number))
  }

  const tracks = queue.slice(index + 1)
  const tracksGrouped = []
  const group = []
  for (let i = 0; i <= tracks.length; i++) {
    const { recording_id } = tracks[i] || {}
    if (i >= 1 && recording_id !== tracks[i - 1]?.recording_id) {
      const {
        id,
        title,
        recording_id,
        album_id,
        album_title,
        track_number,
        composer_id,
        composer_name,
        work_id,
        work_title,
        performers,
      } = tracks[i - 1]
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
    <div className="h-full flex flex-col">
      <div>
        {tracksGrouped.map(({ recording, tracks }) => {
          return (
            // 录音组
            <div>
              {/* 录音标题 */}
              <div>
                <div>
                  <p>{recording.composer_name}</p>
                  <p>{recording.work_title}</p>
                </div>
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
                  <div className="flex" key={track.track_number}>
                    <button onClick={() => handleRemove(track)}> - </button>
                    <p>{track.title}</p>
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

export default Queue
