import { useParams } from 'react-router-dom'
import { album } from '../services/music'
import Loading from '../libs/Loading'

import { useQuery } from '../hooks/useQuery'

const Album = () => {
  const { id } = useParams()
  const {
    result = { title: '', rmovements: [], recordings: {} },
    isLoading,
    error,
  } = useQuery(album, { id })

  console.log('console: l', isLoading)
  if (isLoading) return <Loading />
  if (error) return 'Error'
  const rmovements = result?.rmovements || []
  const recordings = result?.recordings || {}
  const rmovementsGrouped = []
  const group = []
  for (let i = 0; i <= rmovements.length; i++) {
    if (i >= 1 && rmovements[i]?.recording_id !== rmovements[i - 1]?.recording_id) {
      rmovementsGrouped.push({
        recordingId: rmovements[i - 1].recording_id,
        rmovements: [...group],
      })
      group.length = 0
    }
    group.push(rmovements[i])
  }
  return (
    <div>
      {/* 专辑标题 */}
      <div>{result?.title}</div>
      {/* 专辑音轨 */}
      <div>
        {rmovementsGrouped.map(({ recordingId, rmovements }) => {
          return (
            // 录音组
            <div>
              {/* 录音标题 */}
              <div>
                <p>
                  {recordings[recordingId].composer_name} {recordings[recordingId].work_title}
                </p>
                <p>
                  {Object.entries(recordings[recordingId].performers)
                    .map(([role, pfs]) => pfs.map(pf => pf.name).join(' / '))
                    .join(' / ')}
                </p>
              </div>
              {/* 录音乐章 */}
              <div>
                {rmovements.map(rmm => (
                  <p>{rmm.title}</p>
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
