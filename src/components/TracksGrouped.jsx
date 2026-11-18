import { tracksGroupByRecording } from '../utils'
import Menu from './Menu'

const TracksGrouped = ({ tracks: orgTracks, onTrackPlay, onMenuSuccess }) => {
  const tracksGrouped = tracksGroupByRecording(orgTracks)
  return (
    <div>
      {tracksGrouped.map(
        ({
          recording: { recording_id, composer_id, composer_name, work_id, work_title, performers },
          tracks,
        }) => {
          return (
            // 录音组
            <div key={tracks[0].id}>
              {/* 录音信息 */}
              <div className="flex">
                <div>
                  <div>
                    {composer_name}: {work_title}
                  </div>
                  <div>{performers.map(p => p.name).join(' / ')}</div>
                </div>
                <Menu targetType="recording" target={{ recording_id }} onSuccess={onMenuSuccess} />
              </div>

              {/* 曲目组 */}
              <div>
                {tracks.map(t => (
                  <div key={t.id}>
                    <span
                      onClick={() =>
                        onTrackPlay({ index: orgTracks.findIndex(tk => tk.id === t.id) })
                      }>
                      ▶
                    </span>
                    <span>{t.title} </span>
                    <Menu targetType="track" target={t} onSuccess={onMenuSuccess} />
                  </div>
                ))}
              </div>
            </div>
          )
        }
      )}
    </div>
  )
}

export default TracksGrouped
