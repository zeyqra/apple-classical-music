import { CircleMinus } from 'lucide-react'
import useMusicStore from '../stores/music'
import ImgLazy from './ImgLazy'

const Queue = () => {
  const queue = useMusicStore(state => state.queue) // 默认 []
  const setQueue = useMusicStore(state => state.setQueue)
  const index = useMusicStore(state => state.index) // 默认 0

  const handleRemove = remveIndex => {
    setQueue(queue.filter((_, i) => i !== remveIndex))
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
        // conductor,
        // orchestra,
        // soloist,
        // singer,
      } = tracks[i - 1]
      tracksGrouped.push({
        recording: {
          id: recording_id,
          composer_id,
          composer_name,
          work_id,
          work_title,
          performers,
          // conductor,
          // orchestra,
          // soloist,
          // singer,
        },
        tracks: [...group],
      })
      group.length = 0
    }
    group.push(tracks[i])
  }
  return (
    <div className="h-full flex flex-col">
      <h2 className="font-bold sticky top-0 bg-white p-1 shrink-0">Queue</h2>
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
                  <p>{track.title}</p>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      {/* <div className="h-full space-y-0.5 p-1 overflow-y-auto flex-1">
        {queue.slice(index + 1).map((song, restIndex) => (
          <div
            key={song.id + ' ' + restIndex}
            className="relative group text-sm flex items-center gap-1 w-full">
            <ImgLazy className="w-8 h-8" src={`${song.alPicUrl}?param=180y180`} alt="song cover" />
            <div className="flex-1 overflow-hidden">
              <div className="whitespace-nowrap overflow-hidden text-ellipsis">{song.name}</div>
              <div className="whitespace-nowrap overflow-hidden text-ellipsis">{song.artists}</div>
            </div>
            <button
              className="hidden group-hover:block rounded-full absolute -top-0.5 -left-0.5"
              onClick={() => handleRemove(restIndex + (index + 1))}>
              <CircleMinus color="white" fill="red" size={16} />
            </button>
          </div>
        ))}
      </div> */}
    </div>
  )
}

export default Queue
