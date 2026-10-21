import { useParams } from 'react-router-dom'
import { album } from '../services/music'
import Loading from '../libs/Loading'

import { useQuery } from '../hooks/useQuery'
import useMusicStore from '../stores/music'

const Album = () => {
  const { id } = useParams()
  const { result = { title: '', tracks: [] }, isLoading, error } = useQuery(album, { id })

  // const tracksGrouped = result?.tracksGrouped || []
  const playAlbum = useMusicStore(state => state.playAlbum)
  const handlePlayClick = index => {
    playAlbum(tracks, index)
  }

  if (isLoading) return <Loading />
  if (error) return 'Error'

  const tracks = result?.tracks || []
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
    <div>
      {/* 专辑标题 */}
      <div>{result?.title}</div>
      <button onClick={() => handlePlayClick(0)}>播放</button>
      {/* 专辑音轨 */}
      <div>
        {tracksGrouped.map(({ recording, tracks }) => {
          return (
            // 录音组
            <div>
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
                  <p>{track.title}</p>
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
