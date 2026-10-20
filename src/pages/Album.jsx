import { useParams } from 'react-router-dom'
import { album } from '../services/music'
import Loading from '../libs/Loading'

import { useQuery } from '../hooks/useQuery'

const Album = () => {
  const { id } = useParams()
  const { result = { title: '', tracksGrouped: [] }, isLoading, error } = useQuery(album, { id })

  if (isLoading) return <Loading />
  if (error) return 'Error'

  const tracksGrouped = result?.tracksGrouped || []
  return (
    <div>
      {/* 专辑标题 */}
      <div>{result?.title}</div>
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
